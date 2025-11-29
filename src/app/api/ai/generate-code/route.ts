import { NextRequest, NextResponse } from 'next/server';
import { geminiService } from '@/lib/gemini';

export async function POST(request: NextRequest) {
    try {
        const { prompt, language } = await request.json();

        if (!prompt || !language) {
            return NextResponse.json(
                { error: 'Prompt and language are required' },
                { status: 400 }
            );
        }

        const code = await geminiService.generateCode(prompt, language);

        return NextResponse.json({
            success: true,
            code: code,
            language: language,
        });
    } catch (error) {
        console.error('Error in generate-code API:', error);
        return NextResponse.json(
            {
                success: false,
                code: `// Unable to generate code at this time.\n// Please try again or rephrase your request.`,
                language: language,
            },
            { status: 200 }
        );
    }
}
