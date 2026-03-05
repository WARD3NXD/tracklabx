'use client';

import { useEffect, useState } from 'react';
import { formatLapTime } from '@/lib/openf1';

type LiveStatusBannerProps = {
  session: any | null;
  isLive: boolean;
  lastUpdated: Date | null;
};

function formatLastUpdated(lastUpdated: Date | null) {
  if (!lastUpdated) return 'Just now';
  const diff = Math.floor((Date.now() - lastUpdated.getTime()) / 1000);
  if (diff < 5) return 'Just now';
  if (diff < 60) return `${diff}s ago`;
  const mins = Math.floor(diff / 60);
  return `${mins}m ago`;
}

export function LiveStatusBanner({
  session,
  isLive,
  lastUpdated,
}: LiveStatusBannerProps) {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!session) return null;

  const title = session.meeting_name ?? session.country_name ?? 'Current Session';
  const roundLabel = session.championship_round
    ? `Round ${String(session.championship_round).padStart(2, '0')}`
    : undefined;
  const circuit = session.circuit_short_name ?? session.circuit_name;
  const countryCode = session.country_code;
  const sessionType = session.session_name?.toUpperCase?.() ?? session.session_type;

  return (
    <header className="border-b border-border-red bg-gunmetal-deep/95">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-barlow tracking-[0.18em] uppercase text-snow/60">
              {roundLabel && <span>{roundLabel}</span>}
              {roundLabel && <span className="text-snow/30">·</span>}
              <span>{title}</span>
              {sessionType && (
                <>
                  <span className="text-snow/30">·</span>
                  <span className="text-red">{sessionType}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-snow/50 font-jakarta">
              {countryCode && (
                <span className="text-base leading-none">
                  {String.fromCodePoint(
                    ...countryCode
                      .toUpperCase()
                      .split('')
                      .map((c: string) => 0x1f1e6 - 65 + c.charCodeAt(0)),
                  )}
                </span>
              )}
              {circuit && (
                <>
                  <span>{circuit}</span>
                  {session.gmt_offset && (
                    <>
                      <span className="text-snow/30">·</span>
                      <span className="font-mono text-[0.7rem]">
                        Local {session.gmt_offset}
                      </span>
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            {isLive && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red/15 border border-red/60">
                <span className="w-2 h-2 rounded-full bg-red animate-pulse" />
                <span className="tracking-[0.18em] uppercase text-red">
                  Live
                </span>
              </div>
            )}
            {!isLive && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-carbon border border-snow/15">
                <span className="w-2 h-2 rounded-full bg-snow/40" />
                <span className="tracking-[0.18em] uppercase text-snow/60">
                  Session Offline
                </span>
              </div>
            )}
            <span className="text-snow/50">
              Last update: {formatLastUpdated(lastUpdated)}
            </span>
            <span className="text-amber-400/80 text-[0.7rem] tracking-[0.16em] uppercase">
              ⚠ Data delayed ~1 min
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

