import { NextResponse } from "next/server";
import { supabaseServer } from "@/libs/supabase/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { template_id, user_id, title, subtitle, visibility, cover_image, blocks, sharedEmails = [] } = body;

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

    // --- Update existing template ---
    if (template_id) {
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

      // Reset and insert blocks
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
    }

    // --- Create new template ---
    else {
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

    // --- 🧩 Handle Private Sharing ---
    await supabase.from("template_shares").delete().eq("template_id", template.id);

    if (visibility === "private" && sharedEmails.length > 0) {
      const shareRecords = sharedEmails.map((email) => ({
        template_id: template.id,
        shared_with_email: email,
      }));

      const { error: shareErr } = await supabase
        .from("template_shares")
        .insert(shareRecords);

      if (shareErr) {
        return NextResponse.json(
          { success: false, error: shareErr.message },
          { status: 500 }
        );
      }
    }

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
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get("user_id");

    if (!user_id) {
      return NextResponse.json(
        { success: false, error: "Missing user_id" },
        { status: 400 }
      );
    }

    const supabase = supabaseServer();

    // Fetch all templates for this user, including blocks
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

    // Fetch all shares for these templates
    const templateIds = (templates || []).map((tpl) => tpl.id);
    let shares = [];
    if (templateIds.length > 0) {
      const { data: shareData, error: shareErr } = await supabase
        .from("template_shares")
        .select("template_id, shared_with_email")
        .in("template_id", templateIds);

      if (shareErr) {
        return NextResponse.json(
          { success: false, error: shareErr.message },
          { status: 500 }
        );
      }
      shares = shareData || [];
    }

    // Group shares by template_id
    const sharesByTemplate = shares.reduce((acc, s) => {
      if (!acc[s.template_id]) acc[s.template_id] = [];
      acc[s.template_id].push(s.shared_with_email);
      return acc;
    }, {});

    // Format templates
    const formatted = (templates || []).map((tpl) => ({
      id: tpl.id,
      title: tpl.title,
      subtitle: tpl.subtitle,
      visibility: tpl.visibility,
      cover_image: tpl.cover_image,
      created_at: tpl.created_at,
      updated_at: tpl.updated_at,
      blocks: tpl.template_code_blocks || [],
      sharedEmails: sharesByTemplate[tpl.id] || [],  // 🔑 now included
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
