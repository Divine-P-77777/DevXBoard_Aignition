export const metadata = {
  title: "DevXBoard URL Store | Smart Link Manager with AI & Customizable Cards",
  description:
    "Manage and share multiple links with DevXBoard’s AI-powered URL Store. Create personalized link cards, organize projects, and control privacy settings — all built with Next.js, Supabase, and Cloudinary.",
  keywords: [
    "DevXBoard URL store",
    "AI link manager",
    "smart link cards",
    "Next.js project links",
    "Supabase database",
    "AI-generated URLs",
    "linktree alternative",
    "customizable link cards",
    "developer portfolio links",
    "AI URL generation",
    "public and private links",
    "Cloudinary storage",
    "developer tool platform",
    "Next.js and Supabase integration",
    "manage multiple URLs",
    "shareable link dashboard",
    "AI-powered link management",
    "modern web app tools",
    "DevXBoard link system",
    "developer productivity tools"
  ],
  openGraph: {
    title: "DevXBoard URL Store | AI-Powered Link Manager & Smart Cards",
    description:
      "Store and organize multiple project links using DevXBoard’s advanced URL system. Generate, edit, and manage AI-assisted link cards with full control over privacy and design.",
    url: "https://devxboard.vercel.app/url-store",
    siteName: "DevXBoard",
    images: [
      {
        url: "https://devxboard.vercel.app/og/url-store-banner.png",
        width: 1200,
        height: 630,
        alt: "DevXBoard URL Store Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevXBoard URL Store | Manage Links Smarter with AI",
    description:
      "Create and customize AI-generated link cards using DevXBoard. Organize multiple URLs, set privacy modes, and share your public link collections easily.",
    images: ["https://devxboard.vercel.app/og/url-store-banner.png"],
  },
};

import UrlPage from "./components/UrlPage";

export default function UrlStorePage() {
  return <UrlPage />;
}
