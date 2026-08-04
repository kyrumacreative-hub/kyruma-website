import { AnswerValue } from "../engine/answers";
import { BriefQuestion, ProjectBrief } from "../types/brief";

function isEmpty(value: AnswerValue | undefined) {
  return Array.isArray(value) ? value.length === 0 : !value?.trim();
}

export function getQuestionError(question: BriefQuestion, value: AnswerValue | undefined) {
  if (question.required && isEmpty(value)) {
    return "Este campo es obligatorio para continuar.";
  }

  if (question.type === "email" && !isEmpty(value) && typeof value === "string") {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) return "Introduce una dirección de correo válida.";
  }

  if (question.type === "number" && typeof value === "string" && value) {
    const number = Number(value);
    if (Number.isNaN(number)) return "Introduce un número válido.";
    if (question.validation?.min !== undefined && number < question.validation.min) {
      return `El valor mínimo es ${question.validation.min}.`;
    }
    if (question.validation?.max !== undefined && number > question.validation.max) {
      return `El valor máximo es ${question.validation.max}.`;
    }
  }

  return null;
}

export function getFirstInvalidQuestion(brief: ProjectBrief, answers: Record<string, AnswerValue>) {
  for (let sectionIndex = 0; sectionIndex < brief.sections.length; sectionIndex += 1) {
    const section = brief.sections[sectionIndex];
    for (let questionIndex = 0; questionIndex < section.questions.length; questionIndex += 1) {
      const question = section.questions[questionIndex];
      const error = getQuestionError(question, answers[question.id]);
      if (error) return { sectionIndex, questionIndex, question, error };
    }
  }

  return null;
}
