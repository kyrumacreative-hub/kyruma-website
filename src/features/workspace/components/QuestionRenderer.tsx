"use client";

import { BriefQuestion } from "../types/brief";
import { AnswerValue } from "../engine/answers";

import TextField from "./fields/TextField";
import RadioField from "./fields/RadioField";
import TextareaField from "./fields/TextareaField";
import SelectField from "./fields/SelectField";
import CheckboxField from "./fields/CheckboxField";
import NumberField from "./fields/NumberField";
import DateField from "./fields/DateField";
import FileField from "./fields/FileField";

interface Props {
  question: BriefQuestion;
  value: AnswerValue;
  onChange: (value: AnswerValue) => void;
  invalid?: boolean;
  errorId?: string;
}

export default function QuestionRenderer({
  question,
  value,
  onChange,
  invalid = false,
  errorId,
}: Props) {
  const textValue = typeof value === "string" ? value : "";
  const listValue = Array.isArray(value) ? value : [];

  switch (question.type) {
    case "text":
    case "email":
    case "tel":
    case "url":
      return (
        <TextField
          type={question.type}
          value={textValue}
          placeholder={question.placeholder}
          onChange={onChange}
          invalid={invalid}
          errorId={errorId}
        />
      );

    case "textarea":
      return (
        <TextareaField
          value={textValue}
          placeholder={question.placeholder}
          onChange={onChange}
          invalid={invalid}
          errorId={errorId}
        />
      );

    case "radio":
      return (
        <RadioField
          value={textValue}
          onChange={onChange}
          options={question.options ?? []}
          name={question.id}
          invalid={invalid}
          errorId={errorId}
        />
      );

    case "select":
      return <SelectField value={textValue} placeholder={question.placeholder} options={question.options ?? []} onChange={onChange} invalid={invalid} errorId={errorId} />;

    case "checkbox":
      return <CheckboxField value={listValue} options={question.options ?? []} onChange={onChange} name={question.id} invalid={invalid} errorId={errorId} />;

    case "number":
      return <NumberField value={textValue} placeholder={question.placeholder} min={question.validation?.min} max={question.validation?.max} onChange={onChange} invalid={invalid} errorId={errorId} />;

    case "date":
      return <DateField value={textValue} onChange={onChange} invalid={invalid} errorId={errorId} />;

    case "file":
    case "upload":
      return <FileField value={listValue} accept={question.accept} multiple={question.multiple} onChange={onChange} invalid={invalid} errorId={errorId} />;

    default:
      return (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
          Tipo no soportado: <strong>{question.type}</strong>
        </div>
      );
  }
}
