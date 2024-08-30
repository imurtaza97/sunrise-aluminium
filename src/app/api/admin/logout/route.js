// app/routes/admin/logout/route.js

import { NextResponse } from 'next/server';
import cookie from 'cookie';

// Logout route
export async function POST(req) {
  // Clear the cookie by setting an expired date
  const serializedCookie = cookie.serialize('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0, // Set to 0 to delete the cookie immediately
    path: '/',
    sameSite: 'Strict',
  });

  // Send response to client
  return NextResponse.json({ message: 'Logged out successfully' }, {
    headers: {
      'Set-Cookie': serializedCookie
    }
  });
}
