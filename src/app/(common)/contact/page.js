'use client';

import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import emailjs from '@emailjs/browser';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';

const ContactUs = () => {
  const isDark = useSelector((state) => state.theme.isDarkMode);
  const formRef = useRef();

  const [loading, setLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState(null); // { type: 'success' | 'error', text: string }

  const containerBg = isDark ? 'bg-slate-900 text-gray-100' : 'bg-gray-50 text-gray-900';
  const formBg = isDark ? 'bg-slate-800 border border-slate-600' : 'bg-white border border-gray-200';
  const btnBg = isDark ? 'bg-cyan-500 hover:bg-cyan-600' : 'bg-blue-600 hover:bg-blue-700';
  const inputTextColor = isDark ? 'text-gray-100' : 'text-gray-900';

  const fadeSlideIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

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
          setFeedbackMsg({ type: 'success', text: 'Thank you! Your message has been sent.' });
          formRef.current.reset();
        },
        (error) => {
          setLoading(false);
          setFeedbackMsg({ type: 'error', text: 'Oops! Something went wrong. Please try again.' });
          console.error('EmailJS error:', error);
        }
      );
  };

  return (
    <>
    <Navbar/>
    <motion.div
      className={`${containerBg} min-h-screen flex flex-col items-center py-16 px-6`}
      initial="hidden"
      animate="visible"
      variants={fadeSlideIn}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Hero Section */}
      <section className="pt-20 max-w-3xl text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">We’d Love to Hear From You</h1>
        <p className="text-lg max-w-xl mx-auto">
          Questions, feedback, or a bug to report? Reach out and we’ll get back to you shortly.
        </p>
      </section>

      {/* Contact Form */}
      <section className={`w-full max-w-lg rounded-xl shadow-lg p-6 ${formBg}`}>
        <form ref={formRef} onSubmit={sendEmail} className="space-y-6">
          <div>
            <label htmlFor="name" className="block mb-1 font-semibold">
              Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="user_name"
              required
              placeholder="Your full name"
              className={`w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${inputTextColor} bg-transparent`}
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-1 font-semibold">
              Email<span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="user_email"
              required
              placeholder="your.email@example.com"
              className={`w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${inputTextColor} bg-transparent`}
            />
          </div>

          <div>
            <label htmlFor="subject" className="block mb-1 font-semibold">
              Subject<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              required
              placeholder="Brief summary of your message"
              className={`w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${inputTextColor} bg-transparent`}
            />
          </div>

          <div>
            <label htmlFor="message" className="block mb-1 font-semibold">
              Message<span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows="5"
              placeholder="Write your message here..."
              className={`w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${inputTextColor} bg-transparent resize-none`}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`${btnBg} text-white font-semibold px-6 py-3 rounded-full w-full flex justify-center items-center gap-2 transition-colors disabled:opacity-60`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Sending...
              </>
            ) : (
              'Send Message'
            )}
          </button>
        </form>

        {/* Feedback Message */}
        {feedbackMsg && (
          <p
            className={`mt-4 text-center font-semibold ${
              feedbackMsg.type === 'success' ? 'text-green-500' : 'text-red-500'
            }`}
            role="alert"
          >
            {feedbackMsg.text}
          </p>
        )}
      </section>

      {/* Alternative Contact Info */}
      <section className="mt-12 max-w-lg text-center space-y-3">
        <p>
          Or reach us directly at{' '}
          <a
            href="mailto:support@yourdevplatform.com"
            className="underline text-cyan-500 hover:text-cyan-700"
          >
            support@yourdevplatform.com
          </a>
        </p>
        <div className="flex justify-center gap-6 text-cyan-500">
          <a href="https://discord.gg/yourserver" target="_blank" rel="noopener noreferrer" aria-label="Discord" className="hover:text-cyan-700">
            Discord
          </a>
          <a href="https://github.com/yourdevplatform" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-cyan-700">
            GitHub
          </a>
          <a href="https://twitter.com/yourdevplatform" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-cyan-700">
            Twitter
          </a>
        </div>
      </section>
    </motion.div>
    </>
  );
};

export default ContactUs;