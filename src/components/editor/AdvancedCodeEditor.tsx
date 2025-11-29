'use client';
import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { motion, AnimatePresence } from 'framer-motion';
import RoyalCard from '../ui/RoyalCard';
import { RoyalButton } from '../ui/RoyalButton';

interface CodeEditorProps {
  initialCode?: string;
  language?: string;
  onChange?: (code: string) => void;
}

const AdvancedCodeEditor: React.FC<CodeEditorProps> = ({
  initialCode = '',
  language = 'javascript',
  onChange
}) => {
  const [code, setCode] = useState(initialCode);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const editorOptions = {
    theme: 'vs-dark',
    fontSize: 14,
    fontFamily: 'JetBrains Mono',
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    automaticLayout: true,
    padding: { top: 20, bottom: 20 },
  };

  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
      onChange?.(value);
    }
  };

  const analyzeCode = async () => {
    if (!code.trim()) {
      setAiSuggestions(['Please enter some code to analyze']);
      return;
    }

    setIsAnalyzing(true);
    setAiSuggestions([]);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ai/analyze-bugs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code,
          language: language
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          const suggestions = result.data.bugs?.map((bug: { line: number; message: string; suggestion: string }) => 
            `Line ${bug.line}: ${bug.message} - ${bug.suggestion}`
          ) || [];
          
          if (suggestions.length === 0) {
            suggestions.push('✅ No issues found! Your code looks great!');
          }
          
          setAiSuggestions([
            result.data.summary || 'Analysis completed',
            ...suggestions
          ]);
        } else {
          setAiSuggestions(['Analysis completed but no specific issues found']);
        }
      } else {
        // Fallback to demo suggestions if API is not available
        setAiSuggestions([
          '🔌 Backend API not connected - showing demo suggestions:',
          'Consider adding error handling',
          'Variable naming could be improved',
          'Performance optimization available'
        ]);
      }
    } catch (error) {
      console.error('API Error:', error);
      // Fallback to demo suggestions
      setAiSuggestions([
        '🔌 Backend API not available - showing demo suggestions:',
        'Consider adding error handling',
        'Variable naming could be improved',
        'Performance optimization available'
      ]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="h-full flex gap-4">
      {/* Main Editor */}
      <RoyalCard>
        <div className="bg-gradient-to-r from-royal-600/20 to-gaming-secondary/20 p-4 border-b border-white/10 rounded-t-2xl -m-6 mb-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-gaming font-bold text-lg">
              🎯 Code Arena
            </h3>
            <div className="flex gap-2">
              <RoyalButton
                onClick={analyzeCode}
              >
                {isAnalyzing ? '🔍 Analyzing...' : '🤖 AI Analyze'}
              </RoyalButton>
            </div>
          </div>
        </div>
        <div className="h-96">
          <Editor
            height="100%"
            defaultLanguage={language}
            value={code}
            options={editorOptions}
            onChange={handleCodeChange}
            theme="vs-dark"
          />
        </div>
      </RoyalCard>

      {/* AI Suggestions Panel */}
      <AnimatePresence>
        {aiSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="w-80"
          >
            <RoyalCard>
              <h4 className="text-neon-blue font-gaming font-bold mb-4">
                ⚡ AI Insights
              </h4>
              <div className="space-y-3">
                {aiSuggestions.map((suggestion, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 bg-gradient-to-r from-royal-500/20 to-gaming-accent/20 rounded-lg border border-neon-purple/30"
                  >
                    <p className="text-white text-sm">{suggestion}</p>
                  </motion.div>
                ))}
              </div>
            </RoyalCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdvancedCodeEditor;