'use client'

import { HeroLoginPageThemed } from '@madboat/ui'
import { useState } from 'react'

// Mock actions for demonstration
async function mockLoginAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Simple validation for demo
  if (!email || !password) {
    return { error: 'Email and password are required' }
  }
  
  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters' }
  }
  
  return { success: true }
}

async function mockSignupAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  // Simple validation for demo
  if (!email || !password) {
    return { error: 'Email and password are required' }
  }
  
  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters for security' }
  }
  
  if (!email.includes('@')) {
    return { error: 'Please enter a valid email address' }
  }
  
  return { success: true }
}

/**
 * 🎨 Theme-Aware Login Demo Page
 * 
 * Demonstrates the premium B2B theme system with a real login experience.
 * Shows light/dark mode capabilities with executive design patterns.
 */
export default function ThemeLoginDemoPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  
  return (
    <HeroLoginPageThemed
      loginAction={mockLoginAction}
      signupAction={mockSignupAction}
      mode={mode}
      onModeChange={setMode}
    />
  )
}