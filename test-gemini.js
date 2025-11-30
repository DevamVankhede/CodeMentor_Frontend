const { GoogleGenerativeAI } = require('@google/generative-ai');

const API_KEY = 'AIzaSyDrTOl4IrjwQ-DIgIPlLT5o7XoL-I4RcKo';

async function testGemini() {
    console.log('Testing Gemini API...');
    console.log('API Key:', API_KEY.substring(0, 10) + '...');
    
    const genAI = new GoogleGenerativeAI(API_KEY);
    
    // Try different models
    const models = ['gemini-1.5-pro', 'gemini-pro', 'gemini-1.5-flash'];
    
    for (const modelName of models) {
        console.log(`\nTrying model: ${modelName}`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent('Say hello in one word');
            const response = await result.response;
            const text = response.text();
            console.log(`✅ ${modelName} WORKS! Response:`, text);
            return modelName; // Return the working model
        } catch (error) {
            console.log(`❌ ${modelName} failed:`, error.message);
        }
    }
    
    console.log('\n❌ No models worked!');
    return null;
}

testGemini().then(workingModel => {
    if (workingModel) {
        console.log(`\n✅ USE THIS MODEL: ${workingModel}`);
    }
    process.exit(0);
}).catch(error => {
    console.error('Test failed:', error);
    process.exit(1);
});
