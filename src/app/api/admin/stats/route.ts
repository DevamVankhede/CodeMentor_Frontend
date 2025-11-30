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

        const data = await response.json();

        // Transform backend stats to match frontend expectations
        const transformedStats = {
            totalUsers: data.totalUsers || 0,
            activeUsers: data.activeUsers || 0,
            newUsersToday: 0, // Calculate if needed
            totalCodeSamples: data.totalCodeSnippets || 0,
            totalRoadmaps: data.totalRoadmaps || 0,
            totalCollaborations: data.totalSessions || 0,
            totalGamesPlayed: data.totalGameResults || 0,
            systemHealth: 'healthy',
            serverUptime: 'N/A',
            databaseSize: 'N/A',
            recentActivity: data.recentActivity || [],
        };

        return NextResponse.json(transformedStats);
    } catch (error: any) {
        console.error('Error fetching admin stats:', error);
        return NextResponse.json(
            { error: 'Failed to fetch stats', details: error.message },
            { status: 500 }
        );
    }
}
