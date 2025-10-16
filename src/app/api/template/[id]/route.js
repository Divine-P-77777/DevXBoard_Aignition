import { NextResponse } from "next/server";
import { supabaseServer } from "@/libs/supabase/server";

export async function GET(req, { params }) {
  const { id } = await params;
  const searchParams = req.nextUrl.searchParams;
  const viewerProfileId = searchParams.get("viewer_profile_id");
  let viewerUsername = searchParams.get("viewer_username"); // optional

  if (!id) {
    return NextResponse.json(
      { success: false, error: "Template ID is required" },
      { status: 400 }
    );
  }

  try {
    const supabase = supabaseServer();

    // 1️⃣ Fetch the template + code blocks
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

    // 2️⃣ Resolve username from profiles if not provided
    if (!viewerUsername && viewerProfileId) {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", viewerProfileId)
        .maybeSingle();

      if (profileData?.username) {
        viewerUsername = profileData.username;
      }
    }

    // 3️⃣ Access control logic
    let hasAccess = false;

    if (template.visibility === "public") {
      hasAccess = true;
    } else if (template.user_id === viewerProfileId) {
      // Owner
      hasAccess = true;
    } else if (viewerUsername) {
      // Check if username has been shared access
      const { data: shared } = await supabase
        .from("template_shares")
        .select("id")
        .eq("template_id", id)
        .ilike("shared_with_username", viewerUsername)
        .maybeSingle();

      if (shared) hasAccess = true;
    }

    if (!hasAccess) {
      return NextResponse.json(
        { success: false, error: "Access denied: private template" },
        { status: 403 }
      );
    }

    // 4️⃣ Fetch template owner profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("username, pic")
      .eq("id", template.user_id)
      .single();

    // 5️⃣ Fetch shared usernames and their profiles
    const { data: shares } = await supabase
      .from("template_shares")
      .select("shared_with_username")
      .eq("template_id", id);

    let sharedProfiles = [];
    if (shares?.length > 0) {
      const usernames = shares
        .map((s) => s.shared_with_username)
        .filter(Boolean);

      if (usernames.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, username, pic, email")
          .in("username", usernames);

        sharedProfiles = profiles || [];
      }
    }

    // ✅ 6️⃣ Return final payload
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
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}


export async function DELETE(req, { params }) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { success: false, error: "Template ID is required" },
      { status: 400 }
    );
  }

  try {
    const supabase = supabaseServer();

    // 1️⃣ Delete related template_code_blocks
    const { error: blockError } = await supabase
      .from("template_code_blocks")
      .delete()
      .eq("template_id", id);

    if (blockError) {
      console.error("Error deleting code blocks:", blockError);
    }

    // 2️⃣ Delete shares (if any)
    const { error: shareError } = await supabase
      .from("template_shares")
      .delete()
      .eq("template_id", id);

    if (shareError) {
      console.error("Error deleting shares:", shareError);
    }

    // 3️⃣ Delete the template itself
    const { error: templateError } = await supabase
      .from("templates")
      .delete()
      .eq("id", id);

    if (templateError) {
      console.error("Error deleting template:", templateError);
      return NextResponse.json(
        { success: false, error: templateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Template deleted successfully" });
  } catch (err) {
    console.error("DELETE /template/[id] error:", err);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
