import TemplateViewPage from "./TemplateViewPage";
import { supabaseServer } from "@/libs/supabase/server";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { id } = params;

  if (!id) {
    return {
      title: "Template not found",
      description: "No template available with this ID.",
    };
  }

  try {
    const supabase = supabaseServer();

    // Fetch template + owner info
    const { data: template, error } = await supabase
      .from("templates")
      .select("*, template_code_blocks(*), profiles(username, pic)")
      .eq("id", id)
      .single();

    if (error || !template) {
      return { title: "Template not found" };
    }

    const description =
      template?.template_code_blocks?.[0]?.description?.slice(0, 160) ||
      "Check out this template.";

    return {
      title: template.title || "Template",
      description,
      openGraph: {
        title: template.title,
        description,
        images: [
          {
            url: template.image || "/logo.png",
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
        images: [template.image || "/logo.png"],
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
