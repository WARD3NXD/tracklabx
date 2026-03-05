export interface Driver {
    id: string;
    name: string;
    shortName: string;
    number: number;
    teamId: string;
    nationality: string;
    /** Base rating 0-100 reflecting overall pace/skill */
    rating: number;
    /** Recent form modifier (-5 to +5) */
    form: number;
}

// 2025 F1 Grid — 20 drivers
export const drivers: Driver[] = [
    // Red Bull Racing
    { id: 'verstappen', name: 'Max Verstappen', shortName: 'VER', number: 1, teamId: 'red-bull', nationality: 'NL', rating: 97, form: 3 },
    { id: 'lawson', name: 'Liam Lawson', shortName: 'LAW', number: 30, teamId: 'red-bull', nationality: 'NZ', rating: 78, form: 1 },

    // Ferrari
    { id: 'hamilton', name: 'Lewis Hamilton', shortName: 'HAM', number: 44, teamId: 'ferrari', nationality: 'GB', rating: 93, form: 2 },
    { id: 'leclerc', name: 'Charles Leclerc', shortName: 'LEC', number: 16, teamId: 'ferrari', nationality: 'MC', rating: 92, form: 3 },

    // McLaren
    { id: 'norris', name: 'Lando Norris', shortName: 'NOR', number: 4, teamId: 'mclaren', nationality: 'GB', rating: 93, form: 4 },
    { id: 'piastri', name: 'Oscar Piastri', shortName: 'PIA', number: 81, teamId: 'mclaren', nationality: 'AU', rating: 89, form: 3 },

    // Mercedes
    { id: 'russell', name: 'George Russell', shortName: 'RUS', number: 63, teamId: 'mercedes', nationality: 'GB', rating: 89, form: 1 },
    { id: 'antonelli', name: 'Kimi Antonelli', shortName: 'ANT', number: 12, teamId: 'mercedes', nationality: 'IT', rating: 80, form: 2 },

    // Aston Martin
    { id: 'alonso', name: 'Fernando Alonso', shortName: 'ALO', number: 14, teamId: 'aston-martin', nationality: 'ES', rating: 88, form: 0 },
    { id: 'stroll', name: 'Lance Stroll', shortName: 'STR', number: 18, teamId: 'aston-martin', nationality: 'CA', rating: 74, form: -1 },

    // Alpine
    { id: 'gasly', name: 'Pierre Gasly', shortName: 'GAS', number: 10, teamId: 'alpine', nationality: 'FR', rating: 82, form: 1 },
    { id: 'doohan', name: 'Jack Doohan', shortName: 'DOO', number: 7, teamId: 'alpine', nationality: 'AU', rating: 72, form: 0 },

    // Williams
    { id: 'sainz', name: 'Carlos Sainz', shortName: 'SAI', number: 55, teamId: 'williams', nationality: 'ES', rating: 88, form: 1 },
    { id: 'albon', name: 'Alexander Albon', shortName: 'ALB', number: 23, teamId: 'williams', nationality: 'TH', rating: 82, form: 0 },

    // Haas
    { id: 'ocon', name: 'Esteban Ocon', shortName: 'OCO', number: 31, teamId: 'haas', nationality: 'FR', rating: 79, form: 1 },
    { id: 'bearman', name: 'Oliver Bearman', shortName: 'BEA', number: 87, teamId: 'haas', nationality: 'GB', rating: 75, form: 2 },

    // Racing Bulls
    { id: 'tsunoda', name: 'Yuki Tsunoda', shortName: 'TSU', number: 22, teamId: 'racing-bulls', nationality: 'JP', rating: 81, form: 2 },
    { id: 'hadjar', name: 'Isack Hadjar', shortName: 'HAD', number: 6, teamId: 'racing-bulls', nationality: 'FR', rating: 73, form: 1 },

    // Kick Sauber
    { id: 'hulkenberg', name: 'Nico Hülkenberg', shortName: 'HUL', number: 27, teamId: 'sauber', nationality: 'DE', rating: 80, form: 0 },
    { id: 'bortoleto', name: 'Gabriel Bortoleto', shortName: 'BOR', number: 5, teamId: 'sauber', nationality: 'BR', rating: 72, form: 1 },
];

export function getDriverById(id: string): Driver | undefined {
    return drivers.find(d => d.id === id);
}

export function getDriversByTeam(teamId: string): Driver[] {
    return drivers.filter(d => d.teamId === teamId);
}
