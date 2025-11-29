'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  CheckCircle, 
  Clock, 
  Target, 
  BookOpen, 
  Code, 
  Trophy,
  Sparkles,
  ArrowRight,
  Calendar
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

interface Milestone {
  week: number;
  title: string;
  topics: string[];
  projects: string[];
  resources: string[];
  isCompleted?: boolean;
  completedAt?: string;
}

interface RoadmapData {
  title: string;
  duration: string;
  milestones: Milestone[];
}

interface AIRoadmapVisualizationProps {
  userId?: string;
}

export default function AIRoadmapVisualization({ userId }: AIRoadmapVisualizationProps) {
  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [currentWeek, setCurrentWeek] = useState(1);

  useEffect(() => {
    generateRoadmap();
  }, []);

  const generateRoadmap = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/generate-roadmap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      const result = await response.json();
      if (result.success) {
        const data = JSON.parse(result.roadmap);
        setRoadmapData(data.roadmap);
      }
    } catch (error) {
      console.error('Error generating roadmap:', error);
    } finally {
      setLoading(false);
    }
  };

  const completeMilestone = (week: number) => {
    if (!roadmapData) return;
    
    const updatedMilestones = roadmapData.milestones.map(milestone => 
      milestone.week === week 
        ? { ...milestone, isCompleted: true, completedAt: new Date().toISOString() }
        : milestone
    );
    
    setRoadmapData({
      ...roadmapData,
      milestones: updatedMilestones
    });
  };

  const getProgressPercentage = () => {
    if (!roadmapData) return 0;
    const completed = roadmapData.milestones.filter(m => m.isCompleted).length;
    return (completed / roadmapData.milestones.length) * 100;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-text-secondary">Generating your personalized roadmap...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!roadmapData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary-500" />
            AI-Generated Learning Roadmap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-text-secondary mb-4">
              Let AI create a personalized learning path based on your goals and experience.
            </p>
            <Button onClick={generateRoadmap} leftIcon={<Sparkles className="w-4 h-4" />}>
              Generate My Roadmap
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Roadmap Header */}
      <Card variant="elevated">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-6 h-6 text-primary-500" />
                {roadmapData.title}
              </CardTitle>
              <p className="text-text-secondary mt-1">
                Duration: {roadmapData.duration}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={generateRoadmap}
              leftIcon={<Sparkles className="w-4 h-4" />}
            >
              Regenerate
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">Progress</span>
              <span className="text-text-primary font-medium">
                {Math.round(getProgressPercentage())}% Complete
              </span>
            </div>
            <div className="w-full bg-surface-secondary rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-primary-500 to-primary-400 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${getProgressPercentage()}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Roadmap Timeline */}
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border-primary" />
        
        <div className="space-y-8">
          {roadmapData.milestones.map((milestone, index) => (
            <motion.div
              key={milestone.week}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Timeline Node */}
              <div className={`absolute left-6 w-4 h-4 rounded-full border-2 ${
                milestone.isCompleted 
                  ? 'bg-green-500 border-green-500' 
                  : milestone.week === currentWeek
                  ? 'bg-primary-500 border-primary-500'
                  : 'bg-surface-primary border-border-primary'
              }`} />
              
              {/* Milestone Card */}
              <div className="ml-16">
                <Card 
                  hover 
                  className={`cursor-pointer transition-all ${
                    selectedMilestone?.week === milestone.week 
                      ? 'ring-2 ring-primary-500' 
                      : ''
                  }`}
                  onClick={() => setSelectedMilestone(milestone)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-primary-500">
                            Week {milestone.week}
                          </span>
                          {milestone.isCompleted && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                        <CardTitle className="text-lg">{milestone.title}</CardTitle>
                      </div>
                      
                      {!milestone.isCompleted && milestone.week === currentWeek && (
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            completeMilestone(milestone.week);
                          }}
                          leftIcon={<CheckCircle className="w-4 h-4" />}
                        >
                          Complete
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Topics */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <BookOpen className="w-4 h-4 text-text-tertiary" />
                          <span className="text-sm font-medium text-text-secondary">Topics</span>
                        </div>
                        <div className="space-y-1">
                          {milestone.topics.slice(0, 3).map((topic, i) => (
                            <div key={i} className="text-sm text-text-primary">
                              • {topic}
                            </div>
                          ))}
                          {milestone.topics.length > 3 && (
                            <div className="text-sm text-text-tertiary">
                              +{milestone.topics.length - 3} more
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Projects */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Code className="w-4 h-4 text-text-tertiary" />
                          <span className="text-sm font-medium text-text-secondary">Projects</span>
                        </div>
                        <div className="space-y-1">
                          {milestone.projects.slice(0, 2).map((project, i) => (
                            <div key={i} className="text-sm text-text-primary">
                              • {project}
                            </div>
                          ))}
                          {milestone.projects.length > 2 && (
                            <div className="text-sm text-text-tertiary">
                              +{milestone.projects.length - 2} more
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Resources */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="w-4 h-4 text-text-tertiary" />
                          <span className="text-sm font-medium text-text-secondary">Resources</span>
                        </div>
                        <div className="space-y-1">
                          {milestone.resources.slice(0, 2).map((resource, i) => (
                            <div key={i} className="text-sm text-text-primary">
                              • {resource}
                            </div>
                          ))}
                          {milestone.resources.length > 2 && (
                            <div className="text-sm text-text-tertiary">
                              +{milestone.resources.length - 2} more
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {milestone.isCompleted && milestone.completedAt && (
                      <div className="mt-4 pt-4 border-t border-border-primary">
                        <div className="flex items-center gap-2 text-sm text-green-600">
                          <Trophy className="w-4 h-4" />
                          Completed on {new Date(milestone.completedAt).toLocaleDateString()}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Detailed Milestone View */}
      {selectedMilestone && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedMilestone(null)}
        >
          <Card 
            className="w-full max-w-4xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-5 h-5 text-primary-500" />
                    <span className="text-primary-500 font-medium">
                      Week {selectedMilestone.week}
                    </span>
                  </div>
                  <CardTitle className="text-2xl">{selectedMilestone.title}</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedMilestone(null)}
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Topics */}
                <div>
                  <h3 className="flex items-center gap-2 font-semibold text-text-primary mb-4">
                    <BookOpen className="w-5 h-5 text-primary-500" />
                    Topics to Learn
                  </h3>
                  <div className="space-y-2">
                    {selectedMilestone.topics.map((topic, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 bg-surface-secondary rounded">
                        <ArrowRight className="w-4 h-4 text-text-tertiary" />
                        <span className="text-text-primary">{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Projects */}
                <div>
                  <h3 className="flex items-center gap-2 font-semibold text-text-primary mb-4">
                    <Code className="w-5 h-5 text-primary-500" />
                    Practice Projects
                  </h3>
                  <div className="space-y-2">
                    {selectedMilestone.projects.map((project, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 bg-surface-secondary rounded">
                        <ArrowRight className="w-4 h-4 text-text-tertiary" />
                        <span className="text-text-primary">{project}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Resources */}
                <div>
                  <h3 className="flex items-center gap-2 font-semibold text-text-primary mb-4">
                    <Target className="w-5 h-5 text-primary-500" />
                    Learning Resources
                  </h3>
                  <div className="space-y-2">
                    {selectedMilestone.resources.map((resource, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 bg-surface-secondary rounded">
                        <ArrowRight className="w-4 h-4 text-text-tertiary" />
                        <span className="text-text-primary">{resource}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {!selectedMilestone.isCompleted && (
                <div className="mt-6 pt-6 border-t border-border-primary">
                  <Button
                    onClick={() => {
                      completeMilestone(selectedMilestone.week);
                      setSelectedMilestone(null);
                    }}
                    leftIcon={<CheckCircle className="w-4 h-4" />}
                    className="w-full"
                  >
                    Mark as Complete
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}