"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface HoverProps {
  children: ReactNode;
  className?: string;
}

export default function Hover({
  children,
  className,
}: HoverProps) {
  return (
    <motion.div
      className={className}
      whileHover={{
        y: -2,
        scale: 1.01,
      }}
      transition={{
        duration: 0.2,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}