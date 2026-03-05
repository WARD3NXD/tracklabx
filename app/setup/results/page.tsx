'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTrackById } from '@/lib/data/tracks';
import { teams } from '@/lib/data/teams';
import { getTeamColor } from '@/lib/utils';
import { getSetups, upvoteSetup, Setup, SetupFilters } from '@/lib/firestore';
import { TyrePressureChart } from '@/components/charts/TyrePressureChart';
import { AeroBalanceChart } from '@/components/charts/AeroBalanceChart';
import { SuspensionChart } from '@/components/charts/SuspensionChart';
import { LapTimeChart } from '@/components/charts/LapTimeChart';
import { PostSetupForm } from '@/components/setup/PostSetupForm';
import { useAuth } from '@/lib/auth';

const compoundColors: Record<string, string> = { soft: '#ED2839', medium: '#FFC800', hard: '#FFFFFF' };

function generateMockSetups(count: number): Setup[] {
    const usernames = ['SpeedDemon42', 'PitWallPro', 'AeroKing', 'TyreWhisperer', 'BrakeLateLewis', 'SlipstreamSam', 'ApexHunter', 'DRSMaster', 'UndercutUrsula', 'GravelTrapGary', 'RainMeister', 'PolesitterPete'];
    const compounds: ('soft' | 'medium' | 'hard')[] = ['soft', 'medium', 'hard'];
    return Array.from({ length: count }, (_, i) => {
        const team = teams[i % teams.length];
        const baseLapMs = 78000 + Math.random() * 12000;
        const mins = Math.floor(baseLapMs / 60000);
        const secs = Math.floor((baseLapMs % 60000) / 1000);
        const millis = Math.floor(baseLapMs % 1000);
        return {
            id: `mock-${i}`, trackId: 'bahrain', teamId: team.id,
            condition: 'dry' as const, weather: 'sunny' as const, sessionType: 'race' as const,
            username: usernames[i % usernames.length],
            lapTime: `${mins}:${secs.toString().padStart(2, '0')}.${millis.toString().padStart(3, '0')}`,
            lapTimeMs: Math.round(baseLapMs), upvotes: Math.floor(Math.random() * 200),
            shareToken: `mock-${i}`, userId: `mock-user-${i}`,
            setupData: {
                frontWing: Math.floor(Math.random() * 40) + 5, rearWing: Math.floor(Math.random() * 40) + 5,
                diffOnThrottle: Math.floor(Math.random() * 40) + 50, diffOffThrottle: Math.floor(Math.random() * 40) + 50,
                frontCamber: -(Math.random() * 3 + 0.5), rearCamber: -(Math.random() * 2 + 0.3),
                frontToe: Math.random() * 0.2, rearToe: Math.random() * 0.5,
                frontSuspension: Math.floor(Math.random() * 8) + 1, rearSuspension: Math.floor(Math.random() * 8) + 1,
                frontAntiRollBar: Math.floor(Math.random() * 8) + 1, rearAntiRollBar: Math.floor(Math.random() * 8) + 1,
                frontRideHeight: Math.floor(Math.random() * 30) + 15, rearRideHeight: Math.floor(Math.random() * 30) + 25,
                brakePressure: Math.floor(Math.random() * 20) + 80, brakeBias: Math.floor(Math.random() * 10) + 50,
                frontTyrePressure: +(22 + Math.random() * 4).toFixed(1), rearTyrePressure: +(21 + Math.random() * 4).toFixed(1),
                tyreCompound: compounds[Math.floor(Math.random() * 3)],
            },
            createdAt: null,
        };
    });
}

