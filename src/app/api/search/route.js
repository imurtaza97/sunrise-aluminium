import { NextResponse } from 'next/server';
import Contact from '@/models/contact'; // Ensure correct import path and casing
import Admin from '@/models/admin'; // Ensure correct import path and casing

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';

    console.log('Search query:', query); // Debugging: Log the search query

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
        console.log('Static Contact Results:', staticContactResults);

        const adminResults = await Admin.find({
            $or: [
                { name: regex },
                { email: regex }
            ]
        });

        console.log('Contact Results:', contactResults); // Debugging: Log results
        console.log('Admin Results:', adminResults); // Debugging: Log results

        const results = [
            ...contactResults.map(contact => ({ ...contact.toObject(), type: 'contact' })),
            ...adminResults.map(admin => ({ ...admin.toObject(), type: 'admin' }))
        ];

        return NextResponse.json({ results });
    } catch (error) {
        console.error('Error searching database:', error);
        return NextResponse.error();
    }
}