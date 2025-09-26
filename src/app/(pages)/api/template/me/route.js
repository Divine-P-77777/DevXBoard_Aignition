import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

export async function GET(req) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Get current session user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Fetch templates for this user
    const { data: templates, error } = await supabase
      .from("templates")
      .select(
        `
        *,
        template_code_blocks(*)
      `
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data: templates }, { status: 200 })
  } catch (err) {
    console.error("API /template/me error:", err)
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
