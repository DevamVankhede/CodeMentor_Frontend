'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Code2, Mail, Lock, Github, Chrome } from 'lucide-react';
import Link from 'next/link';

export default function SignInPage() {
    const router = useRouter();
    const { login, loginWithGoogle, loginWithGitHub, isAuthenticated, isLoading } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Redirect if already authenticated
    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            router.push('/dashboard');
        }
    }, [isAuthenticated, isLoading, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            router.push('/dashboard');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await loginWithGoogle();
        } catch (err) {
            setError('Google login failed');
        }
    };

    const handleGitHubLogin = async () => {
        try {
            await loginWithGitHub();
        } catch (err) {
            setError('GitHub login failed');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0a0118] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0118] flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-white hover:text-primary-400 transition-colors">
                        <Code2 className="w-8 h-8" />
                        CodeMentor AI
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
                        <CardDescription className="text-center">
                            Sign in to continue your coding journey
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                                    <Input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="your@email.com"
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                                    <Input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 text-text-secondary cursor-pointer">
                                    <input type="checkbox" className="rounded border-border" />
                                    Remember me
                                </label>
                                <Link href="/forgot-password" className="text-primary-400 hover:text-primary-300">
                                    Forgot password?
                                </Link>
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={loading}
                            >
                                {loading ? 'Signing in...' : 'Sign In'}
                            </Button>
                        </form>

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-border"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-surface-primary text-text-tertiary">Or continue with</span>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-2 gap-3">
                                <Button
                                    variant="outline"
                                    onClick={handleGoogleLogin}
                                    leftIcon={<Chrome className="w-4 h-4" />}
                                >
                                    Google
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={handleGitHubLogin}
                                    leftIcon={<Github className="w-4 h-4" />}
                                >
                                    GitHub
                                </Button>
                            </div>
                        </div>

                        <div className="mt-6 text-center text-sm text-text-secondary">
                            Don't have an account?{' '}
                            <Link href="/signup" className="text-primary-400 hover:text-primary-300 font-medium">
                                Sign up
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                <p className="mt-8 text-center text-xs text-text-tertiary">
                    By signing in, you agree to our{' '}
                    <Link href="/terms" className="text-primary-400 hover:text-primary-300">
                        Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-primary-400 hover:text-primary-300">
                        Privacy Policy
                    </Link>
                </p>
            </div>
        </div>
    );
}
