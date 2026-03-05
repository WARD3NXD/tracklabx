import Image from 'next/image';
import { getCircuitSVG } from '@/lib/circuitMaps';

interface CircuitIconProps {
  circuitId: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'white' | 'red' | 'team';
  className?: string;
}

const SIZES: Record<
  NonNullable<CircuitIconProps['size']>,
  { width: number; height: number }
> = {
  sm: { width: 48, height: 36 },
  md: { width: 80, height: 60 },
  lg: { width: 140, height: 105 },
  xl: { width: 220, height: 165 },
};

export default function CircuitIcon({
  circuitId,
  size = 'md',
  variant = 'white',
  className = '',
}: CircuitIconProps) {
  const { width, height } = SIZES[size];

  const filterClass =
    {
      white: 'circuit-filter-white',
      red: 'circuit-filter-red',
      team: 'circuit-filter-team',
    }[variant] ?? 'circuit-filter-white';

  return (
    <div
      className={`circuit-icon-wrapper ${className}`}
      style={{ width, height }}
    >
      <Image
        src={getCircuitSVG(circuitId)}
        alt={`${circuitId} circuit map`}
        width={width}
        height={height}
        className={`circuit-icon ${filterClass}`}
      />
    </div>
  );
}

