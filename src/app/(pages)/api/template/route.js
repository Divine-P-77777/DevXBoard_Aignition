import { NextResponse } from "next/server";
import { supabaseServer } from "@/libs/supabase/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { title, subtitle, visibility, cover_image, blocks  , user_id} = body;

    if (!title || !cover_image || !blocks || blocks.length === 0) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }
    if(!user_id){
      return NextResponse.json(
        { success: false, error: "Missing user_id" },
        { status: 400 }
      );
    }

    const supabase = supabaseServer();

    // 1. Insert into templates
    const { data: template, error: templateError } = await supabase
      .from("templates")
      .insert({
        user_id,
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

    // 2. Insert code blocks
    const formattedBlocks = blocks.map((b) => ({
      template_id: template.id,
      description: b.description,
      code: b.code,
      corrected_code: b.corrected_code ?? null,
    }));

    const { error: blocksError } = await supabase
      .from("template_code_blocks")
      .insert(formattedBlocks);

    if (blocksError) {
      return NextResponse.json(
        { success: false, error: blocksError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, data: template },
      { status: 200 }
    );
  } catch (err) {
    console.error("API /template error:", err);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
