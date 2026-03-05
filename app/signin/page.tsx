'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';

function CircuitSVG() {
    return (
        <svg viewBox="0 0 400 300" className="w-full h-full opacity-10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M100 50 Q125 40 150 50 L200 60 Q225 65 240 90 L250 125 Q255 150 240 170 L210 200 Q190 215 170 210 L140 200 Q120 195 110 180 L90 140 Q80 115 90 90 Z" />
            <motion.path
                d="M100 50 Q125 40 150 50 L200 60 Q225 65 240 90 L250 125 Q255 150 240 170 L210 200 Q190 215 170 210 L140 200 Q120 195 110 180 L90 140 Q80 115 90 90 Z"
                stroke="var(--red)"
                strokeWidth="4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 4, ease: "easeInOut", repeat: Infinity, repeatType: "loop" }}
            />
        </svg>
    );
}

export default function SignInPage() {
    const { user, signIn, signInWithGoogle } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            router.replace('/account');
        }
    }, [user, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await signIn(email, password);
            router.push('/account');
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Sign in failed';
            if (message.includes('user-not-found') || message.includes('wrong-password') || message.includes('invalid-credential')) {
                setError('INVALID CREDENTIALS DETECTED');
            } else {
                setError(message.toUpperCase());
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogle = async () => {
        setError('');
        try {
            await signInWithGoogle();
            router.push('/account');
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Google sign in failed';
            setError(message.toUpperCase());
        }
    };

    return (
        <div className="min-h-screen bg-carbon text-snow flex flex-col md:flex-row relative noise-overlay overflow-hidden">
            {/* Split Left: Branding & Graphic */}
            <div className="hidden md:flex flex-1 flex-col justify-between p-12 bg-gunmetal-deep relative border-r border-snow/10 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(237,40,57,0.1)_0%,_transparent_60%)]" />
                <div className="absolute inset-0 flex items-center justify-center p-20 mix-blend-screen pointer-events-none">
                    <CircuitSVG />
                </div>

                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-none bg-red flex items-center justify-center shadow-[0_0_20px_rgba(237,40,57,0.4)]">
                        <span className="text-white font-barlow font-bold text-2xl uppercase">TX</span>
                    </div>
                    <span className="font-barlow font-black text-3xl uppercase tracking-widest text-snow">
                        Tracklab<span className="text-red">X</span>
                    </span>
                </div>

                <div className="relative z-10">
                    <h1 className="text-5xl lg:text-7xl font-barlow font-black uppercase tracking-tight leading-none mb-4">
                        Master the<br />
                        <span className="text-red">Telemetry</span>
                    </h1>
                    <p className="text-snow/50 font-jakarta max-w-sm">
                        Access millions of data points to build the perfect setup and dominate every circuit on the calendar.
                    </p>
                </div>
            </div>

            {/* Split Right: Form Container */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md relative z-10"
                >
                    <div className="md:hidden flex items-center gap-2 mb-12">
                        <div className="w-8 h-8 rounded-none bg-red flex items-center justify-center shadow-[0_0_15px_rgba(237,40,57,0.4)]">
                            <span className="text-white font-barlow font-bold text-sm uppercase">TX</span>
                        </div>
                        <span className="font-barlow font-black text-xl uppercase tracking-widest text-snow">
                            Tracklab<span className="text-red">X</span>
                        </span>
                    </div>

                    <div className="mb-10">
                        <h2 className="text-4xl font-barlow font-black uppercase tracking-wider mb-2">Access Portal</h2>
                        <p className="text-sm text-snow/40 font-mono tracking-widest uppercase">Secure Telemetry Access</p>
                    </div>

                    {error && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-6">
                            <div className="px-4 py-3 bg-red/10 border-l-4 border-red text-red text-xs font-mono tracking-widest uppercase">
                                {error}
                            </div>
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Custom Animated Input: Email */}
                        <div className="relative group">
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full bg-transparent border-b border-snow/20 py-3 text-snow font-mono placeholder-transparent focus:outline-none peer"
                                placeholder="Email"
                                required
                            />
                            <label className="absolute left-0 top-3 text-sm font-mono tracking-widest uppercase text-snow/40 transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-red peer-valid:-top-4 peer-valid:text-[10px] pointer-events-none">
                                Pilot Designation [Email]
                            </label>
                            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-red transition-all duration-300 peer-focus:w-full" />
                        </div>

                        {/* Custom Animated Input: Password */}
                        <div className="relative group">
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full bg-transparent border-b border-snow/20 py-3 text-snow font-mono placeholder-transparent focus:outline-none peer"
                                placeholder="Password"
                                required
                            />
                            <label className="absolute left-0 top-3 text-sm font-mono tracking-widest uppercase text-snow/40 transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-red peer-valid:-top-4 peer-valid:text-[10px] pointer-events-none">
                                Security Code [Password]
                            </label>
                            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-red transition-all duration-300 peer-focus:w-full" />

                            <div className="absolute right-0 top-3">
                                <button type="button" className="text-[10px] font-mono tracking-widest uppercase text-snow/30 hover:text-red transition-colors">
                                    Override Code?
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 mt-4 bg-red text-white font-barlow font-bold text-lg uppercase tracking-wider rounded-none hover:bg-red-hot hover:shadow-[0_0_30px_rgba(237,40,57,0.4)] transition-all flex items-center justify-center gap-3 disabled:opacity-30 group"
                        >
                            <span className="relative z-10">{loading ? 'Authenticating...' : 'Initialize'}</span>
                            {!loading && (
                                <>
                                    <div className="relative z-10 w-8 h-px bg-white group-hover:w-12 transition-all duration-300" />
                                    <svg className="relative z-10" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="flex items-center gap-4 my-8">
                        <div className="flex-1 h-px bg-snow/10" />
                        <span className="text-[10px] font-mono tracking-widest uppercase text-snow/30">External Link</span>
                        <div className="flex-1 h-px bg-snow/10" />
                    </div>

                    <button
                        onClick={handleGoogle}
                        className="w-full py-4 border border-snow/20 text-snow font-barlow font-bold text-lg uppercase tracking-wider rounded-none hover:border-snow/40 hover:bg-snow/5 transition-all flex items-center justify-center gap-3"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                        Google Access
                    </button>

                    <p className="mt-10 text-center text-xs font-mono tracking-widest uppercase text-snow/40">
                        Unregistered?{' '}
                        <Link href="/signup" className="text-red font-bold hover:text-red-hot transition-colors underline decoration-red/30 underline-offset-4">
                            Request Clearance
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
