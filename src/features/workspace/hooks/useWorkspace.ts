"use client";

import { useEffect, useState } from "react";

import { ProjectBrief } from "../types/brief";
import { saveWorkspace, loadWorkspace } from "../utils/storage";
import { nextQuestion, previousQuestion } from "../engine/navigation";
import { getCurrentQuestionIndex, getProgress, getTotalQuestions } from "../engine/progress";
import { AnswerValue, updateAnswer as updateAnswerEngine } from "../engine/answers";

interface WorkspaceData {
  currentSection: number;
  currentQuestion: number;
  answers: Record<string, AnswerValue>;
}

function getInitialWorkspaceData(brief: ProjectBrief): WorkspaceData {
  const savedWorkspace = loadWorkspace<Partial<WorkspaceData>>();
  const savedSection = savedWorkspace?.currentSection;
  const savedQuestion = savedWorkspace?.currentQuestion;
  const hasValidPosition = typeof savedSection === "number"
    && typeof savedQuestion === "number"
    && brief.sections[savedSection]?.questions[savedQuestion];

  return {
    answers: savedWorkspace?.answers ?? {},
    currentSection: hasValidPosition ? savedSection : 0,
    currentQuestion: hasValidPosition ? savedQuestion : 0,
  };
}

export function useWorkspace(brief: ProjectBrief) {
  const [workspace, setWorkspace] = useState(() => getInitialWorkspaceData(brief));
  const { currentSection, currentQuestion, answers } = workspace;

  const section = brief.sections[currentSection];
  const question = section.questions[currentQuestion];

  function updateAnswer(id: string, value: AnswerValue) {
    setWorkspace((previousWorkspace) => ({
      ...previousWorkspace,
      answers: updateAnswerEngine(previousWorkspace.answers, id, value),
    }));
  }

  function next() {
    setWorkspace((previousWorkspace) => {
      const nextState = nextQuestion(brief, previousWorkspace.currentSection, previousWorkspace.currentQuestion);
      return { ...previousWorkspace, currentSection: nextState.section, currentQuestion: nextState.question };
    });
  }

  function previous() {
    setWorkspace((previousWorkspace) => {
      const previousState = previousQuestion(brief, previousWorkspace.currentSection, previousWorkspace.currentQuestion);
      return { ...previousWorkspace, currentSection: previousState.section, currentQuestion: previousState.question };
    });
  }

  function goToSection(sectionIndex: number) {
    if (!brief.sections[sectionIndex]) return;
    setWorkspace((previousWorkspace) => ({ ...previousWorkspace, currentSection: sectionIndex, currentQuestion: 0 }));
  }

  function goToQuestion(sectionIndex: number, questionIndex: number) {
    if (!brief.sections[sectionIndex]?.questions[questionIndex]) return;
    setWorkspace((previousWorkspace) => ({ ...previousWorkspace, currentSection: sectionIndex, currentQuestion: questionIndex }));
  }

  function nextConversation() {
    goToSection(currentSection + 1);
  }

  function previousConversation() {
    goToSection(currentSection - 1);
  }

  const totalQuestions = getTotalQuestions(brief);
  const currentQuestionIndex = getCurrentQuestionIndex(brief, currentSection, currentQuestion);
  const progress = getProgress(totalQuestions, currentQuestionIndex);

  useEffect(() => {
    saveWorkspace(workspace);
  }, [workspace]);

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
    currentSection,
    goToSection,
    goToQuestion,
    nextConversation,
    previousConversation,
  };
}
