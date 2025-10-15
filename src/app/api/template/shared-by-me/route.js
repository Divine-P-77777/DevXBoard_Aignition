import { NextResponse } from "next/server";
import { supabaseServer } from "@/libs/supabase/server";

export async function POST(req) {
  try {
    const { user_id } = await req.json();

    if (!user_id) {
      return NextResponse.json(
        { success: false, error: "Missing user_id" },
        { status: 400 }
      );
    }

    const supabase = supabaseServer();

    // 1️⃣ Get templates created by this user
    const { data: templates, error: tplErr } = await supabase
      .from("templates")
      .select("id, title, subtitle, visibility, cover_image, created_at")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });

    if (tplErr) throw new Error(tplErr.message);

    if (!templates?.length)
      return NextResponse.json({ success: true, templates: [] }, { status: 200 });

    const templateIds = templates.map((tpl) => tpl.id);

    // 2️⃣ Get all share records for those templates
    const { data: shares, error: shareErr } = await supabase
      .from("template_shares")
      .select("template_id, shared_with_email, shared_with_username")
      .in("template_id", templateIds);

    if (shareErr) throw new Error(shareErr.message);

    if (!shares?.length)
      return NextResponse.json({ success: true, templates }, { status: 200 });

    // 3️⃣ Collect all unique emails
    const emails = [
      ...new Set(shares.map((s) => s.shared_with_email).filter(Boolean)),
    ];

    // 4️⃣ Fetch profile info for shared users
    let profilesMap = {};
    if (emails.length > 0) {
      const { data: profiles, error: profErr } = await supabase
        .from("profiles")
        .select("email, username, pic")
        .in("email", emails);

      if (profErr) throw new Error(profErr.message);

      profilesMap = (profiles || []).reduce((acc, p) => {
        acc[p.email] = {
          username: p.username || p.email.split("@")[0],
          pic: p.pic,
        };
        return acc;
      }, {});
    }

    // 5️⃣ Group shares per template
    const grouped = shares.reduce((acc, s) => {
      if (!acc[s.template_id]) acc[s.template_id] = [];

      const profile =
        profilesMap[s.shared_with_email] ||
        (s.shared_with_username
          ? { username: s.shared_with_username, pic: null }
          : s.shared_with_email
          ? { username: s.shared_with_email.split("@")[0], pic: null }
          : { username: "Unknown", pic: null });

      acc[s.template_id].push(profile);
      return acc;
    }, {});

    // 6️⃣ Attach shared profiles to templates
    const result = templates.map((tpl) => ({
      ...tpl,
      sharedProfiles: grouped[tpl.id] || [],
      sharedUsernames: (grouped[tpl.id] || []).map((p) => p.username),
    }));

    return NextResponse.json({ success: true, templates: result }, { status: 200 });
  } catch (err) {
    console.error("API /template/shared-by-me error:", err.message || err);
    return NextResponse.json(
      { success: false, error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
