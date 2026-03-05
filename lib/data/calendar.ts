export interface RaceSession {
    fp1: string | null;
    fp2: string | null;
    fp3: string | null;
    sprintShootout: string | null;
    sprint: string | null;
    qualifying: string;
    race: string;
}

export interface RaceResult {
    winner: { driver: string; team: string; time: string } | null;
    pole: { driver: string; team: string; lapTime: string } | null;
    fastestLap: { driver: string; team: string; lapTime: string } | null;
}

export interface GridPrediction {
    position: number;
    driver: string;
    team: string;
    confidence: number;
}

export interface Race {
    id: string;
    round: number;
    circuitName: string;
    country: string;
    countryCode: string;
    startDate: string;
    endDate: string;
    sessions: RaceSession;
    results: RaceResult;
    predictions: { grid: GridPrediction[] };
    isSprint: boolean;
}

export const calendar2025: Race[] = [
    {
        id: 'australia-2025', round: 1, circuitName: 'Albert Park Circuit', country: 'Australia', countryCode: 'AU',
        startDate: '2025-03-14', endDate: '2025-03-16',
        sessions: { fp1: '2025-03-14T01:30:00Z', fp2: '2025-03-14T05:00:00Z', fp3: '2025-03-15T01:30:00Z', sprintShootout: null, sprint: null, qualifying: '2025-03-15T05:00:00Z', race: '2025-03-16T04:00:00Z' },
        results: { winner: { driver: 'Lando Norris', team: 'McLaren', time: '1:24:22.504' }, pole: { driver: 'Lando Norris', team: 'McLaren', lapTime: '1:15.096' }, fastestLap: { driver: 'Charles Leclerc', team: 'Ferrari', lapTime: '1:19.813' } },
        predictions: { grid: [] }, isSprint: false,
    },
    {
        id: 'china-2025', round: 2, circuitName: 'Shanghai International Circuit', country: 'China', countryCode: 'CN',
        startDate: '2025-03-21', endDate: '2025-03-23',
        sessions: { fp1: '2025-03-21T03:30:00Z', fp2: null, fp3: null, sprintShootout: '2025-03-21T07:30:00Z', sprint: '2025-03-22T03:00:00Z', qualifying: '2025-03-22T07:00:00Z', race: '2025-03-23T06:00:00Z' },
        results: { winner: { driver: 'Oscar Piastri', team: 'McLaren', time: '1:33:18.864' }, pole: { driver: 'George Russell', team: 'Mercedes', lapTime: '1:33.660' }, fastestLap: { driver: 'Lando Norris', team: 'McLaren', lapTime: '1:37.285' } },
        predictions: { grid: [] }, isSprint: true,
    },
    {
        id: 'japan-2025', round: 3, circuitName: 'Suzuka International Racing Course', country: 'Japan', countryCode: 'JP',
        startDate: '2025-04-04', endDate: '2025-04-06',
        sessions: { fp1: '2025-04-04T02:30:00Z', fp2: '2025-04-04T06:00:00Z', fp3: '2025-04-05T02:30:00Z', sprintShootout: null, sprint: null, qualifying: '2025-04-05T06:00:00Z', race: '2025-04-06T05:00:00Z' },
        results: { winner: { driver: 'Max Verstappen', team: 'Red Bull Racing', time: '1:27:36.007' }, pole: { driver: 'Lando Norris', team: 'McLaren', lapTime: '1:28.641' }, fastestLap: { driver: 'Lewis Hamilton', team: 'Ferrari', lapTime: '1:30.983' } },
        predictions: { grid: [] }, isSprint: false,
    },
    {
        id: 'bahrain-2025', round: 4, circuitName: 'Bahrain International Circuit', country: 'Bahrain', countryCode: 'BH',
        startDate: '2025-04-11', endDate: '2025-04-13',
        sessions: { fp1: '2025-04-11T11:30:00Z', fp2: '2025-04-11T15:00:00Z', fp3: '2025-04-12T12:00:00Z', sprintShootout: null, sprint: null, qualifying: '2025-04-12T15:00:00Z', race: '2025-04-13T15:00:00Z' },
        results: { winner: { driver: 'George Russell', team: 'Mercedes', time: '1:33:17.560' }, pole: { driver: 'George Russell', team: 'Mercedes', lapTime: '1:28.828' }, fastestLap: { driver: 'Charles Leclerc', team: 'Ferrari', lapTime: '1:31.447' } },
        predictions: { grid: [] }, isSprint: false,
    },
    {
        id: 'jeddah-2025', round: 5, circuitName: 'Jeddah Corniche Circuit', country: 'Saudi Arabia', countryCode: 'SA',
        startDate: '2025-04-18', endDate: '2025-04-20',
        sessions: { fp1: '2025-04-18T13:30:00Z', fp2: '2025-04-18T17:00:00Z', fp3: '2025-04-19T13:30:00Z', sprintShootout: null, sprint: null, qualifying: '2025-04-19T17:00:00Z', race: '2025-04-20T17:00:00Z' },
        results: { winner: { driver: 'Oscar Piastri', team: 'McLaren', time: '1:20:52.312' }, pole: { driver: 'Oscar Piastri', team: 'McLaren', lapTime: '1:26.797' }, fastestLap: { driver: 'Lewis Hamilton', team: 'Ferrari', lapTime: '1:30.734' } },
        predictions: { grid: [] }, isSprint: false,
    },
    {
        id: 'miami-2025', round: 6, circuitName: 'Miami International Autodrome', country: 'USA', countryCode: 'US',
        startDate: '2025-05-02', endDate: '2025-05-04',
        sessions: { fp1: '2025-05-02T16:30:00Z', fp2: null, fp3: null, sprintShootout: '2025-05-02T20:30:00Z', sprint: '2025-05-03T16:00:00Z', qualifying: '2025-05-03T20:00:00Z', race: '2025-05-04T20:00:00Z' },
        results: { winner: null, pole: null, fastestLap: null },
        predictions: { grid: generatePredictions() }, isSprint: true,
    },
    {
        id: 'imola-2025', round: 7, circuitName: 'Autodromo Enzo e Dino Ferrari', country: 'Italy', countryCode: 'IT',
        startDate: '2025-05-16', endDate: '2025-05-18',
        sessions: { fp1: '2025-05-16T11:30:00Z', fp2: '2025-05-16T15:00:00Z', fp3: '2025-05-17T10:30:00Z', sprintShootout: null, sprint: null, qualifying: '2025-05-17T14:00:00Z', race: '2025-05-18T13:00:00Z' },
        results: { winner: null, pole: null, fastestLap: null },
        predictions: { grid: generatePredictions() }, isSprint: false,
    },
    {
        id: 'monaco-2025', round: 8, circuitName: 'Circuit de Monaco', country: 'Monaco', countryCode: 'MC',
        startDate: '2025-05-23', endDate: '2025-05-25',
        sessions: { fp1: '2025-05-23T11:30:00Z', fp2: '2025-05-23T15:00:00Z', fp3: '2025-05-24T10:30:00Z', sprintShootout: null, sprint: null, qualifying: '2025-05-24T14:00:00Z', race: '2025-05-25T13:00:00Z' },
        results: { winner: null, pole: null, fastestLap: null },
        predictions: { grid: generatePredictions() }, isSprint: false,
    },
    {
        id: 'spain-2025', round: 9, circuitName: 'Circuit de Barcelona-Catalunya', country: 'Spain', countryCode: 'ES',
        startDate: '2025-06-01', endDate: '2025-06-03',
        sessions: { fp1: '2025-06-01T11:30:00Z', fp2: '2025-06-01T15:00:00Z', fp3: '2025-06-02T10:30:00Z', sprintShootout: null, sprint: null, qualifying: '2025-06-02T14:00:00Z', race: '2025-06-03T13:00:00Z' },
        results: { winner: null, pole: null, fastestLap: null },
        predictions: { grid: generatePredictions() }, isSprint: false,
    },
    {
        id: 'canada-2025', round: 10, circuitName: 'Circuit Gilles Villeneuve', country: 'Canada', countryCode: 'CA',
        startDate: '2025-06-13', endDate: '2025-06-15',
        sessions: { fp1: '2025-06-13T17:30:00Z', fp2: '2025-06-13T21:00:00Z', fp3: '2025-06-14T16:30:00Z', sprintShootout: null, sprint: null, qualifying: '2025-06-14T20:00:00Z', race: '2025-06-15T18:00:00Z' },
        results: { winner: null, pole: null, fastestLap: null },
        predictions: { grid: generatePredictions() }, isSprint: false,
    },
    {
        id: 'austria-2025', round: 11, circuitName: 'Red Bull Ring', country: 'Austria', countryCode: 'AT',
        startDate: '2025-06-27', endDate: '2025-06-29',
        sessions: { fp1: '2025-06-27T10:30:00Z', fp2: null, fp3: null, sprintShootout: '2025-06-27T14:30:00Z', sprint: '2025-06-28T10:00:00Z', qualifying: '2025-06-28T14:00:00Z', race: '2025-06-29T13:00:00Z' },
        results: { winner: null, pole: null, fastestLap: null },
        predictions: { grid: generatePredictions() }, isSprint: true,
    },
    {
        id: 'britain-2025', round: 12, circuitName: 'Silverstone Circuit', country: 'Great Britain', countryCode: 'GB',
        startDate: '2025-07-04', endDate: '2025-07-06',
        sessions: { fp1: '2025-07-04T11:30:00Z', fp2: '2025-07-04T15:00:00Z', fp3: '2025-07-05T10:30:00Z', sprintShootout: null, sprint: null, qualifying: '2025-07-05T14:00:00Z', race: '2025-07-06T14:00:00Z' },
        results: { winner: null, pole: null, fastestLap: null },
        predictions: { grid: generatePredictions() }, isSprint: false,
    },
    {
        id: 'belgium-2025', round: 13, circuitName: 'Circuit de Spa-Francorchamps', country: 'Belgium', countryCode: 'BE',
        startDate: '2025-07-25', endDate: '2025-07-27',
        sessions: { fp1: '2025-07-25T11:30:00Z', fp2: '2025-07-25T15:00:00Z', fp3: '2025-07-26T10:30:00Z', sprintShootout: null, sprint: null, qualifying: '2025-07-26T14:00:00Z', race: '2025-07-27T13:00:00Z' },
        results: { winner: null, pole: null, fastestLap: null },
        predictions: { grid: generatePredictions() }, isSprint: false,
    },
    {
        id: 'hungary-2025', round: 14, circuitName: 'Hungaroring', country: 'Hungary', countryCode: 'HU',
        startDate: '2025-08-01', endDate: '2025-08-03',
        sessions: { fp1: '2025-08-01T11:30:00Z', fp2: '2025-08-01T15:00:00Z', fp3: '2025-08-02T10:30:00Z', sprintShootout: null, sprint: null, qualifying: '2025-08-02T14:00:00Z', race: '2025-08-03T13:00:00Z' },
        results: { winner: null, pole: null, fastestLap: null },
        predictions: { grid: generatePredictions() }, isSprint: false,
    },
    {
        id: 'netherlands-2025', round: 15, circuitName: 'Circuit Zandvoort', country: 'Netherlands', countryCode: 'NL',
        startDate: '2025-08-29', endDate: '2025-08-31',
        sessions: { fp1: '2025-08-29T10:30:00Z', fp2: '2025-08-29T14:00:00Z', fp3: '2025-08-30T09:30:00Z', sprintShootout: null, sprint: null, qualifying: '2025-08-30T13:00:00Z', race: '2025-08-31T13:00:00Z' },
        results: { winner: null, pole: null, fastestLap: null },
        predictions: { grid: generatePredictions() }, isSprint: false,
    },
    {
        id: 'monza-2025', round: 16, circuitName: 'Autodromo Nazionale Monza', country: 'Italy', countryCode: 'IT',
        startDate: '2025-09-05', endDate: '2025-09-07',
        sessions: { fp1: '2025-09-05T11:30:00Z', fp2: '2025-09-05T15:00:00Z', fp3: '2025-09-06T10:30:00Z', sprintShootout: null, sprint: null, qualifying: '2025-09-06T14:00:00Z', race: '2025-09-07T13:00:00Z' },
        results: { winner: null, pole: null, fastestLap: null },
        predictions: { grid: generatePredictions() }, isSprint: false,
    },
    {
        id: 'azerbaijan-2025', round: 17, circuitName: 'Baku City Circuit', country: 'Azerbaijan', countryCode: 'AZ',
        startDate: '2025-09-19', endDate: '2025-09-21',
        sessions: { fp1: '2025-09-19T08:30:00Z', fp2: '2025-09-19T12:00:00Z', fp3: '2025-09-20T08:30:00Z', sprintShootout: null, sprint: null, qualifying: '2025-09-20T12:00:00Z', race: '2025-09-21T11:00:00Z' },
        results: { winner: null, pole: null, fastestLap: null },
        predictions: { grid: generatePredictions() }, isSprint: false,
    },
    {
        id: 'singapore-2025', round: 18, circuitName: 'Marina Bay Street Circuit', country: 'Singapore', countryCode: 'SG',
        startDate: '2025-10-03', endDate: '2025-10-05',
        sessions: { fp1: '2025-10-03T09:30:00Z', fp2: '2025-10-03T13:00:00Z', fp3: '2025-10-04T09:30:00Z', sprintShootout: null, sprint: null, qualifying: '2025-10-04T13:00:00Z', race: '2025-10-05T12:00:00Z' },
        results: { winner: null, pole: null, fastestLap: null },
        predictions: { grid: generatePredictions() }, isSprint: false,
    },
    {
        id: 'usa-2025', round: 19, circuitName: 'Circuit of the Americas', country: 'USA', countryCode: 'US',
        startDate: '2025-10-17', endDate: '2025-10-19',
        sessions: { fp1: '2025-10-17T17:30:00Z', fp2: null, fp3: null, sprintShootout: '2025-10-17T21:30:00Z', sprint: '2025-10-18T18:00:00Z', qualifying: '2025-10-18T22:00:00Z', race: '2025-10-19T19:00:00Z' },
        results: { winner: null, pole: null, fastestLap: null },
        predictions: { grid: generatePredictions() }, isSprint: true,
    },
    {
        id: 'mexico-2025', round: 20, circuitName: 'Autódromo Hermanos Rodríguez', country: 'Mexico', countryCode: 'MX',
        startDate: '2025-10-24', endDate: '2025-10-26',
        sessions: { fp1: '2025-10-24T18:30:00Z', fp2: '2025-10-24T22:00:00Z', fp3: '2025-10-25T17:30:00Z', sprintShootout: null, sprint: null, qualifying: '2025-10-25T21:00:00Z', race: '2025-10-26T20:00:00Z' },
        results: { winner: null, pole: null, fastestLap: null },
        predictions: { grid: generatePredictions() }, isSprint: false,
    },
    {
        id: 'brazil-2025', round: 21, circuitName: 'Autódromo José Carlos Pace', country: 'Brazil', countryCode: 'BR',
        startDate: '2025-11-07', endDate: '2025-11-09',
        sessions: { fp1: '2025-11-07T14:30:00Z', fp2: null, fp3: null, sprintShootout: '2025-11-07T18:30:00Z', sprint: '2025-11-08T14:00:00Z', qualifying: '2025-11-08T18:00:00Z', race: '2025-11-09T17:00:00Z' },
        results: { winner: null, pole: null, fastestLap: null },
        predictions: { grid: generatePredictions() }, isSprint: true,
    },
    {
        id: 'las-vegas-2025', round: 22, circuitName: 'Las Vegas Strip Circuit', country: 'USA', countryCode: 'US',
        startDate: '2025-11-20', endDate: '2025-11-22',
        sessions: { fp1: '2025-11-21T02:30:00Z', fp2: '2025-11-21T06:00:00Z', fp3: '2025-11-22T02:30:00Z', sprintShootout: null, sprint: null, qualifying: '2025-11-22T06:00:00Z', race: '2025-11-23T06:00:00Z' },
        results: { winner: null, pole: null, fastestLap: null },
        predictions: { grid: generatePredictions() }, isSprint: false,
    },
    {
        id: 'qatar-2025', round: 23, circuitName: 'Lusail International Circuit', country: 'Qatar', countryCode: 'QA',
        startDate: '2025-11-28', endDate: '2025-11-30',
        sessions: { fp1: '2025-11-28T12:30:00Z', fp2: null, fp3: null, sprintShootout: '2025-11-28T16:30:00Z', sprint: '2025-11-29T13:00:00Z', qualifying: '2025-11-29T17:00:00Z', race: '2025-11-30T16:00:00Z' },
        results: { winner: null, pole: null, fastestLap: null },
        predictions: { grid: generatePredictions() }, isSprint: true,
    },
    {
        id: 'abu-dhabi-2025', round: 24, circuitName: 'Yas Marina Circuit', country: 'Abu Dhabi', countryCode: 'AE',
        startDate: '2025-12-05', endDate: '2025-12-07',
        sessions: { fp1: '2025-12-05T09:30:00Z', fp2: '2025-12-05T13:00:00Z', fp3: '2025-12-06T10:30:00Z', sprintShootout: null, sprint: null, qualifying: '2025-12-06T14:00:00Z', race: '2025-12-07T13:00:00Z' },
        results: { winner: null, pole: null, fastestLap: null },
        predictions: { grid: generatePredictions() }, isSprint: false,
    },
];

