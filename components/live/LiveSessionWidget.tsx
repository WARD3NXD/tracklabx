'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  getCurrentSession,
  getDrivers,
  getPositions,
  getLaps,
  formatLapTime,
  isSessionLive,
} from '@/lib/openf1';

type WidgetState = {
  isLive: boolean;
  loading: boolean;
  error: string | null;
  session: any | null;
  top: {
    position: number;
    code: string;
    gap: string;
  }[];
  fastestLap: string | null;
};

const POLL_INTERVAL = 10000;

export function LiveSessionWidget() {
  const [state, setState] = useState<WidgetState>({
    isLive: false,
    loading: true,
    error: null,
    session: null,
    top: [],
    fastestLap: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function fetchOnce() {
      try {
        const session = await getCurrentSession();
        const live = isSessionLive(session);
        if (!live || !session) {
          if (!cancelled) {
            setState((prev) => ({
              ...prev,
              isLive: false,
              loading: false,
              session: null,
              top: [],
              fastestLap: null,
            }));
          }
          return;
        }

        const [drivers, positions, fastestLapData] = await Promise.all([
          getDrivers(session.session_key),
          getPositions(session.session_key),
          getLaps(session.session_key),
        ]);

        const topSix = positions.slice(0, 6).map((p: any, index: number) => {
          const driver = drivers.find(
            (d: any) => d.driver_number === p.driver_number,
          );
          const gap =
            index === 0
              ? '+0.000'
              : p.gap_to_leader ?? p.interval ?? '+0.000';
          return {
            position: p.position,
            code: driver?.name_acronym ?? p.driver_number?.toString() ?? '?',
            gap,
          };
        });

        const fastestLapTime =
          fastestLapData && fastestLapData.lap_duration
            ? formatLapTime(fastestLapData.lap_duration)
            : null;

        if (!cancelled) {
          setState({
            isLive: true,
            loading: false,
            error: null,
            session,
            top: topSix,
            fastestLap: fastestLapTime,
          });
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setState((prev) => ({
            ...prev,
            loading: false,
            error: 'Live widget temporarily unavailable.',
            isLive: false,
          }));
        }
      }
    }

    fetchOnce();
    const id = setInterval(fetchOnce, POLL_INTERVAL);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  if (state.loading || !state.isLive || !state.session) return null;

  const title =
    state.session.meeting_name ??
    `${state.session.country_name ?? ''} Grand Prix`;
  const sessionType =
    state.session.session_name?.toUpperCase?.() ?? state.session.session_type;

  return (
    <section className="py-10 px-4 bg-gunmetal-deep border-t border-border-red/20">
      <div className="max-w-[1400px] mx-auto">
        <div className="card-glow bg-carbon/80 border-t-4 border-t-red px-5 py-4 sm:px-7 sm:py-6 flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red/15 border border-red/60">
                <span className="w-2 h-2 rounded-full bg-red animate-pulse" />
                <span className="font-barlow text-[0.75rem] tracking-[0.2em] uppercase text-red">
                  Live Now
                </span>
              </div>
              <div className="font-barlow text-sm sm:text-base uppercase tracking-[0.16em] text-snow">
                {title}{' '}
                {sessionType && (
                  <span className="text-red">· {sessionType}</span>
                )}
              </div>
            </div>
            <Link
              href="/live"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-barlow tracking-[0.16em] uppercase text-red hover:text-red-hot"
            >
              View Live
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-4 items-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs sm:text-sm font-mono text-snow/80">
              {state.top.map((item) => (
                <div
                  key={item.position}
                  className="flex items-center gap-2 tabular-nums"
                >
                  <span className="w-10 text-red font-bold">
                    P{item.position}
                  </span>
                  <span className="w-10 font-barlow text-snow text-sm">
                    {item.code}
                  </span>
                  <span className="text-snow/60">{item.gap}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between md:justify-end gap-4">
              <div className="flex flex-col items-start">
                <span className="font-barlow text-[0.7rem] uppercase tracking-[0.2em] text-snow/40 mb-1">
                  Fastest Lap
                </span>
                <span className="font-mono text-xl text-red tabular-nums">
                  {state.fastestLap ?? '--:--.---'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

