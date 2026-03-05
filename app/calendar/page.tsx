'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { calendar2025, calendar2026, getRaceStatus } from '@/lib/data/calendar';
import { timezones, formatSessionTime, formatSessionDate, getFlagEmoji } from '@/lib/utils';
import { Footer } from '@/components/layout/Footer';
import { getTrackSvg } from '@/lib/data/track-layouts';

const statusConfig = {
    completed: { bg: 'bg-gunmetal-deep border-snow/10', badge: 'text-snow/40 border-snow/10', label: 'COMPLETED', dot: 'bg-snow/20' },
    live: { bg: 'bg-red-dim border-red shadow-[0_0_20px_rgba(237,40,57,0.15)]', badge: 'text-red border-red/30 bg-red/10', label: 'LIVE', dot: 'bg-red animate-pulse' },
    upcoming: { bg: 'bg-gunmetal border-snow/5', badge: 'text-[#27F4D2] border-[#27F4D2]/30 bg-[#27F4D2]/10', label: 'UPCOMING', dot: 'bg-[#27F4D2]' },
};

export default function CalendarPage() {
    const [year, setYear] = useState<2025 | 2026>(2026);
    const [timezone, setTimezone] = useState('UTC');
    const [use24h, setUse24h] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');

    const calendarData = year === 2026 ? calendar2026 : calendar2025;

    return (
        <div className="bg-carbon text-snow min-h-screen overflow-hidden relative">
            <div className="absolute inset-0 noise-overlay" />
            <div className="absolute top-0 left-0 w-full h-[500px] bg-[radial-gradient(circle_at_top,_rgba(237,40,57,0.08)_0%,_transparent_70%)]" />

            <section className="py-24 px-4 relative z-10">
                <div className="max-w-[1400px] mx-auto pt-10">
                    {/* Header */}
                    <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-1.5 h-6 bg-red" />
                                <span className="text-red font-mono font-bold text-xs tracking-widest uppercase">{year} Season</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-barlow font-black uppercase tracking-tight leading-none mb-4">
                                Race Calendar
                            </h1>
                            <p className="text-snow/50 font-jakarta max-w-xl">
                                The ultimate timing strip. All {calendarData.length} rounds mapped to your local time.
                            </p>
                        </motion.div>

                        {/* Controls */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
                            className="flex flex-wrap gap-4 items-center bg-gunmetal-deep p-4 border border-snow/5 rounded-none"
                        >
                            <div className="flex border border-snow/10 bg-carbon overflow-hidden">
                                <button onClick={() => setYear(2025)} className={`px-4 py-2 font-mono text-xs font-bold tracking-wider transition-all ${year === 2025 ? 'bg-red text-white' : 'text-snow/50 hover:text-snow hover:bg-snow/5'}`}>
                                    2025
                                </button>
                                <button onClick={() => setYear(2026)} className={`px-4 py-2 font-mono text-xs font-bold tracking-wider transition-all ${year === 2026 ? 'bg-red text-white' : 'text-snow/50 hover:text-snow hover:bg-snow/5'}`}>
                                    2026
                                </button>
                            </div>

                            <div className="h-8 w-px bg-snow/10 hidden sm:block" />

                            <div className="flex border border-snow/10 bg-carbon overflow-hidden">
                                <button onClick={() => setViewMode('grid')} className={`px-4 py-2 font-mono text-xs font-bold tracking-wider transition-all ${viewMode === 'grid' ? 'bg-red text-white' : 'text-snow/50 hover:text-snow hover:bg-snow/5'}`}>
                                    GRID
                                </button>
                                <button onClick={() => setViewMode('timeline')} className={`px-4 py-2 font-mono text-xs font-bold tracking-wider transition-all ${viewMode === 'timeline' ? 'bg-red text-white' : 'text-snow/50 hover:text-snow hover:bg-snow/5'}`}>
                                    TIMELINE
                                </button>
                            </div>

                            <div className="h-8 w-px bg-snow/10 hidden sm:block" />

                            <select
                                value={timezone}
                                onChange={e => setTimezone(e.target.value)}
                                className="px-4 py-2 bg-carbon border border-snow/10 text-xs font-mono font-bold uppercase focus:border-red focus:outline-none text-snow appearance-none"
                            >
                                {timezones.map(tz => (
                                    <option key={tz.value} value={tz.value}>{tz.label}</option>
                                ))}
                            </select>

                            <div className="flex border border-snow/10 bg-carbon overflow-hidden">
                                <button onClick={() => setUse24h(false)} className={`px-3 py-2 font-mono text-xs font-bold transition-all ${!use24h ? 'bg-snow/10 text-snow' : 'text-snow/50 hover:bg-snow/5'}`}>12H</button>
                                <button onClick={() => setUse24h(true)} className={`px-3 py-2 font-mono text-xs font-bold transition-all ${use24h ? 'bg-snow/10 text-snow' : 'text-snow/50 hover:bg-snow/5'}`}>24H</button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Views */}
                    <AnimatePresence mode="wait">
                        {viewMode === 'grid' ? (
                            <motion.div
                                key="grid"
                                initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.4 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-[250px]"
                            >
                                {calendarData.map((race, i) => {
                                    const status = getRaceStatus(race);
                                    const conf = statusConfig[status];
                                    const isUpcoming = status === 'upcoming';
                                    const isLive = status === 'live';
                                    const isNext = isUpcoming && i === calendarData.findIndex(r => getRaceStatus(r) === 'upcoming');

                                    return (
                                        <Link
                                            href={`/calendar/${race.id}`}
                                            key={race.id}
                                            className={`block group relative overflow-hidden transition-all duration-400 border border-t-2 ${conf.bg} hover:border-t-red hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(237,40,57,0.15)] bg-gunmetal-deep
                                                ${(isLive || isNext) ? 'md:col-span-2 md:row-span-2' : ''}
                                            `}
                                        >
                                            {/* Track Layout Watermark */}
                                            <div className="absolute -bottom-4 right-[-5%] w-[55%] h-[70%] pointer-events-none opacity-[0.15] group-hover:opacity-[0.3] group-hover:scale-105 transition-all duration-700 flex items-end justify-end">
                                                {getTrackSvg(race.id) && (
                                                    <img src={getTrackSvg(race.id)} alt="" className="w-full h-full object-contain text-snow" style={{ filter: 'brightness(10)' }} />
                                                )}
                                            </div>

                                            <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                                                <div className="flex items-start justify-between">
                                                    <div className="w-12 h-12 rounded-full border border-red flex items-center justify-center font-mono font-bold text-red bg-red/5">
                                                        {race.round.toString().padStart(2, '0')}
                                                    </div>
                                                    <div className={`px-2.5 py-1 rounded-sm border ${conf.badge} text-[10px] font-mono font-bold tracking-widest flex items-center gap-2`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${conf.dot}`} />
                                                        {conf.label}
                                                    </div>
                                                </div>

                                                <div>
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className="text-3xl filter drop-shadow-md">{getFlagEmoji(race.countryCode)}</span>
                                                        {race.isSprint && (
                                                            <span className="px-2 py-0.5 border border-red/30 bg-red-dim text-red text-[10px] font-mono font-bold tracking-wider uppercase">Sprint Weekend</span>
                                                        )}
                                                    </div>
                                                    <h3 className={`font-barlow font-bold uppercase leading-tight mb-1 group-hover:text-red transition-colors ${(isLive || isNext) ? 'text-5xl' : 'text-3xl'}`}>{race.circuitName}</h3>
                                                    <p className="text-sm font-jakarta text-snow/50">{race.country}</p>

                                                    <div className="mt-4 pt-4 border-t border-snow/10 flex items-center justify-between">
                                                        <span className="font-mono text-xs text-snow/40 uppercase tracking-widest">
                                                            {formatSessionDate(race.sessions.race, timezone)}
                                                        </span>
                                                        <span className="font-mono text-sm font-bold text-snow">
                                                            {formatSessionTime(race.sessions.race, timezone, use24h)}
                                                        </span>
                                                    </div>

                                                    {status === 'completed' && race.results.winner && (
                                                        <div className="absolute top-6 right-6 text-right opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                            <div className="text-[10px] font-mono text-snow/30 uppercase tracking-widest mb-1">Winner</div>
                                                            <div className="font-barlow font-bold text-xl text-[#FFC800]">{race.results.winner.driver}</div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="timeline"
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.4 }}
                                className="relative max-w-4xl mx-auto py-10"
                            >
                                {/* Timing Line */}
                                <div className="absolute left-4 sm:left-[50%] top-0 bottom-0 w-px bg-snow/20 ml-[-0.5px]">
                                    {/* Flow animation */}
                                    <div className="absolute top-0 w-full h-[20%] bg-gradient-to-b from-transparent via-red to-transparent animate-[flow_4s_linear_infinite] opacity-50" />
                                </div>

                                <div className="space-y-4">
                                    {calendarData.map((race, i) => {
                                        const status = getRaceStatus(race);
                                        const conf = statusConfig[status];
                                        const isLeft = i % 2 === 0;

                                        return (
                                            <div key={race.id} className={`relative flex sm:justify-between items-center sm:w-full sm:odd:flex-row-reverse group`}>
                                                {/* Connecting Line */}
                                                <div className="hidden sm:block absolute left-[50%] w-8 h-px bg-snow/20 z-0 origin-left scale-x-0 group-hover:scale-x-100 group-hover:bg-red transition-all duration-300" style={{ [isLeft ? 'right' : 'left']: '50%', transformOrigin: isLeft ? 'right' : 'left', width: 'calc(50% - 20px)' }} />

                                                {/* timeline dot */}
                                                <div className={`absolute left-4 sm:left-[50%] w-3 h-3 rounded-full border-2 border-carbon ${status === 'completed' ? 'bg-snow/40' : status === 'live' ? 'bg-red border-red animate-ping shadow-[0_0_15px_var(--red)]' : 'bg-[#27F4D2]'} ml-[-6px] z-10 transition-transform duration-300 group-hover:scale-150 group-hover:bg-red group-hover:border-red`} />

                                                <div className={`w-full sm:w-[calc(50%-40px)] pl-12 sm:pl-0 ${isLeft ? 'sm:pr-10 sm:text-right' : 'sm:pl-10 text-left'}`}>
                                                    <Link href={`/calendar/${race.id}`} className={`block p-5 border bg-gunmetal-deep hover:-translate-y-1 transition-all duration-300 relative overflow-hidden ${conf.bg} hover:border-red hover:shadow-[0_0_20px_rgba(237,40,57,0.1)]`}>
                                                        {/* Track Layout Background */}
                                                        <div className="absolute right-2 top-2 bottom-2 w-[80px] pointer-events-none opacity-[0.15] group-hover:opacity-[0.3] transition-opacity duration-500">
                                                            {getTrackSvg(race.id) && (
                                                                <img src={getTrackSvg(race.id)} alt="" className="w-full h-full object-contain" style={{ filter: 'brightness(10)' }} />
                                                            )}
                                                        </div>
                                                        {/* Activity Trace */}
                                                        <div className={`absolute top-0 left-0 h-full w-1 ${status === 'live' ? 'bg-red' : status === 'upcoming' ? 'bg-[#27F4D2]' : 'bg-transparent'}`} />

                                                        <div className={`flex items-center gap-3 mb-3 ${isLeft ? 'sm:justify-end' : 'justify-start'}`}>
                                                            <div className="w-6 h-6 rounded-full border border-red/30 flex items-center justify-center font-mono text-[10px] font-bold text-red bg-red/5">
                                                                {race.round}
                                                            </div>
                                                            <div className={`px-2 py-0.5 rounded-sm border ${conf.badge} text-[9px] font-mono tracking-widest`}>
                                                                {conf.label}
                                                            </div>
                                                        </div>

                                                        <h3 className="font-barlow font-bold text-2xl uppercase leading-none mb-2 group-hover:text-red transition-colors">{race.circuitName}</h3>
                                                        <div className={`flex items-center gap-2 mb-3 text-xs font-jakarta text-snow/50 ${isLeft ? 'sm:justify-end' : 'justify-start'}`}>
                                                            <span className="filter drop-shadow">{getFlagEmoji(race.countryCode)}</span>
                                                            <span className="uppercase tracking-widest text-[10px]">{race.country}</span>
                                                        </div>

                                                        <div className="font-mono text-xs text-snow/80 border-t border-snow/10 pt-3">
                                                            {formatSessionDate(race.sessions.race, timezone)} <span className="text-snow/30 px-1">|</span> <span className="font-bold text-snow">{formatSessionTime(race.sessions.race, timezone, use24h)}</span>
                                                        </div>
                                                    </Link>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>

            <Footer />

            <style jsx global>{`
                @keyframes flow {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(500%); }
                }
            `}</style>
        </div>
    );
}
