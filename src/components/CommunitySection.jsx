'use client';

import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';


export const communityPosts = [
  {
    id: 1,
    title: "How to Use Lenis Smooth Scroll in React / Next.js",
    username: "Risan Kalita",
    blocks: 3,
    imageUrl: "https://media.licdn.com/dms/image/v2/D4D12AQHp7nN2hd1CDA/article-cover_image-shrink_720_1280/B4DZgszoilH4AM-/0/1753098390355?e=2147483647&v=beta&t=gZ3kRjwzxbXMOgVOHuiu6Sj1x1cTr8SU_WkonuIMl_4",
  },
  {
    id: 2,
    title: "Python Basics for JavaScript Developers",
    username: "Sneha Sah",
    blocks: 6,
    imageUrl: "https://isamatov.com/images/python-intro-for-javascript-developers/python-intro-for-javascript-developers.png",
  },
  {
    id: 3,
    title: "Auth0 Authentication in Next.js – Step by Step",
    username: "Mohan Das",
    blocks: 4,
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQL50Dv_RQSQ5CN5pVUTGE2jknBNxSIijhATQ&s",
  },
  {
    id: 4,
    title: "Cashfree Payment Gateway Implementation in Next.js",
    username: "Ankita Sharma",
    blocks: 5,
    imageUrl: "https://i0.wp.com/blogrevamp.cashfree.com/wp-content/uploads/2023/08/Payment-Gateway-APIs.png?fit=2500%2C1667&ssl=1",
  },
  {
    id: 5,
    title: "JavaScript Concepts – Closures, Promises & Async/Await",
    username: "Arjun Sen",
    blocks: 7,
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCvthO6-TlO9Ks0ALwpF_w-T-jCbP5hvSSfg&s",
  },
  {
    id: 6,
    title: "Next.js 14 – API Routes & Server Actions Explained",
    username: "Priya Dey",
    blocks: 5,
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5ssUYVsCu6HUi9wyU8bAKzidVtQTIvR8KVA&s",
  },
];

const CommunitySection = () => {
  const isDark = useSelector((state) => state.theme.isDarkMode);

  const cardGradient = isDark
    ? 'bg-gradient-to-br from-purple-700 to-black text-white'
    : 'bg-gradient-to-br from-pink-200 to-purple-400 text-black';

  return (
    <div className="mx-8 sm:mx-20  py-16">
      <h2 className="text-2xl sm:text-4xl font-bold text-center mb-12"> <span className='text-purple-400'>Community</span> Showcase</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {communityPosts.map((post, idx) => (
          <motion.div
            key={post.id}
            className={`p-5 rounded-xl shadow-md hover:shadow-lg transition hover:scale-105 ${cardGradient}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
          >
            <div className="relative h-40 rounded-md mb-4 overflow-hidden">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-cover rounded-md"
              />
            </div>

            <h3 className="font-semibold mb-1">{post.title}</h3>
            <p className="text-xs opacity-70 mb-2">By {post.username}</p>
            <div className="flex justify-between items-center">
              <span className="text-xs opacity-50">Blocks: {post.blocks}</span>
              <button className="px-3 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700 transition">
                View
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CommunitySection;
