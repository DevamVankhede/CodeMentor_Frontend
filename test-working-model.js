const { GoogleGenerativeAI } = require('@google/generative-ai');

const API_KEY = 'AIzaSyDrTOl4IrjwQ-DIgIPlLT5o7XoL-I4RcKo';

async function testModel() {
    console.log('Testing gemini-2.5-flash...\n');
    
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    try {
        const result = await model.generateContent('Explain what a for loop does in programming in one sentence.');
        const response = await result.response;
        const text = response.text();
        console.log('✅ SUCCESS! AI Response:');
        console.log(text);
        console.log('\n🎉 gemini-2.5-flash works perfectly!');
    } catch (error) {
        console.log('❌ Error:', error.message);
    }
}

testModel();
