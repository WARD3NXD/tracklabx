import { db } from './firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { fetchDriverStandings, fetchConstructorStandings, fetchSeasonRaces } from './jolpica'
import { TEAM_COLORS } from './teamColors'

const CURRENT_SEASON = 2025
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000  // 1 week

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

    // Fetch fresh from Jolpica
    const raw = await fetchDriverStandings(year)
    const data = raw.map((entry: any) => ({
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

    await setDoc(ref, { fetched: new Date(), season: year, data })
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

    const raw = await fetchConstructorStandings(year)
    const data = raw.map((entry: any) => ({
        position: parseInt(entry.position),
        constructorId: entry.Constructor.constructorId,
        name: entry.Constructor.name,
        nationality: entry.Constructor.nationality,
        color: TEAM_COLORS[entry.Constructor.constructorId] ?? '#888',
        points: parseFloat(entry.points),
        wins: parseInt(entry.wins),
    }))

    await setDoc(ref, { fetched: new Date(), season: year, data })
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

    const raw = await fetchSeasonRaces(year)
    const data = raw.map((race: any) => ({
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

    await setDoc(ref, { fetched: new Date(), season: year, data })
    return data
}
