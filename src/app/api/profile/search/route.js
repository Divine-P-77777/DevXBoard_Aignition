import { NextResponse } from "next/server";
import { supabaseServer } from "@/libs/supabase/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim();
    if (!q) {
      return NextResponse.json({ success: true, profiles: [] }, { status: 200 });
    }

    const supabase = supabaseServer();

    // Search by username only (case-insensitive)
    const { data, error } = await supabase
      .from("profiles")
      .select("id, username, pic")
      .ilike("username", `%${q}%`)
      .limit(5);

    if (error) {
      console.error("Supabase search error:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, profiles: data }, { status: 200 });
  } catch (err) {
    console.error("GET /api/profile/search error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to search profiles" },
      { status: 500 }
    );
  }
}
