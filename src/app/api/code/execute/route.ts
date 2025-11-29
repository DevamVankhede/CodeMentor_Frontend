import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { code, language, version } = await request.json();

        if (!code || !language) {
            return NextResponse.json(
                { error: 'Code and language are required' },
                { status: 400 }
            );
        }

        // For now, return mock execution results
        // In production, this would call a code execution service like Judge0, Piston, or similar
        const mockResults = getMockExecutionResult(code, language);

        return NextResponse.json(mockResults);
    } catch (error: any) {
        console.error('Code execution error:', error);
        return NextResponse.json(
            { error: 'Failed to execute code', details: error.message },
            { status: 500 }
        );
    }
}

function getMockExecutionResult(code: string, language: string) {
    const startTime = Date.now();
    let output = '';
    let error = '';

    try {
        switch (language) {
            case 'python':
                // Extract print statements
                const pythonPrints = code.match(/print\((.*?)\)/g);
                if (pythonPrints) {
                    output = pythonPrints
                        .map(p => p.replace(/print\(|\)/g, '').replace(/['"]/g, ''))
                        .join('\n');
                }
                break;

            case 'java':
                const javaPrints = code.match(/System\.out\.println\((.*?)\)/g);
                if (javaPrints) {
                    output = javaPrints
                        .map(p => p.replace(/System\.out\.println\(|\)/g, '').replace(/['"]/g, ''))
                        .join('\n');
                }
                break;

            case 'cpp':
                const cppCouts = code.match(/cout\s*<<\s*(.*?)\s*;/g);
                if (cppCouts) {
                    output = cppCouts
                        .map(c => c.replace(/cout\s*<<\s*|;/g, '').replace(/['"]/g, '').replace(/endl/g, ''))
                        .join('\n');
                }
                break;

            case 'csharp':
                const csharpPrints = code.match(/Console\.WriteLine\((.*?)\)/g);
                if (csharpPrints) {
                    output = csharpPrints
                        .map(p => p.replace(/Console\.WriteLine\(|\)/g, '').replace(/['"]/g, ''))
                        .join('\n');
                }
                break;

            case 'go':
                const goPrints = code.match(/fmt\.Println\((.*?)\)/g);
                if (goPrints) {
                    output = goPrints
                        .map(p => p.replace(/fmt\.Println\(|\)/g, '').replace(/['"]/g, ''))
                        .join('\n');
                }
                break;

            case 'rust':
                const rustPrints = code.match(/println!\((.*?)\)/g);
                if (rustPrints) {
                    output = rustPrints
                        .map(p => p.replace(/println!\(|\)/g, '').replace(/['"]/g, ''))
                        .join('\n');
                }
                break;

            case 'php':
                const phpEchos = code.match(/echo\s+(.*?);/g);
                if (phpEchos) {
                    output = phpEchos
                        .map(e => e.replace(/echo\s+|;/g, '').replace(/['"]/g, ''))
                        .join('\n');
                }
                break;

            case 'ruby':
                const rubyPuts = code.match(/puts\s+(.*?)$/gm);
                if (rubyPuts) {
                    output = rubyPuts
                        .map(p => p.replace(/puts\s+/g, '').replace(/['"]/g, ''))
                        .join('\n');
                }
                break;

            default:
                output = 'Code executed successfully';
        }

        if (!output) {
            output = 'Code executed successfully (no output)';
        }
    } catch (err: any) {
        error = err.message;
    }

    const executionTime = Date.now() - startTime;

    return {
        output,
        error,
        executionTime,
        language,
        status: error ? 'error' : 'success',
    };
}
