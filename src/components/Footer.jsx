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

  // Purple → Light Pink Gradient Background
  const bgClass = isDark
    ? "bg-gradient-to-tr from-purple-700 via-black to-purple-900 text-white border-t border-purple-700"
    : "bg-gradient-to-tr from-purple-200 via-pink-100 to-pink-200 text-black border-t border-purple-300";

  const linkHoverClass = "hover:text-purple-600 transition";

  return (
    <footer className={`px-6 py-12 md:px-16 ${bgClass}`}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* About Section */}
        <div>
          <h2 className="text-xl font-semibold mb-2 text-purple-700">
            About DevXBoard
          </h2>
          <p className="text-sm leading-relaxed ">
            DevXBoard empowers developers to explore, share, and build using templates, AI tools, and collaborative features.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-xl font-semibold mb-2 text-purple-700">
            Quick Links
          </h2>
          <ul className="space-y-2 text-sm ">
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
            <li>
              <Link href="/install" className={linkHoverClass}>
                Install Our App
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Icons */}
        <div>
          <h2 className="text-xl font-semibold mb-2 text-purple-700">
            Connect with Us
          </h2>
          <div className="flex gap-4 mt-2">
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
      <div className="mt-8 text-center text-xs ">
        © {currentYear} DevXBoard. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
