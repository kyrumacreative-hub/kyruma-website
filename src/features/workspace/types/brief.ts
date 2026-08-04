export type QuestionType =
  | "text"
  | "textarea"
  | "email"
  | "tel"
  | "url"
  | "select"
  | "radio"
  | "checkbox"
  | "file";

export interface BriefOption {
  label: string;
  value: string;
}

export interface BriefQuestion {
  id: string;
  label: string;
  description?: string;
  type: QuestionType;
  placeholder?: string;
  required?: boolean;
  options?: BriefOption[];
}

export interface BriefSection {
  id: string;
  title: string;
  description?: string;
  questions: BriefQuestion[];
}

export interface ProjectBrief {
  id: string;
  name: string;
  description: string;
  sections: BriefSection[];
}