'use client'

import { useEffect, useRef, useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, BarChart, Bar, Cell,
} from 'recharts'

// ─── Types ────────────────────────────────────────────────────────────────────

interface TyreDegData {
  compounds: Record<string, { tyreAges: number[]; lapTimesMs: number[] }>
}

interface SpeedTraceData {
  driver: string
  team: string
  lapTime: number
  trace: { distance: number[]; speed: number[]; throttle: number[]; brake: number[] }
}

interface TelemetryData {
  driver: string
  team: string
  lapTime: number
  telemetry: { distance: number[]; speed: number[]; throttle: number[]; brake: number[]; gear: number[]; rpm: number[] }
}

interface AnalysisData {
  year: number
  round: number
  raceName: string
  circuit: string
  date: string
  positions: {
    lapNumbers: number[]
    drivers: string[]
    series: Record<string, { team: string; positions: [number, number][] }>
  }
  lapTimes: {
    drivers: string[]
    series: Record<string, { team: string; laps: { lap: number; timeMs: number; compound: string }[] }>
  }
  pitStrategy: {
    drivers: string[]
    totalLaps: number
    strategy: Record<string, { team: string; stints: { compound: string; startLap: number; endLap: number; lapCount: number }[]; finish: number }>
  }
  tyreDeg: TyreDegData
  speedTrace: SpeedTraceData
  telemetry: TelemetryData
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TEAM_COLORS: Record<string, string> = {
  'Red Bull Racing': '#3671C6',
  'Ferrari': '#E8002D',
  'Mercedes': '#27F4D2',
  'McLaren': '#FF8000',
  'Aston Martin': '#358C75',
  'Alpine': '#FF87BC',
  'Williams': '#64C4FF',
  'RB': '#6692FF',
  'Kick Sauber': '#52E252',
  'Haas F1 Team': '#B6BABD',
}

const COMPOUND_COLORS: Record<string, string> = {
  SOFT: '#E8002D',
  MEDIUM: '#FFF200',
  HARD: '#FFFAFA',
  INTERMEDIATE: '#39B54A',
  WET: '#0067FF',
}

const COMPOUND_BG: Record<string, string> = {
  SOFT: 'rgba(232,0,45,0.18)',
  MEDIUM: 'rgba(255,242,0,0.15)',
  HARD: 'rgba(255,250,250,0.07)',
  INTERMEDIATE: 'rgba(57,181,74,0.15)',
  WET: 'rgba(0,103,255,0.15)',
}

const GEAR_COLORS: Record<number, string> = {
  1: '#ff3333', 2: '#ff6633', 3: '#ff9933',
  4: '#ffcc33', 5: '#99cc33', 6: '#33aa33',
  7: '#33aacc', 8: '#3366ff',
}

const NAV_SECTIONS = [
  { id: 'positions', label: 'RACE ORDER' },
  { id: 'laptimes', label: 'LAP TIMES' },
  { id: 'strategy', label: 'STRATEGY' },
  { id: 'tyres', label: 'TYRE DEG' },
  { id: 'speed', label: 'SPEED TRACE' },
  { id: 'telemetry', label: 'TELEMETRY' },
]

function fmtMs(ms: number) {
  const m = Math.floor(ms / 60000)
  const s = ((ms % 60000) / 1000).toFixed(3)
  return `${m}:${s.padStart(6, '0')}`
}

// ─── Shared styles ────────────────────────────────────────────────────────────

const chartCard: React.CSSProperties = {
  background: '#111213',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: 8,
  padding: '20px 8px 12px',
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function DarkTooltip({ active, payload, label, formatter }: any) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#0a0b0c',
      border: '1px solid rgba(237,40,57,0.25)',
      borderRadius: 4,
      padding: '8px 12px',
      fontFamily: 'monospace',
      fontSize: 11,
    }}>
      <p style={{ color: '#666', margin: '0 0 4px' }}>{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color || '#fff', margin: '2px 0' }}>
          {p.name}: <span style={{ color: '#ddd' }}>{formatter ? formatter(p.value, p.name) : p.value}</span>
        </p>
      ))}
    </div>
  )
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ id, title, subtitle, children }: {
  id: string; title: string; subtitle?: string; children: React.ReactNode
}) {
  return (
    <section id={id} style={{ marginBottom: 72, scrollMarginTop: 68 }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <div style={{ width: 3, height: 18, background: '#ED2839', borderRadius: 2, flexShrink: 0 }} />
          <h2 style={{
            margin: 0,
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase' as const,
            color: '#FFFAFA',
          }}>{title}</h2>
        </div>
        {subtitle && (
          <p style={{ margin: '0 0 0 13px', fontFamily: 'sans-serif', fontSize: 12, color: '#555' }}>{subtitle}</p>
        )}
      </div>
      {children}
    </section>
  )
}

// ─── 1. Position Changes ──────────────────────────────────────────────────────

function PositionChart({ data }: { data: AnalysisData['positions'] }) {
  const drivers = data.drivers.slice(0, 10)

  const chartData = data.lapNumbers.map((lap) => {
    const row: any = { lap }
    drivers.forEach((drv) => {
      const entry = data.series[drv]?.positions.find(([l]) => l === lap)
      if (entry) row[drv] = entry[1]
    })
    return row
  })

  return (
    <div style={chartCard}>
      <ResponsiveContainer width="100%" height={360}>
        <LineChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis
            dataKey="lap"
            stroke="#333"
            tick={{ fill: '#555', fontSize: 10, fontFamily: 'monospace' }}
            label={{ value: 'LAP', position: 'insideBottomRight', fill: '#444', fontSize: 10, offset: -8 }}
          />
          <YAxis
            reversed
            domain={[1, 20]}
            stroke="#333"
            tick={{ fill: '#555', fontSize: 10, fontFamily: 'monospace' }}
            tickFormatter={(v) => `P${v}`}
            ticks={[1, 3, 5, 7, 10, 15, 20]}
          />
          <Tooltip
            content={<DarkTooltip formatter={(v: number) => `P${v}`} />}
          />
          {drivers.map((drv) => (
            <Line
              key={drv}
              type="monotone"
              dataKey={drv}
              name={drv}
              stroke={TEAM_COLORS[data.series[drv]?.team] || '#666'}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 14px', padding: '12px 12px 2px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        {drivers.map((drv) => (
          <div key={drv} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 16, height: 2, background: TEAM_COLORS[data.series[drv]?.team] || '#555', borderRadius: 1 }} />
            <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#777' }}>{drv}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── 2. Lap Times ─────────────────────────────────────────────────────────────

function LapTimeChart({ data }: { data: AnalysisData['lapTimes'] }) {
  const drivers = data.drivers.slice(0, 6)

  const allLaps = new Set<number>()
  drivers.forEach((d) => data.series[d]?.laps.forEach((l) => allLaps.add(l.lap)))
  const lapNums = Array.from(allLaps).sort((a, b) => a - b)

  const chartData = lapNums.map((lap) => {
    const row: any = { lap }
    drivers.forEach((drv) => {
      const l = data.series[drv]?.laps.find((x) => x.lap === lap)
      if (l) row[drv] = +(l.timeMs / 1000).toFixed(3)
    })
    return row
  })

  const times = chartData.flatMap((r) => drivers.map((d) => r[d]).filter(Boolean))
  const minT = Math.floor(Math.min(...times))
  const maxT = Math.ceil(Math.max(...times))

  return (
    <div style={chartCard}>
      <ResponsiveContainer width="100%" height={340}>
        <LineChart data={chartData} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="lap" stroke="#333" tick={{ fill: '#555', fontSize: 10, fontFamily: 'monospace' }} />
          <YAxis
            domain={[minT - 1, maxT + 1]}
            stroke="#333"
            tick={{ fill: '#555', fontSize: 10, fontFamily: 'monospace' }}
            tickFormatter={(v) => `${v}s`}
          />
          <Tooltip content={<DarkTooltip formatter={(v: number) => `${v.toFixed(3)}s`} />} />
          {drivers.map((drv) => (
            <Line
              key={drv}
              type="monotone"
              dataKey={drv}
              name={drv}
              stroke={TEAM_COLORS[data.series[drv]?.team] || '#666'}
              strokeWidth={1.5}
              dot={false}
              connectNulls={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 14px', padding: '12px 12px 2px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        {drivers.map((drv) => (
          <div key={drv} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 16, height: 2, background: TEAM_COLORS[data.series[drv]?.team] || '#555', borderRadius: 1 }} />
            <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#777' }}>{drv}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── 3. Pit Strategy ─────────────────────────────────────────────────────────

function StrategyChart({ data }: { data: AnalysisData['pitStrategy'] }) {
  const drivers = data.drivers.slice(0, 10)
  const total = data.totalLaps

  return (
    <div style={{ ...chartCard, padding: '20px 20px 16px' }}>
      <div style={{ overflowX: 'auto' }}>
        <div style={{ minWidth: 560 }}>
          {drivers.map((drv) => {
            const s = data.strategy[drv]
            if (!s) return null
            return (
              <div key={drv} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 9 }}>
                <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#777', width: 30, textAlign: 'right', flexShrink: 0 }}>{drv}</span>
                <div style={{ flex: 1, height: 26, position: 'relative', background: 'rgba(255,255,255,0.03)', borderRadius: 3, overflow: 'hidden' }}>
                  {s.stints.map((stint, i) => {
                    const left = ((stint.startLap - 1) / total) * 100
                    const width = (stint.lapCount / total) * 100
                    return (
                      <div
                        key={i}
                        title={`${stint.compound} — L${stint.startLap}–${stint.endLap} (${stint.lapCount} laps)`}
                        style={{
                          position: 'absolute',
                          left: `${left}%`,
                          width: `calc(${width}% - 2px)`,
                          top: 2,
                          bottom: 2,
                          background: COMPOUND_BG[stint.compound] || 'rgba(255,255,255,0.05)',
                          border: `1px solid ${COMPOUND_COLORS[stint.compound] || '#444'}`,
                          borderRadius: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {width > 7 && (
                          <span style={{ fontFamily: 'monospace', fontSize: 9, color: COMPOUND_COLORS[stint.compound] || '#fff', letterSpacing: '0.04em' }}>
                            {stint.compound[0]}{stint.lapCount}
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}

          {/* Lap numbers axis */}
          <div style={{ display: 'flex', marginLeft: 40, marginTop: 6, position: 'relative', height: 14 }}>
            {[1, 10, 20, 30, 40, 50, total].map((lap) => (
              <span key={lap} style={{
                position: 'absolute',
                left: `${((lap - 1) / total) * 100}%`,
                fontFamily: 'monospace',
                fontSize: 9,
                color: '#444',
                transform: 'translateX(-50%)',
              }}>{lap}</span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 14, marginTop: 16, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.05)', flexWrap: 'wrap' }}>
        {['SOFT', 'MEDIUM', 'HARD', 'INTERMEDIATE', 'WET'].map((c) => (
          <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: COMPOUND_BG[c], border: `1px solid ${COMPOUND_COLORS[c]}` }} />
            <span style={{ fontFamily: 'monospace', fontSize: 9, color: '#666' }}>{c}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── 4. Tyre Degradation ──────────────────────────────────────────────────────

function TyreDegChart({ data }: { data: TyreDegData }) {
  const compounds = Object.keys(data.compounds || {})
  if (!compounds.length) {
    return (
      <div style={{ ...chartCard, padding: 40, textAlign: 'center', color: '#444', fontFamily: 'monospace', fontSize: 12 }}>
        No tyre degradation data available
      </div>
    )
  }

  const maxAge = Math.max(...compounds.flatMap((c) => data.compounds[c].tyreAges))
  const chartData: any[] = []
  for (let age = 1; age <= maxAge; age++) {
    const row: any = { age }
    compounds.forEach((c) => {
      const idx = data.compounds[c].tyreAges.indexOf(age)
      if (idx !== -1) row[c] = +(data.compounds[c].lapTimesMs[idx] / 1000).toFixed(3)
    })
    chartData.push(row)
  }

  const allTimes = chartData.flatMap((r) => compounds.map((c) => r[c]).filter(Boolean))
  const minT = Math.floor(Math.min(...allTimes))

  return (
    <div style={chartCard}>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis
            dataKey="age"
            stroke="#333"
            tick={{ fill: '#555', fontSize: 10, fontFamily: 'monospace' }}
            label={{ value: 'TYRE AGE (laps)', position: 'insideBottomRight', fill: '#444', fontSize: 9, offset: -8 }}
          />
          <YAxis
            domain={[minT - 0.5, 'auto']}
            stroke="#333"
            tick={{ fill: '#555', fontSize: 10, fontFamily: 'monospace' }}
            tickFormatter={(v) => `${v}s`}
          />
          <Tooltip content={<DarkTooltip formatter={(v: number) => `${v.toFixed(3)}s`} />} />
          {compounds.map((c) => (
            <Line
              key={c}
              type="monotone"
              dataKey={c}
              name={c}
              stroke={COMPOUND_COLORS[c] || '#888'}
              strokeWidth={2}
              dot={false}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      <div style={{ display: 'flex', gap: 14, padding: '10px 12px 2px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        {compounds.map((c) => (
          <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 16, height: 2, background: COMPOUND_COLORS[c] || '#888', borderRadius: 1 }} />
            <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#777' }}>{c}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── 5. Speed Trace ───────────────────────────────────────────────────────────

function SpeedTraceChart({ data }: { data: SpeedTraceData }) {
  const raw = data.trace.distance.map((d, i) => ({
    dist: +d.toFixed(1),
    speed: data.trace.speed[i],
    throttle: data.trace.throttle[i],
    brake: data.trace.brake[i],
  }))
  // Downsample to ~300 points max
  const step = Math.max(1, Math.floor(raw.length / 300))
  const pts = raw.filter((_, i) => i % step === 0)

  return (
    <div style={{ ...chartCard, padding: '0 0 12px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#666', letterSpacing: '0.06em' }}>
          FASTEST LAP · {data.driver} · {data.team}
        </span>
        <span style={{ fontFamily: 'monospace', fontSize: 14, color: '#ED2839', letterSpacing: '0.04em' }}>
          {fmtMs(data.lapTime)}
        </span>
      </div>

      {/* Speed */}
      <div style={{ padding: '14px 8px 0' }}>
        <p style={{ fontFamily: 'monospace', fontSize: 9, color: '#555', margin: '0 0 2px 12px', letterSpacing: '0.08em' }}>SPEED km/h</p>
        <ResponsiveContainer width="100%" height={150}>
          <AreaChart data={pts} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
            <defs>
              <linearGradient id="spGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ED2839" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#ED2839" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="dist" hide />
            <YAxis stroke="#333" tick={{ fill: '#555', fontSize: 9, fontFamily: 'monospace' }} domain={[0, 330]} ticks={[0, 100, 200, 300]} />
            <Tooltip content={<DarkTooltip formatter={(v: number) => `${v} km/h`} />} />
            <Area type="monotone" dataKey="speed" name="Speed" stroke="#ED2839" strokeWidth={1.5} fill="url(#spGrad)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Throttle */}
      <div style={{ padding: '10px 8px 0' }}>
        <p style={{ fontFamily: 'monospace', fontSize: 9, color: '#555', margin: '0 0 2px 12px', letterSpacing: '0.08em' }}>THROTTLE %</p>
        <ResponsiveContainer width="100%" height={70}>
          <AreaChart data={pts} margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="thGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#39B54A" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#39B54A" stopOpacity={0} />
              </linearGradient>
            </defs>
            <YAxis stroke="#333" tick={{ fill: '#555', fontSize: 9, fontFamily: 'monospace' }} domain={[0, 100]} ticks={[0, 50, 100]} />
            <XAxis dataKey="dist" hide />
            <Tooltip content={<DarkTooltip formatter={(v: number) => `${v}%`} />} />
            <Area type="monotone" dataKey="throttle" name="Throttle" stroke="#39B54A" strokeWidth={1} fill="url(#thGrad)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Brake */}
      <div style={{ padding: '10px 8px 0' }}>
        <p style={{ fontFamily: 'monospace', fontSize: 9, color: '#555', margin: '0 0 2px 12px', letterSpacing: '0.08em' }}>BRAKE</p>
        <ResponsiveContainer width="100%" height={50}>
          <AreaChart data={pts} margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="bkGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFF200" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#FFF200" stopOpacity={0} />
              </linearGradient>
            </defs>
            <YAxis hide domain={[0, 1]} />
            <XAxis dataKey="dist" stroke="#333" tick={{ fill: '#444', fontSize: 8, fontFamily: 'monospace' }} tickFormatter={(v) => `${Math.round(v)}m`} />
            <Tooltip content={<DarkTooltip formatter={(v: number) => v ? 'ON' : 'OFF'} />} />
            <Area type="step" dataKey="brake" name="Brake" stroke="#FFF200" strokeWidth={1} fill="url(#bkGrad)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// ─── 6. Telemetry ─────────────────────────────────────────────────────────────

function TelemetryChart({ data }: { data: TelemetryData }) {
  const t = data.telemetry
  const pts = t.distance.map((d, i) => ({
    dist: +d.toFixed(1),
    speed: t.speed[i],
    throttle: t.throttle[i],
    brake: t.brake[i],
    gear: t.gear[i],
    rpm: t.rpm[i],
  }))

  return (
    <div style={{ ...chartCard, padding: '0 0 12px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#666', letterSpacing: '0.06em' }}>
          FASTEST LAP TELEMETRY · {data.driver}
        </span>
        <span style={{ fontFamily: 'monospace', fontSize: 14, color: '#ED2839' }}>{fmtMs(data.lapTime)}</span>
      </div>

      {/* Speed + RPM */}
      <div style={{ padding: '14px 8px 0' }}>
        <p style={{ fontFamily: 'monospace', fontSize: 9, color: '#555', margin: '0 0 2px 12px', letterSpacing: '0.08em' }}>SPEED km/h · RPM</p>
        <ResponsiveContainer width="100%" height={170}>
          <LineChart data={pts} margin={{ top: 4, right: 50, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="dist" hide />
            <YAxis yAxisId="spd" stroke="#333" tick={{ fill: '#555', fontSize: 9, fontFamily: 'monospace' }} domain={[0, 330]} ticks={[0, 100, 200, 300]} />
            <YAxis yAxisId="rpm" orientation="right" stroke="#333" tick={{ fill: '#555', fontSize: 9, fontFamily: 'monospace' }} domain={[0, 14000]} ticks={[0, 5000, 10000]} />
            <Tooltip content={<DarkTooltip />} />
            <Line yAxisId="spd" type="monotone" dataKey="speed" name="Speed" stroke="#ED2839" strokeWidth={2} dot={false} />
            <Line yAxisId="rpm" type="monotone" dataKey="rpm" name="RPM" stroke="#3671C6" strokeWidth={1.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Throttle + Brake */}
      <div style={{ padding: '10px 8px 0' }}>
        <p style={{ fontFamily: 'monospace', fontSize: 9, color: '#555', margin: '0 0 2px 12px', letterSpacing: '0.08em' }}>THROTTLE % · BRAKE</p>
        <ResponsiveContainer width="100%" height={80}>
          <LineChart data={pts} margin={{ top: 0, right: 50, left: 0, bottom: 0 }}>
            <YAxis stroke="#333" tick={{ fill: '#555', fontSize: 9, fontFamily: 'monospace' }} domain={[0, 1]} ticks={[0, 1]} />
            <XAxis dataKey="dist" hide />
            <Tooltip content={<DarkTooltip />} />
            <Line type="monotone" dataKey="throttle" name="Throttle %" stroke="#39B54A" strokeWidth={1.5} dot={false} />
            <Line type="step" dataKey="brake" name="Brake" stroke="#FFF200" strokeWidth={1.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Gear map */}
      <div style={{ padding: '10px 20px 4px' }}>
        <p style={{ fontFamily: 'monospace', fontSize: 9, color: '#555', margin: '0 0 5px', letterSpacing: '0.08em' }}>GEAR MAP</p>
        <div style={{ display: 'flex', height: 20, borderRadius: 3, overflow: 'hidden', gap: 1 }}>
          {pts.map((p, i) => (
            <div
              key={i}
              title={`G${p.gear} @ ${p.dist}m`}
              style={{ flex: 1, background: GEAR_COLORS[p.gear] || '#333', minWidth: 1 }}
            />
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 6, flexWrap: 'wrap' }}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((g) => (
            <div key={g} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 8, height: 8, background: GEAR_COLORS[g], borderRadius: 2 }} />
              <span style={{ fontFamily: 'monospace', fontSize: 9, color: '#555' }}>G{g}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Main Analysis Page ───────────────────────────────────────────────────────

export default function AnalysisPage({ data }: { data: AnalysisData }) {
  const [activeSection, setActiveSection] = useState('positions')

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    NAV_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id) },
        { threshold: 0.25, rootMargin: '-64px 0px -50% 0px' }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach((o) => o.disconnect())
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const winner = data.positions?.drivers?.[0]
  const winnerTeam = winner ? data.positions.series[winner]?.team : null
  const raceDate = new Date(data.date).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div style={{ background: '#0D0E0F', minHeight: '100vh', color: '#FFFAFA' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,600;0,700;0,800;0,900;1,700&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: #111; }
        ::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 2px; }
      `}</style>

      {/* ── Race Hero ─────────────────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(180deg, rgba(237,40,57,0.07) 0%, transparent 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        padding: '52px 0 36px',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <p style={{ fontFamily: 'monospace', fontSize: 10, color: '#ED2839', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 6 }}>
              Round {data.round} · {data.year} Season · Post-Race Analysis
            </p>
            <h1 style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 'clamp(32px, 5vw, 52px)',
              fontWeight: 800,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: '#FFFAFA',
              lineHeight: 1.05,
              marginBottom: 8,
            }}>
              {data.raceName}
            </h1>
            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, color: '#555' }}>
              {data.circuit} · {raceDate}
            </p>
          </div>

          {winner && (
            <div style={{
              background: 'rgba(237,40,57,0.06)',
              border: '1px solid rgba(237,40,57,0.18)',
              borderRadius: 8,
              padding: '14px 22px',
              textAlign: 'center',
              flexShrink: 0,
            }}>
              <p style={{ fontFamily: 'monospace', fontSize: 9, color: '#ED2839', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 6 }}>Race Winner</p>
              <p style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 32,
                fontWeight: 900,
                letterSpacing: '0.06em',
                color: '#FFFAFA',
                lineHeight: 1,
                marginBottom: 4,
              }}>{winner}</p>
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, color: '#555' }}>{winnerTeam}</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Sticky Nav ────────────────────────────────────────────────────── */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        background: 'rgba(13,14,15,0.96)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', display: 'flex', overflowX: 'auto' }}>
          {NAV_SECTIONS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: activeSection === id ? '2px solid #ED2839' : '2px solid transparent',
                cursor: 'pointer',
                padding: '13px 15px',
                fontFamily: 'monospace',
                fontSize: 10,
                letterSpacing: '0.1em',
                color: activeSection === id ? '#ED2839' : '#444',
                transition: 'color 0.15s',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Charts ────────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '52px 24px 100px' }}>

        {data.positions && (
          <Section id="positions" title="Race Order" subtitle="Position changes lap-by-lap — top 10 finishers">
            <PositionChart data={data.positions} />
          </Section>
        )}

        {data.lapTimes && (
          <Section id="laptimes" title="Lap Time Comparison" subtitle="Race pace per lap, coloured by constructor">
            <LapTimeChart data={data.lapTimes} />
          </Section>
        )}

        {data.pitStrategy && (
          <Section id="strategy" title="Pit Strategy" subtitle="Stint length and compound selection — top 10">
            <StrategyChart data={data.pitStrategy} />
          </Section>
        )}

        {data.tyreDeg && (
          <Section id="tyres" title="Tyre Degradation" subtitle="Median lap time vs tyre age per compound">
            <TyreDegChart data={data.tyreDeg} />
          </Section>
        )}

        {data.speedTrace && (
          <Section id="speed" title="Speed Trace" subtitle={`Fastest lap — ${data.speedTrace.driver} · ${fmtMs(data.speedTrace.lapTime)}`}>
            <SpeedTraceChart data={data.speedTrace} />
          </Section>
        )}

        {data.telemetry && (
          <Section id="telemetry" title="Telemetry" subtitle={`Full input trace — ${data.telemetry.driver} · fastest lap`}>
            <TelemetryChart data={data.telemetry} />
          </Section>
        )}

      </div>
    </div>
  )
}
