import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Provider from "./Provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr" className="scroll-smooth">
      <head>
        {/* ===== Basic Meta Tags ===== */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#0f172a" />
        <meta
          name="description"
          content="DevXBoard is a modern developer resource hub by Deepak Prasad — manage URLs, store code templates, share blogs, and collaborate with the global dev community. Built for developers and creators who want efficiency, organization, and creativity."
        />
        <meta
          name="keywords"
          content="DevXBoard, Dynamic Phillic, Deepak Prasad, developer tools, resource hub, code sharing, blog templates, private code storage, frontend templates, backend snippets, developer community, shareable resources, creator tools, coding platform, MERN stack app, JavaScript, React, Node.js, Express, MongoDB, open source tools, developer productivity"
        />
        <meta name="author" content="Deepak Prasad" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://devxboard.vercel.app" />

        {/* ===== Open Graph / Facebook ===== */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://devxboard.vercel.app" />
        <meta
          property="og:title"
          content="DevXBoard — Developer Resource & Code Management Hub"
        />
        <meta
          property="og:description"
          content="Centralize your developer workflow with DevXBoard. Save URLs, share code templates, write blogs, and collaborate privately or with the community."
        />
        <meta property="og:image" content="https://devxboard.vercel.app/og-preview.jpg" />
        <meta property="og:site_name" content="DevXBoard" />

        {/* ===== Twitter Card ===== */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://devxboard.vercel.app" />
        <meta
          name="twitter:title"
          content="DevXBoard — Developer Resource & Collaboration Platform"
        />
        <meta
          name="twitter:description"
          content="Manage developer resources, upload code templates, share blogs, and collaborate privately or publicly using DevXBoard."
        />
        <meta
          name="twitter:image"
          content="https://devxboard.vercel.app/twitter-preview.jpg"
        />
        <meta name="twitter:creator" content="@deepakprasad" />

        {/* ===== Google Site Verification ===== */}
        <meta
          name="google-site-verification"
          content="CylSRxdRveVgo_GfP8_5zbixOgwQ2FOlZaIfcdpzfzA"
        />

        {/* ===== Favicon ===== */}
        <link rel="icon" href="/favicon.png" type="image/png" sizes="32x32" />
        <link rel="manifest" href="/manifest.json" />

        {/* ===== Title ===== */}
        <title>DevXBoard — Developer Resource & Collaboration Hub | Deepak Prasad</title>

        {/* ===== Structured Data (Schema.org JSON-LD) ===== */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "DevXBoard",
              url: "https://devxboard.vercel.app",
              description:
                "DevXBoard is a developer-focused platform by Deepak Prasad for managing URLs, sharing code templates, writing blogs, and contributing to the dev community.",
              applicationCategory: "Developer Tools",
              creator: {
                "@type": "Person",
                name: "Deepak Prasad",
                url: "https://dynamicphillic.vercel.app",
                sameAs: [
                  "https://in.linkedin.com/in/deepak-prasad-799128259",
                  "https://github.com/dynamicphillic",
                ],
              },
              operatingSystem: "All",
              softwareVersion: "1.0.0",
              keywords: [
                "DevXBoard",
                "Dynamic Phillic",
                "Deepak Prasad",
                "developer tools",
                "code sharing",
                "frontend templates",
                "backend resources",
                "developer blogs",
                "coding community",
              ],
            }),
          }}
        />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-slate-900 text-white`}
      >
        <Provider>
          <main className="flex-1">{children}</main>
        </Provider>
      </body>
    </html>
  );
}
