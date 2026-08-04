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
    question,
    answers,
    updateAnswer,
    next,
    previous,
    progress,
    currentQuestionIndex,
    totalQuestions,
    currentSection,
    goToSection,
    goToQuestion,
  } = useWorkspace(brief);

  const [sending, setSending] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);

  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  function continueBrief() {
    const validationError = getQuestionError(question, answers[question.id]);
    if (validationError) {
      setFieldError(validationError);
      return;
    }

    setFieldError(null);
    next();
  }

  function openReview() {
    const invalidQuestion = getFirstInvalidQuestion(brief, answers);
    if (invalidQuestion) {
      goToQuestion(invalidQuestion.sectionIndex, invalidQuestion.questionIndex);
      setFieldError(invalidQuestion.error);
      setIsReviewing(false);
      return;
    }

    setError(null);
    setFieldError(null);
    setIsReviewing(true);
  }

  function editQuestion(sectionIndex: number, questionIndex: number) {
    goToQuestion(sectionIndex, questionIndex);
    setFieldError(null);
    setIsReviewing(false);
  }

  async function submitBrief() {
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
      setError("No se ha podido enviar el briefing. Por favor, inténtalo de nuevo.");
    } finally {
      setSending(false);
    }
  }

  if (isSubmitted) {
    return (
      <div className="flex flex-col justify-center space-y-8 py-16">
        <span className="flex size-12 items-center justify-center rounded-full bg-[var(--primary)] text-xl text-black">✓</span>
        <div className="space-y-4">
          <h2 className="text-4xl font-light text-neutral-900 dark:text-white">Gracias.</h2>
          <p className="text-xl font-light text-neutral-600 dark:text-neutral-300">Hemos recibido toda la información del proyecto.</p>
        </div>
        <p className="max-w-lg leading-7 text-neutral-500 dark:text-neutral-400">Nuestro equipo revisará el briefing y te escribirá con los siguientes pasos del proyecto.</p>
        <span className="pt-4 text-sm font-bold uppercase tracking-[0.3em] text-[var(--primary)]">KYRUMA.</span>
      </div>
    );
  }

  if (isReviewing) {
    return (
      <section className="space-y-8">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">Revisión final</p>
          <h2 className="mt-3 text-3xl font-light text-neutral-900 dark:text-white">Confirma los detalles de tu proyecto.</h2>
          <p className="mt-3 text-neutral-600 dark:text-neutral-400">Puedes editar cualquier respuesta antes de enviar el briefing.</p>
        </div>

        <BriefReview brief={brief} answers={answers} onEdit={editQuestion} />

        {error && <div role="alert" className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-400">{error}</div>}

        <div className="flex items-center justify-between gap-4 pt-2">
          <button type="button" onClick={() => setIsReviewing(false)} className="rounded-full border border-neutral-300 px-6 py-3 text-neutral-900 transition-colors hover:bg-neutral-100 dark:border-white/10 dark:text-white dark:hover:bg-white/5">Seguir editando</button>
          <button type="button" disabled={sending} onClick={submitBrief} className="rounded-full bg-[var(--primary)] px-8 py-3 font-medium text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50">
            {sending ? "Enviando..." : "Enviar briefing"}
          </button>
        </div>
      </section>
    );
  }

  return (
    <form onSubmit={(event) => event.preventDefault()} className="grid gap-8 xl:grid-cols-[12rem_1fr]">
      <aside className="hidden border-r border-neutral-200 pr-5 dark:border-neutral-800 xl:block">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">Tu briefing</p>
        <WorkspaceSidebar brief={brief} currentSection={currentSection} onSectionChange={goToSection} />
      </aside>

      <div className="space-y-10">
        <ProgressBar progress={progress} current={currentQuestionIndex + 1} total={totalQuestions} />

        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">{section.title}</p>
          <h2 className="mt-4 text-3xl font-light text-neutral-900 dark:text-white">{question.label}</h2>
          {question.description && <p className="mt-4 max-w-2xl text-neutral-600 dark:text-neutral-400">{question.description}</p>}
        </div>

        <QuestionRenderer
          question={question}
          value={answers[question.id] ?? ""}
          onChange={(value) => {
            updateAnswer(question.id, value);
            if (fieldError) setFieldError(null);
          }}
        />

        {fieldError && <div role="alert" className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-400">{fieldError}</div>}

        <div className="flex items-center justify-between gap-4 pt-4">
          <button type="button" onClick={previous} disabled={currentQuestionIndex === 0} className="rounded-full border border-neutral-300 px-6 py-3 text-neutral-900 transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:text-white dark:hover:bg-white/5">Atrás</button>

          {isLastQuestion ? (
            <button type="button" onClick={openReview} className="rounded-full bg-[var(--primary)] px-8 py-3 font-medium text-black transition hover:brightness-110">Revisar briefing</button>
          ) : (
            <button type="button" onClick={continueBrief} className="rounded-full bg-[var(--primary)] px-8 py-3 font-medium text-black transition hover:brightness-110">Continuar</button>
          )}
        </div>
      </div>
    </form>
  );
}
