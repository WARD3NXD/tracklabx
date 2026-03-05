const BASE = 'https://api.openf1.org/v1';

export async function getCurrentSession() {
  const res = await fetch(`${BASE}/sessions?session_key=latest`, {
    // Ensure we always hit OpenF1 directly from the browser / edge
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch current session');
  }
  const data = await res.json();
  return data[0] ?? null;
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

