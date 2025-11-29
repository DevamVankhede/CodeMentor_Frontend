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
} from "lucide-react";
import Button from "@/components/ui/Button";
import PerfectAICodeEditor from "@/components/editor/PerfectAICodeEditor";

interface Collaborator {
  id: string;
  name: string;
  avatar?: string;
  isOwner: boolean;
  isActive: boolean;
  cursor?: { line: number; column: number };
  color: string; // Add color for cursor and chat
}

interface ChatMessage {
  id: string;
  user: string;
  message: string;
  timestamp: Date;
  type: "message" | "system";
  color?: string; // Add color to chat messages
}

interface CollaborationHubProps {
  readonly roomId: string;
  readonly isOwner?: boolean;
}

const USER_COLORS = [
  "#E57373",
  "#81C784",
  "#64B5F6",
  "#FFD54F",
  "#BA68C8",
  "#4DB6AC",
];

export default function CollaborationHub({
  roomId,
  isOwner = false,
}: CollaborationHubProps) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showChat, setShowChat] = useState(true);
  const [showParticipants, setShowParticipants] = useState(true);
  const [code, setCode] = useState(`// Welcome to collaborative coding!
// Start typing to see real-time collaboration

function hello() {
  console.log("Hello, team!");
}`);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const getInitialCollaborators = (isOwner: boolean): Collaborator[] => {
    return [
      {
        id: "1",
        name: "You",
        isOwner: isOwner,
        isActive: true,
        color: USER_COLORS[0],
      },
      {
        id: "2",
        name: "Alex CodeMaster",
        isOwner: false,
        isActive: true,
        cursor: { line: 5, column: 10 },
        color: USER_COLORS[1],
      },
      {
        id: "3",
        name: "Sarah DevQueen",
        isOwner: false,
        isActive: true,
        cursor: { line: 2, column: 15 },
        color: USER_COLORS[2],
      },
    ];
  };

  const getInitialChatMessages = (): ChatMessage[] => {
    return [
      {
        id: "1",
        user: "System",
        message: "Welcome to the collaboration session!",
        timestamp: new Date(),
        type: "system",
      },
      {
        id: "2",
        user: "Alex CodeMaster",
        message: "Hey everyone! Ready to code together?",
        timestamp: new Date(),
        type: "message",
        color: USER_COLORS[1],
      },
    ];
  };

  useEffect(() => {
    // Initialize SignalR connection here
    // This would connect to the CollaborationHub on the backend
    setCollaborators(getInitialCollaborators(isOwner));
    setChatMessages(getInitialChatMessages());

    return () => {
      // Cleanup connection
    };
  }, [roomId, isOwner]);

  useEffect(() => {
    scrollToBottom();
    if (showChat) {
      setUnreadMessages(0);
    }
  }, [chatMessages, showChat]);

  const simulateCollaboratorCursorMove = (
    prevCollabs: Collaborator[]
  ): Collaborator[] => {
    return prevCollabs.map((collab) => {
      if (collab.id !== "1") {
        return {
          ...collab,
          cursor: {
            line: Math.max(1, Math.floor(Math.random() * 10) + 1),
            column: Math.max(1, Math.floor(Math.random() * 20) + 1),
          },
        };
      }
      return collab;
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCollaborators(simulateCollaboratorCursorMove);
    }, 3000);

    return () => clearInterval(interval);
  }, []); // Empty dependency array as simulateCollaboratorCursorMove is pure

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

    setChatMessages((prev) => {
      const newMessages = [...prev, message];
      if (!showChat) {
        setUnreadMessages((prevCount) => prevCount + 1);
      }
      return newMessages;
    });
    setNewMessage("");
  };

  const copyRoomLink = () => {
    const link = `${window.location.origin}/collaborate/${roomId}`;
    navigator.clipboard.writeText(link);
    // Show toast notification
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    // In a real scenario, this would send code changes via SignalR
    // You'd also receive changes from others and apply them to the editor
  };

  const handleCursorChange = (position: {
    lineNumber: number;
    column: number;
  }) => {
    setCollaborators((prev) =>
      prev.map((collab) =>
        collab.id === "1"
          ? {
            ...collab,
            cursor: { line: position.lineNumber, column: position.column },
          }
          : collab
      )
    );
    // In a real scenario, this would send cursor position via SignalR
  };

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    // Implement WebRTC audio toggle
  };

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    // Implement WebRTC video toggle
  };

  return (
    <div className="h-screen flex bg-bg-primary">
      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border-primary bg-surface-secondary">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-text-primary">
              Collaborative Session
            </h1>
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <Users className="w-4 h-4" />
              {collaborators.filter((c) => c.isActive).length} active
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Voice/Video Controls */}
            <Button
              size="sm"
              variant={isAudioEnabled ? "primary" : "outline"}
              onClick={toggleAudio}
              leftIcon={
                isAudioEnabled ? (
                  <Mic className="w-4 h-4" />
                ) : (
                  <MicOff className="w-4 h-4" />
                )
              }
            >
              {isAudioEnabled ? "Mute" : "Unmute"}
            </Button>

            <Button
              size="sm"
              variant={isVideoEnabled ? "primary" : "outline"}
              onClick={toggleVideo}
              leftIcon={
                isVideoEnabled ? (
                  <Video className="w-4 h-4" />
                ) : (
                  <VideoOff className="w-4 h-4" />
                )
              }
            >
              {isVideoEnabled ? "Stop Video" : "Start Video"}
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={copyRoomLink}
              leftIcon={<Share2 className="w-4 h-4" />}
            >
              Share Room
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowParticipants(!showParticipants)}
              leftIcon={<Users className="w-4 h-4" />}
            >
              Participants
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowChat(!showChat)}
              leftIcon={
                <div className="relative">
                  <MessageSquare className="w-4 h-4" />
                  {unreadMessages > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {unreadMessages}
                    </span>
                  )}
                </div>
              }
            >
              Chat
            </Button>
          </div>
        </div>

        {/* Code Editor */}
        <div className="flex-1">
          <PerfectAICodeEditor
            initialCode={code}
            language="javascript"
            collaborative={true}
            roomId={roomId}
            onCodeChange={handleCodeChange}
            onCursorChange={handleCursorChange}
            collaborators={collaborators} // Pass collaborators to the editor
          />
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-80 border-l border-border-primary bg-surface-secondary flex flex-col">
        {/* Participants Panel */}
        {showParticipants && (
          <div className="border-b border-border-primary">
            <div className="p-4">
              <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Participants ({collaborators.length})
              </h3>

              <div className="space-y-2">
                {collaborators.map((collaborator) => (
                  <div
                    key={collaborator.id}
                    className="flex items-center gap-3 p-2 rounded-lg bg-surface-primary"
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${collaborator.isActive ? "bg-green-500" : "bg-gray-500"
                        }`}
                    />

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-text-primary">
                          {collaborator.name}
                        </span>
                        {collaborator.isOwner && (
                          <Crown className="w-3 h-3 text-yellow-500" />
                        )}
                      </div>
                      {collaborator.cursor && (
                        <div className="text-xs text-text-tertiary">
                          Line {collaborator.cursor.line}, Col{" "}
                          {collaborator.cursor.column}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <Button
                size="sm"
                variant="outline"
                className="w-full mt-3"
                leftIcon={<UserPlus className="w-4 h-4" />}
              >
                Invite More
              </Button>
            </div>
          </div>
        )}

        {/* Chat Panel */}
        {showChat && (
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-border-primary">
              <h3 className="font-semibold text-text-primary flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Team Chat
                {unreadMessages > 0 && !showChat && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadMessages}
                  </span>
                )}
              </h3>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`${message.type === "system"
                    ? "text-center text-xs text-text-tertiary"
                    : ""
                    }`}
                >
                  {message.type === "system" ? (
                    <div className="italic">{message.message}</div>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-xs font-medium text-text-secondary"
                          style={{ color: message.color }}
                        >
                          {message.user}
                        </span>
                        <span className="text-xs text-text-tertiary">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="text-sm text-text-primary bg-surface-primary p-2 rounded">
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
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault(); // Prevent new line in input
                      sendMessage();
                    }
                  }}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 bg-surface-primary border border-border-primary rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <Button
                  size="sm"
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
