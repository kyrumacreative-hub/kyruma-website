import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  background?: "background" | "surface";
  id?: string;
}

export default function Section({
  children,
  className = "",
  background = "surface",
  id,
}: SectionProps) {
  const backgroundClass =
    background === "background"
      ? "bg-black"
      : "bg-[#09090b]";

  return (
    <section
      id={id}
      className={`
        relative
        overflow-hidden
        py-32
        md:py-48
        lg:py-56
        ${backgroundClass}
        ${className}
      `}
    >
      {children}
    </section>
  );
}