"use client";
import React, { useState, useEffect, useRef } from "react";
import { Users, MessageSquare, ArrowLeft, Crown, Send, Copy, Check } from "lucide-react";
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
  timestamp: string;
  type: "message" | "system";
  color?: string;
}

interface Participant {
  id: string;
  name: string;
  isOwner: boolean;
  isActive: boolean;
  color: string;
  lastSeen: number;
}

const USER_COLORS = ["#E57373", "#81C784", "#64B5F6", "#FFD54F", "#BA68C8", "#4DB6AC"];

// Use environment variable for WebSocket URL
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080";

export default function SimpleCollaborationHub({ roomId, onLeave }: SimpleCollaborationHubProps) {
  const [code, setCode] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<any>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const userId = useRef(`user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const userName = useRef(`User${Math.floor(Math.random() * 1000)}`);
  const userColor = useRef(USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)]);
  const isUpdatingCode = useRef(false);

  // Initialize WebSocket connection
  useEffect(() => {
    console.log("🔌 Connecting to WebSocket server...");

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ Connected to collaboration server");
      setIsConnected(true);

      // Join the room
      ws.send(JSON.stringify({
        type: 'join',
        roomId,
        user: {
          id: userId.current,
          name: userName.current,
          color: userColor.current,
        },
      }));
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        handleServerMessage(message);
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("❌ WebSocket connection failed. Make sure the server is running on", WS_URL);
      setIsConnected(false);
    };

    ws.onclose = (event) => {
      console.log("🔴 Disconnected from server. Code:", event.code, "Reason:", event.reason || "Connection closed");
      setIsConnected(false);
    };

    // Heartbeat every 5 seconds
    const heartbeatInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'heartbeat',
          roomId,
          userId: userId.current,
        }));
      }
    }, 5000);

    // Cleanup
    return () => {
      clearInterval(heartbeatInterval);
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'leave',
          roomId,
          userId: userId.current,
          userName: userName.current,
        }));
        ws.close();
      }
    };
  }, [roomId]);

  // Handle messages from server
  const handleServerMessage = (message: any) => {
    console.log("📨 Received:", message.type);

    switch (message.type) {
      case 'init':
        // Initial state when joining
        setCode(message.data.code);
        setChatMessages(message.data.messages);
        // Remove duplicates by ID
        const uniqueParticipants = Array.from(
          new Map(message.data.participants.map((p: Participant) => [p.id, p])).values()
        );
        setParticipants(uniqueParticipants);
        break;

      case 'user-joined':
        // New user joined - prevent duplicates
        setParticipants(prev => {
          const filtered = prev.filter(p => p.id !== message.data.participant.id);
          return [...filtered, message.data.participant];
        });
        setChatMessages(prev => [...prev, message.data.message]);
        break;

      case 'user-left':
        // User left
        const uniqueLeft = Array.from(
          new Map(message.data.participants.map((p: Participant) => [p.id, p])).values()
        );
        setParticipants(uniqueLeft);
        setChatMessages(prev => [...prev, message.data.message]);
        break;

      case 'code-update':
        // Code changed by another user
        if (!isUpdatingCode.current) {
          setCode(message.data.code);
        }
        break;

      case 'chat-update':
        // New chat message - prevent duplicates
        setChatMessages(prev => {
          const exists = prev.some(m => m.id === message.data.message.id);
          if (exists) return prev;
          return [...prev, message.data.message];
        });
        break;
    }
  };

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Handle code change
  const handleCodeChange = (newCode: string | undefined) => {
    if (newCode === undefined || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    isUpdatingCode.current = true;
    setCode(newCode);

    // Send to server
    wsRef.current.send(JSON.stringify({
      type: 'code-change',
      roomId,
      code: newCode,
    }));

    setTimeout(() => {
      isUpdatingCode.current = false;
    }, 100);
  };

  // Send message
  const sendMessage = () => {
    if (!newMessage.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    const message: ChatMessage = {
      id: `msg-${Date.now()}-${userId.current}-${Math.random().toString(36).substr(2, 9)}`,
      user: userName.current,
      message: newMessage,
      timestamp: new Date().toISOString(),
      type: "message",
      color: userColor.current,
    };

    // Send to server
    wsRef.current.send(JSON.stringify({
      type: 'chat-message',
      roomId,
      message,
    }));

    // Add to local state immediately (will be deduplicated if server sends it back)
    setChatMessages(prev => {
      const exists = prev.some(m => m.id === message.id);
      if (exists) return prev;
      return [...prev, message];
    });
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;

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
      },
    });

    monaco.editor.setTheme("collaboration-dark");
  };

  const copyRoomLink = () => {
    const link = `${window.location.origin}/collaborate?join=${roomId}`;
    navigator.clipboard.writeText(link);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const activeParticipants = participants.filter(p => p.isActive);

  return (
    <div className="h-screen flex bg-bg-primary">
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border-primary bg-surface-secondary">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onLeave} leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to Sessions
            </Button>
            <h1 className="text-xl font-bold text-text-primary">Collaborative Session</h1>
            <div className="flex items-center gap-2 px-3 py-1 bg-surface-primary rounded-full">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <Users className="w-4 h-4 text-green-500" />
              <span className="text-sm text-text-secondary">{activeParticipants.length} active</span>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={copyRoomLink}
            leftIcon={linkCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          >
            {linkCopied ? "Copied!" : "Copy Link"}
          </Button>
        </div>

        {!isConnected && (
          <div className="p-4 bg-yellow-500/10 border-b border-yellow-500/20 text-yellow-500 text-sm">
            <div className="flex items-center gap-2">
              <span className="animate-pulse">⚠️</span>
              <div>
                <div className="font-semibold">Connecting to collaboration server...</div>
                <div className="text-xs mt-1">
                  Server URL: {WS_URL}
                  <br />
                  Make sure WebSocket server is running: <code className="bg-black/20 px-1 rounded">node collaboration-server.js</code>
                </div>
              </div>
            </div>
          </div>
        )}

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
              padding: { top: 16, bottom: 16 },
            }}
          />
        </div>
      </div>

      <div className="w-80 border-l border-border-primary bg-surface-secondary flex flex-col">
        <div className="border-b border-border-primary">
          <div className="p-4">
            <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-primary-500" />
              Participants ({activeParticipants.length})
            </h3>
            <div className="space-y-2">
              {participants.map((participant, index) => (
                <div key={`${participant.id}-${index}`} className="flex items-center gap-3 p-2 rounded-lg bg-surface-primary">
                  <div className={`w-2 h-2 rounded-full ${participant.isActive ? "bg-green-500" : "bg-gray-500"}`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-text-primary">{participant.name}</span>
                      {participant.isOwner && <Crown className="w-3 h-3 text-yellow-500" />}
                    </div>
                    <div className="text-xs text-text-tertiary">{participant.isActive ? "Active now" : "Offline"}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col min-h-0">
          <div className="p-4 border-b border-border-primary">
            <h3 className="font-semibold text-text-primary flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary-500" />
              Team Chat
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.map((message, index) => (
              <div
                key={`${message.id}-${index}`}
                className={message.type === "system" ? "text-center text-xs text-text-tertiary italic" : ""}
              >
                {message.type === "system" ? (
                  <div className="py-1">{message.message}</div>
                ) : (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium" style={{ color: message.color || "#64B5F6" }}>
                        {message.user}
                      </span>
                      <span className="text-xs text-text-tertiary">
                        {new Date(message.timestamp).toLocaleTimeString()}
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

          <div className="p-4 border-t border-border-primary">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 bg-surface-primary border border-border-primary rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-500"
                disabled={!isConnected}
              />
              <Button size="sm" onClick={sendMessage} disabled={!newMessage.trim() || !isConnected} leftIcon={<Send className="w-4 h-4" />}>
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
