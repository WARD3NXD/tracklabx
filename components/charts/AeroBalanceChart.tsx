'use client';

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';

interface Props {
    frontWing: number;
    rearWing: number;
}

export function AeroBalanceChart({ frontWing, rearWing }: Props) {
    const data = [
        { name: 'Front Wing', value: frontWing },
        { name: 'Rear Wing', value: rearWing },
    ];

    return (
        <div>
            <ResponsiveContainer width="100%" height={100}>
                <BarChart data={data} layout="vertical" margin={{ left: 0, right: 20, top: 5, bottom: 5 }}>
                    <XAxis type="number" domain={[0, 50]} tick={{ fontSize: 10, fontFamily: 'var(--font-mono)', fill: 'currentColor', opacity: 0.4 }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fontFamily: 'var(--font-sora)', fill: 'currentColor', opacity: 0.6 }} axisLine={false} tickLine={false} width={80} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={16} label={{ position: 'right', fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 700, fill: '#ED2839' }}>
                        <Cell fill="#ED2839" />
                        <Cell fill="rgba(237, 40, 57, 0.6)" />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
            <div className="flex justify-between text-[10px] font-mono text-foreground/30 mt-2 px-1">
                <span>Balance: {((frontWing / (frontWing + rearWing)) * 100).toFixed(0)}% Front</span>
                <span>{((rearWing / (frontWing + rearWing)) * 100).toFixed(0)}% Rear</span>
            </div>
        </div>
    );
}
