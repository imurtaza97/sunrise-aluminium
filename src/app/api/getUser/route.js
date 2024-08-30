import { NextResponse, redirect } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect'; // Adjust the path to your dbConnect utility
import Admin from '@/models/admin'; // Adjust the path to your Admin model
import cookie from 'cookie';

export async function GET(req) {
    const cookies = cookie.parse(req.headers.get('cookie') || '');
    const token = cookies.token;

    if (!token) {
        return NextResponse.redirect(new URL('/admin', req.url));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        await dbConnect();

        // Fetch the user data from the database using the decoded token's ID
        const user = await Admin.findById(decoded.id); // Adjust according to your model's ID field

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Respond with user name and decoded token
        return NextResponse.json({ user }, { status: 200 });

    } catch (err) {
        return NextResponse.json({ error: 'Token verification failed' }, { status: 401 });
    }
}
