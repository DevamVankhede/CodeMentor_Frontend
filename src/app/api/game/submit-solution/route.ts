import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { gameType, score, timeSpent, difficulty, details, challengeId } = body;

        // In production, save to database and update user stats
        const xpGained = calculateXP(score, difficulty, timeSpent);

        // Mock response - in production, update database
        const result = {
            success: true,
            xpGained,
            newLevel: null,
            achievements: [],
            leaderboardPosition: Math.floor(Math.random() * 100) + 1,
            stats: {
                totalGamesPlayed: 1,
                averageScore: score,
                bestTime: timeSpent,
            },
        };

        // Check for level up
        const currentXP = 2500; // Get from user profile
        const newTotalXP = currentXP + xpGained;
        const newLevel = Math.floor(newTotalXP / 500) + 1;
        const oldLevel = Math.floor(currentXP / 500) + 1;

        if (newLevel > oldLevel) {
            result.newLevel = newLevel;
        }

        // Check for achievements
        if (score >= 90) {
            result.achievements.push({
                id: 'perfect-score',
                name: 'Perfect Score',
                description: 'Achieved 90% or higher score',
                icon: '🏆',
            });
        }

        if (timeSpent < 60) {
            result.achievements.push({
                id: 'speed-demon',
                name: 'Speed Demon',
                description: 'Completed challenge in under 60 seconds',
                icon: '⚡',
            });
        }

        return NextResponse.json(result);
    } catch (error: any) {
        console.error('Error submitting solution:', error);
        return NextResponse.json(
            { error: 'Failed to submit solution', details: error.message },
            { status: 500 }
        );
    }
}

function calculateXP(score: number, difficulty: string, timeSpent: number): number {
    const baseXP = {
        easy: 50,
        medium: 100,
        hard: 200,
    }[difficulty] || 100;

    // Score multiplier (0.5x to 1.5x based on score)
    const scoreMultiplier = 0.5 + (score / 100);

    // Time bonus (faster = more XP, up to 1.5x)
    const timeBonus = timeSpent < 60 ? 1.5 : timeSpent < 120 ? 1.2 : 1.0;

    return Math.round(baseXP * scoreMultiplier * timeBonus);
}
