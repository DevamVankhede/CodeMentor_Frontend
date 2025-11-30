import { NextRequest, NextResponse } from 'next/server';
import { geminiService } from '@/lib/gemini';

export async function POST(request: NextRequest) {
    try {
        const { description, language } = await request.json();

        if (!description || !language) {
            return NextResponse.json(
                { error: 'Description and language are required' },
                { status: 400 }
            );
        }

        const code = await geminiService.generateCode(description, language);

        return NextResponse.json({ code });
    } catch (error) {
        console.error('Error in generate API:', error);
        return NextResponse.json(
            { error: 'Failed to generate code' },
            { status: 500 }
        );
    }
}
