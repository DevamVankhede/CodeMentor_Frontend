"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Editor from "@monaco-editor/react";
import { useAuth } from "@/contexts/AuthContext";
import RoyalCard from "../ui/RoyalCard";
import { RoyalButton } from "../ui/RoyalButton";

interface Collaborator {
  id: string;
  name: string;
  avatar?: string;
  cursor?: { line: number; column: number };
  isActive: boolean;
}

interface CollaborativeEditorProps {
  sessionId?: string;
  initialCode?: string;
  language?: string;
}

export default function CollaborativeEditor({
  sessionId,
  initialCode = "",
  language = "javascript",
}: CollaborativeEditorProps) {
  const { user } = useAuth();
  const [code, setCode] = useState(initialCode);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [sessionInfo, setSessionInfo] = useState<{
    name: string;
    participants: number;
    createdAt: string;
  } | null>(null);

  // Simulate real-time collaboration
  useEffect(() => {
    if (sessionId) {
      // Simulate connecting to collaboration session
      setTimeout(() => {
        setIsConnected(true);
        setCollaborators([
          {
            id: "1",
            name: "Alex CodeMaster",
            isActive: true,
            cursor: { line: 5, column: 12 },
          },
          {
            id: "2",
            name: "Sarah DevQueen",
            isActive: true,
            cursor: { line: 10, column: 8 },
          },
        ]);
        setSessionInfo({
          name: "Royal Code Quest #1",
          participants: 3,
          createdAt: new Date().toISOString(),
        } as { name: string; participants: number; createdAt: string });
      }, 1000);
    }
  }, [sessionId]);

  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
      // In real implementation, broadcast changes to other users
    }
  };

  const inviteCollaborator = () => {
    // Copy session link to clipboard
    const sessionLink = `${window.location.origin}/collaborate/${sessionId}`;
    navigator.clipboard.writeText(sessionLink);
    // Show toast notification
  };

  return (
    <div className="space-y-6">
      {/* Session Header */}
      {sessionId && (
        <RoyalCard>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-3 h-3 bg-green-400 rounded-full"
              />
              <div>
                <h3 className="text-white font-gaming font-bold">
                  {sessionInfo?.name || "Collaborative Session"}
                </h3>
                <p className="text-white/60 text-sm">
                  {collaborators.length + 1} warriors coding together
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <RoyalButton onClick={inviteCollaborator}>
                📋 Copy Invite Link
              </RoyalButton>
            </div>
          </div>
        </RoyalCard>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-3">
          <RoyalCard>
            <div className="bg-gradient-to-r from-royal-600/20 to-gaming-secondary/20 p-4 border-b border-white/10 rounded-t-2xl -m-6 mb-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-gaming font-bold text-lg">
                  👥 Collaborative Arena
                </h3>
                <div className="flex items-center gap-2">
                  {isConnected ? (
                    <span className="text-green-400 text-sm flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      Connected
                    </span>
                  ) : (
                    <span className="text-yellow-400 text-sm">
                      Connecting...
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="h-96 relative">
              <Editor
                height="100%"
                defaultLanguage={language}
                value={code}
                onChange={handleCodeChange}
                theme="vs-dark"
                options={{
                  fontSize: 14,
                  fontFamily: "JetBrains Mono",
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  padding: { top: 20, bottom: 20 },
                }}
              />

              {/* Collaborator Cursors */}
              <AnimatePresence>
                {collaborators.map((collaborator) => (
                  <motion.div
                    key={collaborator.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute pointer-events-none"
                    style={{
                      top: `${(collaborator.cursor?.line || 0) * 19}px`,
                      left: `${(collaborator.cursor?.column || 0) * 7}px`,
                    }}
                  >
                    <div className="w-0.5 h-5 bg-neon-blue animate-pulse" />
                    <div className="bg-neon-blue text-white text-xs px-2 py-1 rounded-md whitespace-nowrap">
                      {collaborator.name}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </RoyalCard>
        </div>

        {/* Collaborators Panel */}
        <div className="space-y-4">
          <RoyalCard>
            <h4 className="text-neon-blue font-gaming font-bold mb-4">
              ⚔️ Active Warriors
            </h4>

            <div className="space-y-3">
              {/* Current User */}
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-royal-500/20 to-gaming-accent/20 rounded-lg border border-neon-purple/30">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple flex items-center justify-center text-white font-bold text-sm">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-semibold">
                    {user?.name} (You)
                  </p>
                  <p className="text-neon-blue text-xs">Host</p>
                </div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              </div>

              {/* Other Collaborators */}
              {collaborators.map((collaborator, index) => (
                <motion.div
                  key={collaborator.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3 bg-gaming-dark/30 rounded-lg border border-white/10"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gaming-accent to-neon-green flex items-center justify-center text-white font-bold text-sm">
                    {collaborator.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-semibold">
                      {collaborator.name}
                    </p>
                    <p className="text-white/60 text-xs">Collaborator</p>
                  </div>
                  <div
                    className={`w-2 h-2 rounded-full ${
                      collaborator.isActive
                        ? "bg-green-400 animate-pulse"
                        : "bg-gray-400"
                    }`}
                  />
                </motion.div>
              ))}
            </div>
          </RoyalCard>

          {/* Session Chat */}
          <RoyalCard>
            <h4 className="text-neon-green font-gaming font-bold mb-4">
              💬 Battle Chat
            </h4>

            <div className="space-y-2 h-32 overflow-y-auto mb-3">
              <div className="text-xs text-white/60 p-2 bg-gaming-dark/30 rounded">
                <span className="text-neon-blue">Alex:</span> Let&apos;s
                optimize this function!
              </div>
              <div className="text-xs text-white/60 p-2 bg-gaming-dark/30 rounded">
                <span className="text-neon-green">Sarah:</span> Good idea!
                I&apos;ll handle the error handling.
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 text-xs rounded-lg bg-gaming-dark/50 border border-white/20 text-white placeholder-white/50 focus:border-neon-blue focus:outline-none"
              />
              <button className="px-3 py-2 bg-neon-blue text-white rounded-lg text-xs hover:bg-neon-purple transition-colors">
                Send
              </button>
            </div>
          </RoyalCard>
        </div>
      </div>
    </div>
  );
}
