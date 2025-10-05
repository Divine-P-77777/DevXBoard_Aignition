import { NextResponse } from "next/server";
import OpenAI from "openai";

const endpoint = "https://models.github.ai/inference";
const githubToken = process.env.GITHUB_TOKEN_FINE;

const openai = new OpenAI({
  baseURL: endpoint,
  apiKey: githubToken,
});

export async function POST(req) {
  try {
    const { code } = await req.json();

    // Robust validation
    if (!code || typeof code !== "string" || !code.trim()) {
      return NextResponse.json(
        { error: "Code is required for correction" },
        { status: 400 }
      );
    }

    const messages = [
      {
        role: "system",
        content: `You are a code review and autocorrect assistant.
Please review and autocorrect the following code for syntax errors, best practices, and improvements.
Return only JSON in this format:\n{"language": "<language>", "code": "<corrected_code>"}`,
      },
      {
        role: "user",
        content: code,
      },
    ];

    const response = await openai.chat.completions.create({
      model: "openai/gpt-4.1",
      messages,
      temperature: 0.2,
    });

    const raw = response.choices?.[0]?.message?.content?.trim();
    let parsed = {};
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      parsed = { language: "unknown", code: raw };
    }

    return NextResponse.json({
      success: true,
      input: code,
      corrected_code: parsed.code,
      language: parsed.language,
    });
  } catch (err) {
    console.error("Code correction API error:", err);
    return NextResponse.json(
      { success: false, error: "Code correction failed" },
      { status: 500 }
    );
  }
}