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
  if (variant === "secondary") {
    return (
      <Link
        href={href}
        className="
          group
          inline-flex
          h-14
          items-center
          justify-center
          gap-5
          rounded-full
          border
          border-black/10
          bg-transparent
          px-7
          text-[14px]
          font-semibold
          text-[var(--foreground)]
          hover:border-black/20
          hover:bg-white
        "
      >
        <span>{children}</span>

        <span
          aria-hidden="true"
          className="
            flex
            h-7
            w-7
            items-center
            justify-center
            rounded-full
            bg-black/[0.05]
            text-sm
            text-[var(--foreground)]
            transition-transform
            duration-300
            group-hover:translate-x-1
          "
        >
          →
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="
        group
        inline-flex
        h-14
        items-center
        justify-center
        gap-5
        rounded-full
        bg-[var(--foreground)]
        px-7
        text-[14px]
        font-semibold
        text-white
        hover:bg-[var(--primary)]
      "
    >
      <span>{children}</span>

      <span
        aria-hidden="true"
        className="
          text-base
          text-white
          transition-transform
          duration-300
          group-hover:translate-x-1
        "
      >
        →
      </span>
    </Link>
  );
}