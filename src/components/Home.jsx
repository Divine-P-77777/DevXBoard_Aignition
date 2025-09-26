'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import { Database, Code, Users, Settings } from 'lucide-react';
// import your Lottie JSONs here
// import heroAnimation from '@/public/lottie/hero.json';

export default function Home() {
  const isDark = useSelector((state) => state.theme.isDarkMode);
  const router = useRouter();

  const features = [
    {
      title: 'Multi-card URL System',
      description: 'Create unlimited cards of URLs with private/public options, profile pics, and custom backgrounds.',
      icon: Database,
      color: 'text-blue-500',
    },
    {
      title: 'AI-Generated Metadata',
      description: 'Auto-generate titles, hashtags, and summaries for your URLs and code blogs using AI.',
      icon: Code,
      color: 'text-purple-500',
    },
    {
      title: 'Community Sharing',
      description: 'Discover public cards and templates shared by the community to get inspired.',
      icon: Users,
      color: 'text-pink-500',
    },
    {
      title: 'Full Customization',
      description: 'Customize backgrounds, avatars, and themes to make your cards truly yours.',
      icon: Settings,
      color: 'text-green-500',
    },
  ];

  const howItWorks = [
    {
      title: 'Create Cards',
      description: 'Set up multiple URL cards with profile pictures and backgrounds.',
      icon: Database,
      color: 'text-blue-500',
    },
    {
      title: 'Generate Metadata',
      description: 'AI helps generate titles, hashtags, and summaries automatically.',
      icon: Code,
      color: 'text-purple-500',
    },
    {
      title: 'Share & Explore',
      description: 'Make your cards public or explore community templates for inspiration.',
      icon: Users,
      color: 'text-pink-500',
    },
  ];

  return (
    <div className={`${isDark ? 'bg-black text-white' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-white text-gray-900'}`}>

      {/* Section 1: Hero */}
      <section className="max-w-7xl mx-auto px-6 py-32 flex flex-col-reverse md:flex-row items-center gap-10">
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className={`text-5xl md:text-6xl font-extrabold mb-6 ${isDark ? 'text-white' : 'text-blue-900'}`}>
            AI Copilot for Developers & Creators
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-80 leading-relaxed">
            Build multiple personal cards, auto-generate metadata, share code, and explore public templates — all in one platform.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link 
              href="/upload"
              className="px-6 py-3 font-semibold rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 transition-transform shadow-lg"
            >
              Get Started Free
            </Link>
            <button
              onClick={() => router.push('/community')}
              className="px-6 py-3 font-semibold rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition"
            >
              Explore Community
            </button>
          </div>
        </motion.div>

        <motion.div
          className="flex-1 w-full max-w-lg"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Lottie Placeholder */}
          {/* <Lottie animationData={heroAnimation} loop={true} /> */}
          <div className="w-full h-80 bg-gray-200 dark:bg-gray-800 rounded-xl flex items-center justify-center text-gray-400">
            Dashboard / Lottie Animation
          </div>
        </motion.div>
      </section>

      {/* Section 2: Features */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">Powerful Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, idx) => (
            <motion.div
              key={idx}
              className={`p-6 rounded-xl shadow-md hover:shadow-lg transition hover:scale-105 ${isDark ? 'bg-gradient-to-br from-purple-900 to-black border border-pink-500' : 'bg-white border border-gray-200'}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
            >
              <f.icon size={32} className={`mb-4 ${f.color}`} />
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-sm opacity-80">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Section 3: How It Works */}
      <section className="max-w-5xl mx-auto px-6 py-20 rounded-xl my-16" style={{ background: isDark ? 'linear-gradient(135deg, #1a1a1a, #3c096c)' : 'linear-gradient(135deg, #e0f2ff, #f3e8ff)' }}>
        <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {howItWorks.map((step, idx) => (
            <motion.div
              key={idx}
              className="p-6 rounded-xl shadow-md text-center hover:scale-105 transition"
              style={{ backgroundColor: isDark ? '#111' : '#fff' }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
            >
              <step.icon size={40} className={`mx-auto mb-4 ${step.color}`} />
              <h3 className="font-bold mb-2">{step.title}</h3>
              <p className="text-sm opacity-80">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Section 4: Community Showcase */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">Community Showcase</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, idx) => (
            <motion.div
              key={idx}
              className={`p-5 rounded-xl shadow-md hover:shadow-lg transition hover:scale-105 ${isDark ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
            >
              <div className="h-40 bg-gray-300 dark:bg-gray-700 rounded-md mb-4 flex items-center justify-center">
                Template Preview
              </div>
              <h3 className="font-semibold mb-1">Template Title</h3>
              <p className="text-xs opacity-70 mb-2">By Username</p>
              <div className="flex justify-between items-center">
                <span className="text-xs opacity-50">Blocks: 5</span>
                <button className="px-3 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700 transition">View</button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Section 5: CTA / Privacy */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl font-bold mb-6">Your Privacy, Your Control</h2>
        <p className="mb-8 opacity-80 leading-relaxed">
          Keep some cards private, share others publicly — you control everything with ease.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link 
            href="/upload"
            className="px-8 py-3 font-semibold rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 transition-transform shadow-lg"
          >
            Start Creating
          </Link>
          <Link
            href="/community"
            className="px-8 py-3 font-semibold rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition"
          >
            Explore Community
          </Link>
        </div>
      </section>

    </div>
  );
}
