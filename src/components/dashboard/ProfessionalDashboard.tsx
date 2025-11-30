"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import Card, {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Cookies from "js-cookie";
import {
  Code2,
  Trophy,
  Zap,
  TrendingUp,
  Users,
  Target,
  Calendar,
  Award,
  Activity,
  BookOpen,
  ChevronRight,
} from "lucide-react";

interface DashboardStats {
  level: number;
  xp: number;
  bugsFixed: number;
  gamesWon: number;
  streak: number;
  totalProjects: number;
  collaborations: number;
  achievements: number;
}

interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  rarity: string;
  currentProgress: number;
  requirementValue: number;
  progressPercentage: number;
  isUnlocked: boolean;
}

interface RecentActivity {
  id: string;
  type: "code_analysis" | "bug_fix" | "collaboration" | "achievement";
  title: string;
  description: string;
  timestamp: string;
  xpEarned?: number;
}

export default function ProfessionalDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    level: 1,
    xp: 0,
    bugsFixed: 0,
    gamesWon: 0,
    streak: 0,
    totalProjects: 0,
    collaborations: 0,
    achievements: 0,
  });
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const setDefaultStatsFromUser = () => {
    if (user) {
      setStats({
        level: user.level,
        xp: user.xp,
        bugsFixed: user.bugsFixed,
        gamesWon: user.gamesWon,
        streak: user.streak,
        totalProjects: 12,
        collaborations: 8,
        achievements: 5,
      });
    }
  };

  const fetchDashboardData = async () => {
    try {
      const token = Cookies.get("auth_token");
      if (!token) {
        setIsLoading(false);
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setStats({
          level: data.user.level,
          xp: data.user.xp,
          bugsFixed: data.user.bugsFixed,
          gamesWon: data.user.gamesWon,
          streak: data.user.streak,
          totalProjects: data.user.totalProjects || 12,
          collaborations: data.user.collaborations || 8,
          achievements: data.recentAchievements?.length || 0,
        });
        setAchievements(data.availableAchievements || []);
        setRecentActivity(data.recentActivity || []);
      } else {
        setDefaultStatsFromUser();
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      setDefaultStatsFromUser();
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: "Current Level",
      value: stats.level,
      icon: Trophy,
      color: "from-yellow-500 to-orange-500",
      change: "+2 this month",
    },
    {
      title: "Total XP",
      value: stats.xp.toLocaleString(),
      icon: Zap,
      color: "from-blue-500 to-purple-500",
      change: "+1,247 this week",
    },
    {
      title: "Bugs Fixed",
      value: stats.bugsFixed,
      icon: Code2,
      color: "from-green-500 to-emerald-500",
      change: "+23 this week",
    },
    {
      title: "Current Streak",
      value: `${stats.streak} days`,
      icon: Activity,
      color: "from-red-500 to-pink-500",
      change: "Keep it up!",
    },
  ];

  const quickActions = [
    {
      title: "Start Coding",
      description: "Open the AI-powered code editor",
      icon: Code2,
      action: "editor",
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Join Session",
      description: "Collaborate with your team",
      icon: Users,
      action: "collaborate",
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Take Challenge",
      description: "Solve coding challenges",
      icon: Target,
      action: "challenges",
      color: "from-green-500 to-teal-500",
    },
    {
      title: "View Roadmap",
      description: "Check your learning path",
      icon: BookOpen,
      action: "roadmap",
      color: "from-orange-500 to-red-500",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 md:p-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-2">
          Welcome back, {user?.name || "Developer"}! 👋
        </h1>
        <p className="text-lg text-muted-foreground">
          Ready to continue your coding journey?
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            viewport={{ once: true, amount: 0.5 }}
          >
            <Card
              hover
              className="relative overflow-hidden bg-background border border-border rounded-xl shadow-md"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-10`}
              />
              <CardContent className="relative p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-extrabold text-foreground mt-1">
                      {stat.value}
                    </p>
                    <p className="text-sm text-green-500 mt-2 flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      {stat.change}
                    </p>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg`}
                  >
                    <stat.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Jump into your favorite activities
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={action.title}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    viewport={{ once: true, amount: 0.3 }}
                  >
                    <Button
                      variant="secondary"
                      className="w-full h-auto p-4 justify-start text-left group"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}
                        >
                          <action.icon className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">
                            {action.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {action.description}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Achievement Progress */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                Achievements
              </CardTitle>
              <CardDescription>
                Your progress towards new badges
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {achievements.length > 0 ? (
                  achievements.slice(0, 3).map((achievement, index) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      viewport={{ once: true, amount: 0.3 }}
                      className="flex items-center gap-3"
                    >
                      <div className="text-2xl flex-shrink-0">
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-foreground">
                            {achievement.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {achievement.progressPercentage}%
                          </span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${achievement.progressPercentage}%`,
                            }}
                            transition={{ duration: 1, delay: index * 0.2 }}
                            className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {achievement.currentProgress} /{" "}
                          {achievement.requirementValue}
                        </p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No achievements yet</p>
                    <p className="text-muted-foreground text-sm">
                      Start coding to unlock badges!
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Recent Activity
          </CardTitle>
          <CardDescription>
            Your latest coding activities and achievements
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {recentActivity.length > 0 ? (
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  viewport={{ once: true, amount: 0.3 }}
                  className="flex items-center gap-4 p-3 rounded-lg bg-card border border-border transition-all duration-300 hover:shadow-sm hover:shadow-primary/10"
                >
                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {activity.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.description}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-muted-foreground">
                      {activity.timestamp}
                    </p>
                    {activity.xpEarned && (
                      <p className="text-xs text-accent mt-1">
                        +{activity.xpEarned} XP
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No recent activity</p>
              <p className="text-muted-foreground text-sm">
                Start coding to see your activity here!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
