"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Share2,
  Bug,
  RefreshCw,
  MessageSquare,
  Lightbulb,
  Code2,
  Sparkles,
  Terminal,
  Copy,
  Check,
  Wand2,
  Brain,
  X,
  Loader2,
  Type, // Import for Code Generation icon
  Zap, // Import for Quick Fix button
  Maximize,
  Minimize,
  Settings,
} from "lucide-react";
import Editor from "@monaco-editor/react";
import AIContentDisplay from "./AIContentDisplay"; // Import the new component
import CodeQualityDisplay from "./CodeQualityDisplay"; // Import the new CodeQualityDisplay component

interface PerfectAICodeEditorProps {
  readonly initialCode?: string;
  readonly language?: string;
  readonly readOnly?: boolean;
  readonly collaborative?: boolean;
  readonly roomId?: string;
  readonly onCodeChange?: (code: string) => void;
  readonly onCursorChange?: (position: {
    lineNumber: number;
    column: number;
  }) => void; // Add onCursorChange
  readonly collaborators?: Collaborator[]; // Add collaborators prop
  readonly allowFullscreen?: boolean;
  readonly customizable?: boolean;
}

interface AIResponse {
  type: "suggestion" | "bug" | "explanation" | "refactor" | "generation"; // Add 'generation' type
  content: string;
  loading?: boolean;
}

interface EditorMarker {
  startLineNumber: number;
  startColumn: number;
  endLineNumber: number;
  endColumn: number;
  message: string;
  severity: number; // 1: Hint, 2: Info, 4: Warning, 8: Error
}

interface Collaborator {
  id: string;
  name: string;
  color: string; // Color for cursor
  cursor?: { line: number; column: number };
}

