"use client"

import React, { useState } from 'react'
import { useActionState } from 'react'
import { ShipWheel, ArrowRight } from 'lucide-react'

// Types for React 19 Actions
interface AuthState {
  error?: string
  success?: boolean
}

interface HeroLoginPageActionsProps {
  loginAction: (prevState: AuthState, formData: FormData) => Promise<AuthState>
  signupAction: (prevState: AuthState, formData: FormData) => Promise<AuthState>
  mode: 'login' | 'signup'
  onModeChange: (mode: 'login' | 'signup') => void
}

export function HeroLoginPageActions({
  loginAction,
  signupAction,
  mode,
  onModeChange
}: HeroLoginPageActionsProps) {
  const [emailFocused, setEmailFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)
  
  // React 19 useActionState - manages form state automatically
  const [state, formAction, isPending] = useActionState(
    mode === 'login' ? loginAction : signupAction,
    { error: undefined, success: false }
  )

  // Handle successful auth - let useAuthState handle the redirect
  React.useEffect(() => {
    if (state.success) {
      // Client-side navigation will be handled by useAuthState
      // when the session state changes
      console.log('🚀 Auth success, waiting for session update...')
    }
  }, [state.success])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      {/* Subtle background effect */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-zinc-200/30 rounded-full blur-3xl" />
      </div>
      
      <div className="relative z-10 w-full max-w-sm mx-auto space-y-8">
        
        {/* Logo pequena no topo */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-2xl font-bold text-zinc-800 tracking-wide">Mad</span>
            <ShipWheel size={20} className="text-zinc-800 animate-spin-slow" strokeWidth={2.5} />
            <span className="text-2xl font-bold text-zinc-800 tracking-wide">Boat</span>
          </div>
        </div>

        {/* Error message - React 19 automatically manages state */}
        {state.error && (
          <div className="text-center mb-6">
            <p className="text-red-400 text-sm">{state.error}</p>
          </div>
        )}

        {/* Success message */}
        {state.success && (
          <div className="text-center mb-6">
            <p className="text-green-400 text-sm">
              {mode === 'login' ? 'Login realizado!' : 'Conta criada com sucesso!'}
            </p>
          </div>
        )}

        {/* React 19 Form with Actions - No manual state management needed */}
        <form action={formAction} className="space-y-6">
          
          {/* Campo Email */}
          <div className="relative">
            <div className={`absolute -top-3 left-6 text-sm font-medium transition-all duration-200 text-zinc-600 opacity-100`}>
              {mode === 'login' ? 'seu login' : 'seu email'}
            </div>
            
            <input
              type="email"
              name="email"
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              className="w-full h-14 bg-zinc-100 border border-zinc-300 rounded-full px-6 text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-zinc-500 focus:bg-white transition-all duration-300 text-center"
              placeholder={emailFocused ? '' : (mode === 'login' ? 'seu login' : 'seu email')}
              required
              disabled={isPending}
            />
          </div>

          {/* Campo Senha */}
          <div className="relative">
            <div className={`absolute -top-3 left-6 text-sm font-medium transition-all duration-200 text-zinc-600 opacity-100`}>
              sua senha
            </div>
            
            <input
              type="password"
              name="password"
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              className="w-full h-14 bg-zinc-100 border border-zinc-300 rounded-full px-6 text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-zinc-500 focus:bg-white transition-all duration-300 text-center"
              placeholder={passwordFocused ? '' : 'sua senha'}
              required
              disabled={isPending}
            />
          </div>

          {/* Botão Submit - React 19 automatically handles pending state */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={isPending}
              className="w-full h-14 bg-zinc-800 text-white font-semibold rounded-full hover:bg-zinc-900 transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? 'Entrar' : 'Começar'}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>

          {/* Toggle Mode */}
          <div className="text-center pt-8">
            <button
              type="button"
              onClick={() => onModeChange(mode === 'login' ? 'signup' : 'login')}
              className="text-zinc-500 text-sm hover:text-zinc-800 transition-colors underline decoration-zinc-400 hover:decoration-zinc-800"
              disabled={isPending}
            >
              {mode === 'login' ? 'criar conta' : 'já tenho conta'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}