/**
 * Server-side OpenF1 API helpers for the standings page.
 * These call the OpenF1 API directly (not through the Next.js proxy)
 * because they run in server components / server-side code.
 */

const OPENF1_BASE = 'https://api.openf1.org/v1'

async function fetchOpenF1(path: string) {
    try {
        const res = await fetch(`${OPENF1_BASE}${path}`, {
            headers: { accept: 'application/json' },
        })
        if (res.status === 404) return []
        if (res.status === 429) {
            console.warn(`OpenF1 Rate Limit (429) for ${path}.`);
            // Wait 1s and retry once
            await new Promise(r => setTimeout(r, 1000));
            const retryRes = await fetch(`${OPENF1_BASE}${path}`, {
                headers: { accept: 'application/json' },
            });
            if (!retryRes.ok) return [];
            return retryRes.json();
        }
        if (!res.ok) {
            console.error(`OpenF1 Error [${res.status}] for ${path}`);
            return []
        }
        return res.json()
    } catch (err) {
        console.error(`Fetch failed for ${path}:`, err);
        return [];
    }
}

export async function fetchOpenF1DriverStandings(year: number) {
    // First, get all race sessions for the year
    const sessions: any[] = await fetchOpenF1(
        `/sessions?year=${year}&session_name=Race`
    )

    if (!sessions.length) return []

    // Filter sessions that have already occurred or are current
    // We look for sessions where date_end has passed
    const now = new Date()
    const pastSessions = sessions.filter(s => new Date(s.date_end) < now)

    // If no past sessions, maybe it's the first race weekend and it's ongoing
    // Use the latest one that has a session_key just in case
    let latestRace;
    if (!pastSessions.length) {
        latestRace = sessions[0]
    } else {
        latestRace = pastSessions[pastSessions.length - 1]
    }

    const sessionKey = latestRace.session_key

    // Fetch championship standings for that session
    const standings: any[] = await fetchOpenF1(
        `/championship_drivers?session_key=${sessionKey}`
    )

    // ENRICHMENT: Fetch drivers for THIS SPECIFIC session
    const driversInfo: any[] = await fetchOpenF1(`/drivers?session_key=${sessionKey}`)
    const driverMap = new Map<number, any>()
    driversInfo.forEach(d => {
        driverMap.set(d.driver_number, d)
    })

    // Map standings with enriched driver info
    const enrichedStandings = standings.map(s => ({
        ...s,
        driver_info: driverMap.get(s.driver_number)
    }))

    return { standings: enrichedStandings, sessions }
}

export async function fetchOpenF1ConstructorStandings(year: number) {
    const sessions: any[] = await fetchOpenF1(
        `/sessions?year=${year}&session_name=Race`
    )

    if (!sessions.length) return []

    const now = new Date()
    const pastSessions = sessions.filter(s => new Date(s.date_end) < now)
    
    let latestRace;
    if (!pastSessions.length) {
        latestRace = sessions[0]
    } else {
        latestRace = pastSessions[pastSessions.length - 1]
    }

    const sessionKey = latestRace.session_key

    const standings: any[] = await fetchOpenF1(
        `/championship_teams?session_key=${sessionKey}`
    )

    // ENRICHMENT: Fetch drivers for this specific session
    const driversInfo: any[] = await fetchOpenF1(`/drivers?session_key=${sessionKey}`)

    return { standings, driversInfo }
}

/**
 * Fetch race results (final positions) for all completed races in a season.
 */
export async function fetchOpenF1RaceResults(year: number) {
    const sessions: any[] = await fetchOpenF1(
        `/sessions?year=${year}&session_name=Race`
    )

    if (!sessions.length) return []

    // For each completed race session, get the final positions (top 10)
    const now = new Date()
    const pastSessions = sessions.filter(s => new Date(s.date_end) < now)

    const results = []
    for (const session of pastSessions) {
        // Fetch drivers for this specific race session to resolve codes/teams
        const driversInfo: any[] = await fetchOpenF1(`/drivers?session_key=${session.session_key}`)
        const driverMap = new Map<number, any>()
        driversInfo.forEach(d => driverMap.set(d.driver_number, d))

        // Fetch positions for this session
        const sessionResults = await fetchOpenF1(`/position?session_key=${session.session_key}`)
        
        // Deduplicate to get final position for each driver
        const finalPositions = new Map<number, any>()
        sessionResults.forEach((r: any) => {
            if (!finalPositions.has(r.driver_number) || r.date > finalPositions.get(r.driver_number).date) {
                finalPositions.set(r.driver_number, r)
            }
        })
        
        // Sort by position
        const sorted = Array.from(finalPositions.values()).sort((a, b) => a.position - b.position);

        results.push({
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
        })
    }

    return results
}
