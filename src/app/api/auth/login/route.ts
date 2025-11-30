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

        const data = await response.json();
        console.log('📦 Backend response:', { ...data, token: data.token ? '[HIDDEN]' : undefined });

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
