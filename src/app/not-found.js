'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useSelector } from "react-redux";
import { motion } from 'framer-motion';

export default function NotFoundPage() {
  const router = useRouter();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  return (
    <div
      className={`min-h-screen py-10  flex flex-col items-center justify-center text-center transition-colors duration-300 ${
        isDarkMode
          ? 'bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white'
          : 'bg-gradient-to-br from-pink-50 via-white to-purple-100 text-gray-900'
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md flex flex-col items-center justify-center"
      >
        {/* Lottie Animation */}
        <div className="w-80 h-80 mb-6">
          <DotLottieReact
            src="https://lottie.host/b8cd8aee-a336-46ad-8926-ac586cd601e1/VTxVUspjQG.lottie"
            loop
            autoplay
          />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold mb-2">
          Oops! Page Not Found
        </h1>
        <p
          className={`text-base mb-6 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          The page you’re looking for doesn’t exist or was moved.
        </p>

        {/* Back Button */}
        <button
          onClick={() => router.push('/')}
          className={`px-5 py-2 rounded-lg font-semibold transition-all ${
            isDarkMode
              ? 'bg-gradient-to-r from-purple-700 to-pink-700 text-white hover:brightness-110'
              : 'bg-gradient-to-r from-purple-400 to-pink-400 text-white hover:brightness-105'
          }`}
        >
          Go Back Home
        </button>
      </motion.div>
    </div>
  );
}
