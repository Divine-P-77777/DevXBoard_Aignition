import { NextResponse } from "next/server";
import { supabaseServer } from "@/libs/supabase/server";

export async function POST(req) {
  try {
    const { user_id } = await req.json();
    if (!user_id) {
      return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
    }

    const supabase = supabaseServer();

    // 1. Get private templates for user
    const { data: templates, error: templatesError } = await supabase
      .from("templates")
      .select("*")
      .eq("user_id", user_id)
      .eq("visibility", "private")
      .order("created_at", { ascending: false });

    if (templatesError) throw templatesError;

    // 2. Get profile info for this user
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, username, email, pic")
      .eq("id", user_id)
      .single();

    if (profileError) throw profileError;

    // 3. Merge profile into each template
    const templatesWithProfile = templates.map(t => ({
      ...t,
      profile,
    }));

    return NextResponse.json({ templates: templatesWithProfile });
  } catch (err) {
    console.error("Error fetching private templates:", err);
    return NextResponse.json(
      { error: "Failed to fetch private templates" },
      { status: 500 }
    );
  }
}
