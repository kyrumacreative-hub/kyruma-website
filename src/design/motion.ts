export const motion = {
  duration: {
    fast: 0.2,
    base: 0.35,
    slow: 0.6,
    xl: 0.9,
  },

  easing: {
    standard: [0.22, 1, 0.36, 1] as const,
    smooth: [0.16, 1, 0.3, 1] as const,
    exit: [0.4, 0, 1, 1] as const,
  },

  distance: {
    xs: 8,
    sm: 16,
    md: 24,
    lg: 40,
    xl: 64,
  },

  stagger: {
    fast: 0.04,
    base: 0.08,
    slow: 0.12,
  },
} as const;

export type MotionTokens = typeof motion;