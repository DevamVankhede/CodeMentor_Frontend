'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/layout/Navigation';
import Card, { CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import GameEngine from '@/components/games/GameEngine';
import {
    Bug, Code2, RefreshCw, Zap, Trophy, Clock, Star, Play, Gamepad2, TrendingUp, Award, Target
} from 'lucide-react';

export default function GamesPage() {
    const { isAuthenticated, user } = useAuth();
    const [selectedGame, setSelectedGame] = useState<string | null>(null);
    const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
    const [selectedLanguage, setSelectedLanguage] = useState('javascript');
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [userStats, setUserStats] = useState({ gamesPlayed: 0, totalXP: 0, averageScore: 0 });

    useEffect(() => {
        if (isAuthenticated) {
            fetchLeaderboard();
            fetchUserStats();
        }
    }, [isAuthenticated]);

    const fetchLeaderboard = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/game/leaderboard', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` },
            });
            if (response.ok) {
                const data = await response.json();
                setLeaderboard(data);
            }
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserStats = async () => {
        try {
            const response = await fetch('/api/game/user-stats', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` },
            });
            if (response.ok) {
                const data = await response.json();
                setUserStats({
                    gamesPlayed: data.gamesPlayed || 0,
                    totalXP: data.totalXP || 0,
                    averageScore: data.averageScore || 0,
                });
            }
        } catch (error) {
            console.error('Error fetching user stats:', error);
            // Set default values on error
            setUserStats({ gamesPlayed: 0, totalXP: 0, averageScore: 0 });
        }
    };

    const handleGameComplete = async (score: number, timeSpent: number) => {
        try {
            const response = await fetch('/api/game/submit-solution', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                },
                body: JSON.stringify({
                    gameType: selectedGame,
                    score,
                    timeSpent,
                    difficulty: selectedDifficulty,
                    details: JSON.stringify({ language: selectedLanguage }),
                }),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Game completed!', result);
                fetchLeaderboard();
                fetchUserStats();
            }
        } catch (error) {
            console.error('Error submitting game result:', error);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen relative overflow-hidden bg-[#0a0118]">
                {/* Epic Gaming Background */}
                <div className="fixed inset-0 z-0">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-[120px] animate-pulse"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] animate-pulse"></div>
                </div>
                <Navigation />
                <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-4rem)]">
                    <Card className="max-w-md">
                        <CardContent className="text-center py-12">
                            <Gamepad2 className="w-20 h-20 text-primary-500 mx-auto mb-6" />
                            <h2 className="text-2xl font-bold text-text-primary mb-3">Sign In to Play Games</h2>
                            <p className="text-text-secondary mb-6">Join the fun and start earning XP with our coding games!</p>
                            <Button onClick={() => window.location.href = '/'}>Sign In</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    if (selectedGame) {
        return (
            <GameEngine
                difficulty={selectedDifficulty}
                language={selectedLanguage}
                gameType={selectedGame}
                onGameComplete={handleGameComplete}
            />
        );
    }

    const gameModes = [
        {
            id: 'bug-hunt',
            title: 'AI Bug Hunt',
            description: 'Find and fix AI-generated bugs in real code snippets',
            icon: Bug,
            gradient: 'from-red-500 to-pink-600',
            xpReward: 100,
            estimatedTime: '5-10 min',
            players: '1.2k+',
        },
        {
            id: 'code-completion',
            title: 'Code Completion Race',
            description: 'Complete missing code parts faster than AI',
            icon: Code2,
            gradient: 'from-blue-500 to-cyan-600',
            xpReward: 150,
            estimatedTime: '8-15 min',
            players: '890+',
        },
        {
            id: 'refactor-challenge',
            title: 'Refactor Master',
            description: 'Improve messy code quality and performance',
            icon: RefreshCw,
            gradient: 'from-green-500 to-emerald-600',
            xpReward: 200,
            estimatedTime: '10-20 min',
            players: '650+',
        },
        {
            id: 'speed-coding',
            title: 'Speed Coding Challenge',
            description: 'Solve coding problems faster than AI',
            icon: Zap,
            gradient: 'from-yellow-500 to-orange-600',
            xpReward: 120,
            estimatedTime: '5-8 min',
            players: '1.5k+',
        },
    ];

    const languages = [
        { id: 'javascript', name: 'JavaScript', icon: '🟨' },
        { id: 'python', name: 'Python', icon: '🐍' },
        { id: 'java', name: 'Java', icon: '☕' },
        { id: 'cpp', name: 'C++', icon: '⚡' },
        { id: 'typescript', name: 'TypeScript', icon: '🔷' },
        { id: 'go', name: 'Go', icon: '🐹' },
    ];

    const difficulties = [
        { id: 'easy', name: 'Easy', multiplier: '1x', color: 'bg-green-500' },
        { id: 'medium', name: 'Medium', multiplier: '1.5x', color: 'bg-yellow-500' },
        { id: 'hard', name: 'Hard', multiplier: '2x', color: 'bg-red-500' },
    ];

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#0a0118]">
            {/* Epic Gaming Background */}
            <div className="fixed inset-0 z-0">
                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>

                {/* Glowing Orbs */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/15 rounded-full blur-[120px]"></div>
                <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/15 rounded-full blur-[120px]"></div>

                {/* Animated Lines */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-[slide_3s_linear_infinite]"></div>
                    <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-[slide_4s_linear_infinite]"></div>
                    <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-500 to-transparent animate-[slide_5s_linear_infinite]"></div>
                </div>

                {/* Floating Particles */}
                <div className="absolute inset-0 opacity-40">
                    {[...Array(15)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 bg-purple-400 rounded-full"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
                                animationDelay: `${Math.random() * 5}s`,
                            }}
                        ></div>
                    ))}
                </div>
            </div>

            <Navigation />

            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                        <Gamepad2 className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-5xl font-bold text-white mb-4">
                        Coding Games Arena
                    </h1>
                    <p className="text-white/80 text-xl max-w-3xl mx-auto leading-relaxed">
                        Master programming through <span className="text-purple-400 font-semibold">epic challenges</span>! Battle bugs, race against AI, and climb the leaderboards.
                    </p>
                    <div className="flex items-center justify-center gap-6 mt-6">
                        <div className="flex items-center gap-2 text-white/70">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-sm">1.5k+ Players Online</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/70">
                            <Trophy className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm">50k+ Games Played</span>
                        </div>
                    </div>
                </div>

                {/* User Stats - Real Data from Database */}
                {user && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/30 backdrop-blur-sm">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-white/60 text-sm mb-1 uppercase tracking-wider">Games Played</p>
                                        <p className="text-4xl font-bold text-white">{userStats.gamesPlayed}</p>
                                    </div>
                                    <Target className="w-12 h-12 text-blue-400" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30 backdrop-blur-sm">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-white/60 text-sm mb-1 uppercase tracking-wider">Total XP</p>
                                        <p className="text-4xl font-bold text-white">{userStats.totalXP}</p>
                                    </div>
                                    <Star className="w-12 h-12 text-purple-400" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30 backdrop-blur-sm">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-white/60 text-sm mb-1 uppercase tracking-wider">Avg Score</p>
                                        <p className="text-4xl font-bold text-white">{userStats.averageScore}%</p>
                                    </div>
                                    <TrendingUp className="w-12 h-12 text-green-400" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Game Configuration */}
                <Card className="mb-12 bg-white/5 backdrop-blur-sm border-white/10">
                    <CardContent className="p-8">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <span className="text-2xl">⚙️</span>
                            Game Configuration
                        </h2>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Language Selection */}
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <span className="text-xl">💻</span>
                                    Programming Language
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {languages.map((lang) => (
                                        <button
                                            key={lang.id}
                                            onClick={() => setSelectedLanguage(lang.id)}
                                            className={`p-4 rounded-xl border-2 transition-all duration-200 ${selectedLanguage === lang.id
                                                ? 'border-blue-400 bg-blue-500/20 text-white shadow-lg shadow-blue-500/20'
                                                : 'border-white/20 bg-white/5 text-white/70 hover:border-white/30 hover:bg-white/8'
                                                }`}
                                        >
                                            <div className="text-2xl mb-2">{lang.icon}</div>
                                            <div className="font-medium">{lang.name}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Difficulty Selection */}
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <span className="text-xl">🎯</span>
                                    Difficulty Level
                                </h3>
                                <div className="space-y-3">
                                    {difficulties.map((diff) => (
                                        <button
                                            key={diff.id}
                                            onClick={() => setSelectedDifficulty(diff.id as any)}
                                            className={`w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between ${selectedDifficulty === diff.id
                                                ? 'border-purple-400 bg-purple-500/20 text-white shadow-lg shadow-purple-500/20'
                                                : 'border-white/20 bg-white/5 text-white/70 hover:border-white/30 hover:bg-white/8'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-3 h-3 rounded-full ${diff.color}`}></div>
                                                <span className="font-medium">{diff.name}</span>
                                            </div>
                                            <span className="text-sm opacity-70">{diff.multiplier} XP</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Game Modes */}
                <div className="mb-12">
                    <h2 className="text-3xl font-bold text-white mb-8 text-center">Choose Your Challenge</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {gameModes.map((game) => (
                            <Card key={game.id} className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all duration-300 group">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg bg-gradient-to-br ${game.gradient}`}>
                                            <game.icon className="w-8 h-8 text-white" />
                                        </div>

                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-white mb-1">{game.title}</h3>
                                            <p className="text-white/60 text-sm">{game.description}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-3 mb-4">
                                        <div className="text-center p-3 bg-white/5 rounded-lg">
                                            <Clock className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                                            <div className="text-xs text-white/60">Time</div>
                                            <div className="text-sm font-semibold text-white">{game.estimatedTime}</div>
                                        </div>

                                        <div className="text-center p-3 bg-white/5 rounded-lg">
                                            <Star className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                                            <div className="text-xs text-white/60">Reward</div>
                                            <div className="text-sm font-semibold text-white">{game.xpReward} XP</div>
                                        </div>

                                        <div className="text-center p-3 bg-white/5 rounded-lg">
                                            <Trophy className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                                            <div className="text-xs text-white/60">Players</div>
                                            <div className="text-sm font-semibold text-white">{game.players}</div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setSelectedGame(game.id)}
                                        className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-200 bg-gradient-to-r ${game.gradient} hover:opacity-90 hover:shadow-lg flex items-center justify-center gap-2`}
                                    >
                                        <Play className="w-5 h-5" />
                                        Start Challenge
                                    </button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Leaderboard */}
                <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                    <CardContent className="p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <Trophy className="w-8 h-8 text-yellow-400" />
                            <h2 className="text-2xl font-bold text-white">Global Leaderboard</h2>
                            <span className="text-sm text-white/60 bg-white/10 px-3 py-1 rounded-full">This Week</span>
                        </div>

                        {loading ? (
                            <div className="text-center py-12">
                                <RefreshCw className="w-8 h-8 text-white/60 animate-spin mx-auto mb-4" />
                                <p className="text-white/60">Loading leaderboard...</p>
                            </div>
                        ) : leaderboard.length > 0 ? (
                            <div className="space-y-3">
                                {leaderboard.map((player) => (
                                    <div
                                        key={player.userId}
                                        className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200"
                                    >
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${player.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                                            player.rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                                                player.rank === 3 ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                                                    'bg-gradient-to-br from-purple-500 to-pink-600'
                                            }`}>
                                            {player.rank}
                                        </div>

                                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-lg">
                                            {player.avatar}
                                        </div>

                                        <div className="flex-1">
                                            <div className="font-semibold text-white">{player.username}</div>
                                            <div className="text-sm text-white/60">
                                                {player.gamesPlayed} games • {player.averageScore} avg
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <div className="text-xl font-bold text-white">{player.score.toLocaleString()}</div>
                                            <div className="text-sm text-white/60">XP</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Trophy className="w-16 h-16 text-white/40 mx-auto mb-4" />
                                <p className="text-white/60">No leaderboard data yet. Be the first to play!</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div >
    );
}
