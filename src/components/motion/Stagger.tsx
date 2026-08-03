"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

import { staggerContainer } from "@/motion/variants";
import { viewport } from "@/motion/viewport";

interface StaggerProps {
  children: ReactNode;
  className?: string;
}

export default function Stagger({
  children,
  className,
}: StaggerProps) {
  return (
    <motion.div
      className={className}
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
    >
      {children}
    </motion.div>
  );
}