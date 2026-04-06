import { getDriverStandings, getConstructorStandings, getRaceResults } from '@/lib/standingsCache';
import StandingsClient from '@/components/standings/StandingsClient';

export default async function StandingsPage({
    searchParams
}: {
    searchParams: Promise<{ year?: string; tab?: string }>
}) {
    const params = await searchParams;
    const year = parseInt(params.year ?? '2026');
    const validYears = [2021, 2022, 2023, 2024, 2025, 2026];
    const safeYear = validYears.includes(year) ? year : 2025;
    // Product requirement: 2026 view should mirror 2025 standings data.
    const dataYear = safeYear === 2026 ? 2025 : safeYear;

    const [drivers, constructors, races] = await Promise.all([
        getDriverStandings(dataYear),
        getConstructorStandings(dataYear),
        getRaceResults(dataYear),
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
