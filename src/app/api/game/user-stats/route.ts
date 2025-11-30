import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        // In production, fetch from database based on user ID
        const authHeader = request.headers.get('authorization');

        // Mock user stats - replace with actual database query
        const userStats = {
            gamesPlayed: 8,
            totalXP: 2500,
            averageScore: 82,
            bestScore: 95,
            totalTime: 3600, // in seconds
            achievements: [
                { id: 'first-game', name: 'First Game', unlocked: true },
                { id: 'speed-demon', name: 'Speed Demon', unlocked: true },
                { id: 'perfect-score', name: 'Perfect Score', unlocked: false },
            ],
            recentGames: [
                {
                    gameType: 'bug-hunt',
                    score: 85,
                    difficulty: 'medium',
                    date: new Date().toISOString(),
                },
                {
                    gameType: 'bug-hunt',
                    score: 92,
                    difficulty: 'hard',
                    date: new Date(Date.now() - 86400000).toISOString(),
                },
            ],
        };

        return NextResponse.json(userStats);
    } catch (error: any) {
        console.error('Error fetching user stats:', error);
        return NextResponse.json(
            { error: 'Failed to fetch user stats', details: error.message },
            { status: 500 }
        );
    }
}
