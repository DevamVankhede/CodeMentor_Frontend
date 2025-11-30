import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7000';

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const token = authHeader.substring(7);

        // Fetch stats from backend API
        const response = await fetch(`${apiUrl}/api/admin/stats`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return NextResponse.json(
                { error: errorData.message || 'Failed to fetch stats from backend' },
                { status: response.status }
            );
        }

        const backendStats = await response.json();

        // Transform backend response to match frontend format
        const stats = {
            totalUsers: backendStats.totalUsers || 0,
            activeUsers: backendStats.activeUsers || 0,
            newUsersToday: backendStats.newUsersToday || 0,
            totalCodeSamples: backendStats.totalCodeSnippets || 0,
            totalRoadmaps: backendStats.totalRoadmaps || 0,
            totalCollaborations: backendStats.activeSessions || 0,
            totalGamesPlayed: backendStats.totalGameResults || 0,
            systemHealth: backendStats.systemHealth || 'healthy',
            serverUptime: backendStats.serverUptime || '0 days',
            databaseSize: backendStats.databaseSize || '0 MB',
            recentActivity: backendStats.recentActivity || [],
        };

        return NextResponse.json(stats);
    } catch (error: any) {
        console.error('Error fetching admin stats:', error);
        return NextResponse.json(
            { error: 'Failed to fetch stats', details: error.message },
            { status: 500 }
        );
    }
}
