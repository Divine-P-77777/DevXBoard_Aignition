export const metadata = {
  title: "DevXBoard Community | Developer Forum, Templates, Discussions & Open Source Hub",
  description:
    "Join the DevXBoard Community — a hub for developers to collaborate, share templates, discuss tech trends, and explore open-source innovations. Connect with coders, designers, and creators from around the world. Discover AI tools, Next.js projects, Supabase integrations, and more.",
  keywords: [
    "DevXBoard community",
    "developer forum",
    "coding discussions",
    "open source projects",
    "developer collaboration",
    "Next.js community",
    "Supabase templates",
    "frontend developers",
    "React templates",
    "AI tools for developers",
    "web app community",
    "software development platform",
    "developer social hub",
    "UI components sharing",
    "JavaScript discussions",
    "TailwindCSS templates",
    "build and share projects",
    "modern web dev tools",
    "developer network",
    "DevXBoard templates"
  ],
  openGraph: {
    title: "DevXBoard Community | Collaborate, Share & Build Together",
    description:
      "Explore the DevXBoard Community — where developers connect, share ideas, and build open-source projects together. Join discussions, find templates, and enhance your dev workflow.",
    url: "https://devxboard.vercel.app/community",
    siteName: "DevXBoard",
    images: [
      {
        url: "https://devxboard.vercel.app/og/community-banner.png",
        width: 1200,
        height: 630,
        alt: "DevXBoard Community Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevXBoard Community | Developer Collaboration Hub",
    description:
      "Join DevXBoard — the ultimate community for developers to connect, share templates, and discuss cutting-edge tech trends.",
    images: ["https://devxboard.vercel.app/og/community-banner.png"],
  },
};

import CommunityTemplates from "./components/CommunityTemplates"
export default function () {
  return (
    <CommunityTemplates/>
  )
}