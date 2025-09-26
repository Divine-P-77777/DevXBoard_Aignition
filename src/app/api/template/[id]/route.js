import { NextResponse } from "next/server";
import { supabaseServer } from "@/libs/supabase/server";

export async function GET(req, { params }) {
  const { id } = await params; // template.id from URL
  const searchParams = req.nextUrl.searchParams;
  const login_user_id = searchParams.get("userID"); // logged-in user id

  if (!id) {
    return NextResponse.json(
      { success: false, error: "Template ID is required" },
      { status: 400 }
    );
  }

  try {
    const supabase = supabaseServer();

    // 1️⃣ Fetch template by template.id
    const { data: template, error: templateError } = await supabase
      .from("templates")
      .select("*")
      .eq("id", id)
      .single();

    if (templateError) {
      return NextResponse.json(
        { success: false, error: templateError.message },
        { status: 500 }
      );
    }

    // 2️⃣ Visibility check
    if (template.visibility === "private" && template.user_id !== login_user_id) {
      return NextResponse.json(
        { success: false, error: "Access denied: private template" },
        { status: 403 }
      );
    }

    // 3️⃣ Fetch profile of the template owner
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("username, pic")
      .eq("id", template.user_id)
      .single();

    if (profileError) {
      return NextResponse.json(
        { success: false, error: profileError.message },
        { status: 500 }
      );
    }

    // 4️⃣ Insert a "view" record (log the view)
    await supabase.from("views").insert({
      template_id: id,
      viewer_id: login_user_id || null,
    });

    // 5️⃣ Return formatted response
    return NextResponse.json(
      {
        success: true,
        data: {
          profile,
          template,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("API /template/[id] error:", err);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
