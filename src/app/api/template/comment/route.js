import { NextResponse } from "next/server";
import { supabaseServer } from "@/libs/supabase/server";

export async function POST(req) {
  try {
    const { template_id, user_id, comment } = await req.json();
    const supabase = supabaseServer();

    if (!template_id || !user_id || !comment?.trim()) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // ✅ Verify template exists
    const { data: templateExists, error: templateErr } = await supabase
      .from("templates")
      .select("id")
      .eq("id", template_id)
      .single();

    if (templateErr || !templateExists) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    // ✅ Verify user exists
    const { data: userExists, error: userErr } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user_id)
      .single();

    if (userErr || !userExists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ Insert comment
    const { error } = await supabase
      .from("template_comments")
      .insert({ template_id, user_id, comment });

    if (error) throw error;

    return NextResponse.json({ message: "Comment added successfully" });
  } catch (err) {
    console.error("Comment error:", err);
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const template_id = searchParams.get("template_id");
    const supabase = supabaseServer();

    if (!template_id) {
      return NextResponse.json({ error: "template_id is required" }, { status: 400 });
    }

    // 1Fetch all comments for this template
    const { data: comments, error: commentsError } = await supabase
      .from("template_comments")
      .select("id, user_id, comment, created_at")
      .eq("template_id", template_id)
      .order("created_at", { ascending: false });

    if (commentsError) throw commentsError;
    if (!comments?.length) {
      return NextResponse.json({ comments: [] });
    }

    // Collect all unique user IDs
    const userIds = [...new Set(comments.map((c) => c.user_id).filter(Boolean))];

    // Fetch corresponding profiles in one go
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, username, pic")
      .in("id", userIds);

    if (profilesError) throw profilesError;

    // Merge profiles with comments
    const commentsWithProfiles = comments.map((c) => ({
      ...c,
      profiles: profiles.find((p) => p.id === c.user_id) || null,
    }));

    return NextResponse.json({ comments: commentsWithProfiles });
  } catch (err) {
    console.error("Get comments error:", err);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}
