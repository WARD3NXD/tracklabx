'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { TEAM_COLORS } from '@/lib/teamColors';

type RaceDetails = {
    round: number;
    raceName: string;
    circuit: string;
    country: string;
    date: string;
    results: {
        position: number;
        driverCode: string;
        teamId: string;
        points: number;
        status: string;
        fastestLap: boolean;
    }[];
};

type RaceDrawerProps = {
    isOpen: boolean;
    onClose: () => void;
    race: RaceDetails | null;
};

export default function RaceDrawer({ isOpen, onClose, race }: RaceDrawerProps) {
    // Format the date if we have one
    const dateFormatted = race?.date
        ? new Date(race.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        : '';

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-carbon/80 backdrop-blur-sm z-40"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full sm:w-[500px] bg-gunmetal-deep border-l border-red/20 z-50 shadow-2xl overflow-y-auto"
                    >
                        {race ? (
                            <div className="p-8 flex flex-col min-h-full relative">

                                {/* Close Button */}
                                <button
                                    onClick={onClose}
                                    className="absolute top-6 right-6 text-snow/50 hover:text-red transition-colors p-2"
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                                </button>

                                {/* Header */}
                                <div className="mb-12 border-b border-grid-line pb-8">
                                    <div className="text-red font-mono text-xs uppercase tracking-[0.2em] mb-3">Round {String(race.round).padStart(2, '0')}</div>
                                    <h2 className="text-4xl font-barlow font-black text-snow uppercase tracking-tight leading-none mb-3">{race.raceName}</h2>
                                    <div className="flex items-center gap-2 text-snow/60 font-jakarta text-sm">
                                        <span className="truncate">{race.circuit}</span>
                                        <span className="text-red/50 mx-1">·</span>
                                        <span className="font-mono">{dateFormatted}</span>
                                    </div>
                                </div>

                                {/* Results List */}
                                <div className="flex-1">
                                    {!race.results || race.results.length === 0 ? (
                                        <div className="text-center text-snow/50 font-jakarta py-12">
                                            No results available for this round yet.
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {race.results.map((result, i) => {
                                                const isWinner = result.position === 1;
                                                const isFinished = result.status === 'Finished' || result.status.includes('+');
                                                const teamColor = TEAM_COLORS[result.teamId] ?? '#888';

                                                return (
                                                    <motion.div
                                                        key={`${race.round}-${result.driverCode}`}
                                                        initial={{ opacity: 0, x: 20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: i * 0.05 }}
                                                        className={`flex items-center justify-between p-4 rounded-lg border ${isWinner ? 'bg-red/5 border-red/30' : 'bg-carbon border-transparent shrink-0'
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <span className={`font-mono w-6 ${isWinner ? 'text-red font-bold text-lg' : 'text-snow/50 text-sm'}`}>
                                                                P{result.position}
                                                            </span>

                                                            <div className="w-[4px] h-[20px] rounded-sm" style={{ backgroundColor: teamColor }} />

                                                            <div>
                                                                <div className="font-barlow font-bold text-lg text-snow uppercase flex items-center gap-2">
                                                                    {result.driverCode}
                                                                    {result.fastestLap && (
                                                                        <span className="text-red text-xs drop-shadow-[0_0_8px_rgba(237,40,57,0.8)]" title="Fastest Lap">★</span>
                                                                    )}
                                                                </div>
                                                                <div className={`font-mono text-xs uppercase ${isFinished ? 'text-snow/30' : 'text-red/70'}`}>
                                                                    {isFinished ? result.teamId.replace('_', ' ') : result.status}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="text-right">
                                                            <span className={`font-mono font-bold ${isWinner ? 'text-red text-lg' : 'text-snow text-base'}`}>
                                                                {result.points} <span className="text-xs font-normal text-snow/40 ml-1">pts</span>
                                                            </span>
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* Footer close trigger */}
                                <div className="mt-8 pt-8 border-t border-grid-line text-center">
                                    <button onClick={onClose} className="font-mono text-xs text-snow/40 hover:text-white uppercase tracking-widest transition-colors">
                                        [ Close ]
                                    </button>
                                </div>
                            </div>
                        ) : null}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
