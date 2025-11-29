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

        return NextResponse.json(explanation);
    } catch (error) {
        console.error('Error in explain API:', error);
        return NextResponse.json(
            { error: 'Failed to explain code' },
            { status: 500 }
        );
    }
}
