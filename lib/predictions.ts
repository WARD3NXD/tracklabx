import { drivers, Driver } from './data/drivers';
import { teams, Team } from './data/teams';

// ─── Team Power Rankings (car performance rating 0-100) ───
// Reflects 2025 constructor pace relative to each other

interface TeamPower {
    teamId: string;
    /** Base car performance 0-100 */
    pace: number;
    /** Tracks where this team has an advantage (track IDs) */
    strongTracks: string[];
    /** Tracks where this team struggles */
    weakTracks: string[];
}

const teamPower: TeamPower[] = [
    {
        teamId: 'mclaren',
        pace: 95,
        strongTracks: ['silverstone', 'monza', 'spa', 'baku', 'melbourne', 'lusail'],
        weakTracks: ['monaco', 'singapore'],
    },
    {
        teamId: 'ferrari',
        pace: 94,
        strongTracks: ['bahrain', 'jeddah', 'monaco', 'barcelona', 'monza', 'singapore', 'austin'],
        weakTracks: ['zandvoort', 'las-vegas'],
    },
    {
        teamId: 'red-bull',
        pace: 91,
        strongTracks: ['suzuka', 'spa', 'spielberg', 'austin', 'interlagos', 'yas-marina', 'shanghai'],
        weakTracks: ['monaco', 'melbourne'],
    },
    {
        teamId: 'mercedes',
        pace: 87,
        strongTracks: ['silverstone', 'spa', 'montreal', 'las-vegas', 'budapest'],
        weakTracks: ['bahrain', 'jeddah', 'lusail'],
    },
    {
        teamId: 'aston-martin',
        pace: 78,
        strongTracks: ['bahrain', 'jeddah', 'monaco'],
        weakTracks: ['monza', 'spa', 'silverstone'],
    },
    {
        teamId: 'williams',
        pace: 74,
        strongTracks: ['monza', 'spa', 'baku'],
        weakTracks: ['monaco', 'budapest', 'singapore'],
    },
    {
        teamId: 'racing-bulls',
        pace: 73,
        strongTracks: ['imola', 'spielberg', 'suzuka'],
        weakTracks: ['silverstone', 'spa'],
    },
    {
        teamId: 'haas',
        pace: 72,
        strongTracks: ['bahrain', 'spielberg', 'austin'],
        weakTracks: ['monza', 'spa', 'silverstone'],
    },
    {
        teamId: 'alpine',
        pace: 71,
        strongTracks: ['montreal', 'baku', 'las-vegas'],
        weakTracks: ['bahrain', 'jeddah'],
    },
    {
        teamId: 'sauber',
        pace: 65,
        strongTracks: ['baku', 'las-vegas'],
        weakTracks: ['bahrain', 'silverstone', 'suzuka', 'monza'],
    },
];

function getTeamPower(teamId: string): TeamPower | undefined {
    return teamPower.find(t => t.teamId === teamId);
}

// ─── Track Characteristics ───

interface TrackCharacteristic {
    trackId: string;
    /** How much top speed matters (0-1) */
    topSpeedWeight: number;
    /** How much downforce matters (0-1) */
    downforceWeight: number;
    /** How much mechanical grip matters (0-1) */
    mechanicalGripWeight: number;
    /** Overtaking difficulty (0-1, 1 = very hard) */
    overtakingDifficulty: number;
}

