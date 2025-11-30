"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import Cookies from "js-cookie";
import Card, {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";

interface DashboardStats {
  level: number;
  xp: number;
  bugsFixed: number;
  gamesWon: number;
  streak: number;
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
}

// Helper function to determine rarity background class
const getRarityBgClass = (rarity: string) => {
  switch (rarity) {
    case "legendary":
      return "bg-yellow-500/20 text-yellow-300";
    case "epic":
      return "bg-purple-500/20 text-purple-300";
    case "rare":
      return "bg-blue-500/20 text-blue-300";
    default:
      return "bg-gray-500/20 text-gray-300";
  }
};

const GamingDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    level: 1,
    xp: 0,
    bugsFixed: 0,
    gamesWon: 0,
    streak: 0,
  });
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const setDefaultStatsFromUser = useCallback(() => {
    if (user) {
      setStats({
        level: user.level,
        xp: user.xp,
        bugsFixed: user.bugsFixed,
        gamesWon: user.gamesWon,
        streak: user.streak,
      });
      // setAchievements([]); // No achievements by default, or provide dummy data if needed
    }
  }, [user]);

  const fetchDashboardData = useCallback(async () => {
    try {
      const token = Cookies.get("auth_token");
      if (!token) {
        setDefaultStatsFromUser();
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
        });
        setAchievements(data.availableAchievements || []);
      } else {
        setDefaultStatsFromUser();
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      setDefaultStatsFromUser();
    } finally {
      setIsLoading(false);
    }
  }, [setDefaultStatsFromUser]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <div className="space-y-6 p-4 md:p-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <Card className="text-center py-8 bg-card border border-border shadow-lg">
          <div className="text-center py-8">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-2">
                Welcome back, {user?.name || "Code Warrior"}! 👑
              </h1>
            </motion.div>
            <p className="text-muted-foreground text-lg">
              Ready to conquer some code today?
            </p>
          </div>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          {
            label: "Level",
            value: stats.level,
            icon: "⭐",
            color: "from-yellow-500 to-orange-500",
          },
          {
            label: "XP Points",
            value: stats.xp,
            icon: "💎",
            color: "from-blue-500 to-purple-500",
          },
          {
            label: "Bugs Fixed",
            value: stats.bugsFixed,
            icon: "🐛",
            color: "from-green-500 to-emerald-500",
          },
          {
            label: "Games Won",
            value: stats.gamesWon,
            icon: "🏆",
            color: "from-purple-500 to-pink-500",
          },
          {
            label: "Streak",
            value: stats.streak,
            icon: "🔥",
            color: "from-red-500 to-orange-500",
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            viewport={{ once: true, amount: 0.5 }}
          >
            <Card className="bg-background border border-border shadow-md">
              <div className="text-center p-4">
                <div
                  className={`text-3xl mb-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                >
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-foreground font-jetbrains-mono">
                  {stat.value.toLocaleString()}
                </div>
                <div className="text-muted-foreground text-sm">
                  {stat.label}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Achievement Progress */}
      <Card className="bg-card border border-border shadow-lg p-6">
        <CardHeader className="mb-6">
          <CardTitle className="flex items-center gap-2 text-primary">
            🏅 Achievement Progress
          </CardTitle>
          <CardDescription>
            Your journey to becoming a coding legend
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"
                />
                <p className="text-muted-foreground mt-2">
                  Loading achievements...
                </p>
              </div>
            ) : achievements.length > 0 ? (
              achievements.map((achievement, index) => {
                const rarityBgClass = getRarityBgClass(achievement.rarity);
                return (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2, duration: 0.5 }}
                    viewport={{ once: true, amount: 0.3 }}
                    className="flex items-center gap-4 p-3 bg-background rounded-lg border border-border"
                  >
                    <div className="text-2xl flex-shrink-0">
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-foreground font-semibold">
                          {achievement.name}
                        </span>
                        <span className="text-primary">
                          {achievement.progressPercentage}%
                        </span>
                      </div>
                      <p className="text-muted-foreground text-sm mb-2">
                        {achievement.description}
                      </p>
                      <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${achievement.progressPercentage}%`,
                          }}
                          transition={{ duration: 1, delay: index * 0.3 }}
                          className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>
                          {achievement.currentProgress} /{" "}
                          {achievement.requirementValue}
                        </span>
                        <span
                          className={`px-2 py-1 rounded text-xs ${rarityBgClass}`}
                        >
                          {achievement.rarity}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-4 text-muted-foreground">🏆</div>
                <p className="text-muted-foreground">
                  No achievements unlocked yet!
                </p>
                <p className="text-muted-foreground text-sm">
                  Keep coding to earn new badges.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div whileHover={{ scale: 1.02 }} className="cursor-pointer">
          <Card className="text-center p-6 bg-card border border-border shadow-md">
            <div className="text-center group">
              <div className="text-4xl mb-4 text-primary group-hover:scale-110 transition-transform">
                🎮
              </div>
              <h4 className="text-xl font-bold text-foreground mb-2">
                Start Coding Game
              </h4>
              <p className="text-muted-foreground">
                Challenge yourself with AI-generated puzzles
              </p>
            </div>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="cursor-pointer">
          <Card className="text-center p-6 bg-card border border-border shadow-md">
            <div className="text-center group">
              <div className="text-4xl mb-4 text-accent group-hover:scale-110 transition-transform">
                🤖
              </div>
              <h4 className="text-xl font-bold text-foreground mb-2">
                AI Code Review
              </h4>
              <p className="text-muted-foreground">
                Get instant feedback on your code
              </p>
            </div>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="cursor-pointer">
          <Card className="text-center p-6 bg-card border border-border shadow-md">
            <div className="text-center group">
              <div className="text-4xl mb-4 text-secondary group-hover:scale-110 transition-transform">
                👥
              </div>
              <h4 className="text-xl font-bold text-foreground mb-2">
                Join Session
              </h4>
              <p className="text-muted-foreground">
                Collaborate with your team
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default GamingDashboard;
