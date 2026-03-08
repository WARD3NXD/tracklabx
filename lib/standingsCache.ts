import { db } from './firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { fetchDriverStandings, fetchConstructorStandings, fetchSeasonRaces } from './jolpica'
import { fetchOpenF1DriverStandings, fetchOpenF1ConstructorStandings, fetchOpenF1RaceResults } from './openf1Server'
import { TEAM_COLORS } from './teamColors'

const CURRENT_SEASON = new Date().getFullYear()
const CACHE_TTL_MS = 4 * 60 * 60 * 1000  // 4 hours — refreshes after each race

export async function getDriverStandings(year: number) {
    const ref = doc(db, 'standings', String(year), 'drivers', 'data')
    const snap = await getDoc(ref)

    // Return cache if: historical season OR cache is fresh
    if (snap.exists()) {
        const cached = snap.data()
        const isHistorical = year < CURRENT_SEASON
        const isFresh = Date.now() - cached.fetched.toMillis() < CACHE_TTL_MS
        // Force refresh for CURRENT_SEASON to clear stale/broken data
        if (isHistorical || (isFresh && year !== CURRENT_SEASON)) return cached.data
    }

    let data: any[]

    if (year >= CURRENT_SEASON) {
        // Current season: use OpenF1
        const result = await fetchOpenF1DriverStandings(year)
        
        // If fetch fails or returns empty, fallback to STALE cache if it exists
        if (!result || !('standings' in result) || !result.standings?.length) {
            // FOR NOW: Disable fallback to force fresh fetch and see the fix
            // if (snap.exists()) {
            //     console.log(`OpenF1 driver standings empty/failed for ${year}, using stale cache.`);
            //     return snap.data().data;
            // }
            return []
        }

        // Fetch race results to calculate wins
        const raceResults = await getRaceResults(year)
        const winsMap = new Map<string, number>()
        raceResults.forEach((race: any) => {
            const winner = race.results?.find((r: any) => r.position === 1)
            if (winner) {
                const count = winsMap.get(winner.driverCode) || 0
                winsMap.set(winner.driverCode, count + 1)
            }
        })

        data = result.standings.map((entry: any, idx: number) => {
            const di = entry.driver_info || {};
            const teamId = di.team_name?.toLowerCase().replace(/\s+/g, '_') ?? '';
            const fullName = di.full_name || di.broadcast_name || `Driver ${entry.driver_number}`;
            const driverCode = di.name_acronym ?? di.broadcast_name?.split(' ').pop() ?? `#${entry.driver_number}`;
            
            return {
                position: entry.position_current ?? entry.position ?? idx + 1,
                driverId: entry.driver_number?.toString() ?? '',
                driverCode: driverCode,
                firstName: fullName.split(' ')[0],
                lastName: fullName.split(' ').slice(1).join(' ') || fullName,
                nationality: di.country_code ?? '',
                teamId: teamId,
                teamName: di.team_name || 'Generic Team',
                teamColor: TEAM_COLORS[teamId] ?? (di.team_colour ? `#${di.team_colour}` : '#888'),
                points: entry.points_current ?? entry.points ?? 0,
                wins: winsMap.get(driverCode) || 0,
            };
        })
    } else {
        // Historical seasons: use Jolpica (Ergast)
        const raw = await fetchDriverStandings(year)
        data = raw.map((entry: any) => ({
            position: parseInt(entry.position),
            driverId: entry.Driver.driverId,
            driverCode: entry.Driver.code,
            firstName: entry.Driver.givenName,
            lastName: entry.Driver.familyName,
            nationality: entry.Driver.nationality,
            teamId: entry.Constructors[0]?.constructorId,
            teamName: entry.Constructors[0]?.name,
            teamColor: TEAM_COLORS[entry.Constructors[0]?.constructorId] ?? '#888',
            points: parseFloat(entry.points),
            wins: parseInt(entry.wins),
        }))
    }

    if (data.length > 0) {
        await setDoc(ref, { fetched: new Date(), season: year, data })
    }
    return data
}

