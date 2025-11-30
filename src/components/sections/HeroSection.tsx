'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { Code2, Zap, Users, Trophy, ArrowRight, Play } from 'lucide-react';

export default function HeroSection() {
  const features = [
    {
      icon: Code2,
      title: 'AI Code Assistant',
      description: 'Get instant bug fixes, optimizations, and explanations'
    },
    {
      icon: Users,
      title: 'Real-time Collaboration',
      description: 'Code together with Google Docs-style editing'
    },
    {
      icon: Trophy,
      title: 'Gamified Learning',
      description: 'Level up with challenges and achievements'
    },
    {
      icon: Zap,
      title: 'Personalized Roadmap',
      description: 'AI-generated learning path just for you'
    }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-secondary-500/10" />
      
      <motion.div
        animate={{ 
          rotate: 360,
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          rotate: { duration: 50, repeat: Infinity, ease: "linear" },
          scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
        }}
        className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-full blur-3xl"
      />
      
      <motion.div
        animate={{ 
          rotate: -360,
          scale: [1.1, 1, 1.1]
        }}
        transition={{ 
          rotate: { duration: 40, repeat: Infinity, ease: "linear" },
          scale: { duration: 6, repeat: Infinity, ease: "easeInOut" }
        }}
        className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-secondary-500/20 to-primary-500/20 rounded-full blur-3xl"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-surface-secondary rounded-full text-sm font-medium text-text-secondary mb-8"
          >
            <Zap className="w-4 h-4 text-primary-500" />
            Powered by Advanced AI
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="gradient-text">Code Smarter</span>
            <br />
            <span className="text-text-primary">Learn Faster</span>
          </h1>

          <p className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto mb-12 leading-relaxed">
            The most advanced AI-powered coding platform with real-time collaboration, 
            personalized learning paths, and gamified challenges.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button
              size="xl"
              rightIcon={<ArrowRight className="w-5 h-5" />}
              className="min-w-[200px]"
            >
              Start Coding Now
            </Button>
            
            <Button
              variant="outline"
              size="xl"
              leftIcon={<Play className="w-5 h-5" />}
              className="min-w-[200px]"
            >
              Watch Demo
            </Button>
          </div>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
            >
              <Card variant="glass" hover className="text-center h-full">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  {feature.title}
                </h3>
                <p className="text-text-secondary text-sm">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { number: '50K+', label: 'Active Coders' },
            { number: '1M+', label: 'Code Reviews' },
            { number: '99.9%', label: 'Uptime' },
            { number: '24/7', label: 'AI Support' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                {stat.number}
              </div>
              <div className="text-text-secondary text-sm">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}