"use client";

import { useEffect, useState } from "react";

import { ProjectBrief } from "../types/brief";

import { saveWorkspace } from "../utils/storage";

import { nextQuestion, previousQuestion } from "../engine/navigation";
import {
  getCurrentQuestionIndex,
  getProgress,
  getTotalQuestions,
} from "../engine/progress";
import { updateAnswer as updateAnswerEngine } from "../engine/answers";

export function useWorkspace(brief: ProjectBrief) {
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const section = brief.sections[currentSection];
  const question = section.questions[currentQuestion];

  function updateAnswer(id: string, value: string) {
    setAnswers((prev) => updateAnswerEngine(prev, id, value));
  }

  function next() {
    const nextState = nextQuestion(
      brief,
      currentSection,
      currentQuestion
    );

    setCurrentSection(nextState.section);
    setCurrentQuestion(nextState.question);
  }

  function previous() {
    const previousState = previousQuestion(
      brief,
      currentSection,
      currentQuestion
    );

    setCurrentSection(previousState.section);
    setCurrentQuestion(previousState.question);
  }

  const totalQuestions = getTotalQuestions(brief);

  const currentQuestionIndex = getCurrentQuestionIndex(
    brief,
    currentSection,
    currentQuestion
  );

  const progress = getProgress(
    totalQuestions,
    currentQuestionIndex
  );

  useEffect(() => {
    saveWorkspace({
      answers,
      currentSection,
      currentQuestion,
    });
  }, [answers, currentSection, currentQuestion]);

  return {
    section,
    question,
    answers,
    updateAnswer,
    next,
    previous,
    progress,
    totalQuestions,
    currentQuestionIndex,
  };
}