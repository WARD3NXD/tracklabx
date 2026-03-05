import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin if not already initialized
if (admin.apps.length === 0) {
    admin.initializeApp();
}

/**
 * Weekly Standings Cache Refresh
 * Runs every Sunday at midnight (UTC) to delete the cached data for the current season.
 * This ensures that the next request to the Standings page will fetch fresh data
 * directly from the Jolpica API and re-populate the cache.
 */
export const refreshCurrentSeason = functions.pubsub
    .schedule('0 0 * * 0') // Every Sunday midnight
    .timeZone('UTC')
    .onRun(async () => {
        const CURRENT = 2025; // The currently active racing season
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
