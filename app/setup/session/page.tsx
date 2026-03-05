'use client';
/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const sessionTypes = [
    { id: 'race', label: 'Race', description: 'Full race distance balance. Optimized for tyre wear and heavy fuel loads.', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { id: 'quali', label: 'Qualifying', description: 'One-lap pace. Maximum grip, zero compromises on fuel or wear.', icon: 'M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' },
    { id: 'fp1', label: 'Practice 1', description: 'Initial baseline setup. Conservative aero and suspension.', icon: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z' },
    { id: 'fp2', label: 'Practice 2', description: 'Race simulation focus. Gathering long-run telemetry data.', icon: 'M2 12h4l2-9 5 18 3-9h6' },
    { id: 'fp3', label: 'Practice 3', description: 'Final qualifying simulations. Dialing in the optimal balance.', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
];

export default function SessionSelectionPage() {
    const router = useRouter();
    const [selectedSession, setSelectedSession] = useState('');

    useEffect(() => {
        const stored = localStorage.getItem('setup_session');
        if (stored) setSelectedSession(stored);
    }, []);

    const handleNext = () => {
        if (selectedSession) {
            localStorage.setItem('setup_session', selectedSession);
            router.push('/setup/results');
        }
    };

    return (
        <div className="min-h-screen bg-carbon text-snow relative overflow-hidden">
            <div className="absolute inset-0 noise-overlay" />

            <div className="max-w-[1400px] mx-auto px-4 py-24 relative z-10 pt-32">
                {/* Progress Stepper */}
                <div className="flex items-center gap-1 sm:gap-4 mb-12">
                    {['Track', 'Team', 'Conditions', 'Session'].map((step, i) => {
                        const isCurrent = i === 3;
                        const isPast = i < 3;

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

                <div className="mb-16">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-5xl sm:text-7xl font-barlow font-black uppercase tracking-tight leading-none mb-2">
                            Select <span className="text-red">Session</span>
                        </h1>
                        <p className="text-snow/50 font-jakarta max-w-xl">
                            Isolate telemetry data optimized for specific session environments.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-32 max-w-6xl">
                    {sessionTypes.map((session, i) => {
                        const isSelected = selectedSession === session.id;

                        return (
                            <motion.button
                                key={session.id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                onClick={() => setSelectedSession(session.id)}
                                className={`text-left p-8 transition-all duration-300 relative group overflow-hidden border min-h-[200px] flex flex-col justify-between ${isSelected
                                    ? 'bg-red-dim border-red shadow-[0_0_30px_rgba(237,40,57,0.15)] z-10'
                                    : 'bg-gunmetal-deep border-snow/5 hover:border-snow/30'
                                    }`}
                            >
                                {/* Diagonal highlight on select */}
                                {isSelected && (
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_top_right,_rgba(237,40,57,0.3)_0%,_transparent_70%)] pointer-events-none" />
                                )}

                                <div>
                                    <div className={`w-12 h-12 rounded-sm border flex items-center justify-center mb-6 transition-colors ${isSelected ? 'border-red text-red bg-red/10' : 'border-snow/10 text-snow/50 group-hover:text-snow group-hover:border-snow/30'}`}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d={session.icon} />
                                        </svg>
                                    </div>
                                    <h3 className="font-barlow font-bold text-3xl uppercase tracking-wider mb-2">{session.label}</h3>
                                    <p className="text-sm font-jakarta text-snow/50 leading-relaxed">{session.description}</p>
                                </div>

                                {isSelected && (
                                    <div className="absolute right-4 bottom-4 w-6 h-6 rounded-full bg-red flex items-center justify-center text-white">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                                    </div>
                                )}
                            </motion.button>
                        );
                    })}
                </div>

                {/* Action Footer */}
                <div className="fixed bottom-0 left-0 w-full bg-gunmetal-deep/90 backdrop-blur-xl border-t border-snow/10 p-4 z-50">
                    <div className="max-w-[1400px] mx-auto flex justify-end">
                        <button
                            onClick={handleNext}
                            disabled={!selectedSession}
                            className="w-full sm:w-auto px-12 py-5 bg-red text-white font-barlow font-black text-xl uppercase tracking-widest hover:bg-red-hot hover:shadow-[0_0_30px_rgba(237,40,57,0.4)] transition-all flex items-center justify-center gap-3 disabled:opacity-30 disabled:cursor-not-allowed group"
                        >
                            <span className="relative z-10">Access Telemetry</span>
                            <div className="relative z-10 w-8 h-px bg-white group-hover:w-12 transition-all duration-300" />
                            <svg className="relative z-10" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
