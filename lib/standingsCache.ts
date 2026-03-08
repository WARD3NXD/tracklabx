import { db } from './firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { fetchDriverStandings, fetchConstructorStandings, fetchSeasonRaces } from './jolpica'
import { fetchOpenF1DriverStandings, fetchOpenF1ConstructorStandings, fetchOpenF1RaceResults } from './openf1Server'
import { TEAM_COLORS } from './teamColors'

const CURRENT_SEASON = 2026
const CACHE_TTL_MS = 4 * 60 * 60 * 1000  // 4 hours — refreshes after each race

export async function getDriverStandings(year: number) {
    const ref = doc(db, 'standings', String(year), 'drivers', 'data')
    const snap = await getDoc(ref)

    // Return cache if: historical season OR cache is fresh
    if (snap.exists()) {
        const cached = snap.data()
        const isHistorical = year < CURRENT_SEASON
        const isFresh = Date.now() - cached.fetched.toMillis() < CACHE_TTL_MS
        if (isHistorical || isFresh) return cached.data
    }

    let data: any[]

    if (year >= CURRENT_SEASON) {
        // Current season: use OpenF1
        const result = await fetchOpenF1DriverStandings(year)
        if (!result || !('standings' in result) || !result.standings?.length) return []

        data = result.standings.map((entry: any, idx: number) => ({
            position: entry.position ?? idx + 1,
            driverId: entry.driver_number?.toString() ?? '',
            driverCode: entry.driver_acronym ?? entry.driver_name_acronym ?? '',
            firstName: entry.driver_first_name ?? entry.first_name ?? '',
            lastName: entry.driver_last_name ?? entry.last_name ?? '',
            nationality: entry.driver_nationality ?? '',
            teamId: entry.team_name?.toLowerCase().replace(/\s+/g, '_') ?? '',
            teamName: entry.team_name ?? '',
            teamColor: TEAM_COLORS[entry.team_name?.toLowerCase().replace(/\s+/g, '_') ?? ''] ?? entry.team_colour ? `#${entry.team_colour}` : '#888',
            points: entry.points ?? 0,
            wins: entry.wins ?? 0,
        }))
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
        if (isHistorical || isFresh) return cached.data
    }

    let data: any[]

    if (year >= CURRENT_SEASON) {
        // Current season: use OpenF1
        const raw = await fetchOpenF1ConstructorStandings(year)
        if (!raw?.length) return []

        data = raw.map((entry: any, idx: number) => ({
            position: entry.position ?? idx + 1,
            constructorId: entry.team_name?.toLowerCase().replace(/\s+/g, '_') ?? '',
            name: entry.team_name ?? '',
            nationality: '',
            color: TEAM_COLORS[entry.team_name?.toLowerCase().replace(/\s+/g, '_') ?? ''] ?? entry.team_colour ? `#${entry.team_colour}` : '#888',
            points: entry.points ?? 0,
            wins: entry.wins ?? 0,
        }))
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
        if (isHistorical || isFresh) return cached.data
    }

    let data: any[]

    if (year >= CURRENT_SEASON) {
        // Current season: use OpenF1
        const raceResults = await fetchOpenF1RaceResults(year)
        if (!raceResults?.length) return []

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
