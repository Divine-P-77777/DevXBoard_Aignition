'use client';

import { useEffect, useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import dynamic from 'next/dynamic';

const LoginForm = dynamic(() => import('@/components/authentication/LoginForm'), { ssr: false });
const SignUpForm = dynamic(() => import('@/components/authentication/SignUpForm'), { ssr: false });

export default function AuthPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

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
    <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-white">
      <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-md">
        <h2 className="text-center text-2xl font-bold mb-4">
          {authMode === 'login' ? 'Login to Your App Name' : 'Sign Up for Your App Name'}
        </h2>

        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={() => handleModeChange('login')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${authMode === 'login' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
          >
            Login
          </button>
          <button
            onClick={() => handleModeChange('signup')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${authMode === 'signup' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
          >
            Sign Up
          </button>
        </div>

        {/* Login or Signup Form */}
        <div>
          {authMode === 'login' ? (
            <>
              <LoginForm />


            </>
          ) : (
            <SignUpForm />
          )}
        </div>
      </div>
    </div>
  );
}
