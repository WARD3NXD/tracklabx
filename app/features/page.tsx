'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Footer } from '@/components/layout/Footer';

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const features = [
    {
        title: 'Setup Database',
        description: 'Browse thousands of community-shared car setups filtered by track, team, weather conditions, and session type. Every parameter from front wing to tyre pressure, visualized with professional telemetry charts.',
        icon: (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
        ),
    },
    {
        title: 'Live Race Calendar',
        description: 'Full 2025 F1 season with every session — FP1, FP2, FP3, Sprint Shootout, Sprint, Qualifying, and Race. All times convert to your timezone with one click, no more Googling session times.',
        icon: (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
        ),
    },
    {
        title: 'Grid Predictions',
        description: 'View predicted starting grids for every upcoming race, shown in a real F1 starting grid formation. See confidence percentages for each predicted position and compare with community votes.',
        icon: (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
        ),
    },
    {
        title: 'Telemetry Charts',
        description: 'Four professional charts for every setup: tyre pressure gauges, aero balance visualization, suspension radar, and lap time comparison — exactly like pit wall telemetry software.',
        icon: (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
        ),
    },
    {
        title: 'PDF Export',
        description: 'Download any setup as a beautifully formatted PDF with track name, conditions, full parameter table, and all four charts. Perfect for printing and keeping at your desk during races.',
        icon: (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
        ),
    },
    {
        title: 'Share Links',
        description: 'Generate unique share URLs for any setup with rich Open Graph preview cards showing circuit image, lap time, and team. Share your fastest setups on Discord, Twitter, or anywhere.',
        icon: (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>
        ),
    },
];

const comparison = [
    { feature: 'Free to view setups', us: true, them: true },
    { feature: 'Account to post', us: true, them: true },
    { feature: 'Race Calendar', us: true, them: false },
    { feature: 'Timezone support', us: true, them: false },
    { feature: 'Grid Predictions', us: true, them: false },
    { feature: 'PDF export', us: true, them: false },
    { feature: 'Share links with OG cards', us: true, them: false },
    { feature: 'Telemetry charts', us: true, them: false },
    { feature: 'Community upvotes', us: true, them: true },
];

export default function FeaturesPage() {
    return (
        <div className="bg-background text-foreground">
            {/* Hero */}
            <section className="py-24 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.08 } } }}>
                        <motion.span variants={fadeUp} className="inline-block px-4 py-1.5 rounded-full border border-red/30 bg-red-dim text-red text-xs font-mono font-medium tracking-wider uppercase mb-6">
                            Features
                        </motion.span>
                        <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl md:text-6xl font-sora font-800 leading-tight mb-6">
                            Built for <span className="text-red">Speed</span>
                        </motion.h1>
                        <motion.p variants={fadeUp} className="text-lg text-foreground/60 font-jakarta max-w-2xl mx-auto">
                            Every feature designed to make you faster — from setup tuning with professional telemetry charts to timezone-aware race tracking.
                        </motion.p>
                    </motion.div>
                </div>
            </section>

            {/* Feature Sections — Alternating */}
            <section className="py-12 px-4">
                <div className="max-w-6xl mx-auto space-y-24">
                    {features.map((feature, i) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className={`flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}
                        >
                            {/* Mock Visual */}
                            <div className="flex-1 w-full">
                                <div className="card-glow rounded-2xl bg-surface p-8 aspect-video flex items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-red/5 to-transparent" />
                                    <div className="text-red/20 relative z-10">{feature.icon}</div>
                                    <div className="absolute bottom-4 right-4 font-mono text-red/20 text-6xl font-bold">
                                        {String(i + 1).padStart(2, '0')}
                                    </div>
                                </div>
                            </div>
                            {/* Text */}
                            <div className="flex-1 space-y-4">
                                <div className="w-10 h-10 rounded-lg bg-red-dim flex items-center justify-center text-red">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-sora font-bold">{feature.title}</h3>
                                <p className="text-foreground/60 font-jakarta leading-relaxed">{feature.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Comparison Table */}
            <section className="py-24 px-4 bg-surface">
                <div className="max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl sm:text-4xl font-sora font-bold mb-4">
                            How We <span className="text-red">Compare</span>
                        </h2>
                        <p className="text-foreground/60 font-jakarta">TracklabX vs. other setup platforms</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="card-glow rounded-xl overflow-hidden bg-background"
                    >
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border-red">
                                    <th className="text-left px-6 py-4 font-sora font-semibold">Feature</th>
                                    <th className="text-center px-6 py-4 font-sora font-semibold text-red">TracklabX</th>
                                    <th className="text-center px-6 py-4 font-sora font-semibold text-foreground/50">Others</th>
                                </tr>
                            </thead>
                            <tbody>
                                {comparison.map((row) => (
                                    <tr key={row.feature} className="border-b border-border-red/50">
                                        <td className="px-6 py-3 font-jakarta text-foreground/80">{row.feature}</td>
                                        <td className="px-6 py-3 text-center">
                                            {row.us ? (
                                                <span className="text-red font-mono font-bold">✓</span>
                                            ) : (
                                                <span className="text-foreground/20 font-mono">—</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-3 text-center">
                                            {row.them ? (
                                                <span className="text-foreground/50 font-mono">✓</span>
                                            ) : (
                                                <span className="text-foreground/20 font-mono">—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </motion.div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <h2 className="text-3xl sm:text-4xl font-sora font-bold mb-4">
                            Start for <span className="text-red">Free</span> Today
                        </h2>
                        <p className="text-foreground/60 font-jakarta mb-8">
                            No credit card required. Sign up, share your first setup, and start climbing the leaderboard.
                        </p>
                        <Link
                            href="/signup"
                            className="inline-flex px-8 py-3.5 bg-red text-white font-sora font-semibold rounded-lg hover:bg-red/90 hover:shadow-[0_0_30px_var(--red-glow)] transition-all text-sm"
                        >
                            Create Free Account
                        </Link>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
