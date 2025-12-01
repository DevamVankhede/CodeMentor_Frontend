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
  Zap,
  Download,
  Upload,
  Terminal,
  X,
  ChevronDown,
  Monitor,
  Users,
  Maximize2,
  Sliders,
  FileCode,
  Type
} from 'lucide-react';
import Editor from '@monaco-editor/react';

// --- Internal UI Components for the "Perfect Design" ---

// Reusable Input Field
const InputGroup = ({ label, subLabel, children, required }: any) => (
  <div className="space-y-1.5">
    <label className="flex flex-col">
      <span className="text-sm font-medium text-zinc-300 flex items-center gap-1">
        {label} {required && <span className="text-indigo-400">*</span>}
      </span>
      {subLabel && <span className="text-xs text-zinc-500">{subLabel}</span>}
    </label>
    {children}
  </div>
);

// Styled Text Input
const StyledInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200"
  />
);

// Styled Text Area
const StyledTextArea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    {...props}
    className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200 resize-y min-h-[100px] font-mono text-sm"
  />
);

// Feature Toggle Card
const FeatureToggle = ({ label, icon: Icon, checked, onChange }: any) => (
  <div 
    onClick={() => onChange(!checked)}
    className={`cursor-pointer group flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
      checked 
        ? 'bg-indigo-500/10 border-indigo-500/50' 
        : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
    }`}
  >
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-md ${checked ? 'bg-indigo-500 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
        <Icon className="w-4 h-4" />
      </div>
      <span className={`text-sm font-medium ${checked ? 'text-indigo-200' : 'text-zinc-400'}`}>
        {label}
      </span>
    </div>
    <div className={`w-5 h-5 rounded border flex items-center justify-center ${
      checked ? 'bg-indigo-500 border-indigo-500' : 'border-zinc-600'
    }`}>
      {checked && <div className="w-2 h-2 bg-white rounded-sm" />}
    </div>
  </div>
);

// --- Main Types ---

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

  // Default Code Logic
  const getDefaultCode = (language: string): string => {
    const codeExamples: Record<string, string> = {
      javascript: '// Welcome to your custom editor!\nconsole.log("Hello, World!");\n\nconst greet = (name) => {\n  return `Hello, ${name}!`;\n};\n\nconsole.log(greet("Developer"));',
      typescript: '// TypeScript Example\nconst message: string = "Hello, World!";\nconsole.log(message);\n\nfunction greet(name: string): string {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(greet("Developer"));',
      python: '# Python Example\nprint("Hello, World!")\n\ndef greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("Developer"))',
      java: '// Java Example\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
      cpp: '// C++ Example\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}',
      csharp: '// C# Example\nusing System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello, World!");\n    }\n}',
      go: '// Go Example\npackage main\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}',
      rust: '// Rust Example\nfn main() {\n    println!("Hello, World!");\n}',
      php: '<?php\necho "Hello, World!";\n?>',
      ruby: '# Ruby Example\nputs "Hello, World!"',
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
      theme: 'vs-dark',
      wordWrap: 'on',
      minimap: true,
      lineNumbers: 'on',
      folding: true,
      autoIndent: 'advanced',
      tabSize: 2,
    },
    features: {
      realTimeAnalysis: true,
      collaborative: false,
      allowFullscreen: true,
      customizable: true,
    },
  });

  // Load saved editors
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
      layout: { showAIPanel: true, showCustomizePanel: false, aiPanelWidth: 400, customizePanelWidth: 350 }, // Defaults
      features: newEditor.features!,
      defaultCode: newEditor.defaultCode || '',
      language: newEditor.language || 'javascript',
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    };

    const updatedEditors = isEditing && selectedEditor 
      ? editors.map(e => e.id === selectedEditor.id ? { ...editor, id: selectedEditor.id } : e)
      : [...editors, editor];

    saveEditors(updatedEditors);
    setIsCreating(false);
    setIsEditing(false);
    setSelectedEditor(null);
    setNewEditor({
        name: '', description: '', language: 'javascript', defaultCode: getDefaultCode('javascript'),
        settings: { fontSize: 14, theme: 'vs-dark', wordWrap: 'on', minimap: true, lineNumbers: 'on', folding: true, autoIndent: 'advanced', tabSize: 2 },
        features: { realTimeAnalysis: true, collaborative: false, allowFullscreen: true, customizable: true }
    });
  };

  const deleteEditor = (id: string) => {
    const updatedEditors = editors.filter(editor => editor.id !== id);
    saveEditors(updatedEditors);
    if (selectedEditor?.id === id) setSelectedEditor(null);
  };

  const duplicateEditor = (editor: CustomEditor) => {
    const duplicated: CustomEditor = {
      ...editor,
      id: Date.now().toString(),
      name: `${editor.name} (Copy)`,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    };
    saveEditors([...editors, duplicated]);
  };

  const exportEditor = (editor: CustomEditor) => {
    const dataStr = JSON.stringify(editor, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `${editor.name.replace(/\s+/g, '_')}_editor.json`);
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
        };
        saveEditors([...editors, editor]);
      } catch (error) {
        alert('Failed to import editor. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  // --- Preview Component (Inline for simplicity) ---
  const PreviewEditor = () => {
    const [code, setCode] = useState(selectedEditor?.defaultCode || '');
    const [consoleOutput, setConsoleOutput] = useState<string[]>(['> Ready to run...']);
    const [isRunning, setIsRunning] = useState(false);
    const [showConsole, setShowConsole] = useState(true);

    const runCode = () => {
      setIsRunning(true);
      setConsoleOutput(['> Running...', `> Executing ${selectedEditor?.language}...`]);
      setTimeout(() => {
        setConsoleOutput(prev => [...prev, 'Hello, World!', '✅ Execution Completed']);
        setIsRunning(false);
      }, 800);
    };

    return (
      <div className="h-screen bg-zinc-950 flex flex-col font-sans text-zinc-100">
        <div className="flex items-center justify-between px-6 py-3 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-indigo-500/10 rounded-lg">
                <Code2 className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
                <h1 className="font-bold text-lg leading-none">{selectedEditor?.name}</h1>
                <span className="text-xs text-zinc-500 font-mono mt-1 block">{selectedEditor?.language} environment</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={runCode} disabled={isRunning} className="flex items-center gap-2 px-4 py-2 bg-green-600/10 hover:bg-green-600/20 text-green-400 border border-green-600/50 rounded-lg transition-colors text-sm font-medium">
               {isRunning ? <Zap className="w-4 h-4 animate-pulse" /> : <Play className="w-4 h-4" />}
               Run
            </button>
            <button onClick={() => setShowConsole(!showConsole)} className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors text-sm border border-zinc-700">
               <Terminal className="w-4 h-4" />
               {showConsole ? 'Hide' : 'Show'} Output
            </button>
            <button onClick={() => setPreviewMode(false)} className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors text-sm border border-zinc-700">
               <Edit3 className="w-4 h-4" />
               Builder
            </button>
          </div>
        </div>
        <div className="flex-1 flex overflow-hidden">
          <div className={`${showConsole ? 'w-2/3' : 'w-full'} border-r border-zinc-800`}>
            <Editor
              height="100%"
              theme="vs-dark"
              language={selectedEditor?.language}
              value={code}
              onChange={(val) => setCode(val || '')}
              options={{ 
                fontSize: selectedEditor?.settings.fontSize,
                minimap: { enabled: selectedEditor?.settings.minimap },
                padding: { top: 20 }
              }}
            />
          </div>
          {showConsole && (
             <div className="w-1/3 bg-zinc-950 flex flex-col border-l border-zinc-800">
               <div className="p-3 bg-zinc-900 border-b border-zinc-800 flex justify-between items-center">
                 <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Console Output</span>
                 <button onClick={() => setConsoleOutput([])}><X className="w-4 h-4 text-zinc-500 hover:text-zinc-300" /></button>
               </div>
               <div className="p-4 font-mono text-sm space-y-2 overflow-y-auto flex-1">
                 {consoleOutput.map((line, i) => (
                   <div key={i} className={line.includes('Error') ? 'text-red-400' : line.includes('Completed') ? 'text-green-400' : 'text-zinc-300'}>{line}</div>
                 ))}
               </div>
             </div>
          )}
        </div>
      </div>
    );
  };

  if (previewMode && selectedEditor) return <PreviewEditor />;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 selection:bg-indigo-500/30">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
              Editor<span className="text-indigo-500">Forge</span>
            </h1>
            <p className="text-zinc-400 max-w-lg text-lg">
              Craft, customize, and deploy specialized coding environments for your team.
            </p>
          </div>

          <div className="flex items-center gap-3">
             <input type="file" accept=".json" onChange={importEditor} className="hidden" id="import-editor" />
             <button 
                onClick={() => document.getElementById('import-editor')?.click()}
                className="px-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-300 hover:text-white hover:border-zinc-500 transition-all flex items-center gap-2 text-sm font-medium"
             >
                <Upload className="w-4 h-4" /> Import
             </button>
             <button 
                onClick={() => setIsCreating(true)}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-lg shadow-indigo-900/20 transition-all flex items-center gap-2 text-sm font-medium"
             >
                <Plus className="w-4 h-4" /> Create New
             </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {editors.map((editor) => (
            <motion.div
              key={editor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group relative bg-zinc-900 rounded-xl border border-zinc-800 hover:border-zinc-600 transition-all duration-300 hover:shadow-2xl hover:shadow-black/50 overflow-hidden flex flex-col"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 group-hover:border-indigo-500/30 transition-colors">
                    <Code2 className="w-6 h-6 text-zinc-400 group-hover:text-indigo-400" />
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                    <button onClick={() => exportEditor(editor)} className="p-2 hover:bg-zinc-800 rounded-md text-zinc-400 hover:text-white transition-colors" title="Export">
                        <Download className="w-4 h-4" />
                    </button>
                    <button onClick={() => duplicateEditor(editor)} className="p-2 hover:bg-zinc-800 rounded-md text-zinc-400 hover:text-white transition-colors" title="Duplicate">
                        <Copy className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteEditor(editor.id)} className="p-2 hover:bg-red-900/20 rounded-md text-zinc-400 hover:text-red-400 transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{editor.name}</h3>
                <p className="text-zinc-500 text-sm line-clamp-2 mb-4">{editor.description || 'No description provided.'}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                   <span className="px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-400 text-xs border border-zinc-700 flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${editor.language === 'javascript' ? 'bg-yellow-400' : editor.language === 'typescript' ? 'bg-blue-400' : 'bg-green-400'}`} />
                      {editor.language}
                   </span>
                   {editor.features.realTimeAnalysis && (
                      <span className="px-2.5 py-1 rounded-md bg-blue-900/20 text-blue-400 text-xs border border-blue-900/30">AI Enabled</span>
                   )}
                </div>
              </div>

              <div className="p-4 bg-zinc-950/50 border-t border-zinc-800 grid grid-cols-2 gap-3">
                 <button 
                    onClick={() => { setSelectedEditor(editor); setPreviewMode(true); }}
                    className="flex items-center justify-center gap-2 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium transition-colors"
                 >
                    <Eye className="w-4 h-4" /> Preview
                 </button>
                 <button 
                    onClick={() => { setSelectedEditor(editor); setNewEditor(editor); setIsEditing(true); }}
                    className="flex items-center justify-center gap-2 py-2 rounded-lg border border-zinc-700 hover:bg-zinc-800 text-zinc-300 text-sm font-medium transition-colors"
                 >
                    <Settings className="w-4 h-4" /> Configure
                 </button>
              </div>
            </motion.div>
          ))}
          
          {/* Empty State */}
          {editors.length === 0 && (
            <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-2xl bg-zinc-900/30">
                <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6 shadow-xl">
                    <Code2 className="w-10 h-10 text-zinc-600" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No editors found</h3>
                <p className="text-zinc-500 mb-6">Get started by creating your first custom environment.</p>
                <button 
                    onClick={() => setIsCreating(true)}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors"
                >
                    Create Editor
                </button>
            </div>
          )}
        </div>
      </div>

      {/* --- THE PERFECT FORM / MODAL --- */}
      <AnimatePresence>
        {(isCreating || isEditing) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-[#18181b] w-full max-w-3xl rounded-2xl shadow-2xl border border-zinc-800 flex flex-col max-h-[90vh] overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900">
                <div>
                    <h2 className="text-xl font-bold text-white">
                        {isEditing ? 'Configure Editor' : 'Create New Environment'}
                    </h2>
                    <p className="text-sm text-zinc-500 mt-1">Define settings, language, and capabilities.</p>
                </div>
                <button 
                    onClick={() => { setIsCreating(false); setIsEditing(false); }}
                    className="p-2 hover:bg-zinc-800 rounded-full text-zinc-500 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Form Body */}
              <div className="overflow-y-auto flex-1 p-6 custom-scrollbar">
                <div className="space-y-8">
                  
                  {/* Section 1: Identity */}
                  <div className="space-y-4">
                     <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-2 mb-4">
                        <FileCode className="w-4 h-4" /> General Information
                     </h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <InputGroup label="Editor Name" required>
                            <StyledInput 
                                placeholder="e.g. Python Data Science Env"
                                value={newEditor.name}
                                onChange={(e) => setNewEditor({ ...newEditor, name: e.target.value })}
                            />
                        </InputGroup>
                        
                        <InputGroup label="Programming Language" subLabel="Updates default code template">
                            <div className="relative">
                                {/* CUSTOM DROPDOWN STYLE: Dark background, no transparency */}
                                <select 
                                    className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                                    value={newEditor.language}
                                    onChange={(e) => {
                                        const lang = e.target.value;
                                        setNewEditor({ ...newEditor, language: lang, defaultCode: getDefaultCode(lang) });
                                    }}
                                >
                                    <option className="bg-zinc-900 text-white" value="javascript">JavaScript</option>
                                    <option className="bg-zinc-900 text-white" value="typescript">TypeScript</option>
                                    <option className="bg-zinc-900 text-white" value="python">Python</option>
                                    <option className="bg-zinc-900 text-white" value="java">Java</option>
                                    <option className="bg-zinc-900 text-white" value="cpp">C++</option>
                                    <option className="bg-zinc-900 text-white" value="csharp">C#</option>
                                    <option className="bg-zinc-900 text-white" value="go">Go</option>
                                    <option className="bg-zinc-900 text-white" value="rust">Rust</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none w-4 h-4 text-zinc-500" />
                            </div>
                        </InputGroup>

                        <div className="md:col-span-2">
                             <InputGroup label="Description">
                                <StyledInput 
                                    placeholder="Briefly describe the purpose of this environment..."
                                    value={newEditor.description}
                                    onChange={(e) => setNewEditor({ ...newEditor, description: e.target.value })}
                                />
                             </InputGroup>
                        </div>
                     </div>
                  </div>

                  <div className="w-full h-px bg-zinc-800" />

                  {/* Section 2: Features Grid */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-2 mb-4">
                        <Sliders className="w-4 h-4" /> Capabilities
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FeatureToggle 
                            label="Real-time AI Analysis" 
                            icon={Monitor}
                            checked={newEditor.features?.realTimeAnalysis} 
                            onChange={(checked: boolean) => setNewEditor({ ...newEditor, features: { ...newEditor.features!, realTimeAnalysis: checked } })} 
                        />
                        <FeatureToggle 
                            label="Collaborative Live Share" 
                            icon={Users}
                            checked={newEditor.features?.collaborative} 
                            onChange={(checked: boolean) => setNewEditor({ ...newEditor, features: { ...newEditor.features!, collaborative: checked } })} 
                        />
                        <FeatureToggle 
                            label="Allow Fullscreen" 
                            icon={Maximize2}
                            checked={newEditor.features?.allowFullscreen} 
                            onChange={(checked: boolean) => setNewEditor({ ...newEditor, features: { ...newEditor.features!, allowFullscreen: checked } })} 
                        />
                        <FeatureToggle 
                            label="User Customizable" 
                            icon={Palette}
                            checked={newEditor.features?.customizable} 
                            onChange={(checked: boolean) => setNewEditor({ ...newEditor, features: { ...newEditor.features!, customizable: checked } })} 
                        />
                    </div>
                  </div>

                  <div className="w-full h-px bg-zinc-800" />

                  {/* Section 3: Default Code */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-2 mb-4">
                        <Type className="w-4 h-4" /> Starter Template
                    </h3>
                    <StyledTextArea 
                        rows={6}
                        value={newEditor.defaultCode}
                        onChange={(e) => setNewEditor({ ...newEditor, defaultCode: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-zinc-800 bg-zinc-900 flex justify-end gap-3">
                 <button 
                    onClick={() => { setIsCreating(false); setIsEditing(false); }}
                    className="px-5 py-2.5 rounded-lg border border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors text-sm font-medium"
                 >
                    Cancel
                 </button>
                 <button 
                    onClick={createEditor}
                    disabled={!newEditor.name?.trim()}
                    className={`px-6 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium transition-all shadow-lg ${
                        !newEditor.name?.trim() 
                        ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' 
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-900/30'
                    }`}
                 >
                    <Save className="w-4 h-4" />
                    {isEditing ? 'Save Changes' : 'Create Environment'}
                 </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}