const trackCharacteristics: TrackCharacteristic[] = [
    { trackId: 'bahrain', topSpeedWeight: 0.6, downforceWeight: 0.5, mechanicalGripWeight: 0.5, overtakingDifficulty: 0.3 },
    { trackId: 'jeddah', topSpeedWeight: 0.8, downforceWeight: 0.4, mechanicalGripWeight: 0.4, overtakingDifficulty: 0.4 },
    { trackId: 'melbourne', topSpeedWeight: 0.5, downforceWeight: 0.6, mechanicalGripWeight: 0.6, overtakingDifficulty: 0.6 },
    { trackId: 'suzuka', topSpeedWeight: 0.5, downforceWeight: 0.8, mechanicalGripWeight: 0.7, overtakingDifficulty: 0.7 },
    { trackId: 'shanghai', topSpeedWeight: 0.7, downforceWeight: 0.5, mechanicalGripWeight: 0.5, overtakingDifficulty: 0.4 },
    { trackId: 'miami', topSpeedWeight: 0.7, downforceWeight: 0.5, mechanicalGripWeight: 0.5, overtakingDifficulty: 0.5 },
    { trackId: 'imola', topSpeedWeight: 0.4, downforceWeight: 0.7, mechanicalGripWeight: 0.7, overtakingDifficulty: 0.7 },
    { trackId: 'monaco', topSpeedWeight: 0.1, downforceWeight: 0.9, mechanicalGripWeight: 0.9, overtakingDifficulty: 0.95 },
    { trackId: 'barcelona', topSpeedWeight: 0.5, downforceWeight: 0.7, mechanicalGripWeight: 0.6, overtakingDifficulty: 0.6 },
    { trackId: 'montreal', topSpeedWeight: 0.8, downforceWeight: 0.3, mechanicalGripWeight: 0.6, overtakingDifficulty: 0.3 },
    { trackId: 'spielberg', topSpeedWeight: 0.7, downforceWeight: 0.5, mechanicalGripWeight: 0.5, overtakingDifficulty: 0.4 },
    { trackId: 'silverstone', topSpeedWeight: 0.6, downforceWeight: 0.8, mechanicalGripWeight: 0.6, overtakingDifficulty: 0.5 },
    { trackId: 'spa', topSpeedWeight: 0.8, downforceWeight: 0.7, mechanicalGripWeight: 0.5, overtakingDifficulty: 0.3 },
    { trackId: 'budapest', topSpeedWeight: 0.3, downforceWeight: 0.8, mechanicalGripWeight: 0.8, overtakingDifficulty: 0.8 },
    { trackId: 'zandvoort', topSpeedWeight: 0.3, downforceWeight: 0.8, mechanicalGripWeight: 0.7, overtakingDifficulty: 0.8 },
    { trackId: 'monza', topSpeedWeight: 0.95, downforceWeight: 0.2, mechanicalGripWeight: 0.3, overtakingDifficulty: 0.3 },
    { trackId: 'baku', topSpeedWeight: 0.85, downforceWeight: 0.4, mechanicalGripWeight: 0.5, overtakingDifficulty: 0.3 },
    { trackId: 'singapore', topSpeedWeight: 0.3, downforceWeight: 0.8, mechanicalGripWeight: 0.8, overtakingDifficulty: 0.8 },
    { trackId: 'austin', topSpeedWeight: 0.6, downforceWeight: 0.6, mechanicalGripWeight: 0.6, overtakingDifficulty: 0.4 },
    { trackId: 'mexico-city', topSpeedWeight: 0.7, downforceWeight: 0.6, mechanicalGripWeight: 0.5, overtakingDifficulty: 0.5 },
    { trackId: 'interlagos', topSpeedWeight: 0.7, downforceWeight: 0.6, mechanicalGripWeight: 0.6, overtakingDifficulty: 0.3 },
    { trackId: 'las-vegas', topSpeedWeight: 0.85, downforceWeight: 0.3, mechanicalGripWeight: 0.4, overtakingDifficulty: 0.35 },
    { trackId: 'lusail', topSpeedWeight: 0.7, downforceWeight: 0.6, mechanicalGripWeight: 0.5, overtakingDifficulty: 0.5 },
    { trackId: 'yas-marina', topSpeedWeight: 0.6, downforceWeight: 0.6, mechanicalGripWeight: 0.6, overtakingDifficulty: 0.5 },
];

// ─── Prediction Engine ───

interface PredictionEntry {
    position: number;
    driver: Driver;
    team: Team;
    score: number;
    /** Confidence % for this position (100 = very confident) */
    confidence: number;
}

/**
 * Generates a predicted grid for a given track.
 * Combines: driver rating + form + team pace + track-specific boosts + randomness factor
 */
export function predictGrid(trackId: string): PredictionEntry[] {
    const trackChar = trackCharacteristics.find(t => t.trackId === trackId);

    const scored = drivers.map(driver => {
        const tp = getTeamPower(driver.teamId);
        const team = teams.find(t => t.id === driver.teamId)!;

        // Base driver score (40% weight)
        let score = driver.rating * 0.4;

        // Team pace (45% weight)
        const basePace = tp?.pace || 70;
        score += basePace * 0.45;

        // Driver form (5% weight, scaled)
        score += driver.form * 2;

        // Track-specific adjustment (±5 points)
        if (tp) {
            if (tp.strongTracks.includes(trackId)) {
                score += 4;
            }
            if (tp.weakTracks.includes(trackId)) {
                score -= 3;
            }
        }

        // Track characteristic bonus — reward high-downforce teams at high-downforce tracks, etc.
        if (trackChar) {
            // Top teams get extra on power tracks, midfield can upset on street circuits
            const teamPaceNorm = (basePace - 65) / 35; // 0-1 range
            score += trackChar.overtakingDifficulty * basePace * 0.02; // car matters more at no-overtake tracks
        }

        // Deterministic "randomness" based on driver+track combo (simulates variance)
        const hash = (driver.id + trackId).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
        const variance = ((hash % 100) / 100 - 0.5) * 4; // ±2 points
        score += variance;

        return { driver, team, score };
    });

    // Sort by score descending
    scored.sort((a, b) => b.score - a.score);

    const maxScore = scored[0].score;
    const minScore = scored[scored.length - 1].score;
    const range = maxScore - minScore || 1;

    return scored.map((entry, i) => {
        // Confidence decreases as positions get closer in score
        const nextScore = scored[i + 1]?.score || entry.score - 2;
        const gap = entry.score - nextScore;
        const confidence = Math.min(95, Math.max(35, 50 + gap * 15));

        return {
            position: i + 1,
            driver: entry.driver,
            team: entry.team,
            score: Math.round(entry.score * 10) / 10,
            confidence: Math.round(confidence),
        };
    });
}

/**
 * Predict podium finishers for a track
 */
export function predictPodium(trackId: string): PredictionEntry[] {
    return predictGrid(trackId).slice(0, 3);
}

/**
 * Predict pole position
 */
export function predictPole(trackId: string): PredictionEntry {
    return predictGrid(trackId)[0];
}
