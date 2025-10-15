export const metadata = {
  title: "View Own & Shared Templates | DevXBoard | Blog Templates, Personal & Shared Projects",
  description:
    "Explore your own and shared blog templates on DevXBoard. View, manage, and keep private your personal templates or collaborate on shared templates from other creators. Perfect for developers, designers, and content creators seeking reusable and shareable templates.",
  keywords: [
    "DevXBoard templates",
    "view shared templates",
    "blog templates",
    "personal templates",
    "shared projects",
    "developer templates",
    "UI templates",
    "Next.js templates",
    "frontend components",
    "React templates",
    "collaborative templates",
    "template management",
    "private templates",
    "shared design resources",
    "template library",
    "reusable templates",
    "DevXBoard projects",
    "web app templates",
    "developer portfolio templates"
  ],
  openGraph: {
    title: "View Own & Shared Templates | DevXBoard",
    description:
      "Manage and explore your personal blog templates and shared templates from other creators. Keep templates private or collaborate with the community on DevXBoard.",
    url: "https://devxboard.vercel.app/templates/view",
    siteName: "DevXBoard",
    images: [
      {
        url: "https://devxboard.vercel.app/og/templates-preview.png",
        width: 1200,
        height: 630,
        alt: "DevXBoard Template Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "View Own & Shared Templates | DevXBoard",
    description:
      "Explore and manage your personal and shared blog templates on DevXBoard. Collaborate, reuse, and keep your templates private.",
    images: ["https://devxboard.vercel.app/og/templates-preview.png"],
  },
};

import TemplateStore from "./components/TemplateStore"
export default function () {
  return (
    <TemplateStore/>
  )
}