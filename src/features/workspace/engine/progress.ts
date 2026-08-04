import { ProjectBrief } from "../types/brief";

export function getTotalQuestions(brief: ProjectBrief) {
  return brief.sections.reduce(
    (total, section) => total + section.questions.length,
    0
  );
}

export function getCurrentQuestionIndex(
  brief: ProjectBrief,
  currentSection: number,
  currentQuestion: number
) {
  return (
    brief.sections
      .slice(0, currentSection)
      .reduce(
        (total, section) => total + section.questions.length,
        0
      ) + currentQuestion
  );
}

export function getProgress(
  totalQuestions: number,
  currentQuestionIndex: number
) {
  return (
    ((currentQuestionIndex + 1) / totalQuestions) * 100
  );
}