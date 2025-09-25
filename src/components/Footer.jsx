"use client";

import React from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Instagram } from "lucide-react";

const Footer = () => {
  const isDark = useSelector((state) => state.theme.isDarkMode);
  const currentYear = new Date().getFullYear();

  const iconVariants = {
    hover: {
      scale: 1.2,
      transition: { type: "spring", stiffness: 300 },
    },
  };

  const bgClass = isDark
    ? "bg-gradient-to-tr from-zinc-900 to-black text-white border-t border-zinc-700"
    : "bg-gradient-to-tr from-white via-pink-50 to-purple-100 text-black border-t border-zinc-200";

  const linkHoverClass = "hover:text-pink-500 transition";

  return (
    <footer className={`px-6 py-12 md:px-16 ${bgClass}`}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* About Section */}
        <div>
          <h2 className="text-xl font-semibold mb-2 text-purple-500">
            About DevXBoard
          </h2>
          <p className="text-sm leading-relaxed text-gray-400">
            DevXBoard is a platform empowering developers to explore, share, and build using templates, smart tools, and collaborative features.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-xl font-semibold mb-2 text-purple-500">
            Quick Links
          </h2>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>
              <Link href="/" className={linkHoverClass}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/template" className={linkHoverClass}>
                Template Store
              </Link>
            </li>
            <li>
              <Link href="/contactus" className={linkHoverClass}>
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/aboutus" className={linkHoverClass}>
                About
              </Link>
            </li>
            <li>
              <Link href="/privacy" className={linkHoverClass}>
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/myprofile" className={linkHoverClass}>
                My Profile
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Icons */}
        <div>
          <h2 className="text-xl font-semibold mb-2 text-purple-500">
            Connect with Us
          </h2>
          <div className="flex gap-4 mt-2 text-gray-300">
            <motion.a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover="hover"
              variants={iconVariants}
              className={linkHoverClass}
            >
              <Github size={20} />
            </motion.a>
            <motion.a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover="hover"
              variants={iconVariants}
              className={linkHoverClass}
            >
              <Linkedin size={20} />
            </motion.a>
            <motion.a
              href="mailto:support@devxboard.com"
              whileHover="hover"
              variants={iconVariants}
              className={linkHoverClass}
            >
              <Mail size={20} />
            </motion.a>
            <motion.a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover="hover"
              variants={iconVariants}
              className={linkHoverClass}
            >
              <Instagram size={20} />
            </motion.a>
          </div>
        </div>
      </div>

      {/* Bottom Text */}
      <div className="mt-8 text-center text-xs text-gray-400">
        © {currentYear} DevXBoard. All rights reserved.
      </div>
    </footer>
  );
};



export default Footer;
