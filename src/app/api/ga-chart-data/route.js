// pages/api/ga-chart-data.js

import { google } from 'googleapis';

export async function GET() {
    try {
        // Create GoogleAuth instance using environment variables
        const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');
        
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

        // Initialize Google Analytics Data API client
        const analyticsDataClient = google.analyticsdata({
            version: 'v1beta',
            auth,
        });

        // Fetch the analytics report
        const response = await analyticsDataClient.properties.runReport({
            property: 'properties/456645998', // Replace with your GA4 property ID
            requestBody: {
                dateRanges: [
                    {
                        startDate: '2024-01-01',
                        endDate: 'today',
                    },
                ],
                metrics: [
                    { name: 'sessions' },
                ],
                dimensions: [
                    { name: 'month' },
                ],
            },
        });

        // Format the response data
        const chartData = response.data.rows.map(row => ({
            date: row.dimensionValues[0].value,
            activeUsers: parseInt(row.metricValues[0].value, 10),
        }));

        return new Response(JSON.stringify(chartData), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error fetching Google Analytics data:', error.message);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}