import { ProjectBrief, BriefSection, BriefQuestion } from "./brief";

export interface WorkspaceState {
  brief: ProjectBrief;
  currentSection: number;
  currentQuestion: number;
  answers: Record<string, unknown>;
}

export interface WorkspaceNavigation {
  currentSection: BriefSection;
  currentQuestion: BriefQuestion;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
}