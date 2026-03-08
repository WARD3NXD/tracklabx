'use client';

import { useLiveSession } from '@/hooks/useLiveSession';
import { LiveStatusBanner } from '@/components/live/LiveStatusBanner';
import { LiveWeatherBar } from '@/components/live/LiveWeatherBar';
import { LiveTimingTower } from '@/components/live/LiveTimingTower';
import { LiveFastestLap } from '@/components/live/LiveFastestLap';
import { LiveTyreMap } from '@/components/live/LiveTyreMap';
import { LivePitFeed } from '@/components/live/LivePitFeed';
import { LiveGapChart } from '@/components/live/LiveGapChart';
import { NoSessionState } from '@/components/live/NoSessionState';

export default function LiveSessionPage() {
  const {
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
  } = useLiveSession();

  if (!loading && !session) {
    return (
      <div className="pt-16 bg-carbon text-snow min-h-screen">
        <NoSessionState />
      </div>
    );
  }

  return (
    <div className="pt-16 bg-carbon text-snow min-h-screen flex flex-col">
      <LiveStatusBanner
        session={session}
        isLive={!!isLive}
        lastUpdated={lastUpdated}
      />
      <LiveWeatherBar weather={weather} />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-6 lg:py-8">
          {error && (
            <div className="mb-4 rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs font-jakarta text-amber-100">
              {error}
            </div>
          )}

          {loading && !session ? (
            <div className="py-24 text-center text-snow/60 text-sm font-jakarta">
              Connecting to live timing…
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)] gap-4 lg:gap-6 mb-4 lg:mb-6">
                <LiveTimingTower rows={timingData} />
                <div className="flex flex-col gap-4 lg:gap-5">
                  <LiveFastestLap fastestLap={fastestLap} drivers={drivers} />
                  <LiveTyreMap rows={timingData} />
                  <LivePitFeed pitStops={pitStops} drivers={drivers} />
                </div>
              </div>

              <LiveGapChart rows={timingData} />
            </>
          )}
        </div>
      </main>
    </div>
  );
}

