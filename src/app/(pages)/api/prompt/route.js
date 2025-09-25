import { NextResponse } from "next/server";
import OpenAI from "openai";

const endpoint = "https://models.github.ai/inference";
const githubToken = process.env.GITHUB_TOKEN_FINE; // Set this in your environment

const openai = new OpenAI({
  baseURL: endpoint,
  apiKey: githubToken,
});

export async function POST(req) {
  try {
    const { prompt, content, mode } = await req.json();

    let messages = [];
    let model = "openai/gpt-4.1";
    let temperature = 0.2;

    // Code generation from prompt
    if (mode === "generate") {
      messages = [
        {
          role: "system",
          content:
            content ||
            "You are a coding assistant. Generate code for the following prompt. Return only the code, no explanations.",
        },
        {
          role: "user",
          content: prompt,
        },
      ];
    }
    // Title correction
    else if (mode === "title") {
      messages = [
        {
          role: "system",
          content:
            "You are a professional content editor. Correct grammar, punctuation, and clarity for a blog post title. Return only the improved title as a plain string.",
        },
        {
          role: "user",
          content: prompt,
        },
      ];
    }
    // Subtitle correction
    else if (mode === "subtitle") {
      messages = [
        {
          role: "system",
          content:
            "You are a professional content editor. Correct grammar, punctuation, and clarity for a blog post subtitle. Return only the improved subtitle as a plain string.",
        },
        {
          role: "user",
          content: prompt,
        },
      ];
    }
    // Fallback or custom content
    else {
      messages = [
        {
          role: "system",
          content:
            content ||
            "You are an AI assistant. Respond appropriately to the following prompt.",
        },
        {
          role: "user",
          content: prompt,
        },
      ];
    }

    const response = await openai.chat.completions.create({
      model,
      messages,
      temperature,
    });

    // Parse AI response
    let text = response.choices?.[0]?.message?.content?.trim() || "";

    // For code generation, try to also guess language (optional)
    let language = "";
    if (mode === "generate" && text) {
      // Very simple heuristic: use first "```lang" block if exists
      const match = text.match(/```(\w+)\n/);
      if (match) language = match[1];
    }

    return NextResponse.json({
      success: true,
      text,
      language,
    });
  } catch (err) {
    console.error("API /prompt error:", err);
    return NextResponse.json(
      { success: false, error: "Prompt API failed" },
      { status: 500 }
    );
  }
}