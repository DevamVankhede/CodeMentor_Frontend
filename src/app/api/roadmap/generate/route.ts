import { NextRequest, NextResponse } from 'next/server';
import { roadmapGenerator } from '@/lib/roadmapGenerator';

export async function POST(request: NextRequest) {
    try {
        console.log('📥 Received roadmap generation request');
        const body = await request.json();
        const { topic, difficulty, duration, goals } = body;

        console.log('Request data:', { topic, difficulty, duration, goals });

        if (!topic || !difficulty || !duration) {
            console.error('❌ Missing required fields');
            return NextResponse.json(
                { error: 'Missing required fields: topic, difficulty, duration' },
                { status: 400 }
            );
        }

        // Check if API key is available
        const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        if (!apiKey) {
            console.error('❌ Gemini API key not configured');
            return NextResponse.json(
                { error: 'AI service not configured. Please set NEXT_PUBLIC_GEMINI_API_KEY' },
                { status: 500 }
            );
        }

        console.log('✅ API key found, generating roadmap...');
        const roadmap = await roadmapGenerator.generateRoadmap(
            topic,
            difficulty,
            duration,
            goals
        );

        console.log('✅ Roadmap generated successfully');
        return NextResponse.json(roadmap);
    } catch (error: any) {
        console.error('❌ Error in roadmap generation API:', error);
        console.error('Error stack:', error.stack);
        return NextResponse.json(
            {
                error: 'Failed to generate roadmap',
                details: error.message,
                hint: 'Check server logs for more details'
            },
            { status: 500 }
        );
    }
}
