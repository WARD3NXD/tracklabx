'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { calendar2026, getRaceStatus, type Race } from '@/lib/data/calendar';
import { getFlagEmoji } from '@/lib/utils';
import { useEffect, useState } from 'react';

type NextSessionInfo = {
  race: Race;
  label: string;
  time: string;
};

function findNextSession(): NextSessionInfo | null {
  const upcomingRace =
    calendar2026.find((race) => getRaceStatus(race) === 'upcoming') ??
    calendar2026[0];

  const allSessions = [
    { label: 'Free Practice 1', time: upcomingRace.sessions.fp1 },
    ...(upcomingRace.isSprint
      ? [
          {
            label: 'Sprint Qualifying',
            time: upcomingRace.sessions.sprintShootout,
          },
          { label: 'Sprint Race', time: upcomingRace.sessions.sprint },
        ]
      : [
          { label: 'Free Practice 2', time: upcomingRace.sessions.fp2 },
          { label: 'Free Practice 3', time: upcomingRace.sessions.fp3 },
        ]),
    { label: 'Qualifying', time: upcomingRace.sessions.qualifying },
    { label: 'Race', time: upcomingRace.sessions.race },
  ].filter((s) => s.time !== null);

  const now = new Date();
  const next =
    allSessions.find((s) => new Date(s.time!).getTime() > now.getTime()) ??
    allSessions[allSessions.length - 1];

  return {
    race: upcomingRace,
    label: next.label,
    time: next.time!,
  };
}

function useCountdown(targetDate: string | null) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!targetDate) return;
    const update = () => {
      const diff = Math.max(
        0,
        new Date(targetDate).getTime() - Date.now(),
      );
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

export function NoSessionState() {
  const next = findNextSession();
  const countdown = useCountdown(next?.time ?? null);

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-carbon relative overflow-hidden">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 opacity-[0.04]"
      >
        <svg
          viewBox="0 0 800 600"
          className="w-full h-full"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M200 100 Q250 80 300 100 L400 120 Q450 130 480 180 L500 250 Q510 300 480 340 L420 400 Q380 430 340 420 L280 400 Q240 390 220 360 L180 280 Q160 230 180 180 Z" />
        </svg>
      </motion.div>

      <div className="relative z-10 max-w-xl mx-auto px-4 text-center">
        <div className="mb-4 flex items-center justify-center gap-3">
          <div className="w-2 h-2 rounded-full bg-snow/40" />
          <span className="font-barlow text-[0.8rem] uppercase tracking-[0.25em] text-snow/40">
            Live Timing
          </span>
        </div>

        <h1 className="font-barlow font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-[0.08em] text-snow mb-3">
          No Active Session
        </h1>
        <p className="font-jakarta text-snow/60 text-sm sm:text-base mb-10">
          The track is quiet right now. Check back when the next session
          goes green, or explore the full race calendar.
        </p>

        {next && (
          <div className="card-glow bg-gunmetal-deep/90 p-6 mb-10 border border-snow/10">
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="text-xl">
                {getFlagEmoji(next.race.countryCode)}
              </span>
              <div className="text-left">
                <div className="font-barlow text-xs uppercase tracking-[0.25em] text-red mb-1">
                  Next Session
                </div>
                <div className="font-barlow text-lg text-snow uppercase">
                  {next.race.country} Grand Prix ·{' '}
                  <span className="text-red">{next.label}</span>
                </div>
              </div>
            </div>

            <div className="font-mono text-xs text-snow/60 mb-4">
              {new Date(next.time).toLocaleDateString('en-GB', {
                weekday: 'long',
                day: 'numeric',
                month: 'short',
              })}{' '}
              ·{' '}
              {new Date(next.time).toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
              })}{' '}
              UTC
            </div>

            <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto mb-4">
              {[
                { value: countdown.days, label: 'D' },
                { value: countdown.hours, label: 'H' },
                { value: countdown.minutes, label: 'M' },
                { value: countdown.seconds, label: 'S' },
              ].map((block) => (
                <div
                  key={block.label}
                  className="bg-carbon border border-snow/10 py-2 text-center"
                >
                  <div className="font-mono text-lg text-snow tabular-nums">
                    {block.value.toString().padStart(2, '0')}
                  </div>
                  <div className="font-jakarta text-[0.6rem] text-snow/40 uppercase tracking-[0.25em]">
                    {block.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-3 mt-2">
              <button
                type="button"
                onClick={() => {
                  if (typeof Notification !== 'undefined') {
                    Notification.requestPermission().catch(() => undefined);
                  }
                }}
                className="px-4 py-2 bg-red text-white font-barlow text-xs tracking-[0.18em] uppercase"
              >
                Set Reminder
              </button>
              <Link
                href="/calendar"
                className="px-4 py-2 border border-snow/20 text-snow font-barlow text-xs tracking-[0.18em] uppercase hover:border-red hover:text-red transition-colors"
              >
                View Calendar
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

