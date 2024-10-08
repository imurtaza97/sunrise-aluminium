import { NextApiRequest, NextResponse } from 'next/server';
import dbConnect from "@/lib/dbConnect";
import Contact from "@/models/UserContact";

export async function POST(req) {
    try {
        await dbConnect();
        const { name, phone, email, message } = await req.json();

        if (!name || !phone || !email || !message) {
            return NextResponse.json(
                { error: 'All fields are required.' },
                { status: 400 }
            );
        }

        const newContact = new Contact({ name, phone, email, message });
        console.log(newContact);
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