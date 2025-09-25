"use client";

import React from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";


const AboutUs = () => {
  const isDark = useSelector((state) => state.theme.isDarkMode);
  const bgClass = isDark
    ? "bg-gradient-to-br from-zinc-900 via-black to-zinc-800 text-white"
    : "bg-gradient-to-br from-white via-pink-50 to-purple-100 text-black";
  const textClass = isDark ? "text-gray-300" : "text-gray-700";
  const highlight = isDark ? "text-pink-400" : "text-purple-600";

  return (
    <>
  
      <main className={`${bgClass} min-h-screen px-6 py-20`}>
        <div className="max-w-5xl mx-auto space-y-10">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-center pt-10"
          >
            About <span className={highlight}>DevXBoard</span>
          </motion.h1>

          {/* Mission Statement */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">🚀 Our Mission</h2>
            <p className={textClass}>
              DevXBoard exists to give developers a smarter, cleaner way to organize the web they explore. Whether it’s a handy tool, a blog post, or that StackOverflow thread you always lose — we help you save it, tag it, and come back to it easily.
            </p>
          </section>

          {/* Problem Statement */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">💡 Why We Built This</h2>
            <p className={textClass}>
              Developers juggle bookmarks, tabs, code snippets, and helpful links across platforms. It's messy. DevXBoard solves that by giving you a <strong>centralized hub</strong> to manage valuable URLs and templates in a clean, intuitive interface — backed by smart automation and community collaboration.
            </p>
          </section>

          {/* Feature Overview */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">⚙️ Core Features</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li className={textClass}>
                <strong>URL Store:</strong> Organize links with a searchable, card-based interface — toggle between public and private.
              </li>
              <li className={textClass}>
                <strong>AI-powered Tagging:</strong> Paste a URL and we’ll generate smart titles and tags using GPT to save you time.
              </li>
              <li className={textClass}>
                <strong>Template Store:</strong> Share your favorite code templates or grab reusable ones from others (coming soon).
              </li>
              <li className={textClass}>
                <strong>Community Zone:</strong> A space to engage, collaborate, and grow with other developers (in development).
              </li>
            </ul>
          </section>

          {/* Tech Stack */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">🛠️ Built for Developers, By Developers</h2>
            <p className={textClass}>
              DevXBoard is crafted using modern, open-source tech:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li className={textClass}><strong>Next.js</strong> – for blazing fast and scalable frontend</li>
              <li className={textClass}><strong>Tailwind CSS</strong> – with our custom <span className={highlight}>purple-pink</span> developer theme</li>
              <li className={textClass}><strong>Supabase</strong> – handles authentication and database management</li>
              <li className={textClass}><strong>GPT-powered AI</strong> – for intelligent metadata extraction</li>
            </ul>
          </section>

          {/* Community Note */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">🙌 A Note to Our Community</h2>
            <p className={textClass}>
              DevXBoard is evolving. We're actively building new features and fine-tuning the experience. We’d love your input — whether it’s feedback, feature requests, or ideas for collaboration.
            </p>
            <p className={textClass}>
              Reach out at{" "}
              <a href="mailto:support@devxboard.com" className="underline text-blue-400">
                support@devxboard.vercel.app
              </a>{" "}
              or connect with us on GitHub and socials.
            </p>
          </section>

          {/* Stay Tuned */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">📢 What's Next</h2>
            <p className={textClass}>
              Our roadmap includes collaborative folders, export/import tools, community badges, and more. Stick around — we’re just getting started.
            </p>
          </section>
        </div>
      </main>
  
    </>
  );
};

export default AboutUs;
