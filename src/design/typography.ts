export const typography = {
  display: {
    size: "clamp(4rem,9vw,9rem)",
    lineHeight: "0.9",
    letterSpacing: "-0.07em",
    weight: 600,
  },

  h1: {
    size: "clamp(3rem,7vw,6rem)",
    lineHeight: "0.92",
    letterSpacing: "-0.06em",
    weight: 600,
  },

  h2: {
    size: "clamp(2.5rem,5vw,4rem)",
    lineHeight: "1",
    letterSpacing: "-0.05em",
    weight: 600,
  },

  h3: {
    size: "2rem",
    lineHeight: "1.1",
    letterSpacing: "-0.04em",
    weight: 600,
  },

  body: {
    size: "1.125rem",
    lineHeight: "1.9",
    letterSpacing: "-0.01em",
    weight: 400,
  },

  small: {
    size: "0.875rem",
    lineHeight: "1.7",
    letterSpacing: "0",
    weight: 500,
  },

  caption: {
    size: "0.75rem",
    lineHeight: "1",
    letterSpacing: "0.35em",
    weight: 600,
  },
} as const;