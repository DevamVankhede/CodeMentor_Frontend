'use client';
import { motion } from 'framer-motion';

export default function RoyalCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-2xl border border-white/15 bg-gradient-to-br from-royal-700/30 to-gaming-dark/40 backdrop-blur-xl p-6 overflow-hidden"
    >
      {/* Glow border */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl">
        <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-neon-blue/30 via-royal-500/40 to-gaming-secondary/30 blur-md"/>
      </div>
      {/* Shimmer */}
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent"/>
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}