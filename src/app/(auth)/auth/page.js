'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import dynamic from 'next/dynamic';
import { useSelector } from 'react-redux';
import clsx from 'clsx';

const LoginForm = dynamic(() => import('@/components/authentication/LoginForm'), { ssr: false });
const SignUpForm = dynamic(() => import('@/components/authentication/SignUpForm'), { ssr: false });

export default function AuthPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  const initialMode = searchParams.get('status') === 'signup' ? 'signup' : 'login';
  const [authMode, setAuthMode] = useState(initialMode);

  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleModeChange = (mode) => {
    setAuthMode(mode);
    const newUrl = `/auth?status=${mode}`;
    router.push(newUrl);
  };

  return (
    <div
      className={clsx(
        'min-h-screen flex flex-col justify-center items-center py-25 px-4 transition-all duration-300',
        isDarkMode ? 'bg-black text-white' : 'bg-white text-black'
      )}
    >
      <div
        className={clsx(
          'rounded-xl shadow-lg pt-20 p-6 w-full max-w-md transition-all duration-300 border',
          isDarkMode ? 'bg-black border-gray-700' : 'bg-white border-gray-200'
        )}
      >
        <img src="/favicon.png" className="w-14 h-14 mx-auto mb-4" alt="" />
        <h2
          className={clsx(
            'text-center text-2xl font-bold mb-4',
            isDarkMode ? 'text-purple-300' : 'text-purple-700'
          )}
        >
          {authMode === 'login' ? 'Login to DevXBoard' : 'Sign Up for DevXBoard'}
        </h2>

        {/* Mode Switch */}
        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={() => handleModeChange('login')}
            className={clsx(
              'px-4 py-2 rounded-md text-sm font-medium transition',
              authMode === 'login'
                ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-md'
                : isDarkMode
                ? 'bg-gray-800 text-purple-200'
                : 'bg-gray-200 text-gray-800'
            )}
          >
            Login
          </button>
          <button
            onClick={() => handleModeChange('signup')}
            className={clsx(
              'px-4 py-2 rounded-md text-sm font-medium transition',
              authMode === 'signup'
                ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-md'
                : isDarkMode
                ? 'bg-gray-800 text-purple-200'
                : 'bg-gray-200 text-gray-800'
            )}
          >
            Sign Up
          </button>
        </div>

        {/* Form Render */}
        <div>{authMode === 'login' ? <LoginForm /> : <SignUpForm />}</div>
      </div>
    </div>
  );
}
