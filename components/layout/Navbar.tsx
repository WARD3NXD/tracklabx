'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLiveStatus } from '@/hooks/useLiveStatus';

export function Navbar() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { isLive } = useLiveStatus();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        handleScroll();
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const links = [
        { href: '/', label: 'Home' },
        { href: '/features', label: 'Features' },
        { href: '/calendar', label: 'Calendar' },
        { href: '/standings', label: 'Standings' },
        { href: '/setup', label: 'Setups' },
    ];

    const handleLogout = async () => {
        await logout();
        setProfileOpen(false);
        router.push('/');
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'border-b border-border-red backdrop-blur-xl bg-gunmetal-deep/90' : 'bg-transparent border-transparent'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center">
                        <img
                            src="/assets/Logo/logo.svg"
                            alt="TracklabX Logo"
                            className="h-5 w-auto object-contain"
                        />
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-8">
                        {links.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="nav-link text-sm font-barlow font-medium text-foreground/70 hover:text-foreground transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link
                            href="/live"
                            className={`flex items-center gap-2 text-sm font-barlow font-semibold transition-colors ${isLive
                                    ? 'text-red hover:text-red-hot'
                                    : 'text-foreground/70 hover:text-foreground'
                                }`}
                        >
                            {isLive && <span className="live-dot" />}
                            <span>{isLive ? 'LIVE' : 'Live Timing'}</span>
                        </Link>
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center gap-3">


                        {/* Auth-aware buttons */}
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border-red hover:border-border-red-hover transition-all"
                                >
                                    <div className="w-7 h-7 rounded-full bg-red flex items-center justify-center">
                                        <span className="text-white text-xs font-mono font-bold">
                                            {(user.displayName || user.email || 'U')[0].toUpperCase()}
                                        </span>
                                    </div>
                                    <span className="text-xs font-barlow font-medium text-foreground/70 max-w-[100px] truncate">
                                        {user.displayName || user.email}
                                    </span>
                                </button>
                                {profileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="absolute right-0 top-12 w-48 rounded-xl bg-surface border border-border-red shadow-lg overflow-hidden z-50"
                                    >
                                        <div className="px-4 py-3 border-b border-border-red/30">
                                            <p className="text-xs font-barlow font-medium truncate">{user.displayName}</p>
                                            <p className="text-[10px] text-foreground/40 font-mono truncate">{user.email}</p>
                                        </div>
                                        <Link href="/account" onClick={() => setProfileOpen(false)} className="block px-4 py-2.5 text-xs font-barlow text-foreground/70 hover:text-foreground hover:bg-red-dim transition-colors">
                                            My Account
                                        </Link>
                                        <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-xs font-barlow text-red hover:bg-red-dim transition-colors">
                                            Sign Out
                                        </button>
                                    </motion.div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link
                                    href="/signin"
                                    className="hidden sm:inline-flex px-4 py-2 text-sm font-barlow font-medium border border-border-red text-foreground rounded-lg hover:border-border-red-hover hover:shadow-[0_0_15px_var(--red-glow)] transition-all"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/signup"
                                    className="hidden sm:inline-flex px-4 py-2 text-sm font-barlow font-semibold bg-red text-white rounded-lg hover:bg-red/90 hover:shadow-[0_0_20px_var(--red-glow)] transition-all"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}

                        {/* Mobile Toggle */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="md:hidden w-9 h-9 rounded-lg border border-border-red flex items-center justify-center text-foreground/70"
                            aria-label="Toggle menu"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                {mobileOpen ? (
                                    <path d="M18 6L6 18M6 6l12 12" />
                                ) : (
                                    <path d="M3 12h18M3 6h18M3 18h18" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:hidden border-t border-border-red bg-background/95 backdrop-blur-xl"
                >
                    <div className="px-4 py-4 space-y-2">
                        {links.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className="block px-3 py-2 rounded-lg text-sm font-sora font-medium text-foreground/70 hover:text-foreground hover:bg-red-dim transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="flex flex-col gap-2 pt-2">
                            <Link
                                href="/live"
                                onClick={() => setMobileOpen(false)}
                                className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-barlow font-semibold border ${isLive
                                        ? 'text-red border-red/60 bg-red/5'
                                        : 'text-foreground/70 border-border-red hover:text-foreground'
                                    }`}
                            >
                                {isLive && <span className="live-dot" />}
                                <span>{isLive ? 'LIVE SESSION' : 'Live Timing'}</span>
                            </Link>
                            {user ? (
                                <button onClick={handleLogout} className="flex-1 text-center px-4 py-2 text-sm font-sora font-medium border border-red text-red rounded-lg">
                                    Sign Out
                                </button>
                            ) : (
                                <>
                                    <Link href="/signin" className="flex-1 text-center px-4 py-2 text-sm font-sora font-medium border border-border-red text-foreground rounded-lg">
                                        Sign In
                                    </Link>
                                    <Link href="/signup" className="flex-1 text-center px-4 py-2 text-sm font-sora font-semibold bg-red text-white rounded-lg">
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </nav>
    );
}
