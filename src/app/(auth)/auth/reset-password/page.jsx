"use client"

import { useState, useEffect } from 'react'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import supabase from '@/libs/supabase/client'

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const { resetPassword } = useAuth()

  useEffect(() => {
    supabase.auth.getUser().then(({ data, error }) => {
      if (error || !data.user) {
        setError('Invalid or expired reset link')
      } else {
        setError(null)
      }
      setLoading(false)
    })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert('Passwords do not match')
      return
    }

    try {
      await supabase.auth.updateUser({ password })
      alert({
        title: 'Password Updated',
        description: 'You can now log in',
      })
      window.location.href = '/auth'
    } catch (error) {
      alert({
        variant: 'destructive',
        title: 'Reset Failed',
        description: error.message,
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
        <p className="text-gray-600">{error}</p>
        <button
          onClick={() => (window.location.href = '/auth')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Request New Reset Link
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-6 rounded shadow space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Reset Password</h1>
          <p className="text-gray-600">Enter your new password</p>
        </div>

        {[{
          label: 'New Password', id: 'password', value: password, onChange: setPassword, show: showPassword, toggle: setShowPassword
        }, {
          label: 'Confirm Password', id: 'confirm', value: confirmPassword, onChange: setConfirmPassword, show: showConfirm, toggle: setShowConfirm
        }].map(({ label, id, value, onChange, show, toggle }) => (
          <div key={id}>
            <label htmlFor={id} className="block font-medium mb-1">{label}</label>
            <div className="relative">
              <input
                id={id}
                type={show ? 'text' : 'password'}
                required
                minLength={6}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full border px-3 py-2 rounded pr-10"
              />
              <button
                type="button"
                onClick={() => toggle(!show)}
                className="absolute right-3 top-2.5 text-gray-500"
                aria-label="Toggle visibility"
              >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded font-semibold"
        >
          Reset Password
        </button>
      </form>
    </div>
  )
}