// src/app/api/public-templates/route.ts
import { NextResponse } from "next/server";
import { supabaseServer } from "@/libs/supabase/server";

export async function GET() {
  try {
    const supabase = supabaseServer();

    // 1. Fetch public templates
    const { data: templates, error: templatesError } = await supabase
      .from("templates")
      .select("*")
      .eq("visibility", "public")
      .order("created_at", { ascending: false });

    if (templatesError) throw templatesError;
    if (!templates?.length) {
      return NextResponse.json({ templates: [] });
    }

    // Collect IDs
    const userIds = [...new Set(templates.map(t => t.user_id).filter(Boolean))];
    const templateIds = templates.map(t => t.id);

    // 2. Fetch related data in parallel
    const [profilesRes, commentsRes] = await Promise.all([
      userIds.length
        ? supabase.from("profiles").select("id, username, pic").in("id", userIds)
        : Promise.resolve({ data: [], error: null }),
      templateIds.length
        ? supabase.from("template_comments").select("template_id").in("template_id", templateIds)
        : Promise.resolve({ data: [], error: null }),
    ]);

    if (profilesRes.error) throw profilesRes.error;
    if (commentsRes.error) throw commentsRes.error;

    const profiles = profilesRes.data || [];
    const comments = commentsRes.data || [];

    // 3. Count comments per template
    const commentCounts = comments.reduce((acc, c) => {
      acc[c.template_id] = (acc[c.template_id] || 0) + 1;
      return acc;
    }, {});

    // 4. Merge profiles + counts
    const templatesWithProfile = templates.map(t => ({
      ...t,
      profile: profiles.find(p => p.id === t.user_id) || null,
      comment_count: commentCounts[t.id] || 0,
    }));

    return NextResponse.json({ templates: templatesWithProfile });
  } catch (err) {
    console.error("Error fetching public templates:", err);
    return NextResponse.json(
      { error: "Failed to fetch public templates" },
      { status: 500 }
    );
  }
}
