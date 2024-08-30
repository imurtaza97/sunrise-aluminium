import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Admin from '@/models/admin';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

export async function PUT(req) {
    const cookies = cookie.parse(req.headers.get('cookie') || '');
    const token = cookies.token;

    if (!token) {
        return NextResponse.redirect(new URL('/admin', req.url));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        await dbConnect();

        const { password } = await req.json();
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await Admin.findByIdAndUpdate(decoded.id, { password: hashedPassword }, { new: true });

        if (!result) {
            return NextResponse.json({ message: 'Admin not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Password updated successfully', admin: result }, { status: 200 });

    } catch (error) {
        console.error('Error updating admin:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
