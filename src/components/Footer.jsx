"use client";

import React from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  Github,
  Linkedin,
  Mail,
  Instagram,
} from 'lucide-react';

const Footer = () => {
  const isDark = useSelector((state) => state.theme.isDarkMode);
  const currentYear = new Date().getFullYear();

  const iconVariants = {
    hover: { scale: 1.2, transition: { type: 'spring', stiffness: 300 } },
  };

  const bgStyle = isDark
    ? 'bg-gradient-to-tr from-zinc-800 to-black text-white border-t border-zinc-700'
    : 'bg-gradient-to-tr from-white to-zinc-100 text-black border-t border-zinc-200';

  return (
    <footer className={` px-6 py-12 md:px-16 ${bgStyle}`}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* About Section */}
        <div>
          <h2 className="text-xl font-semibold mb-2">About DevXBoard</h2>
          <p className="text-sm leading-relaxed">
            DevXBoard is a platform empowering developers to share, explore, and build using code templates, community support, and smart tools.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Quick Links</h2>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-cyan-500 transition">Home</Link></li>
            <li><Link href="/template" className="hover:text-cyan-500 transition">Template Store</Link></li>
            <li><Link href="/contactus" className="hover:text-cyan-500 transition">Contact Us</Link></li>
            <li><Link href="/aboutus" className="hover:text-cyan-500 transition">About</Link></li>
            <li><Link href="/privacy" className="hover:text-cyan-500 transition">Privacy Policy</Link></li>
          </ul>
        </div>


        <div>
          <h2 className="text-xl font-semibold mb-2">Connect with Us</h2>
          <div className="flex gap-4 mt-2">
            <motion.a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover="hover"
              variants={iconVariants}
              className="hover:text-cyan-500"
            >
              <Github size={20} />
            </motion.a>
            <motion.a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover="hover"
              variants={iconVariants}
              className="hover:text-cyan-500"
            >
              <Linkedin size={20} />
            </motion.a>
            <motion.a
              href="mailto:support@devxboard.com"
              whileHover="hover"
              variants={iconVariants}
              className="hover:text-cyan-500"
            >
              <Mail size={20} />
            </motion.a>
            <motion.a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover="hover"
              variants={iconVariants}
              className="hover:text-cyan-500"
            >
              <Instagram size={20} />
            </motion.a>
          </div>
        </div>
      </div>


      <div className="mt-8 text-center text-xs opacity-70">
        © {currentYear} DevXBoard. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
