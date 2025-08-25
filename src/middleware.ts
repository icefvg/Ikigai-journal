// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('firebaseIdToken');
  const { pathname } = request.nextUrl;

  const protectedRoutes = ['/dashboard', '/portfolio', '/trades', '/analytics'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // If the user is trying to access a protected route without a token, redirect to login
  if (!token && isProtectedRoute) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect_to', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If the user is logged in and tries to access the login page, redirect to dashboard
  if (token && pathname === '/login') {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

// Match all protected routes and the login page
export const config = {
  matcher: ['/dashboard/:path*', '/portfolio/:path*', '/trades/:path*', '/analytics/:path*', '/login'],
}
