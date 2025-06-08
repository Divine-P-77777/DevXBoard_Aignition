"use client"

import React from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";

const PrivacyPolicy = () => {
  const isDark = useSelector((state) => state.theme.isDarkMode);

  const bgClass = isDark ? "bg-slate-900 text-gray-100" : "bg-gray-50 text-gray-900";
  const textClass = isDark ? "text-gray-100" : "text-gray-800";

  return (
    <>
    <Navbar/>
    <div className={`${bgClass} pt-30 min-h-screen p-6`}>
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold border-b pb-2"
        >
          Privacy Policy
        </motion.h1>

        <p className="text-sm italic">Last updated: May 23, 2025</p>

        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-3"
        >
          <h2 className="text-xl font-bold">Introduction</h2>
          <p className={`text-sm leading-relaxed ${textClass}`}>
            Welcome to our developer platform. Your privacy is important to us. This policy outlines how we collect, use, and protect your data.
          </p>
        </motion.section>

        <hr className="border-t my-4" />

        <section className="space-y-3">
          <h2 className="text-xl font-bold">Information We Collect</h2>
          <p className={`text-sm leading-relaxed ${textClass}`}>
            We collect data you provide (like email, uploaded templates) and usage information (such as page visits and tool usage).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">How We Use Your Information</h2>
          <p className={`text-sm leading-relaxed ${textClass}`}>
            Your data helps us improve our platform, personalize your experience, and communicate with you regarding updates and support.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">Sharing and Disclosure</h2>
          <p className={`text-sm leading-relaxed ${textClass}`}>
            We never sell your data. We may share it with trusted services to operate and enhance our platform.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">Cookies and Tracking Technologies</h2>
          <p className={`text-sm leading-relaxed ${textClass}`}>
            We use cookies to analyze traffic and personalize content. You can manage cookie preferences through your browser settings.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">Data Security</h2>
          <p className={`text-sm leading-relaxed ${textClass}`}>
            We implement industry-standard security measures to safeguard your data against unauthorized access.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">User Rights & Choices</h2>
          <p className={`text-sm leading-relaxed ${textClass}`}>
            You can request to view, edit, or delete your data. Contact us at <a className="text-blue-500 underline" href="mailto:support@yourdevplatform.com">support@yourdevplatform.com</a>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">Contact Us</h2>
          <p className={`text-sm leading-relaxed ${textClass}`}>
            For questions about this policy, reach out at <a className="text-blue-500 underline" href="mailto:support@yourdevplatform.com">support@yourdevplatform.com</a>.
          </p>
        </section>
      </div>
    </div>
    </>
  );
};

export default PrivacyPolicy;