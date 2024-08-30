import { NextResponse } from 'next/server';
import dbConnect from "@/lib/dbConnect";
import Admin from "@/models/admin";

export async function DELETE(req) {
    try {
        // Extract the ID from the request URL
        const url = new URL(req.url);
        const id = url.pathname.split("/").pop();

        if (!id) {
            return NextResponse.json({ message: 'Admin ID is required' }, { status: 400 });
        }

        // Connect to the database
        await dbConnect();

        // Find and delete the admin by ID
        const result = await Admin.findByIdAndDelete(id);

        if (!result) {
            return NextResponse.json({ message: 'Admin not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Admin deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
