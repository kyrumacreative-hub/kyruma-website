import { motion } from "@/design/motion";

export const transitions = {
  fast: {
    duration: motion.duration.fast,
    ease: motion.easing.standard,
  },

  base: {
    duration: motion.duration.base,
    ease: motion.easing.standard,
  },

  slow: {
    duration: motion.duration.slow,
    ease: motion.easing.smooth,
  },

  page: {
    duration: motion.duration.xl,
    ease: motion.easing.smooth,
  },
} as const;