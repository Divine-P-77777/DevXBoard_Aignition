// /app/api/template/shared/route.js
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

    // 1️⃣ Get username from profile
    const { data: profile, error: profileErr } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", user_id)
      .single();

    if (profileErr || !profile?.username) {
      return NextResponse.json(
        { success: false, error: "User username not found" },
        { status: 404 }
      );
    }

    const username = profile.username;

    // 2️⃣ Find templates shared with this username
    const { data: shared, error: sharedErr } = await supabase
      .from("template_shares")
      .select("template_id")
      .eq("shared_with_username", username);

    if (sharedErr) {
      console.error("Supabase sharedErr:", sharedErr);
      return NextResponse.json(
        { success: false, error: sharedErr.message },
        { status: 500 }
      );
    }

    if (!shared?.length) {
      return NextResponse.json({ success: true, templates: [] }, { status: 200 });
    }

    const templateIds = shared.map((s) => s.template_id);

    // 3️⃣ Fetch templates
    const { data: templates, error: tplErr } = await supabase
      .from("templates")
      .select("*, template_code_blocks(*)")
      .in("id", templateIds)
      .order("created_at", { ascending: false });

    if (tplErr) {
      console.error("Supabase tplErr:", tplErr);
      return NextResponse.json(
        { success: false, error: tplErr.message },
        { status: 500 }
      );
    }

    // 4️⃣ Fetch owner profiles
    const ownerIds = Array.from(
      new Set(templates.map((tpl) => tpl.user_id).filter(Boolean))
    );

    const { data: owners, error: ownerErr } = await supabase
      .from("profiles")
      .select("id, username, pic")
      .in("id", ownerIds);

    if (ownerErr) {
      console.error("Supabase ownerErr:", ownerErr);
      return NextResponse.json(
        { success: false, error: ownerErr.message },
        { status: 500 }
      );
    }

    const ownersMap = (owners || []).reduce((acc, o) => {
      acc[o.id] = { username: o.username, pic: o.pic };
      return acc;
    }, {});

    // 5️⃣ Format result
    const formatted = templates.map((tpl) => ({
      id: tpl.id,
      title: tpl.title,
      subtitle: tpl.subtitle,
      visibility: tpl.visibility,
      cover_image: tpl.cover_image,
      created_at: tpl.created_at,
      updated_at: tpl.updated_at,
      template_code_blocks: tpl.template_code_blocks || [],
      owner_profile: ownersMap[tpl.user_id] || null,
    }));

    return NextResponse.json({ success: true, templates: formatted }, { status: 200 });
  } catch (err) {
    console.error("API /template/shared error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
