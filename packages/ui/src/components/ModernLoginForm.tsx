"use client"

import * as React from "react"
import { ModernInput } from "./ModernInput"
import { Button } from "./Button"

interface ModernLoginFormProps {
  onSubmit?: (data: { email: string; password: string }) => Promise<void>
  onSignUp?: (data: { email: string; password: string }) => Promise<void>
  loading?: boolean
  error?: string
  className?: string
  mode?: 'login' | 'signup'
  onModeChange?: (mode: 'login' | 'signup') => void
}

export function ModernLoginForm({ 
  onSubmit, 
  onSignUp, 
  loading, 
  error, 
  className, 
  mode = 'login', 
  onModeChange 
}: ModernLoginFormProps) {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [emailError, setEmailError] = React.useState("")
  const [passwordError, setPasswordError] = React.useState("")

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setEmailError("")
    setPasswordError("")

    if (!email) {
      setEmailError("Email é obrigatório")
      return
    }

    if (!validateEmail(email)) {
      setEmailError("Email inválido")
      return
    }

    if (!password) {
      setPasswordError("Senha é obrigatória")
      return
    }

    if (password.length < 6) {
      setPasswordError("Senha deve ter pelo menos 6 caracteres")
      return
    }

    if (mode === 'login') {
      await onSubmit?.({ email, password })
    } else {
      await onSignUp?.({ email, password })
    }
  }

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

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <ModernInput
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={emailError}
          loading={loading}
          required
        />

        <ModernInput
          label="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={passwordError}
          loading={loading}
          required
        />

        {/* Global Error */}
        {error && (
          <div 
            className="rounded-xl bg-red-50 border border-red-200 p-4"
            style={{ 
              backgroundColor: '#fef2f2', 
              borderColor: '#fecaca',
              border: '1px solid #fecaca'
            }}
          >
            <div className="flex items-center gap-3">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p 
                className="text-sm font-medium text-red-700"
                style={{ color: '#b91c1c', fontSize: '14px', fontWeight: '500' }}
              >
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button 
          type="submit" 
          className="w-full h-14 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          loading={loading}
          style={{
            backgroundColor: '#2563eb',
            color: '#ffffff',
            fontSize: '18px',
            fontWeight: '600',
            height: '56px'
          }}
        >
          {loading 
            ? (mode === 'login' ? "Entrando..." : "Criando conta...") 
            : (mode === 'login' ? "Entrar" : "Criar conta")
          }
        </Button>
      </form>

      {/* Mode Toggle */}
      <div className="text-center mt-6">
        <p 
          className="text-white/80 text-base"
          style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px' }}
        >
          {mode === 'login' ? 'Não tem conta?' : 'Já tem conta?'}{" "}
          <button 
            type="button"
            onClick={() => onModeChange?.(mode === 'login' ? 'signup' : 'login')}
            className="text-white font-semibold hover:text-blue-200 underline-offset-4 hover:underline transition-colors duration-200"
            style={{ 
              color: '#ffffff', 
              fontWeight: '600',
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#bfdbfe'
              e.currentTarget.style.textDecoration = 'underline'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#ffffff'
              e.currentTarget.style.textDecoration = 'none'
            }}
          >
            {mode === 'login' ? 'Criar conta' : 'Fazer login'}
          </button>
        </p>
      </div>
    </div>
  )
}