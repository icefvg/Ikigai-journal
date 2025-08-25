export const runtime = 'nodejs';

// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authAdmin } from '@/lib/firebase-admin';

async function verifySessionCookie(token: string) {
  try {
    await authAdmin.verifyIdToken(token);
    return true;
  } catch (error) {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get('__session')?.value;
  const { pathname } = request.nextUrl;

  const protectedRoutes = ['/dashboard', '/portfolio', '/trades', '/analytics'];
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  const isTokenValid = sessionToken ? await verifySessionCookie(sessionToken) : false;

  if (isProtectedRoute) {
    if (!isTokenValid) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect_to', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname === '/login' && isTokenValid) {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

// Match all protected routes and the login page
export const config = {
  matcher: ['/dashboard/:path*', '/portfolio/:path*', '/trades/:path*', '/analytics/:path*', '/login'],
}
