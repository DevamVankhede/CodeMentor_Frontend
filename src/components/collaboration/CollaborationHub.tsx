"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Users,
  MessageSquare,
  Share2,
  UserPlus,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Crown,
  Send,
  X,
  Settings,
  MoreVertical,
  Code2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Types ---

interface Collaborator {
  id: string;
  name: string;
  isOwner: boolean;
  isActive: boolean;
  cursor?: { line: number; column: number };
  color: string;
}

interface ChatMessage {
  id: string;
  user: string;
  message: string;
  timestamp: Date;
  type: "message" | "system";
  color?: string;
}

// --- Constants ---

const USER_COLORS = [
  "#818cf8", // Indigo 400
  "#34d399", // Emerald 400
  "#f472b6", // Pink 400
  "#fbbf24", // Amber 400
  "#60a5fa", // Blue 400
  "#c084fc", // Purple 400
];

// --- Sub-Components ---

const Avatar = ({ name, color, size = "sm" }: { name: string; color: string; size?: "sm" | "md" }) => {
  const initials = name.split(" ").map(n => n[0]).join("").substring(0, 2);
  const sizeClasses = size === "sm" ? "w-6 h-6 text-xs" : "w-8 h-8 text-sm";

  return (
    <div
      className={`${sizeClasses} rounded flex items-center justify-center font-bold text-zinc-950 shadow-sm`}
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  );
};

