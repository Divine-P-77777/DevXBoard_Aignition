import { NextResponse } from "next/server";
import {supabase} from "@/libs/supabase/server";

/*
 Minimal comments. Key: validate inputs, check supabase responses, log full error objects,
 and always return expected shapes so frontend can safely call .map() etc.
*/

function jsonError(msg, status = 500) {
  return NextResponse.json({ error: msg }, { status });
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get("user_id");
    const search = (searchParams.get("search") || "").trim();

    if (!user_id) return jsonError("Missing required query param: user_id", 400);

    // Build base query
    let query = supabase
      .from("card")
      .select("*, urls:url_store(*)")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });

    if (search) query = query.ilike("name", `%${search}%`);

    const { data, error } = await query;

    if (error) {
      console.error("SUPABASE GET /card ERROR:", error);
      return jsonError(error.message || "Database error", 500);
    }

    return NextResponse.json(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error("API /api/card GET failed:", err);
    return jsonError(err?.message || "Internal server error", 500);
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    if (!body || typeof body !== "object") return jsonError("Invalid request body", 400);

    const { urls = [], ...cardData } = body;

    if (!cardData.user_id) return jsonError("Missing card.user_id", 400);
    if (!cardData.name) return jsonError("Missing card.name", 400);

    // Insert card and return the created row
    const { data: card, error: cardError } = await supabase
      .from("card")
      .insert(cardData)
      .select()
      .single();

    if (cardError) {
      console.error("SUPABASE INSERT card ERROR:", cardError);
      return jsonError(cardError.message || "Failed to create card", 500);
    }

    // Insert urls if provided (guarded)
    if (Array.isArray(urls) && urls.length > 0) {
      const urlsWithCard = urls.map((u) => ({
        title: u.title ?? null,
        url: u.url ?? null,
        tags: u.tags ?? null,
        card_id: card.id
      }));

      const { error: urlsError } = await supabase.from("url_store").insert(urlsWithCard);
      if (urlsError) {
        console.error("SUPABASE INSERT url_store ERROR:", urlsError);
        // Note: card already created. You could add compensating delete here if desired.
        return jsonError(urlsError.message || "Failed to insert urls", 500);
      }
    }

    return NextResponse.json(card);
  } catch (err) {
    console.error("API /api/card POST failed:", err);
    return jsonError(err?.message || "Internal server error", 500);
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    if (!body || typeof body !== "object") return jsonError("Invalid request body", 400);

    const { id, urls = [], ...updates } = body;
    if (!id) return jsonError("Missing card id", 400);

    // Update card and optionally return updated card
    const { data: updatedCard, error: updateError } = await supabase
      .from("card")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error("SUPABASE UPDATE card ERROR:", updateError);
      return jsonError(updateError.message || "Failed to update card", 500);
    }

    // Manage url_store rows if urls provided
    if (Array.isArray(urls)) {
      // Insert or update each provided URL
      for (const u of urls) {
        if (u.id) {
          const { error: upUrlErr } = await supabase.from("url_store").update({
            title: u.title ?? null,
            url: u.url ?? null,
            tags: u.tags ?? null
          }).eq("id", u.id);
          if (upUrlErr) {
            console.error("SUPABASE UPDATE url_store ERROR:", upUrlErr, { urlId: u.id });
            return jsonError(upUrlErr.message || "Failed to update a url entry", 500);
          }
        } else {
          const { error: insUrlErr } = await supabase.from("url_store").insert({
            title: u.title ?? null,
            url: u.url ?? null,
            tags: u.tags ?? null,
            card_id: id
          });
          if (insUrlErr) {
            console.error("SUPABASE INSERT url_store ERROR:", insUrlErr);
            return jsonError(insUrlErr.message || "Failed to insert a url entry", 500);
          }
        }
      }

      // Delete any urls that are no longer present in the client's kept list
      const { data: existingUrls, error: fetchExistingErr } = await supabase
        .from("url_store")
        .select("id")
        .eq("card_id", id);

      if (fetchExistingErr) {
        console.error("SUPABASE SELECT url_store ERROR:", fetchExistingErr);
        return jsonError(fetchExistingErr.message || "Failed to fetch existing urls", 500);
      }

      const keptIds = urls.filter((u) => u.id).map((u) => u.id);
      const deleteIds = (existingUrls || [])
        .map((r) => r.id)
        .filter((eid) => !keptIds.includes(eid));

      if (deleteIds.length) {
        const { error: delErr } = await supabase.from("url_store").delete().in("id", deleteIds);
        if (delErr) {
          console.error("SUPABASE DELETE url_store ERROR:", delErr);
          return jsonError(delErr.message || "Failed to delete removed urls", 500);
        }
      }
    }

    return NextResponse.json({ success: true, card: updatedCard ?? null });
  } catch (err) {
    console.error("API /api/card PUT failed:", err);
    return jsonError(err?.message || "Internal server error", 500);
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return jsonError("Missing card id", 400);

    // Delete card (cascade should remove url_store rows if FK on delete cascade)
    const { data, error } = await supabase.from("card").delete().eq("id", id);
    if (error) {
      console.error("SUPABASE DELETE card ERROR:", error);
      return jsonError(error.message || "Failed to delete card", 500);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("API /api/card DELETE failed:", err);
    return jsonError(err?.message || "Internal server error", 500);
  }
}
