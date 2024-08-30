import { NextApiRequest, NextResponse } from 'next/server';
import dbConnect from "@/lib/dbConnect";
import Contact from "@/models/contact";

export async function POST(req) {
    try {
        await dbConnect();
        const { name, email, message } = await req.json();

        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Name, email, and message are all required fields.' },
                { status: 400 }
            );
        }

        const newContact = new Contact({ name, email, message });
        await newContact.save();

        return NextResponse.json(
            { message: 'Contact submitted successfully!' },
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json(
            { error: 'An error occurred while submitting the contact.' },
            { status: 500 }
        );
    }
}
export async function GET(req) {
    try {
        await dbConnect();
        const contacts = await Contact.find({}); // Fetch all contact messages
        return NextResponse.json(contacts, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: 'An error occurred while fetching contacts.' },
            { status: 500 }
        );
    }
}