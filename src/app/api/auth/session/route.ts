import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authAdmin } from '@/lib/firebase-admin';
import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = '__session';
const SESSION_DURATION_DAYS = 14;

// GET handler for verifying a session
export async function GET() {
  const cookieStore = cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);

  if (!session?.value) {
    return NextResponse.json({ isAuthenticated: false }, { status: 401 });
  }

  try {
    const decodedToken = await authAdmin.verifyIdToken(session.value);
    return NextResponse.json({ isAuthenticated: true, user: decodedToken }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ isAuthenticated: false }, { status: 401 });
  }
}

// POST handler for creating a session (login)
export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();
    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    // Verify the ID token.
    await authAdmin.verifyIdToken(token);

    // Use Next.js's built-in cookie management
    const cookieStore = cookies();
    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * SESSION_DURATION_DAYS,
      path: '/',
      sameSite: 'lax',
    });

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE handler for destroying a session (logout)
export async function DELETE() {
  // Use Next.js's built-in cookie management
  const cookieStore = cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);

  return NextResponse.json({ status: 'success' });
}
