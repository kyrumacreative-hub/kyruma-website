export type Answers = Record<string, string>;

export function updateAnswer(
  answers: Answers,
  id: string,
  value: string
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