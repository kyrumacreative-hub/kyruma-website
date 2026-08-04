"use client";

import { useState } from "react";

import { ProjectBrief } from "../types/brief";
import { useWorkspace } from "../hooks/useWorkspace";

import QuestionRenderer from "./QuestionRenderer";
import ProgressBar from "./ProgressBar";

interface BriefRendererProps {
  brief: ProjectBrief;
}

export default function BriefRenderer({
  brief,
}: BriefRendererProps) {
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
  } = useWorkspace(brief);

  const [sending, setSending] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isLastQuestion =
    currentQuestionIndex === totalQuestions - 1;

  async function submitBrief() {
    setSending(true);
    setError(null);

    try {
      const response = await fetch("/api/brief", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          brief: brief.id,
          submittedAt: new Date().toISOString(),
          answers,
        }),
      });

      if (!response.ok) {
        throw new Error();
      }

      setIsSubmitted(true);
    } catch {
      setError("No se ha podido enviar el briefing. Por favor, inténtalo de nuevo.");
    } finally {
      setSending(false);
    }
  }

  if (isSubmitted) {
    return (
      <div className="flex flex-col justify-center py-24 space-y-12 animate-fade-in">
        <hr className="border-white/10" />
        
        <div className="space-y-6">
          <h2 className="text-4xl font-light text-white">
            Gracias.
          </h2>
          
          <p className="text-xl text-neutral-300 font-light">
            Hemos recibido toda la información del proyecto.
          </p>
        </div>

        <div className="max-w-lg space-y-4 text-neutral-400">
          <p>
            Nuestro equipo revisará el briefing y comenzaremos la fase de estrategia.
          </p>
          <p>
            En las próximas horas recibirás la siguiente comunicación con los primeros pasos del proyecto.
          </p>
        </div>

        <div className="pt-8">
          <span className="text-sm font-bold tracking-[0.3em] text-[var(--primary)] uppercase">
            KYRUMA.
          </span>
        </div>

        <hr className="border-white/10" />
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-10"
    >
      <ProgressBar
        progress={progress}
        current={currentQuestionIndex + 1}
        total={totalQuestions}
      />

      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
          {section.title}
        </p>

        <h2 className="mt-4 text-4xl font-light text-white">
          {question.label}
        </h2>

        {question.description && (
          <p className="mt-4 max-w-2xl text-neutral-400">
            {question.description}
          </p>
        )}
      </div>

      <QuestionRenderer
        question={question}
        value={answers[question.id] ?? ""}
        onChange={(value) => updateAnswer(question.id, value)}
      />

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="flex justify-between pt-10">
        <button
          type="button"
          onClick={previous}
          className="rounded-full border border-white/10 px-6 py-3 text-white hover:bg-white/5 transition-colors"
        >
          Atrás
        </button>

        {!isLastQuestion ? (
          <button
            type="button"
            onClick={next}
            className="rounded-full bg-[var(--primary)] px-8 py-3 font-medium text-black hover:brightness-110 transition-all shadow-[0_0_15px_rgba(var(--primary-rgb),0.4)]"
          >
            Continuar
          </button>
        ) : (
          <button
            type="button"
            disabled={sending}
            onClick={submitBrief}
            className="rounded-full bg-[var(--primary)] px-8 py-3 font-medium text-black hover:brightness-110 transition-all shadow-[0_0_15px_rgba(var(--primary-rgb),0.4)] disabled:opacity-50 disabled:hover:brightness-100 disabled:shadow-none"
          >
            {sending ? "Enviando..." : "Comenzar proyecto"}
          </button>
        )}
      </div>
    </form>
  );
}