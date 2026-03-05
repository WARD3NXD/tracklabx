const BASE = 'https://api.jolpi.ca/ergast/f1'

export async function fetchDriverStandings(year: number) {
    const res = await fetch(`${BASE}/${year}/driverstandings.json`)
    const json = await res.json()
    return json.MRData.StandingsTable.StandingsLists[0]?.DriverStandings ?? []
}

export async function fetchConstructorStandings(year: number) {
    const res = await fetch(`${BASE}/${year}/constructorstandings.json`)
    const json = await res.json()
    return json.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings ?? []
}

export async function fetchSeasonRaces(year: number) {
    const res = await fetch(`${BASE}/${year}/results.json?limit=500`)
    const json = await res.json()
    return json.MRData.RaceTable.Races ?? []
}
