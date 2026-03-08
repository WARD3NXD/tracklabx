'use client';

import { motion, AnimatePresence } from 'framer-motion';

type LiveWeatherBarProps = {
  weather: any | null;
};

export default function LiveWeatherBar({ weather }: LiveWeatherBarProps) {
  if (!weather) return null;

  const items = [
    {
      label: 'Air',
      value:
        weather.air_temperature != null
          ? `${weather.air_temperature.toFixed(1)}°C`
          : '--',
      icon: '🌡',
    },
    {
      label: 'Track',
      value:
        weather.track_temperature != null
          ? `${weather.track_temperature.toFixed(1)}°C`
          : '--',
      icon: '🛣',
    },
    {
      label: 'Wind',
      value:
        weather.wind_speed != null ? `${weather.wind_speed.toFixed(0)} km/h` : '--',
      icon: '💨',
    },
    {
      label: 'Humidity',
      value:
        weather.humidity != null ? `${weather.humidity.toFixed(0)}%` : '--',
      icon: '💧',
    },
    {
      label: 'Rain',
      value:
        weather.rainfall > 0
          ? 'RAIN'
          : weather.rainfall === 0
          ? 'NO RAIN'
          : '—',
      icon: weather.rainfall > 0 ? '🌧' : '☀️',
    },
  ];

  return (
    <div className="w-full border-y border-border-red/30 bg-carbon/80">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center gap-4 text-xs sm:text-sm font-mono text-snow/80">
        <AnimatePresence initial={false}>
          {items.map((item) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2"
            >
              <span className="opacity-80">{item.icon}</span>
              <span className="uppercase tracking-[0.18em] text-[0.68rem] text-snow/40">
                {item.label}
              </span>
              <span className="tabular-nums">{item.value}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

