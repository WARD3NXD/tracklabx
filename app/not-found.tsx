'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import CircuitIconInline from '@/components/ui/CircuitIconInline';

const RANDOM_CIRCUITS = [
    'bahrain',
    'monaco',
    'silverstone',
    'spa',
    'suzuka',
    'interlagos',
];

function RandomCircuitWatermark() {
    const index = Math.floor(Math.random() * RANDOM_CIRCUITS.length);
    const id = RANDOM_CIRCUITS[index]!;
    return (
        <CircuitIconInline
            circuitId={id}
            className="circuit-watermark"
            animate
            loop
            color="var(--red)"
            opacity={0.06}
        />
    );
}

export default function NotFoundPage() {
    return (
        <div className="min-h-screen bg-carbon text-snow flex items-center justify-center px-4 overflow-hidden relative noise-overlay">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(237,40,57,0.05)_0%,_transparent_50%)]" />

            <div className="absolute inset-0 flex items-center justify-center mix-blend-screen pointer-events-none">
                <RandomCircuitWatermark />
            </div>

            <div className="text-center relative z-10 flex flex-col items-center">
                {/* Glitch 404 */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative mb-8"
                >
                    <div className="text-[12rem] lg:text-[20rem] font-barlow font-black text-red tracking-tighter leading-none select-none opacity-80 mix-blend-screen blur-[2px] absolute -top-1 -left-1">
                        404
                    </div>
                    <div className="text-[12rem] lg:text-[20rem] font-barlow font-black text-snow tracking-tighter leading-none select-none relative z-10 drop-shadow-[0_0_30px_rgba(237,40,57,0.3)]">
                        404
                    </div>
                    <div className="text-[12rem] lg:text-[20rem] font-barlow font-black text-red-hot tracking-tighter leading-none select-none opacity-50 mix-blend-screen blur-[4px] absolute top-2 right-2">
                        404
                    </div>
                </motion.div>

                {/* Copy */}
                <motion.h1
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="text-3xl sm:text-5xl font-barlow font-black uppercase tracking-widest text-snow mb-4"
                >
                    Telemetry <span className="text-red">Lost</span>
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="flex flex-col items-center mb-12"
                >
                    <div className="flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm font-mono tracking-widest text-snow/50 mb-4">
                        <span>ERR_SECTOR_NOT_FOUND</span>
                        <span className="text-red font-black">|</span>
                        <span>COMMS_OFFLINE</span>
                        <span className="text-red font-black">|</span>
                        <span>0.00 GB/S</span>
                    </div>
                    <p className="text-snow/40 font-jakarta max-w-md">
                        The designated route is invalid. The sector you are attempting to access does not exist in the current calendar.
                    </p>
                </motion.div>

                {/* Sleek CTA */}
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.6 }}>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-3 px-10 py-5 bg-red text-white font-barlow font-bold text-lg uppercase tracking-wider rounded-none hover:bg-red-hot hover:shadow-[0_0_40px_rgba(237,40,57,0.5)] transition-all group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                        <span className="relative z-10">Return to Pit Wall</span>
                        <div className="relative z-10 w-8 h-px bg-white group-hover:w-12 transition-all duration-300" />
                        <svg className="relative z-10" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
