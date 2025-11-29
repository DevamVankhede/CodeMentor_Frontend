const { GoogleGenerativeAI } = require('@google/generative-ai');

const NEW_KEY = 'AIzaSyB-w-umIkbFVmGN0EqsTpyftgdmtICOUNc';

async function testNewKey() {
    console.log('Testing new API key...\n');
    
    const genAI = new GoogleGenerativeAI(NEW_KEY);
    
    // Test with gemini-2.5-flash
    try {
        console.log('Testing gemini-2.5-flash...');
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const result = await model.generateContent('Say hello and explain what you can do in 2 sentences.');
        const response = await result.response;
        const text = response.text();
        console.log('✅ SUCCESS with gemini-2.5-flash!');
        console.log('Response:', text);
        console.log('\n🎉 This key works perfectly!\n');
        return true;
    } catch (error) {
        console.log('❌ Failed:', error.message);
        return false;
    }
}

testNewKey().then(success => {
    if (success) {
        console.log('✅ UPDATE YOUR .env.local WITH THIS KEY!');
        console.log('NEXT_PUBLIC_GEMINI_API_KEY=AIzaSyB-w-umIkbFVmGN0EqsTpyftgdmtICOUNc');
    }
    process.exit(0);
});
