"use client";
import React, { useState, useEffect } from "react";
import { Bug, Clock, Trophy, Play, RotateCcw, CheckCircle, XCircle, Lightbulb, Star, Award, ArrowLeft, Code2, RefreshCw, Zap } from "lucide-react";
import Button from "@/components/ui/Button";
import Card, { CardContent } from "@/components/ui/Card";

interface Challenge {
  id: number;
  title: string;
  description: string;
  code: string;
  bugLine: number;
  bugDescription: string;
  solution: string;
  xpReward: number;
  timeLimit: number;
}

interface BugHuntGameProps {
  difficulty: "easy" | "medium" | "hard";
  language: string;
  gameType: string;
  onGameComplete: (score: number, timeSpent: number) => void;
}

export default function BugHuntGame({ difficulty, language, gameType, onGameComplete }: BugHuntGameProps) {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChallenges();
  }, [difficulty, language]);

  useEffect(() => {
    if (gameStarted && !gameEnded && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameStarted, gameEnded, timeLeft]);

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/game/challenges?gameType=${gameType}&difficulty=${difficulty}&language=${language}`);
      if (response.ok) {
        const data = await response.json();
        setChallenges(data);
        if (data.length > 0) {
          setCurrentChallenge(data[0]);
          setTimeLeft(data[0].timeLimit);
        }
      }
    } catch (error) {
      console.error('Error fetching challenges:', error);
      // Fallback to mock data
      const mockData = getMockChallenges(gameType, difficulty);
      setChallenges(mockData);
      if (mockData.length > 0) {
        setCurrentChallenge(mockData[0]);
        setTimeLeft(mockData[0].timeLimit);
      }
    } finally {
      setLoading(false);
    }
  };

  const getMockChallenges = (type: string, diff: string) => {
    const challenges = {
      'bug-hunt': [
        {
          id: 1,
          title: 'Missing Semicolon',
          description: 'Find and fix the missing semicolon',
          code: `function greet(name) {\n  console.log("Hello, " + name)\n  return true;\n}`,
          bugLine: 2,
          bugDescription: 'Missing semicolon at end of line',
          solution: `function greet(name) {\n  console.log("Hello, " + name);\n  return true;\n}`,
          xpReward: 50,
          timeLimit: 60,
        },
      ],
      'code-completion': [
        {
          id: 1,
          title: 'Complete the Function',
          description: 'Complete the missing parts of this function',
          code: `function calculateSum(arr) {\n  let sum = 0;\n  // Complete this loop\n  for (let i = 0; i < arr.length; i++) {\n    // Add your code here\n  }\n  return sum;\n}`,
          bugLine: 5,
          bugDescription: 'Add the array element to sum',
          solution: `function calculateSum(arr) {\n  let sum = 0;\n  for (let i = 0; i < arr.length; i++) {\n    sum += arr[i];\n  }\n  return sum;\n}`,
          xpReward: 75,
          timeLimit: 90,
        },
      ],
      'refactor-challenge': [
        {
          id: 1,
          title: 'Refactor This Code',
          description: 'Improve this messy code',
          code: `function checkAge(age) {\n  if (age >= 18) {\n    if (age < 65) {\n      return "adult";\n    } else {\n      return "senior";\n    }\n  } else {\n    return "minor";\n  }\n}`,
          bugLine: 2,
          bugDescription: 'Simplify the nested conditions',
          solution: `function checkAge(age) {\n  if (age < 18) return "minor";\n  if (age >= 65) return "senior";\n  return "adult";\n}`,
          xpReward: 100,
          timeLimit: 120,
        },
      ],
      'speed-coding': [
        {
          id: 1,
          title: 'Quick Fix',
          description: 'Fix this code as fast as possible',
          code: `function reverseString(str) {\n  return str.split('').reverse().join('')\n}`,
          bugLine: 2,
          bugDescription: 'Missing semicolon',
          solution: `function reverseString(str) {\n  return str.split('').reverse().join('');\n}`,
          xpReward: 60,
          timeLimit: 30,
        },
      ],
    };
    return challenges[type as keyof typeof challenges] || challenges['bug-hunt'];
  };

  const startGame = () => {
    setGameStarted(true);
    setGameEnded(false);
    setScore(0);
    setAttempts(0);
    setCorrectAnswers(0);
    setCurrentLevel(0);
    setShowHint(false);
    setShowSolution(false);
    if (challenges.length > 0) {
      setCurrentChallenge(challenges[0]);
      setTimeLeft(challenges[0].timeLimit);
    }
  };

  const handleLineClick = (lineNumber: number) => {
    if (gameEnded || !gameStarted) return;
    setSelectedLine(lineNumber);
  };

  const checkAnswer = () => {
    if (!currentChallenge || selectedLine === null) return;

    setAttempts(attempts + 1);

    if (selectedLine === currentChallenge.bugLine) {
      const timeBonus = Math.floor(timeLeft / 10);
      const levelScore = 100 + timeBonus;
      setScore(score + levelScore);
      setCorrectAnswers(correctAnswers + 1);

      if (currentLevel + 1 < challenges.length) {
        setTimeout(() => {
          nextLevel();
        }, 1500);
      } else {
        endGame(true);
      }
    } else {
      setScore(Math.max(0, score - 10));
    }
  };

  const nextLevel = () => {
    const nextLevelIndex = currentLevel + 1;
    if (nextLevelIndex < challenges.length) {
      setCurrentLevel(nextLevelIndex);
      setCurrentChallenge(challenges[nextLevelIndex]);
      setTimeLeft(challenges[nextLevelIndex].timeLimit);
      setSelectedLine(null);
      setShowHint(false);
      setShowSolution(false);
    }
  };

  const handleTimeUp = () => {
    endGame(false);
  };

  const endGame = (completed: boolean) => {
    setGameEnded(true);
    setGameStarted(false);
    const timeSpent = challenges.reduce((acc, c) => acc + c.timeLimit, 0) - timeLeft;
    onGameComplete(score, timeSpent);
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameEnded(false);
    setScore(0);
    setAttempts(0);
    setCorrectAnswers(0);
    setCurrentLevel(0);
    setSelectedLine(null);
    setShowHint(false);
    setShowSolution(false);
    if (challenges.length > 0) {
      setCurrentChallenge(challenges[0]);
      setTimeLeft(challenges[0].timeLimit);
    }
  };

  const getGameTitle = () => {
    const titles: Record<string, string> = {
      'bug-hunt': 'AI Bug Hunt',
      'code-completion': 'Code Completion Race',
      'refactor-challenge': 'Refactor Master',
      'speed-coding': 'Speed Coding Challenge',
    };
    return titles[gameType] || 'AI Bug Hunt';
  };

  const getGameIcon = () => {
    const icons: Record<string, any> = {
      'bug-hunt': Bug,
      'code-completion': Code2,
      'refactor-challenge': RefreshCw,
      'speed-coding': Zap,
    };
    return icons[gameType] || Bug;
  };

  const getGameGradient = () => {
    const gradients: Record<string, string> = {
      'bug-hunt': 'from-red-500 to-pink-600',
      'code-completion': 'from-blue-500 to-cyan-600',
      'refactor-challenge': 'from-green-500 to-emerald-600',
      'speed-coding': 'from-yellow-500 to-orange-600',
    };
    return gradients[gameType] || 'from-red-500 to-pink-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0118] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading challenges...</p>
        </div>
      </div>
    );
  }

  if (!gameStarted && !gameEnded) {
    const GameIcon = getGameIcon();
    return (
      <div className="min-h-screen bg-[#0a0118] flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className={`w-20 h-20 bg-gradient-to-br ${getGameGradient()} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                <GameIcon className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">{getGameTitle()}</h1>
              <p className="text-text-secondary">Test your coding skills and earn XP</p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between p-4 bg-surface-secondary rounded-lg">
                <span className="text-text-secondary">Difficulty</span>
                <span className="text-text-primary font-semibold capitalize">{difficulty}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-surface-secondary rounded-lg">
                <span className="text-text-secondary">Language</span>
                <span className="text-text-primary font-semibold capitalize">{language}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-surface-secondary rounded-lg">
                <span className="text-text-secondary">Levels</span>
                <span className="text-text-primary font-semibold">{challenges.length}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-surface-secondary rounded-lg">
                <span className="text-text-secondary">Total XP</span>
                <span className="text-text-primary font-semibold">{challenges.reduce((acc, c) => acc + c.xpReward, 0)} XP</span>
              </div>
            </div>

            <Button onClick={startGame} fullWidth size="lg" leftIcon={<Play className="w-5 h-5" />}>
              Start Challenge
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (gameEnded) {
    const accuracy = attempts > 0 ? Math.round((correctAnswers / attempts) * 100) : 0;
    return (
      <div className="min-h-screen bg-[#0a0118] flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">Challenge Complete!</h1>
              <p className="text-text-secondary">Great job finding those bugs!</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-6 bg-surface-secondary rounded-lg text-center">
                <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <p className="text-text-secondary text-sm mb-1">Final Score</p>
                <p className="text-3xl font-bold text-text-primary">{score}</p>
              </div>
              <div className="p-6 bg-surface-secondary rounded-lg text-center">
                <Award className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p className="text-text-secondary text-sm mb-1">Accuracy</p>
                <p className="text-3xl font-bold text-text-primary">{accuracy}%</p>
              </div>
              <div className="p-6 bg-surface-secondary rounded-lg text-center">
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-text-secondary text-sm mb-1">Bugs Found</p>
                <p className="text-3xl font-bold text-text-primary">{correctAnswers}/{challenges.length}</p>
              </div>
              <div className="p-6 bg-surface-secondary rounded-lg text-center">
                <Trophy className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <p className="text-text-secondary text-sm mb-1">XP Earned</p>
                <p className="text-3xl font-bold text-text-primary">{Math.round(score * 0.5)}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Button onClick={resetGame} fullWidth variant="outline" leftIcon={<RotateCcw className="w-5 h-5" />}>
                Play Again
              </Button>
              <Button onClick={() => window.location.href = '/games'} fullWidth leftIcon={<ArrowLeft className="w-5 h-5" />}>
                Back to Games
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentChallenge) return null;

  const codeLines = currentChallenge.code.split('\n');
  const isCorrectLine = selectedLine === currentChallenge.bugLine;

  return (
    <div className="min-h-screen bg-[#0a0118] p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">{currentChallenge.title}</h1>
            <p className="text-white/60">{currentChallenge.description}</p>
          </div>
          <Button variant="outline" onClick={() => window.location.href = '/games'} leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Exit
          </Button>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-text-tertiary text-xs">Time Left</p>
                  <p className="text-text-primary font-bold">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-text-tertiary text-xs">Score</p>
                  <p className="text-text-primary font-bold">{score}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Trophy className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-text-tertiary text-xs">Level</p>
                  <p className="text-text-primary font-bold">{currentLevel + 1}/{challenges.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Bug className="w-5 h-5 text-red-400" />
                <div>
                  <p className="text-text-tertiary text-xs">Found</p>
                  <p className="text-text-primary font-bold">{correctAnswers}/{challenges.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Code Editor */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-text-primary">Find the Bug</h3>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setShowHint(!showHint)} leftIcon={<Lightbulb className="w-4 h-4" />}>
                      {showHint ? 'Hide' : 'Show'} Hint
                    </Button>
                  </div>
                </div>

                <div className="bg-slate-950 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                  {codeLines.map((line, index) => {
                    const lineNumber = index + 1;
                    const isSelected = selectedLine === lineNumber;
                    const isBugLine = lineNumber === currentChallenge.bugLine;

                    return (
                      <div
                        key={index}
                        onClick={() => handleLineClick(lineNumber)}
                        className={`flex items-start gap-4 px-3 py-2 rounded cursor-pointer transition-all duration-200 ${isSelected
                          ? isBugLine
                            ? 'bg-green-500/20 border-l-4 border-green-500'
                            : 'bg-red-500/20 border-l-4 border-red-500'
                          : 'hover:bg-slate-800/50'
                          }`}
                      >
                        <span className="text-slate-500 select-none min-w-[2rem] text-right">{lineNumber}</span>
                        <span className="text-slate-200 flex-1">{line || ' '}</span>
                        {isSelected && (
                          <span className="text-xs">
                            {isBugLine ? <CheckCircle className="w-4 h-4 text-green-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 flex gap-3">
                  <Button onClick={checkAnswer} disabled={selectedLine === null} fullWidth>
                    Check Answer
                  </Button>
                  <Button onClick={() => setShowSolution(!showSolution)} variant="outline">
                    {showSolution ? 'Hide' : 'Show'} Solution
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Hints & Info */}
          <div className="space-y-6">
            {showHint && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="w-5 h-5 text-yellow-400" />
                    <h3 className="font-bold text-text-primary">Hint</h3>
                  </div>
                  <p className="text-text-secondary">{currentChallenge.bugDescription}</p>
                </CardContent>
              </Card>
            )}

            {showSolution && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <h3 className="font-bold text-text-primary">Solution</h3>
                  </div>
                  <div className="bg-slate-950 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                    {currentChallenge.solution.split('\n').map((line, index) => (
                      <div key={index} className="text-slate-200">{line}</div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-text-primary mb-4">Instructions</h3>
                <ul className="space-y-2 text-text-secondary text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-primary-500">1.</span>
                    <span>Read the code carefully</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-500">2.</span>
                    <span>Click on the line with the bug</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-500">3.</span>
                    <span>Click "Check Answer" to verify</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-500">4.</span>
                    <span>Use hints if you're stuck</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
