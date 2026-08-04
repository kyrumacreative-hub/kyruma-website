import { ProjectBrief, BriefSection, BriefQuestion } from "./brief";
import { AnswerValue } from "../engine/answers";

export interface WorkspaceState {
  brief: ProjectBrief;
  currentSection: number;
  currentQuestion: number;
  answers: Record<string, AnswerValue>;
}

export interface WorkspaceNavigation {
  currentSection: BriefSection;
  currentQuestion: BriefQuestion;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
}
