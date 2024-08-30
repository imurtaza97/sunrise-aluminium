import { NextResponse } from 'next/server';
import dbConnect from "@/lib/dbConnect";
import Admin from "@/models/admin";
import cookie from 'cookie';
import jwt from 'jsonwebtoken';

export async function GET(req) {
    try {
        // Parse the cookies from the request headers
        const cookies = cookie.parse(req.headers.get('cookie') || '');
        const token = cookies.token;

        // Check if the token exists
        if (!token) {
            return NextResponse.json({ error: 'Token not provided' }, { status: 401 });
        }

        // Verify the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Connect to the database
        await dbConnect();

        // Find the admin user by ID
        const user = await Admin.findById(decoded.id);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Parse query parameters for pagination
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 10;

        // Calculate skip value
        const skip = (page - 1) * limit;

        // Fetch admins with pagination
        const admins = await Admin.find().skip(skip).limit(limit);

        // Get the total count of admins
        const totalAdmins = await Admin.countDocuments();

        // Calculate total pages
        const totalPages = Math.ceil(totalAdmins / limit);
        
        // Return the list of admins along with pagination details
        return NextResponse.json({ admins, totalPages, currentPage: page }, { status: 200 });

    } catch (err) {
        // Handle errors with more specific messages
        let errorMessage = 'Token verification failed';

        if (err.name === 'JsonWebTokenError') {
            errorMessage = 'Invalid token';
        } else if (err.name === 'TokenExpiredError') {
            errorMessage = 'Token expired';
        }

        return NextResponse.json({ error: errorMessage }, { status: 401 });
    }
}