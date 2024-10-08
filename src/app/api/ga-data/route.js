import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

        if (!privateKey) {
            throw new Error('GOOGLE_PRIVATE_KEY is not defined');
        }

        const auth = new google.auth.GoogleAuth({
            credentials: {
                type: 'service_account',
                project_id: process.env.GOOGLE_PROJECT_ID,
                private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
                private_key: privateKey,
                client_email: process.env.GOOGLE_CLIENT_EMAIL,
                client_id: process.env.GOOGLE_CLIENT_ID,
                auth_uri: process.env.GOOGLE_AUTH_URI,
                token_uri: process.env.GOOGLE_TOKEN_URI,
                auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_X509_CERT_URL,
                client_x509_cert_url: process.env.GOOGLE_CLIENT_X509_CERT_URL
            },
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
                    { name: 'totalUsers' },
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
        console.error('Error fetching Google Analytics data:', error); // Log the error
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}