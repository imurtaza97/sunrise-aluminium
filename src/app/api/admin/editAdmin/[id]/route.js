import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Admin from '@/models/admin';
import bcrypt from 'bcrypt';

export async function PUT(req) {
    try {
        const url = new URL(req.url);
        const id = url.pathname.split("/").pop();

        if (!id) {
            return NextResponse.json({ message: 'Admin ID is required' }, { status: 400 });
        }

        // Connect to the database
        await dbConnect();

        // Parse the request body to get the updated details
        const updatedData = await req.json();
        
        if (updatedData.password) {
            // Hash the new password before saving
            const hashedPassword = await bcrypt.hash(updatedData.password, 10);
            updatedData.password = hashedPassword;
        } else {
            // Remove the password field from updatedData if not being updated
            delete updatedData.password;
        }

        // Find and update the admin by ID with the new data
        const result = await Admin.findByIdAndUpdate(id, updatedData, { new: true });

        if (!result) {
            return NextResponse.json({ message: 'Admin not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Details updated successfully', admin: result }, { status: 200 });
    } catch (error) {
        console.error('Error updating admin:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
