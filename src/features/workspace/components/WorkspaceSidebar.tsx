import { ProjectBrief } from "../types/brief";

interface WorkspaceSidebarProps {
  brief: ProjectBrief;
  currentSection: number;
  onSectionChange: (sectionIndex: number) => void;
}

export default function WorkspaceSidebar({ brief, currentSection, onSectionChange }: WorkspaceSidebarProps) {
  return (
    <nav aria-label="Secciones del briefing" className="space-y-2">
      {brief.sections.map((section, index) => {
        const isCurrent = index === currentSection;
        const isComplete = index < currentSection;
        return (
          <button key={section.id} type="button" onClick={() => onSectionChange(index)} aria-current={isCurrent ? "step" : undefined} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${isCurrent ? "bg-[var(--primary)]/10 text-[var(--primary)]" : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-white/5 dark:hover:text-white"}`}>
            <span className={`flex size-6 shrink-0 items-center justify-center rounded-full border text-xs ${isComplete ? "border-[var(--primary)] bg-[var(--primary)] text-black" : isCurrent ? "border-[var(--primary)]" : "border-neutral-300 dark:border-neutral-700"}`}>{isComplete ? "✓" : String(index + 1).padStart(2, "0")}</span>
            <span className="truncate">{section.title}</span>
          </button>
        );
      })}
    </nav>
  );
}
