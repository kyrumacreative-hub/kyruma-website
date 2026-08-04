"use client";

import QuestionField from "./QuestionField";
import { BriefSection as BriefSectionType } from "../types/brief";

interface BriefSectionProps {
  section: BriefSectionType;
}

export default function BriefSection({
  section,
}: BriefSectionProps) {
  return (
    <section className="space-y-10">

      <div>
        <h2 className="text-3xl font-light text-white">
          {section.title}
        </h2>

        {section.description && (
          <p className="mt-3 max-w-2xl text-neutral-400">
            {section.description}
          </p>
        )}
      </div>

      <div className="space-y-8">
        {section.questions.map((question) => (
          <QuestionField
            key={question.id}
            question={question}
          />
        ))}
      </div>

    </section>
  );
}