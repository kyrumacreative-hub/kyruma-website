import { ProjectBrief } from "../types/brief";

export function nextQuestion(
  brief: ProjectBrief,
  currentSection: number,
  currentQuestion: number
) {
  const section = brief.sections[currentSection];

  if (currentQuestion < section.questions.length - 1) {
    return {
      section: currentSection,
      question: currentQuestion + 1,
    };
  }

  if (currentSection < brief.sections.length - 1) {
    return {
      section: currentSection + 1,
      question: 0,
    };
  }

  return {
    section: currentSection,
    question: currentQuestion,
  };
}

export function previousQuestion(
  brief: ProjectBrief,
  currentSection: number,
  currentQuestion: number
) {
  if (currentQuestion > 0) {
    return {
      section: currentSection,
      question: currentQuestion - 1,
    };
  }

  if (currentSection > 0) {
    const previousSection = currentSection - 1;

    return {
      section: previousSection,
      question:
        brief.sections[previousSection].questions.length - 1,
    };
  }

  return {
    section: currentSection,
    question: currentQuestion,
  };
}