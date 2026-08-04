"use client";

import { BriefQuestion } from "../types/brief";

import TextField from "./fields/TextField";

interface Props {
  question: BriefQuestion;
  value: string;
  onChange: (value: string) => void;
}

export default function QuestionRenderer({
  question,
  value,
  onChange,
}: Props) {
  switch (question.type) {
    case "text":
    case "email":
    case "tel":
    case "url":
      return (
        <TextField
          type={question.type}
          value={value}
          placeholder={question.placeholder}
          onChange={onChange}
        />
      );

    case "textarea":
      return (
        <textarea
          value={value}
          placeholder={question.placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="
            w-full
            min-h-[180px]
            rounded-2xl
            border
            border-neutral-300
            bg-white
            p-6
            outline-none
            transition
            focus:border-[var(--primary)]
            dark:border-neutral-700
            dark:bg-neutral-950
            dark:text-white
          "
        />
      );

    default:
      return (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
          Tipo no soportado: <strong>{question.type}</strong>
        </div>
      );
  }
}