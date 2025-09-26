import { NextResponse } from "next/server";
import { supabaseServer } from "@/libs/supabase/server";

// POST → Save template
export async function POST(req) {
  try {
    const { template_id, user_id } = await req.json();
    const supabase = supabaseServer();

    if (!template_id || !user_id) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Check if already saved
    const { data: existing } = await supabase
      .from("template_saves")
      .select("id")
      .eq("template_id", template_id)
      .eq("user_id", user_id)
      .maybeSingle();

    if (existing) {
      // Unsave if already exists
      await supabase.from("template_saves").delete().eq("id", existing.id);
      return NextResponse.json({ message: "Unsaved" });
    }

    // Save new
    const { error } = await supabase
      .from("template_saves")
      .insert({ template_id, user_id });

    if (error) throw error;

    return NextResponse.json({ message: "Saved" });
  } catch (err) {
    console.error("Save template error:", err);
    return NextResponse.json({ error: "Failed to save template" }, { status: 500 });
  }
}

// GET → Get saved templates for a user
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get("user_id");
    const supabase = supabaseServer();

    if (!user_id) {
      return NextResponse.json({ error: "user_id is required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("template_saves")
      .select("id, template_id, created_at, templates(*)") // join with templates
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ saved_templates: data });
  } catch (err) {
    console.error("Get saves error:", err);
    return NextResponse.json({ error: "Failed to fetch saved templates" }, { status: 500 });
  }
}
