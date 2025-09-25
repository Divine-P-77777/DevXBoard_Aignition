"use client";

import React from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";

const PrivacyPolicy = () => {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  const bgClass = isDarkMode
    ? "bg-black text-gray-100"
    : "bg-white text-gray-900";
  const textClass = isDarkMode ? "text-gray-300" : "text-gray-700";
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-300";

  return (
    <>
      <Navbar />
      <div className={`${bgClass} min-h-screen pt-24 px-6`}>
        <div className="max-w-4xl mx-auto space-y-8">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-purple-500 to-pink-500"
          >
            Privacy Policy
          </motion.h1>

          <p className="text-sm italic">Last updated: June 19, 2025</p>

          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-semibold text-purple-400">
              Introduction
            </h2>
            <p className={`text-sm leading-relaxed ${textClass}`}>
              Welcome to <strong>DevXBoard</strong>, a platform built for
              developers to save, manage, and enhance web links. Your privacy
              matters to us. This policy outlines what data we collect and how
              we use it.
            </p>
          </motion.section>

          <hr className={`${borderColor} border-t`} />

          {[
            {
              title: "What Information We Collect",
              content:
                "We collect email addresses (via Supabase Auth), saved URLs, templates, and optionally, AI-generated metadata (titles, tags).",
            },
            {
              title: "How We Use Your Information",
              content:
                "We use your data to manage your account, store saved links, generate metadata via GPT, and improve platform features.",
            },
            {
              title: "Data Storage & Security",
              content:
                "All data is securely stored in Supabase. We use encryption, role-based access, and HTTPS to protect your information.",
            },
            {
              title: "Public vs Private Content",
              content:
                "You can mark your saved links and templates as private or public. Private content is visible only to you.",
            },
            {
              title: "AI-generated Content Notice",
              content:
                "DevXBoard uses OpenAI's GPT models to auto-generate metadata. AI output is stored in your account but can be edited or removed.",
            },
            {
              title: "Cookies & Analytics",
              content:
                "We may use cookies or lightweight analytics to improve performance and understand usage trends. No marketing or tracking cookies are used.",
            },
            {
              title: "User Rights & Choices",
              content:
                "You have the right to access, edit, or delete your data. For support, email us anytime at support@devxboard.app.",
            },
            {
              title: "Third-party Services",
              content:
                "We use Supabase (authentication & database), OpenAI (AI generation), and Vercel (deployment). These providers handle data securely.",
            },
            {
              title: "Changes to This Policy",
              content:
                "We may occasionally update this policy. We’ll notify you of major changes via in-app notices or email.",
            },
            {
              title: "Contact Information",
              content:
                'Questions? Reach us at <a href="mailto:support@devxboard.app" class="underline text-pink-500">support@devxboard.app</a>',
            },
          ].map((section, i) => (
            <section key={i} className="space-y-3">
              <h2 className="text-xl font-semibold text-purple-400">
                {section.title}
              </h2>
              <p
                className={`text-sm leading-relaxed ${textClass}`}
                dangerouslySetInnerHTML={{ __html: section.content }}
              />
            </section>
          ))}

          <div className="text-center mt-10">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="px-6 py-2 rounded-lg text-sm font-medium bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-md hover:opacity-90 transition"
            >
              Back to Top
            </motion.button>
          </div>
        </div>
      </div>
 
    </>
  );
};

export default PrivacyPolicy;
