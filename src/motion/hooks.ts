import { useReducedMotion } from "framer-motion";

export function useMotionPreferences() {
  const prefersReducedMotion = useReducedMotion();

  return {
    prefersReducedMotion,
    animationsEnabled: !prefersReducedMotion,
  };
}