export async function getConstructorStandings(year: number) {
    const ref = doc(db, 'standings', String(year), 'constructors', 'data')
    const snap = await getDoc(ref)

    if (snap.exists()) {
        const cached = snap.data()
        const isHistorical = year < CURRENT_SEASON
        const isFresh = Date.now() - cached.fetched.toMillis() < CACHE_TTL_MS
        // Force refresh for CURRENT_SEASON to clear stale/broken data
        if (isHistorical || (isFresh && year !== CURRENT_SEASON)) return cached.data
    }

    let data: any[]

    if (year >= CURRENT_SEASON) {
        // Current season: use OpenF1
        const result = await fetchOpenF1ConstructorStandings(year)
        const raw = (result && 'standings' in result) ? result.standings : []
        const driversInfo = (result && 'driversInfo' in result) ? (result as any).driversInfo : []
        
        // If fetch fails or returns empty, fallback to STALE cache if it exists
        if (!raw?.length) {
            if (snap.exists()) {
                console.log(`OpenF1 constructor standings empty/failed for ${year}, using stale cache.`);
                return snap.data().data;
            }
            return []
        }

        // Fetch race results to calculate wins
        const raceResults = await getRaceResults(year)
        const teamWinsMap = new Map<string, number>()
        raceResults.forEach((race: any) => {
            const winner = race.results?.find((r: any) => r.position === 1)
            if (winner) {
                const count = teamWinsMap.get(winner.teamId) || 0
                teamWinsMap.set(winner.teamId, count + 1)
            }
        })

        data = (raw as any[]).map((entry: any, idx: number) => {
            const teamId = (entry as any).team_name?.toLowerCase().replace(/\s+/g, '_') ?? '';
            return {
                position: (entry as any).position_current ?? (entry as any).position ?? idx + 1,
                constructorId: teamId,
                name: (entry as any).team_name ?? `Team ${idx + 1}`,
                nationality: '',
                color: TEAM_COLORS[teamId] ?? ((entry as any).team_colour ? `#${(entry as any).team_colour}` : '#888'),
                points: (entry as any).points_current ?? (entry as any).points ?? 0,
                wins: teamWinsMap.get(teamId) || 0,
            };
        })

        // If ANY team names are missing in 2026, we can reconstruct standings from driver points
        if (data.length > 0 && data.some(d => d.name.startsWith('Team '))) {
            console.log("Team names missing in championships, reconstruct from drivers...");
            const driverStandings = await getDriverStandings(year);
            const teamPointsMap = new Map<string, {name: string, points: number, color: string}>();
            
            driverStandings.forEach((d: any) => {
                const existing = teamPointsMap.get(d.teamId) || { name: d.teamName, points: 0, color: d.teamColor };
                existing.points += d.points;
                teamPointsMap.set(d.teamId, existing);
            });

            data = Array.from(teamPointsMap.entries())
                .map(([id, info]: [string, {name: string, points: number, color: string}]) => ({
                    position: 0,
                    constructorId: id,
                    name: info.name,
                    nationality: '',
                    color: info.color,
                    points: info.points,
                    wins: teamWinsMap.get(id) || 0
                }))
                .sort((a, b) => b.points - a.points)
                .map((t, i) => ({ ...t, position: i + 1 }));
        }
    } else {
        // Historical seasons: use Jolpica
        const raw = await fetchConstructorStandings(year)
        data = raw.map((entry: any) => ({
            position: parseInt(entry.position),
            constructorId: entry.Constructor.constructorId,
            name: entry.Constructor.name,
            nationality: entry.Constructor.nationality,
            color: TEAM_COLORS[entry.Constructor.constructorId] ?? '#888',
            points: parseFloat(entry.points),
            wins: parseInt(entry.wins),
        }))
    }

    if (data.length > 0) {
        await setDoc(ref, { fetched: new Date(), season: year, data })
    }
    return data
}

export async function getRaceResults(year: number) {
    const ref = doc(db, 'standings', String(year), 'races', 'data')
    const snap = await getDoc(ref)

    if (snap.exists()) {
        const cached = snap.data()
        const isHistorical = year < CURRENT_SEASON
        const isFresh = Date.now() - cached.fetched.toMillis() < CACHE_TTL_MS
        // Force refresh for CURRENT_SEASON to clear stale/broken data
        if (isHistorical || (isFresh && year !== CURRENT_SEASON)) return cached.data
    }

    let data: any[]

    if (year >= CURRENT_SEASON) {
        // Current season: use OpenF1
        const raceResults = await fetchOpenF1RaceResults(year)
        
        // If fetch fails or returns empty, fallback to STALE cache if it exists
        if (!raceResults?.length) {
            if (snap.exists()) {
                console.log(`OpenF1 race results empty/failed for ${year}, using stale cache.`);
                return snap.data().data;
            }
            return []
        }

        data = raceResults.map((race: any, idx: number) => ({
            round: idx + 1,
            raceName: race.meetingName,
            circuit: race.circuit,
            country: race.country,
            date: race.date?.split('T')[0] ?? '',
            results: race.results?.map((r: any) => ({
                position: r.position,
                driverCode: r.driverCode,
                teamId: r.teamId,
                points: 0, // OpenF1 position data doesn't include per-race points
                status: 'Finished',
                fastestLap: false,
            })) ?? []
        }))
    } else {
        // Historical seasons: use Jolpica
        const raw = await fetchSeasonRaces(year)
        data = raw.map((race: any) => ({
            round: parseInt(race.round),
            raceName: race.raceName,
            circuit: race.Circuit.circuitName,
            country: race.Circuit.Location.country,
            date: race.date,
            results: race.Results?.slice(0, 10).map((r: any) => ({
                position: parseInt(r.position),
                driverCode: r.Driver.code,
                teamId: r.Constructor.constructorId,
                points: parseFloat(r.points),
                status: r.status,
                fastestLap: r.FastestLap?.rank === '1',
            })) ?? []
        }))
    }

    if (data.length > 0) {
        await setDoc(ref, { fetched: new Date(), season: year, data })
    }
    return data
}
