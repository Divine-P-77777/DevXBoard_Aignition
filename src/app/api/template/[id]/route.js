import { NextResponse } from "next/server";
import { supabaseServer } from "@/libs/supabase/server";

export async function GET(req, { params }) {
  const { id } = await params;
  const searchParams = req.nextUrl.searchParams;
  const viewerProfileId = searchParams.get("viewer_profile_id");
  const viewerEmail = searchParams.get("viewer_email");

  if (!id) {
    return NextResponse.json({ success: false, error: "Template ID is required" }, { status: 400 });
  }

  try {
    const supabase = supabaseServer();

    // 1️⃣ Fetch template and code blocks
    const { data: template, error: templateError } = await supabase
      .from("templates")
      .select("*, template_code_blocks(*)")
      .eq("id", id)
      .single();

    if (templateError || !template) {
      return NextResponse.json(
        { success: false, error: templateError?.message || "Template not found" },
        { status: 404 }
      );
    }

    // 2️⃣ Check visibility + access
    let hasAccess = false;

    if (template.visibility === "public") {
      hasAccess = true;
    } else if (template.user_id === viewerProfileId) {
      // Owner access
      hasAccess = true;
    } else if (viewerEmail) {
      // Shared email access
      const { data: shared } = await supabase
        .from("template_shares")
        .select("id")
        .eq("template_id", id)
        .eq("shared_with_email", viewerEmail)
        .maybeSingle();

      if (shared) hasAccess = true;
    }

    if (!hasAccess) {
      return NextResponse.json(
        { success: false, error: "Access denied: private template" },
        { status: 403 }
      );
    }

    // 3️⃣ Fetch template owner profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("username, pic")
      .eq("id", template.user_id)
      .single();

    // 4️⃣ Fetch all shared profiles for this template
    const { data: shares } = await supabase
      .from("template_shares")
      .select("shared_with_email")
      .eq("template_id", id);

    // 5️⃣ Get profile info for each shared email
    let sharedProfiles = [];
    if (shares?.length > 0) {
      const emails = shares.map((s) => s.shared_with_email);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, username, pic, email")
        .in("email", emails);
      sharedProfiles = profiles || [];
    }

    // ✅ 6️⃣ Return full data structure your frontend expects
    return NextResponse.json(
      {
        success: true,
        data: {
          template,
          profile,
          sharedProfiles,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("API /template/[id] error:", err);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
