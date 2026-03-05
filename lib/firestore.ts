import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    query,
    where,
    orderBy,
    limit,
    startAfter,
    increment,
    serverTimestamp,
    DocumentData,
    QueryDocumentSnapshot,
    QueryConstraint,
    Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { nanoid } from 'nanoid';

// ─── Types ───

export interface SetupData {
    frontWing: number;
    rearWing: number;
    diffOnThrottle: number;
    diffOffThrottle: number;
    frontCamber: number;
    rearCamber: number;
    frontToe: number;
    rearToe: number;
    frontSuspension: number;
    rearSuspension: number;
    frontAntiRollBar: number;
    rearAntiRollBar: number;
    frontRideHeight: number;
    rearRideHeight: number;
    brakePressure: number;
    brakeBias: number;
    frontTyrePressure: number;
    rearTyrePressure: number;
    tyreCompound: 'soft' | 'medium' | 'hard';
}

export interface Setup {
    id: string;
    trackId: string;
    teamId: string | null;
    condition: 'dry' | 'intermediate' | 'wet';
    weather: 'sunny' | 'overcast' | 'rain';
    sessionType: 'race' | 'quali' | 'fp1' | 'fp2' | 'fp3';
    lapTime: string;
    lapTimeMs: number;
    userId: string;
    username: string;
    upvotes: number;
    shareToken: string;
    setupData: SetupData;
    createdAt: Timestamp | null;
}

export interface SetupFilters {
    trackId: string;
    teamId?: string;
    condition?: string;
    weather?: string;
    sessionType?: string;
}

// ─── Setups ───

export async function createSetup(
    userId: string,
    username: string,
    filters: SetupFilters,
    lapTime: string,
    lapTimeMs: number,
    setupData: SetupData
): Promise<string> {
    const shareToken = nanoid(10);
    const setupRef = doc(collection(db, 'setups'));

    const setupDoc: Omit<Setup, 'id'> = {
        trackId: filters.trackId,
        teamId: filters.teamId || null,
        condition: (filters.condition || 'dry') as Setup['condition'],
        weather: (filters.weather || 'sunny') as Setup['weather'],
        sessionType: (filters.sessionType || 'race') as Setup['sessionType'],
        lapTime,
        lapTimeMs,
        userId,
        username,
        upvotes: 0,
        shareToken,
        setupData,
        createdAt: null,
    };

    await setDoc(setupRef, {
        ...setupDoc,
        createdAt: serverTimestamp(),
    });

    return setupRef.id;
}

export async function getSetups(
    filters: SetupFilters,
    sortField: 'lapTimeMs' | 'upvotes' | 'createdAt' = 'lapTimeMs',
    sortDirection: 'asc' | 'desc' = sortField === 'lapTimeMs' ? 'asc' : 'desc',
    pageSize: number = 12,
    lastDoc?: QueryDocumentSnapshot<DocumentData>
): Promise<{ setups: Setup[]; lastDoc: QueryDocumentSnapshot<DocumentData> | null }> {
    const constraints: QueryConstraint[] = [
        where('trackId', '==', filters.trackId),
    ];

    if (filters.teamId) constraints.push(where('teamId', '==', filters.teamId));
    if (filters.condition) constraints.push(where('condition', '==', filters.condition));
    if (filters.weather) constraints.push(where('weather', '==', filters.weather));
    if (filters.sessionType) constraints.push(where('sessionType', '==', filters.sessionType));

    constraints.push(orderBy(sortField, sortDirection));
    constraints.push(limit(pageSize));

    if (lastDoc) constraints.push(startAfter(lastDoc));

    const q = query(collection(db, 'setups'), ...constraints);
    const snapshot = await getDocs(q);

    const setups: Setup[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    } as Setup));

    const newLastDoc = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null;

    return { setups, lastDoc: newLastDoc };
}

export async function getSetupByShareToken(shareToken: string): Promise<Setup | null> {
    const q = query(collection(db, 'setups'), where('shareToken', '==', shareToken), limit(1));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Setup;
}

export async function upvoteSetup(setupId: string): Promise<void> {
    const setupRef = doc(db, 'setups', setupId);
    await updateDoc(setupRef, {
        upvotes: increment(1),
    });
}

// ─── Users ───

export async function getUserProfile(userId: string) {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) return null;
    return { id: userDoc.id, ...userDoc.data() };
}

export async function saveSetupToProfile(userId: string, setupId: string) {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
        const savedSetups = userDoc.data().savedSetups || [];
        if (!savedSetups.includes(setupId)) {
            await updateDoc(userRef, {
                savedSetups: [...savedSetups, setupId],
            });
        }
    }
}

// ─── Calendar (seed helper) ───

export async function seedCalendarToFirestore(calendarData: Record<string, unknown>[]) {
    for (const race of calendarData) {
        const raceId = race.id as string;
        await setDoc(doc(db, 'calendar', raceId), race);
    }
}
