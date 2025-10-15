import SharedCardPage from "./components/SharedCardPage";
import { supabaseServer } from "@/libs/supabase/server";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { id } = await params;

  if (!id) {
    return {
      title: "Card Not Found",
      description: "No card available with this ID.",
    };
  }

  try {
    const supabase = supabaseServer();

    // Fetch card and profile manually
    const { data: card, error: cardError } = await supabase
      .from("card")
      .select("*")
      .eq("id", id)
      .eq("is_public", true)
      .single();

    if (cardError || !card) {
      console.error("Card fetch error:", cardError);
      return {
        title: "Card Not Found",
        description: "This card is either private or does not exist.",
      };
    }

    // Fetch linked profile manually
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("username, pic")
      .eq("id", card.user_id)
      .single();

    if (profileError) {
      console.warn("Profile not found:", profileError);
    }

    const username = profile?.username || "Unknown User";
    const image =
      card.bg_image ||
      card.pic ||
      `${process.env.NEXT_PUBLIC_SITE_URL}/default-bg.jpg`;

    const title = `${card.name} by ${username}`;
    const description = `Links shared by ${username}`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/shared/${id}`,
        images: [
          {
            url: image,
            width: 1200,
            height: 630,
            alt: card.name || "Shared Card Preview",
          },
        ],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [image],
      },
    };
  } catch (err) {
    console.error("Metadata generation error:", err);
    return {
      title: "Card",
      description: "View shared links and content.",
    };
  }
}

export default function Page() {
  return <SharedCardPage />;
}
