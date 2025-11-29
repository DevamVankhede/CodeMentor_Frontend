'use client';
import React from 'react';
import Navigation from '@/components/layout/Navigation';
import APIStatus from '@/components/admin/APIStatus';
import Card, { CardContent } from '@/components/ui/Card';
import { Settings, Key, Code2 } from 'lucide-react';

export default function APIConfigPage() {
    return (
        <div className="min-h-screen bg-[#0a0118]">
            <Navigation />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                            <Settings className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">API Configuration</h1>
                            <p className="text-white/60">Manage and monitor your API integrations</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* API Status */}
                    <div className="lg:col-span-2">
                        <APIStatus />
                    </div>

                    {/* Quick Guide */}
                    <div className="space-y-6">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Key className="w-5 h-5 text-primary-500" />
                                    <h3 className="text-lg font-bold text-text-primary">Setup Guide</h3>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-sm font-semibold text-text-primary mb-2">1. Get API Key</h4>
                                        <p className="text-xs text-text-secondary mb-2">
                                            Visit Google AI Studio to get your Gemini API key
                                        </p>
                                        <a
                                            href="https://makersuite.google.com/app/apikey"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-primary-500 hover:underline"
                                        >
                                            Get API Key →
                                        </a>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-semibold text-text-primary mb-2">2. Add to .env.local</h4>
                                        <div className="bg-slate-950 rounded p-3 font-mono text-xs text-slate-300">
                                            NEXT_PUBLIC_GEMINI_API_KEY=your_key_here
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-semibold text-text-primary mb-2">3. Restart Server</h4>
                                        <div className="bg-slate-950 rounded p-3 font-mono text-xs text-slate-300">
                                            npm run dev
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Code2 className="w-5 h-5 text-blue-500" />
                                    <h3 className="text-lg font-bold text-text-primary">Documentation</h3>
                                </div>

                                <div className="space-y-2 text-sm">
                                    <a href="/ai-editor" className="block text-primary-500 hover:underline">
                                        → AI Editor
                                    </a>
                                    <a href="#" className="block text-text-secondary hover:text-text-primary">
                                        → API Reference
                                    </a>
                                    <a href="#" className="block text-text-secondary hover:text-text-primary">
                                        → Setup Guide
                                    </a>
                                    <a href="#" className="block text-text-secondary hover:text-text-primary">
                                        → Troubleshooting
                                    </a>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
