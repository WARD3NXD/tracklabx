'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/lib/auth';
import { Navbar } from '@/components/layout/Navbar';

export function Providers({ children }: { children: ReactNode }) {
    return (
        <AuthProvider>
            <Navbar />
            <main className="pt-16 min-h-screen">
                {children}
            </main>
        </AuthProvider>
    );
}
