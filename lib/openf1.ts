const BASE = '/api/openf1';

export const LIVE_SEASON = 2026;

const SUPPORTED_SESSION_NAMES = new Set([
  'Practice 1',
  'Practice 2',
  'Practice 3',
  'Qualifying',
  'Race',
  // Sprint weekend support
  'Sprint',
  'Sprint Shootout',
  'Sprint Qualifying',
]);

function isSupportedSessionName(session: any): boolean {
  const name = session?.session_name ?? session?.session_type;
  return typeof name === 'string' && SUPPORTED_SESSION_NAMES.has(name);
}

async function fetchOpenF1Json(path: string, retries = 2): Promise<any> {
  const res = await fetch(`${BASE}${path}`, {
    cache: 'no-store',
  });

  // OpenF1 returns 404 when a query has no matching results.
  if (res.status === 404) {
    return [];
  }

  // Retry on 429 rate-limit with exponential backoff
  if (res.status === 429 && retries > 0) {
    const backoff = (3 - retries) * 1000; // 1s, 2s
    await new Promise((r) => setTimeout(r, backoff));
    return fetchOpenF1Json(path, retries - 1);
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch OpenF1 data (${res.status})`);
  }

  return res.json();
}

export async function getCurrentSession() {
  const now = new Date();
  const nowISO = now.toISOString();

  // 1) Fetch the latest session with data (cheapest single call, always works).
  const latestSeason = await fetchOpenF1Json(
    `/sessions?year=${LIVE_SEASON}&session_key=latest`,
  );
  const latestSession = (latestSeason as any[]).find(isSupportedSessionName)
    ?? (latestSeason as any[])[0]
    ?? null;

  // If no session found at all, bail out.
  if (!latestSession) return null;

  // 2) Check if this latest session is currently active (within its time window).
  const start = new Date(latestSession.date_start);
  const end = new Date(latestSession.date_end);
  if (now >= start && now <= end) {
    return latestSession; // It's live right now!
  }

  // 3) The latest session has ended. Try to find one that's currently active
  //    (e.g. a newer session from the same weekend that just started).
  try {
    const active = await fetchOpenF1Json(
      `/sessions?year=${LIVE_SEASON}&date_start<=${encodeURIComponent(nowISO)}&date_end>${encodeURIComponent(nowISO)}`,
    );
    const activeSupported = (active as any[]).find(isSupportedSessionName);
    if (activeSupported) return activeSupported;
  } catch {
    // If the active-session query fails, no problem — we fall through
    // to return the latest session's data as a replay.
  }

  // 4) No session is live. Return the most recent completed session so the
  //    UI can show its results instead of a blank "No Session" state.
  return latestSession;
}

export async function getDrivers(sessionKey: number) {
  const res = await fetch(`${BASE}/drivers?session_key=${sessionKey}`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch drivers');
  }
  return res.json();
}

export async function getPositions(sessionKey: number) {
  const res = await fetch(`${BASE}/position?session_key=${sessionKey}`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch positions');
  }
  const data = await res.json();
  // Get latest position per driver
  const latest = new Map<number, any>();
  data.forEach((entry: any) => {
    const existing = latest.get(entry.driver_number);
    if (!existing || entry.date > existing.date) {
      latest.set(entry.driver_number, entry);
    }
  });
  return Array.from(latest.values()).sort(
    (a, b) => a.position - b.position,
  );
}

export async function getIntervals(sessionKey: number) {
  const res = await fetch(`${BASE}/intervals?session_key=${sessionKey}`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch intervals');
  }
  const data = await res.json();
  const latest = new Map<number, any>();
  data.forEach((entry: any) => {
    const existing = latest.get(entry.driver_number);
    if (!existing || entry.date > existing.date) {
      latest.set(entry.driver_number, entry);
    }
  });
  return Object.fromEntries(latest);
}

export async function getLaps(sessionKey: number) {
  const res = await fetch(`${BASE}/laps?session_key=${sessionKey}`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch laps');
  }
  const data = await res.json();
  // Find overall fastest lap
  return data.reduce((fastest: any, lap: any) => {
    if (!lap.lap_duration) return fastest;
    if (!fastest || lap.lap_duration < fastest.lap_duration) return lap;
    return fastest;
  }, null);
}

export async function getStints(sessionKey: number) {
  const res = await fetch(`${BASE}/stints?session_key=${sessionKey}`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch stints');
  }
  const data = await res.json();
  // Get current stint per driver
  const current = new Map<number, any>();
  data.forEach((stint: any) => {
    const existing = current.get(stint.driver_number);
    if (!existing || stint.stint_number > existing.stint_number) {
      current.set(stint.driver_number, stint);
    }
  });
  return Object.fromEntries(current);
}

export async function getPitStops(sessionKey: number) {
  const res = await fetch(`${BASE}/pit?session_key=${sessionKey}`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch pit stops');
  }
  const data = await res.json();
  return data
    .sort(
      (a: any, b: any) =>
        new Date(b.date).getTime() - new Date(a.date).getTime(),
    )
    .slice(0, 10); // last 10 pit stops
}

export async function getWeather(sessionKey: number) {
  const res = await fetch(`${BASE}/weather?session_key=${sessionKey}`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch weather');
  }
  const data = await res.json();
  return data[data.length - 1] ?? null; // most recent reading
}

export function isSessionLive(session: any): boolean {
  if (!session) return false;
  const now = new Date();
  const start = new Date(session.date_start);
  const end = new Date(session.date_end);
  return now >= start && now <= end;
}

export function formatLapTime(seconds: number): string {
  if (!seconds) return '--:--.---';
  const mins = Math.floor(seconds / 60);
  const secs = (seconds % 60).toFixed(3).padStart(6, '0');
  return `${mins}:${secs}`;
}
