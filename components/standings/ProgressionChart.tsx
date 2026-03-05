'use client';

import { useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TEAM_COLORS } from '@/lib/teamColors';

type RaceResult = {
    round: number;
    raceName: string;
    results: {
        driverCode: string;
        teamId: string;
        points: number;
    }[];
};

type ProgressionChartProps = {
    races: RaceResult[];
    type: 'drivers' | 'constructors';
};

export default function ProgressionChart({ races, type }: ProgressionChartProps) {
    const [viewLimit, setViewLimit] = useState<3 | 5 | 10>(5);

    const chartData = useMemo(() => {
        if (!races || races.length === 0) {
            return { history: [], topKeys: [], teamMapping: {} };
        }

        const history: any[] = [];
        const totals: Record<string, number> = {};
        const teamMapping: Record<string, string> = {};

        races.forEach((race, index) => {
            const snap: any = { round: race.round, name: `R${race.round}` };

            // Make sure we only aggregate valid race points up to this round
            race.results.forEach(res => {
                if (type === 'drivers') {
                    totals[res.driverCode] = (totals[res.driverCode] || 0) + res.points;
                    snap[res.driverCode] = totals[res.driverCode];
                    teamMapping[res.driverCode] = res.teamId;
                } else {
                    totals[res.teamId] = (totals[res.teamId] || 0) + res.points;
                    snap[res.teamId] = totals[res.teamId];
                    teamMapping[res.teamId] = res.teamId;
                }
            });

            // Forward fill missing data points for drivers who didn't score or DNF'd
            Object.keys(totals).forEach(key => {
                if (snap[key] === undefined) {
                    snap[key] = totals[key];
                }
            });

            history.push(snap);
        });

        // Determine top N drivers/teams based on final totals
        const finalTotals = Object.entries(totals)
            .sort(([, a], [, b]) => b - a)
            .slice(0, viewLimit)
            .map(([key]) => key);

        return { history, topKeys: finalTotals, teamMapping };
    }, [races, type, viewLimit]);

    if (chartData.history.length === 0) {
        return (
            <div className="w-full h-[400px] bg-gunmetal/20 rounded-xl border border-grid-line flex items-center justify-center animate-pulse">
                <span className="text-snow/30 font-mono tracking-widest text-sm uppercase">Awaiting Race Data</span>
            </div>
        );
    }

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            // Sort payload by value descending to show true order at that round
            const sorted = [...payload].sort((a, b) => b.value - a.value);

            return (
                <div className="bg-carbon border border-red/30 p-4 rounded-lg shadow-xl shadow-red/5 min-w-[150px]">
                    <p className="text-snow font-barlow font-bold uppercase mb-2 border-b border-snow/10 pb-2">Round {label}</p>
                    {sorted.map((p, index) => (
                        <div key={index} className="flex justify-between items-center gap-6 mt-1 font-mono text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                                <span className="text-snow/80">{p.dataKey}</span>
                            </div>
                            <span className="text-snow font-bold">{p.value}</span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full h-full min-h-[400px] flex flex-col bg-gunmetal-deep relative rounded-xl border border-grid-line/50 p-6 overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 z-10">
                <div>
                    <h3 className="font-barlow font-bold text-2xl text-snow tracking-wide uppercase">Season Progression</h3>
                    <p className="text-sm font-jakarta text-snow/50 mt-1">
                        Cumulative points across the season
                    </p>
                </div>
                <div className="flex gap-2 mt-4 sm:mt-0 font-mono text-xs">
                    {[3, 5, 10].map((num) => (
                        <button
                            key={num}
                            onClick={() => setViewLimit(num as any)}
                            className={`px-3 py-1.5 rounded transition-colors uppercase tracking-widest ${viewLimit === num
                                ? 'bg-red text-white'
                                : 'bg-carbon text-snow/50 hover:bg-carbon-light hover:text-snow'
                                }`}
                        >
                            Top {num}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 w-full min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData.history} margin={{ top: 20, right: 30, left: -20, bottom: 0 }}>
                        <XAxis
                            dataKey="name"
                            stroke="var(--grid-line)"
                            tick={{ fill: 'rgba(255, 250, 250, 0.4)', fontSize: 12, fontFamily: 'monospace' }}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                        />
                        <YAxis
                            stroke="var(--grid-line)"
                            tick={{ fill: 'rgba(255, 250, 250, 0.4)', fontSize: 12, fontFamily: 'monospace' }}
                            tickLine={false}
                            axisLine={false}
                            dx={-10}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(237,40,57,0.3)', strokeWidth: 1, strokeDasharray: '4 4' }} />

                        {/* Draw a subtle background grid */}
                        {[100, 200, 300, 400, 500, 600].map((val) => (
                            <ReferenceLine key={val} y={val} stroke="var(--grid-line)" strokeOpacity="0.5" />
                        ))}

                        {chartData.topKeys.map((key) => {
                            const teamId = chartData.teamMapping[key];
                            const color = TEAM_COLORS[teamId] ?? '#888';
                            return (
                                <Line
                                    key={key}
                                    type="monotone"
                                    dataKey={key}
                                    stroke={color}
                                    strokeWidth={3}
                                    dot={{ r: 3, fill: color, strokeWidth: 0, fillOpacity: 0.5 }}
                                    activeDot={{ r: 6, fill: color, stroke: '#fff', strokeWidth: 2 }}
                                    animationDuration={1500}
                                    animationEasing="ease-out"
                                />
                            );
                        })}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