const IconButton = ({ active, onClick, icon: Icon, label, variant = "default" }: any) => {
  const baseClass = "p-2 rounded-lg transition-all duration-200 flex items-center justify-center";
  const variants = {
    default: active
      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/20"
      : "bg-zinc-800 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700",
    danger: active
      ? "bg-zinc-800 text-zinc-400 hover:text-zinc-100"
      : "bg-red-500/10 text-red-400 hover:bg-red-500/20",
    ghost: active
      ? "bg-zinc-800 text-zinc-100"
      : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClass} ${active ? variants.default : variants.ghost}`}
      title={label}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
};

// --- Main Component ---

export default function CollaborationHub() {
  // State
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"chat" | "participants">("chat");
  const [code, setCode] = useState(`// Welcome to collaborative coding!
// Start typing to see real-time collaboration

function initializeSystem() {
  console.log("System booting...");
  const team = ["Alex", "Sarah", "You"];
  
  team.forEach(member => {
    console.log(\`Hello \${member}, ready to code?\`);
  });
}`);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // --- Mock Data & Effects ---

  useEffect(() => {
    // Initial Data
    setCollaborators([
      { id: "1", name: "You", isOwner: true, isActive: true, color: USER_COLORS[0] },
      { id: "2", name: "Alex CodeMaster", isOwner: false, isActive: true, cursor: { line: 5, column: 10 }, color: USER_COLORS[1] },
      { id: "3", name: "Sarah DevQueen", isOwner: false, isActive: true, cursor: { line: 8, column: 15 }, color: USER_COLORS[2] },
    ]);

    setChatMessages([
      { id: "1", user: "System", message: "Session initialized. v2.4.0", timestamp: new Date(), type: "system" },
      { id: "2", user: "Alex CodeMaster", message: "Hey team, looking at the cursor logic now.", timestamp: new Date(), type: "message", color: USER_COLORS[1] },
      { id: "3", user: "Sarah DevQueen", message: "I'll handle the UI components.", timestamp: new Date(), type: "message", color: USER_COLORS[2] },
    ]);

    // Cursor Simulation
    const interval = setInterval(() => {
      setCollaborators((prev) => prev.map((c) => {
        if (c.id !== "1") {
          return {
            ...c,
            cursor: {
              line: Math.max(1, Math.floor(Math.random() * 12) + 1),
              column: Math.max(1, Math.floor(Math.random() * 30) + 1),
            }
          };
        }
        return c;
      }));
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, activeTab]);

  // --- Handlers ---

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const message: ChatMessage = {
      id: Date.now().toString(),
      user: "You",
      message: newMessage,
      timestamp: new Date(),
      type: "message",
      color: USER_COLORS[0],
    };
    setChatMessages((prev) => [...prev, message]);
    setNewMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // --- Render ---

  return (
    <div className="h-screen w-full bg-zinc-950 text-zinc-100 flex overflow-hidden font-sans">

      {/* 1. MAIN AREA (Editor) */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Header Toolbar */}
        <div className="h-14 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-lg">
              <Code2 className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-zinc-100">Project_Alpha_v2.tsx</h1>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs text-zinc-500">Live Session</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800 mr-2">
              <IconButton
                active={isAudioEnabled}
                onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                icon={isAudioEnabled ? Mic : MicOff}
                label="Toggle Mic"
              />
              <IconButton
                active={isVideoEnabled}
                onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                icon={isVideoEnabled ? Video : VideoOff}
                label="Toggle Video"
              />
            </div>

            <button className="h-9 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-indigo-900/20">
              <Share2 className="w-4 h-4" /> Share
            </button>
          </div>
        </div>

        {/* Mock Code Editor */}
        <div className="flex-1 relative bg-zinc-950 overflow-hidden flex">
          {/* Line Numbers */}
          <div className="w-12 bg-zinc-950 border-r border-zinc-800 pt-4 flex flex-col items-end pr-3 text-zinc-600 font-mono text-sm select-none">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="leading-6">{i + 1}</div>
            ))}
          </div>

          {/* Code Area */}
          <div className="flex-1 relative font-mono text-sm">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full bg-transparent text-zinc-300 p-4 leading-6 focus:outline-none resize-none z-10 relative"
              spellCheck={false}
            />

            {/* Simulated Cursors Overlay */}
            <div className="absolute inset-0 pointer-events-none p-4">
              {collaborators.filter(c => c.id !== "1" && c.cursor).map(collab => (
                <motion.div
                  key={collab.id}
                  initial={false}
                  animate={{
                    top: (collab.cursor!.line - 1) * 24, // Approx line height
                    left: collab.cursor!.column * 8.5 // Approx char width
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="absolute w-0.5 h-5"
                  style={{ backgroundColor: collab.color }}
                >
                  <div
                    className="absolute -top-6 left-0 px-2 py-0.5 rounded text-[10px] font-bold text-zinc-950 whitespace-nowrap opacity-100 transition-opacity"
                    style={{ backgroundColor: collab.color }}
                  >
                    {collab.name}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. RIGHT SIDEBAR */}
      <div className="w-80 bg-zinc-900 border-l border-zinc-800 flex flex-col shrink-0">

        {/* Tabs */}
        <div className="flex border-b border-zinc-800">
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-2 ${activeTab === "chat" ? "border-indigo-500 text-zinc-100" : "border-transparent text-zinc-500 hover:text-zinc-300"}`}
          >
            <MessageSquare className="w-4 h-4" /> Chat
          </button>
          <button
            onClick={() => setActiveTab("participants")}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-2 ${activeTab === "participants" ? "border-indigo-500 text-zinc-100" : "border-transparent text-zinc-500 hover:text-zinc-300"}`}
          >
            <Users className="w-4 h-4" /> Team <span className="bg-zinc-800 text-zinc-400 px-1.5 rounded-full text-xs">{collaborators.length}</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden relative">

          {/* CHAT TAB */}
          {activeTab === "chat" && (
            <div className="absolute inset-0 flex flex-col">
              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className={`flex flex-col ${msg.type === "system" ? "items-center my-2" : "items-start"}`}>
                    {msg.type === "system" ? (
                      <span className="text-[10px] font-medium text-zinc-600 bg-zinc-950/50 px-2 py-1 rounded-full uppercase tracking-wider">{msg.message}</span>
                    ) : (
                      <div className="flex gap-3 w-full group">
                        <Avatar name={msg.user} color={msg.color || "#71717a"} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline justify-between mb-1">
                            <span className="text-xs font-bold text-zinc-300">{msg.user}</span>
                            <span className="text-[10px] text-zinc-600">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <div className="text-sm text-zinc-400 leading-relaxed break-words">
                            {msg.message}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-zinc-800 bg-zinc-900">
                <div className="relative">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-4 pr-12 py-3 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all resize-none h-12 custom-scrollbar"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className="absolute right-2 top-2 p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md disabled:opacity-50 disabled:bg-zinc-800 disabled:text-zinc-500 transition-all"
                  >
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* PARTICIPANTS TAB */}
          {activeTab === "participants" && (
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Online - {collaborators.length}</h3>
                <button className="p-1 hover:bg-zinc-800 rounded text-zinc-500"><Settings className="w-4 h-4" /></button>
              </div>

              <div className="space-y-1">
                {collaborators.map((collab) => (
                  <div key={collab.id} className="group flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-800/50 transition-colors border border-transparent hover:border-zinc-800">
                    <div className="relative">
                      <Avatar name={collab.name} color={collab.color} />
                      {collab.isActive && <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-zinc-900 rounded-full flex items-center justify-center"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /></div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-zinc-200 truncate">{collab.name}</span>
                        {collab.isOwner && <Crown className="w-3 h-3 text-amber-500 fill-amber-500/20" />}
                      </div>
                      <div className="text-xs text-zinc-500 truncate">
                        {collab.isActive ? "Editing file..." : "Away"}
                      </div>
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-zinc-700 rounded text-zinc-400 transition-all">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 py-2 border border-dashed border-zinc-700 rounded-lg text-zinc-500 hover:text-zinc-300 hover:border-zinc-500 hover:bg-zinc-800/50 transition-all text-sm flex items-center justify-center gap-2">
                <UserPlus className="w-4 h-4" /> Invite Collaborator
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}