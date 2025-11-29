"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

interface User {
  id: number; // Changed from string to number
  name: string;
  email: string;
  avatar?: string;
  level: number;
  xp: number;
  bugsFixed: number;
  gamesWon: number;
  streak: number;
  createdAt: string;
  provider?: "email" | "google" | "github";
  isEmailVerified?: boolean;
  isAdmin?: boolean;
  preferences?: {
    theme: "light" | "dark" | "system";
    language: string;
    notifications: boolean;
  };
  _isOffline?: boolean; // Indicates if user data is from cache (offline mode)
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithGitHub: () => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
  testConnection: () => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Check both cookies and localStorage for token persistence
      let token = Cookies.get("auth_token");
      if (!token) {
        token = localStorage.getItem("auth_token");
        if (token) {
          // Restore token to cookies if found in localStorage
          Cookies.set("auth_token", token, {
            secure: true,
            sameSite: "Strict",
            expires: 30, // Extended to 30 days for better persistence
          });
        }
      }

      if (token) {
        const response = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const userData = await response.json();
          const user = {
            ...userData,
            provider: userData.provider || "email",
            isEmailVerified:
              userData.isEmailVerified !== undefined
                ? userData.isEmailVerified
                : true,
            isAdmin: userData.isAdmin || false,
            preferences: userData.preferences || {
              theme: "system" as const,
              language: "en",
              notifications: true,
            },
          };
          setUser(user);

          // Store user data in localStorage for offline access
          localStorage.setItem("user_data", JSON.stringify(user));
        } else {
          // Token is invalid, clean up
          Cookies.remove("auth_token");
          localStorage.removeItem("auth_token");
          localStorage.removeItem("user_data");
        }
      } else {
        // No token found, check if we have cached user data for offline mode
        const cachedUser = localStorage.getItem("user_data");
        if (cachedUser) {
          try {
            const userData = JSON.parse(cachedUser);
            // Set user but mark as potentially stale
            setUser({ ...userData, _isOffline: true });
          } catch (error) {
            localStorage.removeItem("user_data");
          }
        }
      }
    } catch (error) {
      console.error("Authentication check failed:", error);
      // In case of network error, try to use cached data
      const cachedUser = localStorage.getItem("user_data");
      if (cachedUser) {
        try {
          const userData = JSON.parse(cachedUser);
          setUser({ ...userData, _isOffline: true });
        } catch (parseError) {
          localStorage.removeItem("user_data");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log(
        "Attempting login to:",
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`
      );

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
        }/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      console.log("Login response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Login error response:", errorData);
        throw new Error(errorData.message || "Invalid credentials");
      }

      const data = await response.json();
      console.log("Login successful, received data:", {
        ...data,
        token: "[HIDDEN]",
      });

      // Store token in both cookies and localStorage for better persistence
      Cookies.set("auth_token", data.token, {
        secure: true,
        sameSite: "Strict",
        expires: 30, // Extended to 30 days
      });
      localStorage.setItem("auth_token", data.token);

      const user = {
        ...data.user,
        provider: data.user.provider || "email",
        isEmailVerified:
          data.user.isEmailVerified !== undefined
            ? data.user.isEmailVerified
            : true,
        isAdmin: data.user.isAdmin || false,
        preferences: data.user.preferences || {
          theme: "system" as const,
          language: "en",
          notifications: true,
        },
      };
      setUser(user);

      // Store user data for offline access
      localStorage.setItem("user_data", JSON.stringify(user));
    } catch (error) {
      console.error("Login error:", error);
      throw error instanceof Error ? error : new Error("Login failed");
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      console.log("Attempting signup to: /api/auth/signup");

      const response = await fetch('/api/auth/signup', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      console.log("Signup response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Signup error response:", errorData);
        throw new Error(errorData.message || "Registration failed");
      }

      const data = await response.json();
      console.log("Signup successful, received data:", {
        ...data,
        token: "[HIDDEN]",
      });

      // Store token in both cookies and localStorage for better persistence
      Cookies.set("auth_token", data.token, {
        secure: true,
        sameSite: "Strict",
        expires: 30, // Extended to 30 days
      });
      localStorage.setItem("auth_token", data.token);

      const user = {
        ...data.user,
        provider: data.user.provider || "email",
        isEmailVerified:
          data.user.isEmailVerified !== undefined
            ? data.user.isEmailVerified
            : true,
        isAdmin: data.user.isAdmin || false,
        preferences: data.user.preferences || {
          theme: "system" as const,
          language: "en",
          notifications: true,
        },
      };
      setUser(user);

      // Store user data for offline access
      localStorage.setItem("user_data", JSON.stringify(user));
    } catch (error) {
      console.error("Signup error:", error);
      throw error instanceof Error ? error : new Error("Registration failed");
    }
  };

  const logout = () => {
    // Clear all authentication data
    Cookies.remove("auth_token");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
    setUser(null);
  };

  const loginWithGoogle = async () => {
    try {
      window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`;
    } catch (error) {
      console.error("Google login failed:", error);
      throw new Error("Google login failed");
    }
  };

  const loginWithGitHub = async () => {
    try {
      window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/github`;
    } catch (error) {
      console.error("GitHub login failed:", error);
      throw new Error("GitHub login failed");
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      const token = Cookies.get("auth_token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Profile update failed");
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
    } catch (error) {
      console.error("Profile update failed:", error);
      throw new Error("Profile update failed");
    }
  };

  const refreshUser = async () => {
    await checkAuthStatus();
  };

  const testConnection = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/test`
      );
      const data = await response.json();
      console.log("Backend connection test:", data);
      return data;
    } catch (error) {
      console.error("Backend connection failed:", error);
      throw error;
    }
  };

  const contextValue = React.useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      signup,
      loginWithGoogle,
      loginWithGitHub,
      logout,
      updateProfile,
      refreshUser,
      testConnection,
    }),
    [user, isLoading]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
