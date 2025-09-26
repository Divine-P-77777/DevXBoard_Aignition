import { NextResponse } from "next/server";
import { supabaseServer } from "@/libs/supabase/server";

/**
 * POST: Create or update a template.
 * - If body includes template_id, update the template and its blocks.
 * - Otherwise, create a new template and code blocks.
 */
export async function POST(req) {
  try {
    const body = await req.json();
    const { template_id, user_id, title, subtitle, visibility, cover_image, blocks } = body;

    if (!title || !cover_image || !blocks || blocks.length === 0) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }
    if (!user_id) {
      return NextResponse.json(
        { success: false, error: "Missing user_id" },
        { status: 400 }
      );
    }

    const supabase = supabaseServer();

    let template;
    // If template_id exists, update; else, insert
    if (template_id) {
      // 1. Update template
      const { data: updated, error: updateErr } = await supabase
        .from("templates")
        .update({
          title,
          subtitle,
          visibility,
          cover_image,
        })
        .eq("id", template_id)
        .eq("user_id", user_id)
        .select()
        .single();

      if (updateErr || !updated) {
        return NextResponse.json(
          { success: false, error: updateErr?.message || "Template not found" },
          { status: 404 }
        );
      }
      template = updated;

      // 2. Remove previous code blocks, insert new
      await supabase.from("template_code_blocks").delete().eq("template_id", template_id);
      const formattedBlocks = blocks.map((b) => ({
        template_id,
        description: b.description,
        code: b.code,
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
    } else {
      // 1. Insert new template
      const { data: created, error: createErr } = await supabase
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
      if (createErr || !created) {
        return NextResponse.json(
          { success: false, error: createErr?.message },
          { status: 500 }
        );
      }
      template = created;

      // 2. Insert code blocks
      const formattedBlocks = blocks.map((b) => ({
        template_id: template.id,
        description: b.description,
        code: b.code,
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
    }

    // Get all blocks for this template to return in response
    const { data: allBlocks } = await supabase
      .from("template_code_blocks")
      .select()
      .eq("template_id", template.id);

    return NextResponse.json(
      { success: true, data: { ...template, blocks: allBlocks } },
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



export async function GET(req) {
  try {
    // Example: get user_id from query param or session (adjust as needed)
    // For demo, we'll use ?user_id= in URL, but in prod, use session/JWT
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get("user_id");

    if (!user_id) {
      return NextResponse.json(
        { success: false, error: "Missing user_id" },
        { status: 400 }
      );
    }

    const supabase = supabaseServer();

    // Fetch all templates for this user
    const { data: templates, error } = await supabase
      .from("templates")
      .select("*, template_code_blocks(*)")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    // Format each template with blocks as 'blocks'
    const formatted = (templates || []).map((tpl) => ({
      id: tpl.id,
      title: tpl.title,
      subtitle: tpl.subtitle,
      visibility: tpl.visibility,
      cover_image: tpl.cover_image,
      created_at: tpl.created_at,
      updated_at: tpl.updated_at,
      blocks: tpl.template_code_blocks || [],
    }));

    return NextResponse.json({ success: true, templates: formatted }, { status: 200 });
  } catch (err) {
    console.error("API /template GET error:", err);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}