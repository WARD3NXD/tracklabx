'use client';

import { LiveTimingRow } from '@/hooks/useLiveSession';

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

export default function LiveTyreMap({ rows }: Props) {
  if (!rows.length) return null;

  return (
    <div className="card-glow bg-gunmetal-deep/80 p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🛞</span>
          <span className="font-barlow text-[0.75rem] tracking-[0.2em] uppercase text-snow/60">
            Tyre Map
          </span>
        </div>
        <span className="font-mono text-[0.7rem] text-snow/40 uppercase tracking-[0.16em]">
          Compounds &amp; age
        </span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {rows.map((row) => {
          const age = row.tyreAge ?? null;
          const warning = age != null && age > 20;
          return (
            <div
              key={row.driverNumber}
              className={`flex flex-col items-center justify-center gap-1 px-2 py-2 border ${
                warning
                  ? 'border-amber-500/80 bg-[#221a12]'
                  : 'border-snow/10 bg-[#181A1B]/90'
              }`}
            >
              <div className="font-barlow text-[0.8rem] text-snow uppercase">
                {row.driverCode}
              </div>
              <div className="text-xl leading-none">
                {tyreEmoji(row.tyre)}
              </div>
              <div className="font-mono text-[0.7rem] text-snow/60">
                {age != null ? `${age} L` : '—'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

