"use client";

import {
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

interface CinematicRevealProps {
  children: ReactNode;
  className?: string;
  threshold?: number;
}

export default function CinematicReveal({
  children,
  className = "",
  threshold = 0.2,
}: CinematicRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;

    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);

          observer.unobserve(element);
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  return (
    <div
      ref={elementRef}
      className={`
        transform-gpu
        transition-all
        duration-1000
        ease-[cubic-bezier(0.16,1,0.3,1)]
        ${
          isVisible
            ? "translate-y-0 opacity-100"
            : "translate-y-8 opacity-30"
        }
        ${className}
      `}
    >
      {children}
    </div>
  );
}