import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import path from 'path';

export async function GET() {
    try {
        const keyFilePath = path.resolve('src/config/angelic-digit-434216-s1-50589c7ac1a8.json');

        const auth = new google.auth.GoogleAuth({
            keyFile: keyFilePath,
            scopes: 'https://www.googleapis.com/auth/analytics.readonly',
        });

        const analyticsDataClient = google.analyticsdata({
            version: 'v1beta',
            auth,
        });

        const response = await analyticsDataClient.properties.runReport({
            property: 'properties/456645998', // Replace with your GA4 property ID
            requestBody: {
                dateRanges: [
                    {
                        startDate: '2024-08-01',
                        endDate: 'today',
                    },
                ],
                metrics: [
                    { name: 'activeUsers' },
                    { name: 'active1dayUsers' },
                ],
                dimensions: [
                    { name: 'country' },
                    { name: 'city' },
                ]
            },
        });

        return NextResponse.json(response.data);
    } catch (error) {
        console.error('Error fetching Google Analytics data:', error.message); // Log the error
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
