const { GoogleGenerativeAI } = require('@google/generative-ai');

const API_KEY = 'AIzaSyB-w-umIkbFVmGN0EqsTpyftgdmtICOUNc';

async function testAnalyze() {
    console.log('Testing code analysis with gemini-2.5-pro...\n');
    
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ 
        model: 'gemini-2.5-pro',
        generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
        }
    });
    
    const code = `def calculate_sum(numbers):
    total = 0
    for num in numbers:
        total += num
    return total`;
    
    const prompt = `Analyze this python code and provide a detailed analysis in JSON format:

Code:
\`\`\`python
${code}
\`\`\`

Provide the response in this exact JSON format:
{
  "bugs": [
    {
      "line": <line_number>,
      "severity": "low|medium|high",
      "description": "bug description",
      "suggestion": "how to fix"
    }
  ],
  "quality": {
    "score": <0-100>,
    "readability": <0-100>,
    "maintainability": <0-100>,
    "performance": <0-100>
  },
  "suggestions": ["suggestion 1", "suggestion 2"]
}`;
    
    try {
        console.log('Sending request to Gemini...');
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        console.log('\n✅ SUCCESS! Raw response:');
        console.log(text);
        
        // Try to parse JSON
        const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
        const jsonText = jsonMatch ? jsonMatch[1] : text;
        
        console.log('\n📊 Parsed JSON:');
        const parsed = JSON.parse(jsonText);
        console.log(JSON.stringify(parsed, null, 2));
        
        console.log('\n🎉 Analysis works perfectly!');
    } catch (error) {
        console.log('\n❌ Error:', error.message);
    }
}

testAnalyze();
