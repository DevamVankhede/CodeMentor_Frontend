'use client';
import React, { useState } from 'react';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import {
  Sparkles, Bug, RefreshCw, MessageSquare, Zap, CheckCircle,
  AlertTriangle, Info, Loader2, Copy, Check
} from 'lucide-react';

interface AICodeEditorProps {
  initialCode?: string;
  language?: string;
  onCodeChange?: (code: string) => void;
}

export default function AICodeEditor({
  initialCode = '',
  language = 'python',
  onCodeChange
}: AICodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [analysis, setAnalysis] = useState<any>(null);
  const [explanation, setExplanation] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    onCodeChange?.(newCode);
  };

  const analyzeCode = async () => {
    setLoading(true);
    setActiveFeature('analyze');
    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      });
      const data = await response.json();
      setAnalysis(data);
      if (data?.summary) {
        setConsoleOutput([`Analysis summary: ${data.summary}`]);
      }
    } catch (error) {
      console.error('Error analyzing code:', error);
    } finally {
      setLoading(false);
    }
  };

  const refactorCode = async () => {
    setLoading(true);
    setActiveFeature('refactor');
    try {
      const response = await fetch('/api/ai/refactor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      });
      const data = await response.json();
      if (data.refactoredCode) {
        handleCodeChange(data.refactoredCode);
        setConsoleOutput([
          'Refactor complete. Preview the updated code above.'
        ]);
      }
    } catch (error) {
      console.error('Error refactoring code:', error);
    } finally {
      setLoading(false);
      setActiveFeature(null);
    }
  };

  const explainCode = async () => {
    setLoading(true);
    setActiveFeature('explain');
    try {
      const response = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      });
      const data = await response.json();
      setExplanation(data);
      if (data?.explanation) {
        setConsoleOutput(data.explanation.split('\n'));
      }
    } catch (error) {
      console.error('Error explaining code:', error);
    } finally {
      setLoading(false);
    }
  };

  const fixBugs = async () => {
    setLoading(true);
    setActiveFeature('fix');
    try {
      const response = await fetch('/api/ai/fix-bugs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      });
      const data = await response.json();
      if (data.code) {
        handleCodeChange(data.code);
        setConsoleOutput(['Bugs fixed. Review the changes in your code.']);
      }
    } catch (error) {
      console.error('Error fixing bugs:', error);
    } finally {
      setLoading(false);
      setActiveFeature(null);
    }
  };

  const improveQuality = async (aspect: string) => {
    setLoading(true);
    setActiveFeature('quality');
    try {
      const response = await fetch('/api/ai/improve-quality', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language, aspect }),
      });
      const data = await response.json();
      if (data.code) {
        handleCodeChange(data.code);
        setConsoleOutput([`Quality improved for: ${aspect}`]);
      }
    } catch (error) {
      console.error('Error improving quality:', error);
    } finally {
      setLoading(false);
      setActiveFeature(null);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return AlertTriangle;
      case 'medium': return Info;
      case 'low': return CheckCircle;
      default: return Info;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Code Editor */}
      <div className="lg:col-span-2 flex flex-col gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-text-primary">Code Editor</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-text-secondary capitalize">{language}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={copyCode}
                  leftIcon={copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                >
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </div>
            </div>

            <textarea
              value={code}
              onChange={(e) => handleCodeChange(e.target.value)}
              className="w-full h-96 bg-surface-secondary text-text-primary rounded-lg p-4 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 border border-border-primary"
              placeholder="Paste your code here..."
            />

            {/* AI Action Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              <Button
                onClick={analyzeCode}
                disabled={loading || !code}
                variant="outline"
                size="sm"
                leftIcon={loading && activeFeature === 'analyze' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                fullWidth
              >
                Analyze
              </Button>

              <Button
                onClick={fixBugs}
                disabled={loading || !code}
                variant="outline"
                size="sm"
                leftIcon={loading && activeFeature === 'fix' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bug className="w-4 h-4" />}
                fullWidth
              >
                Fix Bugs
              </Button>

              <Button
                onClick={refactorCode}
                disabled={loading || !code}
                variant="outline"
                size="sm"
                leftIcon={loading && activeFeature === 'refactor' ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                fullWidth
              >
                Refactor
              </Button>

              <Button
                onClick={explainCode}
                disabled={loading || !code}
                variant="outline"
                size="sm"
                leftIcon={loading && activeFeature === 'explain' ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4" />}
                fullWidth
              >
                Explain
              </Button>
            </div>

            {/* Quality Improvements */}
            <div className="mt-3">
              <p className="text-sm text-text-secondary mb-2">Improve Quality:</p>
              <div className="flex flex-wrap gap-2">
                {['readability', 'performance', 'maintainability'].map((aspect) => (
                  <Button
                    key={aspect}
                    onClick={() => improveQuality(aspect)}
                    disabled={loading || !code}
                    variant="ghost"
                    size="sm"
                    leftIcon={<Zap className="w-3 h-3" />}
                  >
                    {aspect}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analysis + Console Panel */}
      <div className="space-y-6">
        {/* Execution / Output Console */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-text-primary flex items-center gap-2">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              Console
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 rounded-lg bg-surface-secondary border border-border-primary p-3 font-mono text-xs overflow-auto text-text-primary">
              {consoleOutput.length === 0 ? (
                <p className="text-text-tertiary">
                  AI messages and important results will appear here.
                </p>
              ) : (
                consoleOutput.map((line, idx) => (
                  <div key={idx} className="whitespace-pre-wrap">
                    {line}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Code Analysis */}
        {analysis && (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary-500" />
                Code Analysis
              </h3>

              {/* Quality Scores */}
              <div className="space-y-3 mb-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-text-secondary">Overall Score</span>
                    <span className="text-sm font-bold text-text-primary">{analysis.quality?.score || 0}/100</span>
                  </div>
                  <div className="w-full bg-surface-secondary rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full transition-all"
                      style={{ width: `${analysis.quality?.score || 0}%` }}
                    />
                  </div>
                </div>

                {['readability', 'maintainability', 'performance'].map((metric) => (
                  <div key={metric}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-text-tertiary capitalize">{metric}</span>
                      <span className="text-xs font-semibold text-text-secondary">
                        {analysis.quality?.[metric] || 0}/100
                      </span>
                    </div>
                    <div className="w-full bg-surface-secondary rounded-full h-1.5">
                      <div
                        className="bg-blue-500 h-1.5 rounded-full transition-all"
                        style={{ width: `${analysis.quality?.[metric] || 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Bugs */}
              {analysis.bugs && analysis.bugs.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-text-primary mb-2">Issues Found</h4>
                  <div className="space-y-2">
                    {analysis.bugs.map((bug: any, idx: number) => {
                      const Icon = getSeverityIcon(bug.severity);
                      return (
                        <div key={idx} className="p-3 bg-surface-secondary rounded-lg">
                          <div className="flex items-start gap-2">
                            <Icon className={`w-4 h-4 mt-0.5 ${getSeverityColor(bug.severity)}`} />
                            <div className="flex-1">
                              <p className="text-sm text-text-primary font-medium">Line {bug.line}</p>
                              <p className="text-xs text-text-secondary mt-1">{bug.description}</p>
                              <p className="text-xs text-primary-500 mt-1">{bug.suggestion}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Suggestions */}
              {analysis.suggestions && analysis.suggestions.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-text-primary mb-2">Suggestions</h4>
                  <ul className="space-y-2">
                    {analysis.suggestions.map((suggestion: string, idx: number) => (
                      <li key={idx} className="text-xs text-text-secondary flex items-start gap-2">
                        <span className="text-primary-500 mt-0.5">•</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Code Explanation */}
        {explanation && (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-500" />
                Code Explanation
              </h3>

              <div className="mb-4">
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${explanation.complexity === 'beginner' ? 'bg-green-500/20 text-green-400' :
                    explanation.complexity === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                  }`}>
                  {explanation.complexity}
                </span>
              </div>

              <p className="text-sm text-text-secondary mb-4">{explanation.explanation}</p>

              {explanation.keyPoints && explanation.keyPoints.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-text-primary mb-2">Key Points</h4>
                  <ul className="space-y-2">
                    {explanation.keyPoints.map((point: string, idx: number) => (
                      <li key={idx} className="text-xs text-text-secondary flex items-start gap-2">
                        <CheckCircle className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        {!analysis && !explanation && (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-text-primary mb-4">How to Use</h3>
              <ul className="space-y-3 text-sm text-text-secondary">
                <li className="flex items-start gap-2">
                  <span className="text-primary-500">1.</span>
                  <span>Paste or write your code in the editor</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-500">2.</span>
                  <span>Click "Analyze" to get code quality insights</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-500">3.</span>
                  <span>Use "Fix Bugs" to automatically fix issues</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-500">4.</span>
                  <span>Click "Refactor" to improve code structure</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-500">5.</span>
                  <span>Use "Explain" to understand what the code does</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
