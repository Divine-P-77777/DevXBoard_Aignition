import { NextResponse } from "next/server";
import { supabaseServer } from "@/libs/supabase/server";

// POST → Toggle save/unsave
export async function POST(req) {
  try {
    const supabase = supabaseServer();
    const { template_id, user_id } = await req.json();

    // ✅ Validate required fields
    if (!template_id || !user_id) {
      return NextResponse.json({ error: "template_id and user_id are required" }, { status: 400 });
    }

    // ✅ Check if already saved
    const { data: existing, error: selectError } = await supabase
      .from("template_saves")
      .select("id")
      .eq("template_id", template_id)
      .eq("user_id", user_id)
      .maybeSingle();

    if (selectError) throw selectError;

    if (existing) {
      // ✅ Unsave if already saved
      const { error: deleteError } = await supabase
        .from("template_saves")
        .delete()
        .eq("id", existing.id);

      if (deleteError) throw deleteError;

      return NextResponse.json({ message: "Unsaved", saved: false });
    }

    // ✅ Otherwise, insert new save
    const { error: insertError } = await supabase
      .from("template_saves")
      .insert({ template_id, user_id });

    if (insertError) throw insertError;

    return NextResponse.json({ message: "Saved", saved: true });
  } catch (err) {
    console.error("Save template error:", err);
    return NextResponse.json({ error: "Failed to toggle save" }, { status: 500 });
  }
}

// GET → Fetch all saved templates for a user
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get("user_id");
    const supabase = supabaseServer();

    if (!user_id) {
      return NextResponse.json({ error: "user_id is required" }, { status: 400 });
    }

    // ✅ Get saved templates joined with template data
    const { data, error } = await supabase
      .from("template_saves")
      .select("id, template_id, created_at, templates(*)")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ saved_templates: data });
  } catch (err) {
    console.error("Get saves error:", err);
    return NextResponse.json({ error: "Failed to fetch saved templates" }, { status: 500 });
  }
}
