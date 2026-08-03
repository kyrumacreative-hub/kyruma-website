export const MotionConfigValues = {
  duration: {
    instant: 0,
    fast: 0.18,
    normal: 0.35,
    slow: 0.6,
    cinematic: 0.9,
  },

  easing: {
    standard: [0.22, 1, 0.36, 1],
    smooth: [0.16, 1, 0.3, 1],
    accelerate: [0.4, 0, 1, 1],
  },

  distance: {
    xs: 8,
    sm: 16,
    md: 24,
    lg: 40,
    xl: 64,
  },

  stagger: {
    xs: 0.03,
    sm: 0.06,
    md: 0.08,
    lg: 0.12,
  },
} as const;