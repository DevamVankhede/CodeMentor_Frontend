export const motionTokens = {
  durations: { xs: 0.15, sm: 0.25, md: 0.4, lg: 0.8 },
  easings: {
    entrance: [0.22, 1, 0.36, 1],
    exit: [0.4, 0, 1, 1],
    elastic: [0.2, 0.8, 0.2, 1],
  },
  spring: { type: 'spring', stiffness: 220, damping: 24 },
};

export const floatUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: motionTokens.easings.entrance } },
};

export const royalGlow = {
  initial: { boxShadow: '0 0 0px rgba(139,92,246,0.0)' },
  animate: { boxShadow: '0 0 40px rgba(139,92,246,0.45)' },
};