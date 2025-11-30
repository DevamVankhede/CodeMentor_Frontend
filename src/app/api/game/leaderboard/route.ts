import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const gameType = searchParams.get('gameType');
        const timeframe = searchParams.get('timeframe') || 'all-time';

        // In production, fetch from database
        const leaderboard = [
            {
                rank: 1,
                userId: '1',
                username: 'CodeMaster',
                avatar: '👑',
                score: 2847,
                gamesPlayed: 23,
                averageScore: 95,
                totalXP: 5200,
                level: 10,
            },
            {
                rank: 2,
                userId: '2',
                username: 'DevQueen',
                avatar: '🚀',
                score: 2156,
                gamesPlayed: 18,
                averageScore: 92,
                totalXP: 4200,
                level: 8,
            },
            {
                rank: 3,
                userId: '3',
                username: 'BugHunter',
                avatar: '⚡',
                score: 1892,
                gamesPlayed: 15,
                averageScore: 88,
                totalXP: 3500,
                level: 7,
            },
            {
                rank: 4,
                userId: '4',
                username: 'SpeedCoder',
                avatar: '🎯',
                score: 1654,
                gamesPlayed: 12,
                averageScore: 85,
                totalXP: 2800,
                level: 6,
            },
            {
                rank: 5,
                userId: '5',
                username: 'You',
                avatar: '🎮',
                score: 1234,
                gamesPlayed: 8,
                averageScore: 82,
                totalXP: 2500,
                level: 5,
            },
        ];

        return NextResponse.json(leaderboard);
    } catch (error: any) {
        console.error('Error fetching leaderboard:', error);
        return NextResponse.json(
            { error: 'Failed to fetch leaderboard', details: error.message },
            { status: 500 }
        );
    }
}
