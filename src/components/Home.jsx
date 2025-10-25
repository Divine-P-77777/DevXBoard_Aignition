
'use client';

import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Database, Code, Users, Settings } from 'lucide-react';
import Image from 'next/image';
import FAQ from '@/components/FAQ';
import Reviews from '@/components/Reviews';
import CommunitySection from './CommunitySection';

export default function Home() {
  const isDark = useSelector((state) => state.theme.isDarkMode);
  const router = useRouter();

  const features = [
    {
      title: 'Multi-card URL System',
      description: 'Create unlimited cards with private/public options, profile pics, and custom backgrounds.',
      icon: Database,
      color: 'text-blue-400',
    },
    {
      title: 'AI-Generated Metadata',
      description: 'Auto-generate titles, hashtags, and summaries for your URLs and code blogs using AI.',
      icon: Code,
      color: 'text-purple-400',
    },
    {
      title: 'Community Sharing',
      description: 'Discover public cards and templates shared by the community for inspiration.',
      icon: Users,
      color: 'text-pink-400',
    },
    {
      title: 'Full Customization',
      description: 'Customize backgrounds, avatars, and themes to make your cards truly yours.',
      icon: Settings,
      color: 'text-green-400',
    },
  ];

  const howItWorks = [
    {
      title: 'Create Cards',
      description: 'Set up multiple URL cards with profile pictures and backgrounds.',
      icon: Database,
      color: 'text-blue-400',
    },
    {
      title: 'Generate Metadata',
      description: 'AI helps generate titles, hashtags, and summaries automatically.',
      icon: Code,
      color: 'text-purple-400',
    },
    {
      title: 'Share & Explore',
      description: 'Make your cards public or explore community templates for inspiration.',
      icon: Users,
      color: 'text-pink-400',
    },
  ];

  return (
    <div className={`relative overflow-hidden min-h-screen ${isDark ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-pulse" />
      <div className="absolute top-1/3 left-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-spin-slow" />

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 py-24 flex flex-col-reverse md:flex-row items-center gap-12">
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
<h1
  className="font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-blue-400 to-pink-300 text-[clamp(2rem,5vw,4rem)] leading-tight"
  style={{
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  }}
>
  AI Copilot for Developers & Creators
</h1>

            <p className="text-base sm:text-lg md:text-xl mb-8 opacity-80 leading-relaxed max-w-xl">
              Build multiple cards, auto-generate metadata, share code, and explore public templates — all automated for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link
                href="/upload"
                className="px-6 py-3 text-center font-semibold rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-[0_0_20px_rgba(99,102,241,0.6)] transition w-full sm:w-auto"
              >
                Get Started Free
              </Link>
              <button
                onClick={() => router.push('/community')}
                className="px-6 py-3 font-semibold rounded-lg border border-blue-500 text-blue-500 hover:bg-blue-600 hover:text-white transition w-full sm:w-auto"
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
            <div className="relative rounded-3xl aspect-[3/4] w-full   shadow-xl overflow-hidden">
              <Image
                src="/home.png"
                alt="Home"
                fill
                className="rounded-3xl "
                priority
              />
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <h2 className="text-2xl sm:text-4xl font-bold text-center mb-12"><span className='text-purple-400'> Powerful</span> <span className='text-pink-400'>AI </span>Features</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, idx) => (
              <motion.div
                key={idx}
                className={`p-6 rounded-2xl backdrop-blur-lg border ${isDark ? 'border-purple-500/30 bg-black/50' : 'bg-white/70 border-gray-200'} shadow-lg hover:scale-105 hover:shadow-[0_0_25px_rgba(168,85,247,0.4)] transition`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
              >
                <f.icon size={40} className={`mb-4 ${f.color} animate-pulse`} />
                <h3 className="text-lg sm:text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-sm opacity-80">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section
          className="max-w-6xl  px-6 mx-9 sm:mx-auto py-20 rounded-2xl my-16 backdrop-blur-2xl border-[1px] border-purple-400  shadow-purple-400
"
          style={{
            background: isDark
              ? 'linear-gradient(135deg, #1a1a1a, #3c096c)'
              : 'linear-gradient(135deg, #e0f2ff, #f3e8ff)',
          }}
        >
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
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
                <step.icon size={42} className={`mx-auto mb-4 ${step.color} animate-pulse`} />
                <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-sm opacity-80">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Community Showcase */}
       <CommunitySection/>
        {/* CTA */}
        <section className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h2 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
            Your Privacy, Your Control
          </h2>
          <p className="mb-8 opacity-80 leading-relaxed max-w-2xl mx-auto">
            Keep some cards private, share others publicly — you control everything with ease.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              href="/upload"
              className="px-8 py-3 font-semibold rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-[0_0_20px_rgba(99,102,241,0.7)] transition"
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

        <Reviews isDark={isDark}  />
        <FAQ isDark={isDark}  />
      </main>
    </div>
  );
}
