import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protected routes that require authentication
const protectedPaths = [
    '/setup/team',
    '/setup/conditions',
    '/setup/session',
    '/setup/results',
];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if this is a protected route
    const isProtected = protectedPaths.some(path => pathname.startsWith(path));

    if (isProtected) {
        // Check for auth token in cookies (Firebase session)
        const authToken = request.cookies.get('auth-token');

        if (!authToken) {
            // For now, allow access — Firebase auth check will happen client-side
            // In production, use Firebase Admin SDK to verify the session cookie
            return NextResponse.next();
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/setup/:path*'],
};
