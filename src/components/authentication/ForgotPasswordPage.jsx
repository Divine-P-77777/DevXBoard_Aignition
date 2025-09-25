'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useSelector } from 'react-redux';
import clsx from 'clsx';

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState(null);

  const { forgotPassword } = useAuth();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setMessage(null);
    try {
      await forgotPassword(data.email);
      setMessage('✅ Password reset instructions sent!');
      reset();
      setTimeout(() => {
        setIsOpen(false);
      }, 1500);
    } catch (err) {
      setMessage('❌ ' + (err.message || 'Something went wrong.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          'text-sm px-4 py-1 rounded-full transition-all',
          isDarkMode
            ? 'text-purple-200 bg-purple-900 hover:bg-purple-800'
            : 'text-purple-800 bg-purple-100 hover:bg-purple-200'
        )}
      >
        Forgot password?
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className={clsx(
              'mt-3 p-4 rounded-xl border shadow-md',
              isDarkMode
                ? 'bg-black border-purple-700 text-white'
                : 'bg-white border-purple-300 text-black'
            )}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              {/* Email Field */}
              <div>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email',
                    },
                  })}
                  className={clsx(
                    'w-full px-3 py-2 rounded-md text-sm outline-none transition-all',
                    isDarkMode
                      ? 'bg-black border border-purple-600 text-white placeholder-purple-200 focus:ring focus:ring-pink-500'
                      : 'bg-white border border-purple-300 text-black placeholder-gray-500 focus:ring focus:ring-pink-400'
                  )}
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    reset();
                  }}
                  className={clsx(
                    'text-xs px-3 py-1 rounded-md transition-all',
                    isDarkMode
                      ? 'bg-gray-800 text-white hover:bg-gray-700'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  )}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className={clsx(
                    'text-xs px-3 py-1 rounded-md font-medium transition-all',
                    isDarkMode
                      ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:brightness-110'
                      : 'bg-gradient-to-r from-purple-400 to-pink-400 text-white hover:brightness-105'
                  )}
                >
                  {loading ? 'Sending...' : 'Send'}
                </button>
              </div>

              {/* Message */}
              {message && (
                <p className="text-xs text-center mt-1">
                  {message}
                </p>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
