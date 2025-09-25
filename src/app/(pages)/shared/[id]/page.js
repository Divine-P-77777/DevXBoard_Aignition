import SharedCardPage from "./SharedCardPage";
import { supabaseServer } from "@/libs/supabase/server";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const supabase = supabaseServer();

  const { data, error } = await supabase
    .from("card")
    .select(`
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


  if (error || !data) {
    return {
      title: "Card Not Found",
      description: "This card is either private or does not exist.",
      openGraph: { title: "Card Not Found" },
    };
  }

  const username = data.profiles?.username || "unknown";
  const image =
    data.bg_image ||
    data.pic ||
    `${process.env.NEXT_PUBLIC_SITE_URL}/default-bg.jpg`;

  return {
    title: `${data.name} by ${username}`,
    description: `Links shared by ${username}`,
    openGraph: {
      title: `${data.name} by ${username}`,
      description: `Links shared by ${username}`,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/shared/${id}`,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: data.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${data.name} by ${username}`,
      description: `Links shared by ${username}`,
      images: [image],
    },
  };
}

export default async function Page({ params }) {
  const resolvedParams = await params;
  return <SharedCardPage id={resolvedParams.id} />;
}
