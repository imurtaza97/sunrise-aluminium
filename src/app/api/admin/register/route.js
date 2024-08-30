import { NextApiRequest, NextResponse } from 'next/server';
import dbConnect from "@/lib/dbConnect";
import Admin from '@/models/admin';
import bcrypt from 'bcrypt';

export async function POST(req) {
    try {
        await dbConnect();
        const { name, email, password, ipAddress } = await req.json();

        if (!name || !email || !password || !ipAddress) {
            return NextResponse.json(
                { error: 'Name, email, and password are required.' },
                { status: 400 }
            );
        }

        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return NextResponse.json(
                { error: 'Admin with this email already exists.' },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = new Admin({ name, email, password: hashedPassword, ipAddress });
        await newAdmin.save();

        return NextResponse.json(
            { message: 'Admin registered successfully!' },
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json(
            { error: 'An error occurred during registration.' },
            { status: 500 }
        );
    }
}