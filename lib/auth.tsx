'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
    User,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, displayName: string, favouriteTeam?: string) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    signIn: async () => { },
    signUp: async () => { },
    signInWithGoogle: async () => { },
    logout: async () => { },
});

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const signIn = async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password);
    };

    const signUp = async (email: string, password: string, displayName: string, favouriteTeam?: string) => {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName });

        // Create user doc in Firestore
        await setDoc(doc(db, 'users', cred.user.uid), {
            displayName,
            email,
            favouriteTeam: favouriteTeam || null,
            savedSetups: [],
            createdAt: serverTimestamp(),
        });
    };

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        const cred = await signInWithPopup(auth, provider);

        // Check if user doc exists, create if not
        const userDoc = await getDoc(doc(db, 'users', cred.user.uid));
        if (!userDoc.exists()) {
            await setDoc(doc(db, 'users', cred.user.uid), {
                displayName: cred.user.displayName || 'Racer',
                email: cred.user.email,
                favouriteTeam: null,
                savedSetups: [],
                createdAt: serverTimestamp(),
            });
        }
    };

    const logout = async () => {
        await signOut(auth);
    };

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signUp, signInWithGoogle, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
