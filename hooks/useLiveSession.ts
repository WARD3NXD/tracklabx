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

  // Initial session check
  useEffect(() => {
    async function init() {
      try {
        const s = await getCurrentSession();
        setSession(s);
        const live = isSessionLive(s);
        setIsLive(live);

        if (s) {
          const d = await getDrivers(s.session_key);
          setDrivers(d);
        }
      } catch (e) {
        console.error(e);
        setError('Unable to load live session data right now.');
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  // Live polling
  const fetchLiveData = useCallback(async () => {
    if (!session || !isLive) return;
    try {
      const [pos, ints, lap, st, pits] = await Promise.all([
        getPositions(session.session_key),
        getIntervals(session.session_key),
        getLaps(session.session_key),
        getStints(session.session_key),
        getPitStops(session.session_key),
      ]);
      setPositions(pos);
      setIntervals(ints);
      setFastestLap(lap);
      setStints(st);
      setPitStops(pits);
      setLastUpdated(new Date());
    } catch (e) {
      console.error(e);
      setError('Connection to live timing is unstable.');
    }
  }, [session, isLive]);

  useEffect(() => {
    if (!isLive) return;
    fetchLiveData();
    const interval = setInterval(fetchLiveData, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [isLive, fetchLiveData]);

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

