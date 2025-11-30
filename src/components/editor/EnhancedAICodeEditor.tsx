"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Save,
  Share2,
  Zap,
  Bug,
  RefreshCw,
  MessageSquare,
  Users,
  Eye,
  Lightbulb,
  Code2,
  Sparkles,
  Terminal,
  Settings,
  Copy,
  Check,
  Wand2,
  Brain,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";

interface EnhancedAICodeEditorProps {
  initialCode?: string;
  language?: string;
  readOnly?: boolean;
  collaborative?: boolean;
  roomId?: string;
  onCodeChange?: (code: string) => void;
}

interface AIResponse {
  type: "suggestion" | "bug" | "explanation" | "refactor";
  content: string;
  loading?: boolean;
  suggestions?: Array<{
    line: number;
    type: string;
    message: string;
    severity: "error" | "warning" | "info";
  }>;
}

interface CodeLine {
  number: number;
  content: string;
  hasError?: boolean;
  hasWarning?: boolean;
  hasSuggestion?: boolean;
}

export default function EnhancedAICodeEditor({
  initialCode = '// Welcome to CodeMentor AI Editor!\n// Start typing to see real-time AI assistance\n\nfunction greetUser(name) {\n  console.log(`Hello, ${name}! Ready to code?`);\n}\n\ngreetUser("Developer");',
  language = "javascript",
  readOnly = false,
  collaborative = false,
  roomId,
  onCodeChange,
}: EnhancedAICodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [aiResponse, setAIResponse] = useState<AIResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [collaborators, setCollaborators] = useState<string[]>([]);
  const [showAIPanel, setShowAIPanel] = useState(true);
  const [activeTab, setActiveTab] = useState<"ai" | "console" | "chat">("ai");
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [realTimeAnalysis, setRealTimeAnalysis] = useState(true);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const analysisTimeoutRef = useRef<NodeJS.Timeout>();

  // Real-time code analysis with debouncing
  const analyzeCodeRealTime = useCallback(
    async (codeToAnalyze: string) => {
      if (!codeToAnalyze.trim() || !realTimeAnalysis) return;

      // Clear previous timeout
      if (analysisTimeoutRef.current) {
        clearTimeout(analysisTimeoutRef.current);
      }

      // Debounce analysis by 1 second
      analysisTimeoutRef.current = setTimeout(async () => {
        try {
          // Simulate AI analysis with dynamic responses based on code content
          const analysis = performStaticAnalysis(codeToAnalyze, language);

          setAIResponse({
            type: "suggestion",
            content: analysis.summary,
            suggestions: analysis.suggestions,
          });
        } catch (error) {
          console.error("Real-time analysis error:", error);
        }
      }, 1000);
    },
    [language, realTimeAnalysis]
  );

  // Static code analysis function
  const performStaticAnalysis = (code: string, lang: string) => {
    const lines = code.split("\n");
    const suggestions: Array<{
      line: number;
      type: string;
      message: string;
      severity: "error" | "warning" | "info";
    }> = [];

    let summary = "✨ **AI Code Analysis**\n\n";

    // JavaScript-specific analysis
    if (lang === "javascript" || lang === "typescript") {
      lines.forEach((line, index) => {
        const lineNum = index + 1;

        // Check for common issues
        if (line.includes("var ")) {
          suggestions.push({
            line: lineNum,
            type: "Best Practice",
            message: 'Consider using "let" or "const" instead of "var"',
            severity: "warning",
          });
        }

        if (line.includes("console.log") && !line.includes("//")) {
          suggestions.push({
            line: lineNum,
            type: "Debug Code",
            message: "Remove console.log before production",
            severity: "info",
          });
        }

        if (line.includes("==") && !line.includes("===")) {
          suggestions.push({
            line: lineNum,
            type: "Type Safety",
            message: "Use strict equality (===) instead of loose equality (==)",
            severity: "warning",
          });
        }

        if (line.includes("function") && !line.includes("{")) {
          suggestions.push({
            line: lineNum,
            type: "Syntax",
            message: "Function declaration looks incomplete",
            severity: "error",
          });
        }
      });

      // Generate dynamic summary
      const functionCount = (code.match(/function\s+\w+/g) || []).length;
      const variableCount = (code.match(/(let|const|var)\s+\w+/g) || []).length;
      const commentCount = (code.match(/\/\/.*$/gm) || []).length;

      summary += `📊 **Code Statistics:**\n`;
      summary += `• Functions: ${functionCount}\n`;
      summary += `• Variables: ${variableCount}\n`;
      summary += `• Comments: ${commentCount}\n`;
      summary += `• Lines: ${lines.length}\n\n`;

      if (suggestions.length === 0) {
        summary += `🎉 **Great job!** Your code looks clean and follows good practices.\n\n`;
        summary += `💡 **Suggestions:**\n`;
        summary += `• Add more comments to explain complex logic\n`;
        summary += `• Consider adding error handling\n`;
        summary += `• Think about code reusability\n`;
      } else {
        summary += `🔍 **Found ${suggestions.length} suggestions for improvement:**\n\n`;
        suggestions.forEach((suggestion, i) => {
          const icon =
            suggestion.severity === "error"
              ? "❌"
              : suggestion.severity === "warning"
              ? "⚠️"
              : "ℹ️";
          summary += `${icon} **Line ${suggestion.line}:** ${suggestion.message}\n`;
        });
      }
    }

    return { summary, suggestions };
  };

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    onCodeChange?.(newCode);

    // Trigger real-time analysis
    analyzeCodeRealTime(newCode);

    if (collaborative && roomId) {
      // Send code changes to other collaborators via SignalR
    }
  };

  const analyzeCode = async () => {
    if (!code.trim()) return;

    setIsAnalyzing(true);
    setAIResponse({ type: "suggestion", content: "", loading: true });
    setActiveTab("ai");

    try {
      // Simulate API call with enhanced analysis
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const analysis = performStaticAnalysis(code, language);

      setAIResponse({
        type: "suggestion",
        content:
          analysis.summary +
          "\n\n🚀 **AI Recommendations:**\n• Consider adding TypeScript for better type safety\n• Implement unit tests for your functions\n• Use async/await for better asynchronous code handling",
        suggestions: analysis.suggestions,
      });

      setShowAIPanel(true);
    } catch (error) {
      console.error("Error analyzing code:", error);
      setAIResponse({
        type: "suggestion",
        content:
          "❌ Sorry, I couldn't analyze your code right now. Please try again.",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const findBugs = async () => {
    if (!code.trim()) return;

    setIsAnalyzing(true);
    setAIResponse({ type: "bug", content: "", loading: true });
    setActiveTab("ai");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const bugs = [];
      const lines = code.split("\n");

      lines.forEach((line, index) => {
        if (line.includes("undefinedVariable")) {
          bugs.push(
            `Line ${index + 1}: Undefined variable 'undefinedVariable'`
          );
        }
        if (line.includes("function()") && !line.includes("{")) {
          bugs.push(`Line ${index + 1}: Missing function body`);
        }
      });

      let bugReport = "🐛 **Bug Analysis Complete**\n\n";

      if (bugs.length === 0) {
        bugReport += "✅ **No critical bugs detected!**\n\n";
        bugReport += "🔍 **Potential Issues to Watch:**\n";
        bugReport += "• Check for null/undefined values\n";
        bugReport += "• Validate user inputs\n";
        bugReport += "• Handle edge cases\n";
        bugReport += "• Add try-catch blocks for error handling\n";
      } else {
        bugReport += `❌ **Found ${bugs.length} potential bugs:**\n\n`;
        bugs.forEach((bug, i) => {
          bugReport += `${i + 1}. ${bug}\n`;
        });
        bugReport += "\n💡 **Fix Suggestions:**\n";
        bugReport += "• Declare all variables before use\n";
        bugReport += "• Complete all function definitions\n";
        bugReport += "• Add proper error handling\n";
      }

      setAIResponse({
        type: "bug",
        content: bugReport,
      });

      setShowAIPanel(true);
    } catch (error) {
      console.error("Error finding bugs:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const explainCode = async () => {
    if (!code.trim()) return;

    setIsAnalyzing(true);
    setAIResponse({ type: "explanation", content: "", loading: true });
    setActiveTab("ai");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1800));

      let explanation = "🧠 **Code Explanation**\n\n";

      if (code.includes("function")) {
        explanation += "🔧 **Functions Detected:**\n";
        explanation +=
          "Your code defines functions that encapsulate reusable logic.\n\n";
      }

      if (code.includes("console.log")) {
        explanation += "📝 **Output Statements:**\n";
        explanation +=
          "Console.log statements are used to display information to the console.\n\n";
      }

      explanation += "📚 **What this code does:**\n";
      explanation += "1. Defines reusable functions for specific tasks\n";
      explanation += "2. Uses modern JavaScript syntax and best practices\n";
      explanation += "3. Implements clear variable naming conventions\n";
      explanation += "4. Follows a logical code structure\n\n";

      explanation += "🎯 **Key Concepts:**\n";
      explanation += "• **Functions:** Reusable blocks of code\n";
      explanation += "• **Variables:** Storage containers for data\n";
      explanation += "• **Template Literals:** Modern string formatting\n";
      explanation +=
        "• **Console Output:** Debugging and information display\n";

      setAIResponse({
        type: "explanation",
        content: explanation,
      });

      setShowAIPanel(true);
    } catch (error) {
      console.error("Error explaining code:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const refactorCode = async () => {
    if (!code.trim()) return;

    setIsAnalyzing(true);
    setAIResponse({ type: "refactor", content: "", loading: true });
    setActiveTab("ai");

    try {
      await new Promise((resolve) => setTimeout(resolve, 2200));

      // Simple refactoring suggestions
      let refactoredCode = code
        .replace(/var /g, "const ")
        .replace(/function (\w+)/g, "const $1 = ")
        .replace(/console\.log\(/g, "// console.log(");

      let refactorReport = "🔄 **Code Refactoring Suggestions**\n\n";
      refactorReport += "✨ **Improved Code:**\n```javascript\n";
      refactorReport += refactoredCode;
      refactorReport += "\n```\n\n";

      refactorReport += "🚀 **Improvements Made:**\n";
      refactorReport += "• Replaced `var` with `const` for better scoping\n";
      refactorReport += "• Converted to arrow functions for modern syntax\n";
      refactorReport += "• Commented out console.log statements\n";
      refactorReport += "• Improved code readability and maintainability\n\n";

      refactorReport += "💡 **Additional Suggestions:**\n";
      refactorReport += "• Add JSDoc comments for better documentation\n";
      refactorReport += "• Implement error handling with try-catch blocks\n";
      refactorReport += "• Consider using TypeScript for type safety\n";
      refactorReport += "• Add unit tests for your functions\n";

      setAIResponse({
        type: "refactor",
        content: refactorReport,
      });

      setShowAIPanel(true);
    } catch (error) {
      console.error("Error refactoring code:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const runCode = () => {
    setActiveTab("console");
    setConsoleOutput(["🚀 Running your code...", ""]);

    // Simulate code execution
    setTimeout(() => {
      const output = [];

      if (code.includes("console.log")) {
        const matches = code.match(/console\.log\(['"`]([^'"`]*)['"`]\)/g);
        if (matches) {
          matches.forEach((match) => {
            const message = match.match(/['"`]([^'"`]*)['"`]/)?.[1];
            if (message) {
              output.push(`> ${message}`);
            }
          });
        }
      }

      if (code.includes("greetUser")) {
        output.push("> Hello, Developer! Ready to code?");
      }

      output.push("", "✅ Code executed successfully!");
      setConsoleOutput(output);
    }, 1000);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCodeLines = (): CodeLine[] => {
    return code.split("\n").map((content, index) => ({
      number: index + 1,
      content,
      hasError: aiResponse?.suggestions?.some(
        (s) => s.line === index + 1 && s.severity === "error"
      ),
      hasWarning: aiResponse?.suggestions?.some(
        (s) => s.line === index + 1 && s.severity === "warning"
      ),
      hasSuggestion: aiResponse?.suggestions?.some(
        (s) => s.line === index + 1 && s.severity === "info"
      ),
    }));
  };

  return (
    <div className="flex h-full glass rounded-2xl overflow-hidden shadow-2xl">
      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Enhanced Toolbar */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-blue-500/10 to-purple-600/10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-semibold text-white bg-blue-500/20 px-3 py-1 rounded-full">
                {language.toUpperCase()}
              </span>
            </div>

            {collaborative && (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-green-400" />
                <span className="text-sm text-white/70">
                  {collaborators.length} online
                </span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="realtime"
                checked={realTimeAnalysis}
                onChange={(e) => setRealTimeAnalysis(e.target.checked)}
                className="w-4 h-4 text-blue-500 rounded"
              />
              <label htmlFor="realtime" className="text-sm text-white/70">
                Real-time AI
              </label>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={analyzeCode}
              disabled={isAnalyzing}
              className="btn-secondary flex items-center gap-2 text-sm"
            >
              <Sparkles className="w-4 h-4" />
              {isAnalyzing ? "Analyzing..." : "AI Analyze"}
            </button>

            <button
              onClick={findBugs}
              className="btn-ghost flex items-center gap-2 text-sm"
            >
              <Bug className="w-4 h-4" />
              Find Bugs
            </button>

            <button
              onClick={explainCode}
              className="btn-ghost flex items-center gap-2 text-sm"
            >
              <Lightbulb className="w-4 h-4" />
              Explain
            </button>

            <button
              onClick={refactorCode}
              className="btn-ghost flex items-center gap-2 text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Refactor
            </button>

            <button
              onClick={copyCode}
              className="btn-ghost flex items-center gap-2 text-sm"
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              {copied ? "Copied!" : "Copy"}
            </button>

            <button
              onClick={runCode}
              className="btn-primary flex items-center gap-2 text-sm"
            >
              <Play className="w-4 h-4" />
              Run
            </button>
          </div>
        </div>

        {/* Code Editor with Line Numbers */}
        <div className="flex-1 flex">
          {/* Line Numbers */}
          <div className="w-16 bg-black/20 border-r border-white/10 p-2">
            {getCodeLines().map((line) => (
              <div
                key={line.number}
                className={`code-line-number h-6 flex items-center justify-center text-xs ${
                  line.hasError
                    ? "text-red-400 bg-red-500/20"
                    : line.hasWarning
                    ? "text-yellow-400 bg-yellow-500/20"
                    : line.hasSuggestion
                    ? "text-blue-400 bg-blue-500/20"
                    : "text-white/50"
                }`}
              >
                {line.number}
              </div>
            ))}
          </div>

          {/* Code Content */}
          <div className="flex-1 relative">
            <textarea
              ref={editorRef}
              value={code}
              onChange={(e) => handleCodeChange(e.target.value)}
              readOnly={readOnly}
              className="code-editor w-full h-full p-4 bg-transparent text-white resize-none focus:outline-none leading-6"
              placeholder="// Start coding here... AI will assist you in real-time!"
              spellCheck={false}
              style={{
                fontFamily: "JetBrains Mono, Monaco, Consolas, monospace",
              }}
            />

            {/* Real-time Analysis Indicator */}
            {realTimeAnalysis && isAnalyzing && (
              <div className="absolute top-4 right-4 flex items-center gap-2 glass px-3 py-2 rounded-lg">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-white/70">AI analyzing...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced AI Panel */}
      <AnimatePresence>
        {showAIPanel && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 400, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="border-l border-white/10 bg-black/20 backdrop-blur-xl"
          >
            {/* Panel Header */}
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <Brain className="w-5 h-5 text-blue-400" />
                  AI Assistant
                </h3>
                <button
                  onClick={() => setShowAIPanel(false)}
                  className="text-white/50 hover:text-white/80 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tab Navigation */}
              <div className="flex gap-1 bg-white/10 rounded-lg p-1">
                {[
                  { id: "ai", label: "AI Analysis", icon: Wand2 },
                  { id: "console", label: "Console", icon: Terminal },
                  { id: "chat", label: "Chat", icon: MessageSquare },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() =>
                      setActiveTab(tab.id as "ai" | "collaboration" | "chat")
                    }
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm transition-all ${
                      activeTab === tab.id
                        ? "bg-blue-500 text-white"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Panel Content */}
            <div className="flex-1 overflow-hidden">
              {activeTab === "ai" && (
                <div className="p-4 h-full overflow-y-auto">
                  {aiResponse?.loading ? (
                    <div className="flex flex-col items-center justify-center h-32 text-white/70">
                      <div className="spinner mb-4"></div>
                      <p className="text-sm">AI is analyzing your code...</p>
                    </div>
                  ) : aiResponse ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        {aiResponse.type === "suggestion" && (
                          <Sparkles className="w-5 h-5 text-blue-400" />
                        )}
                        {aiResponse.type === "bug" && (
                          <Bug className="w-5 h-5 text-red-400" />
                        )}
                        {aiResponse.type === "explanation" && (
                          <Lightbulb className="w-5 h-5 text-yellow-400" />
                        )}
                        {aiResponse.type === "refactor" && (
                          <RefreshCw className="w-5 h-5 text-green-400" />
                        )}
                        <span className="font-semibold text-white capitalize">
                          {aiResponse.type}
                        </span>
                      </div>

                      <div className="prose prose-invert prose-sm max-w-none">
                        <div className="text-white/90 whitespace-pre-wrap leading-relaxed">
                          {aiResponse.content}
                        </div>
                      </div>

                      {aiResponse.suggestions &&
                        aiResponse.suggestions.length > 0 && (
                          <div className="mt-6 space-y-2">
                            <h4 className="font-semibold text-white mb-3">
                              Line-by-line suggestions:
                            </h4>
                            {aiResponse.suggestions.map((suggestion, index) => (
                              <div
                                key={index}
                                className={`p-3 rounded-lg border-l-4 ${
                                  suggestion.severity === "error"
                                    ? "bg-red-500/10 border-red-400"
                                    : suggestion.severity === "warning"
                                    ? "bg-yellow-500/10 border-yellow-400"
                                    : "bg-blue-500/10 border-blue-400"
                                }`}
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  {suggestion.severity === "error" && (
                                    <AlertTriangle className="w-4 h-4 text-red-400" />
                                  )}
                                  {suggestion.severity === "warning" && (
                                    <AlertTriangle className="w-4 h-4 text-yellow-400" />
                                  )}
                                  {suggestion.severity === "info" && (
                                    <Info className="w-4 h-4 text-blue-400" />
                                  )}
                                  <span className="text-sm font-medium text-white">
                                    Line {suggestion.line} - {suggestion.type}
                                  </span>
                                </div>
                                <p className="text-sm text-white/80">
                                  {suggestion.message}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-32 text-white/50">
                      <Brain className="w-12 h-12 mb-4" />
                      <p className="text-sm text-center">
                        Click any AI button above to get intelligent code
                        analysis
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "console" && (
                <div className="p-4 h-full">
                  <div className="bg-black/40 rounded-lg p-4 h-full font-mono text-sm">
                    {consoleOutput.length > 0 ? (
                      consoleOutput.map((line, index) => (
                        <div key={index} className="text-green-400 mb-1">
                          {line}
                        </div>
                      ))
                    ) : (
                      <div className="text-white/50 text-center mt-8">
                        <Terminal className="w-8 h-8 mx-auto mb-2" />
                        <p>Console output will appear here</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "chat" && (
                <div className="p-4 h-full flex flex-col">
                  <div className="flex-1 bg-black/40 rounded-lg p-4 mb-4">
                    <div className="text-white/50 text-center mt-8">
                      <MessageSquare className="w-8 h-8 mx-auto mb-2" />
                      <p>Team chat coming soon!</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ask AI anything..."
                      className="form-input flex-1 text-sm"
                    />
                    <button className="btn-primary px-4 py-2 text-sm">
                      Send
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
