import { NextRequest, NextResponse } from 'next/server';
import { geminiService } from '@/lib/gemini';

export async function POST(request: NextRequest) {
    try {
        const { code, language } = await request.json();

        if (!code || !language) {
            return NextResponse.json(
                { error: 'Code and language are required' },
                { status: 400 }
            );
        }

        const analysis = await geminiService.analyzeCode(code, language);

        return NextResponse.json({
            success: true,
            quality: analysis.quality,
            bugs: analysis.bugs,
            suggestions: analysis.suggestions,
            score: analysis.quality.score,
        });
    } catch (error) {
        console.error('Error in code-quality API:', error);
        return NextResponse.json(
            {
                success: false,
                quality: {
                    score: 0,
                    readability: 0,
                    maintainability: 0,
                    performance: 0,
                },
                bugs: [],
                suggestions: ['Unable to analyze code quality at this time.'],
                score: 0,
            },
            { status: 200 }
        );
    }
}
