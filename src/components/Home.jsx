
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const features = [
  {
    title: 'Reusable Templates',
    description: 'Upload public or private code templates and speed up your workflow.',
    icon: '📦'
  },
  {
    title: 'Dev Tools Directory',
    description: 'Organize and share your favorite dev tools and URLs in one place.',
    icon: '🧰'
  },
  {
    title: 'GPT-Boosted Metadata',
    description: 'Auto-generate smart titles and tags for your templates using AI.',
    icon: '🤖'
  }
]

export default function HomePage() {
  const isDark = useSelector((state) => state.theme.isDarkMode)

  return (
<>
    <div className={`min-h-screen transition-colors ${
      isDark ? 'bg-[#0F172A] text-gray-300' : 'bg-[#F9FAFB] text-gray-800'
    }`}>
      
      {/* Hero Section */}
      <motion.section
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="max-w-5xl mx-auto px-6 py-24 text-center"
      >
        <h1 className={`text-5xl font-extrabold tracking-tight leading-tight mb-4 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          👋 Welcome, Developer!
        </h1>
        <p className="text-xl font-medium mb-8">
          Upload templates. Share tools. Build faster with AI.
        </p>
        <Link
          href="/upload"
          className={`inline-block px-6 py-3 rounded-lg text-lg font-semibold transition-transform hover:scale-105 shadow-md ${
            isDark ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-gradient-to-r from-indigo-500 to-sky-500 text-white'
          }`}
        >
          🚀 Upload Now
        </Link>
      </motion.section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className={`p-6 rounded-xl shadow-lg transform transition-transform hover:scale-[1.02] ${
                isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              layout
            >
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-sm leading-relaxed opacity-80">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trending Templates (future grid) */}
      {/* <motion.section> ... </motion.section> */}
    </div>
    </>
  )
}
