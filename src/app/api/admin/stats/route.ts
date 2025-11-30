import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        // In production, verify admin token
        const authHeader = request.headers.get('authorization');

        // Mock data - replace with actual database queries
        const stats = {
            totalUsers: 1247,
            activeUsers: 892,
            newUsersToday: 23,
            totalCodeSamples: 156,
            totalRoadmaps: 23,
            totalCollaborations: 45,
            totalGamesPlayed: 3421,
            systemHealth: 'healthy',
            serverUptime: '15 days',
            databaseSize: '2.4 GB',
            recentActivity: [
                {
                    id: '1',
                    type: 'user_signup',
                    user: 'john.doe@example.com',
                    description: 'New user registered',
                    timestamp: new Date().toISOString(),
                },
                {
                    id: '2',
                    type: 'code_created',
                    user: 'sarah.dev@example.com',
                    description: 'Created new code sample',
                    timestamp: new Date(Date.now() - 3600000).toISOString(),
                },
                {
                    id: '3',
                    type: 'game_completed',
                    user: 'mike.code@example.com',
                    description: 'Completed Bug Hunt game',
                    timestamp: new Date(Date.now() - 7200000).toISOString(),
                },
            ],
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
