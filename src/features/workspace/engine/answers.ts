export type AnswerValue = string | string[];
export type Answers = Record<string, AnswerValue>;

export function updateAnswer(
  answers: Answers,
  id: string,
  value: AnswerValue
): Answers {
  return {
    ...answers,
    [id]: value,
  };
}

export function getAnswer(
  answers: Answers,
  id: string
) {
  return answers[id] ?? "";
}

export function resetAnswers(): Answers {
  return {};
}
