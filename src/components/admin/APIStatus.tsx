'use client';
import React, { useEffect, useState } from 'react';
import Card, { CardContent } from '@/components/ui/Card';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import Button from '@/components/ui/Button';

interface HealthStatus {
    status: string;
    timestamp: string;
    services: {
        gemini: {
            configured: boolean;
            status: string;
            model: string;
        };
        api: {
            baseUrl: string;
        };
        features: Record<string, boolean>;
    };
}

export default function APIStatus() {
    const [health, setHealth] = useState<HealthStatus | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchHealth = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/health');
            const data = await response.json();
            setHealth(data);
        } catch (error) {
            console.error('Error fetching health status:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHealth();
    }, []);

    const getStatusIcon = (status: string) => {
        if (status.includes('✅')) return <CheckCircle className="w-5 h-5 text-green-400" />;
        if (status.includes('⚠️')) return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
        return <XCircle className="w-5 h-5 text-red-400" />;
    };

    const getStatusColor = (status: string) => {
        if (status.includes('✅')) return 'text-green-400';
        if (status.includes('⚠️')) return 'text-yellow-400';
        return 'text-red-400';
    };

    if (loading) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center justify-center">
                        <RefreshCw className="w-6 h-6 animate-spin text-primary-500" />
                        <span className="ml-2 text-text-secondary">Checking API status...</span>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!health) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="text-center">
                        <XCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
                        <p className="text-text-secondary">Failed to load API status</p>
                        <Button onClick={fetchHealth} className="mt-4" size="sm">
                            Retry
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-text-primary">API Configuration Status</h3>
                    <Button onClick={fetchHealth} size="sm" variant="outline" leftIcon={<RefreshCw className="w-4 h-4" />}>
                        Refresh
                    </Button>
                </div>

                {/* Gemini AI Status */}
                <div className="mb-6">
                    <h4 className="text-lg font-semibold text-text-primary mb-3">Gemini AI</h4>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
                            <div className="flex items-center gap-3">
                                {getStatusIcon(health.services.gemini.status)}
                                <div>
                                    <p className="text-text-primary font-medium">API Key</p>
                                    <p className="text-sm text-text-tertiary">Configuration status</p>
                                </div>
                            </div>
                            <span className={`font-semibold ${getStatusColor(health.services.gemini.status)}`}>
                                {health.services.gemini.status}
                            </span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
                            <div>
                                <p className="text-text-primary font-medium">Model</p>
                                <p className="text-sm text-text-tertiary">AI model in use</p>
                            </div>
                            <span className="text-primary-500 font-mono text-sm">{health.services.gemini.model}</span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
                            <div>
                                <p className="text-text-primary font-medium">Configured</p>
                                <p className="text-sm text-text-tertiary">Ready to use</p>
                            </div>
                            {health.services.gemini.configured ? (
                                <CheckCircle className="w-5 h-5 text-green-400" />
                            ) : (
                                <XCircle className="w-5 h-5 text-red-400" />
                            )}
                        </div>
                    </div>
                </div>

                {/* Features Status */}
                <div className="mb-6">
                    <h4 className="text-lg font-semibold text-text-primary mb-3">AI Features</h4>
                    <div className="grid grid-cols-2 gap-3">
                        {Object.entries(health.services.features).map(([feature, enabled]) => (
                            <div key={feature} className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
                                <span className="text-text-primary text-sm capitalize">
                                    {feature.replace(/([A-Z])/g, ' $1').trim()}
                                </span>
                                {enabled ? (
                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                ) : (
                                    <XCircle className="w-4 h-4 text-red-400" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* API Info */}
                <div>
                    <h4 className="text-lg font-semibold text-text-primary mb-3">API Information</h4>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
                            <span className="text-text-secondary text-sm">Base URL</span>
                            <span className="text-text-primary font-mono text-sm">{health.services.api.baseUrl}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
                            <span className="text-text-secondary text-sm">Last Check</span>
                            <span className="text-text-primary text-sm">
                                {new Date(health.timestamp).toLocaleTimeString()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Warning if not configured */}
                {!health.services.gemini.configured && (
                    <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-yellow-400 font-semibold mb-1">Gemini API Not Configured</p>
                                <p className="text-sm text-text-secondary mb-2">
                                    Add your Gemini API key to enable AI features.
                                </p>
                                <ol className="text-sm text-text-secondary space-y-1 list-decimal list-inside">
                                    <li>Get your API key from Google AI Studio</li>
                                    <li>Add it to .env.local as NEXT_PUBLIC_GEMINI_API_KEY</li>
                                    <li>Restart the development server</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
