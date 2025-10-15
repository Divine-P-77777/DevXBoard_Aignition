import { NextResponse } from "next/server";
import { supabaseServer } from "@/libs/supabase/server";


export async function GET(req, { params }) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Profile ID required" },
        { status: 400 }
      );
    }

    const supabase = supabaseServer();
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );

    if (!data)
      return NextResponse.json(
        { success: false, error: "Profile not found" },
        { status: 404 }
      );

    return NextResponse.json({ success: true, profile: data });
  } catch (err) {
    console.error("GET /profile/[id] error:", err);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}



export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    if (!id)
      return NextResponse.json(
        { success: false, error: "Profile ID required" },
        { status: 400 }
      );

    const { username, pic } = await req.json();
    if (username === undefined && pic === undefined)
      return NextResponse.json(
        { success: false, error: "Nothing to update" },
        { status: 400 }
      );

    const supabase = supabaseServer();

    // 🔍 Check duplicate username (if provided)
    if (username) {
      const { data: existing, error: checkErr } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", username)
        .neq("id", id);

      if (checkErr)
        return NextResponse.json(
          { success: false, error: checkErr.message },
          { status: 500 }
        );

      if (existing?.length > 0)
        return NextResponse.json(
          { success: false, error: "Username already taken" },
          { status: 400 }
        );
    }

    // ✅ Update
    const updateData = {};
    if (username !== undefined) updateData.username = username;
    if (pic !== undefined) updateData.pic = pic;

    const { data, error } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );

    if (!data)
      return NextResponse.json(
        { success: false, error: "Profile not found" },
        { status: 404 }
      );

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      profile: data,
    });
  } catch (err) {
    console.error("PATCH /profile/[id] error:", err);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/* =========================================================
   ❌ DELETE /api/profile/[id]
   ========================================================= */
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    if (!id)
      return NextResponse.json(
        { success: false, error: "Profile ID required" },
        { status: 400 }
      );

    const supabase = supabaseServer();
    const { error } = await supabase.from("profiles").delete().eq("id", id);

    if (error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );

    return NextResponse.json({
      success: true,
      message: "Profile deleted successfully",
    });
  } catch (err) {
    console.error("DELETE /profile/[id] error:", err);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

