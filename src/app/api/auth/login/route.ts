import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7000';
        console.log('🔐 Login attempt:', email);
        console.log('📡 Calling backend:', `${apiUrl}/api/auth/login`);

        const response = await fetch(`${apiUrl}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        console.log('📥 Backend response status:', response.status);

        // Handle non-JSON responses (rate limiting, HTML error pages, etc.)
        const contentType = response.headers.get('content-type');
        let data;

        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
            console.log('📦 Backend response:', { ...data, token: data.token ? '[HIDDEN]' : undefined });
        } else {
            // Backend returned non-JSON (HTML, plain text, etc.)
            const text = await response.text();
            console.warn('⚠️ Backend returned non-JSON response:', text.substring(0, 100));

            // Handle common HTTP status codes
            if (response.status === 429) {
                return NextResponse.json(
                    { error: 'Too many requests. Please wait a moment and try again.' },
                    { status: 429 }
                );
            }

            return NextResponse.json(
                { error: `Backend error (${response.status}): ${text.substring(0, 100)}` },
                { status: response.status }
            );
        }

        if (!response.ok) {
            console.error('❌ Login failed:', data.message);
            return NextResponse.json(
                { error: data.message || 'Invalid credentials' },
                { status: response.status }
            );
        }

        console.log('✅ Login successful');
        return NextResponse.json(data);
    } catch (error) {
        console.error('💥 Login error:', error);
        return NextResponse.json(
            { error: 'An error occurred during login. Make sure backend is running.' },
            { status: 500 }
        );
    }
}
