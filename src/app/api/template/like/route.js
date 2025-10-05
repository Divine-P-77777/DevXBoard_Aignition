import { NextResponse } from "next/server";
import { supabaseServer } from "@/libs/supabase/server";

// POST → Toggle like/unlike
export async function POST(req) {
  try {
    const supabase = supabaseServer();
    const { template_id, user_id } = await req.json();

    if (!template_id || !user_id)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    // ✅ Check if already liked
    const { data: existing, error: selectError } = await supabase
      .from("template_likes")
      .select("id")
      .eq("template_id", template_id)
      .eq("user_id", user_id)
      .maybeSingle();

    if (selectError) throw selectError;

    if (existing) {
      // ✅ Unlike
      const { error: deleteError } = await supabase
        .from("template_likes")
        .delete()
        .eq("id", existing.id);
      if (deleteError) throw deleteError;

      // decrement like_count
      await supabase.rpc("decrement_like", { tid: template_id });

      return NextResponse.json({ message: "Unliked", liked: false });
    }

    // ✅ Like
    const { error: insertError } = await supabase
      .from("template_likes")
      .insert({ template_id, user_id });
    if (insertError) throw insertError;

    await supabase.rpc("increment_like", { tid: template_id });

    return NextResponse.json({ message: "Liked", liked: true });
  } catch (err) {
    console.error("Like template error:", err);
    return NextResponse.json({ error: "Failed to like/unlike template" }, { status: 500 });
  }
}

// GET → Fetch all liked templates for a user
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get("user_id");
    const supabase = supabaseServer();

    if (!user_id)
      return NextResponse.json({ error: "user_id is required" }, { status: 400 });

    const { data, error } = await supabase
      .from("template_likes")
      .select("id, template_id, created_at, templates(*)")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ liked_templates: data });
  } catch (err) {
    console.error("Get likes error:", err);
    return NextResponse.json({ error: "Failed to fetch liked templates" }, { status: 500 });
  }
}
