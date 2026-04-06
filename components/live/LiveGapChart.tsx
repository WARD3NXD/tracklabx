'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { LiveTimingRow } from '@/hooks/useLiveSession';

type Props = {
  rows: LiveTimingRow[];
};

export default function LiveGapChart({ rows }: Props) {
  if (!rows.length) return null;

  const data = rows.map((row) => {
    const isLeader = row.position === 1;
    const gapSeconds =
      typeof row.gap !== 'string' || row.gap === 'LEADER' || row.gap.includes('LAP')
        ? 0
        : parseFloat(row.gap.replace('+', '').replace('s', ''));
    return {
      name: row.driverCode,
      gap: isLeader ? 0 : gapSeconds,
      teamColor: row.teamColor,
      leader: isLeader,
      label: row.gap ?? 'LEADER',
    };
  });

  return (
    <div className="mt-4 card-glow bg-gunmetal-deep/80 p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-5 bg-red" />
          <span className="font-barlow text-[0.75rem] tracking-[0.2em] uppercase text-snow/60">
            Gap To Leader
          </span>
        </div>
        <span className="font-mono text-[0.7rem] text-snow/40 uppercase tracking-[0.16em]">
          Seconds / laps
        </span>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ left: 24, right: 16, top: 0, bottom: 0 }}
          >
            <CartesianGrid
              stroke="rgba(255,250,250,0.08)"
              horizontal={false}
              strokeDasharray="3 3"
            />
            <XAxis
              type="number"
              tick={{ fill: 'rgba(255,250,250,0.4)', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={28}
              tick={{ fill: 'rgba(255,250,250,0.7)', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: 'rgba(255,250,250,0.05)' }}
              contentStyle={{
                backgroundColor: '#1E2021',
                borderRadius: 8,
                border: '1px solid rgba(255,250,250,0.1)',
                padding: '6px 8px',
                fontSize: 11,
              }}
              labelStyle={{ color: 'rgba(255,250,250,0.6)' }}
            />
            <Bar
              dataKey="gap"
              radius={2}
              animationDuration={300}
              isAnimationActive
              className="outline-none"
            >
              {data.map((entry, index) => (
                <Cell
                  // eslint-disable-next-line react/no-array-index-key
                  key={`cell-${index}`}
                  fill={entry.leader ? '#ED2839' : entry.teamColor}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

