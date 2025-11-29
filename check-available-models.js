const { GoogleGenerativeAI } = require('@google/generative-ai');

const API_KEY = 'AIzaSyB-w-umIkbFVmGN0EqsTpyftgdmtICOUNc';

async function checkModels() {
    console.log('Checking available models with your API key...\n');
    
    const genAI = new GoogleGenerativeAI(API_KEY);
    
    // Test different models
    const modelsToTest = [
        'gemini-2.5-pro',
        'gemini-pro-latest',
        'gemini-2.5-flash',
        'gemini-2.0-flash',
    ];
    
    console.log('Testing models:\n');
    
    for (const modelName of modelsToTest) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent('Say "works" in one word');
            const response = await result.response;
            const text = response.text();
            
            const isPro = modelName.includes('pro');
            const emoji = isPro ? '🌟' : '⚡';
            console.log(`${emoji} ${modelName}: ✅ WORKS ${isPro ? '(PRO MODEL!)' : '(Flash model)'}`);
        } catch (error) {
            console.log(`❌ ${modelName}: Failed`);
        }
    }
    
    console.log('\n📊 Recommendation:');
    console.log('- Use gemini-2.5-pro for best quality (slower, more capable)');
    console.log('- Use gemini-2.5-flash for speed (faster, good quality)');
}

checkModels();
