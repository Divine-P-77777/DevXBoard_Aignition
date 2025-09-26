import { NextResponse } from "next/server";
import { supabaseServer } from "@/libs/supabase/server";

// GET /template/community
export async function GET(req) {
  try {
    const supabase = supabaseServer();

    // Fetch public templates with user info
    const { data: templates, error } = await supabase
      .from("templates")
      .select(`
        *,
        template_code_blocks(*),
        profiles!inner(id, username, pic)
      `)
      .eq("visibility", "public")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: templates }, { status: 200 });
  } catch (err) {
    console.error("API /template/community error:", err);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
