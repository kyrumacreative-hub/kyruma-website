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
    "group inline-flex h-14 items-center justify-center rounded-full px-7 text-[15px] font-medium transition-all duration-300";

  const variants = {
    primary:
      "bg-[#111111] text-white hover:bg-[#1A1A1A] hover:-translate-y-[1px]",

    secondary:
      "border border-black/10 bg-white/70 text-[#111111] backdrop-blur-xl hover:border-black/20 hover:bg-white",
  };

  return (
    <Link
      href={href}
      className={`${base} ${variants[variant]}`}
    >
      <span>{children}</span>

      <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
        →
      </span>
    </Link>
  );
}