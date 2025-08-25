import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('__session');
  const { pathname } = request.nextUrl;

  const protectedRoutes = ['/dashboard', '/portfolio', '/trades', '/analytics'];
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  // If trying to access a protected route without a session cookie, redirect to login
  if (isProtectedRoute && !sessionCookie) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect_to', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If logged in (session cookie exists) and trying to access login page, redirect to dashboard
  if (pathname === '/login' && sessionCookie) {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

// Match all protected routes and the login page
export const config = {
  matcher: ['/dashboard/:path*', '/portfolio/:path*', '/trades/:path*', '/analytics/:path*', '/login'],
}
