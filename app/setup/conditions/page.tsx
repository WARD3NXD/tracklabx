'use client';
/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const trackConditions = ['Dry', 'Intermediate', 'Wet'] as const;
const weatherOptions = [
    { id: 'sunny', label: 'Clear / Sunny', icon: 'M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z' },
    { id: 'overcast', label: 'Overcast', icon: 'M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9z' },
    { id: 'rain', label: 'Rain Array', icon: 'M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25M16 20v-2M12 22v-2M8 20v-2' },
] as const;

export default function ConditionsPage() {
    const router = useRouter();
    const [condition, setCondition] = useState<string>('Dry');
    const [weather, setWeather] = useState<string>('sunny');
    const [ambientTemp, setAmbientTemp] = useState(25);
    const [trackTemp, setTrackTemp] = useState(35);

    useEffect(() => {
        const storedCond = localStorage.getItem('setup_condition');
        const storedWeath = localStorage.getItem('setup_weather');
        const storedAmb = localStorage.getItem('setup_ambient_temp');
        const storedTrack = localStorage.getItem('setup_track_temp');
        if (storedCond) setCondition(storedCond.charAt(0).toUpperCase() + storedCond.slice(1));
        if (storedWeath) setWeather(storedWeath);
        if (storedAmb) setAmbientTemp(Number(storedAmb));
        if (storedTrack) setTrackTemp(Number(storedTrack));
    }, []);

    const handleNext = () => {
        localStorage.setItem('setup_condition', condition.toLowerCase());
        localStorage.setItem('setup_weather', weather);
        localStorage.setItem('setup_ambient_temp', String(ambientTemp));
        localStorage.setItem('setup_track_temp', String(trackTemp));
        router.push('/setup/session');
    };

    return (
        <div className="min-h-screen bg-carbon text-snow relative overflow-hidden">
            <div className="absolute inset-0 noise-overlay" />

            <div className="max-w-[1400px] mx-auto px-4 py-24 relative z-10 pt-32">
                {/* Progress Stepper */}
                <div className="flex items-center gap-1 sm:gap-4 mb-12">
                    {['Track', 'Team', 'Conditions', 'Session'].map((step, i) => {
                        const isCurrent = i === 2;
                        const isPast = i < 2;

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
                            Set <span className="text-red">Telemetry</span> Conditions
                        </h1>
                        <p className="text-snow/50 font-jakarta max-w-xl">
                            Input the environmental parameters. Tyre pressures and cooling profiles require precision.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mb-32">
                    <div className="space-y-12">
                        {/* Track Condition Toggle */}
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="w-1.5 h-6 bg-red block" />
                                <h3 className="font-barlow font-bold text-2xl uppercase tracking-wider">Surface State</h3>
                            </div>
                            <div className="flex bg-gunmetal-deep border border-snow/10 p-1">
                                {trackConditions.map(c => (
                                    <button
                                        key={c}
                                        onClick={() => setCondition(c)}
                                        className={`flex-1 py-4 text-center font-barlow font-bold text-lg uppercase tracking-wider transition-all duration-300 ${condition === c ? 'bg-red text-white shadow-md' : 'text-snow/50 hover:text-snow hover:bg-snow/5'}`}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                        </motion.div>

                        {/* Weather Toggle */}
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="w-1.5 h-6 bg-red block" />
                                <h3 className="font-barlow font-bold text-2xl uppercase tracking-wider">Atmosphere</h3>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                {weatherOptions.map(w => (
                                    <button
                                        key={w.id}
                                        onClick={() => setWeather(w.id)}
                                        className={`p-6 border flex flex-col items-center justify-center gap-4 transition-all duration-300 ${weather === w.id ? 'bg-red-dim border-red text-red shadow-[0_0_20px_rgba(237,40,57,0.15)]' : 'bg-gunmetal-deep border-snow/5 text-snow/50 hover:border-snow/30 hover:text-snow'}`}
                                    >
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d={w.icon} />
                                        </svg>
                                        <span className="font-barlow font-bold tracking-wider uppercase text-sm">{w.label}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Temperature Sliders */}
                    <div className="space-y-12">
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                            <div className="flex items-center gap-3 mb-6">
                                <span className="w-1.5 h-6 bg-red block" />
                                <h3 className="font-barlow font-bold text-2xl uppercase tracking-wider">Thermal Data</h3>
                            </div>

                            <div className="bg-gunmetal-deep border border-snow/5 p-8 space-y-10">
                                {/* Ambient */}
                                <div className="relative group">
                                    <div className="flex justify-between items-end mb-4">
                                        <div>
                                            <label className="block text-xs font-mono tracking-widest uppercase text-snow/50 mb-1">Ambient Temp</label>
                                            <div className="font-barlow font-bold text-lg text-snow">AIR SENSOR</div>
                                        </div>
                                        <div className="text-4xl font-mono font-bold text-red tracking-tighter">{ambientTemp}°C</div>
                                    </div>
                                    <div className="relative pt-2">
                                        <input
                                            type="range"
                                            min={0} max={45} value={ambientTemp}
                                            onChange={e => setAmbientTemp(Number(e.target.value))}
                                            className="w-full h-1 bg-snow/10 appearance-none absolute top-4 z-10 cursor-pointer accent-red"
                                        />
                                        <div className="h-1 bg-red absolute top-4 left-0 z-0 transition-all duration-100 ease-out" style={{ width: `${(ambientTemp / 45) * 100}%` }} />
                                        {/* Tick marks */}
                                        <div className="flex justify-between mt-6 px-1">
                                            {[0, 15, 30, 45].map(tick => (
                                                <div key={tick} className="flex flex-col items-center">
                                                    <div className="w-px h-2 bg-snow/20 mb-1" />
                                                    <span className="text-[10px] font-mono text-snow/30">{tick}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="h-px bg-snow/10 mx-[-2rem]" />

                                {/* Track */}
                                <div className="relative group">
                                    <div className="flex justify-between items-end mb-4">
                                        <div>
                                            <label className="block text-xs font-mono tracking-widest uppercase text-snow/50 mb-1">Track Temp</label>
                                            <div className="font-barlow font-bold text-lg text-snow">TARMAC SENSOR</div>
                                        </div>
                                        <div className="text-4xl font-mono font-bold text-red tracking-tighter">{trackTemp}°C</div>
                                    </div>
                                    <div className="relative pt-2">
                                        <input
                                            type="range"
                                            min={0} max={60} value={trackTemp}
                                            onChange={e => setTrackTemp(Number(e.target.value))}
                                            className="w-full h-1 bg-snow/10 appearance-none absolute top-4 z-10 cursor-pointer accent-red"
                                        />
                                        <div className="h-1 bg-red absolute top-4 left-0 z-0 transition-all duration-100 ease-out" style={{ width: `${(trackTemp / 60) * 100}%` }} />
                                        <div className="flex justify-between mt-6 px-1">
                                            {[0, 20, 40, 60].map(tick => (
                                                <div key={tick} className="flex flex-col items-center">
                                                    <div className="w-px h-2 bg-snow/20 mb-1" />
                                                    <span className="text-[10px] font-mono text-snow/30">{tick}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Action Footer */}
                <div className="fixed bottom-0 left-0 w-full bg-gunmetal-deep/90 backdrop-blur-xl border-t border-snow/10 p-4 z-50">
                    <div className="max-w-[1400px] mx-auto flex justify-end">
                        <button
                            onClick={handleNext}
                            className="w-full sm:w-auto px-10 py-4 bg-red text-white font-barlow font-bold text-lg uppercase tracking-wider hover:bg-red-hot hover:shadow-[0_0_20px_rgba(237,40,57,0.3)] transition-all flex items-center justify-center gap-2"
                        >
                            Confirm Conditions
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
