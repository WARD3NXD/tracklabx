'use client';

import LiveTimingTower from './LiveTimingTower';
import LiveGapChart from './LiveGapChart';
import LiveWeatherBar from './LiveWeatherBar';
import LivePitFeed from './LivePitFeed';
import LiveTyreMap from './LiveTyreMap';
import LiveFastestLap from './LiveFastestLap';
import { useLiveSession } from '@/hooks/useLiveSession';

interface LiveSessionProps {
  session: any;
}

export default function LiveSession({ session }: LiveSessionProps) {
  const { 
    timingData, 
    loading, 
    error, 
    weather, 
    fastestLap, 
    pitStops,
    drivers
  } = useLiveSession();

  if (loading && !timingData.length) {
    return (
      <div className="min-h-screen bg-carbon flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-red/20 border-t-red rounded-full animate-spin" />
          <span className="font-barlow font-bold text-snow/40 tracking-widest uppercase text-sm">Connecting to Live Feed...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-carbon flex items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-2xl font-barlow font-bold text-red mb-4 uppercase tracking-wider">Connection Lost</h2>
          <p className="text-snow/60 mb-8 max-w-md mx-auto">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-red text-white font-barlow font-bold uppercase tracking-widest hover:bg-red-hot transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="live-session-container min-h-screen bg-carbon text-snow">
      <LiveWeatherBar weather={weather} />
      
      <main className="max-w-[1600px] mx-auto p-4 lg:p-6 grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-6">
        {/* Left Column: Timing & Charts */}
        <div className="flex flex-col gap-6 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6">
            <LiveTimingTower rows={timingData} />
            <div className="flex flex-col gap-6">
              <LiveFastestLap fastestLap={fastestLap} drivers={drivers} />
              <LiveGapChart rows={timingData} />
            </div>
          </div>
        </div>

        {/* Right Column: Feeds & Maps */}
        <div className="flex flex-col gap-6">
          <LiveTyreMap rows={timingData} />
          <LivePitFeed pitStops={pitStops} drivers={drivers} />
        </div>
      </main>
    </div>
  );
}
