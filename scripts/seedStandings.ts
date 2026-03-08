import { config } from 'dotenv';
config({ path: '.env.local' });

import { getDriverStandings, getConstructorStandings, getRaceResults } from '../lib/standingsCache';

const HISTORICAL_YEARS = [2021, 2022, 2023, 2024, 2025];

async function seed() {
    console.log('--- Starting Standings Seed Process ---');
    for (const year of HISTORICAL_YEARS) {
        console.log(`\nSeeding ${year}...`);
        try {
            console.log(`  - Fetching drivers for ${year}`);
            await getDriverStandings(year);

            console.log(`  - Fetching constructors for ${year}`);
            await getConstructorStandings(year);

            console.log(`  - Fetching races for ${year}`);
            await getRaceResults(year);

            console.log(`✓ ${year} done`);
        } catch (e: any) {
            console.error(`Error seeding ${year}:`, e.message);
        }
        // Rate limit buffer for Jolpica API
        await new Promise(r => setTimeout(r, 1000));
    }
    console.log('\n--- All historical data seeded ---');
}

seed();
