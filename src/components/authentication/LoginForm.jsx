'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import supabase from '@/libs/supabase/client';
import { useSelector } from 'react-redux';

const ForgotPasswordForm = dynamic(
  () => import('@/components/authentication/ForgotPasswordPage'),
  { ssr: false }
);

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const router = useRouter();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        alert('Login failed: ' + error.message);
      } else {
        alert('Login successful!');
        router.push('/myprofile');
      }
    } catch (err) {
      alert('Login Failed');
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (!error) router.push('/myprofile');
    else alert('Google Sign-in failed: ' + error.message);
  };

  return (
    <>
      {/* Loader Overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className={clsx(
          'space-y-6 max-w-md mx-auto mt-10 p-6 rounded-xl shadow-lg border',
          isDarkMode
            ? 'bg-black border-slate-700 text-gray-200'
            : 'bg-white border-gray-200 text-gray-900'
        )}
      >
        {/* Email */}
        <div className="space-y-2">
          <label
            htmlFor="email"
            className={clsx('text-sm font-medium', isDarkMode ? 'text-pink-200' : 'text-purple-700')}
          >
            Email
          </label>
          <div className="relative">
            <Mail className={clsx('absolute left-3 top-3 h-4 w-4', isDarkMode ? 'text-pink-400' : 'text-gray-400')} />
            <input
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              id="email"
              type="email"
              placeholder="Enter your email"
              className={clsx(
                'w-full pl-10 pr-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all',
                isDarkMode
                  ? 'bg-black border-pink-700 text-white placeholder-pink-200 focus:ring-purple-500'
                  : 'bg-white border-purple-300 text-gray-900 placeholder-gray-400 focus:ring-purple-400'
              )}
            />
          </div>
          {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label
            htmlFor="password"
            className={clsx('text-sm font-medium', isDarkMode ? 'text-pink-200' : 'text-purple-700')}
          >
            Password
          </label>
          <div className="relative">
            <Lock className={clsx('absolute left-3 top-3 h-4 w-4', isDarkMode ? 'text-pink-400' : 'text-gray-400')} />
            <input
              {...register('password', { required: 'Password is required' })}
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              className={clsx(
                'w-full pl-10 pr-10 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all',
                isDarkMode
                  ? 'bg-black border-pink-700 text-white placeholder-pink-200 focus:ring-purple-500'
                  : 'bg-white border-purple-300 text-gray-900 placeholder-gray-400 focus:ring-purple-400'
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-500"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={clsx(
            'w-full flex items-center justify-center gap-2 font-medium rounded-lg text-sm px-5 py-2.5 transition shadow',
            'bg-gradient-to-r from-purple-500 via-pink-500 to-pink-600 text-white',
            'hover:bg-gradient-to-br focus:ring-4 focus:outline-none',
            isDarkMode ? 'focus:ring-pink-800' : 'focus:ring-pink-300',
            loading && 'opacity-70 cursor-not-allowed'
          )}
        >
          {loading && <Loader2 className="animate-spin h-4 w-4" />}
          Login
        </button>

        {/* OR Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className={clsx('px-2 rounded-3xl', isDarkMode ? 'bg-black text-pink-200' : 'bg-white text-gray-500')}>
              Or continue with
            </span>
          </div>
        </div>

        {/* Google Sign In */}
        <button
          type="button"
          onClick={signInWithGoogle}
          disabled={loading}
          className={clsx(
            'w-full flex items-center justify-center gap-2 border px-4 py-2 rounded-2xl',
            isDarkMode
              ? 'border-pink-700 text-white hover:bg-pink-900/20'
              : 'border-gray-300 text-black hover:bg-gray-100'
          )}
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="h-5 w-5"
          />
          <span className="text-sm font-medium">Continue with Google</span>
        </button>
      </form>

      {/* Forgot Password */}
      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={() => setShowForgot((prev) => !prev)}
          className={clsx(
            'text-sm hover:underline',
            isDarkMode ? 'text-pink-400' : 'text-blue-600'
          )}
        >
          {showForgot ? 'Hide' : 'Forgot password?'}
        </button>

        {showForgot && (
          <div className="mt-4">
            <ForgotPasswordForm />
          </div>
        )}
      </div>
    </>
  );
}
