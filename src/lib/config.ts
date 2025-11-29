// Centralized configuration for the application

export const config = {
    // Gemini AI Configuration
    gemini: {
        apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || '',
        model: 'gemini-2.5-pro', // PRO MODEL - Best quality!
        maxRetries: 3,
        timeout: 30000, // 30 seconds
    },

    // API Configuration
    api: {
        baseUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        timeout: 10000,
    },

    // Authentication
    auth: {
        jwtSecret: process.env.JWT_SECRET || 'default-secret-change-in-production',
        tokenExpiry: '7d',
    },

    // Database
    database: {
        url: process.env.DATABASE_URL || '',
    },

    // Feature Flags
    features: {
        aiAnalysis: true,
        aiRefactor: true,
        aiExplain: true,
        aiGenerate: true,
        aiFixBugs: true,
        aiChat: true,
    },
};

// Validate required environment variables
export function validateConfig() {
    const errors: string[] = [];

    if (!config.gemini.apiKey) {
        errors.push('NEXT_PUBLIC_GEMINI_API_KEY is not set');
    }

    if (errors.length > 0) {
        console.warn('⚠️  Configuration warnings:');
        errors.forEach(error => console.warn(`   - ${error}`));
    }

    return errors.length === 0;
}

// Check if Gemini API is configured
export function isGeminiConfigured(): boolean {
    return !!config.gemini.apiKey && config.gemini.apiKey.length > 0;
}

// Get API key status (for debugging)
export function getApiKeyStatus(): string {
    if (!config.gemini.apiKey) {
        return '❌ Not configured';
    }
    if (config.gemini.apiKey.length < 20) {
        return '⚠️  Invalid key format';
    }
    return '✅ Configured';
}

export default config;
