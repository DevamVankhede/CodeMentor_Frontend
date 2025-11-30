import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    try {
        // Test both HTTP and HTTPS endpoints
        const endpoints = [
            `${backendUrl}/api/health`,
            `${backendUrl}/health`,
            `${backendUrl}/api/test`,
            `${backendUrl}/`,
        ];

        const results = await Promise.allSettled(
            endpoints.map(async (url) => {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000);

                try {
                    const response = await fetch(url, {
                        signal: controller.signal,
                        headers: { 'Accept': 'application/json' }
                    });
                    clearTimeout(timeoutId);

                    return {
                        url,
                        status: response.status,
                        ok: response.ok,
                        statusText: response.statusText,
                    };
                } catch (error: any) {
                    clearTimeout(timeoutId);
                    return {
                        url,
                        status: 0,
                        ok: false,
                        error: error.message,
                    };
                }
            })
        );

        const successfulConnection = results.find(
            (result) => result.status === 'fulfilled' && result.value.ok
        );

        if (successfulConnection && successfulConnection.status === 'fulfilled') {
            return NextResponse.json({
                success: true,
                message: 'Backend is reachable',
                endpoint: successfulConnection.value.url,
                status: successfulConnection.value.status,
                allResults: results,
            });
        }

        return NextResponse.json({
            success: false,
            message: 'Backend is not reachable. Please ensure the .NET backend is running on http://localhost:5000 or https://localhost:7000',
            backendUrl,
            allResults: results,
            instructions: [
                '1. Start the .NET backend server',
                '2. Verify it\'s running on http://localhost:5000 or https://localhost:7000',
                '3. Check NEXT_PUBLIC_API_URL in .env.local',
                '4. Ensure CORS is configured in the backend',
            ],
        }, { status: 503 });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: 'Error testing backend connection',
            error: error.message,
            backendUrl,
        }, { status: 500 });
    }
}
