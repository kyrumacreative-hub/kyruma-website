export interface BriefQuestion {
  id: string;

  label: string;

  description?: string;

  placeholder?: string;

  type:
    | "text"
    | "email"
    | "tel"
    | "url"
    | "textarea"
    | "select"
    | "radio"
    | "checkbox"
    | "upload";

  required?: boolean;

  options?: {
    label: string;
    value: string;
  }[];

  multiple?: boolean;

  accept?: string[];

  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
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