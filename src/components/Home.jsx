'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import supabase from '@/libs/supabase/client';

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
];

export default function HomePage() {
  const isDark = useSelector((state) => state.theme.isDarkMode);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Try to get profile data
        const { data: profileData } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single();

        if (profileData?.username) {
          setUserName(profileData.username);
        } else {
          // Fallback to auth user email name
          setUserName(user.user_metadata?.full_name || user.email.split('@')[0]);
        }
      }
    };

    fetchUser();
  }, []);

  return (
    <div
      className={`min-h-screen transition-colors ${
        isDark ? 'bg-black text-pink-100' : 'bg-gradient-to-br from-purple-100 via-pink-50 to-white text-gray-800'
      }`}
    >
      {/* Hero Section */}
      <motion.section
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="max-w-5xl mx-auto px-6 py-24 text-center"
      >
        <h1
          className={`text-5xl font-extrabold tracking-tight leading-tight mb-4 ${
            isDark ? 'text-white' : 'text-purple-800'
          }`}
        >
          👋 Hey {userName || 'Developer'}!
        </h1>
        <p className="text-xl font-medium mb-8">
          Upload templates. Share tools. Build faster with AI.
        </p>
        <Link
          href="/upload"
          className="inline-block px-6 py-3 rounded-lg text-lg font-semibold transition-transform hover:scale-105 shadow-lg bg-gradient-to-r from-purple-600 to-pink-500 text-white"
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
              className={`p-6 rounded-xl shadow-md hover:shadow-pink-300 transition hover:scale-105 ${
                isDark ? 'bg-gradient-to-br from-purple-900 to-black border border-pink-500 text-white' : 'bg-white border border-pink-300'
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-bold mb-2">{f.title}</h3>
              <p className="text-sm leading-relaxed opacity-80">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
