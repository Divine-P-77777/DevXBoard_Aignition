import { NextResponse } from "next/server";
import OpenAI from "openai";
import { supabaseServer } from "@/libs/supabase/server";

export async function POST(req) {
  try {
    const body = await req.json();
    let { title, subtitle, visibility, cover_image, blocks, user_id } = body;

    if (!title || !cover_image || !blocks || blocks.length === 0) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 🔹 Init Supabase
    const supabase = supabaseServer();

    // 🔹 Init OpenAI client (GitHub-hosted)
    const client = new OpenAI({
      apiKey: process.env.GITHUB_TOKEN_FINE,
      baseURL: "https://models.github.ai/inference",
    });

    // 🔹 AI correction for title & subtitle
    try {
      const aiTextResponse = await client.chat.completions.create({
        model: "openai/gpt-4.1", // Supported GitHub-hosted model
        messages: [
          {
            role: "system",
            content: "You are a professional content editor. Correct grammar, punctuation, and clarity. Return only JSON: {\"title\":\"<corrected_title>\",\"subtitle\":\"<corrected_subtitle>\"}",
          },
          {
            role: "user",
            content: JSON.stringify({ title, subtitle }),
          },
        ],
        temperature: 0.2,
      });

      const raw = aiTextResponse.choices?.[0]?.message?.content?.trim();
      const parsed = JSON.parse(raw || "{}");

      title = parsed.title || title;
      subtitle = parsed.subtitle || subtitle;
    } catch (aiTextErr) {
      console.error("AI title/subtitle correction error:", aiTextErr);
    }

    // 🔹 Insert template record
    const { data: template, error: templateError } = await supabase
      .from("templates")
      .insert({
        user_id: user_id ?? null,
        title,
        subtitle,
        visibility,
        cover_image,
      })
      .select()
      .single();

    if (templateError || !template) {
      return NextResponse.json(
        { success: false, error: templateError?.message },
        { status: 500 }
      );
    }

    // 🔹 Prepare code blocks
    const formattedBlocks = [];
    for (const b of blocks) {
      let correctedCode = b.corrected_code ?? null;

      if (!correctedCode && b.code) {
        try {
          const aiCodeResponse = await client.chat.completions.create({
            model: "openai/gpt-4.1",
            messages: [
              {
                role: "system",
                content:
                  "You are a coding assistant. Correct and improve the following code. Return only code without explanations.",
              },
              { role: "user", content: b.code },
            ],
          });

          correctedCode =
            aiCodeResponse.choices?.[0]?.message?.content?.trim() || null;
        } catch (aiCodeErr) {
          console.error("AI code correction error:", aiCodeErr);
        }
      }

      formattedBlocks.push({
        template_id: template.id,
        description: b.description,
        code: b.code,
        corrected_code: correctedCode,
      });
    }

    // 🔹 Insert code blocks
    const { error: blocksError } = await supabase
      .from("template_code_blocks")
      .insert(formattedBlocks);

    if (blocksError) {
      return NextResponse.json(
        { success: false, error: blocksError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { template, blocks: formattedBlocks },
    });
  } catch (err) {
    console.error("API /content error:", err);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
