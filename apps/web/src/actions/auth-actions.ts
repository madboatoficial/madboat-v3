/**
 * 🚀 REACT 19 AUTH ACTIONS
 * 
 * Server Actions para autenticação integrada com Supabase
 */

import { createClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface AuthState {
  error?: string
  success?: boolean
}

export async function loginAction(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // Basic validation
  if (!email || !password) {
    return { error: 'Email e senha são obrigatórios' }
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { error: 'Formato de email inválido' }
  }

  // Password length validation  
  if (password.length < 6) {
    return { error: 'Senha deve ter pelo menos 6 caracteres' }
  }

  try {
    // 🚀 Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      // Handle specific Supabase errors
      if (error.message.includes('Invalid login credentials')) {
        return { error: 'Email ou senha incorretos' }
      }
      if (error.message.includes('Email not confirmed')) {
        return { error: 'Por favor, confirme seu email antes de fazer login' }
      }
      return { error: error.message }
    }

    if (!data.user) {
      return { error: 'Erro no login. Tente novamente.' }
    }

    // 🎯 Success - React 19 will handle redirect
    redirect('/dashboard')
    
  } catch (error) {
    console.error('Login error:', error)
    return { error: 'Erro interno. Tente novamente.' }
  }
}

export async function signupAction(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // Basic validation
  if (!email || !password) {
    return { error: 'Email e senha são obrigatórios' }
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { error: 'Formato de email inválido' }
  }

  // Password strength validation
  if (password.length < 6) {
    return { error: 'Senha deve ter pelo menos 6 caracteres' }
  }

  try {
    // 🚀 Supabase Signup
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
      }
    })

    if (error) {
      // Handle specific Supabase errors
      if (error.message.includes('User already registered')) {
        return { error: 'Email já cadastrado. Tente fazer login.' }
      }
      return { error: error.message }
    }

    if (!data.user) {
      return { error: 'Erro no cadastro. Tente novamente.' }
    }

    // Check if email confirmation is required
    if (!data.session) {
      return { 
        success: true, 
        error: 'Cadastro realizado! Verifique seu email para confirmar a conta.' 
      }
    }

    // Auto-login success
    redirect('/dashboard')
    
  } catch (error) {
    console.error('Signup error:', error)
    return { error: 'Erro interno. Tente novamente.' }
  }
}

/**
 * 🎯 BENEFITS OF REACT 19 ACTIONS:
 * 
 * ✅ Server-side validation
 * ✅ FormData automatic extraction  
 * ✅ Built-in loading states
 * ✅ Error handling integrated
 * ✅ Progressive enhancement
 * ✅ Type-safe by default
 * ✅ No API routes needed!
 * 
 * Brother, isso é o FUTURO! 🚀
 */