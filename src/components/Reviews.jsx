'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const reviewsData = [
  { user: "Sneha Sah", rating: 5, comment: "Amazing AI features! Saved me hours of work." },
  { user: "Rishab Kalita", rating: 4, comment: "Very intuitive UI and customizable cards." },
  { user: "Mohan Das", rating: 5, comment: "The community templates are super helpful!" },
];

export default function Reviews({ isDark }) {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <h2 className="text-4xl font-bold text-center mb-12">
        Reviews
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {reviewsData.map((review, idx) => (
          <motion.div
            key={idx}
            className={`relative p-[2px] rounded-2xl 
              bg-gradient-to-r from-purple-500 via-pink-500 to-purple-700 
              shadow-lg hover:shadow-purple-500/40 transition`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
          >
            {/* Inner Card */}
            <div
              className={`p-6 rounded-2xl h-full 
                ${isDark ? 'bg-gray-950 text-white' : 'bg-white text-black'}`}
            >
              {/* Stars */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-purple-500 fill-purple-500"
                  />
                ))}
              </div>

              {/* Comment */}
              <p className="text-sm opacity-80 mb-4">{review.comment}</p>
              <p className="font-semibold text-xs">{review.user}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
