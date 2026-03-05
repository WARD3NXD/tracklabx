'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth';
import { createSetup, SetupData, SetupFilters } from '@/lib/firestore';

interface Props {
    filters: SetupFilters;
    onCreated: () => void;
}

const compoundOptions: ('soft' | 'medium' | 'hard')[] = ['soft', 'medium', 'hard'];
const compoundColors = { soft: '#ED2839', medium: '#FFC800', hard: '#FFFFFF' };

export function PostSetupForm({ filters, onCreated }: Props) {
    const { user } = useAuth();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [lapTime, setLapTime] = useState('');

    const [setupData, setSetupData] = useState<SetupData>({
        frontWing: 25, rearWing: 30,
        diffOnThrottle: 75, diffOffThrottle: 65,
        frontCamber: -2.5, rearCamber: -1.5,
        frontToe: 0.08, rearToe: 0.3,
        frontSuspension: 5, rearSuspension: 4,
        frontAntiRollBar: 5, rearAntiRollBar: 4,
        frontRideHeight: 25, rearRideHeight: 35,
        brakePressure: 92, brakeBias: 56,
        frontTyrePressure: 23.5, rearTyrePressure: 22.0,
        tyreCompound: 'medium',
    });

    const update = (key: keyof SetupData, value: number | string) => {
        setSetupData(prev => ({ ...prev, [key]: value }));
    };

    const normalizeLapTime = (lt: string): string => {
        // Accept formats: 1:23.456, 1:23:456, 1.23.456
        const normalized = lt.trim();
        // Replace all colons/dots with a standard separator
        const parts = normalized.split(/[:\.]/);
        if (parts.length === 3) {
            const millis = parts[2].padEnd(3, '0').slice(0, 3);
            return `${parts[0]}:${parts[1].padStart(2, '0')}.${millis}`;
        }
        if (parts.length === 2) {
            // Assume M:SS or SS.mmm
            return `${parts[0]}:${parts[1].padStart(2, '0')}.000`;
        }
        return normalized;
    };

    const parseLapTimeToMs = (lt: string): number => {
        const normalized = normalizeLapTime(lt);
        const match = normalized.match(/^(\d+):(\d{2})\.(\d{3})$/);
        if (!match) return 0;
        return parseInt(match[1]) * 60000 + parseInt(match[2]) * 1000 + parseInt(match[3]);
    };

    const handleSubmit = async () => {
        if (!user) return;
        const normalized = normalizeLapTime(lapTime);
        if (!normalized.match(/^\d:\d{2}\.\d{3}$/)) {
            setError('Lap time format: M:SS.mmm (e.g. 1:23.456 or 1:23:456)');
            return;
        }
        setError('');
        setLoading(true);
        try {
            const lapTimeMs = parseLapTimeToMs(lapTime);
            await createSetup(
                user.uid,
                user.displayName || 'Anonymous',
                filters,
                normalized,
                lapTimeMs,
                setupData
            );
            setOpen(false);
            setLapTime('');
            onCreated();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to post setup');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="card-glow rounded-xl p-4 bg-surface text-center">
                <p className="text-sm text-foreground/60 font-jakarta">Sign in to post your setup</p>
            </div>
        );
    }

    if (!open) {
        return (
            <button
                onClick={() => setOpen(true)}
                className="w-full py-3 bg-red text-white font-sora font-semibold rounded-xl hover:bg-red/90 hover:shadow-[0_0_20px_var(--red-glow)] transition-all text-sm flex items-center justify-center gap-2"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                Post Your Setup
            </button>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-glow rounded-2xl p-6 bg-surface"
        >
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-sora font-bold text-lg">Post Setup</h3>
                <button onClick={() => setOpen(false)} className="text-foreground/40 hover:text-foreground">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
            </div>

            {error && (
                <div className="mb-4 px-4 py-2 rounded-lg bg-red/10 border border-red/30 text-red text-xs font-jakarta">{error}</div>
            )}

            {/* Lap Time */}
            <div className="mb-6">
                <label className="block text-xs font-sora font-semibold mb-2">Lap Time</label>
                <input
                    type="text"
                    value={lapTime}
                    onChange={e => setLapTime(e.target.value)}
                    placeholder="1:23.456"
                    className="w-full px-4 py-2.5 bg-background border border-border-red rounded-lg font-mono text-lg text-red placeholder-foreground/30 focus:outline-none focus:border-red transition-colors"
                />
            </div>

            {/* Parameters Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                {([
                    { l: 'Front Wing', k: 'frontWing' as const, min: 1, max: 50, step: 1 },
                    { l: 'Rear Wing', k: 'rearWing' as const, min: 1, max: 50, step: 1 },
                    { l: 'Diff On %', k: 'diffOnThrottle' as const, min: 50, max: 100, step: 1 },
                    { l: 'Diff Off %', k: 'diffOffThrottle' as const, min: 50, max: 100, step: 1 },
                    { l: 'Front Camber', k: 'frontCamber' as const, min: -3.5, max: -1, step: 0.1 },
                    { l: 'Rear Camber', k: 'rearCamber' as const, min: -2, max: -0.5, step: 0.1 },
                    { l: 'Front Toe', k: 'frontToe' as const, min: 0, max: 0.5, step: 0.01 },
                    { l: 'Rear Toe', k: 'rearToe' as const, min: 0, max: 0.5, step: 0.01 },
                    { l: 'Front Susp', k: 'frontSuspension' as const, min: 1, max: 11, step: 1 },
                    { l: 'Rear Susp', k: 'rearSuspension' as const, min: 1, max: 11, step: 1 },
                    { l: 'Front ARB', k: 'frontAntiRollBar' as const, min: 1, max: 11, step: 1 },
                    { l: 'Rear ARB', k: 'rearAntiRollBar' as const, min: 1, max: 11, step: 1 },
                    { l: 'Front Height', k: 'frontRideHeight' as const, min: 15, max: 50, step: 1 },
                    { l: 'Rear Height', k: 'rearRideHeight' as const, min: 25, max: 60, step: 1 },
                    { l: 'Brake Press %', k: 'brakePressure' as const, min: 80, max: 100, step: 1 },
                    { l: 'Brake Bias %', k: 'brakeBias' as const, min: 50, max: 62, step: 1 },
                    { l: 'Front Tyre psi', k: 'frontTyrePressure' as const, min: 20, max: 26, step: 0.1 },
                    { l: 'Rear Tyre psi', k: 'rearTyrePressure' as const, min: 20, max: 26, step: 0.1 },
                ]).map(param => (
                    <div key={param.k}>
                        <div className="flex justify-between mb-1">
                            <label className="text-[10px] font-sora text-foreground/60">{param.l}</label>
                            <span className="font-mono text-xs text-red font-medium">
                                {typeof setupData[param.k] === 'number' ? (setupData[param.k] as number).toFixed(param.step < 1 ? (param.step < 0.1 ? 2 : 1) : 0) : setupData[param.k]}
                            </span>
                        </div>
                        <input
                            type="range"
                            min={param.min}
                            max={param.max}
                            step={param.step}
                            value={setupData[param.k] as number}
                            onChange={e => update(param.k, parseFloat(e.target.value))}
                            className="w-full h-1.5 bg-background rounded-full appearance-none cursor-pointer accent-red"
                        />
                    </div>
                ))}
            </div>

            {/* Compound */}
            <div className="mb-6">
                <label className="block text-xs font-sora font-semibold mb-2">Tyre Compound</label>
                <div className="flex gap-2">
                    {compoundOptions.map(c => (
                        <button
                            key={c}
                            onClick={() => update('tyreCompound', c)}
                            className={`flex-1 py-2 rounded-lg text-xs font-sora font-medium border transition-all ${setupData.tyreCompound === c
                                ? 'border-current shadow-lg'
                                : 'border-border-red text-foreground/50'
                                }`}
                            style={setupData.tyreCompound === c ? { borderColor: compoundColors[c], color: compoundColors[c] } : undefined}
                        >
                            {c.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Submit */}
            <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3 bg-red text-white font-sora font-semibold rounded-xl hover:bg-red/90 hover:shadow-[0_0_20px_var(--red-glow)] transition-all text-sm disabled:opacity-50"
            >
                {loading ? 'Posting...' : 'Post Setup to Firestore'}
            </button>
        </motion.div>
    );
}
