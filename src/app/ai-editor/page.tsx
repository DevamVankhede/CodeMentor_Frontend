'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/layout/Navigation';
import AICodeEditor from '@/components/editor/AICodeEditor';
import Card, { CardContent } from '@/components/ui/Card';
import { Sparkles, Code2 } from 'lucide-react';

export default function AIEditorPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuth();
    const [selectedLanguage, setSelectedLanguage] = useState('python');

    // Redirect to sign-in if not authenticated
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/signin');
        }
    }, [isAuthenticated, isLoading, router]);

    // Show loading state while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0a0118] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    // Don't render the page if not authenticated
    if (!isAuthenticated) {
        return null;
    }

    const languages = [
        { id: 'python', name: 'Python', icon: '🐍' },
        { id: 'javascript', name: 'JavaScript', icon: '🟨' },
        { id: 'typescript', name: 'TypeScript', icon: '🔷' },
        { id: 'java', name: 'Java', icon: '☕' },
        { id: 'cpp', name: 'C++', icon: '⚡' },
        { id: 'go', name: 'Go', icon: '🐹' },
    ];

    const sampleCode: Record<string, string> = {
        python: `# Load and analyze data
def analyze_sales_data(file_path):
    # Read CSV data
    df = pd.read_csv(file_path)
    
    # Basic statistics
    print("Dataset Info:")
    print(f"Shape: {df.shape}")
    print(f"Columns: {list(df.columns)}")
    
    # Clean data
    df = df.dropna()
    
    return df`,
        javascript: `// Calculate sum of array
function calculateSum(arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum;
}

// Usage
const numbers = [1, 2, 3, 4, 5];
console.log(calculateSum(numbers));`,
        typescript: `interface User {
  id: number;
  name: string;
  email: string;
}

function getUserById(users: User[], id: number): User | undefined {
  return users.find(user => user.id === id);
}`,
        java: `public class Calculator {
    public static int add(int a, int b) {
        return a + b;
    }
    
    public static void main(String[] args) {
        int result = add(5, 3);
        System.out.println("Result: " + result);
    }
}`,
        cpp: `#include <iostream>
#include <vector>

int findMax(std::vector<int>& arr) {
    int max = arr[0];
    for (int i = 1; i < arr.size(); i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }
    return max;
}`,
        go: `package main

import "fmt"

func fibonacci(n int) int {
    if n <= 1 {
        return n
    }
    return fibonacci(n-1) + fibonacci(n-2)
}

func main() {
    fmt.Println(fibonacci(10))
}`
    };

    return (
        <div className="min-h-screen bg-[#0a0118]">
            <Navigation />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-3">
                        AI-Powered Code Editor
                    </h1>
                    <p className="text-white/70 text-lg max-w-2xl mx-auto">
                        Analyze, refactor, and improve your code with the power of Gemini AI
                    </p>
                </div>

                {/* Language Selector */}
                <Card className="mb-6">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Code2 className="w-5 h-5 text-primary-500" />
                            <h3 className="text-lg font-bold text-text-primary">Select Language</h3>
                        </div>
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                            {languages.map((lang) => (
                                <button
                                    key={lang.id}
                                    onClick={() => setSelectedLanguage(lang.id)}
                                    className={`p-4 rounded-lg border-2 transition-all ${selectedLanguage === lang.id
                                        ? 'border-primary-500 bg-primary-500/10'
                                        : 'border-border hover:border-primary-500/50'
                                        }`}
                                >
                                    <div className="text-2xl mb-1">{lang.icon}</div>
                                    <div className="text-sm font-medium text-text-primary">{lang.name}</div>
                                </button>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* AI Code Editor */}
                <AICodeEditor
                    key={selectedLanguage}
                    initialCode={sampleCode[selectedLanguage]}
                    language={selectedLanguage}
                />

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <Card>
                        <CardContent className="p-6 text-center">
                            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Sparkles className="w-6 h-6 text-blue-400" />
                            </div>
                            <h3 className="text-lg font-bold text-text-primary mb-2">Smart Analysis</h3>
                            <p className="text-sm text-text-secondary">
                                Get detailed insights about code quality, bugs, and improvements
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6 text-center">
                            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Code2 className="w-6 h-6 text-green-400" />
                            </div>
                            <h3 className="text-lg font-bold text-text-primary mb-2">Auto Refactor</h3>
                            <p className="text-sm text-text-secondary">
                                Automatically improve code structure and readability
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6 text-center">
                            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Sparkles className="w-6 h-6 text-purple-400" />
                            </div>
                            <h3 className="text-lg font-bold text-text-primary mb-2">Bug Detection</h3>
                            <p className="text-sm text-text-secondary">
                                Find and fix bugs automatically with AI assistance
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
