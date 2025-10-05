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
        {/* Basic Meta */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#0f172a" />
        <meta name="description" content="Store, organize, and share your developer resources effortlessly with DevXBoard." />
        <meta name="keywords" content="DevXBoard, developer tools, url saver, resource hub, frontend templates, code sharing" />
        <meta name="author" content="Deepak Prasad" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph Meta */}
        <meta property="og:title" content="DevXBoard — Developer Resource Hub" />
        <meta property="og:description" content="Your central place to manage and share developer resources." />
        <meta property="og:image" content="/favicon.png" />
        <meta property="og:url" content="https://devxboard.vercel.app" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="DevXBoard" />
        <meta name="google-site-verification" content="CylSRxdRveVgo_GfP8_5zbixOgwQ2FOlZaIfcdpzfzA" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="/favicon.png" />
        <meta name="twitter:title" content="DevXBoard" />
        <meta name="twitter:description" content="Manage & share your dev tools and templates." />
        <meta name="twitter:image" content="https://devxboard.vercel.app/favicon.png" />
        <meta name="twitter:creator" content="@yourtwitterhandle" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.png" type="image/png" />

        {/* Title */}
        <title>DevXBoard — Developer Resource Hub</title>
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen `}>
        <Provider>
        
          <main className="flex-1">{children}</main>
        </Provider>
      </body>
    </html>
  );
}
