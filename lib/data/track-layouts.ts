// Maps race IDs to their track layout SVG file in /public/tracks/
const circuitSvgByRaceKey: Record<string, string> = {
    'australia': '/tracks/albert-park.svg',
    'china': '/tracks/shanghai.svg',
    'japan': '/tracks/suzuka.svg',
    'bahrain': '/tracks/bahrain.svg',
    'jeddah': '/tracks/jeddah.svg',
    'miami': '/tracks/miami.svg',
    'imola': '/tracks/imola.svg',
    'monaco': '/tracks/monaco.svg',
    'spain': '/tracks/barcelona.svg',
    'canada': '/tracks/montreal.svg',
    'austria': '/tracks/spielberg.svg',
    'britain': '/tracks/silverstone.svg',
    'belgium': '/tracks/spa.svg',
    'hungary': '/tracks/budapest.svg',
    'netherlands': '/tracks/zandvoort.svg',
    'monza': '/tracks/monza.svg',
    'azerbaijan': '/tracks/baku.svg',
    'singapore': '/tracks/singapore.svg',
    'usa': '/tracks/austin.svg',
    'mexico': '/tracks/mexico-city.svg',
    'brazil': '/tracks/interlagos.svg',
    'las-vegas': '/tracks/las-vegas.svg',
    'qatar': '/tracks/lusail.svg',
    'abu-dhabi': '/tracks/yas-marina.svg',
};

// Year-specific overrides (when a circuit changes between seasons)
const yearOverrides: Record<string, string> = {
    'spain-2026': '/tracks/madrid.svg',  // Madrid replaces Barcelona in 2026
};

/**
 * Get the track SVG path for a given race ID (e.g. "australia-2025" or "spain-2026").
 * Checks year-specific overrides first, then falls back to base circuit key.
 */
export function getTrackSvg(raceId: string): string {
    // Check for year-specific override first
    if (yearOverrides[raceId]) return yearOverrides[raceId];
    // Strip the last "-YYYY" to get the base key
    const key = raceId.replace(/-\d{4}$/, '');
    return circuitSvgByRaceKey[key] || '';
}

// Maps setup-page track IDs (e.g. "melbourne", "bahrain") to SVG paths
const trackIdToSvg: Record<string, string> = {
    'melbourne': '/tracks/albert-park.svg',
    'bahrain': '/tracks/bahrain.svg',
    'jeddah': '/tracks/jeddah.svg',
    'suzuka': '/tracks/suzuka.svg',
    'shanghai': '/tracks/shanghai.svg',
    'miami': '/tracks/miami.svg',
    'imola': '/tracks/imola.svg',
    'monaco': '/tracks/monaco.svg',
    'barcelona': '/tracks/barcelona.svg',
    'montreal': '/tracks/montreal.svg',
    'spielberg': '/tracks/spielberg.svg',
    'silverstone': '/tracks/silverstone.svg',
    'spa': '/tracks/spa.svg',
    'budapest': '/tracks/budapest.svg',
    'zandvoort': '/tracks/zandvoort.svg',
    'monza': '/tracks/monza.svg',
    'baku': '/tracks/baku.svg',
    'singapore': '/tracks/singapore.svg',
    'austin': '/tracks/austin.svg',
    'mexico-city': '/tracks/mexico-city.svg',
    'interlagos': '/tracks/interlagos.svg',
    'las-vegas': '/tracks/las-vegas.svg',
    'lusail': '/tracks/lusail.svg',
    'yas-marina': '/tracks/yas-marina.svg',
};

/**
 * Get the track SVG path for a setup-page track ID (e.g. "melbourne", "spa").
 */
export function getTrackSvgById(trackId: string): string {
    return trackIdToSvg[trackId] || '';
}