function generatePredictions(): GridPrediction[] {
    const drivers = [
        { driver: 'Max Verstappen', team: 'Red Bull Racing' },
        { driver: 'Lando Norris', team: 'McLaren' },
        { driver: 'Charles Leclerc', team: 'Ferrari' },
        { driver: 'Oscar Piastri', team: 'McLaren' },
        { driver: 'Carlos Sainz', team: 'Williams' },
        { driver: 'George Russell', team: 'Mercedes' },
        { driver: 'Lewis Hamilton', team: 'Ferrari' },
        { driver: 'Andrea Kimi Antonelli', team: 'Mercedes' },
        { driver: 'Fernando Alonso', team: 'Aston Martin' },
        { driver: 'Lance Stroll', team: 'Aston Martin' },
        { driver: 'Pierre Gasly', team: 'Alpine' },
        { driver: 'Jack Doohan', team: 'Alpine' },
        { driver: 'Yuki Tsunoda', team: 'Racing Bulls' },
        { driver: 'Isack Hadjar', team: 'Racing Bulls' },
        { driver: 'Alexander Albon', team: 'Williams' },
        { driver: 'Nico Hülkenberg', team: 'Audi Revolut F1 Team' },
        { driver: 'Gabriel Bortoleto', team: 'Audi Revolut F1 Team' },
        { driver: 'Esteban Ocon', team: 'Haas F1 Team' },
        { driver: 'Oliver Bearman', team: 'Haas F1 Team' },
        { driver: 'Liam Lawson', team: 'Red Bull Racing' },
        { driver: 'Valtteri Bottas', team: 'Cadillac Formula 1 Team' },
        { driver: 'Sergio Pérez', team: 'Cadillac Formula 1 Team' }
    ];
    return drivers.map((d, i) => ({
        position: i + 1,
        driver: d.driver,
        team: d.team,
        confidence: Math.max(20, 95 - i * 4 + Math.floor(Math.random() * 10)),
    }));
}

