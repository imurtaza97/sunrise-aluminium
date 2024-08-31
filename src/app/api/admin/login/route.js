import { NextApiRequest, NextResponse } from 'next/server';
import dbConnect from "@/lib/dbConnect";
import Admin from "@/models/admin";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

export async function POST(req) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    // Find the admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return NextResponse.json(
        { error: 'Admin not found.' },
        { status: 404 }
      );
    }


    // Check if password is correct
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid password.' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );

    // Set cookie with token
    const serializedCookie = cookie.serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 12 * 3600, // 12 hours
      path: '/',
      sameSite: 'Strict',
    });

    const response = NextResponse.json(
      { message: 'Login successful!' },
      { status: 200 }
    );

    response.headers.append('Set-Cookie', serializedCookie);
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'An error occurred while logging in.' },
      { status: 500 }
    );
  }
}
