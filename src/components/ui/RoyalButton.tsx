'use client';
import { motion } from 'framer-motion';

export function RoyalButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      className="relative rounded-xl px-6 py-3 font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 border border-white/15 shadow-lg"
    >
      <span className="relative z-10">{children}</span>
      <motion.span
        aria-hidden
        className="absolute inset-0 rounded-xl bg-white/5"
        animate={{ opacity: [0.2, 0.45, 0.2] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.button>
  );
}