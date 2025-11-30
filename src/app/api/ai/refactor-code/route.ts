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

        const result = await geminiService.refactorCode(code, language);

        return NextResponse.json({
            success: true,
            refactoredCode: result.refactoredCode,
            improvements: result.improvements,
            explanation: result.explanation,
        });
    } catch (error) {
        console.error('Error in refactor-code API:', error);
        return NextResponse.json(
            {
                success: false,
                refactoredCode: code,
                improvements: [],
                explanation: 'Unable to refactor code at this time. Please try again.',
            },
            { status: 200 }
        );
    }
}
