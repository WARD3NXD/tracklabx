'use client';

import { motion } from 'framer-motion';

type DriverEntry = {
    position: number;
    driverId: string;
    driverCode: string;
    firstName: string;
    lastName: string;
    nationality: string;
    teamId: string;
    teamName: string;
    teamColor: string;
    points: number;
    wins: number;
};

export default function DriversTable({ drivers }: { drivers: DriverEntry[] }) {
    if (!drivers || drivers.length === 0) {
        return (
            <div className="py-12 text-center text-snow/50 font-jakarta">
                No driver standings available for this season yet.
            </div>
        );
    }

    return (
        <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[600px] text-left border-collapse">
                <thead>
                    <tr className="border-b border-snow/[0.06] text-snow/70 bg-snowwhite font-mono text-xs uppercase tracking-widest bg-carbon sticky top-0 z-10">
                        <th className="py-4 px-4 font-normal">Pos</th>
                        <th className="py-4 px-4 font-normal">Driver</th>
                        <th className="py-4 px-4 font-normal">Team</th>
                        <th className="py-4 px-4 font-normal text-center">Wins</th>
                        <th className="py-4 px-4 font-normal text-right">Points</th>
                    </tr>
                </thead>
                <tbody>
                    {drivers.map((driver, i) => {
                        const isLeader = driver.position === 1;

                        return (
                            <motion.tr
                                key={driver.driverId}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: i * 0.03 }}
                                className={`
                  group relative transition-colors duration-200
                  hover:bg-snow/[0.04] cursor-default
                  ${isLeader ? 'bg-red/[0.06] border-l-2 border-l-red' : ''}
                `}
                            >
                                {/* Pos */}
                                <td className="py-4 px-4">
                                    <span className={`font-mono text-[1.1rem] ${isLeader ? 'text-red font-bold' : 'text-snow/50'}`}>
                                        {driver.position}
                                    </span>
                                </td>

                                {/* Driver */}
                                <td className="py-4 px-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-[10px] h-[10px] rounded-full shrink-0"
                                            style={{ backgroundColor: driver.teamColor }}
                                        />
                                        <div className="font-barlow text-[1.1rem] tracking-wide text-snow transition-transform duration-200 group-hover:translate-x-1 uppercase">
                                            <span className="opacity-70 font-medium mr-1">{driver.firstName}</span>
                                            <span className="font-bold">{driver.lastName}</span>
                                        </div>
                                    </div>
                                </td>

                                {/* Team */}
                                <td className="py-4 px-4">
                                    <span className="font-jakarta text-[0.8rem] text-snow/60 dropdown-shadow uppercase tracking-wider">
                                        {driver.teamName}
                                    </span>
                                </td>

                                {/* Wins */}
                                <td className="py-4 px-4 text-center">
                                    <span className="font-mono text-snow/70">{driver.wins}</span>
                                </td>

                                {/* Points */}
                                <td className="py-4 px-4 text-right">
                                    <span className={`font-mono text-[1.2rem] ${isLeader ? 'text-red font-bold' : 'text-snow font-medium'}`}>
                                        {driver.points}
                                    </span>
                                </td>
                            </motion.tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
