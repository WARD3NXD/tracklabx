'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { getRaceById, getRaceStatus } from '@/lib/data/calendar';
import { timezones, formatSessionTime, formatSessionDate, getCountdown } from '@/lib/utils';
import { predictGrid } from '@/lib/predictions';
import { Footer } from '@/components/layout/Footer';
import CircuitIconInline from '@/components/ui/CircuitIconInline';
import { getCircuitIdForRace } from '@/lib/circuitMaps';

// Map race IDs to track IDs
const raceToTrackMap: Record<string, string> = {
    'australia-2025': 'melbourne',
    'china-2025': 'shanghai',
    'japan-2025': 'suzuka',
    'bahrain-2025': 'bahrain',
    'jeddah-2025': 'jeddah',
    'miami-2025': 'miami',
    'imola-2025': 'imola',
    'monaco-2025': 'monaco',
    'spain-2025': 'barcelona',
    'canada-2025': 'montreal',
    'austria-2025': 'spielberg',
    'britain-2025': 'silverstone',
    'belgium-2025': 'spa',
    'hungary-2025': 'budapest',
    'netherlands-2025': 'zandvoort',
    'monza-2025': 'monza',
    'azerbaijan-2025': 'baku',
    'singapore-2025': 'singapore',
    'usa-2025': 'austin',
    'mexico-2025': 'mexico-city',
    'brazil-2025': 'interlagos',
    'las-vegas-2025': 'las-vegas',
    'qatar-2025': 'lusail',
    'abu-dhabi-2025': 'yas-marina',
};

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function RaceDetailPage() {
    const params = useParams();
    const raceId = params.raceId as string;
    const race = getRaceById(raceId);
    const [timezone, setTimezone] = useState('UTC');
    const [use24h, setUse24h] = useState(true);

    const trackId = raceToTrackMap[raceId] || 'bahrain';
    const predictions = useMemo(() => predictGrid(trackId), [trackId]);

    if (!race) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-carbon text-snow">
                <div className="text-center">
                    <h1 className="text-4xl font-barlow font-bold mb-4 uppercase">Round Not Found</h1>
                    <Link href="/calendar" className="text-red font-barlow tracking-widest uppercase hover:text-red-hot transition-colors flex items-center justify-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
                        Return to Calendar
                    </Link>
                </div>
            </div>
        );
    }

    const status = getRaceStatus(race);

    const sessions = [
        { key: 'fp1', label: 'Free Practice 1', time: race.sessions.fp1 },
        ...(race.isSprint
            ? [
                { key: 'sprintShootout', label: 'Sprint Qualifying', time: race.sessions.sprintShootout },
                { key: 'sprint', label: 'Sprint Race', time: race.sessions.sprint },
            ]
            : [
                { key: 'fp2', label: 'Free Practice 2', time: race.sessions.fp2 },
                { key: 'fp3', label: 'Free Practice 3', time: race.sessions.fp3 },
            ]),
        { key: 'qualifying', label: 'Qualifying', time: race.sessions.qualifying },
        { key: 'race', label: 'Race', time: race.sessions.race },
    ].filter(s => s.time !== null);

    return (
        <div className="bg-carbon text-snow min-h-screen selection:bg-red selection:text-white">
            {/* Full Bleed Header */}
            <div className="relative pt-32 pb-24 overflow-hidden border-b border-snow/10 noise-overlay">
                {/* Track Layout Background */}
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden z-0 select-none pointer-events-none">
                    {getCircuitIdForRace(raceId) && (
                        <CircuitIconInline
                            circuitId={getCircuitIdForRace(raceId)!}
                            className="circuit-watermark"
                            animate={true}
                            loop={true}
                            color="var(--snow)"
                            opacity={0.08}
                        />
                    )}
                </div>

                {/* Red radial atmosphere */}
                <div className="absolute -bottom-1/2 -left-1/4 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(237,40,57,0.15)_0%,_transparent_60%)] z-0" />

                <div className="max-w-6xl mx-auto px-4 relative z-10 flex flex-col items-center text-center">
                    <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-6">
                        <Link href="/calendar" className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gunmetal-deep border border-snow/10 text-snow/50 hover:text-snow hover:border-snow/30 transition-all mb-8">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
                        </Link>

                        <div className="flex items-center justify-center gap-4 mb-6">
                            <div className="px-3 py-1 bg-red-dim border border-red/30 text-red font-mono font-bold text-xs tracking-widest uppercase flex items-center gap-2">
                                <span className={`w-1.5 h-1.5 rounded-full ${status === 'live' ? 'bg-red animate-pulse' : 'bg-red/50'}`} />
                                Round {race.round.toString().padStart(2, '0')}
                            </div>
                            {race.isSprint && (
                                <div className="px-3 py-1 bg-gunmetal border border-snow/20 text-snow font-mono font-bold text-xs tracking-widest uppercase">
                                    Sprint
                                </div>
                            )}
                        </div>

                        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-barlow font-black uppercase tracking-tight leading-[0.9] mb-4 drop-shadow-2xl">
                            {race.circuitName}
                        </h1>
                        <p className="text-lg sm:text-xl text-snow/50 font-jakarta tracking-wide">
                            {race.country}
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12">

                    {/* Left Column: Sessions & Results */}
                    <div className="space-y-16">

                        {/* Timezone Controls */}
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="flex flex-wrap gap-4 items-center justify-between p-4 bg-gunmetal-deep border border-snow/5 border-l-2 border-l-red">
                            <div className="flex items-center gap-4">
                                <span className="text-xs font-mono font-bold text-snow/40 uppercase tracking-widest">Local Time</span>
                                <div className="h-4 w-px bg-snow/10" />
                                <div className="flex border border-snow/10 bg-carbon">
                                    <button onClick={() => setUse24h(false)} className={`px-4 py-1.5 font-mono text-xs font-bold transition-colors ${!use24h ? 'bg-red text-white' : 'text-snow/50 hover:text-snow'}`}>12H</button>
                                    <button onClick={() => setUse24h(true)} className={`px-4 py-1.5 font-mono text-xs font-bold transition-colors ${use24h ? 'bg-red text-white' : 'text-snow/50 hover:text-snow'}`}>24H</button>
                                </div>
                            </div>
                            <div className="relative">
                                <select
                                    value={timezone}
                                    onChange={e => setTimezone(e.target.value)}
                                    className="pl-4 pr-10 py-1.5 bg-carbon border border-snow/10 text-xs font-mono font-bold uppercase focus:border-red focus:outline-none text-snow appearance-none"
                                >
                                    {timezones.map(tz => (
                                        <option key={tz.value} value={tz.value}>{tz.label}</option>
                                    ))}
                                </select>
                                <svg className="absolute right-3 top-2 pointer-events-none text-snow/40" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                            </div>
                        </motion.div>

                        {/* Schedule Table */}
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                            <h2 className="font-barlow font-bold text-3xl uppercase tracking-wider mb-6 flex items-center gap-3">
                                <span className="w-1.5 h-6 bg-red block" /> Session Schedule
                            </h2>
                            <div className="bg-gunmetal-deep border border-snow/5 overflow-hidden">
                                {sessions.map((session, i) => (
                                    <div key={session.key} className={`flex flex-col sm:flex-row sm:items-center justify-between p-5 transition-colors hover:bg-snow/[0.02] ${i % 2 !== 0 ? 'bg-carbon/50' : ''} ${i !== sessions.length - 1 ? 'border-b border-snow/5' : ''}`}>
                                        <div className="flex items-center gap-4 mb-2 sm:mb-0">
                                            <span className={`w-2 h-2 rounded-full shadow-[0_0_10px_currentColor] ${session.key === 'race' ? 'bg-red text-red' : session.key === 'qualifying' ? 'bg-red/60 text-red/60' : 'bg-snow/20 text-transparent'}`} />
                                            <span className="font-jakarta font-medium text-sm text-snow">{session.label}</span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pl-6 sm:pl-0">
                                            <span className="text-xs text-snow/50 font-mono tracking-widest uppercase">
                                                {formatSessionDate(session.time!, timezone)}
                                            </span>
                                            <span className="font-mono text-sm md:text-base text-snow font-bold min-w-[80px] text-left sm:text-right bg-carbon px-3 py-1 border border-snow/10 shadow-inner">
                                                {formatSessionTime(session.time!, timezone, use24h)}
                                            </span>
                                            {status === 'upcoming' && (
                                                <span className="font-mono text-xs text-red min-w-[70px] text-left sm:text-right hidden md:block">
                                                    {getCountdown(session.time!)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Completed Results */}
                        {status === 'completed' && race.results.winner && (
                            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                                <h2 className="font-barlow font-bold text-3xl uppercase tracking-wider mb-6 flex items-center gap-3">
                                    <span className="w-1.5 h-6 bg-red block" /> Final Results
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1">
                                    {/* Winner */}
                                    <div className="bg-gunmetal-deep p-6 border-t-2 border-[#FFC800] relative overflow-hidden group">
                                        <div className="absolute -right-4 -bottom-4 opacity-5 transform rotate-12 scale-150 transition-transform duration-700 group-hover:scale-[2]">
                                            <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor"><path d="M12 15l-4 4v2h8v-2l-4-4zm-8-7a2 2 0 0 0-2 2v2a8 8 0 0 0 4 7.48V21h3v-2.18A7.95 7.95 0 0 0 12 19a7.95 7.95 0 0 0 2.92-.56V21h3v-1.52a8 8 0 0 0 4-7.48v-2a2 2 0 0 0-2-2h-2V5a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v3H4z" /></svg>
                                        </div>
                                        <div className="relative z-10">
                                            <span className="inline-block px-2 py-0.5 bg-[#FFC800]/10 text-[#FFC800] font-mono text-[10px] font-bold tracking-widest uppercase mb-4 border border-[#FFC800]/20">Race Winner</span>
                                            <div className="font-barlow font-bold text-2xl uppercase mb-1">{race.results.winner.driver}</div>
                                            <div className="text-xs font-jakarta text-snow/50 mb-6">{race.results.winner.team}</div>
                                            <div className="text-[10px] font-mono text-snow/30 uppercase tracking-widest mb-1">Race Time</div>
                                            <div className="font-mono text-xl font-bold text-snow">{race.results.winner.time}</div>
                                        </div>
                                    </div>

                                    {/* Pole */}
                                    <div className="bg-gunmetal-deep p-6 border-t-2 border-snow/20 relative overflow-hidden group">
                                        <div className="relative z-10">
                                            <span className="inline-block px-2 py-0.5 bg-snow/5 text-snow/70 font-mono text-[10px] font-bold tracking-widest uppercase mb-4 border border-snow/10">Pole Position</span>
                                            <div className="font-barlow font-bold text-2xl uppercase mb-1">{race.results.pole?.driver}</div>
                                            <div className="text-xs font-jakarta text-snow/50 mb-6">{race.results.pole?.team}</div>
                                            <div className="text-[10px] font-mono text-snow/30 uppercase tracking-widest mb-1">Quali Time</div>
                                            <div className="font-mono text-xl font-bold text-snow">{race.results.pole?.lapTime}</div>
                                        </div>
                                    </div>

                                    {/* Fastest Lap */}
                                    <div className="bg-gunmetal-deep p-6 border-t-2 border-red relative overflow-hidden group">
                                        <div className="relative z-10">
                                            <span className="inline-block px-2 py-0.5 bg-red/10 text-red font-mono text-[10px] font-bold tracking-widest uppercase mb-4 border border-red/20 shadow-[0_0_10px_rgba(237,40,57,0.2)]">Fastest Lap</span>
                                            <div className="font-barlow font-bold text-2xl uppercase mb-1">{race.results.fastestLap?.driver}</div>
                                            <div className="text-xs font-jakarta text-snow/50 mb-6">{race.results.fastestLap?.team}</div>
                                            <div className="text-[10px] font-mono text-snow/30 uppercase tracking-widest mb-1">Lap Time</div>
                                            <div className="font-mono text-xl font-bold text-red">{race.results.fastestLap?.lapTime}</div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Right Column: Prediction Grid */}
                    {status !== 'completed' && (
                        <div className="space-y-6">
                            <motion.div initial="hidden" animate="visible" variants={fadeUp} className="sticky top-24">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="font-barlow font-bold text-2xl uppercase tracking-wider flex items-center gap-2">
                                        Starting Grid <br className="hidden lg:block" /> Projection
                                    </h2>
                                </div>

                                <div className="bg-gunmetal-deep p-5 border border-snow/5 relative overflow-hidden">
                                    {/* Background Track SVG trace */}
                                    <div className="absolute right-0 bottom-0 translate-x-[20%] translate-y-[20%] opacity-5 w-[200px] pointer-events-none">
                                        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="50" cy="50" r="40" /></svg>
                                    </div>

                                    <div className="flex items-center gap-2 mb-6 bg-red/10 border border-red/20 px-3 py-2">
                                        <div className="w-2 h-2 rounded-full bg-red animate-pulse" />
                                        <span className="text-[10px] font-mono font-bold text-red uppercase tracking-widest">AI Predictor Active</span>
                                    </div>

                                    {/* Starting Grid Layout */}
                                    <div className="relative">
                                        {/* Grid centerline */}
                                        <div className="absolute left-[50%] top-0 bottom-0 w-px bg-snow/20 border-l border-dashed border-snow/10 ml-[-0.5px]" />

                                        <div className="space-y-4">
                                            {predictions.map((pred, i) => {
                                                const isLeft = pred.position % 2 !== 0; // P1 left, P2 right, P3 left, etc.
                                                // Staggered margin
                                                const marginClass = isLeft ? 'pr-8' : 'pl-8 mt-6';
                                                const bgHighlight = pred.position <= 3 ? 'bg-carbon border-red/30' : 'bg-carbon border-snow/10';

                                                return (
                                                    <motion.div
                                                        key={pred.driver.id}
                                                        initial={{ opacity: 0, x: isLeft ? -10 : 10 }}
                                                        whileInView={{ opacity: 1, x: 0 }}
                                                        viewport={{ once: true }}
                                                        transition={{ delay: i * 0.05 }}
                                                        className={`flex ${isLeft ? 'justify-start' : 'justify-end'} w-full relative z-10 ${marginClass}`}
                                                    >
                                                        <div className={`w-[85%] border p-3 flex flex-col gap-2 relative overflow-hidden group hover:border-red hover:shadow-[0_0_15px_rgba(237,40,57,0.1)] transition-colors ${bgHighlight}`}>
                                                            {/* Team Color Edge */}
                                                            <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: pred.team.color }} />

                                                            <div className="flex items-center justify-between pl-2">
                                                                <span className={`font-mono text-lg font-black leading-none ${pred.position <= 3 ? 'text-red' : 'text-snow/30'}`}>
                                                                    P{pred.position}
                                                                </span>
                                                                <span className="font-barlow font-bold uppercase text-[10px] tracking-widest px-1.5 py-0.5 bg-snow/5 border border-snow/10">
                                                                    {pred.driver.shortName}
                                                                </span>
                                                            </div>

                                                            <div className="pl-2">
                                                                <div className="font-barlow font-bold text-sm uppercase truncate mb-0.5">{pred.driver.name}</div>
                                                                <div className="text-[9px] font-jakarta text-snow/40 truncate">{pred.team.name}</div>
                                                            </div>

                                                            <div className="pl-2 mt-1">
                                                                <div className="flex items-center justify-between mb-1">
                                                                    <span className="text-[8px] font-mono text-snow/30 uppercase">Confidence</span>
                                                                    <span className="text-[9px] font-mono text-red">{pred.confidence}%</span>
                                                                </div>
                                                                <div className="h-1 bg-gunmetal overflow-hidden">
                                                                    <div className="h-full bg-red transition-all duration-1000" style={{ width: `${pred.confidence}%` }} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}
