'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DriversTable from './DriversTable';
import ConstructorsTable from './ConstructorsTable';
import ProgressionChart from './ProgressionChart';
import RaceDrawer from './RaceDrawer';

type StandingsClientProps = {
    year: number;
    drivers: any[];
    constructors: any[];
    races: any[];
};

export default function StandingsClient({ year, drivers, constructors, races }: StandingsClientProps) {
    const [activeTab, setActiveTab] = useState<'drivers' | 'constructors'>('drivers');
    const [selectedRace, setSelectedRace] = useState<any | null>(null);

    const validYears = [2021, 2022, 2023, 2024, 2025, 2026];

    // Animation variants
    const fadeIn = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
    };

    return (
        <>
            <div className="bg-carbon text-snow min-h-screen pt-24 pb-32 px-4 selection:bg-red selection:text-white">
                <div className="max-w-[1200px] mx-auto">

                    {/* Header Section */}
                    <motion.header
                        initial="hidden"
                        animate="visible"
                        variants={{
                            visible: { transition: { staggerChildren: 0.1 } }
                        }}
                        className="mb-12"
                    >
                        <motion.div variants={fadeIn} className="text-red font-barlow font-bold text-sm tracking-[0.2em] mb-4 uppercase">
                            Championship Standings
                        </motion.div>

                        <motion.h1
                            variants={fadeIn}
                            className="font-barlow font-black text-6xl sm:text-7xl lg:text-[7rem] leading-[0.85] tracking-tight uppercase mb-12 drop-shadow-xl"
                        >
                            The Long <br /> <span className="text-red">Campaign.</span>
                        </motion.h1>

                        {/* Controls Row - Placed on the same line */}
                        <motion.div variants={fadeIn} className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-12">
                            {/* Year Selector */}
                            <div className="flex flex-wrap gap-2">
                                {validYears.map((y) => {
                                    const isActive = y === year;
                                    return (
                                        <button
                                            key={y}
                                            onClick={() => {
                                                if (!isActive) {
                                                    window.location.href = `/standings?year=${y}`;
                                                }
                                            }}
                                            className={`
                        px-6 py-2 font-mono text-sm uppercase tracking-widest border transition-colors
                        ${isActive
                                                    ? 'bg-red border-red text-white font-bold shadow-[0_0_15px_rgba(237,40,57,0.4)]'
                                                    : 'bg-gunmetal-deep border-grid-line text-snow/60 hover:text-snow hover:border-snow/30'}
                      `}
                                        >
                                            {y}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Tab Toggle */}
                            <div className="inline-flex bg-gunmetal-deep border border-grid-line p-1 rounded-full shrink-0">
                                {(['drivers', 'constructors'] as const).map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`
                      px-8 py-3 rounded-full font-barlow font-bold text-lg uppercase tracking-wide transition-all
                      ${activeTab === tab
                                                ? 'bg-carbon text-white shadow-md border border-snow/5'
                                                : 'text-snow/50 hover:text-snow'}
                    `}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </motion.header>

                    {/* 2026 Empty State */}
                    {year === 2026 && drivers.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="py-32 text-center border border-grid-line bg-gunmetal-deep/50 rounded-xl"
                        >
                            <h2 className="font-barlow font-bold text-3xl uppercase text-snow mb-4">Season Not Started Yet</h2>
                            <p className="font-jakarta text-snow/60 max-w-md mx-auto leading-relaxed">
                                The 2026 FIA Formula One World Championship starts in Bahrain. Check back after the opening round for updated standings.
                            </p>
                        </motion.div>
                    ) : (
                        <>
                            {/* Tables Section */}
                            <div className="mb-16 bg-gunmetal-deep rounded-xl border border-grid-line/50 p-6 shadow-2xl relative overflow-hidden">
                                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,250,250,1) 1px, transparent 1px)', backgroundSize: '100% 32px' }} />

                                <AnimatePresence mode="wait">
                                    {activeTab === 'drivers' ? (
                                        <motion.div
                                            key="drivers"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            transition={{ duration: 0.3 }}
                                            className="relative z-10"
                                        >
                                            <DriversTable drivers={drivers} />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="constructors"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            transition={{ duration: 0.3 }}
                                            className="relative z-10"
                                        >
                                            <ConstructorsTable constructors={constructors} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Season Progression Chart */}
                            <div className="mb-16">
                                <ProgressionChart races={races} type={activeTab} />
                            </div>

                            {/* Race Results List */}
                            <div className="bg-gunmetal-deep rounded-xl border border-grid-line/50 p-6">
                                <h3 className="font-barlow font-bold text-2xl text-snow tracking-wide uppercase mb-6 px-2">Round Results</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {races.map((race) => (
                                        <button
                                            key={race.round}
                                            onClick={() => setSelectedRace(race)}
                                            className="group flex flex-col items-start p-4 bg-carbon border border-grid-line hover:border-red/50 hover:bg-red/5 transition-all text-left rounded-lg"
                                        >
                                            <span className="font-mono text-xs text-snow/40 group-hover:text-red tracking-widest uppercase mb-2">
                                                Round {String(race.round).padStart(2, '0')}
                                            </span>
                                            <span className="font-barlow font-bold text-lg text-snow uppercase truncate w-full group-hover:text-red-hot">
                                                {race.country}
                                            </span>
                                            <span className="font-mono text-xs text-snow/30 mt-auto pt-4 border-t border-grid-line/50 w-full text-right uppercase">
                                                View Top 10 →
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                </div>
            </div>

            {/* Slide-out Drawer for Race Results */}
            <RaceDrawer
                isOpen={!!selectedRace}
                onClose={() => setSelectedRace(null)}
                race={selectedRace}
            />
        </>
    );
}
