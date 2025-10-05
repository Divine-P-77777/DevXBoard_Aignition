import { NextResponse } from "next/server";
import { supabaseServer } from "@/libs/supabase/server";

// GET /api/profile/[id] - fetch profile
export async function GET(req, { params }) {
  const { id } = await params;

  if (!id) return NextResponse.json({ error: "Profile ID required" }, { status: 400 });

  const supabase = supabaseServer();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ profile: data });
}

// PATCH /api/profile/[id] - update profile
export async function PATCH(req, { params }) {
  const { id } = await params;
  const { username, pic } = await req.json();

  if (!id) return NextResponse.json({ error: "Profile ID required" }, { status: 400 });

  if (!username && !pic)
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });

  const supabase = supabaseServer();

  // Check for duplicate username
  if (username) {
    const { data: existing, error: checkErr } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .neq("id", id);

    if (checkErr) return NextResponse.json({ error: checkErr.message }, { status: 500 });
    if (existing.length > 0) return NextResponse.json({ error: "Username already taken" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({ username, pic })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ profile: data[0], message: "Profile updated successfully" });
}

// DELETE /api/profile/[id] - delete profile
export async function DELETE(req, { params }) {
  const { id } = await params;
  if (!id) return NextResponse.json({ error: "Profile ID required" }, { status: 400 });

  const supabase = supabaseServer();

  const { error } = await supabase.from("profiles").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ message: "Profile deleted successfully" });
}
