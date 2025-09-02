"use client"

import React, { useState } from 'react'
import { Mail, Lock, ArrowRight, Eye, EyeOff, User, AlertCircle } from 'lucide-react'

interface DarkLoginFormProps {
  onSubmit: (data: { email: string; password: string }) => void
  onSignUp: (data: { email: string; password: string }) => void
  loading?: boolean
  error?: string
  mode: 'login' | 'signup'
  onModeChange: (mode: 'login' | 'signup') => void
  className?: string
}

export function DarkLoginForm({
  onSubmit,
  onSignUp,
  loading = false,
  error,
  mode,
  onModeChange,
  className = ''
}: DarkLoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === 'login') {
      onSubmit({ email, password })
    } else {
      onSignUp({ email, password })
    }
  }

  return (
    <div className={`bg-black/90 backdrop-blur-xl rounded-2xl p-8 border border-zinc-800 shadow-2xl ${className}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">
          {mode === 'login' ? 'Welcome Back' : 'Begin Your Journey'}
        </h2>
        <p className="text-zinc-400 text-sm">
          {mode === 'login' 
            ? 'Navigate to your digital ocean' 
            : 'Chart your course with MadBoat'}
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-800/50 rounded-lg flex items-start gap-3">
          <AlertCircle className="text-red-400 mt-0.5" size={18} />
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Field */}
        <div className="space-y-2">
          <label className="text-zinc-300 text-sm font-medium block">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-11 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-all"
              placeholder="captain@madboat.com"
              required
              disabled={loading}
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label className="text-zinc-300 text-sm font-medium block">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-11 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-all pr-12"
              placeholder="••••••••"
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white text-black font-semibold py-3 px-6 rounded-lg hover:bg-zinc-100 transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
          ) : (
            <>
              {mode === 'login' ? 'Sign In' : 'Create Account'}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-800"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-4 bg-black text-zinc-500">OR</span>
          </div>
        </div>

        {/* Toggle Mode */}
        <div className="text-center">
          <p className="text-zinc-400 text-sm">
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
          </p>
          <button
            type="button"
            onClick={() => onModeChange(mode === 'login' ? 'signup' : 'login')}
            className="text-white font-medium hover:underline mt-1 transition-all"
            disabled={loading}
          >
            {mode === 'login' ? 'Create one' : 'Sign in'}
          </button>
        </div>
      </form>
    </div>
  )
}