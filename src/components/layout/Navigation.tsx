"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import {
  Code2,
  Users,
  Settings,
  Menu,
  X,
  LogOut,
  User,
  Zap,
  Gamepad2,
  BarChart3,
  ChevronRight,
} from "lucide-react";

export default function Navigation() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navigationItems = [
    { name: "Home", href: "/", icon: Code2, public: true },
    { name: "AI Editor", href: "/ai-editor", icon: Zap, public: true },
    { name: "Explore", href: "/explore", icon: Zap, public: true },
    { name: "Dashboard", href: "/dashboard", icon: BarChart3, requiresAuth: true },
    { name: "Games", href: "/games", icon: Gamepad2, requiresAuth: true },
    { name: "Collaborate", href: "/collaborate", icon: Users, requiresAuth: true },
    { name: "Editor Builder", href: "/editor-builder", icon: Settings, requiresAuth: true },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-zinc-950 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* 1. Logo Section */}
          <motion.a
            href="/"
            className="flex items-center gap-3 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-9 h-9 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center group-hover:border-indigo-500/50 transition-colors">
              <Code2 className="w-5 h-5 text-indigo-500" />
            </div>
            <span className="text-lg font-bold text-zinc-100 tracking-tight">
              CodeMentor<span className="text-indigo-500">AI</span>
            </span>
          </motion.a>

          {/* 2. Desktop Navigation (Hidden on Mobile) */}
          <div className="hidden md:flex items-center gap-1">
            {navigationItems.map((item) => {
              const isVisible = item.public || (item.requiresAuth && isAuthenticated);
              if (!isVisible) return null;

              return (
                <a
                  key={item.name}
                  href={item.href}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-all flex items-center gap-2"
                >
                  <item.icon className="w-4 h-4 opacity-70" />
                  {item.name}
                </a>
              );
            })}
          </div>

          {/* 3. Right Actions */}
          <div className="flex items-center gap-3">

            {/* User Menu / Auth Buttons */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-3 pl-1 pr-2 py-1 rounded-full hover:bg-zinc-900 transition-colors border border-transparent hover:border-zinc-800"
                >
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-indigo-900/20">
                    {user.name.charAt(0)}
                  </div>
                  <span className="hidden lg:block text-sm font-medium text-zinc-200">
                    {user.name}
                  </span>
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsUserMenuOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                        className="absolute right-0 mt-2 w-72 bg-zinc-900 rounded-xl shadow-2xl border border-zinc-800 z-50 overflow-hidden"
                      >
                        {/* User Header */}
                        <div className="p-4 bg-zinc-950 border-b border-zinc-800">
                          <p className="font-semibold text-zinc-100">{user.name}</p>
                          <p className="text-xs text-zinc-500 mt-0.5">{user.email}</p>

                          <div className="mt-3 flex items-center gap-3">
                            <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-500 w-[65%]" />
                            </div>
                            <span className="text-xs font-mono text-indigo-400">{user.xp} XP</span>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="p-2 space-y-0.5">
                          <MenuItem icon={User} label="Profile" href="/profile" />
                          <MenuItem icon={Settings} label="Settings" href="/settings" />
                          <MenuItem icon={BarChart3} label="Dashboard" href="/dashboard" />
                        </div>

                        <div className="p-2 border-t border-zinc-800">
                          <button
                            onClick={() => { logout(); setIsUserMenuOpen(false); }}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <a href="/signin" className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors">
                  Sign In
                </a>
                <a href="/signup" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg shadow-lg shadow-indigo-900/20 transition-all">
                  Get Started
                </a>
              </div>
            )}

            {/* Mobile Menu Toggle (Hidden on MD+) */}
            <button
              className="md:hidden p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 rounded-lg"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-zinc-800 bg-zinc-950 overflow-hidden"
          >
            <div className="p-4 space-y-2">
              {navigationItems.map((item) => {
                const isVisible = item.public || (item.requiresAuth && isAuthenticated);
                if (!isVisible) return null;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/50 hover:bg-zinc-900 text-zinc-300 hover:text-zinc-100 transition-all border border-transparent hover:border-zinc-800"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5 text-indigo-500" />
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-600" />
                  </a>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// Helper Component for Menu Items
function MenuItem({ icon: Icon, label, href }: { icon: any, label: string, href: string }) {
  return (
    <a href={href} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors">
      <Icon className="w-4 h-4" />
      {label}
    </a>
  );
}