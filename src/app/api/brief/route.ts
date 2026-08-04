import { NextRequest, NextResponse } from "next/server";

import { websiteBrief } from "@/features/workspace/data/website-brief";
import { AnswerValue } from "@/features/workspace/engine/answers";

export const runtime = "nodejs";

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const MAX_ANSWER_LENGTH = 10_000;

type Answers = Record<string, AnswerValue>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isAnswerValue(value: unknown): value is AnswerValue {
  return typeof value === "string" || (Array.isArray(value) && value.every((item) => typeof item === "string"));
}

function hasValue(value: AnswerValue | undefined) {
  return Array.isArray(value) ? value.length > 0 : Boolean(value?.trim());
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#039;",
    '"': "&quot;",
  })[character] ?? character);
}

async function sendEmail(apiKey: string, payload: Record<string, unknown>) {
  const response = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error("Resend request failed");

  return response.json();
}

function parseAnswers(payload: unknown): Answers | null {
  if (!isRecord(payload) || payload.brief !== websiteBrief.id || !isRecord(payload.answers)) return null;

  const questions = new Map(websiteBrief.sections.flatMap((section) => section.questions.map((question) => [question.id, question])));
  const answers: Answers = {};

  for (const [questionId, value] of Object.entries(payload.answers)) {
    const question = questions.get(questionId);
    if (!question || !isAnswerValue(value)) return null;

    const values = Array.isArray(value) ? value : [value];
    if (values.some((item) => item.length > MAX_ANSWER_LENGTH)) return null;

    if (question.options && values.some((item) => !question.options?.some((option) => option.value === item))) {
      return null;
    }

    answers[questionId] = Array.isArray(value) ? value.map((item) => item.trim()) : value.trim();
  }

  for (const question of questions.values()) {
    if (question.required && !hasValue(answers[question.id])) return null;
  }

  const email = answers.email;
  if (typeof email === "string" && email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;

  return answers;
}

function formatAnswer(value: AnswerValue, options?: { label: string; value: string }[]) {
  const values = Array.isArray(value) ? value : [value];
  return values.map((item) => escapeHtml(options?.find((option) => option.value === item)?.label ?? item)).join(", ");
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) return NextResponse.json({ ok: false }, { status: 500 });

    const answers = parseAnswers(await req.json());
    if (!answers) return NextResponse.json({ ok: false, error: "Invalid brief" }, { status: 400 });

    const rows = websiteBrief.sections.flatMap((section) => section.questions
      .filter((question) => hasValue(answers[question.id]))
      .map((question) => `
        <tr>
          <td style="padding:12px;font-weight:600;border-bottom:1px solid #eee;vertical-align:top;">${escapeHtml(question.label)}</td>
          <td style="padding:12px;border-bottom:1px solid #eee;white-space:pre-wrap;">${formatAnswer(answers[question.id], question.options)}</td>
        </tr>`),
    ).join("");

    const companyName = typeof answers.company_name === "string" && answers.company_name
      ? answers.company_name.replace(/[\r\n]/g, " ")
      : "Nuevo";

    await sendEmail(apiKey, {
      from: "KYRUMA <hello@kyruma.com>",
      to: ["hello@kyruma.com"],
      reply_to: typeof answers.email === "string" ? answers.email : undefined,
      subject: `Nuevo KYRUMA Discovery — ${companyName}`,
      html: `<h1>Nuevo KYRUMA Discovery recibido</h1><table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">${rows}</table>`,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Unable to process project brief", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
