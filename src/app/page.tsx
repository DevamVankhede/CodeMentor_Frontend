"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/layout/Navigation";
import AuthModal from "@/components/auth/AuthModal";
import {
  Code2,
  Sparkles,
  Zap,
  Trophy,
  Users,
  Brain,
  Rocket,
  Star,
  Play,
  ArrowRight,
  CheckCircle,
  Target,
  Gamepad2,
  BookOpen,
} from "lucide-react";

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("signup");

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Code Analysis",
      description:
        "Get instant feedback, bug detection, and optimization suggestions from advanced AI",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Gamepad2 className="w-8 h-8" />,
      title: "Interactive Coding Games",
      description:
        "Master programming through fun challenges, bug hunts, and competitive coding",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Real-time Collaboration",
      description:
        "Code together with teammates in Google Docs-style collaborative editing",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Personalized Roadmaps",
      description:
        "AI-generated learning paths tailored to your goals and skill level",
      color: "from-orange-500 to-red-500",
    },
  ];

  const stats = [
    {
      number: "50K+",
      label: "Developers",
      icon: <Users className="w-6 h-6" />,
    },
    {
      number: "1M+",
      label: "Code Reviews",
      icon: <Code2 className="w-6 h-6" />,
    },
    {
      number: "100K+",
      label: "Bugs Fixed",
      icon: <Target className="w-6 h-6" />,
    },
    {
      number: "95%",
      label: "Success Rate",
      icon: <Trophy className="w-6 h-6" />,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32 lg:py-40">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply blur-3xl animate-blob"></div>
          <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-accent/20 rounded-full mix-blend-multiply blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-secondary/20 rounded-full mix-blend-multiply blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center justify-center mb-6 px-4 py-2 border border-primary-foreground/20 rounded-full backdrop-blur-sm bg-white/5 text-sm font-medium text-primary-foreground animate-fade-in">
              <Sparkles className="w-4 h-4 mr-2 text-primary" />
              Code Smarter, Not Harder
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-foreground mb-6 leading-tight">
              Unlock Your Coding Potential with{" "}
              <span className="text-white">
                AI-Powered Precision
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
              Experience the future of development with intelligent code
              analysis, real-time collaboration, and gamified learning paths
              designed to elevate your skills.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 8px 20px rgba(var(--primary), 0.3)",
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setAuthMode("signup");
                  setIsAuthModalOpen(true);
                }}
                className="relative inline-flex h-12 items-center justify-center rounded-md border border-transparent bg-gradient-to-r from-primary to-accent px-6 font-medium text-primary-foreground shadow-lg transition-all duration-300 hover:from-primary/90 hover:to-accent/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
              >
                <Rocket className="w-5 h-5 mr-2" />
                Start Coding for Free
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="relative inline-flex h-12 items-center justify-center rounded-md border border-border bg-card px-6 font-medium text-foreground shadow-sm transition-all duration-300 hover:bg-card/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </motion.button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 text-muted-foreground text-sm">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span>Rated 4.9/5 by 500+ users</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Trusted by leading developers</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-500" />
                <span>Instant Setup & Scalable</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <motion.div
                key={`stat-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true, amount: 0.5 }}
                className="p-6 bg-background rounded-xl shadow-md border border-border/50"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-primary-foreground shadow-lg">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-4xl font-extrabold text-foreground mb-1">
                  {stat.number}
                </div>
                <div className="text-muted-foreground text-sm">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.5 }}
            className="text-center mb-16 md:mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
              Everything You Need to{" "}
              <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                Master Your Craft
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              A comprehensive suite of tools and features designed to accelerate
              your coding journey, from learning to deployment.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={`feature-${index}`}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true, amount: 0.3 }}
                className="bg-card border border-border rounded-2xl p-8 flex flex-col items-center text-center transition-all duration-300 hover:shadow-xl hover:shadow-primary/10"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-full flex items-center justify-center text-white mb-6 shadow-lg`}
                >
                  {feature.icon}
                </div>

                <h3 className="text-xl font-bold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  {feature.description}
                </p>

                <a
                  href="/explore"
                  className="inline-flex items-center text-primary font-medium group-hover:text-accent transition-colors"
                >
                  Learn more
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-6">
              Ready to Elevate Your Coding?
            </h2>
            <p className="text-lg text-muted-foreground mb-10">
              Join thousands of forward-thinking developers harnessing AI to
              write cleaner, faster, and more efficient code.
            </p>

            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 8px 20px rgba(var(--primary), 0.3)",
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setAuthMode("signup");
                setIsAuthModalOpen(true);
              }}
              className="relative inline-flex h-14 items-center justify-center rounded-md border border-transparent bg-gradient-to-r from-primary to-accent px-8 text-xl font-bold text-primary-foreground shadow-lg transition-all duration-300 hover:from-primary/90 hover:to-accent/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
            >
              <Rocket className="w-6 h-6 mr-2" />
              Start Your Free Journey Now!
            </motion.button>

            <p className="text-muted-foreground mt-6 text-sm">
              No credit card required • Instant setup
            </p>
          </motion.div>
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultMode={authMode}
      />
    </div>
  );
}
