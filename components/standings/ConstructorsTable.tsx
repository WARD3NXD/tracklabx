'use client';

import { motion } from 'framer-motion';

type ConstructorEntry = {
    position: number;
    constructorId: string;
    name: string;
    nationality: string;
    color: string;
    points: number;
    wins: number;
};

export default function ConstructorsTable({ constructors }: { constructors: ConstructorEntry[] }) {
    if (!constructors || constructors.length === 0) {
        return (
            <div className="py-12 text-center text-snow/50 font-jakarta">
                No constructor standings available for this season yet.
            </div>
        );
    }

    const maxPoints = Math.max(...constructors.map(c => c.points), 1); // Avoid division by zero

    return (
        <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[600px] text-left border-collapse">
                <thead>
                    <tr className="border-b border-grid-line text-snow/50 font-mono text-xs uppercase tracking-widest bg-carbon sticky top-0 z-10">
                        <th className="py-4 px-4 font-normal">Pos</th>
                        <th className="py-4 px-4 font-normal">Team</th>
                        <th className="py-4 px-4 font-normal text-center">Wins</th>
                        <th className="py-4 px-4 font-normal text-right">Points</th>
                    </tr>
                </thead>
                <tbody>
                    {constructors.map((team, i) => {
                        const isLeader = team.position === 1;
                        const progressPercentage = (team.points / maxPoints) * 100;

                        return (
                            <motion.tr
                                key={team.constructorId}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: i * 0.03 }}
                                className={`
                  group relative border-b border-grid-line/50 transition-colors duration-200
                  hover:bg-red/5 cursor-default
                `}
                            >
                                {/* Pos */}
                                <td className="py-4 px-4 w-16">
                                    <span className={`font-mono text-[1.1rem] ${isLeader ? 'text-red font-bold' : 'text-snow/50'}`}>
                                        {team.position}
                                    </span>
                                </td>

                                {/* Team & Points Bar */}
                                <td className="py-4 px-4">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-[4px] h-[24px] rounded-sm shrink-0"
                                                style={{ backgroundColor: team.color }}
                                            />
                                            <span className="font-barlow text-[1.2rem] font-bold text-snow uppercase tracking-wide transition-transform duration-200 group-hover:translate-x-1">
                                                {team.name}
                                            </span>
                                        </div>
                                    </div>
                                </td>

                                {/* Wins */}
                                <td className="py-4 px-4 text-center w-24">
                                    <span className="font-mono text-snow/70">{team.wins}</span>
                                </td>

                                {/* Points */}
                                <td className="py-4 px-4 text-right w-32 relative">
                                    <div className="flex flex-col items-end gap-1">
                                        <span className={`font-mono text-[1.2rem] ${isLeader ? 'text-red font-bold' : 'text-snow font-medium'}`}>
                                            {team.points}
                                        </span>
                                        {/* Progress Bar (Visualizing points gap) */}
                                        <div className="w-full h-[3px] bg-gunmetal-deep rounded-full overflow-hidden mt-1 opacity-50 group-hover:opacity-100 transition-opacity">
                                            <motion.div
                                                className="h-full rounded-full"
                                                style={{ backgroundColor: team.color }}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progressPercentage}%` }}
                                                transition={{ duration: 1, ease: 'easeOut', delay: i * 0.05 + 0.2 }}
                                            />
                                        </div>
                                    </div>
                                </td>
                            </motion.tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
