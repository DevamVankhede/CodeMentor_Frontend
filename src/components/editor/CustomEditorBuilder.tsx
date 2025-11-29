"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code2,
  Settings,
  Save,
  Play,
  Eye,
  Trash2,
  Copy,
  Plus,
  Edit3,
  Palette,
  Layout,
  Zap,
  Download,
  Upload,
  Terminal,
  X,
  Check,
} from 'lucide-react';
import Editor from '@monaco-editor/react';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';
import Button from '../ui/Button';

interface CustomEditor {
  id: string;
  name: string;
  description: string;
  settings: {
    fontSize: number;
    theme: string;
    wordWrap: string;
    minimap: boolean;
    lineNumbers: string;
    folding: boolean;
    autoIndent: string;
    tabSize: number;
  };
  layout: {
    showAIPanel: boolean;
    showCustomizePanel: boolean;
    aiPanelWidth: number;
    customizePanelWidth: number;
  };
  features: {
    realTimeAnalysis: boolean;
    collaborative: boolean;
    allowFullscreen: boolean;
    customizable: boolean;
  };
  defaultCode: string;
  language: string;
  createdAt: string;
  lastModified: string;
}

export default function CustomEditorBuilder() {
  const [editors, setEditors] = useState<CustomEditor[]>([]);
  const [selectedEditor, setSelectedEditor] = useState<CustomEditor | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  // Get default code for each language
  const getDefaultCode = (language: string): string => {
    const codeExamples: Record<string, string> = {
      javascript: '// Welcome to your custom editor!\nconsole.log("Hello, World!");\n\nconst greet = (name) => {\n  return `Hello, ${name}!`;\n};\n\nconsole.log(greet("Developer"));',
      typescript: '// TypeScript Example\nconst message: string = "Hello, World!";\nconsole.log(message);\n\nfunction greet(name: string): string {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(greet("Developer"));',
      python: '# Python Example\nprint("Hello, World!")\n\ndef greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("Developer"))\n\n# Calculate factorial\ndef factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)\n\nprint(f"Factorial of 5: {factorial(5)}")',
      java: '// Java Example\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n        System.out.println(greet("Developer"));\n    }\n    \n    public static String greet(String name) {\n        return "Hello, " + name + "!";\n    }\n}',
      cpp: '// C++ Example\n#include <iostream>\n#include <string>\nusing namespace std;\n\nstring greet(string name) {\n    return "Hello, " + name + "!";\n}\n\nint main() {\n    cout << "Hello, World!" << endl;\n    cout << greet("Developer") << endl;\n    return 0;\n}',
      csharp: '// C# Example\nusing System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello, World!");\n        Console.WriteLine(Greet("Developer"));\n    }\n    \n    static string Greet(string name) {\n        return $"Hello, {name}!";\n    }\n}',
      go: '// Go Example\npackage main\n\nimport "fmt"\n\nfunc greet(name string) string {\n    return fmt.Sprintf("Hello, %s!", name)\n}\n\nfunc main() {\n    fmt.Println("Hello, World!")\n    fmt.Println(greet("Developer"))\n}',
      rust: '// Rust Example\nfn greet(name: &str) -> String {\n    format!("Hello, {}!", name)\n}\n\nfn main() {\n    println!("Hello, World!");\n    println!("{}", greet("Developer"));\n}',
      php: '<?php\n// PHP Example\necho "Hello, World!\\n";\n\nfunction greet($name) {\n    return "Hello, " . $name . "!";\n}\n\necho greet("Developer") . "\\n";\n?>',
      ruby: '# Ruby Example\nputs "Hello, World!"\n\ndef greet(name)\n  "Hello, #{name}!"\nend\n\nputs greet("Developer")',
    };

    return codeExamples[language] || '// Start coding here...';
  };

  const [newEditor, setNewEditor] = useState<Partial<CustomEditor>>({
    name: '',
    description: '',
    language: 'javascript',
    defaultCode: getDefaultCode('javascript'),
    settings: {
      fontSize: 14,
      theme: 'codementor-dark',
      wordWrap: 'on',
      minimap: true,
      lineNumbers: 'on',
      folding: true,
      autoIndent: 'advanced',
      tabSize: 2,
    },
    layout: {
      showAIPanel: true,
      showCustomizePanel: false,
      aiPanelWidth: 400,
      customizePanelWidth: 350,
    },
    features: {
      realTimeAnalysis: true,
      collaborative: false,
      allowFullscreen: true,
      customizable: true,
    },
  });

  // Load saved editors from localStorage
  useEffect(() => {
    const savedEditors = localStorage.getItem('customEditors');
    if (savedEditors) {
      try {
        setEditors(JSON.parse(savedEditors));
      } catch (error) {
        console.error('Failed to load custom editors:', error);
      }
    }
  }, []);

  // Save editors to localStorage
  const saveEditors = (editorsToSave: CustomEditor[]) => {
    localStorage.setItem('customEditors', JSON.stringify(editorsToSave));
    setEditors(editorsToSave);
  };

  const createEditor = () => {
    if (!newEditor.name?.trim()) return;

    const editor: CustomEditor = {
      id: Date.now().toString(),
      name: newEditor.name,
      description: newEditor.description || '',
      settings: newEditor.settings!,
      layout: newEditor.layout!,
      features: newEditor.features!,
      defaultCode: newEditor.defaultCode || '',
      language: newEditor.language || 'javascript',
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    };

    const updatedEditors = [...editors, editor];
    saveEditors(updatedEditors);
    setIsCreating(false);
    setNewEditor({
      name: '',
      description: '',
      language: 'javascript',
      defaultCode: '// Welcome to your custom editor!\nconsole.log("Hello, World!");',
      settings: {
        fontSize: 14,
        theme: 'codementor-dark',
        wordWrap: 'on',
        minimap: true,
        lineNumbers: 'on',
        folding: true,
        autoIndent: 'advanced',
        tabSize: 2,
      },
      layout: {
        showAIPanel: true,
        showCustomizePanel: false,
        aiPanelWidth: 400,
        customizePanelWidth: 350,
      },
      features: {
        realTimeAnalysis: true,
        collaborative: false,
        allowFullscreen: true,
        customizable: true,
      },
    });
  };

  const deleteEditor = (id: string) => {
    const updatedEditors = editors.filter(editor => editor.id !== id);
    saveEditors(updatedEditors);
    if (selectedEditor?.id === id) {
      setSelectedEditor(null);
    }
  };

  const duplicateEditor = (editor: CustomEditor) => {
    const duplicated: CustomEditor = {
      ...editor,
      id: Date.now().toString(),
      name: `${editor.name} (Copy)`,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    };

    const updatedEditors = [...editors, duplicated];
    saveEditors(updatedEditors);
  };

  const exportEditor = (editor: CustomEditor) => {
    const dataStr = JSON.stringify(editor, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = `${editor.name.replace(/\s+/g, '_')}_editor.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importEditor = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedEditor = JSON.parse(e.target?.result as string);
        const editor: CustomEditor = {
          ...importedEditor,
          id: Date.now().toString(),
          name: `${importedEditor.name} (Imported)`,
          createdAt: new Date().toISOString(),
          lastModified: new Date().toISOString(),
        };

        const updatedEditors = [...editors, editor];
        saveEditors(updatedEditors);
      } catch (error) {
        console.error('Failed to import editor:', error);
        alert('Failed to import editor. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  // Preview Mode Component with Working Console
  const PreviewEditor = () => {
    const [code, setCode] = useState(selectedEditor?.defaultCode || '');
    const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [showConsole, setShowConsole] = useState(true);
    const editorRef = useRef<any>(null);
    const consoleEndRef = useRef<HTMLDivElement>(null);

    const handleEditorDidMount = (editor: any, monaco: any) => {
      editorRef.current = editor;

      monaco.editor.defineTheme('custom-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'comment', foreground: '6a9955' },
          { token: 'keyword', foreground: '569cd6' },
          { token: 'string', foreground: 'ce9178' },
          { token: 'number', foreground: 'b5cea8' },
        ],
        colors: {
          'editor.background': '#1e1e1e',
          'editor.foreground': '#f8f8f2',
        },
      });

      monaco.editor.setTheme('custom-dark');
    };

    const runCode = async () => {
      setIsRunning(true);
      const language = selectedEditor?.language || 'javascript';
      setConsoleOutput([`🚀 Running ${language} code...`, '']);

      try {
        // For JavaScript/TypeScript - run locally
        if (language === 'javascript' || language === 'typescript') {
          setTimeout(() => {
            const output: string[] = [];

            try {
              const logs: any[] = [];
              const originalLog = console.log;
              const originalError = console.error;
              const originalWarn = console.warn;

              console.log = (...args: any[]) => {
                logs.push({ type: 'log', args });
              };
              console.error = (...args: any[]) => {
                logs.push({ type: 'error', args });
              };
              console.warn = (...args: any[]) => {
                logs.push({ type: 'warn', args });
              };

              try {
                // eslint-disable-next-line no-eval
                eval(code);

                logs.forEach(log => {
                  const message = log.args.map((arg: any) => {
                    if (typeof arg === 'object') {
                      try {
                        return JSON.stringify(arg, null, 2);
                      } catch {
                        return String(arg);
                      }
                    }
                    return String(arg);
                  }).join(' ');

                  if (log.type === 'error') {
                    output.push(`❌ ${message}`);
                  } else if (log.type === 'warn') {
                    output.push(`⚠️  ${message}`);
                  } else {
                    output.push(`> ${message}`);
                  }
                });

                if (logs.length === 0) {
                  output.push('> Code executed successfully (no output)');
                }

              } catch (error: any) {
                output.push(`❌ Runtime Error: ${error.message}`);
                if (error.stack) {
                  output.push(`   ${error.stack.split('\\n')[1]?.trim() || ''}`);
                }
              } finally {
                console.log = originalLog;
                console.error = originalError;
                console.warn = originalWarn;
              }

              output.push('');
              output.push('✅ Execution completed');
              setConsoleOutput(output);

            } catch (error: any) {
              setConsoleOutput([
                '❌ Fatal Error',
                `Error: ${error.message}`,
                '',
                '✗ Execution failed'
              ]);
            } finally {
              setIsRunning(false);
            }
          }, 500);
        } else {
          // For other languages - use API
          try {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/code/execute`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                },
                body: JSON.stringify({
                  code,
                  language,
                  version: 'latest',
                }),
              }
            );

            if (response.ok) {
              const data = await response.json();
              const output: string[] = [];

              if (data.output) {
                output.push('> Output:');
                output.push(data.output);
              }

              if (data.error) {
                output.push('');
                output.push('❌ Error:');
                output.push(data.error);
              }

              if (data.executionTime) {
                output.push('');
                output.push(`⏱️  Execution time: ${data.executionTime}ms`);
              }

              output.push('');
              output.push(data.error ? '✗ Execution failed' : '✅ Execution completed');
              setConsoleOutput(output);
            } else {
              // Fallback to mock execution for demo
              const mockOutput = getMockOutput(language, code);
              setConsoleOutput(mockOutput);
            }
          } catch (error) {
            console.error('API execution failed, using mock:', error);
            // Fallback to mock execution
            const mockOutput = getMockOutput(language, code);
            setConsoleOutput(mockOutput);
          } finally {
            setIsRunning(false);
          }
        }
      } catch (error: any) {
        setConsoleOutput([
          '❌ Fatal Error',
          `Error: ${error.message}`,
          '',
          '✗ Execution failed'
        ]);
        setIsRunning(false);
      }
    };

    // Mock output for different languages (fallback when API is not available)
    const getMockOutput = (language: string, code: string): string[] => {
      const output: string[] = [];

      switch (language) {
        case 'python':
          output.push('> Python 3.11.0');
          if (code.includes('print')) {
            const printMatches = code.match(/print\((.*?)\)/g);
            if (printMatches) {
              printMatches.forEach(match => {
                const content = match.replace(/print\(|\)/g, '').replace(/['"]/g, '');
                output.push(`> ${content}`);
              });
            }
          } else {
            output.push('> Code executed successfully (no output)');
          }
          break;

        case 'java':
          output.push('> Java 17.0.0');
          if (code.includes('System.out.println')) {
            const printMatches = code.match(/System\.out\.println\((.*?)\)/g);
            if (printMatches) {
              printMatches.forEach(match => {
                const content = match.replace(/System\.out\.println\(|\)/g, '').replace(/['"]/g, '');
                output.push(`> ${content}`);
              });
            }
          } else {
            output.push('> Code executed successfully (no output)');
          }
          break;

        case 'cpp':
          output.push('> C++ (GCC 11.2.0)');
          if (code.includes('cout')) {
            const coutMatches = code.match(/cout\s*<<\s*(.*?)\s*;/g);
            if (coutMatches) {
              coutMatches.forEach(match => {
                const content = match.replace(/cout\s*<<\s*|;/g, '').replace(/['"]/g, '').replace(/endl/g, '');
                output.push(`> ${content.trim()}`);
              });
            }
          } else {
            output.push('> Code executed successfully (no output)');
          }
          break;

        case 'csharp':
          output.push('> C# (.NET 7.0)');
          if (code.includes('Console.WriteLine')) {
            const printMatches = code.match(/Console\.WriteLine\((.*?)\)/g);
            if (printMatches) {
              printMatches.forEach(match => {
                const content = match.replace(/Console\.WriteLine\(|\)/g, '').replace(/['"]/g, '');
                output.push(`> ${content}`);
              });
            }
          } else {
            output.push('> Code executed successfully (no output)');
          }
          break;

        case 'go':
          output.push('> Go 1.21.0');
          if (code.includes('fmt.Println')) {
            const printMatches = code.match(/fmt\.Println\((.*?)\)/g);
            if (printMatches) {
              printMatches.forEach(match => {
                const content = match.replace(/fmt\.Println\(|\)/g, '').replace(/['"]/g, '');
                output.push(`> ${content}`);
              });
            }
          } else {
            output.push('> Code executed successfully (no output)');
          }
          break;

        case 'rust':
          output.push('> Rust 1.73.0');
          if (code.includes('println!')) {
            const printMatches = code.match(/println!\((.*?)\)/g);
            if (printMatches) {
              printMatches.forEach(match => {
                const content = match.replace(/println!\(|\)/g, '').replace(/['"]/g, '');
                output.push(`> ${content}`);
              });
            }
          } else {
            output.push('> Code executed successfully (no output)');
          }
          break;

        case 'php':
          output.push('> PHP 8.2.0');
          if (code.includes('echo')) {
            const echoMatches = code.match(/echo\s+(.*?);/g);
            if (echoMatches) {
              echoMatches.forEach(match => {
                const content = match.replace(/echo\s+|;/g, '').replace(/['"]/g, '');
                output.push(`> ${content}`);
              });
            }
          } else {
            output.push('> Code executed successfully (no output)');
          }
          break;

        case 'ruby':
          output.push('> Ruby 3.2.0');
          if (code.includes('puts')) {
            const putsMatches = code.match(/puts\s+(.*?)$/gm);
            if (putsMatches) {
              putsMatches.forEach(match => {
                const content = match.replace(/puts\s+/g, '').replace(/['"]/g, '');
                output.push(`> ${content}`);
              });
            }
          } else {
            output.push('> Code executed successfully (no output)');
          }
          break;

        default:
          output.push(`> ${language} execution`);
          output.push('> Code executed successfully');
      }

      output.push('');
      output.push('✅ Execution completed');
      output.push('');
      output.push('💡 Note: This is a simulated output. For real execution, connect to the backend API.');

      return output;
    };

    useEffect(() => {
      consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [consoleOutput]);

    return (
      <div className="h-screen bg-bg-primary flex flex-col">
        <div className="flex items-center justify-between p-4 bg-surface-secondary border-b border-border-primary">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-text-primary">
              {selectedEditor?.name}
            </h1>
            <span className="text-sm text-text-secondary">
              {selectedEditor?.description}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={runCode}
              disabled={isRunning}
              leftIcon={isRunning ? <Zap className="w-4 h-4 animate-pulse" /> : <Play className="w-4 h-4" />}
              className="hover:bg-green-500/10 hover:border-green-500/50 transition-colors duration-200"
            >
              {isRunning ? 'Running...' : 'Run Code'}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowConsole(!showConsole)}
              leftIcon={<Terminal className="w-4 h-4" />}
              className="hover:bg-surface-primary transition-colors duration-200"
            >
              {showConsole ? 'Hide' : 'Show'} Console
            </Button>
            <Button
              variant="outline"
              onClick={() => setPreviewMode(false)}
              leftIcon={<Edit3 className="w-4 h-4" />}
              className="hover:bg-surface-primary transition-colors duration-200"
            >
              Back to Builder
            </Button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className={`${showConsole ? 'w-2/3' : 'w-full'} border-r border-border-primary`}>
            <Editor
              height="100%"
              language={selectedEditor?.language || 'javascript'}
              value={code}
              onChange={(value) => setCode(value || '')}
              onMount={handleEditorDidMount}
              options={{
                fontSize: selectedEditor?.settings.fontSize || 14,
                minimap: { enabled: selectedEditor?.settings.minimap || false },
                wordWrap: selectedEditor?.settings.wordWrap as any || 'on',
                lineNumbers: selectedEditor?.settings.lineNumbers as any || 'on',
                folding: selectedEditor?.settings.folding || true,
                tabSize: selectedEditor?.settings.tabSize || 2,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 16, bottom: 16 },
              }}
            />
          </div>

          {showConsole && (
            <div className="w-1/3 bg-surface-secondary flex flex-col">
              <div className="flex items-center justify-between p-3 border-b border-border-primary">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-semibold text-text-primary">Console Output</span>
                </div>
                <button
                  onClick={() => setConsoleOutput([])}
                  className="text-text-tertiary hover:text-text-primary transition-colors"
                  title="Clear Console"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 font-mono text-sm">
                {consoleOutput.length === 0 ? (
                  <div className="text-text-tertiary italic">
                    Console output will appear here...
                  </div>
                ) : (
                  <div className="space-y-1">
                    {consoleOutput.map((line, index) => (
                      <div
                        key={index}
                        className={`${line.startsWith('❌') ? 'text-red-400' :
                          line.startsWith('⚠️') ? 'text-yellow-400' :
                            line.startsWith('✅') ? 'text-green-400' :
                              line.startsWith('🚀') ? 'text-blue-400' :
                                'text-text-primary'
                          }`}
                      >
                        {line}
                      </div>
                    ))}
                    <div ref={consoleEndRef} />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (previewMode && selectedEditor) {
    return <PreviewEditor />;
  }

  return (
    <div className="min-h-screen bg-bg-primary p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Custom Editor Builder
            </h1>
            <p className="text-text-secondary">
              Create and customize your own code editors with personalized settings and features.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="file"
              accept=".json"
              onChange={importEditor}
              className="hidden"
              id="import-editor"
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById('import-editor')?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>

            <Button
              onClick={() => setIsCreating(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Editor
            </Button>
          </div>
        </div>

        {/* Editors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {editors.map((editor) => (
            <motion.div
              key={editor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group"
            >
              <Card hover className="h-full">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{editor.name}</CardTitle>
                      <p className="text-text-secondary text-sm mt-1">
                        {editor.description || 'No description'}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => exportEditor(editor)}
                        className="p-1 text-text-tertiary hover:text-text-primary transition-colors"
                        title="Export Editor"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => duplicateEditor(editor)}
                        className="p-1 text-text-tertiary hover:text-text-primary transition-colors"
                        title="Duplicate Editor"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteEditor(editor.id)}
                        className="p-1 text-red-400 hover:text-red-300 transition-colors"
                        title="Delete Editor"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 text-sm text-text-secondary">
                      <span className="flex items-center gap-1">
                        <Code2 className="w-4 h-4" />
                        {editor.language}
                      </span>
                      <span className="flex items-center gap-1">
                        <Palette className="w-4 h-4" />
                        {editor.settings.theme}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {editor.features.realTimeAnalysis && (
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">
                          AI Analysis
                        </span>
                      )}
                      {editor.features.collaborative && (
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">
                          Collaborative
                        </span>
                      )}
                      {editor.features.allowFullscreen && (
                        <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded">
                          Fullscreen
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedEditor(editor);
                          setPreviewMode(true);
                        }}
                        leftIcon={<Eye className="w-4 h-4" />}
                      >
                        Preview
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedEditor(editor);
                          setNewEditor(editor);
                          setIsEditing(true);
                        }}
                        leftIcon={<Settings className="w-4 h-4" />}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {editors.length === 0 && (
          <div className="text-center py-20">
            <Code2 className="w-16 h-16 text-text-tertiary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-text-primary mb-2">
              No Custom Editors Yet
            </h3>
            <p className="text-text-secondary mb-6">
              Create your first custom editor to get started with personalized coding experiences.
            </p>
            <Button
              onClick={() => setIsCreating(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Editor
            </Button>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {(isCreating || isEditing) && (
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
              className="bg-surface-primary border border-border-primary rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold text-text-primary mb-6">
                {isEditing ? 'Edit Editor' : 'Create New Editor'}
              </h2>

              <div className="space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-text-primary">Basic Information</h3>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Editor Name *
                    </label>
                    <input
                      type="text"
                      value={newEditor.name || ''}
                      onChange={(e) => setNewEditor({ ...newEditor, name: e.target.value })}
                      className="w-full px-3 py-2 bg-surface-secondary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="My Awesome Editor"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Description
                    </label>
                    <textarea
                      value={newEditor.description || ''}
                      onChange={(e) => setNewEditor({ ...newEditor, description: e.target.value })}
                      className="w-full px-3 py-2 bg-surface-secondary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="A brief description of your editor..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Default Language
                    </label>
                    <select
                      value={newEditor.language || 'javascript'}
                      onChange={(e) => {
                        const newLang = e.target.value;
                        setNewEditor({
                          ...newEditor,
                          language: newLang,
                          defaultCode: getDefaultCode(newLang)
                        });
                      }}
                      className="w-full px-3 py-2 bg-surface-secondary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="javascript">🟨 JavaScript</option>
                      <option value="typescript">🔷 TypeScript</option>
                      <option value="python">🐍 Python</option>
                      <option value="java">☕ Java</option>
                      <option value="cpp">⚡ C++</option>
                      <option value="csharp">💜 C#</option>
                      <option value="go">🐹 Go</option>
                      <option value="rust">🦀 Rust</option>
                      <option value="php">🐘 PHP</option>
                      <option value="ruby">💎 Ruby</option>
                    </select>
                    <p className="text-xs text-text-tertiary mt-1">
                      Changing language will update the default code example
                    </p>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-text-primary">Features</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-text-secondary">
                        Real-time AI Analysis
                      </label>
                      <input
                        type="checkbox"
                        checked={newEditor.features?.realTimeAnalysis || false}
                        onChange={(e) => setNewEditor({
                          ...newEditor,
                          features: { ...newEditor.features!, realTimeAnalysis: e.target.checked }
                        })}
                        className="w-4 h-4 text-primary-500 rounded focus:ring-primary-500 focus:ring-2"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-text-secondary">
                        Collaborative Mode
                      </label>
                      <input
                        type="checkbox"
                        checked={newEditor.features?.collaborative || false}
                        onChange={(e) => setNewEditor({
                          ...newEditor,
                          features: { ...newEditor.features!, collaborative: e.target.checked }
                        })}
                        className="w-4 h-4 text-primary-500 rounded focus:ring-primary-500 focus:ring-2"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-text-secondary">
                        Fullscreen Mode
                      </label>
                      <input
                        type="checkbox"
                        checked={newEditor.features?.allowFullscreen || false}
                        onChange={(e) => setNewEditor({
                          ...newEditor,
                          features: { ...newEditor.features!, allowFullscreen: e.target.checked }
                        })}
                        className="w-4 h-4 text-primary-500 rounded focus:ring-primary-500 focus:ring-2"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-text-secondary">
                        Customizable Settings
                      </label>
                      <input
                        type="checkbox"
                        checked={newEditor.features?.customizable || false}
                        onChange={(e) => setNewEditor({
                          ...newEditor,
                          features: { ...newEditor.features!, customizable: e.target.checked }
                        })}
                        className="w-4 h-4 text-primary-500 rounded focus:ring-primary-500 focus:ring-2"
                      />
                    </div>
                  </div>
                </div>

                {/* Default Code */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Default Code
                  </label>
                  <textarea
                    value={newEditor.defaultCode || ''}
                    onChange={(e) => setNewEditor({ ...newEditor, defaultCode: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-secondary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                    placeholder="// Your default code here..."
                    rows={8}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 mt-8">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreating(false);
                    setIsEditing(false);
                    setSelectedEditor(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={createEditor}
                  disabled={!newEditor.name?.trim()}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isEditing ? 'Update Editor' : 'Create Editor'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}