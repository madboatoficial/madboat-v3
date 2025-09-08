"use client"

import React from 'react'

interface AuthState {
  error?: string
  success?: boolean
}

interface ConversionOptimizedHeroProps {
  loginAction: (prevState: AuthState, formData: FormData) => Promise<AuthState>
  signupAction: (prevState: AuthState, formData: FormData) => Promise<AuthState>
  mode: 'login' | 'signup'
  onModeChange: (mode: 'login' | 'signup') => void
}

export function ConversionOptimizedHero({
  mode,
  onModeChange
}: ConversionOptimizedHeroProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900">MadBoat v2.0</h1>
          <p className="text-slate-600 mt-4">Transformação Digital Executiva</p>
          
          <div className="mt-8 max-w-md mx-auto">
            <input 
              type="email" 
              name="email"
              placeholder="Email executivo"
              className="w-full p-3 border border-slate-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input 
              type="password" 
              name="password"
              placeholder="Senha"
              className="w-full p-3 border border-slate-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button 
              type="submit"
              className="w-full p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              {mode === 'login' ? 'Acessar Plataforma' : 'Começar Transformação'}
            </button>
          </div>
          
          <button 
            onClick={() => onModeChange(mode === 'login' ? 'signup' : 'login')}
            className="mt-4 text-blue-600 hover:text-blue-700 transition-colors"
          >
            {mode === 'login' ? 'Primeira vez? Criar conta' : 'Já tem conta? Fazer login'}
          </button>
        </div>
      </div>
    </div>
  )
}