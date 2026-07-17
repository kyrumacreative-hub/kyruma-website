import { ReactNode } from "react";
import clsx from "clsx";

interface SectionProps {
  children: ReactNode;
  className?: string;
  background?: "background" | "surface";
  id?: string;
}

export default function Section({
  children,
  className,
  background = "surface",
  id,
}: SectionProps) {
  return (
    <section
      id={id}
      className={clsx(
        "py-32 md:py-44",
        background === "background"
          ? "bg-[#F7F7F5]"
          : "bg-white",
        className
      )}
    >
      {children}
    </section>
  );
}