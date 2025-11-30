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

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error in refactor API:', error);
        return NextResponse.json(
            { error: 'Failed to refactor code' },
            { status: 500 }
        );
    }
}
