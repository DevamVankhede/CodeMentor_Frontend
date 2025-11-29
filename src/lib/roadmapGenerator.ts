import { GoogleGenerativeAI } from '@google/generative-ai';
import { config, isGeminiConfigured } from './config';

export interface RoadmapData {
    title: string;
    description: string;
    duration: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    category: string;
    topics: string[];
    milestones: Array<{
        week: number;
        title: string;
        description: string;
        tasks: string[];
        resources: string[];
    }>;
    prerequisites: string[];
    learningOutcomes: string[];
    projects: Array<{
        title: string;
        description: string;
        difficulty: string;
    }>;
}

export class RoadmapGenerator {
    private model;
    private genAI;

    constructor() {
        // Get API key from environment
        const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || config.gemini.apiKey;

        if (!apiKey) {
            console.error('❌ Gemini API key not found. Please set NEXT_PUBLIC_GEMINI_API_KEY');
            throw new Error('Gemini API key is not configured');
        }

        console.log('✅ Initializing RoadmapGenerator with API key:', apiKey.substring(0, 10) + '...');

        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({
            model: 'gemini-2.5-pro',
            generationConfig: {
                temperature: 0.8,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 4096,
            }
        });
    }

    async generateRoadmap(
        topic: string,
        difficulty: 'beginner' | 'intermediate' | 'advanced',
        duration: string,
        goals?: string
    ): Promise<RoadmapData> {
        console.log('🚀 Generating roadmap for:', { topic, difficulty, duration, goals });

        const prompt = `You are a JSON generator. Create a learning roadmap for: ${topic}

Difficulty: ${difficulty}
Duration: ${duration}
${goals ? `Goals: ${goals}` : ''}

CRITICAL RULES:
1. Return ONLY valid JSON
2. NO markdown, NO code blocks, NO explanations
3. Ensure all arrays and objects are properly closed
4. Use double quotes for all strings
5. No trailing commas
6. Escape special characters in strings

Generate this EXACT JSON structure (8-10 milestones):
{
  "title": "Complete roadmap title",
  "description": "What the learner will achieve",
  "duration": "${duration}",
  "difficulty": "${difficulty}",
  "category": "Category name",
  "topics": ["topic1", "topic2", "topic3", "topic4", "topic5"],
  "milestones": [
    {
      "week": 1,
      "title": "Week 1 milestone",
      "description": "What to learn this week",
      "tasks": ["task1", "task2", "task3"],
      "resources": ["resource1", "resource2"]
    }
  ],
  "prerequisites": ["prerequisite1", "prerequisite2"],
  "learningOutcomes": ["outcome1", "outcome2", "outcome3"],
  "projects": [
    {
      "title": "Project name",
      "description": "Project description",
      "difficulty": "beginner"
    }
  ]
}

Return ONLY the JSON. Start with { and end with }. No other text.`;

        try {
            console.log('📝 Sending prompt to Gemini AI...');
            const result = await this.model.generateContent(prompt);
            const response = result.response;
            const text = response.text();
            console.log('✅ Received response from Gemini AI');
            console.log('Response preview:', text.substring(0, 200));

            // Extract JSON from markdown code blocks - handle multiple formats
            let jsonText = text;

            // Try different markdown code block patterns
            const patterns = [
                /```json\s*\n([\s\S]*?)\n```/,  // ```json\n...\n```
                /```json\s*([\s\S]*?)```/,       // ```json...```
                /```\s*\n([\s\S]*?)\n```/,       // ```\n...\n```
                /```\s*([\s\S]*?)```/,            // ```...```
                /\{[\s\S]*\}/                     // Just find JSON object
            ];

            for (const pattern of patterns) {
                const match = text.match(pattern);
                if (match) {
                    jsonText = match[1] || match[0];
                    console.log('✅ Extracted JSON using pattern:', pattern.source);
                    break;
                }
            }

            // Clean up the JSON text
            jsonText = jsonText.trim();

            // Remove any remaining markdown artifacts
            jsonText = jsonText.replace(/^```json\s*/g, '').replace(/^```\s*/g, '').replace(/```$/g, '');

            console.log('🔍 Parsing JSON response...');
            console.log('JSON preview:', jsonText.substring(0, 300));
            console.log('JSON length:', jsonText.length);

            // Try to parse JSON
            let roadmapData: RoadmapData;
            try {
                roadmapData = JSON.parse(jsonText);
            } catch (parseError: any) {
                console.error('❌ JSON parse error:', parseError.message);
                console.error('Error at position:', parseError.message.match(/position (\d+)/)?.[1]);

                // Try to fix common JSON issues
                console.log('🔧 Attempting to repair JSON...');
                let repairedJson = jsonText;

                // Fix trailing commas
                repairedJson = repairedJson.replace(/,(\s*[}\]])/g, '$1');

                // Fix missing commas between array elements
                repairedJson = repairedJson.replace(/"\s*\n\s*"/g, '",\n"');

                // Fix missing commas between object properties
                repairedJson = repairedJson.replace(/"\s*\n\s*"/g, '",\n"');

                // Try parsing again
                try {
                    roadmapData = JSON.parse(repairedJson);
                    console.log('✅ JSON repaired and parsed successfully');
                } catch (repairError) {
                    // If repair fails, log the problematic area
                    const position = parseInt(parseError.message.match(/position (\d+)/)?.[1] || '0');
                    const start = Math.max(0, position - 100);
                    const end = Math.min(jsonText.length, position + 100);
                    console.error('Problematic JSON area:', jsonText.substring(start, end));
                    throw parseError; // Throw original error
                }
            }

            console.log('✅ Roadmap generated successfully:', roadmapData.title);
            return roadmapData;
        } catch (error: any) {
            console.error('❌ Error generating roadmap:', error);
            console.error('Error details:', {
                message: error.message,
                stack: error.stack,
                name: error.name
            });

            // Try a simpler prompt as fallback
            console.log('🔄 Attempting with simplified prompt...');
            try {
                const simplePrompt = `Create a ${difficulty} level learning roadmap for "${topic}" lasting ${duration}. Return ONLY valid JSON with this structure:
{
  "title": "roadmap title",
  "description": "brief description",
  "duration": "${duration}",
  "difficulty": "${difficulty}",
  "category": "category",
  "topics": ["topic1", "topic2", "topic3"],
  "milestones": [{"week": 1, "title": "title", "description": "desc", "tasks": ["task1"], "resources": ["resource1"]}],
  "prerequisites": ["prereq1"],
  "learningOutcomes": ["outcome1"],
  "projects": [{"title": "project", "description": "desc", "difficulty": "beginner"}]
}
Return only JSON, no markdown.`;

                const result = await this.model.generateContent(simplePrompt);
                const response = result.response;
                const text = response.text();

                // Extract and clean JSON
                let jsonText = text.trim();
                const jsonMatch = text.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    jsonText = jsonMatch[0];
                }

                jsonText = jsonText.replace(/```json\s*/g, '').replace(/```\s*/g, '');
                jsonText = jsonText.replace(/,(\s*[}\]])/g, '$1'); // Remove trailing commas

                const roadmapData: RoadmapData = JSON.parse(jsonText);
                console.log('✅ Roadmap generated with simplified prompt');
                return roadmapData;
            } catch (fallbackError) {
                console.error('❌ Fallback also failed:', fallbackError);
                throw new Error(`Failed to generate roadmap: ${error.message}. Please try again with a simpler topic or shorter duration.`);
            }
        }
    }

    generateTextFile(roadmap: RoadmapData): string {
        let content = `
╔════════════════════════════════════════════════════════════════════════════╗
║                         LEARNING ROADMAP                                    ║
║                    Generated by CodeMentor AI                               ║
╚════════════════════════════════════════════════════════════════════════════╝

📚 ${roadmap.title}
${'='.repeat(roadmap.title.length + 3)}

📝 Description:
${roadmap.description}

⏱️  Duration: ${roadmap.duration}
🎯 Difficulty: ${roadmap.difficulty.toUpperCase()}
📂 Category: ${roadmap.category}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 PREREQUISITES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${roadmap.prerequisites.map((p, i) => `${i + 1}. ${p}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎓 LEARNING OUTCOMES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${roadmap.learningOutcomes.map((o, i) => `✓ ${o}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 KEY TOPICS COVERED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${roadmap.topics.map((t, i) => `• ${t}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🗓️  WEEKLY MILESTONES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

`;

        roadmap.milestones.forEach((milestone) => {
            content += `
┌─────────────────────────────────────────────────────────────────────────┐
│ Week ${milestone.week}: ${milestone.title}
└─────────────────────────────────────────────────────────────────────────┘

📖 ${milestone.description}

✅ Tasks:
${milestone.tasks.map((t, i) => `   ${i + 1}. ${t}`).join('\n')}

📚 Resources:
${milestone.resources.map((r, i) => `   • ${r}`).join('\n')}

`;
        });

        content += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 HANDS-ON PROJECTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

`;

        roadmap.projects.forEach((project, i) => {
            content += `
${i + 1}. ${project.title} [${project.difficulty}]
   ${project.description}

`;
        });

        content += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 TIPS FOR SUCCESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Practice consistently - dedicate time daily
• Build projects to reinforce learning
• Join communities and collaborate with others
• Don't rush - understanding is more important than speed
• Review and revise previous topics regularly
• Ask questions and seek help when stuck
• Document your learning journey
• Celebrate small wins along the way

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Generated by CodeMentor AI - Your Personal Learning Companion
Date: ${new Date().toLocaleDateString()}

Good luck on your learning journey! 🎉
`;

        return content;
    }

    downloadRoadmap(roadmap: RoadmapData, filename?: string) {
        const content = this.generateTextFile(roadmap);
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename || `${roadmap.title.replace(/\s+/g, '_')}_Roadmap.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
}

export const roadmapGenerator = new RoadmapGenerator();
