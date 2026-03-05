'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Footer } from '@/components/layout/Footer';
import { tracks } from '@/lib/data/tracks';
import { calendar2026, getRaceStatus } from '@/lib/data/calendar';
import { getFlagEmoji } from '@/lib/utils';
import { getTrackSvg } from '@/lib/data/track-layouts';
import { getTrackSvgById } from '@/lib/data/track-layouts';
import { useState, useEffect } from 'react';
import { LiveSessionWidget } from '@/components/live/LiveSessionWidget';

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.8 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
};

const features = [
  { title: 'Setup Database', desc: 'Browse and share F1 25 car setups for every track, team, and condition.', icon: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z' },
  { title: 'Race Calendar', desc: 'Full 2025 & 2026 F1 seasons with timezone-aware scheduling and grid predictions.', icon: 'M3 4h18M16 2v4M8 2v4M3 10h18' },
  { title: 'Export & Share', desc: 'Download setups as PDF or share via unique links with preview cards.', icon: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3' },
  { title: 'Leaderboards', desc: 'Compare lap times, upvote the fastest setups, and climb the rankings.', icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm14 14v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' },
];

const howItWorks = [
  { step: '01', title: 'Pick Your\nTrack', desc: 'Select from 24 F1 circuits with live community data', icon: 'M9 20l-5.447-2.724A1 1 0 0 1 3 16.382V5.618a1 1 0 0 1 1.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0 0 21 18.382V7.618a1 1 0 0 0-.553-.894L15 4m0 13V4m0 0L9 7' },
  { step: '02', title: 'Set Your\nConditions', desc: 'Choose weather, track temp & session type for precision tuning', icon: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z' },
  { step: '03', title: 'Get Your\nSetup', desc: 'Instantly see the fastest community setups + lap prediction', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
];

function HeroCircuitSVG() {
  return (
    <svg viewBox="0 0 800 600" className="w-full h-full text-foreground opacity-50" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M200 100 Q250 80 300 100 L400 120 Q450 130 480 180 L500 250 Q510 300 480 340 L420 400 Q380 430 340 420 L280 400 Q240 390 220 360 L180 280 Q160 230 180 180 Z" strokeOpacity="1" />
      <path d="M350 200 Q380 190 400 210 L420 240 Q430 260 420 280 L400 300 Q380 310 360 300 L340 280 Q330 260 340 240 Z" strokeOpacity="0.3" />
      <circle cx="600" cy="150" r="80" strokeOpacity="0.1" strokeDasharray="4 8" />
      <line x1="100" y1="500" x2="700" y2="500" strokeOpacity="0.1" strokeDasharray="8 12" />
    </svg>
  );
}

// ─── Countdown Hook ───
function useCountdown(targetDate: string) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const update = () => {
      const diff = Math.max(0, new Date(targetDate).getTime() - Date.now());
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);
  return timeLeft;
}

export default function HomePage() {
  // Find the next upcoming race
  const nextRace = calendar2026.find(r => getRaceStatus(r) === 'upcoming') || calendar2026[0];
  const countdown = useCountdown(nextRace.sessions.race);

  // Find next session
  const now = new Date();
  const allSessions = [
    { label: 'Free Practice 1', time: nextRace.sessions.fp1 },
    ...(nextRace.isSprint
      ? [{ label: 'Sprint Qualifying', time: nextRace.sessions.sprintShootout }, { label: 'Sprint Race', time: nextRace.sessions.sprint }]
      : [{ label: 'Free Practice 2', time: nextRace.sessions.fp2 }, { label: 'Free Practice 3', time: nextRace.sessions.fp3 }]),
    { label: 'Qualifying', time: nextRace.sessions.qualifying },
    { label: 'Race', time: nextRace.sessions.race },
  ].filter(s => s.time !== null);
  const nextSession = allSessions.find(s => new Date(s.time!) > now) || allSessions[allSessions.length - 1];

  return (
    <div className="bg-carbon text-snow overflow-hidden">
      {/* ─── HERO SECTION ─── */}
      <section className="relative min-h-[100vh] flex items-center justify-center noise-overlay overflow-hidden pb-20">
        <div className="timing-beam" />
        <div className="absolute inset-0 bg-carbon flex items-center justify-center overflow-hidden">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: 'linear' }} className="absolute w-[150vw] h-[150vh] opacity-[0.03] text-snow">
            <HeroCircuitSVG />
          </motion.div>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(237,40,57,0.15)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.1]" style={{ backgroundImage: 'linear-gradient(rgba(255,250,250,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,250,250,0.4) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 mt-16 sm:mt-0 flex flex-col items-center">
          <motion.div variants={stagger} initial="hidden" animate="visible" className="w-full text-center">
            <motion.h1 variants={fadeUp} className="text-[12vw] sm:text-[9rem] lg:text-[10rem] font-barlow font-black text-snow leading-[0.85] tracking-[-0.02em] uppercase mb-8">
              Build the <br /> Fastest Setup.<br />
              <span className="text-red drop-shadow-[0_0_40px_rgba(237,40,57,0.3)]">Own Every Lap.</span>
            </motion.h1>
            <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm font-mono tracking-widest text-snow/70 mb-12">
              <span>24 CIRCUITS</span><span className="text-red font-black">|</span><span>10 TEAMS</span><span className="text-red font-black">|</span><span>1,247 SETUPS</span>
            </motion.div>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/signup" className="button relative inline-flex items-center justify-center px-10 py-4 bg-red text-white font-barlow font-bold text-lg tracking-wider rounded-none uppercase" style={{ boxShadow: 'var(--shadow-glow-md)' }}>
                Get Started
              </Link>
              <Link href="/setup" className="button group relative inline-flex items-center justify-center px-10 py-4 border border-border-red text-snow font-barlow font-bold text-lg tracking-wider overflow-hidden rounded-none uppercase">
                <div className="absolute inset-0 bg-red origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-400 ease-in-out z-0" />
                <span className="relative z-10 transition-colors duration-200 group-hover:text-white">Browse Setups</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── FEATURE PANELS ─── */}
      <section className="py-32 px-4 bg-carbon relative border-t border-border-red/20 shadow-[0_-20px_40px_rgba(0,0,0,0.5)] z-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }}
                className="group relative bg-gunmetal-deep p-8 overflow-hidden min-h-[300px] flex flex-col justify-end transition-all duration-400 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(237,40,57,0.15)] border border-snow/5">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-transparent group-hover:bg-gradient-to-r group-hover:from-red group-hover:to-red-hot transition-all duration-300" />
                <div className="absolute -top-6 -right-4 font-barlow font-black text-[12rem] text-red opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 leading-none select-none pointer-events-none">0{i + 1}</div>
                <div className="relative z-10 text-red mb-6"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d={feature.icon} /></svg></div>
                <h3 className="relative z-10 font-barlow font-bold text-2xl uppercase tracking-wider mb-2 text-snow">{feature.title}</h3>
                <p className="relative z-10 text-sm text-snow/50 font-jakarta leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TRACK CAROUSEL ─── */}
      <section className="py-32 px-4 bg-gunmetal-deep relative border-t border-border-red/10 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(rgba(255,250,250,1) 1px, transparent 1px)', backgroundSize: '100% 40px' }} />
        <div className="max-w-[1400px] mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-4xl sm:text-6xl font-barlow font-black uppercase tracking-tight mb-2"><span className="text-red">24</span> Circuits.</h2>
              <p className="text-snow/50 font-mono text-sm uppercase tracking-widest">Every layout available for setup testing.</p>
            </div>
            <Link href="/setup" className="button inline-flex items-center gap-2 text-red font-mono font-bold text-sm tracking-widest uppercase hover:text-red-hot">
              View All Tracks<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
          </motion.div>
          <div className="overflow-x-auto pb-12 -mx-4 px-4 sm:-mx-8 sm:px-8 scrollbar-hide flex gap-6 snap-x snap-mandatory" style={{ maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)' }}>
            {tracks.map((track, i) => (<TrackCard key={track.id} track={track} delay={i * 0.05} />))}
          </div>
        </div>
      </section>

      {/* ─── SECTION DIVIDER ─── */}
      <div className="h-px bg-[rgba(255,250,250,0.04)]" />

      {/* Live session widget – only renders (and polls OpenF1) when a session is actually live */}
      <LiveSessionWidget />

      {/* ═══ SECTION 1: UPCOMING RACE COUNTDOWN ═══ */}
      <section className="py-20 md:py-32 px-4 bg-gunmetal-deep relative overflow-hidden">
        {/* Red gradient from right */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,_rgba(237,40,57,0.1)_0%,_transparent_60%)]" />
        {/* Circuit SVG watermark */}
        <motion.div
          animate={{ x: [0, 8, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute right-[-5%] top-[10%] w-[45%] h-[80%] opacity-[0.04] pointer-events-none hidden md:block"
        >
          {getTrackSvg(nextRace.id) && (
            <img src={getTrackSvg(nextRace.id)} alt="" className="w-full h-full object-contain" style={{ filter: 'brightness(10)' }} />
          )}
        </motion.div>

        <div className="max-w-[1400px] mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.7 }}>
            {/* Label */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 rounded-full bg-red animate-pulse" />
              <span className="font-barlow font-bold text-[0.85rem] text-red tracking-[0.2em] uppercase">Next Race</span>
            </div>

            {/* Round badge */}
            <div className="font-barlow font-bold text-[0.85rem] text-red tracking-[0.2em] uppercase mb-2">
              Round {nextRace.round.toString().padStart(2, '0')}
            </div>

            {/* Race name */}
            <h2 className="font-barlow font-black text-4xl sm:text-5xl md:text-7xl uppercase tracking-tight leading-[0.95] mb-3 max-w-2xl">
              {nextRace.country} <span className="text-red">Grand Prix</span>
            </h2>

            {/* Circuit + country */}
            <div className="flex items-center gap-3 mb-10 text-snow/50 font-jakarta">
              <span>{nextRace.circuitName}</span>
              <span className="text-snow/20">·</span>
              <span className="text-xl">{getFlagEmoji(nextRace.countryCode)}</span>
              <span>{nextRace.country}</span>
            </div>

            {/* Countdown blocks */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-10 max-w-xl">
              {[
                { value: countdown.days, label: 'DAYS' },
                { value: countdown.hours, label: 'HRS' },
                { value: countdown.minutes, label: 'MIN' },
                { value: countdown.seconds, label: 'SEC' },
              ].map((block, i) => (
                <motion.div
                  key={block.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="bg-gunmetal border border-[rgba(255,250,250,0.04)] p-4 text-center"
                >
                  <div className="font-mono text-3xl sm:text-4xl font-bold text-snow tabular-nums">
                    {block.value.toString().padStart(2, '0')}
                  </div>
                  <div className="font-jakarta text-[0.65rem] text-snow/40 uppercase tracking-widest mt-1">{block.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Next session */}
            <div className="mb-4">
              <span className="font-barlow font-bold text-sm text-red tracking-[0.15em] uppercase">Next Session: </span>
              <span className="font-jakarta text-snow/70">{nextSession.label}</span>
            </div>
            <div className="font-mono text-sm text-snow/50 mb-6">
              {nextSession.time && new Date(nextSession.time).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })}
              {' · '}
              {nextSession.time && new Date(nextSession.time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} UTC
            </div>

            <Link href={`/calendar/${nextRace.id}`} className="inline-flex items-center gap-2 text-red font-barlow font-bold text-sm tracking-widest uppercase group hover:text-red-hot transition-colors">
              View Full Weekend
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform group-hover:translate-x-1"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── SECTION DIVIDER ─── */}
      <div className="h-px bg-[rgba(255,250,250,0.04)]" />

      {/* ═══ SECTION 2: HOW IT WORKS ═══ */}
      <section className="py-20 md:py-32 px-4 bg-carbon relative">
        <div className="max-w-[900px] mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} className="text-center mb-16">
            <span className="font-barlow font-bold text-[0.8rem] text-red tracking-[0.2em] uppercase">How It Works</span>
            <h2 className="font-barlow font-black text-4xl sm:text-5xl md:text-6xl uppercase tracking-tight mt-3">
              Three Steps to <span className="text-red">Victory</span>
            </h2>
          </motion.div>

          <div className="relative">
            {/* Desktop connector line */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="hidden md:block absolute top-[50%] left-[16.67%] right-[16.67%] h-px bg-red/30 origin-left z-0"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 relative z-10">
              {howItWorks.map((step, i) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: 0.2 + i * 0.2, duration: 0.6 }}
                  className="group relative text-center p-8 bg-gunmetal-deep border border-snow/5 hover:border-red/30 transition-all duration-300"
                >
                  {/* Step number watermark */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                    <span className="font-barlow font-black text-[5rem] text-red opacity-[0.07] group-hover:opacity-[0.15] transition-opacity duration-500">{step.step}</span>
                  </div>

                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="text-red mb-4 flex justify-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={step.icon} /></svg>
                    </div>

                    {/* Step label */}
                    <span className="font-barlow font-bold text-[0.75rem] text-red tracking-[0.2em] uppercase">Step {step.step}</span>

                    {/* Heading */}
                    <h3 className="font-barlow font-bold text-[2rem] sm:text-[2.2rem] uppercase leading-tight mt-3 mb-4 whitespace-pre-line group-hover:-translate-y-[2px] transition-transform duration-300">{step.title}</h3>

                    {/* Body */}
                    <p className="font-jakarta text-[0.9rem] text-snow/50 leading-[1.7]">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION DIVIDER ─── */}
      <div className="h-px bg-[rgba(255,250,250,0.04)]" />

      {/* ═══ SECTION 3: TOP SETUP OF THE WEEK ═══ */}
      <section className="py-20 md:py-32 px-4 bg-gunmetal-deep relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto">
          {/* Section header */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} className="mb-12">
            <span className="font-barlow font-bold text-[0.85rem] text-red tracking-[0.2em] uppercase">This Week&apos;s Fastest</span>
            <h2 className="font-barlow font-black text-3xl sm:text-4xl md:text-[3.5rem] uppercase tracking-tight leading-tight mt-2">Setup Spotlight</h2>
          </motion.div>

          {/* Setup Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="bg-gunmetal-deep border border-snow/5 border-t-[3px] border-t-red overflow-hidden shadow-[0_0_40px_rgba(237,40,57,0.05)]"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left column — metadata */}
              <div className="p-8 md:p-12">
                {/* Team */}
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-3 h-3 rounded-full bg-[#00D2BE]" />
                  <span className="font-barlow font-bold text-sm uppercase tracking-widest text-snow/70">Mercedes AMG F1</span>
                </div>

                {/* Circuit */}
                <div className="mb-2">
                  <span className="font-barlow font-bold text-[0.7rem] text-snow/30 tracking-[0.2em] uppercase">Circuit</span>
                </div>
                <div className="flex items-center gap-3 mb-8">
                  <span className="text-xl">{getFlagEmoji('MC')}</span>
                  <span className="font-barlow font-bold text-xl uppercase">Monaco Grand Prix</span>
                </div>

                {/* Lap Time */}
                <div className="mb-2">
                  <span className="font-barlow font-bold text-[0.7rem] text-snow/30 tracking-[0.2em] uppercase">Lap Time</span>
                </div>
                <div className="font-mono text-[3rem] sm:text-[4rem] font-bold text-red leading-none mb-8">1:11.843</div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {['Qualifying', 'Dry', 'Soft'].map(tag => (
                    <span key={tag} className="px-3 py-1.5 bg-red/5 border border-red/10 text-snow/70 font-jakarta text-[0.7rem] uppercase tracking-wider">{tag}</span>
                  ))}
                </div>

                {/* Submitted by */}
                <p className="text-sm text-snow/30 font-jakarta mb-6">Submitted by <span className="text-snow/60">@speedmaster</span> · 3 days ago</p>

                {/* Actions */}
                <div className="flex items-center gap-6">
                  <Link href="/setup" className="inline-flex items-center gap-2 text-red font-barlow font-bold text-sm tracking-widest uppercase group hover:text-red-hot transition-colors">
                    View Full Setup
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform group-hover:translate-x-1"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </Link>
                  <div className="flex items-center gap-2 text-snow/50 font-mono text-sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
                    <span className="font-bold">247</span>
                  </div>
                </div>
              </div>

              {/* Right column — mini dashboard preview */}
              <div className="relative bg-carbon/50 p-8 md:p-12 flex flex-col justify-center gap-6 border-t lg:border-t-0 lg:border-l border-snow/5">
                {/* Fake aero chart */}
                <div>
                  <span className="font-barlow font-bold text-xs text-snow/30 tracking-[0.15em] uppercase mb-4 block">Aero Balance</span>
                  <div className="flex items-end gap-2 h-[100px]">
                    {[65, 42, 78, 55, 90, 68, 45, 82, 72, 58, 85, 48].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${h}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + i * 0.05, duration: 0.5 }}
                        className="flex-1 bg-red/60 hover:bg-red transition-colors"
                      />
                    ))}
                  </div>
                </div>

                {/* Fake lap comparison */}
                <div>
                  <span className="font-barlow font-bold text-xs text-snow/30 tracking-[0.15em] uppercase mb-4 block">Lap Time Comparison</span>
                  <div className="relative h-[80px]">
                    <svg viewBox="0 0 300 80" className="w-full h-full" fill="none">
                      <motion.path
                        d="M0 60 Q30 50 60 55 Q90 35 120 40 Q150 25 180 30 Q210 20 240 15 Q270 10 300 12"
                        stroke="#ED2839"
                        strokeWidth="2"
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5, duration: 1.5, ease: 'easeOut' }}
                      />
                      <motion.path
                        d="M0 65 Q30 60 60 62 Q90 50 120 52 Q150 40 180 45 Q210 35 240 30 Q270 28 300 25"
                        stroke="rgba(255,250,250,0.2)"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.7, duration: 1.5, ease: 'easeOut' }}
                      />
                    </svg>
                  </div>
                  <div className="flex gap-6 mt-2">
                    <div className="flex items-center gap-2"><div className="w-3 h-px bg-red" /><span className="font-mono text-[10px] text-snow/40">THIS SETUP</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-px bg-snow/20 border-t border-dashed border-snow/20" /><span className="font-mono text-[10px] text-snow/40">AVERAGE</span></div>
                  </div>
                </div>

                {/* Blur overlay for non-auth */}
                <div className="absolute inset-0 bg-gradient-to-t from-carbon/80 via-transparent to-transparent flex items-end justify-center pb-8 pointer-events-none">
                  <Link href="/signin" className="pointer-events-auto px-6 py-3 bg-red/90 hover:bg-red text-white font-barlow font-bold text-sm tracking-widest uppercase transition-colors backdrop-blur-sm">
                    Sign In to View Full Setup
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── SECTION DIVIDER ─── */}
      <div className="h-px bg-[rgba(255,250,250,0.04)]" />

      {/* ═══ SECTION 4: FINAL CTA BANNER ═══ */}
      <section className="py-20 md:py-32 px-4 bg-carbon relative overflow-hidden">
        {/* Red radial burst */}
        <motion.div
          animate={{ opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(237,40,57,0.15)_0%,_transparent_60%)]"
        />

        {/* Speed lines SVG */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none overflow-hidden">
          <svg viewBox="0 0 1400 400" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="0.5">
            {[...Array(20)].map((_, i) => (
              <line key={i} x1={-100} y1={20 * i} x2={1500} y2={20 * i + 40} strokeOpacity={0.3 + (i % 3) * 0.2} />
            ))}
          </svg>
        </div>

        {/* Top rule */}
        <div className="absolute top-0 left-0 right-0 h-px bg-red/20" />

        <div className="max-w-[900px] mx-auto text-center relative z-10">
          {/* Live dot + headline */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.5 }}>
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-2 h-2 rounded-full bg-red animate-pulse" />
              <span className="font-barlow font-bold text-[0.8rem] text-red tracking-[0.2em] uppercase">Ready to Compete</span>
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-barlow font-black text-[3rem] sm:text-[4.5rem] md:text-[6rem] uppercase leading-[0.9] tracking-[-0.01em] mb-6"
          >
            Ready to Go <span className="text-red">Faster?</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="font-jakarta text-base sm:text-lg text-snow/50 max-w-[480px] mx-auto mb-12 leading-relaxed"
          >
            Stop guessing. Start winning. The fastest setups from the TrackLabX community are one click away.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Link
              href="/signup"
              className="px-10 py-4 bg-red text-white font-barlow font-bold text-lg tracking-[0.1em] uppercase hover:bg-red-hot hover:shadow-[0_0_30px_rgba(237,40,57,0.3)] hover:scale-[1.02] transition-all duration-300"
            >
              Get Started — Free
            </Link>
            <Link
              href="/setup"
              className="group relative px-10 py-4 border border-red text-red font-barlow font-bold text-lg tracking-[0.1em] uppercase overflow-hidden hover:text-white transition-colors duration-300"
            >
              <div className="absolute inset-0 bg-red origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-400 ease-in-out z-0" />
              <span className="relative z-10">Browse Setups</span>
            </Link>
          </motion.div>
        </div>

        {/* Bottom rule */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-red/20" />
      </section>

      <Footer />
    </div>
  );
}

function TrackCard({ track, delay }: { track: { id: string; name: string; countryCode: string; lapRecord: string; country: string }, delay: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const svgPath = getTrackSvgById(track.id);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "0px 100px -50px 0px" }}
      transition={{ delay: delay, duration: 0.5, ease: 'easeOut' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="flex-shrink-0 w-[280px] sm:w-[340px] h-[400px] bg-carbon border border-snow/5 p-6 flex flex-col relative group snap-start cursor-pointer hover:border-border-red hover:shadow-[0_0_30px_rgba(237,40,57,0.1)] transition-all duration-300 overflow-hidden"
    >
      {/* Track SVG Background */}
      <div className="absolute inset-x-0 top-0 h-[220px] flex items-center justify-center p-8">
        <div className={`w-full h-full transition-all duration-700 ${isHovered ? 'opacity-[0.25] scale-105' : 'opacity-[0.1]'}`}>
          {svgPath ? (
            <img src={svgPath} alt="" className="w-full h-full object-contain" style={{ filter: 'brightness(10)' }} />
          ) : (
            <svg viewBox="0 0 400 300" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.3">
              <path d="M100 50 Q125 40 150 50 L200 60 Q225 65 240 90 L250 125 Q255 150 240 170 L210 200 Q190 215 170 210 L140 200 Q120 195 110 180 L90 140 Q80 115 90 90 Z" />
            </svg>
          )}
        </div>
      </div>

      <div className="mt-auto relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl drop-shadow-md">{getFlagEmoji(track.countryCode)}</span>
          <span className="text-xs font-mono font-bold text-snow/40 uppercase tracking-widest">{track.countryCode}</span>
        </div>
        <h4 className="font-barlow font-bold text-2xl uppercase leading-tight mb-4 group-hover:text-red transition-colors">{track.name}</h4>
        <div className="border-t border-snow/10 pt-4 flex items-end justify-between">
          <div>
            <div className="text-[10px] text-snow/40 font-mono uppercase tracking-widest mb-1">Track Record</div>
            <div className="text-sm font-mono text-snow font-bold">{track.lapRecord}</div>
          </div>
          <div className="w-8 h-8 rounded-full border border-snow/10 flex items-center justify-center text-snow/30 group-hover:text-red group-hover:border-red/30 transition-all bg-gunmetal-deep">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </div>
        </div>
      </div>

      {/* Corner Accent */}
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-transparent group-hover:border-red transition-all duration-300 m-4" />
    </motion.div>
  );
}




