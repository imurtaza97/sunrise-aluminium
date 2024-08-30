import { NextApiRequest, NextResponse } from 'next/server';
import dbConnect from "@/lib/dbConnect";
import Contact from "@/models/contact";

export async function DELETE(req) {
    try {
        // Extract the ID from the request URL
        const url = new URL(req.url);
        const id = url.pathname.split("/").pop();

        if (!id) {
            return NextResponse.json({ message: 'Message ID is required' }, { status: 400 });
        }

        // Connect to the database
        await dbConnect();

        // Find and delete the Message by ID
        const result = await Contact.findByIdAndDelete(id);

        if (!result) {
            return NextResponse.json({ message: 'Message not found' }, { status: 404 });
        }

        // Return a success response
        return NextResponse.json({ message: 'Message deleted successfully' }, { status: 200 });

    } catch (error) {
        return NextResponse.json(
            { error: 'An error occurred while deleting the contact.' },
            { status: 500 }
        );
    }
}
