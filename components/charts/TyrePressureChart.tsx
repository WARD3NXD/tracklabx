'use client';

import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

const compoundColors: Record<string, string> = {
    soft: '#ED2839',
    medium: '#FFC800',
    hard: '#FFFFFF',
};

interface Props {
    fl: number;
    fr: number;
    rl: number;
    rr: number;
    compound: string;
}

export function TyrePressureChart({ fl, fr, rl, rr, compound }: Props) {
    const color = compoundColors[compound] || '#ED2839';
    const corners = [
        { name: 'FL', value: fl, fill: color },
        { name: 'FR', value: fr, fill: color },
        { name: 'RL', value: rl, fill: `${color}99` },
        { name: 'RR', value: rr, fill: `${color}99` },
    ];

    return (
        <div className="grid grid-cols-2 gap-4">
            {corners.map(corner => (
                <div key={corner.name} className="text-center">
                    <ResponsiveContainer width="100%" height={90}>
                        <RadialBarChart
                            cx="50%"
                            cy="50%"
                            innerRadius="60%"
                            outerRadius="90%"
                            data={[{ value: (corner.value / 30) * 100 }]}
                            startAngle={180}
                            endAngle={0}
                            barSize={8}
                        >
                            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} angleAxisId={0} />
                            <RadialBar
                                dataKey="value"
                                fill={corner.fill}
                                cornerRadius={4}
                                background={{ fill: 'rgba(255,255,255,0.05)' }}
                            />
                        </RadialBarChart>
                    </ResponsiveContainer>
                    <div className="font-mono text-xs text-foreground/60">{corner.name}</div>
                    <div className="font-mono text-sm font-bold" style={{ color: corner.fill }}>{corner.value} psi</div>
                </div>
            ))}
        </div>
    );
}
