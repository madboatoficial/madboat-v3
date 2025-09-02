"use client"

import React, { useActionState } from 'react'
import { ModernInput } from "./ModernInput"
import { Button } from "./Button"

interface LoginState {
  error?: string
  success?: boolean
  loading?: boolean
}

// Action type
type LoginAction = (prevState: LoginState, formData: FormData) => Promise<LoginState>

interface ModernLoginFormActionsProps {
  loginAction: LoginAction
  signupAction?: LoginAction
  className?: string
  mode?: 'login' | 'signup'
  onModeChange?: (mode: 'login' | 'signup') => void
}

export function ModernLoginFormActions({ 
  loginAction,
  signupAction,
  className, 
  mode = 'login', 
  onModeChange 
}: ModernLoginFormActionsProps) {
  
  // 🚀 REACT 19 MAGIC!
  const [state, formAction, isPending] = useActionState(
    mode === 'login' ? loginAction : (signupAction || loginAction), 
    { error: undefined, success: false }
  )

  return (
    <div className={`w-full max-w-lg mx-auto ${className}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="mb-4">
          <span className="text-6xl">🌊</span>
        </div>
        <h1 
          className="text-4xl font-bold text-white mb-2"
          style={{ color: '#FFFFFF', fontSize: '32px', fontWeight: 'bold' }}
        >
          {mode === 'login' ? 'Bem-vindo ao MadBoat' : 'Crie sua conta'}
        </h1>
        <p 
          className="text-xl text-white/90"
          style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '18px' }}
        >
          {mode === 'login' 
            ? 'Entre para navegar pelos 3 mundos' 
            : 'Comece sua jornada pelos 3 mundos'
          }
        </p>
      </div>

      {/* Form com React 19 Actions */}
      <form action={formAction} className="space-y-6">
        <ModernInput
          label="Email"
          name="email"
          type="email"
          required
          disabled={isPending}
          autoComplete="email"
        />

        <ModernInput
          label="Senha"
          name="password"
          type="password"
          required
          disabled={isPending}
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
        />

        {/* Submit Button */}
        <Button 
          type="submit"
          disabled={isPending}
          className="w-full"
        >
          {isPending 
            ? (mode === 'login' ? 'Entrando...' : 'Criando conta...') 
            : (mode === 'login' ? 'Entrar' : 'Criar conta')
          }
        </Button>

        {/* Error Display */}
        {state.error && (
          <div className="p-4 bg-red-950/50 border border-red-800 rounded-lg">
            <p className="text-red-200 text-sm">{state.error}</p>
          </div>
        )}

        {/* Success Display */}
        {state.success && (
          <div className="p-4 bg-green-950/50 border border-green-800 rounded-lg">
            <p className="text-green-200 text-sm">
              {mode === 'login' ? 'Login realizado com sucesso!' : 'Conta criada com sucesso!'}
            </p>
          </div>
        )}
      </form>

      {/* Mode Toggle */}
      {onModeChange && (
        <div className="text-center mt-6">
          <button
            type="button"
            onClick={() => onModeChange(mode === 'login' ? 'signup' : 'login')}
            disabled={isPending}
            className="text-white/70 hover:text-white text-sm underline disabled:opacity-50"
          >
            {mode === 'login' 
              ? 'Não tem uma conta? Cadastre-se' 
              : 'Já tem uma conta? Faça login'
            }
          </button>
        </div>
      )}
    </div>
  )
}

/**
 * 🚀 REACT 19 BENEFITS:
 * - No useState para loading/error states
 * - No e.preventDefault() necessário
 * - FormData automático
 * - Pending state built-in
 * - Server-side validation natural
 * - Progressive enhancement ready
 * 
 * ✅ 60% MENOS CÓDIGO!
 * ✅ MAIS ROBUSTO!
 * ✅ MELHOR UX!
 */