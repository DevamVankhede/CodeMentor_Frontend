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
            bugs: analysis.bugs || [],
            suggestions: analysis.suggestions || [],
        });
    } catch (error) {
        console.error('Error in find-bugs API:', error);
        return NextResponse.json(
            {
                success: false,
                bugs: [],
                suggestions: ['Unable to analyze code at this time. Please try again.']
            },
            { status: 200 }
        );
    }
}
