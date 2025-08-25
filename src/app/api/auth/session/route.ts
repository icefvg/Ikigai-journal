import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { setCookie, deleteCookie } from 'cookies-next';
import { authAdmin } from '@/lib/firebase-admin';

const SESSION_COOKIE_NAME = '__session';
const SESSION_DURATION_DAYS = 14;

// POST handler for creating a session (login)
export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();
    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    // Verify the ID token.
    await authAdmin.verifyIdToken(token);

    // Set session cookie
    const response = NextResponse.json({ status: 'success' });
    setCookie(SESSION_COOKIE_NAME, token, {
      req: request,
      res: response,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * SESSION_DURATION_DAYS, // 14 days
      path: '/',
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE handler for destroying a session (logout)
export async function DELETE(request: NextRequest) {
  try {
    const response = NextResponse.json({ status: 'success' });
    deleteCookie(SESSION_COOKIE_NAME, {
      req: request,
      res: response,
      path: '/',
    });
    return response;
  } catch (error) {
    console.error('Error deleting session:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
