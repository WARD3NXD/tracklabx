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
                            <div className="inline-flex gap-1">
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
                        relative px-5 py-3 font-mono text-sm uppercase tracking-widest transition-all duration-300
                        ${isActive
                                                    ? 'text-red font-bold'
                                                    : 'text-snow/30 hover:text-snow/60'}
                      `}
                                        >
                                            {y}
                                            {isActive && (
                                                <motion.div
                                                    layoutId="year-indicator"
                                                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-red rounded-full"
                                                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                                />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Tab Toggle */}
                            <div className="inline-flex gap-1 shrink-0">
                                {(['drivers', 'constructors'] as const).map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`
                      relative px-6 py-3 font-barlow font-bold text-base uppercase tracking-[0.15em] transition-all duration-300
                      ${activeTab === tab
                                                ? 'text-red'
                                                : 'text-snow/30 hover:text-snow/60'}
                    `}
                                    >
                                        {tab}
                                        {activeTab === tab && (
                                            <motion.div
                                                layoutId="tab-indicator"
                                                className="absolute bottom-0 left-0 right-0 h-[2px] bg-red rounded-full"
                                                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </motion.header>

                    {/* Empty State */}
                    {drivers.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="py-32 text-center bg-gunmetal-deep/40 rounded-2xl backdrop-blur-sm"
                        >
                            <h2 className="font-barlow font-bold text-3xl uppercase text-snow mb-4">No Standings Data Yet</h2>
                            <p className="font-jakarta text-snow/60 max-w-md mx-auto leading-relaxed">
                                The {year} season standings will appear here once race results are available. Check back after the opening round.
                            </p>
                        </motion.div>
                    ) : (
                        <>
                            {/* Tables Section */}
                            <div className="mb-16 bg-gunmetal-deep rounded-xl shadow-2xl relative overflow-hidden">

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
                            <div className="bg-gunmetal-deep rounded-xl p-8 shadow-xl">
                                <h3 className="font-barlow font-bold text-2xl text-snow tracking-wide uppercase mb-6 px-2">Round Results</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                    {races.map((race) => (
                                        <button
                                            key={race.round}
                                            onClick={() => setSelectedRace(race)}
                                            className="group flex flex-col items-start p-5 bg-carbon/40 hover:bg-red/[0.08] transition-all text-left rounded-xl shadow-sm hover:shadow-red/10"
                                        >
                                            <span className="font-mono text-xs text-snow/40 group-hover:text-red tracking-widest uppercase mb-2">
                                                Round {String(race.round).padStart(2, '0')}
                                            </span>
                                            <span className="font-barlow font-bold text-lg text-snow uppercase truncate w-full group-hover:text-red-hot">
                                                {race.country}
                                            </span>
                                            <span className="font-mono text-xs text-snow/20 mt-auto pt-4 w-full text-right uppercase group-hover:text-red/40 transition-colors">
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
