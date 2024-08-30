import { NextResponse } from 'next/server';
import cookie from 'cookie';

export async function middleware(req) {
    const { pathname } = req.nextUrl;

    // Define routes that need authentication
    const protectedRoutes = ['/admin/dashboard', '/admin/profile', '/admin/users', '/admin/contacts'];

    // Get the token from cookies
    const cookies = cookie.parse(req.headers.get('cookie') || '');
    const token = cookies.token;

    // Redirect users away from the login page if they have a valid token
    if (pathname === '/admin' && token) {
        // Verify the token using the API route
        const verifyResponse = await fetch(`${req.nextUrl.origin}/api/verifyToken`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (verifyResponse.status === 200) {
            // If token is valid, redirect to the dashboard
            return NextResponse.redirect(new URL('/admin/dashboard', req.url));
        }
    }

    // Check if the route is protected
    if (protectedRoutes.some(route => pathname.startsWith(route))) {
        if (!token) {
            return NextResponse.redirect(new URL('/admin', req.url));
        }

        // Verify the token using the API route
        const verifyResponse = await fetch(`${req.nextUrl.origin}/api/verifyToken`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (verifyResponse.status !== 200) {
            return NextResponse.redirect(new URL('/admin', req.url));
        }
    }

    // Allow the request to proceed
    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
