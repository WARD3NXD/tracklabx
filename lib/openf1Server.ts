/**
 * Server-side OpenF1 API helpers for the standings page.
 * These call the OpenF1 API directly (not through the Next.js proxy)
 * because they run in server components / server-side code.
 */

const OPENF1_BASE = 'https://api.openf1.org/v1'

async function fetchOpenF1(path: string): Promise<any> {
    const res = await fetch(`${OPENF1_BASE}${path}`, {
        cache: 'no-store',
        headers: { accept: 'application/json' },
    })

    if (res.status === 404) return []

    if (!res.ok) {
        console.error(`OpenF1 server fetch failed: ${res.status} for ${path}`)
        return []
    }

    return res.json()
}

/**
 * Fetch championship driver standings from OpenF1.
 * Uses the latest race session to get current standings.
 */
export async function fetchOpenF1DriverStandings(year: number) {
    // First, get the latest race session for the year
    const sessions: any[] = await fetchOpenF1(
        `/sessions?year=${year}&session_name=Race`
    )

    if (!sessions.length) return []

    // Get the latest race session key
    const latestRace = sessions[sessions.length - 1]
    const sessionKey = latestRace.session_key

    // Fetch championship standings for that session
    const standings: any[] = await fetchOpenF1(
        `/championship_drivers?session_key=${sessionKey}`
    )

    return { standings, sessions }
}

/**
 * Fetch championship constructor/team standings from OpenF1.
 */
export async function fetchOpenF1ConstructorStandings(year: number) {
    const sessions: any[] = await fetchOpenF1(
        `/sessions?year=${year}&session_name=Race`
    )

    if (!sessions.length) return []

    const latestRace = sessions[sessions.length - 1]
    const sessionKey = latestRace.session_key

    const standings: any[] = await fetchOpenF1(
        `/championship_teams?session_key=${sessionKey}`
    )

    return standings
}

/**
 * Fetch race results (final positions) for all completed races in a season.
 */
export async function fetchOpenF1RaceResults(year: number) {
    const sessions: any[] = await fetchOpenF1(
        `/sessions?year=${year}&session_name=Race`
    )

    if (!sessions.length) return []

    // For each race session, get the final positions (top 10)
    const raceResults = await Promise.all(
        sessions.map(async (session: any) => {
            const positions: any[] = await fetchOpenF1(
                `/position?session_key=${session.session_key}`
            )

            // Get the latest (final) position for each driver
            const finalPositions = new Map<number, any>()
            positions.forEach((p: any) => {
                const existing = finalPositions.get(p.driver_number)
                if (!existing || new Date(p.date) > new Date(existing.date)) {
                    finalPositions.set(p.driver_number, p)
                }
            })

            const sorted = Array.from(finalPositions.values())
                .sort((a, b) => a.position - b.position)
                .slice(0, 10) // Top 10

            // Also fetch driver details for this session
            const drivers: any[] = await fetchOpenF1(
                `/drivers?session_key=${session.session_key}`
            )
            const driverMap = new Map<number, any>()
            drivers.forEach((d: any) => driverMap.set(d.driver_number, d))

            return {
                sessionKey: session.session_key,
                sessionName: session.session_name,
                meetingName: session.meeting_name ?? session.location,
                country: session.country_name,
                circuit: session.circuit_short_name,
                date: session.date_start,
                results: sorted.map((p: any) => {
                    const driver = driverMap.get(p.driver_number)
                    return {
                        position: p.position,
                        driverCode: driver?.name_acronym ?? `#${p.driver_number}`,
                        teamId: driver?.team_name?.toLowerCase().replace(/\s+/g, '_') ?? 'unknown',
                        driverNumber: p.driver_number,
                    }
                })
            }
        })
    )

    return raceResults
}