export default function SetupResultsPage() {
    const { user } = useAuth();
    const [setups, setSetups] = useState<Setup[]>([]);
    const [sortBy, setSortBy] = useState<'fastest' | 'upvotes' | 'recent'>('fastest');
    const [selectedSetup, setSelectedSetup] = useState<Setup | null>(null);
    const [trackName, setTrackName] = useState('');
    const [trackId, setTrackId] = useState('');
    const [loadingSetups, setLoadingSetups] = useState(true);
    const [usingMock, setUsingMock] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const filters: SetupFilters = useMemo(() => ({
        trackId: trackId || 'bahrain',
        condition: typeof window !== 'undefined' ? localStorage.getItem('setup_condition') || undefined : undefined,
        weather: typeof window !== 'undefined' ? localStorage.getItem('setup_weather') || undefined : undefined,
        sessionType: typeof window !== 'undefined' ? localStorage.getItem('setup_session') || undefined : undefined,
        teamId: typeof window !== 'undefined' ? localStorage.getItem('setup_team') || undefined : undefined,
    }), [trackId]);

    const loadSetups = useCallback(async () => {
        setLoadingSetups(true);
        try {
            const sortField = sortBy === 'fastest' ? 'lapTimeMs' : sortBy === 'upvotes' ? 'upvotes' : 'createdAt';
            const sortDir = sortBy === 'fastest' ? 'asc' as const : 'desc' as const;
            const result = await getSetups(filters, sortField, sortDir, 50);
            if (result.setups.length > 0) { setSetups(result.setups); setUsingMock(false); }
            else { setSetups(generateMockSetups(36)); setUsingMock(true); }
        } catch { setSetups(generateMockSetups(36)); setUsingMock(true); }
        finally { setLoadingSetups(false); }
    }, [filters, sortBy]);

    useEffect(() => {
        const tid = localStorage.getItem('setup_track') || 'bahrain';
        setTrackId(tid);
        setTrackName(getTrackById(tid)?.name || 'Unknown Track');
    }, []);

    useEffect(() => { if (trackId) loadSetups(); }, [trackId, loadSetups]);

    // Auto-select first setup
    useEffect(() => {
        if (!selectedSetup && setups.length > 0) setSelectedSetup(setups[0]);
    }, [setups, selectedSetup]);

    const sorted = useMemo(() => {
        if (!usingMock) return setups;
        const s = [...setups];
        if (sortBy === 'fastest') s.sort((a, b) => a.lapTimeMs - b.lapTimeMs);
        if (sortBy === 'upvotes') s.sort((a, b) => b.upvotes - a.upvotes);
        return s;
    }, [setups, sortBy, usingMock]);

    const handleUpvote = async (setupId: string) => {
        if (setupId.startsWith('mock-')) return;
        try { await upvoteSetup(setupId); setSetups(prev => prev.map(s => s.id === setupId ? { ...s, upvotes: s.upvotes + 1 } : s)); } catch { /* */ }
    };

    const avgLapTime = sorted.length > 0 ? sorted.reduce((sum, s) => sum + s.lapTimeMs, 0) / sorted.length : 0;
    const avgMins = Math.floor(avgLapTime / 60000);
    const avgSecs = Math.floor((avgLapTime % 60000) / 1000);
    const fastestSetup = sorted[0];

    const sel = selectedSetup;
    const selTeam = sel?.teamId ? teams.find(t => t.id === sel.teamId) : null;

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            {/* ─── Top Bar ─── */}
            <div className="border-b border-snow/10 bg-carbon/90 backdrop-blur-sm flex-shrink-0 relative z-20">
                <div className="px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red animate-pulse" />
                            <span className="text-[10px] font-mono text-red uppercase tracking-widest">Setup Telemetry</span>
                            {usingMock && <span className="px-2 py-0.5 rounded text-[10px] font-mono text-foreground/40 border border-foreground/10">Demo</span>}
                        </div>
                        <h1 className="text-2xl font-barlow font-bold uppercase tracking-wide">{trackName}</h1>
                    </div>
                    <div className="flex items-center gap-6">
                        {[
                            { label: 'SETUPS', value: String(sorted.length) },
                            { label: 'FASTEST', value: fastestSetup?.lapTime || '--', accent: true },
                            { label: 'AVG', value: avgLapTime > 0 ? `${avgMins}:${avgSecs.toString().padStart(2, '0')}` : '--' },
                        ].map(stat => (
                            <div key={stat.label} className="text-right hidden sm:block">
                                <div className="text-[8px] font-mono text-foreground/30 uppercase tracking-wider">{stat.label}</div>
                                <div className={`font-mono text-sm font-bold ${'accent' in stat && stat.accent ? 'text-red' : ''}`}>{stat.value}</div>
                            </div>
                        ))}
                        <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            className="w-8 h-8 rounded-lg border border-border-red flex items-center justify-center text-foreground/50 hover:text-foreground transition-colors xl:flex hidden">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                {sidebarCollapsed ? <path d="M3 12h18M3 6h18M3 18h18" /> : <path d="M18 6L6 18M6 6l12 12" />}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* ─── Main Content ─── */}
            <div className="flex flex-1 overflow-hidden">
                {/* ─── SIDEBAR: Setup List ─── */}
                <AnimatePresence>
                    {!sidebarCollapsed && (
                        <motion.div
                            initial={{ width: 0, opacity: 0 }} animate={{ width: 320, opacity: 1 }} exit={{ width: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex-shrink-0 border-r border-snow/10 bg-gunmetal-deep/50 flex flex-col overflow-hidden relative z-10"
                        >
                            {/* Sort + Post */}
                            <div className="p-3 border-b border-border-red/20 space-y-2 flex-shrink-0">
                                <div className="flex gap-1">
                                    {(['fastest', 'upvotes', 'recent'] as const).map(s => (
                                        <button key={s} onClick={() => setSortBy(s)}
                                            className={`flex-1 px-2 py-2 text-[10px] font-barlow font-bold uppercase tracking-wider rounded-none transition-all
                        ${sortBy === s ? 'bg-red text-white' : 'text-foreground/40 hover:text-foreground hover:bg-snow/5'}`}>
                                            {s === 'fastest' ? '⚡Fast' : s === 'upvotes' ? '⭐Top' : '🕐New'}
                                        </button>
                                    ))}
                                </div>
                                <PostSetupForm filters={filters} onCreated={loadSetups} />
                            </div>

                            {/* Setup List */}
                            <div className="flex-1 overflow-y-auto">
                                {loadingSetups ? (
                                    <div className="flex items-center justify-center py-16">
                                        <div className="w-6 h-6 border-2 border-red border-t-transparent rounded-full animate-spin" />
                                    </div>
                                ) : (
                                    <div className="p-2 space-y-1">
                                        {sorted.map((setup, i) => {
                                            const teamObj = setup.teamId ? teams.find(t => t.id === setup.teamId) : null;
                                            const isSelected = sel?.id === setup.id;
                                            return (
                                                <motion.button key={setup.id}
                                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                                                    onClick={() => setSelectedSetup(setup)}
                                                    className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center gap-3
                            ${isSelected ? 'bg-red/10 border border-red/30 shadow-[0_0_10px_var(--red-glow)]' : 'hover:bg-foreground/[0.03] border border-transparent'}`}>
                                                    {/* Position */}
                                                    <span className={`font-mono text-xs font-bold min-w-[20px]
                            ${i < 3 ? 'text-red' : 'text-foreground/25'}`}>
                                                        {i + 1}
                                                    </span>
                                                    {/* Team color dot */}
                                                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: teamObj?.color || '#888' }} />
                                                    {/* Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm font-barlow font-bold uppercase truncate">{setup.username}</span>
                                                            <span className="font-mono text-xs text-red font-bold">{setup.lapTime}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <span className="text-[9px] font-mono text-foreground/25">{setup.condition}</span>
                                                            <span className="text-[9px] font-mono text-foreground/25">{setup.sessionType}</span>
                                                            <div className="ml-auto flex items-center gap-0.5 text-foreground/20">
                                                                <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4l3 6h6l-5 4 2 7-6-4-6 4 2-7-5-4h6z" /></svg>
                                                                <span className="font-mono text-[9px]">{setup.upvotes}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ─── MAIN: Full-Screen Telemetry ─── */}
                <div className="flex-1 overflow-y-auto">
                    <AnimatePresence mode="wait">
                        {sel ? (
                            <motion.div key={sel.id}
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="p-6 xl:p-10 max-w-6xl mx-auto relative"
                            >
                                <div className="absolute inset-0 noise-overlay pointer-events-none" />
                                {/* Setup Header */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-mono font-bold text-xl"
                                            style={{ backgroundColor: selTeam?.color || '#ED2839' }}>
                                            {sel.username[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <h2 className="font-barlow font-black text-3xl uppercase tracking-wider mb-1">{sel.username}</h2>
                                            <div className="flex flex-wrap items-center gap-2">
                                                {selTeam && <span className="px-2 py-0.5 text-[10px] font-mono tracking-widest uppercase border" style={{ color: selTeam.color, borderColor: selTeam.color + '40', backgroundColor: selTeam.color + '10' }}>{selTeam.name}</span>}
                                                <span className="px-2 py-0.5 text-[10px] font-mono tracking-widest uppercase bg-snow/5 border border-snow/10">{sel.condition}</span>
                                                <span className="px-2 py-0.5 text-[10px] font-mono tracking-widest uppercase bg-snow/5 border border-snow/10">{sel.sessionType}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <div className="text-[10px] font-mono text-foreground/40 uppercase tracking-widest mb-1 mt-1">Lap Time</div>
                                            <div className="font-barlow text-[3.5rem] leading-none text-red font-black tracking-tighter drop-shadow-md">{sel.lapTime}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[10px] font-mono text-foreground/40 uppercase tracking-widest mb-1 mt-1">Upvotes</div>
                                            <motion.button
                                                onClick={() => handleUpvote(sel.id)}
                                                whileTap={{ scale: 0.9, rotateX: 180 }}
                                                className="flex items-center gap-1 text-foreground/50 hover:text-red transition-colors py-1"
                                            >
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4l3 6h6l-5 4 2 7-6-4-6 4 2-7-5-4h6z" /></svg>
                                                <span className="font-mono text-3xl font-bold">{sel.upvotes}</span>
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>

                                {/* Charts Row */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                                    {/* Aero Balance */}
                                    <div className="card-glow rounded-none border border-snow/5 bg-gunmetal-deep p-6 shadow-2xl relative z-10">
                                        <div className="text-[9px] font-mono text-foreground/30 uppercase tracking-wider mb-4">Aerodynamics</div>
                                        <AeroBalanceChart frontWing={sel.setupData.frontWing} rearWing={sel.setupData.rearWing} />
                                        <div className="grid grid-cols-2 gap-4 mt-4 pt-3 border-t border-border-red/15">
                                            <div><div className="text-[8px] font-mono text-foreground/25">DIFF ON</div><div className="font-mono text-sm font-bold">{sel.setupData.diffOnThrottle}%</div></div>
                                            <div><div className="text-[8px] font-mono text-foreground/25">DIFF OFF</div><div className="font-mono text-sm font-bold">{sel.setupData.diffOffThrottle}%</div></div>
                                        </div>
                                    </div>

                                    {/* Suspension Radar */}
                                    <div className="card-glow rounded-none border border-snow/5 bg-gunmetal-deep p-6 shadow-2xl relative z-10">
                                        <div className="text-[9px] font-mono text-foreground/30 uppercase tracking-wider mb-2">Suspension Profile</div>
                                        <SuspensionChart data={sel.setupData} />
                                    </div>

                                    {/* Tyre Pressure Gauges */}
                                    <div className="card-glow rounded-none border border-snow/5 bg-gunmetal-deep p-6 shadow-2xl relative z-10">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="text-[9px] font-mono text-foreground/30 uppercase tracking-wider">Tyre Pressure</div>
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-3 h-3 rounded-full border-2" style={{ borderColor: compoundColors[sel.setupData.tyreCompound] }} />
                                                <span className="text-[10px] font-mono font-bold uppercase" style={{ color: compoundColors[sel.setupData.tyreCompound] }}>{sel.setupData.tyreCompound}</span>
                                            </div>
                                        </div>
                                        <TyrePressureChart
                                            fl={sel.setupData.frontTyrePressure} fr={sel.setupData.frontTyrePressure}
                                            rl={sel.setupData.rearTyrePressure} rr={sel.setupData.rearTyrePressure}
                                            compound={sel.setupData.tyreCompound} />
                                    </div>
                                </div>

                                {/* Full Parameters + Lap Comparison */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
                                    {/* Full Parameter Grid */}
                                    <div className="card-glow rounded-none border border-snow/5 bg-gunmetal-deep p-6 shadow-2xl relative z-10">
                                        <div className="text-[9px] font-mono text-foreground/30 uppercase tracking-wider mb-4">Full Parameters</div>
                                        <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                                            {[
                                                { l: 'Front Wing', v: sel.setupData.frontWing, u: '' },
                                                { l: 'Rear Wing', v: sel.setupData.rearWing, u: '' },
                                                { l: 'Diff On Throttle', v: sel.setupData.diffOnThrottle, u: '%' },
                                                { l: 'Diff Off Throttle', v: sel.setupData.diffOffThrottle, u: '%' },
                                                { l: 'Front Camber', v: sel.setupData.frontCamber.toFixed(1), u: '°' },
                                                { l: 'Rear Camber', v: sel.setupData.rearCamber.toFixed(1), u: '°' },
                                                { l: 'Front Toe', v: sel.setupData.frontToe.toFixed(2), u: '°' },
                                                { l: 'Rear Toe', v: sel.setupData.rearToe.toFixed(2), u: '°' },
                                                { l: 'Front Suspension', v: sel.setupData.frontSuspension, u: '' },
                                                { l: 'Rear Suspension', v: sel.setupData.rearSuspension, u: '' },
                                                { l: 'Front Anti-Roll', v: sel.setupData.frontAntiRollBar, u: '' },
                                                { l: 'Rear Anti-Roll', v: sel.setupData.rearAntiRollBar, u: '' },
                                                { l: 'Front Ride Height', v: sel.setupData.frontRideHeight, u: 'mm' },
                                                { l: 'Rear Ride Height', v: sel.setupData.rearRideHeight, u: 'mm' },
                                                { l: 'Brake Pressure', v: sel.setupData.brakePressure, u: '%' },
                                                { l: 'Brake Bias', v: sel.setupData.brakeBias, u: '%' },
                                                { l: 'Front Tyre Psi', v: sel.setupData.frontTyrePressure, u: 'psi' },
                                                { l: 'Rear Tyre Psi', v: sel.setupData.rearTyrePressure, u: 'psi' },
                                            ].map(p => (
                                                <div key={p.l} className="flex items-baseline justify-between py-1 border-b border-foreground/[0.04]">
                                                    <span className="text-[10px] font-mono text-foreground/35">{p.l}</span>
                                                    <span className="font-mono text-sm font-bold">{p.v}<span className="text-foreground/20 text-[9px] ml-0.5">{p.u}</span></span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Lap Time Comparison */}
                                    <div className="card-glow rounded-none border border-snow/5 bg-gunmetal-deep p-6 shadow-2xl relative z-10 flex flex-col">
                                        <div className="text-[9px] font-mono text-foreground/30 uppercase tracking-wider mb-4">Lap Comparison — Top 5</div>
                                        <div className="flex-1 min-h-[220px]">
                                            <LapTimeChart setups={sorted.slice(0, 5)} />
                                        </div>
                                        {/* Quick Leaderboard */}
                                        <div className="mt-4 pt-3 border-t border-border-red/15 space-y-1.5">
                                            {sorted.slice(0, 5).map((s, i) => (
                                                <div key={s.id} className="flex items-center gap-2 text-xs">
                                                    <span className={`font-mono font-bold min-w-[16px] ${i === 0 ? 'text-red' : 'text-foreground/25'}`}>{i + 1}</span>
                                                    <span className="font-sora truncate flex-1">{s.username}</span>
                                                    <span className="font-mono text-red font-bold">{s.lapTime}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-4">
                                    <button onClick={() => {
                                        const url = `${window.location.origin}/setup/${sel.shareToken}`;
                                        navigator.clipboard.writeText(url);
                                        alert('Share link copied!');
                                    }}
                                        className="flex-1 py-4 bg-red text-white font-barlow font-bold text-lg uppercase tracking-wider rounded-none hover:bg-red-hot hover:shadow-[0_0_30px_rgba(237,40,57,0.4)] transition-all flex items-center justify-center gap-3">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>
                                        Share Setup
                                    </button>
                                    <button
                                        className="flex-1 py-4 border border-snow/20 text-snow font-barlow font-bold text-lg uppercase tracking-wider rounded-none hover:border-red hover:shadow-[0_0_15px_rgba(237,40,57,0.2)] transition-all flex items-center justify-center gap-3">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                                        Export PDF
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="flex items-center justify-center h-full min-h-[60vh]">
                                <div className="text-center">
                                    <div className="w-20 h-20 rounded-3xl bg-red-dim flex items-center justify-center mx-auto mb-6">
                                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ED2839" strokeWidth="1.5">
                                            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-barlow font-bold uppercase text-3xl mb-3 tracking-wider">Select a Setup</h3>
                                    <p className="text-sm text-foreground/40 font-jakarta max-w-xs mx-auto">
                                        Choose a setup from the sidebar to view full telemetry, charts, and parameters.
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div >
    );
}
