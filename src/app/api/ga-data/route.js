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

        // Set the start date for all-time sessions (e.g., when the site went live)
        const siteLaunchDate = '2024-01-01'; // Replace with the actual launch date

        // Fetch all-time sessions
        const allTimeSessionsResponse = await analyticsDataClient.properties.runReport({
            property: 'properties/456645998', // Replace with your GA4 property ID
            requestBody: {
                dateRanges: [
                    {
                        startDate: siteLaunchDate,
                        endDate: 'today',
                    },
                ],
                metrics: [{ name: 'sessions' }],
            },
        });

        // Fetch sessions in the last 24 hours (yesterday to today)
        const last24HoursSessionsResponse = await analyticsDataClient.properties.runReport({
            property: 'properties/456645998', // Replace with your GA4 property ID
            requestBody: {
                dateRanges: [
                    {
                        startDate: 'yesterday',
                        endDate: 'today',
                    },
                ],
                metrics: [{ name: 'sessions' }],
                dimensions: [
                    { name: 'country' },
                    { name: 'city' },
                ],
            },
        });

        const allTimeSessions = allTimeSessionsResponse.data.rows?.[0]?.metricValues?.[0]?.value || 0;
        const last24HoursSessions = last24HoursSessionsResponse.data.rows?.reduce((acc, row) => acc + parseInt(row.metricValues[0].value, 10), 0) || 0;

        // Top visited country and city in the last 24 hours
        const topVisitedCountry = last24HoursSessionsResponse.data.rows?.[0]?.dimensionValues?.[0]?.value || 'Unknown';
        const topVisitedCity = last24HoursSessionsResponse.data.rows?.[0]?.dimensionValues?.[1]?.value || 'Unknown';

        console.log(allTimeSessions,last24HoursSessions,topVisitedCity,topVisitedCountry);
        
        return NextResponse.json({
            allTimeSessions,
            last24HoursSessions,
            topVisitedCountry,
            topVisitedCity,
        });

    } catch (error) {
        console.error('Error fetching Google Analytics data:', error); // Log the error
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
