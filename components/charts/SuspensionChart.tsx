'use client';

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface Props {
    data: {
        frontSuspension: number;
        rearSuspension: number;
        frontAntiRollBar: number;
        rearAntiRollBar: number;
        frontRideHeight: number;
        rearRideHeight: number;
    };
}

export function SuspensionChart({ data }: Props) {
    const chartData = [
        { param: 'F.Susp', value: data.frontSuspension, fullMark: 11 },
        { param: 'F.ARB', value: data.frontAntiRollBar, fullMark: 11 },
        { param: 'F.Height', value: Math.min(data.frontRideHeight / 5, 11), fullMark: 11 },
        { param: 'R.Susp', value: data.rearSuspension, fullMark: 11 },
        { param: 'R.ARB', value: data.rearAntiRollBar, fullMark: 11 },
        { param: 'R.Height', value: Math.min(data.rearRideHeight / 5, 11), fullMark: 11 },
    ];

    return (
        <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="75%">
                <PolarGrid strokeOpacity={0.15} stroke="currentColor" />
                <PolarAngleAxis
                    dataKey="param"
                    tick={{ fontSize: 9, fontFamily: 'var(--font-mono)', fill: 'currentColor', opacity: 0.5 }}
                />
                <Radar
                    dataKey="value"
                    stroke="#ED2839"
                    fill="#ED2839"
                    fillOpacity={0.15}
                    strokeWidth={2}
                />
            </RadarChart>
        </ResponsiveContainer>
    );
}
