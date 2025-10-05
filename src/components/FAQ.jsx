'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqData = [
  { question: "Can I make my cards private?", answer: "Yes! Every card has a privacy toggle. You can keep it private or make it public anytime." },
  { question: "Does the AI generate code summaries?", answer: "Absolutely. Our AI suggests titles, summaries, hashtags, and even cleans or corrects your code automatically." },
  { question: "Can I customize card backgrounds?", answer: "Definitely. Each card supports unique backgrounds, avatars, and styles so you can make it truly yours." },
  { question: "Can I contribute to the community?", answer: "Yes! Simply create an account and upload your own templates. Your contributions help other developers and creators." },
  { question: "Can I share code as a template blog with my friends?", answer: "Of course. Just make your template public before uploading — then share the link with anyone." },
  { question: "Can I keep a private URL for my cards and template blogs?", answer: "Yes. We allow private URLs for cards and templates so only you or selected people can access them." },
  { question: "Is the platform only for developers?", answer: "Not at all. While it’s built for developers, anyone can use it to create portfolios, showcase projects, or share content using our URL-sharing feature." },
];

export default function FAQ({ isDark }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="text-4xl font-bold text-center mb-12">
         FAQs
      </h2>
      <div className="space-y-6">
        {faqData.map((faq, idx) => (
          <motion.div
            key={idx}
            className={`relative p-[2px] rounded-2xl 
              bg-gradient-to-r from-purple-500 via-pink-500 to-purple-700 shadow-lg`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
          >
            {/* Inner Card */}
            <div
              onClick={() => toggleFAQ(idx)}
              className={`p-6 rounded-2xl cursor-pointer flex flex-col 
                ${isDark ? 'bg-gray-950 text-white' : 'bg-white text-black'}`}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">{faq.question}</h3>
                {openIndex === idx ? (
                  <Minus className="w-5 h-5 text-purple-500" />
                ) : (
                  <Plus className="w-5 h-5 text-purple-500" />
                )}
              </div>
              {/* Answer */}
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={
                  openIndex === idx
                    ? { height: 'auto', opacity: 1 }
                    : { height: 0, opacity: 0 }
                }
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <p className="text-sm opacity-80 mt-4">{faq.answer}</p>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
