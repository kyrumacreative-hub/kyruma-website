import Link from "next/link";
import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary";
}

export default function Button({
  children,
  href = "#",
  variant = "primary",
}: ButtonProps) {
  const base = `
    group
    relative
    inline-flex
    h-14
    items-center
    justify-center
    overflow-hidden
    rounded-full
    border
    px-7
    text-sm
    font-medium
    tracking-wide
    transition-all
    duration-700
    ease-[cubic-bezier(0.25,1,0.5,1)]
    md:px-8
  `;

  const variants = {
    primary: `
      border-white/[0.08]
      bg-neutral-950
      text-white
      shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]
      hover:scale-[1.02]
      hover:border-white/20
      hover:bg-neutral-900
    `,

    secondary: `
      border-white/[0.06]
      bg-transparent
      text-neutral-400
      hover:scale-[1.02]
      hover:border-white/[0.14]
      hover:bg-white/[0.03]
      hover:text-white
    `,
  };

  return (
    <Link
      href={href}
      className={`${base} ${variants[variant]}`}
    >
      <span
        className="
          relative
          z-10
          transition-transform
          duration-700
          ease-[cubic-bezier(0.25,1,0.5,1)]
          group-hover:-translate-y-0.5
        "
      >
        {children}
      </span>
    </Link>
  );
}