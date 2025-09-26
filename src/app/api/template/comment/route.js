import { NextResponse } from "next/server";
import { supabaseServer } from "@/libs/supabase/server";

// POST → Add a comment
export async function POST(req) {
  try {
    const { template_id, user_id, comment } = await req.json();
    const supabase = supabaseServer();

    if (!template_id || !user_id || !comment) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const { error } = await supabase
      .from("template_comments")
      .insert({ template_id, user_id, comment });

    if (error) throw error;

    return NextResponse.json({ message: "Comment added" });
  } catch (err) {
    console.error("Comment error:", err);
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 });
  }
}

// GET → Fetch comments for a template
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const template_id = searchParams.get("template_id");
    const supabase = supabaseServer();

    if (!template_id) {
      return NextResponse.json({ error: "template_id is required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("template_comments")
      .select("id, comment, created_at, user_id, profiles(username, pic)")
      .eq("template_id", template_id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ comments: data });
  } catch (err) {
    console.error("Get comments error:", err);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}
