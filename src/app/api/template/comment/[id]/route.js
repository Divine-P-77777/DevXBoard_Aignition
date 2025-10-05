import { NextResponse } from "next/server";
import { supabaseServer } from "@/libs/supabase/server";

// DELETE /api/template/comment/[id]
export async function DELETE(req, { params }) {
  const { id } = params;
  const { user_id, template_owner_id } = await req.json(); // send user_id and post owner id

  if (!id) return NextResponse.json({ error: "Comment ID required" }, { status: 400 });

  const supabase = supabaseServer();

  // Fetch comment to verify ownership
  const { data: comment, error: commentErr } = await supabase
    .from("template_comments")
    .select("*")
    .eq("id", id)
    .single();

  if (commentErr || !comment) return NextResponse.json({ error: "Comment not found" }, { status: 404 });

  // Only allow deletion if user is the comment author OR the template owner
  if (comment.user_id !== user_id && user_id !== template_owner_id) {
    return NextResponse.json({ error: "Not authorized to delete this comment" }, { status: 403 });
  }

  // Delete comment
  const { error } = await supabase.from("template_comments").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ message: "Comment deleted successfully", id });
}
