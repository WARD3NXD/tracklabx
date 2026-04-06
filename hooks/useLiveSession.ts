'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  getCurrentSession,
  getDrivers,
  getPositions,
  getIntervals,
  getLaps,
  getStints,
  getPitStops,
  getWeather,
  isSessionLive,
} from '@/lib/openf1';

const POLL_INTERVAL = 5000; // 5 seconds for positions
const WEATHER_INTERVAL = 30000; // 30 seconds for weather
const SESSION_CHECK_INTERVAL = 60000; // 60 seconds for live status/session rollover

export type LiveTimingRow = {
  position: number;
  driverNumber: number;
  driverCode: string;
  fullName: string;
  teamName: string;
  teamColor: string;
  gap: string | null;
  interval: string | null;
  tyre: string | null;
  tyreAge: number | null;
  pitCount: number;
};

export function useLiveSession() {
  const [session, setSession] = useState<any>(null);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [positions, setPositions] = useState<any[]>([]);
  const [intervals, setIntervals] = useState<any>({});
  const [fastestLap, setFastestLap] = useState<any>(null);
  const [stints, setStints] = useState<any>({});
  const [pitStops, setPitStops] = useState<any[]>([]);
  const [weather, setWeather] = useState<any>(null);
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initial session check + periodic session rollover/live-status check
  useEffect(() => {
    let cancelled = false;

    async function syncSession() {
      try {
        const s = await getCurrentSession();
        if (cancelled) return;

        setSession((prev: any) => {
          const hasSessionChanged = prev?.session_key !== s?.session_key;

          if (hasSessionChanged) {
            setPositions([]);
            setIntervals({});
            setFastestLap(null);
            setStints({});
            setPitStops([]);
            setWeather(null);
            setLastUpdated(null);
          }

          return s;
        });

        setIsLive(isSessionLive(s));

        if (s?.session_key) {
          const d = await getDrivers(s.session_key);
          if (!cancelled) {
            setDrivers(d);
          }
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setError('Unable to load live session data right now.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    syncSession();
    const interval = setInterval(syncSession, SESSION_CHECK_INTERVAL);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  // Small delay helper to avoid OpenF1 rate limits (429)
  const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

  // Fetch timing data sequentially with delays to avoid rate limits
  const fetchTimingData = useCallback(async (initialDelay = 0) => {
    if (!session) return;
    try {
      // Wait before starting if specified (avoids overlap with session/driver fetch)
      if (initialDelay > 0) await delay(initialDelay);

      const sk = session.session_key;
      const pos = await getPositions(sk);
      setPositions(pos);

      await delay(800);
      const ints = await getIntervals(sk);
      setIntervals(ints);

      await delay(800);
      const lap = await getLaps(sk);
      setFastestLap(lap);

      await delay(800);
      const st = await getStints(sk);
      setStints(st);

      await delay(800);
      const pits = await getPitStops(sk);
      setPitStops(pits);

      setLastUpdated(new Date());
      setError(null);
    } catch (e) {
      console.error(e);
      setError('Connection to live timing is unstable.');
    }
  }, [session]);

  // Live polling (only when session is active)
  useEffect(() => {
    if (!isLive || !session) return;
    fetchTimingData();
    const interval = setInterval(fetchTimingData, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [isLive, session, fetchTimingData]);

  // One-time data fetch for non-live sessions (show last session results)
  // Uses a 2s initial delay to avoid rate limits from session/driver discovery
  useEffect(() => {
    if (isLive || !session) return;
    let cancelled = false;
    (async () => {
      if (!cancelled) await fetchTimingData(2000);
    })();
    return () => { cancelled = true; };
  }, [isLive, session, fetchTimingData]);

  // Weather polling (slower)
  useEffect(() => {
    if (!session || !isLive) return;
    const fetchWeather = async () => {
      try {
        const w = await getWeather(session.session_key);
        setWeather(w);
      } catch (e) {
        console.error(e);
      }
    };
    fetchWeather();
    const interval = setInterval(fetchWeather, WEATHER_INTERVAL);
    return () => clearInterval(interval);
  }, [session, isLive]);

  const timingData: LiveTimingRow[] = useMemo(
    () =>
      positions.map((pos) => {
        const driver = drivers.find(
          (d) => d.driver_number === pos.driver_number,
        );
        const interval = (intervals as any)[pos.driver_number];
        const stint = (stints as any)[pos.driver_number];
        return {
          position: pos.position,
          driverNumber: pos.driver_number,
          driverCode: driver?.name_acronym ?? '???',
          fullName: driver?.full_name ?? '',
          teamName: driver?.team_name ?? '',
          teamColor: `#${driver?.team_colour ?? '888888'}`,
          gap: interval?.gap_to_leader ?? null,
          interval: interval?.interval ?? null,
          tyre: stint?.compound ?? null,
          tyreAge: stint?.tyre_age_at_start ?? null,
          pitCount: stint?.stint_number ? stint.stint_number - 1 : 0,
        };
      }),
    [positions, drivers, intervals, stints],
  );

  return {
    session,
    isLive,
    loading,
    lastUpdated,
    error,
    timingData,
    fastestLap,
    pitStops,
    weather,
    drivers,
  };
}
