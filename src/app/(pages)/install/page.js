export const metadata = {
  title:
    "Install DevXBoard | Set Up the AI Developer Hub for Projects, Templates & URL Store",
  description:
    "Learn how to install and set up DevXBoard — your AI-powered developer hub for managing templates, projects, and smart link collections. Get started with Next.js, Supabase, and Cloudinary integration in minutes.",
  keywords: [
    "DevXBoard installation",
    "how to install DevXBoard",
    "DevXBoard setup guide",
    "AI developer platform",
    "Next.js project installation",
    "Supabase setup",
    "Cloudinary integration",
    "developer tools setup",
    "DevXBoard tutorial",
    "install DevXBoard locally",
    "AI productivity tools",
    "developer hub installation",
    "open source project manager",
    "AI-powered link management setup",
    "Next.js and Supabase project guide",
    "DevXBoard quick start",
    "AI code tools",
    "modern web app installation",
    "link management platform setup",
  ],
  openGraph: {
    title:
      "Install DevXBoard | AI Developer Hub Setup for Projects & Smart Links",
    description:
      "Follow the quick setup guide to install DevXBoard — an AI-powered Next.js platform to manage templates, projects, and URL stores with Supabase & Cloudinary.",
    url: "https://devxboard.vercel.app/install",
    siteName: "DevXBoard",
    images: [
      {
        url: "https://devxboard.vercel.app/og/install-banner.png",
        width: 1200,
        height: 630,
        alt: "DevXBoard Installation Guide Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Install DevXBoard | Your AI-Powered Developer Hub for Smart Projects",
    description:
      "Get started with DevXBoard — install the AI developer platform built with Next.js, Supabase, and Cloudinary to manage your projects, templates, and smart URLs effortlessly.",
    images: ["https://devxboard.vercel.app/og/install-banner.png"],
  },
};

import InstallPage from "./InstallPage";

export default function Install() {
  return <InstallPage />;
}
