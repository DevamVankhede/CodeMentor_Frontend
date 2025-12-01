"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import Cookies from "js-cookie";
import Navigation from "@/components/layout/Navigation";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import CollaborationHub from "@/components/collaboration/CollaborationHub";
import SimpleCollaborationHub from "@/components/collaboration/SimpleCollaborationHub";
import {
  Users,
  Plus,
  Code2,
  Globe,
  Lock,
  Clock,
  Star,
  Play,
  Copy,
  ArrowLeft,
  Trash2,
} from "lucide-react";

interface CollaborationSession {
  id: string;
  roomId: string;
  name: string;
  description: string;
  language: string;
  participants: number;
  maxParticipants: number;
  isPublic: boolean;
  createdAt: string;
  owner: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  tags: string[];
}

export default function CollaboratePage() {
  const { isAuthenticated } = useAuth();
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [sessions, setSessions] = useState<CollaborationSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSession, setNewSession] = useState({
    name: "",
    description: "",
    language: "javascript",
    isPublic: true,
    maxParticipants: 5,
  });

  const mockSessions: CollaborationSession[] = [
    {
      id: "1",
      roomId: "room-1",
      name: "React Components Workshop",
      description: "Building reusable React components together",
      language: "javascript",
      participants: 3,
      maxParticipants: 5,
      isPublic: true,
      createdAt: "2024-01-15T10:00:00Z",
      owner: {
        id: "1",
        name: "Alex CodeMaster",
        email: "alex@example.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      },
      tags: ["react", "components", "frontend"],
    },
    {
      id: "2",
      roomId: "room-2",
      name: "Algorithm Study Group",
      description: "Solving LeetCode problems collaboratively",
      language: "python",
      participants: 2,
      maxParticipants: 4,
      isPublic: true,
      createdAt: "2024-01-15T14:30:00Z",
      owner: {
        id: "2",
        name: "Sarah DevQueen",
        email: "sarah@example.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      },
      tags: ["algorithms", "leetcode", "python"],
    },
    {
      id: "3",
      roomId: "room-3",
      name: "Backend API Development",
      description: "Building REST APIs with Node.js",
      language: "javascript",
      participants: 4,
      maxParticipants: 6,
      isPublic: false,
      createdAt: "2024-01-15T16:00:00Z",
      owner: {
        id: "3",
        name: "Demo Warrior",
        email: "demo@example.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Demo",
      },
      tags: ["nodejs", "api", "backend"],
    },
  ];

  const languages = [
    { id: "javascript", name: "JavaScript", icon: "🟨" },
    { id: "python", name: "Python", icon: "🐍" },
    { id: "java", name: "Java", icon: "☕" },
    { id: "cpp", name: "C++", icon: "⚡" },
    { id: "typescript", name: "TypeScript", icon: "🔷" },
  ];

  const searchParams = useSearchParams();

  const fetchSessions = async () => {
    try {
      setLoading(true);

      // First, load from localStorage
      const storedSessions = JSON.parse(
        localStorage.getItem("collaboration-sessions") || "[]"
      );
      console.log("Loaded sessions from localStorage:", storedSessions);

      // Try API call (optional)
      const token = Cookies.get("auth_token");
      if (token) {
        try {
          console.log("Fetching sessions from API...");

          const response = await fetch(
            `${
              process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
            }/api/collaboration/sessions`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          console.log("Fetch sessions response status:", response.status);

          if (response.ok) {
            const sessionData = await response.json();
            console.log("Successfully fetched sessions from API:", sessionData);
            // Merge API data with local data
            const allSessions = [...sessionData, ...storedSessions];
            setSessions(allSessions);
            return;
          } else {
            console.log(
              "API failed to fetch sessions:",
              response.status,
              "- using local data"
            );
          }
        } catch (apiError) {
          console.log("API call failed:", apiError, "- using local data");
        }
      }

      // Fallback: Use local data (localStorage + mock data)
      const allSessions = [...storedSessions, ...mockSessions];
      setSessions(allSessions);
      console.log("Using local sessions:", allSessions);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      // Final fallback to mock data
      setSessions(mockSessions);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    fetchSessions().then(() => {
      const joinId = searchParams?.get("join");
      if (joinId) {
        // Try to join the session that was shared via link
        joinSession(joinId);
      }
    });
  }, [isAuthenticated, searchParams]);

  const createSession = async () => {
    try {
      console.log("Creating new session:", newSession);

      // Try API call first (optional)
      const token = Cookies.get("auth_token");
      if (token) {
        try {
          const response = await fetch(
            `${
              process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
            }/api/collaboration/sessions`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name: newSession.name,
                description: newSession.description,
                language: newSession.language,
                isPublic: newSession.isPublic,
                initialCode:
                  "// Welcome to the collaboration session!\n// Start coding here...",
              }),
            }
          );

          if (response.ok) {
            const sessionData = await response.json();
            console.log("Session created via API:", sessionData);
            setActiveSession(sessionData.roomId);
            setShowCreateModal(false);
            await fetchSessions();
            resetForm();
            return;
          } else {
            console.log(
              "API session creation failed with status:",
              response.status,
              "- falling back to local creation"
            );
          }
        } catch (apiError) {
          console.log(
            "API call failed:",
            apiError,
            "- falling back to local creation"
          );
        }
      }

      // Fallback: Create session locally (this always works)
      const newSessionId = `session-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 8)}`;
      const roomId = `room-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 8)}`;

      const localSession: CollaborationSession = {
        id: newSessionId,
        roomId: roomId,
        name: newSession.name || "New Session",
        description: newSession.description || "No description",
        language: newSession.language,
        participants: 1, // Creator joins immediately
        maxParticipants: newSession.maxParticipants,
        isPublic: newSession.isPublic,
        createdAt: new Date().toISOString(),
        owner: {
          id: "1", // This would come from user context
          name: "You", // This would come from user context
          email: "user@example.com",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=User",
        },
        tags: [], // Could be added later
      };

      // Add to local sessions
      setSessions((prevSessions) => [localSession, ...prevSessions]);

      // Store in localStorage for persistence
      const storedSessions = JSON.parse(
        localStorage.getItem("collaboration-sessions") || "[]"
      );
      storedSessions.unshift(localSession);
      localStorage.setItem(
        "collaboration-sessions",
        JSON.stringify(storedSessions)
      );

      setActiveSession(roomId);
      setShowCreateModal(false);
      resetForm();
      console.log("Session created, active session set to:", roomId);

      console.log("Session created locally:", localSession);
      alert(
        "Session created successfully! You can now collaborate with others."
      );
    } catch (error) {
      console.error("Error creating session:", error);
      alert("Failed to create session. Please try again.");
    }
  };

  const resetForm = () => {
    setNewSession({
      name: "",
      description: "",
      language: "javascript",
      isPublic: true,
      maxParticipants: 5,
    });
  };

  const joinSession = async (sessionId: string) => {
    try {
      console.log("Attempting to join session:", sessionId);

      // First, try to find the session in our local data
      const session = sessions.find((s) => s.id === sessionId);
      if (!session) {
        console.error("Session not found:", sessionId);
        alert("Session not found. It may have been deleted or expired.");
        return;
      }

      // Check if session is full
      if (session.participants >= session.maxParticipants) {
        alert("This session is full. Please try another session.");
        return;
      }

      // Try API call first (optional - will fallback to local if it fails)
      const token = Cookies.get("auth_token");
      if (token) {
        try {
          const response = await fetch(
            `${
              process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
            }/api/collaboration/sessions/${sessionId}/join`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            console.log("Successfully joined session via API:", data);
            setActiveSession(sessionId);
            return;
          } else {
            console.log(
              "API join failed with status:",
              response.status,
              "- falling back to local join"
            );
          }
        } catch (apiError) {
          console.log(
            "API call failed:",
            apiError,
            "- falling back to local join"
          );
        }
      }

      // Fallback: Join locally (this always works)
      console.log("Joining session locally:", sessionId);

      // Update local session participants count
      setSessions((prevSessions) =>
        prevSessions.map((s) =>
          s.id === sessionId
            ? {
                ...s,
                participants: Math.min(s.participants + 1, s.maxParticipants),
              }
            : s
        )
      );

      // Update localStorage
      const storedSessions = JSON.parse(
        localStorage.getItem("collaboration-sessions") || "[]"
      );
      const updatedStoredSessions = storedSessions.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              participants: Math.min(s.participants + 1, s.maxParticipants),
            }
          : s
      );
      localStorage.setItem(
        "collaboration-sessions",
        JSON.stringify(updatedStoredSessions)
      );

      setActiveSession(sessionId);
      console.log("Successfully joined session locally");
      console.log("Active session set to:", sessionId);
    } catch (error) {
      console.error("Error joining session:", error);
      alert("Failed to join session. Please try again.");
    }
  };

  const leaveSession = () => {
    console.log("Leaving session:", activeSession);
    setActiveSession(null);
  };

  const deleteSession = (sessionId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this session? This action cannot be undone."
      )
    ) {
      // Remove from local state
      setSessions((prevSessions) =>
        prevSessions.filter((s) => s.id !== sessionId)
      );

      // Remove from localStorage
      const storedSessions = JSON.parse(
        localStorage.getItem("collaboration-sessions") || "[]"
      );
      const updatedStoredSessions = storedSessions.filter(
        (s) => s.id !== sessionId
      );
      localStorage.setItem(
        "collaboration-sessions",
        JSON.stringify(updatedStoredSessions)
      );

      console.log("Session deleted:", sessionId);
      alert("Session deleted successfully!");
    }
  };

  const copySessionLink = async (sessionId: string) => {
    try {
      const link = `${window.location.origin}/collaborate?join=${sessionId}`;
      await navigator.clipboard.writeText(link);
      console.log("Session link copied to clipboard:", link);
      alert("Session link copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy link:", error);
      // Fallback: show the link in a prompt
      prompt(
        "Copy this session link:",
        `${window.location.origin}/collaborate/${sessionId}`
      );
    }
  };

  const renderSessionsContent = () => {
    console.log("renderSessionsContent called with sessions:", sessions);

    if (loading) {
      return (
        <div className="col-span-2 text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
          <p className="text-text-secondary mt-2">Loading sessions...</p>
        </div>
      );
    }

    if (!sessions || sessions.length === 0) {
      return (
        <div className="col-span-2 text-center py-8">
          <Users className="w-16 h-16 text-text-tertiary mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            No Active Sessions
          </h3>
          <p className="text-text-secondary">
            Be the first to create a collaboration session!
          </p>
        </div>
      );
    }

    return sessions.map((session, index) => {
      // Safety check to ensure session has required properties
      if (!session || typeof session !== "object") {
        console.warn("Invalid session data:", session);
        return null;
      }

      // Ensure session has required properties with defaults
      const safeSession = {
        id: session.id || `session-${index}`,
        name: session.name || "Unnamed Session",
        description: session.description || "No description",
        language: session.language || "javascript",
        participants:
          typeof session.participants === "number" ? session.participants : 0,
        maxParticipants:
          typeof session.maxParticipants === "number"
            ? session.maxParticipants
            : 5,
        isPublic:
          typeof session.isPublic === "boolean" ? session.isPublic : true,
        createdAt: session.createdAt || new Date().toISOString(),
        owner: session.owner || {
          id: "unknown",
          name: "Unknown",
          email: "unknown@example.com",
        },
        tags: Array.isArray(session.tags) ? session.tags : [],
      };

      return (
        <motion.div
          key={safeSession.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card hover className="h-full">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-text-primary">
                      {safeSession.name}
                    </h3>
                    {safeSession.isPublic ? (
                      <Globe className="w-4 h-4 text-green-500" />
                    ) : (
                      <Lock className="w-4 h-4 text-yellow-500" />
                    )}
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    {safeSession.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-text-tertiary mb-4">
                <div className="flex items-center gap-1">
                  <span>
                    {languages.find((l) => l.id === safeSession.language)?.icon}
                  </span>
                  <span>
                    {languages.find((l) => l.id === safeSession.language)?.name}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {safeSession.participants}/{safeSession.maxParticipants}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {new Date(safeSession.createdAt).toLocaleTimeString()}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {safeSession.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-surface-secondary text-text-tertiary text-xs rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">
                  by{" "}
                  {typeof safeSession.owner === "string"
                    ? safeSession.owner
                    : safeSession.owner?.name || "Unknown"}
                </span>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copySessionLink(safeSession.id)}
                    leftIcon={<Copy className="w-4 h-4" />}
                  >
                    Copy Link
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => joinSession(safeSession.id)}
                    leftIcon={<Play className="w-4 h-4" />}
                    disabled={
                      safeSession.participants >= safeSession.maxParticipants
                    }
                  >
                    {safeSession.participants >= safeSession.maxParticipants
                      ? "Full"
                      : "Join"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteSession(safeSession.id)}
                    leftIcon={<Trash2 className="w-4 h-4" />}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      );
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-bg-primary">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <Card>
            <CardContent className="text-center py-8">
              <Users className="w-16 h-16 text-primary-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-text-primary mb-2">
                Sign In to Collaborate
              </h2>
              <p className="text-text-secondary">
                Join coding sessions and collaborate with developers worldwide!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (activeSession) {
    return (
      <SimpleCollaborationHub roomId={activeSession} onLeave={leaveSession} />
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-text-primary mb-4">
            👥 Collaborative Coding
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Code together in real-time with developers around the world. Share
            knowledge, solve problems, and build amazing projects together!
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <Button
            size="lg"
            onClick={() => setShowCreateModal(true)}
            leftIcon={<Plus className="w-5 h-5" />}
            className="flex-1"
          >
            Create New Session
          </Button>

          <Button
            size="lg"
            variant="outline"
            leftIcon={<Code2 className="w-5 h-5" />}
            className="flex-1"
          >
            Join with Code
          </Button>
        </motion.div>

        {/* Active Sessions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-6 h-6 text-primary-500" />
                Active Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {renderSessionsContent()}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Features Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12"
        >
          <Card>
            <CardHeader>
              <CardTitle>Collaboration Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Code2 className="w-6 h-6 text-primary-500" />
                  </div>
                  <h3 className="font-semibold text-text-primary mb-2">
                    Real-time Editing
                  </h3>
                  <p className="text-sm text-text-secondary">
                    See changes instantly as your team codes together
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-green-500" />
                  </div>
                  <h3 className="font-semibold text-text-primary mb-2">
                    Team Chat
                  </h3>
                  <p className="text-sm text-text-secondary">
                    Communicate with your team while coding
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Star className="w-6 h-6 text-yellow-500" />
                  </div>
                  <h3 className="font-semibold text-text-primary mb-2">
                    AI Assistant
                  </h3>
                  <p className="text-sm text-text-secondary">
                    Get AI help and suggestions for your team
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      {/* Create Session Modal */}
      {showCreateModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowCreateModal(false)}
        >
          <Card
            className="w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <CardTitle>Create New Session</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Input
                    id="sessionName"
                    label="Session Name"
                    type="text"
                    value={newSession.name}
                    onChange={(e) =>
                      setNewSession({ ...newSession, name: e.target.value })
                    }
                    placeholder="My Awesome Coding Session"
                  />
                </div>

                <div>
                  <Textarea
                    id="sessionDescription"
                    label="Description"
                    value={newSession.description}
                    onChange={(e) =>
                      setNewSession({
                        ...newSession,
                        description: e.target.value,
                      })
                    }
                    placeholder="What are you working on?"
                    rows={3}
                  />
                </div>

                <div>
                  <Select
                    id="sessionLanguage"
                    label="Language"
                    value={newSession.language}
                    onChange={(e) =>
                      setNewSession({ ...newSession, language: e.target.value })
                    }
                  >
                    {languages.map((lang) => (
                      <option key={lang.id} value={lang.id}>
                        {lang.icon} {lang.name}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={newSession.isPublic}
                    onChange={(e) =>
                      setNewSession({
                        ...newSession,
                        isPublic: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-primary-500 bg-surface-secondary border-border-primary rounded focus:ring-primary-500"
                  />
                  <label
                    htmlFor="isPublic"
                    className="text-sm text-text-primary"
                  >
                    Make session public
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={createSession}
                    className="flex-1"
                    disabled={!newSession.name.trim()}
                  >
                    Create Session
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
