export interface CircuitMeta {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  flag: string;
  svgPath: string;
  svgInlinePath: string;
}

const baseCircuits: Record<string, CircuitMeta> = {
  bahrain: {
    id: 'bahrain',
    name: 'Bahrain International Circuit',
    country: 'Bahrain',
    countryCode: 'BH',
    flag: '🇧🇭',
    svgPath: '/tracks/bahrain.svg',
    svgInlinePath: '/tracks/bahrain.svg',
  },
  jeddah: {
    id: 'jeddah',
    name: 'Jeddah Corniche Circuit',
    country: 'Saudi Arabia',
    countryCode: 'SA',
    flag: '🇸🇦',
    svgPath: '/tracks/jeddah.svg',
    svgInlinePath: '/tracks/jeddah.svg',
  },
  albert_park: {
    id: 'albert_park',
    name: 'Albert Park Circuit',
    country: 'Australia',
    countryCode: 'AU',
    flag: '🇦🇺',
    svgPath: '/tracks/albert-park.svg',
    svgInlinePath: '/tracks/albert-park.svg',
  },
  suzuka: {
    id: 'suzuka',
    name: 'Suzuka International Racing Course',
    country: 'Japan',
    countryCode: 'JP',
    flag: '🇯🇵',
    svgPath: '/tracks/suzuka.svg',
    svgInlinePath: '/tracks/suzuka.svg',
  },
  shanghai: {
    id: 'shanghai',
    name: 'Shanghai International Circuit',
    country: 'China',
    countryCode: 'CN',
    flag: '🇨🇳',
    svgPath: '/tracks/shanghai.svg',
    svgInlinePath: '/tracks/shanghai.svg',
  },
  miami: {
    id: 'miami',
    name: 'Miami International Autodrome',
    country: 'United States',
    countryCode: 'US',
    flag: '🇺🇸',
    svgPath: '/tracks/miami.svg',
    svgInlinePath: '/tracks/miami.svg',
  },
  imola: {
    id: 'imola',
    name: 'Autodromo Enzo e Dino Ferrari',
    country: 'Italy',
    countryCode: 'IT',
    flag: '🇮🇹',
    svgPath: '/tracks/imola.svg',
    svgInlinePath: '/tracks/imola.svg',
  },
  monaco: {
    id: 'monaco',
    name: 'Circuit de Monaco',
    country: 'Monaco',
    countryCode: 'MC',
    flag: '🇲🇨',
    svgPath: '/tracks/monaco.svg',
    svgInlinePath: '/tracks/monaco.svg',
  },
  barcelona: {
    id: 'barcelona',
    name: 'Circuit de Barcelona-Catalunya',
    country: 'Spain',
    countryCode: 'ES',
    flag: '🇪🇸',
    svgPath: '/tracks/barcelona.svg',
    svgInlinePath: '/tracks/barcelona.svg',
  },
  montreal: {
    id: 'montreal',
    name: 'Circuit Gilles Villeneuve',
    country: 'Canada',
    countryCode: 'CA',
    flag: '🇨🇦',
    svgPath: '/tracks/montreal.svg',
    svgInlinePath: '/tracks/montreal.svg',
  },
  spielberg: {
    id: 'spielberg',
    name: 'Red Bull Ring',
    country: 'Austria',
    countryCode: 'AT',
    flag: '🇦🇹',
    svgPath: '/tracks/spielberg.svg',
    svgInlinePath: '/tracks/spielberg.svg',
  },
  silverstone: {
    id: 'silverstone',
    name: 'Silverstone Circuit',
    country: 'United Kingdom',
    countryCode: 'GB',
    flag: '🇬🇧',
    svgPath: '/tracks/silverstone.svg',
    svgInlinePath: '/tracks/silverstone.svg',
  },
  budapest: {
    id: 'budapest',
    name: 'Hungaroring',
    country: 'Hungary',
    countryCode: 'HU',
    flag: '🇭🇺',
    svgPath: '/tracks/budapest.svg',
    svgInlinePath: '/tracks/budapest.svg',
  },
  spa: {
    id: 'spa',
    name: 'Circuit de Spa-Francorchamps',
    country: 'Belgium',
    countryCode: 'BE',
    flag: '🇧🇪',
    svgPath: '/tracks/spa.svg',
    svgInlinePath: '/tracks/spa.svg',
  },
  zandvoort: {
    id: 'zandvoort',
    name: 'Circuit Zandvoort',
    country: 'Netherlands',
    countryCode: 'NL',
    flag: '🇳🇱',
    svgPath: '/tracks/zandvoort.svg',
    svgInlinePath: '/tracks/zandvoort.svg',
  },
  monza: {
    id: 'monza',
    name: 'Autodromo Nazionale Monza',
    country: 'Italy',
    countryCode: 'IT',
    flag: '🇮🇹',
    svgPath: '/tracks/monza.svg',
    svgInlinePath: '/tracks/monza.svg',
  },
  baku: {
    id: 'baku',
    name: 'Baku City Circuit',
    country: 'Azerbaijan',
    countryCode: 'AZ',
    flag: '🇦🇿',
    svgPath: '/tracks/baku.svg',
    svgInlinePath: '/tracks/baku.svg',
  },
  singapore: {
    id: 'singapore',
    name: 'Marina Bay Street Circuit',
    country: 'Singapore',
    countryCode: 'SG',
    flag: '🇸🇬',
    svgPath: '/tracks/singapore.svg',
    svgInlinePath: '/tracks/singapore.svg',
  },
  austin: {
    id: 'austin',
    name: 'Circuit of The Americas',
    country: 'United States',
    countryCode: 'US',
    flag: '🇺🇸',
    svgPath: '/tracks/austin.svg',
    svgInlinePath: '/tracks/austin.svg',
  },
  mexico_city: {
    id: 'mexico_city',
    name: 'Autodromo Hermanos Rodriguez',
    country: 'Mexico',
    countryCode: 'MX',
    flag: '🇲🇽',
    svgPath: '/tracks/mexico-city.svg',
    svgInlinePath: '/tracks/mexico-city.svg',
  },
  interlagos: {
    id: 'interlagos',
    name: 'Autodromo Jose Carlos Pace',
    country: 'Brazil',
    countryCode: 'BR',
    flag: '🇧🇷',
    svgPath: '/tracks/interlagos.svg',
    svgInlinePath: '/tracks/interlagos.svg',
  },
  las_vegas: {
    id: 'las_vegas',
    name: 'Las Vegas Strip Circuit',
    country: 'United States',
    countryCode: 'US',
    flag: '🇺🇸',
    svgPath: '/tracks/las-vegas.svg',
    svgInlinePath: '/tracks/las-vegas.svg',
  },
  lusail: {
    id: 'lusail',
    name: 'Lusail International Circuit',
    country: 'Qatar',
    countryCode: 'QA',
    flag: '🇶🇦',
    svgPath: '/tracks/lusail.svg',
    svgInlinePath: '/tracks/lusail.svg',
  },
  yas_marina: {
    id: 'yas_marina',
    name: 'Yas Marina Circuit',
    country: 'UAE',
    countryCode: 'AE',
    flag: '🇦🇪',
    svgPath: '/tracks/yas-marina.svg',
    svgInlinePath: '/tracks/yas-marina.svg',
  },
};

