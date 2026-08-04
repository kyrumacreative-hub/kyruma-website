"use client";

import { useState } from "react";

import { ProjectBrief } from "../types/brief";
import { useWorkspace } from "../hooks/useWorkspace";
import { getFirstInvalidQuestion, getQuestionError } from "../lib/validation";
import { clearWorkspace } from "../utils/storage";

import BriefReview from "./BriefReview";
import QuestionRenderer from "./QuestionRenderer";
import ProgressBar from "./ProgressBar";
import WorkspaceSidebar from "./WorkspaceSidebar";

interface BriefRendererProps {
  brief: ProjectBrief;
}

export default function BriefRenderer({ brief }: BriefRendererProps) {
  const {
    section,
    answers,
    updateAnswer,
    currentSection,
    goToSection,
    nextConversation,
    previousConversation,
  } = useWorkspace(brief);

  const [sending, setSending] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const totalConversations = brief.sections.length;
  const isFirstConversation = currentSection === 0;
  const isLastConversation = currentSection === totalConversations - 1;
  const progress = ((currentSection + 1) / totalConversations) * 100;

  function validateConversation() {
    const nextErrors = section.questions.reduce<Record<string, string>>((errors, question) => {
      const validationError = getQuestionError(question, answers[question.id]);
      if (validationError) errors[question.id] = validationError;
      return errors;
    }, {});

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function continueDiscovery() {
    if (!validateConversation()) return;
    nextConversation();
  }

  function openReview() {
    const invalidQuestion = getFirstInvalidQuestion(brief, answers);
    if (invalidQuestion) {
      goToSection(invalidQuestion.sectionIndex);
      setFieldErrors({ [invalidQuestion.question.id]: invalidQuestion.error });
      setIsReviewing(false);
      return;
    }

    setError(null);
    setFieldErrors({});
    setIsReviewing(true);
  }

  function editConversation(sectionIndex: number) {
    goToSection(sectionIndex);
    setFieldErrors({});
    setIsReviewing(false);
  }

  async function submitDiscovery() {
    setSending(true);
    setError(null);

    try {
      const response = await fetch("/api/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brief: brief.id,
          submittedAt: new Date().toISOString(),
          answers,
        }),
      });

      if (!response.ok) throw new Error();

      clearWorkspace();
      setIsSubmitted(true);
    } catch {
      setError("No se ha podido compartir vuestro Discovery. Por favor, intentadlo de nuevo.");
    } finally {
      setSending(false);
    }
  }

  if (isSubmitted) {
    return (
      <div className="flex flex-col justify-center space-y-8 py-16">
        <span className="flex size-12 items-center justify-center rounded-full bg-[var(--primary)] text-xl text-black">✓</span>
        <div className="space-y-4">
          <h2 className="text-4xl font-light text-neutral-900 dark:text-white">Gracias por compartir vuestra historia.</h2>
          <p className="max-w-xl text-xl font-light leading-8 text-neutral-600 dark:text-neutral-300">Revisaremos vuestro Discovery antes de nuestra reunión para dedicar el tiempo a encontrar soluciones, no a recopilar información.</p>
        </div>
        <span className="pt-4 text-sm font-bold uppercase tracking-[0.3em] text-[var(--primary)]">KYRUMA.</span>
      </div>
    );
  }

  if (isReviewing) {
    return (
      <section className="space-y-8">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">Tu KYRUMA Discovery™</p>
          <h2 className="mt-3 text-3xl font-light text-neutral-900 dark:text-white">Confirmad lo que hemos descubierto juntos.</h2>
          <p className="mt-3 text-neutral-600 dark:text-neutral-400">Podéis editar cualquier conversación antes de compartir vuestro Discovery.</p>
        </div>

        <BriefReview brief={brief} answers={answers} onEdit={editConversation} />

        {error && <div role="alert" className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-400">{error}</div>}

        <div className="flex items-center justify-between gap-4 pt-2">
          <button type="button" onClick={() => setIsReviewing(false)} className="rounded-full border border-neutral-300 px-6 py-3 text-neutral-900 transition-colors hover:bg-neutral-100 dark:border-white/10 dark:text-white dark:hover:bg-white/5">Seguir conversando</button>
          <button type="button" disabled={sending} onClick={submitDiscovery} className="rounded-full bg-[var(--primary)] px-8 py-3 font-medium text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50">
            {sending ? "Compartiendo..." : "Compartir Discovery"}
          </button>
        </div>
      </section>
    );
  }

  return (
    <form onSubmit={(event) => event.preventDefault()} className="grid gap-8 xl:grid-cols-[12rem_1fr]">
      <aside className="hidden border-r border-neutral-200 pr-5 dark:border-neutral-800 xl:block">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">Las conversaciones</p>
        <WorkspaceSidebar brief={brief} currentSection={currentSection} onSectionChange={goToSection} />
      </aside>

      <div className="space-y-10">
        <ProgressBar progress={progress} current={currentSection + 1} total={totalConversations} />

        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">Conversación {currentSection + 1}</p>
          <h2 className="mt-4 text-3xl font-light text-neutral-900 dark:text-white">{section.title}</h2>
          {section.description && <p className="mt-4 max-w-2xl text-neutral-600 dark:text-neutral-400">{section.description}</p>}
        </div>

        <div className="space-y-8">
          {section.questions.map((question) => (
            <fieldset key={question.id} className="space-y-3">
              <legend className="text-lg font-medium leading-7 text-neutral-900 dark:text-white">
                {question.label}{question.required && <span aria-label="obligatorio" className="ml-1 text-[var(--primary)]">*</span>}
              </legend>
              {question.description && <p className="text-sm leading-6 text-neutral-500 dark:text-neutral-400">{question.description}</p>}
              <QuestionRenderer
                question={question}
                value={answers[question.id] ?? ""}
                onChange={(value) => {
                  updateAnswer(question.id, value);
                  if (fieldErrors[question.id]) {
                    setFieldErrors((previousErrors) => {
                      const remainingErrors = { ...previousErrors };
                      delete remainingErrors[question.id];
                      return remainingErrors;
                    });
                  }
                }}
              />
              {fieldErrors[question.id] && <p role="alert" className="text-sm text-red-600 dark:text-red-400">{fieldErrors[question.id]}</p>}
            </fieldset>
          ))}
        </div>

        <div className="flex items-center justify-between gap-4 pt-4">
          <button type="button" onClick={previousConversation} disabled={isFirstConversation} className="rounded-full border border-neutral-300 px-6 py-3 text-neutral-900 transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:text-white dark:hover:bg-white/5">Atrás</button>

          {isLastConversation ? (
            <button type="button" onClick={openReview} className="rounded-full bg-[var(--primary)] px-8 py-3 font-medium text-black transition hover:brightness-110">Revisar Discovery</button>
          ) : (
            <button type="button" onClick={continueDiscovery} className="rounded-full bg-[var(--primary)] px-8 py-3 font-medium text-black transition hover:brightness-110">Continuar</button>
          )}
        </div>
      </div>
    </form>
  );
}
