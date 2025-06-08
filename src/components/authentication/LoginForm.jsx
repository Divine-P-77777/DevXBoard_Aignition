'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import supabase from '@/libs/supabase/client';

const ForgotPasswordForm = dynamic(() => import('@/components/authentication/ForgotPasswordPage'), {
  ssr: false,
});

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const router = useRouter();

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
    if (error) alert('Google Sign-in failed: ' + error.message);
  };

  return (
    <>
    <div  className='space-y-6 max-w-md mx-auto p-6 border rounded-md shadow-md bg-white'>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className=""
      >
        <div className="space-y-1">
          <label htmlFor="email" className="block text-sm font-medium">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 text-black"
            />
          </div>
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="block text-sm font-medium">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              {...register('password', { required: 'Password is required' })}
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="Enter your password"
              className="w-full pl-10 pr-10 py-2 border rounded focus:outline-none focus:ring-2 text-black"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 px-4 py-2 bg-blue-500 text-black rounded hover:bg-blue-600 transition"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Login
        </button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white rounded-3xl px-2 text-gray-500">Or continue with</span>
          </div>
        </div>

        <button
          type="button"
          onClick={signInWithGoogle}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 border px-4 py-2 rounded-2xl"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="h-5 w-5"
          />
          <span className="text-sm font-medium">Continue with Google</span>
        </button>

       
      </form>

 <div className="mt-4 text-center">
          <div
            type="button"
            onClick={() => setShowForgot((prev) => !prev)}
            className="text-sm text-blue-600 hover:underline"
          >
             <ForgotPasswordForm />
          </div>
        </div>
</div>
    
       
    </>
  );
}