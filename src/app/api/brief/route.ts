import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

async function sendEmail(
  apiKey: string,
  payload: Record<string, unknown>
) {
  const response = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Resend Error");
  }

  return response.json();
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { ok: false },
        { status: 500 }
      );
    }

    const answers = await req.json();

    const rows = Object.entries(answers)
      .map(
        ([key, value]) => `
          <tr>
            <td style="padding:12px;font-weight:600;border-bottom:1px solid #eee;">
              ${key}
            </td>
            <td style="padding:12px;border-bottom:1px solid #eee;">
              ${value}
            </td>
          </tr>
        `
      )
      .join("");

    await sendEmail(apiKey, {
      from: "KYRUMA <hello@kyruma.com>",

      to: ["hello@kyruma.com"],

      subject: "Nuevo Project Brief",

      html: `
      <h1>Nuevo Brief recibido</h1>

      <table
        width="100%"
        cellpadding="0"
        cellspacing="0"
        style="border-collapse:collapse"
      >
        ${rows}
      </table>
      `,
    });

    return NextResponse.json({
      ok: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { ok: false },
      { status: 500 }
    );
  }
}