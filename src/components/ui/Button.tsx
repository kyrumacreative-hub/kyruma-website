
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
  const base =
    "inline-flex h-14 items-center justify-center rounded-full px-8 text-sm font-semibold transition-all duration-300";

  const variants = {
    primary:
      "bg-[#111111] text-white hover:bg-[#FF5A00] hover:-translate-y-0.5",

    secondary:
      "border border-black/10 bg-white text-[#111111] hover:border-black/20 hover:bg-black/[0.02]",
  };

  return (
    <Link
      href={href}
      className={`${base} ${variants[variant]}`}
    >
      {children}
    </Link>
  );
}