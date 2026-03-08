import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin if not already initialized
if (admin.apps.length === 0) {
    admin.initializeApp();
}

/**
 * Post-Race Standings Cache Refresh
 * Runs every Monday at 00:00 UTC to delete the cached data for the current season.
 * Races typically finish on Sunday, so this ensures fresh data is fetched on the
 * first page load after each race weekend.
 */
export const refreshCurrentSeason = functions.pubsub
    .schedule('0 0 * * 1') // Every Monday midnight UTC (after race day)
    .timeZone('UTC')
    .onRun(async () => {
        const CURRENT = 2026; // The currently active racing season
        const db = admin.firestore();

        try {
            console.log(`Starting scheduled cache clear for season ${CURRENT}...`);

            // Delete current season cache docs -> forces fresh fetch on next page load
            await db.doc(`standings/${CURRENT}/drivers/data`).delete();
            await db.doc(`standings/${CURRENT}/constructors/data`).delete();
            await db.doc(`standings/${CURRENT}/races/data`).delete();

            console.log(`Successfully cleared standing caches for ${CURRENT}. Will refresh on next request.`);
        } catch (error) {
            console.error(`Failed to clear cache for season ${CURRENT}:`, error);
        }
    });
