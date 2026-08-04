"use client";

import { motion } from "framer-motion";

export default function HeroVisual() {
  return (
    <div className="relative mx-auto h-[500px] w-full max-w-6xl overflow-hidden rounded-[40px] border border-white/10 bg-[#090909]">

      {/* Base gradient */}

      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#101010] to-black" />

      {/* Ambient glows */}

      <motion.div
        animate={{
          x: [-40, 40, -40],
          y: [-20, 20, -20],
          opacity: [0.15, 0.28, 0.15],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-1/2 top-1/2 h-[650px] w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF5A00] blur-[220px]"
      />

      <motion.div
        animate={{
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute right-[-120px] top-[-120px] h-[360px] w-[360px] rounded-full bg-white/[0.03] blur-[120px]"
      />

      {/* Technical grid */}

      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
      />

      {/* Connection lines */}

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1200 600"
      >
        <motion.path
          d="M140 420 C320 240 430 220 600 300 C760 380 900 360 1060 180"
          stroke="rgba(255,255,255,.18)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 2.8,
          }}
        />

        {[140, 360, 600, 860, 1060].map((x) => (
          <motion.circle
            key={x}
            cx={x}
            cy={300}
            r="7"
            fill="#FF5A00"
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: x / 1200,
            }}
          />
        ))}
      </svg>

      {/* Floating glass cards */}

      <motion.div
        animate={{
          y: [-10, 10, -10],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-20 top-16 h-44 w-72 rounded-[28px] border border-white/10 bg-white/[0.04] backdrop-blur-xl"
      />

      <motion.div
        animate={{
          y: [10, -10, 10],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-20 right-20 h-52 w-80 rounded-[28px] border border-white/10 bg-white/[0.03] backdrop-blur-xl"
      />

      {/* Central message */}

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <p className="text-[11px] uppercase tracking-[0.45em] text-neutral-500">
            STRATEGY · IDENTITY · EXPERIENCE
          </p>

          <h3 className="mt-6 text-3xl font-light tracking-tight text-white md:text-5xl">
            Connected.
          </h3>
        </div>
      </div>
    </div>
  );
}