"use client"

import * as React from "react"
import { Button } from "./Button"
import { Input } from "./Input"

interface LoginFormProps {
  onSubmit?: (data: { email: string; password: string }) => Promise<void>
  onSignUp?: (data: { email: string; password: string }) => Promise<void>
  loading?: boolean
  error?: string
  className?: string
  mode?: 'login' | 'signup'
  onModeChange?: (mode: 'login' | 'signup') => void
}

export function LoginForm({ onSubmit, onSignUp, loading, error, className, mode = 'login', onModeChange }: LoginFormProps) {
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
    <div className={`w-full max-w-md mx-auto space-y-6 ${className}`}>
      <div className="space-y-3 text-center">
        <h1 className="text-3xl font-bold text-white drop-shadow-lg">
          {mode === 'login' ? 'Bem-vindo ao MadBoat' : 'Crie sua conta'}
        </h1>
        <p className="text-white/90 text-lg font-medium drop-shadow-sm">
          {mode === 'login' 
            ? 'Entre para navegar pelos 3 mundos' 
            : 'Comece sua jornada pelos 3 mundos'
          }
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={emailError}
          loading={loading}
          required
        />

        <Input
          label="Senha"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={passwordError}
          loading={loading}
          required
        />

        {error && (
          <div className="rounded-md bg-destructive/15 p-3">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full" 
          loading={loading}
          size="lg"
        >
          {loading 
            ? (mode === 'login' ? "Entrando..." : "Criando conta...") 
            : (mode === 'login' ? "Entrar" : "Criar conta")
          }
        </Button>
      </form>

      <div className="text-center">
        <p className="text-white/80 text-sm font-medium">
          {mode === 'login' ? 'Não tem conta?' : 'Já tem conta?'}{" "}
          <button 
            type="button"
            onClick={() => onModeChange?.(mode === 'login' ? 'signup' : 'login')}
            className="text-white hover:text-blue-200 hover:underline font-semibold underline-offset-4 transition-colors"
          >
            {mode === 'login' ? 'Criar conta' : 'Fazer login'}
          </button>
        </p>
      </div>
    </div>
  )
}