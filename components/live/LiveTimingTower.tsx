'use client';

import { motion } from 'framer-motion';
import type { LiveTimingRow } from '@/hooks/useLiveSession';

type Props = {
  rows: LiveTimingRow[];
};

function tyreEmoji(compound: string | null) {
  switch (compound) {
    case 'SOFT':
    case 'S':
      return '🔴';
    case 'MEDIUM':
    case 'M':
      return '🟡';
    case 'HARD':
    case 'H':
      return '⬜';
    case 'INTERMEDIATE':
    case 'I':
      return '🟢';
    case 'WET':
    case 'W':
      return '🔵';
    default:
      return '⬛';
  }
}

export function LiveTimingTower({ rows }: Props) {
  return (
    <div className="card-glow h-full bg-gunmetal-deep/80 p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-5 bg-red" />
          <span className="font-barlow text-[0.75rem] tracking-[0.2em] uppercase text-snow/60">
            Live Timing
          </span>
        </div>
        <span className="font-mono text-[0.7rem] text-snow/40 uppercase tracking-[0.18em]">
          P1 – P{rows.length || 20}
        </span>
      </div>

      <div className="grid grid-cols-[minmax(2rem,3rem)_minmax(2rem,3rem)_minmax(4rem,5rem)_minmax(6rem,1.5fr)_minmax(3.5rem,4rem)_minmax(2.5rem,3.5rem)_minmax(4.5rem,1fr)_minmax(4.5rem,1fr)_minmax(2.5rem,3rem)] gap-1 px-1 pb-1 border-b border-border-red/40 text-[0.65rem] sm:text-[0.7rem] font-mono text-snow/40 uppercase tracking-[0.16em]">
        <span>Pos</span>
        <span>No</span>
        <span>Driver</span>
        <span>Team</span>
        <span className="text-center">Tyre</span>
        <span className="text-center">Age</span>
        <span className="text-right">Gap</span>
        <span className="text-right">Int</span>
        <span className="text-right">Pits</span>
      </div>

      <div className="mt-1 space-y-1 max-h-[560px] overflow-y-auto pr-1">
        {rows.map((row) => {
          const isLeader = row.position === 1;
          const tyre = row.tyre ?? '';
          return (
            <motion.div
              key={row.driverNumber}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
              className={`grid grid-cols-[minmax(2rem,3rem)_minmax(2rem,3rem)_minmax(4rem,5rem)_minmax(6rem,1.5fr)_minmax(3.5rem,4rem)_minmax(2.5rem,3.5rem)_minmax(4.5rem,1fr)_minmax(4.5rem,1fr)_minmax(2.5rem,3rem)] gap-1 items-center px-2 py-1.5 text-[0.7rem] sm:text-[0.75rem] font-mono rounded-sm border border-transparent ${
                isLeader
                  ? 'bg-red-trace/60 border-red/80 shadow-[0_0_15px_rgba(237,40,57,0.5)]'
                  : 'bg-[#181A1B]/90'
              }`}
              style={
                isLeader
                  ? { borderLeftWidth: 3, borderLeftColor: 'var(--red)' }
                  : {}
              }
            >
              <span className={isLeader ? 'text-red font-bold' : 'text-snow/70'}>
                {row.position.toString().padStart(2, ' ')}
              </span>
              <span className="text-snow/60">
                {row.driverNumber.toString().padStart(2, ' ')}
              </span>
              <span className="font-barlow text-snow text-sm">
                {row.driverCode}
              </span>
              <div className="flex items-center gap-2 overflow-hidden">
                <div
                  className="w-1 h-4 rounded-full"
                  style={{ backgroundColor: row.teamColor }}
                />
                <span className="font-jakarta text-[0.7rem] text-snow/60 truncate">
                  {row.teamName}
                </span>
              </div>
              <div className="flex items-center justify-center gap-1">
                <span className="text-base leading-none">
                  {tyreEmoji(tyre)}
                </span>
                <span className="font-mono text-[0.7rem] text-snow/70 uppercase">
                  {tyre ? tyre[0] : '-'}
                </span>
              </div>
              <span className="text-center text-snow/50">
                {row.tyreAge != null ? `${row.tyreAge}` : '—'}
              </span>
              <span
                className={`text-right tabular-nums ${
                  isLeader ? 'text-red' : 'text-snow'
                }`}
              >
                {isLeader || !row.gap ? 'LEADER' : row.gap}
              </span>
              <span className="text-right tabular-nums text-snow/70">
                {row.interval ?? '—'}
              </span>
              <span className="text-right text-snow/60">
                {row.pitCount ?? 0}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

