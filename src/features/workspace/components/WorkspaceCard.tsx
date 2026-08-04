import { ReactNode } from "react";

interface WorkspaceCardProps {
  children: ReactNode;
}

export default function WorkspaceCard({
  children,
}: WorkspaceCardProps) {
  return (
    <section
      className="
        mt-12
        rounded-3xl
        border
        border-neutral-200
        bg-white
        p-10
        shadow-sm
        transition-all
        dark:border-neutral-800
        dark:bg-neutral-900
      "
    >
      {children}
    </section>
  );
}