'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Mail, Lock, Loader2, Eye, EyeOff, Check } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import clsx from 'clsx'
import { useSelector } from 'react-redux'

export default function SignUpForm() {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { signUp } = useAuth()
  const isDarkMode = useSelector((state) => state.theme.isDarkMode)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm()

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      await signUp(data.email, data.password)
      alert('Account created successfully')
      reset()
    } catch (error) {
      alert(error.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const password = watch('password')

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
          "space-y-6 font-sans max-w-md mx-auto mt-10 p-6 rounded-xl shadow-lg border",
          isDarkMode
            ? "bg-black border-slate-700 text-gray-200"
            : "bg-white border-gray-200 text-gray-900"
        )}
        style={{ minWidth: 320 }}
      >
        {/* Email */}
        <div className="space-y-2">
          <label
            htmlFor="email"
            className={clsx("text-sm font-medium", isDarkMode ? "text-pink-200" : "text-purple-700")}
          >
            Email
          </label>
          <div className="relative">
            <Mail className={clsx("absolute left-3 top-3 h-4 w-4", isDarkMode ? "text-pink-400" : "text-gray-400")} />
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
                "w-full pl-10 pr-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all",
                isDarkMode
                  ? "bg-black border-pink-700 text-white placeholder-pink-200 focus:ring-purple-500"
                  : "bg-white border-purple-300 text-gray-900 placeholder-gray-400 focus:ring-purple-400"
              )}
            />
          </div>
          {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label
            htmlFor="password"
            className={clsx("text-sm font-medium", isDarkMode ? "text-pink-200" : "text-purple-700")}
          >
            Password
          </label>
          <div className="relative">
            <Lock className={clsx("absolute left-3 top-3 h-4 w-4", isDarkMode ? "text-pink-400" : "text-gray-400")} />
            <input
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
              })}
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a password"
              className={clsx(
                "w-full pl-10 pr-10 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all",
                isDarkMode
                  ? "bg-black border-pink-700 text-white placeholder-pink-200 focus:ring-purple-500"
                  : "bg-white border-purple-300 text-gray-900 placeholder-gray-400 focus:ring-purple-400"
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-2.5 text-gray-500"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <label
            htmlFor="confirmPassword"
            className={clsx("text-sm font-medium", isDarkMode ? "text-pink-200" : "text-purple-700")}
          >
            Confirm Password
          </label>
          <div className="relative">
            <Lock className={clsx("absolute left-3 top-3 h-4 w-4", isDarkMode ? "text-pink-400" : "text-gray-400")} />
            <input
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) => value === password || 'Passwords do not match',
              })}
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
              className={clsx(
                "w-full pl-10 pr-10 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all",
                isDarkMode
                  ? "bg-black border-pink-700 text-white placeholder-pink-200 focus:ring-purple-500"
                  : "bg-white border-purple-300 text-gray-900 placeholder-gray-400 focus:ring-purple-400"
              )}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-2.5 text-gray-500"
              tabIndex={-1}
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={clsx(
            "w-full flex items-center justify-center gap-2 font-medium rounded-lg text-sm px-5 py-2.5 transition shadow",
            "bg-gradient-to-r from-purple-500 via-pink-500 to-pink-600 text-white",
            "hover:bg-gradient-to-br focus:ring-4 focus:outline-none",
            isDarkMode ? "focus:ring-pink-800" : "focus:ring-pink-300",
            loading && "opacity-70 cursor-not-allowed"
          )}
        >
          {loading ? <Loader2 className="animate-spin h-4 w-4" /> : <Check className="h-4 w-4" />}
          Create Account
        </button>
      </form>
    </>
  )
}
