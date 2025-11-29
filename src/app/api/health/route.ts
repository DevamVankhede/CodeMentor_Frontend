import { NextResponse } from 'next/server';
import { isGeminiConfigured, getApiKeyStatus, config } from '@/lib/config';

export async function GET() {
    const status = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        services: {
            gemini: {
                configured: isGeminiConfigured(),
                status: getApiKeyStatus(),
                model: config.gemini.model,
            },
            api: {
                baseUrl: config.api.baseUrl,
            },
            features: config.features,
        },
    };

    return NextResponse.json(status);
}
