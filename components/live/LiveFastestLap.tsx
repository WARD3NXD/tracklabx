'use client';

import { motion } from 'framer-motion';
import { formatLapTime } from '@/lib/openf1';

type LiveFastestLapProps = {
  fastestLap: any | null;
  drivers: any[];
};

export function LiveFastestLap({ fastestLap, drivers }: LiveFastestLapProps) {
  if (!fastestLap) {
    return (
      <div className="card-glow bg-gunmetal-deep/80 p-4 sm:p-5 flex flex-col justify-between">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">⚡</span>
          <span className="font-barlow text-[0.75rem] tracking-[0.2em] uppercase text-snow/60">
            Fastest Lap
          </span>
        </div>
        <p className="text-xs text-snow/40 font-jakarta">
          Waiting for first representative lap time…
        </p>
      </div>
    );
  }

  const driver = drivers.find(
    (d) => d.driver_number === fastestLap.driver_number,
  );
  const lapTime = formatLapTime(fastestLap.lap_duration);

  return (
    <motion.div
      key={`${fastestLap.driver_number}-${fastestLap.lap_number}-${fastestLap.lap_duration}`}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25 }}
      className="card-glow bg-gunmetal-deep/80 p-4 sm:p-5 border-t-2 border-t-red"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">⚡</span>
          <span className="font-barlow text-[0.75rem] tracking-[0.2em] uppercase text-snow/60">
            Fastest Lap
          </span>
        </div>
        <span className="font-mono text-[0.7rem] text-snow/40 uppercase tracking-[0.16em]">
          Lap {fastestLap.lap_number}
        </span>
      </div>

      <div className="mb-3">
        <div className="flex items-center gap-3 mb-1">
          <div
            className="w-2 h-6 rounded-full"
            style={{
              backgroundColor: driver ? `#${driver.team_colour}` : '#ED2839',
            }}
          />
          <div>
            <div className="font-barlow text-xl text-snow leading-none">
              {driver?.name_acronym ?? fastestLap.driver_number}{' '}
              <span className="text-snow/50 text-xs ml-1">
                {driver?.team_name}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="font-mono text-[2.3rem] sm:text-[2.6rem] text-red leading-none mb-3 tabular-nums">
        {lapTime}
      </div>

      <div className="flex items-center justify-between text-[0.75rem] text-snow/60 font-mono">
        <span>
          Sectors:{' '}
          <span className="text-snow/80">
            S1 {fastestLap.duration_sector_1?.toFixed(1) ?? '—'} · S2{' '}
            {fastestLap.duration_sector_2?.toFixed(1) ?? '—'} · S3{' '}
            {fastestLap.duration_sector_3?.toFixed(1) ?? '—'}
          </span>
        </span>
      </div>
    </motion.div>
  );
}

