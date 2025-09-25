'use client';

import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import Navbar from '@/components/Navbar';

const ContactUs = () => {
  const isDark = useSelector((state) => state.theme.isDarkMode);
  const formRef = useRef();

  const [loading, setLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  const bgGradient = isDark
    ? 'bg-gradient-to-br from-black via-zinc-900 to-purple-900 text-white'
    : 'bg-gradient-to-br from-white via-pink-50 to-purple-100 text-gray-900';

  const cardBg = isDark ? 'bg-zinc-900 border border-zinc-700' : 'bg-white border border-gray-200';
  const inputColor = isDark ? 'bg-zinc-800 text-white border-zinc-600' : 'bg-white text-black border-gray-300';
  const accent = isDark ? 'focus:ring-pink-500' : 'focus:ring-purple-400';
  const btnColor = isDark ? 'bg-pink-500 hover:bg-pink-600' : 'bg-purple-600 hover:bg-purple-700';

  const sendEmail = (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedbackMsg(null);

    emailjs
      .sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        formRef.current,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
      )
      .then(
        () => {
          setLoading(false);
          setFeedbackMsg({ type: 'success', text: '✅ Your message has been sent successfully.' });
          formRef.current.reset();
        },
        () => {
          setLoading(false);
          setFeedbackMsg({ type: 'error', text: '❌ Failed to send. Please try again.' });
        }
      );
  };

  return (
    <>
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`${bgGradient} min-h-screen py-24 px-6 flex flex-col items-center`}
      >
        {/* Header */}
        <section className="max-w-3xl text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch with DevXBoard</h1>
          <p className="text-lg opacity-80">
            Whether you have feedback, a bug to report, or just want to say hello — we’d love to hear from you!
          </p>
        </section>

        {/* Contact Form */}
        <section className={`w-full max-w-xl rounded-2xl shadow-lg p-8 ${cardBg}`}>
          <form ref={formRef} onSubmit={sendEmail} className="space-y-6">
            {[
              { label: 'Name', id: 'name', name: 'user_name', type: 'text', placeholder: 'Your full name' },
              { label: 'Email', id: 'email', name: 'user_email', type: 'email', placeholder: 'your@email.com' },
              { label: 'Subject', id: 'subject', name: 'subject', type: 'text', placeholder: 'Your message subject' },
            ].map(({ label, id, name, type, placeholder }) => (
              <div key={id}>
                <label htmlFor={id} className="block mb-1 font-semibold text-sm">
                  {label}<span className="text-pink-500">*</span>
                </label>
                <input
                  id={id}
                  name={name}
                  type={type}
                  required
                  placeholder={placeholder}
                  className={`w-full px-4 py-2 rounded-md border ${inputColor} ${accent} focus:outline-none focus:ring-2`}
                />
              </div>
            ))}

            <div>
              <label htmlFor="message" className="block mb-1 font-semibold text-sm">
                Message<span className="text-pink-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                placeholder="Tell us what’s on your mind..."
                className={`w-full px-4 py-2 rounded-md border ${inputColor} ${accent} focus:outline-none focus:ring-2 resize-none`}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`${btnColor} w-full text-white font-medium py-3 rounded-full transition disabled:opacity-50`}
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>

          {feedbackMsg && (
            <p
              className={`mt-4 text-center text-sm font-medium ${
                feedbackMsg.type === 'success' ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {feedbackMsg.text}
            </p>
          )}
        </section>

        {/* Alternative Contact */}
        <div className="mt-10 text-center space-y-2 text-sm">
          <p>
            Prefer another channel? Email us at{' '}
            <a href="mailto:support@devxboard.com" className="underline text-pink-400 hover:text-pink-500">
              support@devxboard.com
            </a>
          </p>
          <div className="flex justify-center gap-5 mt-2 text-pink-400 font-medium">
            <a href="https://discord.gg/devxboard" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500">
              Discord
            </a>
            <a href="https://github.com/devxboard" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500">
              GitHub
            </a>
            <a href="https://twitter.com/devxboard" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500">
              Twitter
            </a>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default ContactUs;
