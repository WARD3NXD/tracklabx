import { getDriverStandings, getConstructorStandings, getRaceResults } from '@/lib/standingsCache';
import StandingsClient from '@/components/standings/StandingsClient';

export default async function StandingsPage({
    searchParams
}: {
    searchParams: Promise<{ year?: string; tab?: string }>
}) {
    const params = await searchParams;
    const year = parseInt(params.year ?? '2025');
    const validYears = [2021, 2022, 2023, 2024, 2025, 2026];
    const safeYear = validYears.includes(year) ? year : 2025;

    const [drivers, constructors, races] = await Promise.all([
        getDriverStandings(safeYear),
        getConstructorStandings(safeYear),
        getRaceResults(safeYear),
    ]);

    return (
        <StandingsClient
            year={safeYear}
            drivers={drivers}
            constructors={constructors}
            races={races}
        />
    );
}
