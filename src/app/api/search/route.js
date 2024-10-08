import { NextResponse } from 'next/server';
import Contact from '@/models/UserContact'; // Ensure correct import path and casing
import Admin from '@/models/admin'; // Ensure correct import path and casing

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';

    try {
        const regex = new RegExp(query, 'i');

        // Test contact results with regex
        const contactResults = await Contact.find({
            $or: [
                { name: regex },
                { email: regex },
                { message: regex }
            ]
        });

        // Test contact results with a static query
        const staticContactResults = await Contact.find({ name: 'Marie Hozze' });

        const adminResults = await Admin.find({
            $or: [
                { name: regex },
                { email: regex }
            ]
        });
        const results = [
            ...contactResults.map(contact => ({ ...contact.toObject(), type: 'contact' })),
            ...adminResults.map(admin => ({ ...admin.toObject(), type: 'admin' }))
        ];

        return NextResponse.json({ results });
    } catch (error) {
        return NextResponse.error();
    }
}