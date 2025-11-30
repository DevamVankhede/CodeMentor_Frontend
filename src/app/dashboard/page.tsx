'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Navigation from '@/components/layout/Navigation';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import AIRoadmapVisualization from '@/components/roadmap/AIRoadmapVisualization';
import {
  Trophy,
  Target,
  Zap,
  Code2,
  Bug,
  Users,
  Calendar,
  TrendingUp,
  Star,
  Clock,
  Award,
  BookOpen,
  Gamepad2,
  BarChart3,
  Activity
} from 'lucide-react';

interface DashboardStats {
  totalXp: number;
  level: number;
  bugsFixed: number;
  gamesWon: number;
  streak: number;
  weeklyProgress: number[];
  recentAchievements: Achievement[];
  upcomingMilestones: Milestone[];
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: string;
  unlockedAt: string;
}

interface Milestone {
  id: string;
  title: string;
  dueDate: string;
  progress: number;
}

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'roadmap' | 'analytics' | 'achievements'>('overview');

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Mock data for demonstration
      setStats({
        totalXp: user?.xp || 0,
        level: user?.level || 1,
        bugsFixed: user?.bugsFixed || 0,
        gamesWon: user?.gamesWon || 0,
        streak: user?.streak || 0,
        weeklyProgress: [120, 150, 180, 200, 170, 220, 250],
        recentAchievements: [
          {
            id: '1',
            name: 'Bug Hunter',
            description: 'Fixed 10 bugs with AI assistance',
            icon: '🐛',
            rarity: 'rare',
            unlockedAt: '2024-01-15'
          },
          {
            id: '2',
            name: 'Code Master',
            description: 'Reached level 10',
            icon: '👑',
            rarity: 'epic',
            unlockedAt: '2024-01-10'
          }
        ],
        upcomingMilestones: [
          {
            id: '1',
            title: 'Complete React Fundamentals',
            dueDate: '2024-01-25',
            progress: 75
          },
          {
            id: '2',
            title: 'Build Todo App Project',
            dueDate: '2024-01-30',
            progress: 30
          }
        ]
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-bg-primary">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <Card>
            <CardContent className="text-center py-8">
              <h2 className="text-xl font-bold text-text-primary mb-2">
                Please Sign In
              </h2>
              <p className="text-text-secondary">
                Sign in to access your personalized dashboard
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-text-secondary">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-text-secondary">
            Here&apos;s your coding journey progress and personalized insights.
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8"
        >
          <Card variant="elevated">
            <CardContent className="text-center py-6">
              <div className="flex items-center justify-center w-12 h-12 bg-primary-500/20 rounded-full mx-auto mb-3">
                <Trophy className="w-6 h-6 text-primary-500" />
              </div>
              <div className="text-2xl font-bold text-text-primary mb-1">
                {stats?.level}
              </div>
              <div className="text-sm text-text-secondary">Level</div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent className="text-center py-6">
              <div className="flex items-center justify-center w-12 h-12 bg-yellow-500/20 rounded-full mx-auto mb-3">
                <Zap className="w-6 h-6 text-yellow-500" />
              </div>
              <div className="text-2xl font-bold text-text-primary mb-1">
                {stats?.totalXp.toLocaleString()}
              </div>
              <div className="text-sm text-text-secondary">Total XP</div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent className="text-center py-6">
              <div className="flex items-center justify-center w-12 h-12 bg-red-500/20 rounded-full mx-auto mb-3">
                <Bug className="w-6 h-6 text-red-500" />
              </div>
              <div className="text-2xl font-bold text-text-primary mb-1">
                {stats?.bugsFixed}
              </div>
              <div className="text-sm text-text-secondary">Bugs Fixed</div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent className="text-center py-6">
              <div className="flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-full mx-auto mb-3">
                <Gamepad2 className="w-6 h-6 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-text-primary mb-1">
                {stats?.gamesWon}
              </div>
              <div className="text-sm text-text-secondary">Games Won</div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent className="text-center py-6">
              <div className="flex items-center justify-center w-12 h-12 bg-orange-500/20 rounded-full mx-auto mb-3">
                <Activity className="w-6 h-6 text-orange-500" />
              </div>
              <div className="text-2xl font-bold text-text-primary mb-1">
                {stats?.streak}
              </div>
              <div className="text-sm text-text-secondary">Day Streak</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 p-2 bg-surface-secondary rounded-xl border border-border-primary">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'roadmap', label: 'Learning Roadmap', icon: BookOpen },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp },
            { id: 'achievements', label: 'Achievements', icon: Award }
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab(tab.id as 'overview' | 'progress' | 'achievements' | 'collaboration')}
              leftIcon={<tab.icon className="w-4 h-4" />}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Weekly Progress */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary-500" />
                    Weekly Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-end gap-2 h-32">
                      {stats?.weeklyProgress.map((value, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${(value / 250) * 100}%` }}
                            transition={{ delay: index * 0.1 }}
                            className="w-full bg-primary-500 rounded-t min-h-[4px]"
                          />
                          <div className="text-xs text-text-tertiary mt-2">
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="text-sm text-text-secondary">
                      XP gained this week: {stats?.weeklyProgress.reduce((a, b) => a + b, 0)} points
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-500" />
                    Recent Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats?.recentAchievements.map((achievement) => (
                      <div key={achievement.id} className="flex items-center gap-3 p-3 bg-surface-secondary rounded-lg">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <div className="font-medium text-text-primary">{achievement.name}</div>
                          <div className="text-sm text-text-secondary">{achievement.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Milestones */}
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-green-500" />
                    Upcoming Milestones
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {stats?.upcomingMilestones.map((milestone) => (
                      <div key={milestone.id} className="p-4 bg-surface-secondary rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-text-primary">{milestone.title}</h4>
                          <span className="text-sm text-text-secondary">
                            Due {new Date(milestone.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-text-secondary">Progress</span>
                            <span className="text-text-primary">{milestone.progress}%</span>
                          </div>
                          <div className="w-full bg-surface-primary rounded-full h-2">
                            <motion.div
                              className="bg-green-500 h-2 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${milestone.progress}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'roadmap' && (
            <AIRoadmapVisualization userId={user?.id} />
          )}

          {activeTab === 'analytics' && (
            <div className="text-center py-20">
              <BarChart3 className="w-16 h-16 text-primary-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-text-primary mb-2">
                Advanced Analytics
              </h2>
              <p className="text-text-secondary mb-6">
                Detailed performance metrics and insights coming soon!
              </p>
              <Button>View Analytics</Button>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="text-center py-20">
              <Award className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-text-primary mb-2">
                Achievement Gallery
              </h2>
              <p className="text-text-secondary mb-6">
                View all your unlocked achievements and progress towards new ones!
              </p>
              <Button>View All Achievements</Button>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}