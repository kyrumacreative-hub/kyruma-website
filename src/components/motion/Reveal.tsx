"use client";

import { motion, type Variants } from "framer-motion";
import { ReactNode } from "react";

import { viewport } from "@/motion/viewport";
import {
  fade,
  fadeUp,
  fadeDown,
  fadeLeft,
  fadeRight,
  scale,
} from "@/motion/variants";

type RevealVariant =
  | "fade"
  | "up"
  | "down"
  | "left"
  | "right"
  | "scale";

interface RevealProps {
  children: ReactNode;
  className?: string;
  variant?: RevealVariant;
  delay?: number;
}

const variantsMap: Record<RevealVariant, Variants> = {
  fade,
  up: fadeUp,
  down: fadeDown,
  left: fadeLeft,
  right: fadeRight,
  scale,
};

export default function Reveal({
  children,
  className,
  variant = "up",
  delay = 0,
}: RevealProps) {
  return (
    <motion.div
      className={className}
      variants={variantsMap[variant]}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      transition={{
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}