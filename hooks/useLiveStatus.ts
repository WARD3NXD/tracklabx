'use client';

import { useState, useEffect } from 'react';
import { getCurrentSession } from '@/lib/openf1';

export type LiveState = 'live' | 'no-session' | 'just-ended';

export interface LiveStatus {
  state: LiveState;
  session: any | null;
  isLoading: boolean;
  lastRaceId: string | null; // most recent completed race
  lastRaceRound: number | null;
  isLive: boolean;
}

export function useLiveStatus(): LiveStatus {
  const [status, setStatus] = useState<LiveStatus>({
    state: 'no-session',
    session: null,
    isLoading: true,
    lastRaceId: null,
    lastRaceRound: null,
    isLive: false,
  });

  useEffect(() => {
    async function detect() {
      try {
        const session = await getCurrentSession();
        const now = new Date();

        if (!session) {
          setStatus({
            state: 'no-session',
            session: null,
            isLoading: false,
            lastRaceId: null,
            lastRaceRound: null,
            isLive: false,
          });
          return;
        }

        const sessionStart = new Date(session.date_start);
        const sessionEnd = new Date(session.date_end);

        // Active session
        if (now >= sessionStart && now <= sessionEnd) {
          setStatus({
            state: 'live',
            session,
            isLoading: false,
            lastRaceId: null,
            lastRaceRound: null,
            isLive: true,
          });
          return;
        }

        // Session ended < 24hrs ago
        const hoursAfterEnd = (now.getTime() - sessionEnd.getTime()) / (1000 * 60 * 60);

        if (hoursAfterEnd > 0 && hoursAfterEnd < 24) {
          const raceId = buildRaceId(session);
          setStatus({
            state: 'just-ended',
            session,
            isLoading: false,
            lastRaceId: raceId,
            lastRaceRound: session.round_number,
            isLive: false,
          });
          return;
        }

        // No active session
        setStatus({
          state: 'no-session',
          session: null,
          isLoading: false,
          lastRaceId: null,
          lastRaceRound: null,
          isLive: false,
        });
      } catch (error) {
        console.error('Error detecting live status:', error);
        setStatus((prev) => ({ ...prev, isLoading: false }));
      }
    }

    detect();
    // Re-check every 60 seconds
    const interval = setInterval(detect, 60000);
    return () => clearInterval(interval);
  }, []);

  return status;
}

function buildRaceId(session: any): string {
  // e.g. "2025-R05"
  const year = new Date(session.date_start).getFullYear();
  const round = String(session.round_number).padStart(2, '0');
  return `${year}-R${round}`;
}
