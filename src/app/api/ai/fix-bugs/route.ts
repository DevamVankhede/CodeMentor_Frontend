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

        const fixedCode = await geminiService.fixBugs(code, language);

        return NextResponse.json({ code: fixedCode });
    } catch (error) {
        console.error('Error in fix-bugs API:', error);
        return NextResponse.json(
            { error: 'Failed to fix bugs' },
            { status: 500 }
        );
    }
}
