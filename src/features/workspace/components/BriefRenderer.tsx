"use client";

import { ProjectBrief } from "../types/brief";
import BriefSection from "./BriefSection";

interface BriefRendererProps {
  brief: ProjectBrief;
}

export default function BriefRenderer({
  brief,
}: BriefRendererProps) {
  return (
    <div className="space-y-24">
      {brief.sections.map((section) => (
        <BriefSection
          key={section.id}
          section={section}
        />
      ))}
    </div>
  );
}