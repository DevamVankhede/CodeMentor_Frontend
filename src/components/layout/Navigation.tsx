"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import Button from "@/components/ui/Button";
import AuthModal from "@/components/auth/AuthModal";
import {
  Code2,
  Users,
  Settings,
  Moon,
  Sun,
  Menu,
  X,
  LogOut,
  User,
  Zap,
  Gamepad2,
  BarChart3,
} from "lucide-react";

export default function Navigation() {
  const { user, isAuthenticated, logout } = useAuth();
  const { actualTheme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  const navigationItems = [
    { name: "Home", href: "/", icon: Code2, public: true },
    { name: "AI Editor", href: "/ai-editor", icon: Zap, public: true },
    { name: "Explore", href: "/explore", icon: Zap, public: true },
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: BarChart3,
      requiresAuth: true,
    },
    { name: "Games", href: "/games", icon: Gamepad2, requiresAuth: true },
    {
      name: "Collaborate",
      href: "/collaborate",
      icon: Users,
      requiresAuth: true,
    },
    {
      name: "Editor Builder",
      href: "/editor-builder",
      icon: Settings,
      requiresAuth: true,
    },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.a
            href="/"
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-md">
              <Code2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              CodeMentor AI
            </span>
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navigationItems.map((item) => {
              const isVisible =
                item.public ||
                (item.requiresAuth && isAuthenticated) ||
                (item.isAdmin && user?.isAdmin);
              if (!isVisible) return null;

              return (
                <motion.a
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
                  whileHover={{ y: -2 }}
                  onClick={(e) => {
                    if (item.requiresAuth && !isAuthenticated) {
                      e.preventDefault();
                      window.location.href = '/signin';
                    }
                  }}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </motion.a>
              );
            })}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {actualTheme === "dark" ? (
                <Sun className="w-5 h-5 text-foreground" />
              ) : (
                <Moon className="w-5 h-5 text-foreground" />
              )}
            </Button>

            {/* User Menu */}
            {isAuthenticated && user ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 pr-2"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden lg:inline text-foreground font-medium">
                    {user.name}
                  </span>
                </Button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-64 bg-card rounded-xl shadow-lg border border-border p-2 z-50 origin-top-right"
                    >
                      <div className="px-3 py-2 border-b border-border mb-2">
                        <p className="font-medium text-foreground">
                          {user.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>Level {user.level}</span>
                          <span>{user.xp} XP</span>
                        </div>
                      </div>

                      <a href="/profile">
                        <Button
                          variant="ghost"
                          size="sm"
                          fullWidth
                          leftIcon={<User className="w-4 h-4" />}
                          className="justify-start mb-1 text-foreground hover:bg-secondary/20"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Profile
                        </Button>
                      </a>

                      <a href="/settings">
                        <Button
                          variant="ghost"
                          size="sm"
                          fullWidth
                          leftIcon={<Settings className="w-4 h-4" />}
                          className="justify-start mb-1 text-foreground hover:bg-secondary/20"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Settings
                        </Button>
                      </a>

                      <hr className="border-border my-2" />

                      <Button
                        variant="ghost"
                        size="sm"
                        fullWidth
                        leftIcon={<LogOut className="w-4 h-4" />}
                        className="justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                      >
                        Sign Out
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <a href="/signin">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-foreground hover:bg-secondary/20"
                  >
                    Sign In
                  </Button>
                </a>
                <a href="/signup">
                  <Button
                    variant="primary"
                    size="sm"
                  >
                    Get Started
                  </Button>
                </a>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="md:hidden border-t border-border overflow-hidden"
            >
              <div className="py-4 px-2 space-y-1">
                {navigationItems.map((item) => {
                  const isVisible =
                    item.public ||
                    (item.requiresAuth && isAuthenticated) ||
                    (item.isAdmin && user?.isAdmin);
                  if (!isVisible) return null;
                  return (
                    <Button
                      key={item.name}
                      variant="ghost"
                      size="lg"
                      fullWidth
                      leftIcon={<item.icon className="w-5 h-5" />}
                      className="justify-start text-foreground hover:bg-secondary/20"
                      onClick={() => {
                        if (item.requiresAuth && !isAuthenticated) {
                          window.location.href = '/signin';
                        } else {
                          setIsMobileMenuOpen(false);
                        }
                      }}
                    >
                      {item.name}
                    </Button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultMode={authMode}
      />
    </nav>
  );
}
