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
  field?: 'email' | 'password' | 'general'
}

interface ValidationError {
  field: 'email' | 'password' | 'general'
  message: string
}

const validateEmail = (email: string): ValidationError | null => {
  if (!email.trim()) {
    return { field: 'email', message: 'Email é obrigatório' }
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { field: 'email', message: 'Formato de email inválido' }
  }
  
  return null
}

const validatePassword = (password: string): ValidationError | null => {
  if (!password) {
    return { field: 'password', message: 'Senha é obrigatória' }
  }
  
  if (password.length < 6) {
    return { field: 'password', message: 'Senha deve ter pelo menos 6 caracteres' }
  }
  
  return null
}

export async function loginAction(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // Validation
  const emailError = validateEmail(email)
  if (emailError) {
    return { error: emailError.message, field: emailError.field }
  }

  const passwordError = validatePassword(password)
  if (passwordError) {
    return { error: passwordError.message, field: passwordError.field }
  }

  try {
    // 🚀 Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      // Handle specific Supabase errors with better UX
      if (error.message.includes('Invalid login credentials')) {
        return { error: 'Email ou senha incorretos', field: 'general' }
      }
      if (error.message.includes('Email not confirmed')) {
        return { error: 'Por favor, confirme seu email antes de fazer login', field: 'email' }
      }
      if (error.message.includes('Too many requests')) {
        return { error: 'Muitas tentativas. Tente novamente em alguns minutos.', field: 'general' }
      }
      return { error: error.message, field: 'general' }
    }

    if (!data.user) {
      return { error: 'Erro no login. Tente novamente.', field: 'general' }
    }

    // 🎯 Success - React 19 will handle redirect
    redirect('/dashboard')
    
  } catch (error) {
    console.error('Login error:', error)
    return { error: 'Erro interno. Tente novamente.', field: 'general' }
  }
}

export async function signupAction(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // Validation
  const emailError = validateEmail(email)
  if (emailError) {
    return { error: emailError.message, field: emailError.field }
  }

  const passwordError = validatePassword(password)
  if (passwordError) {
    return { error: passwordError.message, field: passwordError.field }
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
      // Handle specific Supabase errors with better UX
      if (error.message.includes('User already registered')) {
        return { error: 'Email já cadastrado. Tente fazer login.', field: 'email' }
      }
      if (error.message.includes('Password should be')) {
        return { error: 'Senha deve ter pelo menos 6 caracteres', field: 'password' }
      }
      if (error.message.includes('Unable to validate email')) {
        return { error: 'Email inválido', field: 'email' }
      }
      return { error: error.message, field: 'general' }
    }

    if (!data.user) {
      return { error: 'Erro no cadastro. Tente novamente.', field: 'general' }
    }

    // Check if email confirmation is required
    if (!data.session) {
      return { 
        success: true, 
        error: 'Cadastro realizado! Verifique seu email para confirmar a conta.',
        field: 'general'
      }
    }

    // Auto-login success
    redirect('/dashboard')
    
  } catch (error) {
    console.error('Signup error:', error)
    return { error: 'Erro interno. Tente novamente.', field: 'general' }
  }
}

/**
 * 🎯 BENEFITS OF OPTIMIZED REACT 19 ACTIONS:
 * 
 * ✅ Server-side validation with field-specific errors
 * ✅ FormData automatic extraction with type safety
 * ✅ Built-in loading states and progressive enhancement
 * ✅ Comprehensive error handling with UX improvements
 * ✅ Reusable validation functions
 * ✅ Better error categorization for UI feedback
 * ✅ TypeScript strict mode compliance
 * ✅ No API routes needed - direct server actions
 * 
 * 🚀 ELEGANCE + PERFORMANCE + DEVELOPER EXPERIENCE
 */