// Aliases so existing track IDs can be used directly.
const aliases: Record<string, keyof typeof baseCircuits> = {
  melbourne: 'albert_park',
  'mexico-city': 'mexico_city',
  'las-vegas': 'las_vegas',
  'yas-marina': 'yas_marina',
};

export const CIRCUITS: Record<string, CircuitMeta> = Object.entries(
  baseCircuits,
).reduce((acc, [key, value]) => {
  acc[key] = value;
  return acc;
}, {} as Record<string, CircuitMeta>);

Object.entries(aliases).forEach(([alias, target]) => {
  const meta = baseCircuits[target];
  if (meta) {
    CIRCUITS[alias] = { ...meta, id: alias };
  }
});

export function getCircuit(id: string): CircuitMeta | null {
  return CIRCUITS[id] ?? null;
}

export function getCircuitSVG(id: string): string {
  return CIRCUITS[id]?.svgPath ?? '/tracks/placeholder.svg';
}

/**
 * Map a race ID like "australia-2026" to a circuit ID used by CIRCUITS.
 */
export function getCircuitIdForRace(raceId: string): string | null {
  const base = raceId.replace(/-\d{4}$/, '');
  const map: Record<string, string> = {
    australia: 'albert_park',
    china: 'shanghai',
    japan: 'suzuka',
    bahrain: 'bahrain',
    jeddah: 'jeddah',
    miami: 'miami',
    imola: 'imola',
    monaco: 'monaco',
    spain: 'barcelona',
    canada: 'montreal',
    austria: 'spielberg',
    britain: 'silverstone',
    belgium: 'spa',
    hungary: 'budapest',
    netherlands: 'zandvoort',
    monza: 'monza',
    azerbaijan: 'baku',
    singapore: 'singapore',
    usa: 'austin',
    mexico: 'mexico_city',
    brazil: 'interlagos',
    'las-vegas': 'las_vegas',
    qatar: 'lusail',
    'abu-dhabi': 'yas_marina',
  };
  const cid = map[base];
  return cid && CIRCUITS[cid] ? cid : null;
}

