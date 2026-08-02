"use client";

import {
  LazyMotion,
  MotionConfig,
  domAnimation,
  useReducedMotion,
} from "framer-motion";

export function MotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig
        reducedMotion={reducedMotion ? "always" : "never"}
      >
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}