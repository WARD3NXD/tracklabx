'use client';
/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { teams } from '@/lib/data/teams';
import { Footer } from '@/components/layout/Footer';

export default function TeamSelectionPage() {
    const router = useRouter();
    const [selectedTeam, setSelectedTeam] = useState('');

    useEffect(() => {
        const stored = localStorage.getItem('setup_team');
        if (stored) setSelectedTeam(stored);
    }, []);

    const handleNext = () => {
        localStorage.setItem('setup_team', selectedTeam);
        router.push('/setup/conditions');
    };

    const handleSkip = () => {
        localStorage.setItem('setup_team', '');
        router.push('/setup/conditions');
    };

    return (
        <div className="min-h-screen bg-carbon text-snow relative overflow-hidden">
            <div className="absolute inset-0 noise-overlay" />

            <div className="max-w-[1400px] mx-auto px-4 py-24 relative z-10 pt-32">
                {/* Progress Stepper */}
                <div className="flex items-center gap-1 sm:gap-4 mb-12">
                    {['Track', 'Team', 'Conditions', 'Session'].map((step, i) => {
                        const isCurrent = i === 1;
                        const isPast = i < 1;

                        return (
                            <div key={step} className={`flex items-center gap-1 sm:gap-4 flex-1 ${isCurrent || isPast ? 'opacity-100' : 'opacity-30'}`}>
                                <div className="flex flex-col gap-1 w-full">
                                    <div className={`h-1 w-full ${isCurrent || isPast ? 'bg-red' : 'bg-snow/10'} rounded-none`} />
                                    <span className="text-[10px] font-mono tracking-widest uppercase font-bold">{step}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="flex justify-between items-end mb-12">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-5xl sm:text-7xl font-barlow font-black uppercase tracking-tight leading-none mb-2">
                            Select <span className="text-red">Constructor</span>
                        </h1>
                        <p className="text-snow/50 font-jakarta max-w-xl">
                            Filter setups specifically tailored to the aero and hybrid characteristics of your chosen chassis.
                        </p>
                    </motion.div>
                </div>

                {/* Team Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-24">
                    {teams.map((team, i) => {
                        const isSelected = selectedTeam === team.id;
                        return (
                            <motion.button
                                key={team.id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                onClick={() => setSelectedTeam(team.id)}
                                className={`text-left p-6 transition-all duration-300 relative group overflow-hidden border bg-gunmetal-deep min-h-[160px] flex flex-col ${isSelected
                                    ? 'border-transparent shadow-2xl scale-[1.02] z-10'
                                    : 'border-snow/5 hover:border-snower/30'
                                    }`}
                                style={isSelected ? {
                                    boxShadow: `0 0 40px ${team.color}25`,
                                    borderColor: team.color,
                                } : undefined}
                            >
                                {/* Team Color Edge Line */}
                                <div
                                    className="absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-300"
                                    style={{ backgroundColor: team.color, opacity: isSelected ? 1 : 0.4 }}
                                />

                                <div className="absolute right-0 top-0 p-4 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                                    <svg viewBox="0 0 100 100" className="w-24 h-24" fill="currentColor">
                                        <path d="M 10 10 L 90 50 L 10 90 Z" />
                                    </svg>
                                </div>

                                <div className="pl-2 flex-grow flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <div className="text-[10px] font-mono tracking-widest uppercase text-snow/40 mb-2">Constructor</div>
                                        {isSelected && (
                                            <div className="w-5 h-5 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: team.color }}>
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="font-barlow font-bold text-2xl uppercase leading-none">{team.name}</h3>
                                </div>
                            </motion.button>
                        );
                    })}
                </div>

                {/* Action Footer */}
                <div className="fixed bottom-0 left-0 w-full bg-gunmetal-deep/90 backdrop-blur-xl border-t border-snow/10 p-4 z-50">
                    <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                        <button
                            onClick={handleSkip}
                            className="w-full sm:w-auto px-8 py-4 border border-snow/20 text-snow/60 font-barlow font-bold text-lg uppercase tracking-wider hover:border-snow/40 hover:text-snow transition-all"
                        >
                            Skip Selection
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={!selectedTeam}
                            className="w-full sm:w-auto px-10 py-4 bg-red text-white font-barlow font-bold text-lg uppercase tracking-wider hover:bg-red-hot hover:shadow-[0_0_20px_rgba(237,40,57,0.3)] transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            Confirm Constructor
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
