'use client';

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface Setup {
    id: string;
    username: string;
    lapTime: string;
    lapTimeMs: number;
}

interface Props {
    setups: Setup[];
}

export function LapTimeChart({ setups }: Props) {
    const data = setups.map((s, i) => ({
        rank: `#${i + 1}`,
        lapTime: s.lapTimeMs / 1000,
        username: s.username,
        display: s.lapTime,
    }));

    return (
        <ResponsiveContainer width="100%" height={180}>
            <LineChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                <XAxis
                    dataKey="rank"
                    tick={{ fontSize: 10, fontFamily: 'var(--font-mono)', fill: 'currentColor', opacity: 0.4 }}
                    axisLine={false}
                    tickLine={false}
                />
                <YAxis
                    tick={{ fontSize: 10, fontFamily: 'var(--font-mono)', fill: 'currentColor', opacity: 0.4 }}
                    axisLine={false}
                    tickLine={false}
                    domain={['auto', 'auto']}
                    tickFormatter={(value: number) => `${Math.floor(value / 60)}:${(value % 60).toFixed(0).padStart(2, '0')}`}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#1C1D1F',
                        border: '1px solid rgba(237,40,57,0.3)',
                        borderRadius: 0,
                        fontSize: 11,
                        fontFamily: 'var(--font-mono)',
                        color: '#FFFAFA',
                    }}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    formatter={(value: any, _name: any, props: any) => [
                        props.payload.display,
                        props.payload.username,
                    ]}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    labelFormatter={(label: any) => `Rank ${label}`}
                />
                <Line
                    type="monotone"
                    dataKey="lapTime"
                    stroke="#ED2839"
                    strokeWidth={2}
                    dot={{ fill: '#ED2839', r: 4, strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: '#ED2839', stroke: '#FFFAFA', strokeWidth: 2 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}
