'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/layout/Navigation';
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import PerfectAICodeEditor from '@/components/editor/PerfectAICodeEditor';
import AuthModal from '@/components/auth/AuthModal';
import {
  Code2,
  Play,
  Eye,
  Copy,
  Star,
  Search,
  Gamepad2,
  BookOpen,
  Plus,
  Settings,
  Route,
  Target,
  Calendar,
  CheckCircle,
  Download,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { roadmapGenerator, RoadmapData } from '@/lib/roadmapGenerator';

interface CodeSample {
  id: string;
  title: string;
  description: string;
  language: string;
  code: string;
  author: string;
  views: number;
  likes: number;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'algorithm' | 'web' | 'data-science' | 'game' | 'utility';
  createdAt: string;
}

interface GamePreview {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  estimatedTime: string;
  participants: number;
  icon: string;
}

interface RoadmapExample {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  topics: string[];
  progress: number;
  category: string;
}

export default function ExplorePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [selectedSample, setSelectedSample] = useState<CodeSample | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'samples' | 'games' | 'roadmaps' | 'editors'>('samples');
  const [showCreateEditor, setShowCreateEditor] = useState(false);
  const [showCreateRoadmap, setShowCreateRoadmap] = useState(false);
  const [realRoadmaps, setRealRoadmaps] = useState<RoadmapExample[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedRoadmap, setGeneratedRoadmap] = useState<RoadmapData | null>(null);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [roadmapForm, setRoadmapForm] = useState({
    topic: '',
    difficulty: 'intermediate' as 'beginner' | 'intermediate' | 'advanced',
    duration: '3 months',
    goals: ''
  });

  const codeSamples: CodeSample[] = [
    {
      id: '1',
      title: 'Binary Search Algorithm',
      description: 'Efficient search algorithm for sorted arrays',
      language: 'javascript',
      code: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return -1;
}

// Example usage
const numbers = [1, 3, 5, 7, 9, 11, 13, 15];
console.log(binarySearch(numbers, 7)); // Output: 3`,
      author: 'Alex CodeMaster',
      views: 1247,
      likes: 89,
      tags: ['algorithm', 'search', 'optimization'],
      difficulty: 'intermediate',
      category: 'algorithm',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      title: 'React Todo Component',
      description: 'Interactive todo list with hooks',
      language: 'javascript',
      code: `import React, { useState } from 'react';

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, { 
        id: Date.now(), 
        text: input, 
        completed: false 
      }]);
      setInput('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id 
        ? { ...todo, completed: !todo.completed }
        : todo
    ));
  };

  return (
    <div className="todo-app">
      <h1>My Todos</h1>
      <div>
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a todo..."
        />
        <button onClick={addTodo}>Add</button>
      </div>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <input 
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span style={{ 
              textDecoration: todo.completed ? 'line-through' : 'none' 
            }}>
              {todo.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoApp;`,
      author: 'Sarah DevQueen',
      views: 2156,
      likes: 156,
      tags: ['react', 'hooks', 'frontend'],
      difficulty: 'beginner',
      category: 'web',
      createdAt: '2024-01-10'
    },
    {
      id: '3',
      title: 'Data Analysis with Python',
      description: 'Pandas data manipulation and visualization',
      language: 'python',
      code: `import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

# Load and analyze data
def analyze_sales_data(file_path):
    # Read CSV data
    df = pd.read_csv(file_path)
    
    # Basic statistics
    print("Dataset Info:")
    print(f"Shape: {df.shape}")
    print(f"Columns: {list(df.columns)}")
    
    # Clean data
    df = df.dropna()
    df['date'] = pd.to_datetime(df['date'])
    
    # Calculate monthly sales
    monthly_sales = df.groupby(df['date'].dt.to_period('M'))['sales'].sum()
    
    # Visualization
    plt.figure(figsize=(12, 6))
    monthly_sales.plot(kind='bar')
    plt.title('Monthly Sales Trend')
    plt.xlabel('Month')
    plt.ylabel('Sales ($)')
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.show()
    
    return {
        'total_sales': df['sales'].sum(),
        'average_monthly': monthly_sales.mean(),
        'best_month': monthly_sales.idxmax(),
        'growth_rate': calculate_growth_rate(monthly_sales)
    }

def calculate_growth_rate(series):
    return ((series.iloc[-1] - series.iloc[0]) / series.iloc[0]) * 100

# Example usage
# results = analyze_sales_data('sales_data.csv')
# print(f"Total Sales: {results['total_sales']:,.2f}")`,
      author: 'Data Scientist Pro',
      views: 892,
      likes: 67,
      tags: ['python', 'pandas', 'data-analysis'],
      difficulty: 'advanced',
      category: 'data-science',
      createdAt: '2024-01-08'
    }
  ];

  const gamesPreviews: GamePreview[] = [
    {
      id: '1',
      title: 'Bug Hunt Challenge',
      description: 'Find and fix bugs in real code snippets',
      difficulty: 'Medium',
      estimatedTime: '15 min',
      participants: 1247,
      icon: '🐛'
    },
    {
      id: '2',
      title: 'Code Completion Race',
      description: 'Complete missing code faster than AI',
      difficulty: 'Hard',
      estimatedTime: '10 min',
      participants: 892,
      icon: '⚡'
    },
    {
      id: '3',
      title: 'Refactor Master',
      description: 'Improve code quality and performance',
      difficulty: 'Expert',
      estimatedTime: '20 min',
      participants: 567,
      icon: '🔧'
    }
  ];

  const roadmapExamples: RoadmapExample[] = [
    {
      id: '1',
      title: 'Full-Stack JavaScript Developer',
      description: 'Complete path from frontend to backend development',
      duration: '6 months',
      difficulty: 'intermediate',
      topics: ['HTML/CSS', 'JavaScript', 'React', 'Node.js', 'MongoDB', 'APIs'],
      progress: 0,
      category: 'Web Development'
    },
    {
      id: '2',
      title: 'Python Data Science',
      description: 'Master data analysis, visualization, and machine learning',
      duration: '4 months',
      difficulty: 'beginner',
      topics: ['Python Basics', 'Pandas', 'NumPy', 'Matplotlib', 'Scikit-learn', 'Jupyter'],
      progress: 0,
      category: 'Data Science'
    },
    {
      id: '3',
      title: 'DevOps Engineer',
      description: 'Learn deployment, monitoring, and infrastructure management',
      duration: '8 months',
      difficulty: 'advanced',
      topics: ['Linux', 'Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Monitoring'],
      progress: 0,
      category: 'DevOps'
    },
    {
      id: '4',
      title: 'Mobile App Development',
      description: 'Build native and cross-platform mobile applications',
      duration: '5 months',
      difficulty: 'intermediate',
      topics: ['React Native', 'Flutter', 'iOS', 'Android', 'Firebase', 'App Store'],
      progress: 0,
      category: 'Mobile Development'
    }
  ];

  const handleTryEditor = (sample: CodeSample) => {
    // Always set the selected sample to show the editor
    setSelectedSample(sample);

    // If not authenticated, show auth modal for additional features
    if (!isAuthenticated) {
      // Optional: Show auth modal after a delay to let user see the editor first
      setTimeout(() => {
        setAuthMode('signup');
        setIsAuthModalOpen(true);
      }, 2000);
    }
  };

  // Check backend status
  const checkBackendStatus = async () => {
    try {
      const response = await fetch('/api/backend/test');
      const data = await response.json();
      setBackendStatus(data.success ? 'online' : 'offline');
      return data.success;
    } catch (error) {
      setBackendStatus('offline');
      return false;
    }
  };

  // Fetch roadmaps from API
  const fetchRoadmaps = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if backend is available
      const isBackendOnline = await checkBackendStatus();

      if (isBackendOnline) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/roadmap`);

        if (response.ok) {
          const data = await response.json();
          const mappedRoadmaps = data.map((roadmap: any) => ({
            id: roadmap.id.toString(),
            title: roadmap.title,
            description: roadmap.description,
            duration: roadmap.estimatedDuration,
            difficulty: roadmap.difficulty,
            topics: roadmap.topics || [],
            progress: 0,
            category: roadmap.category
          }));
          setRealRoadmaps(mappedRoadmaps);
        } else {
          throw new Error('Failed to fetch roadmaps');
        }
      } else {
        // Backend offline - use sample data
        console.log('Backend offline, using sample roadmaps');
        setError('Backend is offline. Using sample roadmaps. You can still generate AI roadmaps!');
      }
    } catch (error) {
      console.error('Error fetching roadmaps:', error);
      setError('Backend connection failed. Using sample data. AI generation still works!');
    } finally {
      setLoading(false);
    }
  };

  // Load roadmaps when component mounts or when roadmaps tab is selected
  React.useEffect(() => {
    if (activeTab === 'roadmaps') {
      fetchRoadmaps();
    }
  }, [activeTab]);

  const handleGenerateRoadmap = async () => {
    if (!roadmapForm.topic.trim()) {
      setError('Please enter a topic for your roadmap');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('🚀 Sending roadmap generation request:', roadmapForm);

      const response = await fetch('/api/roadmap/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(roadmapForm),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('API error:', errorData);
        throw new Error(errorData.details || errorData.error || 'Failed to generate roadmap');
      }

      const roadmap: RoadmapData = await response.json();
      console.log('✅ Roadmap received:', roadmap.title);

      setGeneratedRoadmap(roadmap);
      setShowCreateRoadmap(false);

      alert('🎉 Roadmap generated successfully! You can now download it.');
    } catch (error: any) {
      console.error('❌ Error generating roadmap:', error);
      const errorMessage = error.message || 'Failed to generate roadmap. Please check your internet connection and try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadRoadmap = (roadmap: RoadmapData) => {
    roadmapGenerator.downloadRoadmap(roadmap);
  };

  const handleCreateRoadmap = async (formData: any) => {
    await handleGenerateRoadmap();

    if (backendStatus === 'online') {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/roadmap`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          },
          body: JSON.stringify({
            title: formData.title,
            description: formData.description,
            category: formData.category,
            difficulty: formData.difficulty,
            estimatedDuration: formData.duration,
            topics: formData.topics || [],
            goals: formData.goals || []
          }),
        });

        if (response.ok) {
          fetchRoadmaps();
        }
      } catch (error) {
        console.log('Could not save to backend, but AI generation succeeded');
      }
    }
  };

  const handleCreateEditor = () => {
    // Here you would typically save the editor configuration
    console.log('Creating custom editor...');
    setShowCreateEditor(false);
    // You could redirect to the editor builder or show success message
  };



  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/signin');
    }
  }, [isAuthenticated, isLoading, router]);

  const filteredSamples = codeSamples.filter(sample => {
    const matchesSearch = sample.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sample.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sample.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || sample.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0118] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // Don't render the page if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-text-primary mb-4">
            Explore & Learn
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Discover code samples, try interactive games, and explore learning roadmaps.
            {!isAuthenticated && ' Sign up to edit, run, and collaborate!'}
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-2 p-2 bg-surface-secondary rounded-xl border border-border-primary">
            {[
              { id: 'samples', label: 'Code Samples', icon: Code2 },
              { id: 'games', label: 'Games Preview', icon: Gamepad2 },
              { id: 'roadmaps', label: 'Learning Roadmaps', icon: BookOpen },
              { id: 'editors', label: 'Custom Editors', icon: Settings }
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => {
                  console.log('Switching to tab:', tab.id);
                  setActiveTab(tab.id as 'samples' | 'games' | 'roadmaps' | 'editors');
                }}
                leftIcon={<tab.icon className="w-4 h-4" />}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Code Samples Tab */}
        {activeTab === 'samples' && (
          <div>
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                <Input
                  type="text"
                  placeholder="Search code samples..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="w-full md:w-64">
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  <option value="algorithm">Algorithms</option>
                  <option value="web">Web Development</option>
                  <option value="data-science">Data Science</option>
                  <option value="game">Game Development</option>
                  <option value="utility">Utilities</option>
                </Select>
              </div>
            </div>

            {/* Code Samples Grid */}
            {selectedSample ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-text-primary">
                    {selectedSample.title}
                  </h2>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedSample(null)}
                  >
                    Back to Samples
                  </Button>
                </div>
                <div className="h-96">
                  <PerfectAICodeEditor
                    initialCode={selectedSample.code}
                    language={selectedSample.language}
                    readOnly={!isAuthenticated}
                    allowFullscreen={true}
                    customizable={isAuthenticated}
                  />
                </div>
                {!isAuthenticated && (
                  <Card variant="elevated">
                    <CardContent className="text-center py-8">
                      <h3 className="text-xl font-bold text-text-primary mb-2">
                        Want to edit and run this code?
                      </h3>
                      <p className="text-text-secondary mb-4">
                        Sign up to unlock the full editor with AI assistance!
                      </p>
                      <Button
                        onClick={() => {
                          setAuthMode('signup');
                          setIsAuthModalOpen(true);
                        }}
                      >
                        Get Started Free
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSamples.map((sample, index) => (
                  <motion.div
                    key={sample.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card hover className="h-full">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{sample.title}</CardTitle>
                            <CardDescription>{sample.description}</CardDescription>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${sample.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                            sample.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                            {sample.difficulty}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center gap-4 text-sm text-text-secondary">
                            <span className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {sample.views}
                            </span>
                            <span className="flex items-center gap-1">
                              <Star className="w-4 h-4" />
                              {sample.likes}
                            </span>
                            <span className="flex items-center gap-1">
                              <Code2 className="w-4 h-4" />
                              {sample.language}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {sample.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-surface-secondary text-text-tertiary text-xs rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleTryEditor(sample)}
                              leftIcon={<Play className="w-4 h-4" />}
                            >
                              {isAuthenticated ? 'Open Editor' : 'Try Editor'}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigator.clipboard.writeText(sample.code)}
                              leftIcon={<Copy className="w-4 h-4" />}
                            >
                              Copy
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Games Preview Tab */}
        {activeTab === 'games' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gamesPreviews.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className="text-center">
                  <CardContent className="py-8">
                    <div className="text-4xl mb-4">{game.icon}</div>
                    <h3 className="text-xl font-bold text-text-primary mb-2">
                      {game.title}
                    </h3>
                    <p className="text-text-secondary mb-4">
                      {game.description}
                    </p>
                    <div className="flex justify-center gap-4 text-sm text-text-tertiary mb-6">
                      <span>{game.difficulty}</span>
                      <span>{game.estimatedTime}</span>
                      <span>{game.participants} players</span>
                    </div>
                    <Button
                      onClick={() => {
                        if (!isAuthenticated) {
                          setAuthMode('signup');
                          setIsAuthModalOpen(true);
                        }
                      }}
                    >
                      {isAuthenticated ? 'Play Now' : 'Sign Up to Play'}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Roadmaps Tab */}
        {activeTab === 'roadmaps' && (
          <div>
            {/* Header with Create Button */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-text-primary mb-2">
                  Learning Roadmaps
                </h2>
                <p className="text-text-secondary">
                  Structured learning paths to master new technologies and skills
                </p>
              </div>
              <Button
                onClick={() => {
                  if (!isAuthenticated) {
                    setAuthMode('signup');
                    setIsAuthModalOpen(true);
                  } else {
                    setShowCreateRoadmap(true);
                  }
                }}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                {isAuthenticated ? 'Create Roadmap' : 'Sign Up to Create'}
              </Button>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                <p className="text-text-secondary">Loading roadmaps...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="mb-6 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                <p className="text-yellow-400">{error}</p>
              </div>
            )}

            {/* Roadmaps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(realRoadmaps.length > 0 ? realRoadmaps : roadmapExamples).map((roadmap, index) => (
                <motion.div
                  key={roadmap.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card hover className="h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{roadmap.title}</CardTitle>
                          <CardDescription>{roadmap.description}</CardDescription>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${roadmap.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                          roadmap.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                          {roadmap.difficulty}
                        </span>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 text-sm text-text-secondary">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {roadmap.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <Target className="w-4 h-4" />
                            {roadmap.category}
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div>
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-text-secondary">Progress</span>
                            <span className="text-text-primary">{roadmap.progress}%</span>
                          </div>
                          <div className="w-full bg-surface-secondary rounded-full h-2">
                            <div
                              className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${roadmap.progress}%` }}
                            />
                          </div>
                        </div>

                        {/* Topics */}
                        <div>
                          <h4 className="text-sm font-medium text-text-secondary mb-2">
                            Key Topics ({roadmap.topics.length})
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {roadmap.topics.slice(0, 4).map((topic) => (
                              <span
                                key={topic}
                                className="px-2 py-1 bg-surface-secondary text-text-tertiary text-xs rounded"
                              >
                                {topic}
                              </span>
                            ))}
                            {roadmap.topics.length > 4 && (
                              <span className="px-2 py-1 bg-surface-secondary text-text-tertiary text-xs rounded">
                                +{roadmap.topics.length - 4} more
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            onClick={() => {
                              if (!isAuthenticated) {
                                setAuthMode('signup');
                                setIsAuthModalOpen(true);
                              }
                            }}
                            leftIcon={<Route className="w-4 h-4" />}
                          >
                            {isAuthenticated ? 'Start Learning' : 'Sign Up to Start'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            leftIcon={<Eye className="w-4 h-4" />}
                          >
                            Preview
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Create Your Own Section */}
            <div className="mt-12 text-center py-12 bg-surface-secondary/50 rounded-2xl border border-border-primary">
              <Route className="w-12 h-12 text-primary-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-text-primary mb-2">
                Create Your Custom Roadmap
              </h3>
              <p className="text-text-secondary mb-6 max-w-md mx-auto">
                Build a personalized learning path tailored to your goals and experience level
              </p>
              <Button
                size="lg"
                onClick={() => {
                  if (!isAuthenticated) {
                    setAuthMode('signup');
                    setIsAuthModalOpen(true);
                  } else {
                    setShowCreateRoadmap(true);
                  }
                }}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                {isAuthenticated ? 'Create Custom Roadmap' : 'Sign Up to Create'}
              </Button>
            </div>
          </div>
        )}

        {/* Custom Editors Tab */}
        {activeTab === 'editors' && (
          <div>
            {/* Header with Create Button */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-text-primary mb-2">
                  Custom Code Editors
                </h2>
                <p className="text-text-secondary">
                  Create and customize your own code editors with personalized settings
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => window.open('/editor-builder', '_blank')}
                  leftIcon={<Settings className="w-4 h-4" />}
                >
                  Editor Builder
                </Button>
                <Button
                  onClick={() => {
                    if (!isAuthenticated) {
                      setAuthMode('signup');
                      setIsAuthModalOpen(true);
                    } else {
                      setShowCreateEditor(true);
                    }
                  }}
                  leftIcon={<Plus className="w-4 h-4" />}
                >
                  {isAuthenticated ? 'Create Editor' : 'Sign Up to Create'}
                </Button>
              </div>
            </div>

            {/* Quick Create Editor Form */}
            {showCreateEditor && isAuthenticated && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8"
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Quick Create Editor</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowCreateEditor(false)}
                      >
                        ×
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Input
                          label="Editor Name"
                          type="text"
                          placeholder="My Custom Editor"
                        />
                      </div>
                      <div>
                        <Select label="Language">
                          <option value="javascript">JavaScript</option>
                          <option value="typescript">TypeScript</option>
                          <option value="python">Python</option>
                          <option value="java">Java</option>
                          <option value="cpp">C++</option>
                        </Select>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Textarea
                        label="Description"
                        placeholder="Describe your custom editor..."
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                      <Button
                        variant="outline"
                        onClick={() => setShowCreateEditor(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleCreateEditor}>
                        Create Editor
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Editor Templates */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  id: '1',
                  name: 'JavaScript Playground',
                  description: 'Perfect for experimenting with modern JavaScript features',
                  language: 'javascript',
                  features: ['Real-time AI', 'Fullscreen', 'Custom themes'],
                  users: 1247
                },
                {
                  id: '2',
                  name: 'Python Data Science',
                  description: 'Optimized for data analysis and machine learning',
                  language: 'python',
                  features: ['Jupyter-like', 'Visualization', 'Libraries'],
                  users: 892
                },
                {
                  id: '3',
                  name: 'React Component Builder',
                  description: 'Build and test React components with live preview',
                  language: 'typescript',
                  features: ['Live preview', 'Component tree', 'Props editor'],
                  users: 567
                },
                {
                  id: '4',
                  name: 'Algorithm Visualizer',
                  description: 'Code and visualize algorithms step by step',
                  language: 'javascript',
                  features: ['Step debugging', 'Visualization', 'Performance'],
                  users: 423
                },
                {
                  id: '5',
                  name: 'Mobile App Prototype',
                  description: 'Prototype mobile apps with React Native',
                  language: 'typescript',
                  features: ['Mobile preview', 'Device simulation', 'Hot reload'],
                  users: 334
                },
                {
                  id: '6',
                  name: 'API Testing Suite',
                  description: 'Test and document APIs with integrated tools',
                  language: 'javascript',
                  features: ['HTTP client', 'Response viewer', 'Documentation'],
                  users: 289
                }
              ].map((template, index) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card hover className="h-full">
                    <CardHeader>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 text-sm text-text-secondary">
                          <span className="flex items-center gap-1">
                            <Code2 className="w-4 h-4" />
                            {template.language}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {template.users} users
                          </span>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-text-secondary mb-2">
                            Features
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {template.features.map((feature) => (
                              <span
                                key={feature}
                                className="px-2 py-1 bg-primary-500/20 text-primary-400 text-xs rounded"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            onClick={() => {
                              if (!isAuthenticated) {
                                setAuthMode('signup');
                                setIsAuthModalOpen(true);
                              }
                            }}
                            leftIcon={<Play className="w-4 h-4" />}
                          >
                            {isAuthenticated ? 'Use Template' : 'Sign Up to Use'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            leftIcon={<Eye className="w-4 h-4" />}
                          >
                            Preview
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Custom Editor Builder CTA */}
            <div className="mt-12 text-center py-12 bg-gradient-to-r from-primary-500/10 to-purple-500/10 rounded-2xl border border-primary-500/20">
              <Settings className="w-12 h-12 text-primary-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-text-primary mb-2">
                Need More Customization?
              </h3>
              <p className="text-text-secondary mb-6 max-w-md mx-auto">
                Use our advanced Editor Builder to create fully customized editors with your exact specifications
              </p>
              <Button
                size="lg"
                onClick={() => window.open('/editor-builder', '_blank')}
                leftIcon={<Settings className="w-4 h-4" />}
              >
                Open Editor Builder
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* AI Roadmap Generator Modal */}
      <AnimatePresence>
        {showCreateRoadmap && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-surface-primary border border-border-primary rounded-2xl p-6 w-full max-w-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-primary-500" />
                  <h2 className="text-2xl font-bold text-text-primary">AI Roadmap Generator</h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowCreateRoadmap(false);
                    setError(null);
                  }}
                >
                  ×
                </Button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    What do you want to learn? *
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., Full-Stack Web Development, Python for Data Science, React Native"
                    value={roadmapForm.topic}
                    onChange={(e) => setRoadmapForm({ ...roadmapForm, topic: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Difficulty Level
                    </label>
                    <Select
                      value={roadmapForm.difficulty}
                      onChange={(e) => setRoadmapForm({ ...roadmapForm, difficulty: e.target.value as any })}
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Duration
                    </label>
                    <Select
                      value={roadmapForm.duration}
                      onChange={(e) => setRoadmapForm({ ...roadmapForm, duration: e.target.value })}
                    >
                      <option value="1 month">1 Month</option>
                      <option value="2 months">2 Months</option>
                      <option value="3 months">3 Months</option>
                      <option value="6 months">6 Months</option>
                      <option value="1 year">1 Year</option>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Learning Goals (Optional)
                  </label>
                  <Textarea
                    placeholder="e.g., Build a portfolio website, Get a job as a developer, Create mobile apps..."
                    rows={3}
                    value={roadmapForm.goals}
                    onChange={(e) => setRoadmapForm({ ...roadmapForm, goals: e.target.value })}
                  />
                </div>

                <div className="p-4 bg-primary-500/10 border border-primary-500/30 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-text-secondary">
                      <p className="font-medium text-primary-400 mb-1">AI-Powered Generation</p>
                      <p>Our AI will create a comprehensive, personalized learning roadmap with weekly milestones, resources, and projects tailored to your goals.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-border-primary">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateRoadmap(false);
                    setError(null);
                  }}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleGenerateRoadmap}
                  disabled={loading || !roadmapForm.topic.trim()}
                  leftIcon={<Sparkles className="w-4 h-4" />}
                >
                  {loading ? 'Generating...' : 'Generate Roadmap'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Generated Roadmap Preview Modal */}
      <AnimatePresence>
        {generatedRoadmap && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-surface-primary border border-border-primary rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-text-primary">{generatedRoadmap.title}</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setGeneratedRoadmap(null)}
                >
                  ×
                </Button>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-text-secondary">{generatedRoadmap.description}</p>
                  <div className="flex items-center gap-4 mt-4 text-sm">
                    <span className="flex items-center gap-1 text-text-tertiary">
                      <Calendar className="w-4 h-4" />
                      {generatedRoadmap.duration}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${generatedRoadmap.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                      generatedRoadmap.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                      {generatedRoadmap.difficulty}
                    </span>
                    <span className="text-text-tertiary">{generatedRoadmap.category}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-text-primary mb-3">Weekly Milestones</h3>
                  <div className="space-y-3">
                    {generatedRoadmap.milestones.slice(0, 3).map((milestone) => (
                      <div key={milestone.week} className="p-4 bg-surface-secondary rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-1 bg-primary-500/20 text-primary-400 text-xs font-medium rounded">
                            Week {milestone.week}
                          </span>
                          <h4 className="font-medium text-text-primary">{milestone.title}</h4>
                        </div>
                        <p className="text-sm text-text-secondary">{milestone.description}</p>
                      </div>
                    ))}
                    {generatedRoadmap.milestones.length > 3 && (
                      <p className="text-sm text-text-tertiary text-center">
                        + {generatedRoadmap.milestones.length - 3} more milestones in the full roadmap
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-text-primary mb-3">Key Topics</h3>
                  <div className="flex flex-wrap gap-2">
                    {generatedRoadmap.topics.map((topic) => (
                      <span
                        key={topic}
                        className="px-3 py-1 bg-surface-secondary text-text-tertiary text-sm rounded-full"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-border-primary">
                <Button
                  variant="outline"
                  onClick={() => setGeneratedRoadmap(null)}
                >
                  Close
                </Button>
                <Button
                  onClick={() => handleDownloadRoadmap(generatedRoadmap)}
                  leftIcon={<Download className="w-4 h-4" />}
                >
                  Download Roadmap
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultMode={authMode}
      />
    </div>
  );
}