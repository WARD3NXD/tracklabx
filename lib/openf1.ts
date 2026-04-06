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

type OpenF1Session = {
  session_key: number;
  session_name?: string;
  session_type?: string;
  date_start: string;
  date_end: string;
};

function isSupportedSessionName(session: Partial<OpenF1Session> | null | undefined): boolean {
  const name = session?.session_name ?? session?.session_type;
  return typeof name === 'string' && SUPPORTED_SESSION_NAMES.has(name);
}

function buildQuery(params: Record<string, string | number>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    search.append(key, String(value));
  }
  return search.toString();
}

async function fetchOpenF1Array(path: string): Promise<any[]> {
  const res = await fetch(`${BASE}${path}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch OpenF1 data (${res.status})`);
  }

  const json = await res.json();
  return Array.isArray(json) ? json : [];
}

export async function getCurrentSession() {
  const nowISO = new Date().toISOString();

  // 1) Prefer actively-running supported session in configured season.
  const active = await fetchOpenF1Array(
    `/sessions?${buildQuery({
      year: LIVE_SEASON,
      'date_start<=': nowISO,
      'date_end>=': nowISO,
    })}`,
  );
  const activeSupported = active.find((s) => isSupportedSessionName(s));
  if (activeSupported) return activeSupported;

  // 2) Fallback to latest supported session in configured season.
  const latestSeason = await fetchOpenF1Array(
    `/sessions?${buildQuery({
      year: LIVE_SEASON,
      session_key: 'latest',
    })}`,
  );
  const latestSupported = latestSeason.find((s) => isSupportedSessionName(s));
  if (latestSupported) return latestSupported;

  // 3) Last-resort fallback to latest supported from any season.
  const latestAny = await fetchOpenF1Array(
    `/sessions?${buildQuery({ session_key: 'latest' })}`,
  );
  return latestAny.find((s) => isSupportedSessionName(s)) ?? latestAny[0] ?? null;
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
