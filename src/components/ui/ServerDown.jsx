"use client";

import React from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Mail, Linkedin } from "lucide-react";
import Image from "next/image";

const ServerDownPage = () => {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  return (
    <div
      className={`relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden transition-colors duration-500 ${
        isDarkMode ? "bg-black text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* Gradient Glow Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-pulse" />
      <div className="absolute -top-20 left-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-spin-slow" />

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className={`relative z-10 p-8 rounded-2xl border backdrop-blur-xl max-w-lg w-full shadow-lg ${
          isDarkMode
            ? "border-purple-500/30 bg-black/40"
            : "bg-white/70 border-gray-200"
        }`}
      >
        {/* GIF */}
        <div className="w-full flex justify-center mb-6">
          <Image
            src="/favicon.png"
            alt="Server Down"
            width={240}
            height={240}
            className="rounded-xl shadow-md"
          />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-400">
          Server Temporarily Down 
        </h1>

        {/* Message */}
        <p className="mb-6 opacity-80 text-lg leading-relaxed">
          Our server seems to be taking a short nap.  
          Please check back later or contact us below.
        </p>

        {/* Contact Buttons */}
        <div className="flex justify-center gap-4">
          {/* Email Button */}
          <a
            href="mailto:support@deepakprasad.xyz"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-[0_0_20px_rgba(99,102,241,0.6)] transition"
          >
            <Mail size={18} />
            Email Support
          </a>

          {/* LinkedIn */}
          <a
            href="https://linkedin.com/in/dynamicphillic"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold border border-blue-500 text-blue-500 hover:bg-blue-600 hover:text-white transition"
          >
            <Linkedin size={18} />
            LinkedIn
          </a>
        </div>
      </motion.div>

      {/* Footer */}
      <p
        className={`relative z-10 mt-8 text-sm ${
          isDarkMode ? "text-gray-400" : "text-gray-600"
        }`}
      >
        © {new Date().getFullYear()} Deepak Prasad. All rights reserved.
      </p>
    </div>
  );
};

export default ServerDownPage;
