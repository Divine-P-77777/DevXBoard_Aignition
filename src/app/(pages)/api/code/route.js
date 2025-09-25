import { NextResponse } from "next/server";
import OpenAI from "openai";

const endpoint = "https://models.github.ai/inference";
const githubToken = process.env.GITHUB_TOKEN_FINE; // Make sure to set this in your environment

const openai = new OpenAI({
  baseURL: endpoint,
  apiKey: githubToken,
});

export async function POST(req) {
  try {
    const { code, prompt, mode } = await req.json();

    // Validation
    if (mode === "generate" && !prompt) {
      return NextResponse.json(
        { error: "Prompt is required for code generation" },
        { status: 400 }
      );
    }
    if (mode === "autocorrect" && !code) {
      return NextResponse.json(
        { error: "Code is required for autocorrect" },
        { status: 400 }
      );
    }

    const messages = [
      {
        role: "system",
        content: `You are a coding assistant. 
Return only JSON in this format: 
{"language": "<language>", "code": "<corrected_or_generated_code>"}`,
      },
    ];

    if (mode === "generate") {
      messages.push({
        role: "user",
        content: `Generate code for:\n${prompt}`,
      });
    } else if (mode === "autocorrect") {
      messages.push({
        role: "user",
        content: `Autocorrect and improve this code:\n${code}`,
      });
    }

    // Call GitHub Models API
    const response = await openai.chat.completions.create({
      model: "openai/gpt-4.1", // Use a supported model, e.g., "openai/gpt-4.1"
      messages,
      temperature: 0.2,
    });

    // Parse JSON from the model's response
    const raw = response.choices?.[0]?.message?.content?.trim();
    let parsed = {};
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      // fallback if JSON fails
      parsed = { language: "unknown", code: raw };
    }

    return NextResponse.json({
      success: true,
      mode,
      input: mode === "generate" ? prompt : code,
      generated_code: parsed.code,
      language: parsed.language,
    });
  } catch (err) {
    console.error("Code generation API error:", err);
    return NextResponse.json(
      { success: false, error: "Code generation failed" },
      { status: 500 }
    );
  }
}