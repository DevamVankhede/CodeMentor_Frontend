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

        return NextResponse.json(analysis);
    } catch (error) {
        console.error('Error in analyze API:', error);
        return NextResponse.json(
            { error: 'Failed to analyze code' },
            { status: 500 }
        );
    }
}