export default function PerfectAICodeEditor({
  initialCode = `// Welcome to CodeMentor AI Editor!
// Try typing some code and watch the AI analyze it in real-time

function calculateFactorial(n) {
    if (n <= 1) return 1;
    return n * calculateFactorial(n - 1);
}

const result = calculateFactorial(5);
console.log("Factorial of 5 is:", result);

// Try adding some bugs or improvements!`,
  language = "javascript",
  readOnly = false,
  collaborative = false,
  roomId,
  onCodeChange,
  onCursorChange, // Destructure onCursorChange
  collaborators, // Destructure collaborators
  allowFullscreen = true,
  customizable = true,
}: PerfectAICodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [aiResponse, setAIResponse] = useState<AIResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "ai" | "console" | "chat" | "generate" | "quality"
  >("ai"); // Add 'quality' tab
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [realTimeAnalysis, setRealTimeAnalysis] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCustomizePanel, setShowCustomizePanel] = useState(false);
  const [editorSettings, setEditorSettings] = useState({
    fontSize: 14,
    theme: 'codementor-dark',
    wordWrap: 'on',
    minimap: true,
    lineNumbers: 'on',
    folding: true,
    autoIndent: 'advanced',
    tabSize: 2,
  });
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  const analysisTimeoutRef = useRef<NodeJS.Timeout>();
  const collaboratorWidgetsRef = useRef<Map<string, string>>(new Map()); // To store unique widget IDs

  // State for Code Generation
  const [generationPrompt, setGenerationPrompt] = useState<string>("");
  const [generatedCode, setGeneratedCode] = useState<string>(
    "// Generated code will appear here"
  );
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // State for Code Quality
  const [codeQualityMetrics, setCodeQualityMetrics] = useState<any>(null);
  const [isAnalyzingQuality, setIsAnalyzingQuality] = useState<boolean>(false);

  // Function to handle editor mount
  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Define custom dark theme for Monaco
    monaco.editor.defineTheme("codementor-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "6a9955" },
        { token: "keyword", foreground: "569cd6" },
        { token: "string", foreground: "ce9178" },
        { token: "number", foreground: "b5cea8" },
        { token: "function", foreground: "dcdcaa" },
        { token: "operator", foreground: "d4d4d4" },
        { token: "punctuation", foreground: "d4d4d4" },
        { token: "variable", foreground: "9cdcfe" },
        { token: "type", foreground: "4ec9b0" },
        { token: "constant", foreground: "e3a953" },
      ],
      colors: {
        "editor.background": "#1e1e1e",
        "editor.foreground": "#f8f8f2",
        "editorLineNumber.foreground": "#6a6a6a",
        "editor.selectionBackground": "rgba(0, 100, 200, 0.3)",
        "editor.inactiveSelectionBackground": "rgba(0, 100, 200, 0.15)",
        "editor.lineHighlightBackground": "rgba(255, 255, 255, 0.08)",
        "editorCursor.foreground": "#f8f8f0",
        "editorIndentGuide.background": "#404040",
        "minimap.background": "#1e1e1e",
        "sideBar.background": "#16213e",
        "sideBarSectionHeader.background": "#1a1a2e",
        "menu.background": "#1a1a2e",
        "menu.selectionBackground": "#0f3460",
      },
    });

    monaco.editor.setTheme("codementor-dark");

    // Initial setup for diagnostics
    if (realTimeAnalysis) {
      analyzeCodeRealTime(code);
    }

    // Listen for cursor position changes
    editor.onDidChangeCursorPosition((e: any) => {
      onCursorChange?.(e.position);
    });
  };

  // Effect to update collaborator cursors
  useEffect(() => {
    if (
      !collaborative ||
      !collaborators ||
      !editorRef.current ||
      !monacoRef.current
    )
      return;

    const editor = editorRef.current;
    const monaco = monacoRef.current;
    const currentWidgets = collaboratorWidgetsRef.current;

    // Clear old widgets
    currentWidgets.forEach((widgetId, collabId) => {
      if (!collaborators.some((c) => c.id === collabId)) {
        editor.removeContentWidget(widgetId);
        currentWidgets.delete(collabId);
      }
    });

    collaborators.forEach((collab) => {
      if (collab.id === "1") return; // Skip current user

      if (collab.cursor) {
        const position = new monaco.Position(
          collab.cursor.line,
          collab.cursor.column
        );

        const widgetId = `collaborator-cursor-${collab.id}`;
        if (!currentWidgets.has(collab.id)) {
          // Create new widget
          const newWidget: monaco.editor.IContentWidget = {
            getId: () => widgetId,
            getDomNode: () => {
              const domNode = document.createElement("div");
              domNode.className = `collaborator-cursor`;
              domNode.style.backgroundColor = collab.color;
              domNode.style.width = "2px";
              domNode.style.height =
                editor.getOption(monaco.editor.EditorOption.lineHeight) + "px";
              domNode.style.position = "absolute";
              domNode.style.zIndex = "10";
              domNode.style.pointerEvents = "none"; // Allow interaction with text below

              // Add name tag
              const nameTag = document.createElement("div");
              nameTag.textContent = collab.name;
              nameTag.className = "collaborator-name-tag";
              nameTag.style.backgroundColor = collab.color;
              nameTag.style.color = "white";
              nameTag.style.padding = "2px 5px";
              nameTag.style.fontSize = "10px";
              nameTag.style.borderRadius = "3px";
              nameTag.style.position = "absolute";
              nameTag.style.top = "-18px";
              nameTag.style.left = "-1px";
              nameTag.style.whiteSpace = "nowrap";
              domNode.appendChild(nameTag);

              return domNode;
            },
            getPosition: () => ({
              position: position,
              preference: [monaco.editor.ContentWidgetPositionPreference.EXACT], // Show exactly at cursor
            }),
          };
          editor.addContentWidget(newWidget);
          currentWidgets.set(collab.id, widgetId);
        } else {
          // Update existing widget position
          editor.layoutContentWidget({ id: widgetId, suppressCallbacks: true });
        }
      }
    });
  }, [collaborative, collaborators, onCursorChange]); // Added onCursorChange to dependencies

  // Clear markers when real-time analysis is toggled off
  useEffect(() => {
    if (!realTimeAnalysis && monacoRef.current && editorRef.current) {
      const model = editorRef.current.getModel();
      if (model) {
        monacoRef.current.editor.setModelMarkers(model, "owner", []);
      }
    }
  }, [realTimeAnalysis]);

  const parseAIResponseForMarkers = (
    suggestions: string,
    severityLevel: any
  ) => {
    const errorRegex = /(error|bug|warning):\s*(.*) on line (\d+)/gi;
    let match;
    const markers: EditorMarker[] = [];
    while ((match = errorRegex.exec(suggestions)) !== null) {
      const [, type, message, lineNumberStr] = match;
      const lineNumber = parseInt(lineNumberStr);
      markers.push({
        startLineNumber: lineNumber,
        startColumn: 1,
        endLineNumber: lineNumber,
        endColumn: 1000, // Extend to end of line
        message: `${type.toUpperCase()}: ${message}`,
        severity:
          type.toLowerCase() === "error"
            ? monacoRef.current.MarkerSeverity.Error
            : monacoRef.current.MarkerSeverity.Warning,
      });
    }
    return markers;
  };

  // Real-time code analysis with debouncing
  const analyzeCodeRealTime = useCallback(
    async (codeToAnalyze: string) => {
      if (
        !codeToAnalyze.trim() ||
        !realTimeAnalysis ||
        !monacoRef.current ||
        !editorRef.current
      )
        return;

      // Clear previous timeout
      if (analysisTimeoutRef.current) {
        clearTimeout(analysisTimeoutRef.current);
      }

      // Debounce analysis by 2 seconds
      analysisTimeoutRef.current = setTimeout(async () => {
        setIsAnalyzing(true);
        const model = editorRef.current.getModel();
        if (model) {
          monacoRef.current.editor.setModelMarkers(model, "owner", []); // Clear existing markers
        }

        try {
          const response = await fetch(
            `/api/ai/analyze-code`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
              },
              body: JSON.stringify({
                code: codeToAnalyze,
                language,
                context: "Real-time code analysis",
              }),
            }
          );

          const data = await response.json();

          // Always set AI response, even if request failed
          setAIResponse({
            type: "suggestion",
            content: data.suggestions || "Code analysis complete!",
          });

          // Handle diagnostics if available
          if (response.ok && data.diagnostics && Array.isArray(data.diagnostics)) {
            const markers = data.diagnostics.map((diag: any) => ({
              startLineNumber: diag.lineNumber || 1,
              startColumn: diag.column || 1,
              endLineNumber: diag.endLineNumber || diag.lineNumber || 1,
              endColumn: diag.endColumn || diag.column + 1 || 1,
              message: diag.message,
              severity:
                monacoRef.current.MarkerSeverity[
                diag.severity.toUpperCase()
                ] || monacoRef.current.MarkerSeverity.Error,
            }));
            if (model) {
              monacoRef.current.editor.setModelMarkers(model, "owner", markers);
            }
          } else if (response.ok && data.suggestions) {
            // Basic regex to find potential errors/warnings in text suggestions
            const markers = parseAIResponseForMarkers(
              data.suggestions,
              monacoRef.current.MarkerSeverity
            );
            if (markers.length > 0 && model) {
              monacoRef.current.editor.setModelMarkers(
                model,
                "owner",
                markers
              );
            }
          }
        } catch (error) {
          console.error("Real-time analysis error:", error);
          setAIResponse({
            type: "suggestion",
            content:
              "⚡ **Real-time Analysis**\\n\\nI\\'m ready to analyze your code! Keep typing and I\\'ll provide insights automatically.",
          });
          if (model) {
            monacoRef.current.editor.setModelMarkers(model, "owner", [
              {
                startLineNumber: 1,
                startColumn: 1,
                endLineNumber: 1,
                endColumn: 1000,
                message: "Error during real-time analysis.",
                severity: monacoRef.current.MarkerSeverity.Error,
              },
            ]);
          }
        } finally {
          setIsAnalyzing(false);
        }
      }, 2000);
    },
    [language, realTimeAnalysis]
  );

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    onCodeChange?.(newCode);

    // Trigger real-time analysis
    if (realTimeAnalysis) {
      analyzeCodeRealTime(newCode);
    }

    if (collaborative && roomId) {
      // Send code changes to other collaborators via SignalR
      // editorRef.current?.pushEdit({ range, text, forceMoveMarkers: true });
    }
  };

  const analyzeCode = async () => {
    if (!code.trim()) return;

    setIsAnalyzing(true);
    setAIResponse({ type: "suggestion", content: "", loading: true });
    setActiveTab("ai");
    setShowAIPanel(true); // Show AI panel

    try {
      const response = await fetch(
        `/api/ai/analyze-code`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
          body: JSON.stringify({
            code,
            language,
            context: "Detailed code analysis request",
          }),
        }
      );

      const data = await response.json();

      setAIResponse({
        type: "suggestion",
        content: data.suggestions || "Analysis complete!",
      });

      // Also apply markers for explicit analysis
      const model = editorRef.current.getModel();
      if (response.ok && model && data.diagnostics && Array.isArray(data.diagnostics)) {
        const markers = data.diagnostics.map((diag: any) => ({
          startLineNumber: diag.lineNumber || 1,
          startColumn: diag.column || 1,
          endLineNumber: diag.endLineNumber || diag.lineNumber || 1,
          endColumn: diag.endColumn || diag.column + 1 || 1,
          message: diag.message,
          severity:
            monacoRef.current.MarkerSeverity[diag.severity.toUpperCase()] ||
            monacoRef.current.MarkerSeverity.Error,
        }));
        monacoRef.current.editor.setModelMarkers(model, "owner", markers);
      } else if (response.ok && model && data.suggestions) {
        const markers = parseAIResponseForMarkers(
          data.suggestions,
          monacoRef.current.MarkerSeverity
        );
        if (markers.length > 0) {
          monacoRef.current.editor.setModelMarkers(model, "owner", markers);
        }
      }

      setShowAIPanel(true);
    } catch (error) {
      console.error("Error analyzing code:", error);
      setAIResponse({
        type: "suggestion",
        content:
          "❌ **Analysis Error**\\n\\nI\\'m having trouble analyzing your code right now. Please check your connection and try again.",
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
    setShowAIPanel(true); // Show AI panel

    try {
      const response = await fetch(
        `/api/ai/find-bugs`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
          body: JSON.stringify({ code, language }),
        }
      );

      const data = await response.json();

      setAIResponse({
        type: "bug",
        content: data.bugs || "Bug analysis complete!",
      });

      // Apply bug markers
      const model = editorRef.current.getModel();
      if (response.ok && model && data.diagnostics && Array.isArray(data.diagnostics)) {
        const markers = data.diagnostics.map((diag: any) => ({
          startLineNumber: diag.lineNumber || 1,
          startColumn: diag.column || 1,
          endLineNumber: diag.endLineNumber || diag.lineNumber || 1,
          endColumn: diag.endColumn || diag.column + 1 || 1,
          message: diag.message,
          severity: monacoRef.current.MarkerSeverity.Error,
        }));
        monacoRef.current.editor.setModelMarkers(model, "owner", markers);
      } else if (response.ok && model && data.bugs) {
        const markers = parseAIResponseForMarkers(
          data.bugs,
          monacoRef.current.MarkerSeverity.Error
        );
        if (markers.length > 0) {
          monacoRef.current.editor.setModelMarkers(model, "owner", markers);
        }
      }

      setShowAIPanel(true);
    } catch (error) {
      console.error("Error finding bugs:", error);
      setAIResponse({
        type: "bug",
        content:
          "🐛 **Bug Analysis**\\n\\nI\\'m having trouble analyzing your code for bugs right now. Please try again.",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const explainCode = async () => {
    if (!code.trim()) return;

    setIsAnalyzing(true);
    setAIResponse({ type: "explanation", content: "", loading: true });
    setActiveTab("ai");
    setShowAIPanel(true); // Show AI panel

    try {
      const response = await fetch(
        `/api/ai/explain-code`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
          body: JSON.stringify({
            code,
            language,
            level: "intermediate",
          }),
        }
      );

      const data = await response.json();

      setAIResponse({
        type: "explanation",
        content: data.explanation || "Code explanation complete!",
      });

      setShowAIPanel(true);
    } catch (error) {
      console.error("Error explaining code:", error);
      setAIResponse({
        type: "explanation",
        content:
          "💡 **Code Explanation**\\n\\nI\\'m having trouble explaining your code right now. Please try again.",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const refactorCode = async () => {
    if (!code.trim()) return;

    setIsAnalyzing(true);
    setAIResponse({ type: "refactor", content: "", loading: true });
    setActiveTab("ai");
    setShowAIPanel(true); // Show AI panel

    try {
      const response = await fetch(
        `/api/ai/refactor-code`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
          body: JSON.stringify({ code, language }),
        }
      );

      const data = await response.json();

      setAIResponse({
        type: "refactor",
        content: data.refactoredCode || data.refactored || "Code refactoring complete!",
      });

      // Apply refactoring as a suggestion marker or directly modify code (more advanced)
      const model = editorRef.current.getModel();
      if (response.ok && model && data.refactoredCode && typeof data.refactoredCode === "string") {
        // For simplicity, we'll just show refactored code in AI panel.
        // A more advanced implementation would use Monaco's diff editor or apply edits programmatically.
      }

      setShowAIPanel(true);
    } catch (error) {
      console.error("Error refactoring code:", error);
      setAIResponse({
        type: "refactor",
        content:
          "🔄 **Code Refactoring**\\n\\nI\\'m having trouble refactoring your code right now. Please try again.",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const runCode = () => {
    setActiveTab("console");
    setConsoleOutput(["🚀 Running your code...", ""]);

    setTimeout(() => {
      const output: string[] = [];

      try {
        if (language === "javascript") {
          // Simulating execution with more fidelity.
          // In a real application, this would involve a secure sandbox or a backend execution environment.
          const script = document.createElement("script");
          script.textContent = `\n            let consoleOutput = [];\n            const originalLog = console.log;\n            console.log = (...args) => {\n              consoleOutput.push(args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' '));\n            };\n            try {\n              ${code}\n            } catch (e) {\n              consoleOutput.push(\`Runtime Error: ${e.message}\`);\n            }\n            console.log = originalLog;\n            return consoleOutput;\n          `;
          document.body.appendChild(script);
          // eslint-disable-next-line no-eval
          const scriptOutput = eval(script.textContent);
          output.push(...scriptOutput.map((line: any) => `> ${line}`));
          document.body.removeChild(script);
        }

        const finalOutput =
          output.length === 0 ? ["🚀 Running your code...", ""] : output;

        setConsoleOutput([
          ...finalOutput,
          "",
          "✅ Execution completed successfully!",
        ]);
      } catch (error: any) {
        setConsoleOutput([
          "❌ Runtime error occurred",
          `Error: ${error.message}`,
        ]);
      }
    }, 1500);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const updateEditorSettings = (newSettings: Partial<typeof editorSettings>) => {
    const updatedSettings = { ...editorSettings, ...newSettings };
    setEditorSettings(updatedSettings);

    // Apply settings to Monaco editor
    if (editorRef.current && monacoRef.current) {
      editorRef.current.updateOptions({
        fontSize: updatedSettings.fontSize,
        wordWrap: updatedSettings.wordWrap,
        minimap: { enabled: updatedSettings.minimap },
        lineNumbers: updatedSettings.lineNumbers,
        folding: updatedSettings.folding,
        autoIndent: updatedSettings.autoIndent,
        tabSize: updatedSettings.tabSize,
      });

      if (updatedSettings.theme !== editorSettings.theme) {
        monacoRef.current.editor.setTheme(updatedSettings.theme);
      }
    }

    // Save to localStorage for persistence
    localStorage.setItem('editorSettings', JSON.stringify(updatedSettings));
  };

  // Load saved editor settings on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('editorSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setEditorSettings(parsed);
      } catch (error) {
        console.error('Failed to load editor settings:', error);
      }
    }
  }, []);

  // New function for Code Generation
  const generateCode = async () => {
    if (!generationPrompt.trim()) return;

    setIsGenerating(true);
    setAIResponse({ type: "generation", content: "", loading: true });
    setActiveTab("generate");

    try {
      const response = await fetch(
        `/api/ai/generate-code`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
          body: JSON.stringify({ prompt: generationPrompt, language }),
        }
      );

      const data = await response.json();

      setGeneratedCode(data.code || "// No code generated");
      setAIResponse({
        type: "generation",
        content: data.code || "Code generation complete!",
      });
    } catch (error) {
      console.error("Error generating code:", error);
      setAIResponse({
        type: "generation",
        content:
          "❌ **Code Generation Error**\n\nI'm having trouble generating code right now. Please try again.",
      });
      setGeneratedCode("// Error generating code");
    } finally {
      setIsGenerating(false);
    }
  };

  const insertGeneratedCode = () => {
    if (generatedCode.trim() && editorRef.current) {
      const editor = editorRef.current;
      const selection = editor.getSelection();

      // If there's a selection, replace it. Otherwise, insert at cursor.
      if (selection && !selection.isEmpty()) {
        editor.executeEdits("code-generation", [
          {
            range: selection,
            text: generatedCode,
            forceMoveMarkers: true,
          },
        ]);
      } else {
        const position = editor.getPosition();
        editor.executeEdits("code-generation", [
          {
            range: new monacoRef.current.Range(
              position.lineNumber,
              position.column,
              position.lineNumber,
              position.column
            ),
            text: generatedCode,
            forceMoveMarkers: true,
          },
        ]);
      }
      setCode(editor.getValue()); // Update the state with the new code
      setGeneratedCode("// Generated code will appear here"); // Clear generated code area
      setGenerationPrompt(""); // Clear prompt
      setActiveTab("ai"); // Switch back to AI analysis tab
    }
  };

  // New function for Code Quality Analysis
  const analyzeCodeQuality = async () => {
    if (!code.trim()) return;

    setIsAnalyzingQuality(true);
    setActiveTab("quality");
    setShowAIPanel(true); // Show AI panel
    setCodeQualityMetrics(null); // Clear previous metrics

    try {
      const response = await fetch(
        `/api/ai/code-quality`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
          body: JSON.stringify({ code, language }),
        }
      );

      const data = await response.json();

      if (response.ok && data.quality) {
        setCodeQualityMetrics(data.quality);
      } else {
        setCodeQualityMetrics(data.metrics || {
          score: 0,
          readability: 0,
          maintainability: 0,
          performance: 0
        });
      }
    } catch (error) {
      console.error("Error analyzing code quality:", error);
      setCodeQualityMetrics({
        error: "❌ Failed to fetch code quality metrics.",
      });
    } finally {
      setIsAnalyzingQuality(false);
    }
  };

  // Initialize with welcome message
  useEffect(() => {
    if (!aiResponse) {
      setAIResponse({
        type: "suggestion",
        content:
          "👋 **Welcome to CodeMentor AI Editor!**\\n\\n✨ I\\'m your AI coding assistant, ready to help you write better code.\\n\\n**What I can do:**\\n• 🔍 Analyze your code in real-time\\n• 🐛 Find and fix bugs\\n• 💡 Explain complex code\\n• 🔄 Refactor for better quality\\n• 🚀 Suggest improvements\\n\\n**Get started:**\\n1. Type or paste your code\\n2. Watch me analyze it automatically\\n3. Use the buttons above for specific help\\n\\nHappy coding! 🎉",
      });
    }
  }, []);

  return (
    <div className={`flex h-full bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl overflow-hidden shadow-2xl border border-slate-700 ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''
      }`}>
      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Enhanced Toolbar */}
        <div className="flex items-center justify-between p-4 bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-semibold text-white bg-blue-500/20 px-3 py-1 rounded-full border border-blue-500/30">
                {language.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="realtime"
                checked={realTimeAnalysis}
                onChange={(e) => setRealTimeAnalysis(e.target.checked)}
                className="w-4 h-4 text-blue-500 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label
                htmlFor="realtime"
                className="text-sm text-slate-300 select-none"
              >
                Real-time AI Analysis
              </label>
              {realTimeAnalysis && isAnalyzing && (
                <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {customizable && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCustomizePanel(!showCustomizePanel)}
                className="flex items-center gap-2 px-3 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg transition-all duration-200"
              >
                <Settings className="w-4 h-4" />
                Customize
              </motion.button>
            )}

            {allowFullscreen && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleFullscreen}
                className="flex items-center gap-2 px-3 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg transition-all duration-200"
              >
                {isFullscreen ? (
                  <Minimize className="w-4 h-4" />
                ) : (
                  <Maximize className="w-4 h-4" />
                )}
                {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={analyzeCode}
              disabled={isAnalyzing}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg border border-blue-500/30 transition-all duration-200 disabled:opacity-50"
            >
              {isAnalyzing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              Analyze
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={findBugs}
              className="flex items-center gap-2 px-3 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg transition-all duration-200"
            >
              <Bug className="w-4 h-4" />
              Bugs
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={explainCode}
              className="flex items-center gap-2 px-3 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg transition-all duration-200"
            >
              <Lightbulb className="w-4 h-4" />
              Explain
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={refactorCode}
              className="flex items-center gap-2 px-3 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg transition-all duration-200"
            >
              <RefreshCw className="w-4 h-4" />
              Refactor
            </motion.button>

            <motion.button // New "Generate Code" button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setActiveTab("generate");
                setShowAIPanel(true); // Show AI panel
              }}
              className="flex items-center gap-2 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg border border-blue-500/30 transition-all duration-200"
            >
              <Type className="w-4 h-4" />
              Generate
            </motion.button>

            <motion.button // New "Code Quality" button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={analyzeCodeQuality}
              disabled={isAnalyzingQuality || !code.trim()}
              className="flex items-center gap-2 px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg border border-purple-500/30 transition-all duration-200 disabled:opacity-50"
            >
              {isAnalyzingQuality ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Zap className="w-4 h-4" />
              )}
              Quality
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={copyCode}
              className="flex items-center gap-2 px-3 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg transition-all duration-200"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              {copied ? "Copied!" : "Copy"}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={runCode}
              className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg border border-green-500/30 transition-all duration-200"
            >
              <Play className="w-4 h-4" />
              Run
            </motion.button>
            {/* Share Button (for collaboration) */}
            {collaborative && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => alert("Share functionality coming soon!")}
                className="flex items-center gap-2 px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg border border-purple-500/30 transition-all duration-200"
              >
                <Share2 className="w-4 h-4" />
                Share
              </motion.button>
            )}
          </div>
        </div>

        {/* Code Editor */}
        <div className="flex-1 relative">
          <Editor
            height="100%"
            language={language}
            theme={editorSettings.theme}
            value={code}
            onChange={handleCodeChange}
            onMount={handleEditorDidMount}
            options={{
              readOnly: readOnly,
              domReadOnly: readOnly, // Ensure readonly for screen readers
              minimap: { enabled: editorSettings.minimap },
              fontSize: editorSettings.fontSize,
              lineHeight: Math.round(editorSettings.fontSize * 1.7),
              tabSize: editorSettings.tabSize,
              insertSpaces: true,
              autoClosingBrackets: "always",
              autoClosingQuotes: "always",
              formatOnPaste: true,
              formatOnType: true,
              scrollBeyondLastLine: false,
              wordWrap: editorSettings.wordWrap as any,
              lineNumbers: editorSettings.lineNumbers as any,
              folding: editorSettings.folding,
              autoIndent: editorSettings.autoIndent as any,
              // Advanced features
              copyWithSyntaxHighlighting: true,
              "bracketPairColorization.enabled": true,
              guides: {
                bracketPairs: "active",
              },
              lightbulb: {
                enabled: true, // Enable lightbulb for quick fixes/suggestions
              },
              quickSuggestions: true, // Enable quick suggestions
              wordBasedSuggestions: "matchingDocuments", // Suggest words from current document
              suggestOnTriggerCharacters: true, // Suggestions pop up on trigger characters
              // Custom scrollbar styling
              scrollbar: {
                verticalScrollbarSize: 8,
                horizontalScrollbarSize: 8,
                arrowSize: 10,
              },
              overviewRulerBorder: false, // Remove border around minimap
            }}
          />

          {/* Real-time Analysis Indicator */}
          {realTimeAnalysis && isAnalyzing && (
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-blue-500/20 backdrop-blur-sm px-3 py-2 rounded-lg border border-blue-500/30">
              <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
              <span className="text-xs text-blue-300">AI analyzing...</span>
            </div>
          )}
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
            className="border-l border-slate-700 bg-slate-800/50 backdrop-blur-sm"
          >
            {/* Panel Header */}
            <div className="p-4 border-b border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <Brain className="w-5 h-5 text-blue-400" />
                  AI Assistant
                </h3>
                <button
                  onClick={() => setShowAIPanel(false)}
                  className="text-slate-400 hover:text-slate-200 transition-colors p-1 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tab Navigation */}
              <div className="flex gap-1 bg-slate-700/50 rounded-lg p-1">
                {[
                  { id: "ai", label: "AI Analysis", icon: Wand2 },
                  { id: "console", label: "Console", icon: Terminal },
                  { id: "chat", label: "Chat", icon: MessageSquare },
                  { id: "generate", label: "Generate", icon: Type }, // Add new Generate tab
                  { id: "quality", label: "Quality", icon: Zap }, // Add new Quality tab
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm transition-all ${activeTab === tab.id
                      ? "bg-blue-500 text-white shadow-lg"
                      : "text-slate-300 hover:text-white hover:bg-slate-600/50"
                      }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Panel Content */}
            <div className="flex-1 overflow-hidden h-96">
              {activeTab === "ai" && (
                <div className="p-4 h-full overflow-y-auto">
                  {aiResponse?.loading ? (
                    <div className="flex flex-col items-center justify-center h-32 text-slate-400">
                      <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-400" />
                      <p className="text-sm">AI is analyzing your code...</p>
                    </div>
                  ) : (
                    <AIContentDisplay
                      aiResponse={aiResponse}
                      monacoRef={monacoRef}
                    />
                  )}
                </div>
              )}

              {activeTab === "console" && (
                <div className="p-4 h-full">
                  <div className="bg-slate-900/50 rounded-lg p-4 h-full font-mono text-sm overflow-y-auto">
                    {consoleOutput.length > 0 ? (
                      consoleOutput.map((line, index) => (
                        <div
                          key={`console-line-${index}-${line}`}
                          className="text-green-400 mb-1"
                        >
                          {line}
                        </div>
                      ))
                    ) : (
                      <div className="text-slate-400 text-center mt-8">
                        <Terminal className="w-8 h-8 mx-auto mb-2" />
                        <p>Console output will appear here</p>
                        <p className="text-xs mt-2">
                          Click &quot;Run&quot; to execute your code
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "chat" && (
                <div className="p-4 h-full flex flex-col">
                  <div className="flex-1 bg-slate-900/50 rounded-lg p-4 mb-4 overflow-y-auto">
                    <div className="text-slate-400 text-center mt-8">
                      <MessageSquare className="w-8 h-8 mx-auto mb-2" />
                      <p>AI Chat coming soon!</p>
                      <p className="text-xs mt-2">
                        Ask questions about your code
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ask AI about your code..."
                      className="flex-1 px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm">
                      Send
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "quality" && (
                <div className="p-4 h-full flex flex-col">
                  <h4 className="text-sm font-medium text-slate-300 mb-4">
                    Code Quality Metrics:
                  </h4>
                  {isAnalyzingQuality ? (
                    <div className="flex flex-col items-center justify-center h-32 text-slate-400">
                      <Loader2 className="w-8 h-8 animate-spin mb-4 text-purple-400" />
                      <p className="text-sm">Analyzing code quality...</p>
                    </div>
                  ) : (
                    <CodeQualityDisplay metrics={codeQualityMetrics} />
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Customization Panel */}
      <AnimatePresence>
        {showCustomizePanel && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 350, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="border-l border-slate-700 bg-slate-800/50 backdrop-blur-sm"
          >
            {/* Customization Header */}
            <div className="p-4 border-b border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-purple-400" />
                  Editor Settings
                </h3>
                <button
                  onClick={() => setShowCustomizePanel(false)}
                  className="text-slate-400 hover:text-slate-200 transition-colors p-1 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Customization Content */}
            <div className="p-4 space-y-6 overflow-y-auto h-96">
              {/* Font Size */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Font Size: {editorSettings.fontSize}px
                </label>
                <input
                  type="range"
                  min="10"
                  max="24"
                  value={editorSettings.fontSize}
                  onChange={(e) => updateEditorSettings({ fontSize: parseInt(e.target.value) })}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              {/* Theme */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Theme
                </label>
                <select
                  value={editorSettings.theme}
                  onChange={(e) => updateEditorSettings({ theme: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="codementor-dark">CodeMentor Dark</option>
                  <option value="vs-dark">VS Dark</option>
                  <option value="vs">VS Light</option>
                  <option value="hc-black">High Contrast</option>
                </select>
              </div>

              {/* Word Wrap */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Word Wrap
                </label>
                <select
                  value={editorSettings.wordWrap}
                  onChange={(e) => updateEditorSettings({ wordWrap: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="off">Off</option>
                  <option value="on">On</option>
                  <option value="wordWrapColumn">Word Wrap Column</option>
                  <option value="bounded">Bounded</option>
                </select>
              </div>

              {/* Tab Size */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Tab Size: {editorSettings.tabSize}
                </label>
                <input
                  type="range"
                  min="1"
                  max="8"
                  value={editorSettings.tabSize}
                  onChange={(e) => updateEditorSettings({ tabSize: parseInt(e.target.value) })}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              {/* Line Numbers */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Line Numbers
                </label>
                <select
                  value={editorSettings.lineNumbers}
                  onChange={(e) => updateEditorSettings({ lineNumbers: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="on">On</option>
                  <option value="off">Off</option>
                  <option value="relative">Relative</option>
                  <option value="interval">Interval</option>
                </select>
              </div>

              {/* Toggle Options */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-300">
                    Minimap
                  </label>
                  <input
                    type="checkbox"
                    checked={editorSettings.minimap}
                    onChange={(e) => updateEditorSettings({ minimap: e.target.checked })}
                    className="w-4 h-4 text-purple-500 rounded focus:ring-purple-500 focus:ring-2"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-300">
                    Code Folding
                  </label>
                  <input
                    type="checkbox"
                    checked={editorSettings.folding}
                    onChange={(e) => updateEditorSettings({ folding: e.target.checked })}
                    className="w-4 h-4 text-purple-500 rounded focus:ring-purple-500 focus:ring-2"
                  />
                </div>
              </div>

              {/* Auto Indent */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Auto Indent
                </label>
                <select
                  value={editorSettings.autoIndent}
                  onChange={(e) => updateEditorSettings({ autoIndent: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="none">None</option>
                  <option value="keep">Keep</option>
                  <option value="brackets">Brackets</option>
                  <option value="advanced">Advanced</option>
                  <option value="full">Full</option>
                </select>
              </div>

              {/* Reset Button */}
              <div className="pt-4 border-t border-slate-700">
                <button
                  onClick={() => {
                    const defaultSettings = {
                      fontSize: 14,
                      theme: 'codementor-dark',
                      wordWrap: 'on',
                      minimap: true,
                      lineNumbers: 'on',
                      folding: true,
                      autoIndent: 'advanced',
                      tabSize: 2,
                    };
                    updateEditorSettings(defaultSettings);
                  }}
                  className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  Reset to Defaults
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
