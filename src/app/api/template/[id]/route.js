import { verify } from "jsonwebtoken";
import { NextResponse } from "next/server";
import { supabaseServer } from "@/libs/supabase/server";

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req, { params }) {
  const { id } = params;
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from("templates")
    .select("*")
    .eq("id", id)
    .single();

  console.log("TEMPLATES direct:", data, error);

  if (error || !data) {
    return NextResponse.json({ success: false, error: "Template not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true, data }, { status: 200 });
}
