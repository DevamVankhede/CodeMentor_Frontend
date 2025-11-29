import { NextRequest, NextResponse } from 'next/server';
import { geminiService } from '@/lib/gemini';

export async function POST(request: NextRequest) {
    try {
        const { code, language, context } = await request.json();

        if (!code || !language) {
            return NextResponse.json(
                {
                    error: 'Code and language are required',
                    suggestions: 'Please provide valid code to analyze.'
                },
                { status: 400 }
            );
        }

        // Analyze the code using Gemini
        const analysis = await geminiService.analyzeCode(code, language);

        // Format response for PerfectAICodeEditor
        const response = {
            success: true,
            suggestions: formatSuggestions(analysis),
            diagnostics: formatDiagnostics(analysis.bugs),
            quality: analysis.quality,
            context: context || 'Code analysis',
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error in analyze-code API:', error);

        // Return a user-friendly error response
        return NextResponse.json(
            {
                success: false,
                suggestions: '⚡ **Analysis Ready**\n\nI\'m ready to analyze your code! Keep typing and I\'ll provide insights automatically.',
                diagnostics: [],
                quality: {
                    score: 0,
                    readability: 0,
                    maintainability: 0,
                    performance: 0,
                },
            },
            { status: 200 } // Return 200 to prevent error in UI
        );
    }
}

function formatSuggestions(analysis: any): string {
    let suggestions = '## 📊 Code Analysis\n\n';

    // Quality Score
    if (analysis.quality) {
        suggestions += `**Overall Quality:** ${analysis.quality.score}/100\n\n`;
        suggestions += `- 📖 Readability: ${analysis.quality.readability}/100\n`;
        suggestions += `- 🔧 Maintainability: ${analysis.quality.maintainability}/100\n`;
        suggestions += `- ⚡ Performance: ${analysis.quality.performance}/100\n\n`;
    }

    // Bugs
    if (analysis.bugs && analysis.bugs.length > 0) {
        suggestions += `### 🐛 Issues Found (${analysis.bugs.length})\n\n`;
        analysis.bugs.forEach((bug: any, index: number) => {
            const emoji = bug.severity === 'high' ? '🔴' : bug.severity === 'medium' ? '🟡' : '🔵';
            suggestions += `${emoji} **Line ${bug.line}** (${bug.severity})\n`;
            suggestions += `   ${bug.description}\n`;
            suggestions += `   💡 ${bug.suggestion}\n\n`;
        });
    }

    // Suggestions
    if (analysis.suggestions && analysis.suggestions.length > 0) {
        suggestions += `### 💡 Suggestions\n\n`;
        analysis.suggestions.forEach((suggestion: string, index: number) => {
            suggestions += `${index + 1}. ${suggestion}\n`;
        });
    }

    return suggestions;
}

function formatDiagnostics(bugs: any[]): any[] {
    if (!bugs || bugs.length === 0) return [];

    return bugs.map((bug) => ({
        lineNumber: bug.line,
        column: 1,
        endLineNumber: bug.line,
        endColumn: 100,
        message: bug.description,
        severity: bug.severity.toUpperCase(),
    }));
}
