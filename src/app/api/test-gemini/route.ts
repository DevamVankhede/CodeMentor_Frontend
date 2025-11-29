import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function GET(request: NextRequest) {
    try {
        // Check if API key exists
        const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json({
                success: false,
                error: 'NEXT_PUBLIC_GEMINI_API_KEY is not set',
                hint: 'Add NEXT_PUBLIC_GEMINI_API_KEY to your .env.local file'
            }, { status: 500 });
        }

        console.log('✅ API Key found:', apiKey.substring(0, 10) + '...');

        // Try to initialize Gemini
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

        console.log('✅ Gemini model initialized');

        // Try a simple test
        console.log('📝 Sending test prompt...');
        const result = await model.generateContent('Say "Hello, CodeMentor!" in JSON format: {"message": "..."}');
        const response = result.response;
        const text = response.text();

        console.log('✅ Received response:', text);

        return NextResponse.json({
            success: true,
            message: 'Gemini AI is working correctly!',
            apiKeyStatus: 'Configured (first 10 chars: ' + apiKey.substring(0, 10) + '...)',
            model: 'gemini-2.5-pro',
            testResponse: text,
            timestamp: new Date().toISOString()
        });

    } catch (error: any) {
        console.error('❌ Gemini test failed:', error);

        return NextResponse.json({
            success: false,
            error: error.message,
            details: error.stack,
            hint: 'Check if your API key is valid and has access to Gemini 2.5 Pro'
        }, { status: 500 });
    }
}
