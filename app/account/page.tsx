'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { getUserProfile } from '@/lib/firestore';
import { getTeamById, teams } from '@/lib/data/teams';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface UserProfile {
    id: string;
    displayName?: string;
    email?: string;
    favouriteTeam?: string | null;
    savedSetups?: string[];
    createdAt?: { seconds: number };
}

export default function AccountPage() {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loadingProfile, setLoadingProfile] = useState(true);

    // Edit states
    const [editing, setEditing] = useState(false);
    const [editName, setEditName] = useState('');
    const [editTeam, setEditTeam] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/signin');
        }
    }, [user, loading, router]);

    useEffect(() => {
        async function load() {
            if (!user) return;
            try {
                const p = await getUserProfile(user.uid) as UserProfile | null;
                setProfile(p);
                if (p) {
                    setEditName(p.displayName || user.displayName || '');
                    setEditTeam(p.favouriteTeam || '');
                }
            } catch {
                // Profile may not exist yet
            } finally {
                setLoadingProfile(false);
            }
        }
        if (user) load();
    }, [user]);

    const handleSave = async () => {
        if (!user) return;
        setSaving(true);
        try {
            // Update Firebase Auth display name
            if (editName !== user.displayName) {
                await updateProfile(user, { displayName: editName });
            }
            // Update Firestore profile
            await updateDoc(doc(db, 'users', user.uid), {
                displayName: editName,
                favouriteTeam: editTeam || null,
            });
            setProfile(prev => prev ? { ...prev, displayName: editName, favouriteTeam: editTeam || null } : prev);
            setEditing(false);
        } catch {
            // silently fail
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    if (loading || !user) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-red border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const team = profile?.favouriteTeam ? getTeamById(profile.favouriteTeam) : null;
    const joinedDate = profile?.createdAt
        ? new Date(profile.createdAt.seconds * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        : 'Just now';

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="max-w-3xl mx-auto px-4 py-12">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    {/* Profile Header */}
                    <div className="card-glow rounded-2xl p-8 bg-surface mb-6">
                        <div className="flex items-start gap-5">
                            {/* Avatar */}
                            <div
                                className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: team?.color || '#ED2839' }}
                            >
                                <span className="text-white text-3xl font-mono font-bold">
                                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                                </span>
                            </div>

                            <div className="flex-1 min-w-0">
                                <h1 className="text-2xl font-sora font-bold truncate">
                                    {user.displayName || 'Racer'}
                                </h1>
                                <p className="text-sm text-foreground/40 font-mono truncate">{user.email}</p>
                                <div className="flex items-center gap-3 mt-2">
                                    {team && (
                                        <span className="flex items-center gap-1.5 text-xs font-jakarta text-foreground/60">
                                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: team.color }} />
                                            {team.name}
                                        </span>
                                    )}
                                    <span className="text-[10px] font-mono text-foreground/30">
                                        Joined {joinedDate}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => setEditing(!editing)}
                                className="px-4 py-2 text-xs font-sora font-medium border border-border-red rounded-lg hover:border-border-red-hover transition-all"
                            >
                                {editing ? 'Cancel' : 'Edit Profile'}
                            </button>
                        </div>

                        {/* Edit Form */}
                        {editing && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mt-6 pt-6 border-t border-border-red/30 space-y-4"
                            >
                                <div>
                                    <label className="block text-xs font-sora font-medium text-foreground/60 mb-1.5">Display Name</label>
                                    <input
                                        type="text"
                                        value={editName}
                                        onChange={e => setEditName(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-background border border-border-red rounded-lg text-sm font-jakarta text-foreground focus:outline-none focus:border-red transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-sora font-medium text-foreground/60 mb-1.5">Favourite Team</label>
                                    <select
                                        value={editTeam}
                                        onChange={e => setEditTeam(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-background border border-border-red rounded-lg text-sm font-jakarta text-foreground focus:outline-none focus:border-red transition-colors"
                                    >
                                        <option value="">None</option>
                                        {teams.map(t => (
                                            <option key={t.id} value={t.id}>{t.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="px-6 py-2.5 bg-red text-white font-sora font-semibold rounded-lg hover:bg-red/90 hover:shadow-[0_0_15px_var(--red-glow)] transition-all text-sm disabled:opacity-50"
                                >
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </motion.div>
                        )}
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        {[
                            { label: 'Setups Posted', value: '0', icon: '🔧' },
                            { label: 'Setups Saved', value: String(profile?.savedSetups?.length || 0), icon: '📌' },
                            { label: 'Upvotes Received', value: '0', icon: '⭐' },
                        ].map(stat => (
                            <div key={stat.label} className="card-glow rounded-xl p-5 bg-surface text-center">
                                <span className="text-xl mb-2 block">{stat.icon}</span>
                                <div className="font-mono text-2xl text-red font-bold">{stat.value}</div>
                                <div className="text-[10px] text-foreground/40 font-jakarta mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Quick Actions */}
                    <div className="card-glow rounded-2xl p-6 bg-surface mb-6">
                        <h3 className="text-sm font-sora font-semibold text-foreground/40 uppercase tracking-wider mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Link
                                href="/setup"
                                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-background border border-border-red hover:border-red hover:shadow-[0_0_15px_var(--red-glow)] transition-all"
                            >
                                <div className="w-9 h-9 rounded-lg bg-red-dim flex items-center justify-center text-red">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
                                </div>
                                <div>
                                    <div className="text-sm font-sora font-medium">Browse Setups</div>
                                    <div className="text-[10px] text-foreground/40 font-jakarta">Find setups for any track</div>
                                </div>
                            </Link>
                            <Link
                                href="/calendar"
                                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-background border border-border-red hover:border-red hover:shadow-[0_0_15px_var(--red-glow)] transition-all"
                            >
                                <div className="w-9 h-9 rounded-lg bg-red-dim flex items-center justify-center text-red">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                                </div>
                                <div>
                                    <div className="text-sm font-sora font-medium">Race Calendar</div>
                                    <div className="text-[10px] text-foreground/40 font-jakarta">View the 2025 F1 schedule</div>
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Sign Out */}
                    <button
                        onClick={handleLogout}
                        className="w-full py-3 border border-red/30 text-red font-sora font-medium rounded-xl hover:bg-red-dim transition-all text-sm"
                    >
                        Sign Out
                    </button>
                </motion.div>
            </div>
        </div>
    );
}
