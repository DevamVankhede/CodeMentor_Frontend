const { GoogleGenerativeAI } = require('@google/generative-ai');

const API_KEY = 'AIzaSyDrTOl4IrjwQ-DIgIPlLT5o7XoL-I4RcKo';

async function listModels() {
    console.log('Listing available Gemini models...\n');
    
    const genAI = new GoogleGenerativeAI(API_KEY);
    
    try {
        // Try to list models
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`
        );
        
        if (!response.ok) {
            console.log('❌ API Key might be invalid or expired');
            console.log('Status:', response.status, response.statusText);
            const text = await response.text();
            console.log('Response:', text);
            return;
        }
        
        const data = await response.json();
        console.log('✅ Available models:');
        data.models.forEach(model => {
            console.log(`  - ${model.name}`);
            console.log(`    Supported methods: ${model.supportedGenerationMethods.join(', ')}`);
        });
    } catch (error) {
        console.error('Error:', error.message);
    }
}

listModels();
