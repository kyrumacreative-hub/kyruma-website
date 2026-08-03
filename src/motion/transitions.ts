import { MotionConfigValues } from "./config";

export const transitions = {
  instant: {
    duration: MotionConfigValues.duration.instant,
  },

  fast: {
    duration: MotionConfigValues.duration.fast,
    ease: MotionConfigValues.easing.standard,
  },

  base: {
    duration: MotionConfigValues.duration.normal,
    ease: MotionConfigValues.easing.standard,
  },

  slow: {
    duration: MotionConfigValues.duration.slow,
    ease: MotionConfigValues.easing.smooth,
  },

  cinematic: {
    duration: MotionConfigValues.duration.cinematic,
    ease: MotionConfigValues.easing.smooth,
  },
} as const;