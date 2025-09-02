"use client"

import React, { useState } from 'react'
import { ShipWheel, ArrowRight } from 'lucide-react'

interface HeroLoginPageProps {
  onSubmit: (data: { email: string; password: string }) => void
  onSignUp: (data: { email: string; password: string }) => void
  loading?: boolean
  error?: string
  mode: 'login' | 'signup'
  onModeChange: (mode: 'login' | 'signup') => void
}

export function HeroLoginPage({
  onSubmit,
  onSignUp,
  loading = false,
  error,
  mode,
  onModeChange
}: HeroLoginPageProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailFocused, setEmailFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === 'login') {
      onSubmit({ email, password })
    } else {
      onSignUp({ email, password })
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      {/* Subtle background effect */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-zinc-800/5 rounded-full blur-3xl" />
      </div>
      
      <div className="relative z-10 w-full max-w-sm mx-auto space-y-8">
        
        {/* Logo pequena no topo */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-2xl font-bold text-white tracking-wide">Mad</span>
            <ShipWheel size={20} className="text-white animate-spin-slow" strokeWidth={2.5} />
            <span className="text-2xl font-bold text-white tracking-wide">Boat</span>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="text-center mb-6">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Formulário artístico */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Campo Email */}
          <div className="relative">
            {/* Label flutuante */}
            <div className={`absolute -top-3 left-6 text-sm font-medium transition-all duration-200 ${
              emailFocused || email ? 'text-white opacity-100' : 'text-transparent opacity-0'
            }`}>
              {mode === 'login' ? 'seu login' : 'seu email'}
            </div>
            
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              className="w-full h-14 bg-zinc-900/50 border border-zinc-800/50 rounded-full px-6 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 focus:bg-zinc-900/80 transition-all duration-300 text-center"
              placeholder={emailFocused ? '' : (mode === 'login' ? 'seu login' : 'seu email')}
              required
              disabled={loading}
            />
          </div>

          {/* Campo Senha */}
          <div className="relative">
            {/* Label flutuante */}
            <div className={`absolute -top-3 left-6 text-sm font-medium transition-all duration-200 ${
              passwordFocused || password ? 'text-white opacity-100' : 'text-transparent opacity-0'
            }`}>
              sua senha
            </div>
            
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              className="w-full h-14 bg-zinc-900/50 border border-zinc-800/50 rounded-full px-6 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 focus:bg-zinc-900/80 transition-all duration-300 text-center"
              placeholder={passwordFocused ? '' : 'sua senha'}
              required
              disabled={loading}
            />
          </div>

          {/* Botão Submit */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-white text-black font-semibold rounded-full hover:bg-zinc-100 transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? 'Entrar' : 'Começar'}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>

          {/* Toggle Mode - minimalista */}
          <div className="text-center pt-8">
            <button
              type="button"
              onClick={() => onModeChange(mode === 'login' ? 'signup' : 'login')}
              className="text-zinc-400 text-sm hover:text-white transition-colors underline decoration-zinc-600 hover:decoration-white"
              disabled={loading}
            >
              {mode === 'login' ? 'criar conta' : 'já tenho conta'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}