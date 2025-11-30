'use client';
import { motion } from 'framer-motion';

interface IconProps {
  name: string;
  size?: number;
  className?: string;
}

export default function Icon({ name, size = 24, className = '' }: IconProps) {
  return (
    <motion.span
      initial={{ rotate: 0 }}
      whileHover={{ rotate: 8, scale: 1.08 }}
      transition={{ type: 'spring', stiffness: 300, damping: 18 }}
      style={{ fontSize: size }}
      className={`inline-flex items-center justify-center text-transparent bg-clip-text bg-gradient-to-br from-neon-blue to-royal-500 drop-shadow ${className}`}
    >
      {/* Example emoji fallback; replace with <YourSvg/> */}
      👑
    </motion.span>
  );
}