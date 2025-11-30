import { NextRequest, NextResponse } from 'next/server';
import { geminiService } from '@/lib/gemini';

export async function POST(request: NextRequest) {
    try {
        const { code, language, aspect } = await request.json();

        if (!code || !language || !aspect) {
            return NextResponse.json(
                { error: 'Code, language, and aspect are required' },
                { status: 400 }
            );
        }

        const improvedCode = await geminiService.improveQuality(code, language, aspect);

        return NextResponse.json({ code: improvedCode });
    } catch (error) {
        console.error('Error in improve-quality API:', error);
        return NextResponse.json(
            { error: 'Failed to improve code quality' },
            { status: 500 }
        );
    }
}
