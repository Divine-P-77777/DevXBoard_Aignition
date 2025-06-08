// app/api/gpt/route.js
import { NextResponse } from "next/server";
import OpenAI from "openai";

const endpoint = "https://models.github.ai/inference";
const token = process.env.GITHUB_TOKEN;

export async function POST(req) {
  try {
    const body = await req.json();
    const { prompt, content, model } = body;

    const client = new OpenAI({ baseURL: endpoint, apiKey: token });

    const response = await client.chat.completions.create({
      messages: [
        { role: "system", content },
        { role: "user", content: prompt },
      ],
      temperature: 1,
      top_p: 1,
      model,
    });

    return NextResponse.json({ text: response.choices[0].message.content });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate response." },
      { status: 500 }
    );
  }
}
