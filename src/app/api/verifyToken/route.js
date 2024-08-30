import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(req) {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
        return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);


        // Respond with user name and decoded token
        return NextResponse.json({ decoded }, { status: 200 });

    } catch (err) {
        return NextResponse.json({ error: 'Token verification failed' }, { status: 401 });
    }
}
