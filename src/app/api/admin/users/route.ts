import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

// Disable SSL verification for development
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

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
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

        const response = await fetch(`${apiUrl}/api/admin/users`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { error: data.message || 'Failed to fetch users' },
                { status: response.status }
            );
        }

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Error fetching users:', error);
        return NextResponse.json(
            { error: 'Failed to fetch users', details: error.message },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const token = authHeader.substring(7);
        const body = await request.json();
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

        const response = await fetch(`${apiUrl}/api/admin/users`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { error: data.message || 'Failed to create user' },
                { status: response.status }
            );
        }

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Error creating user:', error);
        return NextResponse.json(
            { error: 'Failed to create user', details: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const token = authHeader.substring(7);
        const body = await request.json();
        const { userId, ...updateData } = body;
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

        const response = await fetch(`${apiUrl}/api/admin/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData),
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { error: data.message || 'Failed to update user' },
                { status: response.status }
            );
        }

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Error updating user:', error);
        return NextResponse.json(
            { error: 'Failed to update user', details: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const token = authHeader.substring(7);
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        const response = await fetch(`${apiUrl}/api/admin/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { error: data.message || 'Failed to delete user' },
                { status: response.status }
            );
        }

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Error deleting user:', error);
        return NextResponse.json(
            { error: 'Failed to delete user', details: error.message },
            { status: 500 }
        );
    }
}