// ─── 2026 F1 Calendar ───
export const calendar2026: Race[] = [
    {
        id: 'australia-2026', round: 1, circuitName: 'Albert Park Circuit', country: 'Australia', countryCode: 'AU',
        startDate: '2026-03-06', endDate: '2026-03-08',
        sessions: { fp1: '2026-03-06T01:30:00Z', fp2: '2026-03-06T05:00:00Z', fp3: '2026-03-07T01:30:00Z', sprintShootout: null, sprint: null, qualifying: '2026-03-07T05:00:00Z', race: '2026-03-08T04:00:00Z' },
        results: { winner: null, pole: null, fastestLap: null },
        predictions: { grid: generatePredictions() }, isSprint: false,
    },
    {
        id: 'china-2026', round: 2, circuitName: 'Shanghai International Circuit', country: 'China', countryCode: 'CN',
        startDate: '2026-03-13', endDate: '2026-03-15',
        sessions: { fp1: '2026-03-13T03:30:00Z', fp2: null, fp3: null, sprintShootout: '2026-03-13T07:30:00Z', sprint: '2026-03-14T03:00:00Z', qualifying: '2026-03-14T07:00:00Z', race: '2026-03-15T06:00:00Z' },
        results: { winner: null, pole: null, fastestLap: null },
        predictions: { grid: generatePredictions() }, isSprint: true,
    },
    {
        id: 'japan-2026', round: 3, circuitName: 'Suzuka International Racing Course', country: 'Japan', countryCode: 'JP',
        startDate: '2026-03-27', endDate: '2026-03-29',
        sessions: { fp1: '2026-03-27T02:30:00Z', fp2: '2026-03-27T06:00:00Z', fp3: '2026-03-28T02:30:00Z', sprintShootout: null, sprint: null, qualifying: '2026-03-28T06:00:00Z', race: '2026-03-29T05:00:00Z' },
        results: { winner: null, pole: null, fastestLap: null },
        predictions: { grid: generatePredictions() }, isSprint: false,
    },
    {
        id: 'bahrain-2026', round: 4, circuitName: 'Bahrain International Circuit', country: 'Bahrain', countryCode: 'BH',
        startDate: '2026-04-10', endDate: '2026-04-12',
        sessions: { fp1: '2026-04-10T11:30:00Z', fp2: '2026-04-10T15:00:00Z', fp3: '2026-04-11T12:00:00Z', sprintShootout: null, sprint: null, qualifying: '2026-04-11T15:00:00Z', race: '2026-04-12T15:00:00Z' },
        results: { winner: null, pole: null, fastestLap: null },
        predictions: { grid: generatePredictions() }, isSprint: false,
    },
    {
        id: 'jeddah-2026', round: 5, circuitName: 'Jeddah Corniche Circuit', country: 'Saudi Arabia', countryCode: 'SA',
        startDate: '2026-04-17', endDate: '2026-04-19',
        sessions: { fp1: '2026-04-17T13:30:00Z', fp2: '2026-04-17T17:00:00Z', fp3: '2026-04-18T13:30:00Z', sprintShootout: null, sprint: null, qualifying: '2026-04-18T17:00:00Z', race: '2026-04-19T17:00:00Z' },
        results: { winner: null, pole: null, fastestLap: null },
        predictions: { grid: generatePredictions() }, isSprint: false,
    },
    {
        id: 'miami-2026', round: 6, circuitName: 'Miami International Autodrome', country: 'USA', countryCode: 'US',
        startDate: '2026-05-01', endDate: '2026-05-03',
        sessions: { fp1: '2026-05-01T16:30:00Z', fp2: null, fp3: null, sprintShootout: '2026-05-01T20:30:00Z', sprint: '2026-05-02T16:00:00Z', qualifying: '2026-05-02T20:00:00Z', race: '2026-05-03T20:00:00Z' },
        results: { winner: null, pole: null, fastestLap: null },
        predictions: { grid: generatePredictions() }, isSprint: true,
    },
    {
        id: 'canada-2026', round: 7, circuitName: 'Circuit Gilles Villeneuve', country: 'Canada', countryCode: 'CA',
        startDate: '2026-05-22', endDate: '2026-05-24',
        sessions: { fp1: '2026-05-22T17:30:00Z', fp2: null, fp3: null, sprintShootout: '2026-05-22T21:30:00Z', sprint: '2026-05-23T16:30:00Z', qualifying: '2026-05-23T20:00:00Z', race: '2026-05-24T18:00:00Z' },
        results: { winner: null, pole: null, fastestLap: null },
        predictions: { grid: generatePredictions() }, isSprint: true,
    },
    {
        id: 'monaco-2026', round: 8, circuitName: 'Circuit de Monaco', country: 'Monaco', countryCode: 'MC',
        startDate: '2026-06-05', endDate: '2026-06-07',
        sessions: { fp1: '2026-06-05T11:30:00Z', fp2: '2026-06-05T15:00:00Z', fp3: '2026-06-06T10:30:00Z', sprintShootout: null, sprint: null, qualifying: '2026-06-06T14:00:00Z', race: '2026-06-07T13:00:00Z' },
        results: { winner: null, pole: null, fastestLap: null },
        predictions: { grid: generatePredictions() }, isSprint: false,
    },
    {
        id: 'spain-2026', round: 9, circuitName: 'Circuit de Barcelona-Catalunya', country: 'Spain', countryCode: 'ES',
        startDate: '2026-06-12', endDate: '2026-06-14',
        sessions: { fp1: '2026-06-12T11:30:00Z', fp2: '2026-06-12T15:00:00Z', fp3: '2026-06-13T10:30:00Z', sprintShootout: null, sprint: null, qualifying: '2026-06-13T14:00:00Z', race: '2026-06-14T13:00:00Z' },
        results: { winner: null, pole: null, fastestLap: null },
        predictions: { grid: generatePredictions() }, isSprint: false,
    },
    {
        id: 'austria-2026', round: 10, circuitName: 'Red Bull Ring', country: 'Austria', countryCode: 'AT',
        startDate: '2026-06-26', endDate: '2026-06-28',
        sessions: { fp1: '2026-06-26T10:30:00Z', fp2: '2026-06-26T14:00:00Z', fp3: '2026-06-27T10:30:00Z', sprintShootout: null, sprint: null, qualifying: '2026-06-27T14:00:00Z', race: '2026-06-28T13:00:00Z' },
        results: { winner: null, pole: null, fastestLap: null },
        predictions: { grid: generatePredictions() }, isSprint: false,
    },
    {
        id: 'britain-2026', round: 11, circuitName: 'Silverstone Circuit', country: 'Great Britain', countryCode: 'GB',
        startDate: '2026-07-03', endDate: '2026-07-05',
        sessions: { fp1: '2026-07-03T11:30:00Z', fp2: null, fp3: null, sprintShootout: '2026-07-03T15:30:00Z', sprint: '2026-07-04T10:00:00Z', qualifying: '2026-07-04T14:00:00Z', race: '2026-07-05T14:00:00Z' },
        results: { winner: null, pole: null, fastestLap: null },
        predictions: { grid: generatePredictions() }, isSprint: true,
    },
    {
        id: 'belgium-2026', round: 12, circuitName: 'Circuit de Spa-Francorchamps', country: 'Belgium', countryCode: 'BE',
        startDate: '2026-07-17', endDate: '2026-07-19',
        sessions: { fp1: '2026-07-17T11:30:00Z', fp2: '2026-07-17T15:00:00Z', fp3: '2026-07-18T10:30:00Z', sprintShootout: null, sprint: null, qualifying: '2026-07-18T14:00:00Z', race: '2026-07-19T13:00:00Z' },
        results: { winner: null, pole: null, fastestLap: null },
        predictions: { grid: generatePredictions() }, isSprint: false,
    },
    {
        id: 'hungary-2026', round: 13, circuitName: 'Hungaroring', country: 'Hungary', countryCode: 'HU',
        startDate: '2026-07-24', endDate: '2026-07-26',
        sessions: { fp1: '2026-07-24T11:30:00Z', fp2: '2026-07-24T15:00:00Z', fp3: '2026-07-25T10:30:00Z', sprintShootout: null, sprint: null, qualifying: '2026-07-25T14:00:00Z', race: '2026-07-26T13:00:00Z' },
        results: { winner: null, pole: null, fastestLap: null },
        predictions: { grid: generatePredictions() }, isSprint: false,
    },
    {
        id: 'netherlands-2026', round: 14, circuitName: 'Circuit Zandvoort', country: 'Netherlands', countryCode: 'NL',
        startDate: '2026-08-21', endDate: '2026-08-23',
        sessions: { fp1: '2026-08-21T10:30:00Z', fp2: null, fp3: null, sprintShootout: '2026-08-21T14:30:00Z', sprint: '2026-08-22T10:00:00Z', qualifying: '2026-08-22T14:00:00Z', race: '2026-08-23T13:00:00Z' },
        results: { winner: null, pole: null, fastestLap: null },
        predictions: { grid: generatePredictions() }, isSprint: true,
    },
    {
        id: 'monza-2026', round: 15, circuitName: 'Autodromo Nazionale Monza', country: 'Italy', countryCode: 'IT',
        startDate: '2026-09-04', endDate: '2026-09-06',
        sessions: { fp1: '2026-09-04T11:30:00Z', fp2: '2026-09-04T15:00:00Z', fp3: '2026-09-05T10:30:00Z', sprintShootout: null, sprint: null, qualifying: '2026-09-05T14:00:00Z', race: '2026-09-06T13:00:00Z' },
        results: { winner: null, pole: null, fastestLap: null },
        predictions: { grid: generatePredictions() }, isSprint: false,
    },
    {
        id: 'madrid-2026', round: 16, circuitName: 'IFEMA Madrid Circuit', country: 'Spain', countryCode: 'ES',
        startDate: '2026-09-11', endDate: '2026-09-13',
        sessions: { fp1: '2026-09-11T11:30:00Z', fp2: '2026-09-11T15:00:00Z', fp3: '2026-09-12T10:30:00Z', sprintShootout: null, sprint: null, qualifying: '2026-09-12T14:00:00Z', race: '2026-09-13T13:00:00Z' },
        results: { winner: null, pole: null, fastestLap: null },
        predictions: { grid: generatePredictions() }, isSprint: false,
    },
    {
        id: 'azerbaijan-2026', round: 17, circuitName: 'Baku City Circuit', country: 'Azerbaijan', countryCode: 'AZ',
        startDate: '2026-09-24', endDate: '2026-09-26',
        sessions: { fp1: '2026-09-24T08:30:00Z', fp2: '2026-09-24T12:00:00Z', fp3: '2026-09-25T08:30:00Z', sprintShootout: null, sprint: null, qualifying: '2026-09-25T12:00:00Z', race: '2026-09-26T11:00:00Z' },
        results: { winner: null, pole: null, fastestLap: null },
        predictions: { grid: generatePredictions() }, isSprint: false,
    },
    {
        id: 'singapore-2026', round: 18, circuitName: 'Marina Bay Street Circuit', country: 'Singapore', countryCode: 'SG',
        startDate: '2026-10-09', endDate: '2026-10-11',
        sessions: { fp1: '2026-10-09T09:30:00Z', fp2: null, fp3: null, sprintShootout: '2026-10-09T13:30:00Z', sprint: '2026-10-10T09:30:00Z', qualifying: '2026-10-10T13:00:00Z', race: '2026-10-11T12:00:00Z' },
        results: { winner: null, pole: null, fastestLap: null },
        predictions: { grid: generatePredictions() }, isSprint: true,
    },
    {
        id: 'usa-2026', round: 19, circuitName: 'Circuit of the Americas', country: 'USA', countryCode: 'US',
        startDate: '2026-10-23', endDate: '2026-10-25',
        sessions: { fp1: '2026-10-23T17:30:00Z', fp2: '2026-10-23T21:00:00Z', fp3: '2026-10-24T17:30:00Z', sprintShootout: null, sprint: null, qualifying: '2026-10-24T21:00:00Z', race: '2026-10-25T19:00:00Z' },
        results: { winner: null, pole: null, fastestLap: null },
        predictions: { grid: generatePredictions() }, isSprint: false,
    },
    {
        id: 'mexico-2026', round: 20, circuitName: 'Autódromo Hermanos Rodríguez', country: 'Mexico', countryCode: 'MX',
        startDate: '2026-10-30', endDate: '2026-11-01',
        sessions: { fp1: '2026-10-30T18:30:00Z', fp2: '2026-10-30T22:00:00Z', fp3: '2026-10-31T17:30:00Z', sprintShootout: null, sprint: null, qualifying: '2026-10-31T21:00:00Z', race: '2026-11-01T20:00:00Z' },
        results: { winner: null, pole: null, fastestLap: null },
        predictions: { grid: generatePredictions() }, isSprint: false,
    },
    {
        id: 'brazil-2026', round: 21, circuitName: 'Autódromo José Carlos Pace', country: 'Brazil', countryCode: 'BR',
        startDate: '2026-11-06', endDate: '2026-11-08',
        sessions: { fp1: '2026-11-06T14:30:00Z', fp2: '2026-11-06T18:00:00Z', fp3: '2026-11-07T14:30:00Z', sprintShootout: null, sprint: null, qualifying: '2026-11-07T18:00:00Z', race: '2026-11-08T17:00:00Z' },
        results: { winner: null, pole: null, fastestLap: null },
        predictions: { grid: generatePredictions() }, isSprint: false,
    },
    {
        id: 'las-vegas-2026', round: 22, circuitName: 'Las Vegas Strip Circuit', country: 'USA', countryCode: 'US',
        startDate: '2026-11-19', endDate: '2026-11-21',
        sessions: { fp1: '2026-11-20T02:30:00Z', fp2: '2026-11-20T06:00:00Z', fp3: '2026-11-21T02:30:00Z', sprintShootout: null, sprint: null, qualifying: '2026-11-21T06:00:00Z', race: '2026-11-22T06:00:00Z' },
        results: { winner: null, pole: null, fastestLap: null },
        predictions: { grid: generatePredictions() }, isSprint: false,
    },
    {
        id: 'qatar-2026', round: 23, circuitName: 'Lusail International Circuit', country: 'Qatar', countryCode: 'QA',
        startDate: '2026-11-27', endDate: '2026-11-29',
        sessions: { fp1: '2026-11-27T12:30:00Z', fp2: '2026-11-27T16:00:00Z', fp3: '2026-11-28T12:30:00Z', sprintShootout: null, sprint: null, qualifying: '2026-11-28T16:00:00Z', race: '2026-11-29T16:00:00Z' },
        results: { winner: null, pole: null, fastestLap: null },
        predictions: { grid: generatePredictions() }, isSprint: false,
    },
    {
        id: 'abu-dhabi-2026', round: 24, circuitName: 'Yas Marina Circuit', country: 'Abu Dhabi', countryCode: 'AE',
        startDate: '2026-12-04', endDate: '2026-12-06',
        sessions: { fp1: '2026-12-04T09:30:00Z', fp2: '2026-12-04T13:00:00Z', fp3: '2026-12-05T10:30:00Z', sprintShootout: null, sprint: null, qualifying: '2026-12-05T14:00:00Z', race: '2026-12-06T13:00:00Z' },
        results: { winner: null, pole: null, fastestLap: null },
        predictions: { grid: generatePredictions() }, isSprint: false,
    },
];

export function getCalendarByYear(year: number): Race[] {
    return year === 2026 ? calendar2026 : calendar2025;
}

export function getRaceById(id: string): Race | undefined {
    return calendar2025.find(r => r.id === id) || calendar2026.find(r => r.id === id);
}

export function getRaceStatus(race: Race): 'completed' | 'upcoming' | 'live' {
    const now = new Date();
    const raceEnd = new Date(race.sessions.race);
    const raceStart = new Date(race.startDate);
    if (now > new Date(raceEnd.getTime() + 3 * 3600000)) return 'completed';
    if (now >= raceStart && now <= new Date(raceEnd.getTime() + 3 * 3600000)) return 'live';
    return 'upcoming';
}

