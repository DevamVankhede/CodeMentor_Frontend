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

        const explanation = await geminiService.explainCode(code, language);

        return NextResponse.json({
            success: true,
            explanation: explanation.explanation,
            keyPoints: explanation.keyPoints,
            complexity: explanation.complexity,
        });
    } catch (error) {
        console.error('Error in explain-code API:', error);
        return NextResponse.json(
            {
                success: false,
                explanation: 'Unable to explain code at this time. Please try again.',
                keyPoints: [],
                complexity: 'beginner',
            },
            { status: 200 }
        );
    }
}
