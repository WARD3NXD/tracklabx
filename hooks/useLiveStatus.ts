'use client';

import { useEffect, useState } from 'react';
import { getCurrentSession, isSessionLive } from '@/lib/openf1';

/**
 * Lightweight hook for navbar / homepage to know if there is a live session.
 * Checks OpenF1 once on mount and does not poll, to avoid unnecessary traffic.
 */
export function useLiveStatus() {
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function check() {
      try {
        const session = await getCurrentSession();
        if (!cancelled) {
          setIsLive(isSessionLive(session));
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    check();
    return () => {
      cancelled = true;
    };
  }, []);

  return { isLive, loading };
}

