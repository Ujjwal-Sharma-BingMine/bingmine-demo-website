import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define route groups
const protectedRoutes = ['/feed', '/profile', '/settings', '/notifications', '/messages']
const authRoutes = ['/login', '/signup', '/register']
const publicRoutes = ['/']

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl
    const token = request.cookies.get('access_token')?.value

    // Check if the current path is a protected route
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

    // Check if the current path is an auth route
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

    // Scenario A: Unauthenticated User trying to access Protected Route
    if (isProtectedRoute && !token) {
        const loginUrl = new URL('/login', request.url)
        // Optional: Add a redirect query param to return user after login
        // loginUrl.searchParams.set('from', pathname)
        return NextResponse.redirect(loginUrl)
    }

    // Scenario B: Authenticated User trying to access Auth Route
    if (isAuthRoute && token) {
        // Redirect to dashboard/feed
        return NextResponse.redirect(new URL('/feed', request.url))
    }

    // Scenario C: Allow access to all other routes
    return NextResponse.next()
}

// Matcher Configuration
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder files (optional, if you have public assets)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
}
