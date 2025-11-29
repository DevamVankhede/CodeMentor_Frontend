"use client";
import React, { useState, useEffect, useRef } from "react";
import { Users, MessageSquare, Share2, ArrowLeft, Crown, Send, Copy, Check } from "lucide-react";
import Button from "@/components/ui/Button";
import Editor from "@monaco-editor/react";

interface SimpleCollaborationHubProps {
  readonly roomId: string;
  readonly onLeave: () => void;
}

interface ChatMessage {
  id: string;
  user: string;
  message: string;
  timestamp: Date;
  type: "message" | "system";
  color?: string;
}

interface Participant {
  id: string;
  name: string;
  isOwner: boolean;
  isActive: boolean;
  color: string;
}

const USER_COLORS = [
  "#E57373",
  "#81C784",
  "#64B5F6",
  "#FFD54F",
  "#BA68C8",
  "#4DB6AC",
];

export default function SimpleCollaborationHub({
  roomId,
  onLeave,
}: SimpleCollaborationHubProps) {
  const [code, setCode] = useState(`// Welcome to collaborative coding!
// Start typing to see real-time collaboration

function hello() {
  console.log("Hello, team!");
}

// Try adding your code here
const greet = (name) => {
  return \`Hello, \${name}! Welcome to the session.\`;
};

console.log(greet("Developer"));`);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      user: "System",
      message: "Welcome to the collaboration session!",
      timestamp: new Date(),
      type: "system",
    },
    {
      id: "2",
      user: "System",
      message: "Start coding together! Changes will be synchronized in real-time.",
      timestamp: new Date(),
      type: "system",
    },
  ]);

  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: "1",
      name: "You",
      isOwner: true,
      isActive: true,
      color: USER_COLORS[0],
    },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<any>(null);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;

    // Define custom theme
    monaco.editor.defineTheme("collaboration-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "6a9955" },
        { token: "keyword", foreground: "569cd6" },
        { token: "string", foreground: "ce9178" },
        { token: "number", foreground: "b5cea8" },
      ],
      colors: {
        "editor.background": "#1e1e1e",
        "editor.foreground": "#f8f8f2",
        "editorLineNumber.foreground": "#6a6a6a",
        "editor.selectionBackground": "rgba(0, 100, 200, 0.3)",
        "editor.lineHighlightBackground": "rgba(255, 255, 255, 0.08)",
      },
    });

    monaco.editor.setTheme("collaboration-dark");
  };

  const handleCodeChange = (newCode: string | undefined) => {
    if (newCode !== undefined) {
      setCode(newCode);
      // In a real app, this would send changes via WebSocket/SignalR
    }
  };

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const copyRoomLink = () => {
    const link = `${window.location.origin}/collaborate/${roomId}`;
    navigator.clipboard.writeText(link);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  return (
    <div className="h-screen flex bg-bg-primary">
      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border-primary bg-surface-secondary">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={onLeave}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              className="hover:bg-surface-primary transition-colors duration-200"
            >
              Back to Sessions
            </Button>
            <h1 className="text-xl font-bold text-text-primary">
              Collaborative Session
            </h1>
            <div className="flex items-center gap-2 px-3 py-1 bg-surface-primary rounded-full">
              <Users className="w-4 h-4 text-green-500" />
              <span className="text-sm text-text-secondary">{participants.length} active</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={copyRoomLink}
              leftIcon={linkCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              className="hover:bg-surface-primary transition-colors duration-200"
            >
              {linkCopied ? "Copied!" : "Copy Link"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              leftIcon={<Share2 className="w-4 h-4" />}
              className="hover:bg-surface-primary transition-colors duration-200"
            >
              Invite
            </Button>
          </div>
        </div>

        {/* Code Editor */}
        <div className="flex-1 overflow-hidden">
          <Editor
            height="100%"
            defaultLanguage="javascript"
            value={code}
            onChange={handleCodeChange}
            onMount={handleEditorDidMount}
            options={{
              fontSize: 14,
              minimap: { enabled: true },
              scrollBeyondLastLine: false,
              wordWrap: "on",
              automaticLayout: true,
              tabSize: 2,
              lineNumbers: "on",
              folding: true,
              renderWhitespace: "selection",
              cursorBlinking: "smooth",
              cursorSmoothCaretAnimation: "on",
              smoothScrolling: true,
              padding: { top: 16, bottom: 16 },
            }}
          />
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-80 border-l border-border-primary bg-surface-secondary flex flex-col">
        {/* Participants Panel */}
        <div className="border-b border-border-primary">
          <div className="p-4">
            <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-primary-500" />
              Participants ({participants.length})
            </h3>

            <div className="space-y-2">
              {participants.map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center gap-3 p-2 rounded-lg bg-surface-primary hover:bg-surface-primary/80 transition-colors duration-200"
                >
                  <div
                    className={`w-2 h-2 rounded-full ${participant.isActive ? "bg-green-500" : "bg-gray-500"
                      }`}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-text-primary">
                        {participant.name}
                      </span>
                      {participant.isOwner && (
                        <Crown className="w-3 h-3 text-yellow-500" />
                      )}
                    </div>
                    <div className="text-xs text-text-tertiary">Active now</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Panel */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="p-4 border-b border-border-primary">
            <h3 className="font-semibold text-text-primary flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary-500" />
              Team Chat
            </h3>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.map((message) => (
              <div
                key={message.id}
                className={`${message.type === "system"
                    ? "text-center text-xs text-text-tertiary italic"
                    : ""
                  }`}
              >
                {message.type === "system" ? (
                  <div className="py-1">{message.message}</div>
                ) : (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs font-medium"
                        style={{ color: message.color || "#64B5F6" }}
                      >
                        {message.user}
                      </span>
                      <span className="text-xs text-text-tertiary">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-sm text-text-primary bg-surface-primary p-3 rounded-lg">
                      {message.message}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-border-primary">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 bg-surface-primary border border-border-primary rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
              />
              <Button
                size="sm"
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                leftIcon={<Send className="w-4 h-4" />}
                className="hover:opacity-90 transition-opacity duration-200"
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
