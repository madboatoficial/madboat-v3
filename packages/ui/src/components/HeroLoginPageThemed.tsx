"use client"

import React, { useState } from 'react'
import { useActionState } from 'react'
import { ShipWheel, ArrowRight, Mail, Lock, Sun, Moon } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'

// Types for React 19 Actions
interface AuthState {
  error?: string
  success?: boolean
}

interface HeroLoginPageThemedProps {
  loginAction: (prevState: AuthState, formData: FormData) => Promise<AuthState>
  signupAction: (prevState: AuthState, formData: FormData) => Promise<AuthState>
  mode: 'login' | 'signup'
  onModeChange: (mode: 'login' | 'signup') => void
}

/**
 * 🎨 Theme-Aware Hero Login Page
 * 
 * Executive B2B login experience with premium light/dark mode support.
 * Optimized for conversion with instructional design principles.
 */
export function HeroLoginPageThemed({
  loginAction,
  signupAction,
  mode,
  onModeChange
}: HeroLoginPageThemedProps) {
  const [emailFocused, setEmailFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)
  
  // React 19 useActionState - manages form state automatically
  const [state, formAction, isPending] = useActionState(
    mode === 'login' ? loginAction : signupAction,
    { error: undefined, success: false }
  )

  // Handle successful auth
  React.useEffect(() => {
    if (state.success) {
      console.log('🚀 Auth success, waiting for session update...')
    }
  }, [state.success])

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Premium Background System */}
      <div className="absolute inset-0">
        {/* Light mode gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-ocean-50 via-white to-brand-gold-50 dark:hidden" />
        
        {/* Dark mode gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-deep-950 via-brand-deep-900 to-brand-deep-800 hidden dark:block" />
        
        {/* Floating geometric elements for visual interest */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-brand-ocean-200/10 dark:bg-brand-ocean-500/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-brand-gold-200/10 dark:bg-brand-gold-500/5 rounded-full blur-2xl animate-blob" />
        
        {/* Grid pattern for executive feel */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10" />
      </div>

      {/* Theme Toggle - Top Right */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle variant="button" />
      </div>
      
      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-md mx-auto space-y-8">
          
          {/* Executive Brand Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-glow">
                <ShipWheel size={24} className="text-primary-foreground animate-spin-slow" strokeWidth={2.5} />
              </div>
            </div>
            
            <h1 className="text-h1 font-display font-bold text-foreground mb-2">
              Mad<span className="text-primary">Boat</span>
            </h1>
            
            <p className="text-body text-muted-foreground">
              {mode === 'login' 
                ? 'Welcome back to your transformation journey' 
                : 'Begin your digital transformation voyage'
              }
            </p>
          </div>

          {/* Premium Card Container */}
          <div className="card-premium space-y-8">
            
            {/* Status Messages */}
            {state.error && (
              <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-center animate-slide-up">
                <p className="text-destructive text-body-sm font-medium">{state.error}</p>
              </div>
            )}

            {state.success && (
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-center animate-scale-in">
                <p className="text-emerald-700 dark:text-emerald-300 text-body-sm font-medium">
                  {mode === 'login' ? 'Welcome back! Redirecting...' : 'Account created successfully!'}
                </p>
              </div>
            )}

            {/* React 19 Form with Executive Design */}
            <form action={formAction} className="space-y-6">
              
              {/* Email Field with Instructional Design */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-body-sm font-medium text-foreground">
                  {mode === 'login' ? 'Email or Username' : 'Business Email'} *
                </label>
                
                <div className="relative group">
                  <Mail className={`
                    w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200
                    ${emailFocused ? 'text-primary' : 'text-muted-foreground'}
                  `} />
                  
                  <input
                    id="email"
                    type="email"
                    name="email"
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    className="
                      input-executive pl-12
                      group-hover:border-border/80
                      transition-all duration-200
                    "
                    placeholder={mode === 'login' ? 'john.doe@company.com' : 'your.email@company.com'}
                    required
                    disabled={isPending}
                  />
                  
                  {/* Focus indicator */}
                  <div className={`
                    absolute inset-0 rounded-xl border-2 border-primary/50 opacity-0 pointer-events-none
                    transition-opacity duration-200
                    ${emailFocused ? 'opacity-100' : ''}
                  `} />
                </div>
              </div>

              {/* Password Field with Security Indication */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-body-sm font-medium text-foreground">
                  Password *
                </label>
                
                <div className="relative group">
                  <Lock className={`
                    w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200
                    ${passwordFocused ? 'text-primary' : 'text-muted-foreground'}
                  `} />
                  
                  <input
                    id="password"
                    type="password"
                    name="password"
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    className="
                      input-executive pl-12
                      group-hover:border-border/80
                      transition-all duration-200
                    "
                    placeholder={mode === 'login' ? 'Enter your password' : 'Create secure password'}
                    required
                    disabled={isPending}
                    minLength={mode === 'signup' ? 8 : undefined}
                  />
                  
                  {/* Focus indicator */}
                  <div className={`
                    absolute inset-0 rounded-xl border-2 border-primary/50 opacity-0 pointer-events-none
                    transition-opacity duration-200
                    ${passwordFocused ? 'opacity-100' : ''}
                  `} />
                </div>
                
                {mode === 'signup' && (
                  <p className="text-caption text-muted-foreground">
                    Minimum 8 characters for security
                  </p>
                )}
              </div>

              {/* Executive CTA Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isPending}
                  className="btn-conversion-cta w-full relative overflow-hidden group"
                >
                  {isPending ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                      <span>{mode === 'login' ? 'Signing In...' : 'Creating Account...'}</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3">
                      <span>{mode === 'login' ? 'Access Dashboard' : 'Start Transformation'}</span>
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                  )}
                  
                  {/* Shimmer effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </button>
              </div>

              {/* Trust Signals for Signup */}
              {mode === 'signup' && (
                <div className="flex flex-wrap gap-2 justify-center pt-2">
                  <div className="trust-signal text-xs">
                    <Lock className="w-3 h-3" />
                    <span>Enterprise Security</span>
                  </div>
                  <div className="trust-signal text-xs">
                    <ShipWheel className="w-3 h-3" />
                    <span>Proven Methods</span>
                  </div>
                </div>
              )}

            </form>

            {/* Mode Toggle with Executive Styling */}
            <div className="text-center pt-6 border-t border-border/50">
              <p className="text-body-sm text-muted-foreground mb-3">
                {mode === 'login' ? "Don't have an account yet?" : "Already have an account?"}
              </p>
              
              <button
                type="button"
                onClick={() => onModeChange(mode === 'login' ? 'signup' : 'login')}
                disabled={isPending}
                className="
                  text-primary hover:text-primary/80 
                  text-body-sm font-semibold
                  transition-colors duration-200
                  hover:underline decoration-2 underline-offset-4
                  disabled:opacity-50 disabled:cursor-not-allowed
                  focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                  px-2 py-1 rounded-lg
                "
              >
                {mode === 'login' ? 'Create Free Account' : 'Sign In Instead'}
              </button>
            </div>

          </div>

          {/* Executive Footer */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-caption text-muted-foreground">
              <Lock className="w-4 h-4" />
              <span>Your data is encrypted and secure</span>
            </div>
            
            <p className="text-caption text-muted-foreground">
              © 2025 MadBoat. Transforming organizations worldwide.
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}

// Add grid pattern CSS (would typically be in globals.css)
const gridPatternStyle = `
.bg-grid-pattern {
  background-image: 
    linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px);
  background-size: 20px 20px;
}

.dark .bg-grid-pattern {
  background-image: 
    linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
}
`

export default HeroLoginPageThemed