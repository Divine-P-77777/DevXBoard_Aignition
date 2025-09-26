import { NextResponse } from "next/server";
import { supabaseServer } from "@/libs/supabase/server";

export async function POST(req) {
  try {
    const { template_id, action } = await req.json(); // only template_id + action
    const supabase = supabaseServer();

    // get user from auth session
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (!template_id || !action) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (action === "like") {
      const { error } = await supabase.rpc("increment_like", { tid: template_id });
      if (error) throw error;
      return NextResponse.json({ message: "Liked" });
    }

    if (action === "unlike") {
      const { error } = await supabase.rpc("decrement_like", { tid: template_id });
      if (error) throw error;
      return NextResponse.json({ message: "Unliked" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    console.error("Like template error:", err);
    return NextResponse.json({ error: "Failed to like/unlike template" }, { status: 500 });
  }
}

// GET → Get like count
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const template_id = searchParams.get("template_id");
    const supabase = supabaseServer();

    if (!template_id) {
      return NextResponse.json({ error: "template_id is required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("templates")
      .select("like_count")
      .eq("id", template_id)
      .single();

    if (error) throw error;

    return NextResponse.json({ like_count: data.like_count });
  } catch (err) {
    console.error("Get likes error:", err);
    return NextResponse.json({ error: "Failed to fetch likes" }, { status: 500 });
  }
}
