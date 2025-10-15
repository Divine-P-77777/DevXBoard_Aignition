import TemplateViewPage from "./components/TemplateViewPage";
import { supabaseServer } from "@/libs/supabase/server";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { id } = await params;

  if (!id) {
    return {
      title: "Template not found",
      description: "No template available with this ID.",
    };
  }

  try {
    const supabase = supabaseServer();

    // 1️⃣ Fetch template info
    const { data: template, error: templateError } = await supabase
      .from("templates")
      .select("*")
      .eq("id", id)
      .single();

    if (templateError || !template) {
      return { title: "Template not found" };
    }

    // 2️⃣ Fetch template owner profile separately
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("username, pic")
      .eq("id", template.user_id)
      .single();

    if (profileError) {
      console.warn("Owner profile not found:", profileError);
    }

    // 3️⃣ Build description
    const description =
      template.template_code_blocks?.[0]?.description?.slice(0, 160) ||
      "Check out this template.";

    return {
      title: template.title || "Template",
      description,
      openGraph: {
        title: template.title,
        description,
        images: [
          {
            url: template.cover_image || profile?.pic || "/logo.png",
            width: 800,
            height: 600,
            alt: template.title || "Template preview",
          },
        ],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: template.title,
        description,
        images: [template.cover_image || profile?.pic || "/logo.png"],
      },
    };
  } catch (err) {
    console.error("Metadata generation error:", err);
    return { title: "Template" };
  }
}

export default function TemplatePage() {
  return <TemplateViewPage />;
}
