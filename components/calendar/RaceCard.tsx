'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import CircuitIcon from '@/components/ui/CircuitIcon';
import CircuitIconInline from '@/components/ui/CircuitIconInline';
import { getCircuitIdForRace } from '@/lib/circuitMaps';
import { getRaceStatus } from '@/lib/data/calendar';
import { getFlagEmoji, formatSessionDate, formatSessionTime } from '@/lib/utils';

interface RaceCardProps {
  race: any;
  href?: string;
  ctaLabel?: string;
  featured?: boolean;
  timezone?: string;
  use24h?: boolean;
}

const statusConfig = {
  completed: { bg: 'bg-gunmetal-deep border-snow/10', badge: 'text-snow/40 border-snow/10', label: 'COMPLETED', dot: 'bg-snow/20' },
  live: { bg: 'bg-red-dim border-red shadow-[0_0_20px_rgba(237,40,57,0.15)]', badge: 'text-red border-red/30 bg-red/10', label: 'LIVE', dot: 'bg-red animate-pulse' },
  upcoming: { bg: 'bg-gunmetal border-snow/5', badge: 'text-[#27F4D2] border-[#27F4D2]/30 bg-[#27F4D2]/10', label: 'UPCOMING', dot: 'bg-[#27F4D2]' },
};

export default function RaceCard({
  race,
  href,
  ctaLabel = 'View Weekend →',
  featured = false,
  timezone = 'UTC',
  use24h = true,
}: RaceCardProps) {
  const status = getRaceStatus(race);
  const conf = statusConfig[status];
  const destination = href ?? `/calendar/${race.id}`;

  return (
    <Link
      href={destination}
      className={`block group relative overflow-hidden transition-all duration-400 border border-t-2 ${conf.bg} hover:border-t-red hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(237,40,57,0.15)] bg-gunmetal-deep h-full
        ${featured ? 'border-red shadow-[0_0_20px_rgba(237,40,57,0.15)] race-card--featured' : ''}
      `}
    >
      {/* Featured Badge */}
      {featured && (
        <div className="absolute top-0 left-4 bg-red text-snow font-barlow font-bold text-[10px] tracking-widest px-2 py-0.5 rounded-b-sm z-20">
          MOST RECENT
        </div>
      )}

      {/* Track Layout Watermark */}
      <div className="absolute -bottom-4 right-[-5%] w-[55%] h-[70%] pointer-events-none opacity-[0.15] group-hover:opacity-[0.3] group-hover:scale-105 transition-all duration-700 flex items-end justify-end">
        {getCircuitIdForRace(race.id) && (
          <CircuitIconInline
            circuitId={getCircuitIdForRace(race.id)!}
            className="circuit-watermark"
            animate={false}
            color="var(--snow)"
            opacity={0.12}
          />
        )}
      </div>

      <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-full border border-red flex items-center justify-center font-mono font-bold text-red bg-red/5">
            {race.round.toString().padStart(2, '0')}
          </div>
          <div className={`px-2.5 py-1 rounded-sm border ${conf.badge} text-[10px] font-mono font-bold tracking-widest flex items-center gap-2`}>
            <span className={`w-1.5 h-1.5 rounded-full ${conf.dot}`} />
            {conf.label}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3 mb-2">
            {getCircuitIdForRace(race.id) ? (
              <CircuitIcon
                circuitId={getCircuitIdForRace(race.id)!}
                size="sm"
                variant="white"
              />
            ) : (
              <span className="text-3xl filter drop-shadow-md">
                {getFlagEmoji(race.countryCode)}
              </span>
            )}
            {race.isSprint && (
              <span className="px-2 py-0.5 border border-red/30 bg-red-dim text-red text-[10px] font-mono font-bold tracking-wider uppercase">Sprint Weekend</span>
            )}
          </div>
          <h3 className="font-barlow font-bold uppercase leading-tight mb-1 group-hover:text-red transition-colors text-3xl">{race.circuitName}</h3>
          <p className="text-sm font-jakarta text-snow/50">{race.country}</p>

          <div className="mt-4 pt-4 border-t border-snow/10 flex items-center justify-between">
            <span className="font-mono text-xs text-snow/40 uppercase tracking-widest">
              {formatSessionDate(race.sessions.race, timezone)}
            </span>
            <span className="font-mono text-sm font-bold text-snow">
              {formatSessionTime(race.sessions.race, timezone, use24h)}
            </span>
          </div>

          <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-right">
            <span className="text-red font-barlow font-bold text-xs uppercase tracking-widest">{ctaLabel}</span>
          </div>

          {status === 'completed' && race.results.winner && (
            <div className="absolute top-6 right-6 text-right opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="text-[10px] font-mono text-snow/30 uppercase tracking-widest mb-1">Winner</div>
              <div className="font-barlow font-bold text-xl text-[#FFC800]">{race.results.winner.driver}</div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
