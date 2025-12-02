import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const token = authHeader.substring(7);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7000';

        const response = await fetch(`${apiUrl}/api/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        // Handle non-JSON responses (rate limiting, HTML error pages, etc.)
        const contentType = response.headers.get('content-type');
        let data;

        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            // Backend returned non-JSON (HTML, plain text, etc.)
            const text = await response.text();
            console.warn('⚠️ Backend returned non-JSON response:', text.substring(0, 100));

            if (response.status === 429) {
                return NextResponse.json(
                    { error: 'Too many requests. Please wait a moment and try again.' },
                    { status: 429 }
                );
            }

            return NextResponse.json(
                { error: `Backend error (${response.status})` },
                { status: response.status }
            );
        }

        if (!response.ok) {
            return NextResponse.json(
                { error: data.message || 'Failed to get user data' },
                { status: response.status }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Get user error:', error);
        return NextResponse.json(
            { error: 'An error occurred while fetching user data' },
            { status: 500 }
        );
    }
}
