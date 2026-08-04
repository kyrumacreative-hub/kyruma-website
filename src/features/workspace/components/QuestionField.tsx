"use client";

import { BriefQuestion } from "../types/brief";

interface QuestionFieldProps {
  question: BriefQuestion;
}

export default function QuestionField({
  question,
}: QuestionFieldProps) {
  switch (question.type) {
    case "textarea":
      return (
        <div className="space-y-3">
          <label
            htmlFor={question.id}
            className="block text-sm font-medium text-white"
          >
            {question.label}
          </label>

          <textarea
            id={question.id}
            placeholder={question.placeholder}
            required={question.required}
            rows={6}
            className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-white placeholder:text-neutral-600 outline-none transition focus:border-[var(--primary)]"
          />
        </div>
      );

    default:
      return (
        <div className="space-y-3">
          <label
            htmlFor={question.id}
            className="block text-sm font-medium text-white"
          >
            {question.label}
          </label>

          <input
            id={question.id}
            type={question.type}
            placeholder={question.placeholder}
            required={question.required}
            className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-white placeholder:text-neutral-600 outline-none transition focus:border-[var(--primary)]"
          />
        </div>
      );
  }
}