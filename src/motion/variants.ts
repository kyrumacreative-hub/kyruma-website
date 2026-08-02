import { motion } from "@/design/motion";
import { transitions } from "./transitions";

export const fade = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: transitions.base,
  },
};

export const fadeUp = {
  hidden: {
    opacity: 0,
    y: motion.distance.md,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.base,
  },
};

export const fadeDown = {
  hidden: {
    opacity: 0,
    y: -motion.distance.md,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.base,
  },
};

export const fadeLeft = {
  hidden: {
    opacity: 0,
    x: motion.distance.md,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.base,
  },
};

export const fadeRight = {
  hidden: {
    opacity: 0,
    x: -motion.distance.md,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.base,
  },
};

export const scale = {
  hidden: {
    opacity: 0,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitions.base,
  },
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: motion.stagger.base,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem = fadeUp;