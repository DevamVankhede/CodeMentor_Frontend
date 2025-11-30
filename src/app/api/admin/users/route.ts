import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        // In production, verify admin token and fetch from database
        const authHeader = request.headers.get('authorization');

        // Mock data - replace with actual database queries
        const users = [
            {
                id: 1,
                name: 'John Doe',
                email: 'john.doe@example.com',
                isAdmin: false,
                level: 5,
                xp: 2500,
                createdAt: '2024-01-15T10:00:00Z',
                lastActive: '2024-01-20T15:30:00Z',
                status: 'active',
                gamesPlayed: 12,
                codeSubmissions: 8,
            },
            {
                id: 2,
                name: 'Sarah Developer',
                email: 'sarah.dev@example.com',
                isAdmin: false,
                level: 8,
                xp: 4200,
                createdAt: '2024-01-10T08:00:00Z',
                lastActive: '2024-01-20T16:45:00Z',
                status: 'active',
                gamesPlayed: 25,
                codeSubmissions: 15,
            },
            {
                id: 3,
                name: 'Mike Coder',
                email: 'mike.code@example.com',
                isAdmin: false,
                level: 3,
                xp: 1200,
                createdAt: '2024-01-12T14:00:00Z',
                lastActive: '2024-01-18T12:00:00Z',
                status: 'inactive',
                gamesPlayed: 5,
                codeSubmissions: 3,
            },
            {
                id: 4,
                name: 'Emily Tech',
                email: 'emily.tech@example.com',
                isAdmin: false,
                level: 6,
                xp: 3100,
                createdAt: '2024-01-08T09:00:00Z',
                lastActive: '2024-01-20T14:20:00Z',
                status: 'active',
                gamesPlayed: 18,
                codeSubmissions: 12,
            },
            {
                id: 5,
                name: 'Alex Builder',
                email: 'alex.builder@example.com',
                isAdmin: false,
                level: 4,
                xp: 1800,
                createdAt: '2024-01-14T11:00:00Z',
                lastActive: '2024-01-19T10:00:00Z',
                status: 'active',
                gamesPlayed: 9,
                codeSubmissions: 6,
            },
        ];

        return NextResponse.json(users);
    } catch (error: any) {
        console.error('Error fetching users:', error);
        return NextResponse.json(
            { error: 'Failed to fetch users', details: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, action, data } = body;

        // In production, update database
        console.log(`Admin action: ${action} for user ${userId}`, data);

        return NextResponse.json({ success: true, message: `User ${action} successfully` });
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
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        // In production, delete from database
        console.log(`Admin deleted user: ${userId}`);

        return NextResponse.json({ success: true, message: 'User deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting user:', error);
        return NextResponse.json(
            { error: 'Failed to delete user', details: error.message },
            { status: 500 }
        );
    }
}
