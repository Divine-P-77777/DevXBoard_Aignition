import SharedCardPage from "./components/SharedCardPage";
import { supabaseServer } from "@/libs/supabase/server";

export const dynamic = "force-dynamic"; // ensure fresh dynamic metadata

export async function generateMetadata({ params }) {
  const { id } = params;

  if (!id) {
    return {
      title: "Card Not Found",
      description: "No card available with this ID.",
    };
  }

  try {
    const supabase = supabaseServer();

    // Fetch public card data with owner profile
    const { data: card, error } = await supabase
      .from("card")
      .select(`
        id,
        name,
        bg_image,
        pic,
        is_public,
        profiles:profiles!card_user_id_fkey (
          username,
          pic
        )
      `)
      .eq("id", id)
      .eq("is_public", true)
      .single();

    if (error || !card) {
      console.error("Supabase fetch error:", error);
      return {
        title: "Card Not Found",
        description: "This card is either private or does not exist.",
        openGraph: { title: "Card Not Found" },
      };
    }

    const username = card.profiles?.username || "Unknown User";
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

export default function Page({ params }) {
  const { id } = params;
  return <SharedCardPage id={id} />;
}
