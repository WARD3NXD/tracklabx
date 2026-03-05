'use client';

import { motion, AnimatePresence } from 'framer-motion';

type LivePitFeedProps = {
  pitStops: any[];
  drivers: any[];
};

function timeAgo(dateString: string) {
  const diff = Date.now() - new Date(dateString).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

export function LivePitFeed({ pitStops, drivers }: LivePitFeedProps) {
  return (
    <div className="card-glow bg-gunmetal-deep/80 p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-snow" />
          <span className="font-barlow text-[0.75rem] tracking-[0.2em] uppercase text-snow/60">
            Pit Stops
          </span>
        </div>
        <span className="font-mono text-[0.7rem] text-snow/40 uppercase tracking-[0.16em]">
          Latest 10
        </span>
      </div>

      <div className="mt-1 space-y-2 max-h-64 overflow-y-auto pr-1">
        <AnimatePresence initial={false}>
          {pitStops.map((stop) => {
            const driver = drivers.find(
              (d) => d.driver_number === stop.driver_number,
            );
            const duration = stop.pit_duration ?? stop.stopped_duration;
            const durationLabel =
              typeof duration === 'number'
                ? `${duration.toFixed(1)}s`
                : duration ?? '—';
            const isFast = typeof duration === 'number' && duration < 2.5;
            const compound = stop.tyre_compound_after ?? stop.tyre_compound;

            return (
              <motion.div
                key={`${stop.driver_number}-${stop.date}-${stop.pit_number}`}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-between gap-3 px-2 py-1.5 rounded bg-[#181A1B]/90 border border-snow/5"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="font-mono text-[0.7rem] text-snow/40">
                    {timeAgo(stop.date)}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-barlow text-sm text-snow">
                      {driver?.name_acronym ?? stop.driver_number}
                    </span>
                    <span className="font-jakarta text-[0.7rem] text-snow/50">
                      {driver?.team_name}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-sm">
                    <span>🛞</span>
                    <span className="font-mono text-[0.75rem] text-snow/70">
                      {compound ?? '—'}
                    </span>
                  </div>
                  <span
                    className={`font-mono text-[0.75rem] ${
                      isFast ? 'text-red' : 'text-snow/70'
                    }`}
                  >
                    {durationLabel}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {!pitStops.length && (
          <p className="text-[0.75rem] text-snow/40 font-jakarta">
            No pit stops recorded yet for this session.
          </p>
        )}
      </div>
    </div>
  );
}

