'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { getSetupByShareToken, Setup } from '@/lib/firestore';
import { teams } from '@/lib/data/teams';
import { getTeamColor } from '@/lib/utils';
import { getTrackById } from '@/lib/data/tracks';

const compoundColors: Record<string, string> = {
    soft: '#ED2839',
    medium: '#FFC800',
    hard: '#FFFFFF',
};

export default function SharedSetupPage() {
    const params = useParams();
    const shareToken = params.shareToken as string;
    const [setup, setSetup] = useState<Setup | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        async function load() {
            try {
                const result = await getSetupByShareToken(shareToken);
                if (result) {
                    setSetup(result);
                } else {
                    setNotFound(true);
                }
            } catch {
                setNotFound(true);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [shareToken]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
                <div className="text-center">
                    <div className="w-10 h-10 border-2 border-red border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-sm text-foreground/50 font-jakarta">Loading shared setup...</p>
                </div>
            </div>
        );
    }

    if (notFound || !setup) {
        return (
            <div className="min-h-screen bg-background text-foreground">
                <div className="max-w-3xl mx-auto px-4 py-12">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="card-glow rounded-2xl p-8 bg-surface text-center">
                            <div className="w-16 h-16 rounded-xl bg-red-dim flex items-center justify-center mx-auto mb-6">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ED2839" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                                </svg>
                            </div>
                            <h1 className="text-2xl font-sora font-bold mb-2">Setup Not Found</h1>
                            <p className="text-sm text-foreground/40 font-jakarta mb-8">
                                This setup may have been removed or the link is invalid.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Link href="/signup" className="px-6 py-2.5 bg-red text-white font-sora font-semibold rounded-lg hover:bg-red/90 hover:shadow-[0_0_20px_var(--red-glow)] transition-all text-sm">
                                    Join TracklabX
                                </Link>
                                <Link href="/setup" className="px-6 py-2.5 border border-border-red text-foreground font-sora font-medium rounded-lg hover:border-border-red-hover transition-all text-sm">
                                    Browse Setups
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    const track = getTrackById(setup.trackId);
    const team = setup.teamId ? teams.find(t => t.id === setup.teamId) : null;

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="max-w-3xl mx-auto px-4 py-12">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="card-glow rounded-2xl p-8 bg-surface">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-3 py-1 rounded-full border border-red/30 bg-red-dim text-red text-xs font-mono font-medium">
                                        {track?.name || setup.trackId}
                                    </span>
                                    <span className="px-2 py-0.5 rounded text-[10px] font-mono text-foreground/50 bg-foreground/5">
                                        {setup.condition}
                                    </span>
                                </div>
                                <h1 className="text-xl font-sora font-bold">{setup.username}&apos;s Setup</h1>
                                {team && (
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: getTeamColor(team.name) }} />
                                        <span className="text-xs text-foreground/50 font-jakarta">{team.name}</span>
                                    </div>
                                )}
                            </div>
                            <div className="text-right">
                                <div className="font-mono text-3xl text-red font-bold">{setup.lapTime}</div>
                                <div className="flex items-center gap-1 text-foreground/40 justify-end mt-1">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4l3 6h6l-5 4 2 7-6-4-6 4 2-7-5-4h6z" /></svg>
                                    <span className="font-mono text-xs">{setup.upvotes}</span>
                                </div>
                            </div>
                        </div>

                        {/* Parameters */}
                        <div className="mb-6">
                            <h4 className="text-xs font-sora font-semibold text-foreground/40 uppercase tracking-wider mb-3">Full Setup Parameters</h4>
                            <div className="grid grid-cols-2 gap-x-6 gap-y-0.5 text-xs">
                                {[
                                    { l: 'Front Wing', v: setup.setupData.frontWing },
                                    { l: 'Rear Wing', v: setup.setupData.rearWing },
                                    { l: 'Diff On', v: `${setup.setupData.diffOnThrottle}%` },
                                    { l: 'Diff Off', v: `${setup.setupData.diffOffThrottle}%` },
                                    { l: 'F. Camber', v: `${setup.setupData.frontCamber.toFixed(2)}°` },
                                    { l: 'R. Camber', v: `${setup.setupData.rearCamber.toFixed(2)}°` },
                                    { l: 'F. Toe', v: `${setup.setupData.frontToe.toFixed(2)}°` },
                                    { l: 'R. Toe', v: `${setup.setupData.rearToe.toFixed(2)}°` },
                                    { l: 'F. Susp', v: setup.setupData.frontSuspension },
                                    { l: 'R. Susp', v: setup.setupData.rearSuspension },
                                    { l: 'F. ARB', v: setup.setupData.frontAntiRollBar },
                                    { l: 'R. ARB', v: setup.setupData.rearAntiRollBar },
                                    { l: 'F. Height', v: `${setup.setupData.frontRideHeight}mm` },
                                    { l: 'R. Height', v: `${setup.setupData.rearRideHeight}mm` },
                                    { l: 'Brake Press', v: `${setup.setupData.brakePressure}%` },
                                    { l: 'Brake Bias', v: `${setup.setupData.brakeBias}%` },
                                    { l: 'F. Tyre', v: `${setup.setupData.frontTyrePressure} psi` },
                                    { l: 'R. Tyre', v: `${setup.setupData.rearTyrePressure} psi` },
                                ].map(p => (
                                    <div key={p.l} className="flex items-center justify-between py-1.5 border-b border-border-red/20">
                                        <span className="font-jakarta text-foreground/60">{p.l}</span>
                                        <span className="font-mono font-medium text-foreground">{p.v}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center gap-2 mt-3">
                                <span className="text-[10px] font-sora text-foreground/40 uppercase">Compound:</span>
                                <div className="w-4 h-4 rounded-full border-2" style={{ borderColor: compoundColors[setup.setupData.tyreCompound] || '#888' }} />
                                <span className="font-mono text-xs font-medium">{setup.setupData.tyreCompound.toUpperCase()}</span>
                            </div>
                        </div>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link href="/signup" className="flex-1 text-center px-6 py-2.5 bg-red text-white font-sora font-semibold rounded-lg hover:bg-red/90 hover:shadow-[0_0_20px_var(--red-glow)] transition-all text-sm">
                                Join TracklabX
                            </Link>
                            <Link href="/setup" className="flex-1 text-center px-6 py-2.5 border border-border-red text-foreground font-sora font-medium rounded-lg hover:border-border-red-hover transition-all text-sm">
                                Browse Setups
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
