import { AnswerValue } from "../engine/answers";
import { ProjectBrief } from "../types/brief";

interface BriefReviewProps {
  brief: ProjectBrief;
  answers: Record<string, AnswerValue>;
  onEdit: (sectionIndex: number, questionIndex: number) => void;
}

function displayAnswer(value: AnswerValue | undefined, options?: { label: string; value: string }[]) {
  if (!value || (Array.isArray(value) && value.length === 0)) return "Sin responder";

  const values = Array.isArray(value) ? value : [value];
  return values.map((item) => options?.find((option) => option.value === item)?.label ?? item).join(", ");
}

export default function BriefReview({ brief, answers, onEdit }: BriefReviewProps) {
  return (
    <div className="space-y-8">
      {brief.sections.map((section, sectionIndex) => (
        <section key={section.id} className="rounded-2xl border border-neutral-200 p-5 dark:border-neutral-800">
          <h3 className="text-lg font-medium text-neutral-900 dark:text-white">{section.title}</h3>
          <dl className="mt-4 divide-y divide-neutral-200 dark:divide-neutral-800">
            {section.questions.map((question, questionIndex) => (
              <div key={question.id} className="grid gap-2 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
                <div>
                  <dt className="text-sm font-medium text-neutral-700 dark:text-neutral-200">{question.label}</dt>
                  <dd className="mt-1 whitespace-pre-wrap text-sm leading-6 text-neutral-500 dark:text-neutral-400">{displayAnswer(answers[question.id], question.options)}</dd>
                </div>
                <button type="button" onClick={() => onEdit(sectionIndex, questionIndex)} className="w-fit text-sm font-medium text-[var(--primary)] hover:underline">Editar</button>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}
