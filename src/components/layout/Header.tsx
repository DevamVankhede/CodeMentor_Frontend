'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { RoyalButton } from '../ui/RoyalButton';
import LoginModal from '../auth/LoginModal';
import SignupModal from '../auth/SignupModal';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <>
      <header className="relative z-20 border-b border-white/10 bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3"
            >
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-2xl"
              >
                👑
              </motion.span>
              <div>
                <h1 className="text-xl font-gaming font-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
                  CodeMentor AI
                </h1>
                <p className="text-xs text-white/60">Royal Coding Arena</p>
              </div>
            </motion.div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <a href="#dashboard" className="text-white/70 hover:text-neon-blue transition-colors">
                Dashboard
              </a>
              <a href="#editor" className="text-white/70 hover:text-neon-blue transition-colors">
                Code Editor
              </a>
              <a href="#collaborate" className="text-white/70 hover:text-neon-blue transition-colors">
                Collaborate
              </a>
              <a href="#leaderboard" className="text-white/70 hover:text-neon-blue transition-colors">
                Leaderboard
              </a>
            </nav>

            {/* Auth Section */}
            <div className="flex items-center gap-3">
              {isAuthenticated && user ? (
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-3 p-2 rounded-xl bg-slate-800 border border-white/20 hover:border-blue-500 transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple flex items-center justify-center text-white font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-left hidden sm:block">
                      <p className="text-white text-sm font-semibold">{user.name}</p>
                      <p className="text-neon-blue text-xs">Level {user.level}</p>
                    </div>
                    <motion.span
                      animate={{ rotate: showUserMenu ? 180 : 0 }}
                      className="text-white/70"
                    >
                      ▼
                    </motion.span>
                  </motion.button>

                  {/* User Menu */}
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-slate-800 border border-white/20 rounded-xl p-2 shadow-2xl"
                    >
                      <div className="p-3 border-b border-white/10">
                        <p className="text-white font-semibold">{user.name}</p>
                        <p className="text-white/60 text-sm">{user.email}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-neon-blue text-sm">⭐ Level {user.level}</span>
                          <span className="text-gaming-accent text-sm">💎 {user.xp} XP</span>
                        </div>
                      </div>
                      <button className="w-full text-left p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                        👤 Profile
                      </button>
                      <button className="w-full text-left p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                        ⚙️ Settings
                      </button>
                      <button className="w-full text-left p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                        🏆 Achievements
                      </button>
                      <hr className="border-white/10 my-2" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
                      >
                        🚪 Logout
                      </button>
                    </motion.div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowLogin(true)}
                    className="text-white/80 hover:text-neon-blue transition-colors font-semibold"
                  >
                    Login
                  </button>
                  <RoyalButton onClick={() => setShowSignup(true)}>
                    🏰 Join Kingdom
                  </RoyalButton>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Modals */}
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        switchToSignup={() => {
          setShowLogin(false);
          setShowSignup(true);
        }}
      />
      <SignupModal
        isOpen={showSignup}
        onClose={() => setShowSignup(false)}
        switchToLogin={() => {
          setShowSignup(false);
          setShowLogin(true);
        }}
      />
    </>
  );
}