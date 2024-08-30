import { NextResponse } from 'next/server';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';
import dbConnect from '@/lib/dbConnect';
import Admin from '@/models/admin';

export async function POST(req) {
    const cookies = cookie.parse(req.headers.get('cookie') || '');
    const token = cookies.token;

    if (!token) {
        return NextResponse.redirect(new URL('/admin', req.url));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        await dbConnect();

        const data = await req.formData();
        const file = data.get('ProfileImage');

        if (!file) {
            return NextResponse.json({ "message": "No file found", success: false });
        }

        // Get the user's ID and define the new file name
        const userId = decoded.id;
        const originalFileName = file.name;
        const fileExtension = path.extname(originalFileName);
        const newFileName = `${userId}${fileExtension}`;
        const filePath = path.join(process.cwd(), 'public', 'profileImage', newFileName);

        // Get the previous image path from the database
        const admin = await Admin.findById(userId);
        if (admin && admin.image) {
            const oldFilePath = path.join(process.cwd(), 'public', 'profileImage', path.basename(admin.image));
            
            // Remove the existing file if it exists
            try {
                await unlink(oldFilePath);
            } catch (error) {
                if (error.code !== 'ENOENT') {
                    throw error;
                }
            }
        }

        // Write the new file
        const byteData = await file.arrayBuffer();
        const buffer = Buffer.from(byteData);
        await writeFile(filePath, buffer);

        // Update the Admin model with the new image path
        const imagePath = `/profileImage/${newFileName}`; // Relative path to save in DB
        await Admin.findByIdAndUpdate(userId, { image: imagePath });

        return NextResponse.json({ "message": "File saved and admin updated successfully", success: true });
    } catch (error) {
        console.error('Error processing file:', error);
        return NextResponse.json({ "message": "An error occurred", success: false, error: error.message });
    }
}