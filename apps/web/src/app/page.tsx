"use client"

import { HeroLoginPageActions, ExecutiveHUD, ClientOnly } from '@madboat/ui'
import { HeroLoginPage } from '@madboat/ui'
import { supabase } from '@madboat/core'
import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [showDashboard, setShowDashboard] = useState(false)

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
        // Don't show dashboard immediately, keep login screen
        setShowDashboard(false)
      } catch (err) {
        console.error('Session error:', err)
      } finally {
        setLoading(false)
      }
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user)
          setShowDashboard(true)
          setError(null)
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setShowDashboard(false)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      setLoading(true)
      setError(null)
      
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) {
        setError(error.message)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado')
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (data: { email: string; password: string }) => {
    try {
      setLoading(true)
      setError(null)
      
      const { data: signupData, error: signupError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      })

      if (signupError) {
        setError(signupError.message)
        return
      }

      // If signup successful but we get a "Database error saving new user",
      // it means the trigger failed. Let's create the profile manually.
      if (signupData.user) {
        try {
          // Wait a moment for any existing trigger to complete
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // Check if profile already exists (trigger worked)
          const { data: existingProfile, error: checkError } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', signupData.user.id)
            .single()
          
          // If profile doesn't exist, create it manually
          if (checkError && checkError.code === 'PGRST116') {
            console.log('Creating profile manually (trigger failed)...')
            
            // Create profile
            const { error: profileError } = await supabase
              .from('profiles')
              .insert({
                id: signupData.user.id,
                email: signupData.user.email || data.email,
                full_name: signupData.user.user_metadata?.full_name || data.email,
                data_processing_consent: true
              })
            
            if (profileError) {
              console.error('Failed to create profile:', {
                error: profileError,
                code: profileError.code,
                message: profileError.message,
                details: profileError.details,
                hint: profileError.hint
              })
              setError(`Erro ao criar perfil: ${profileError.message || 'Erro desconhecido'}`)
              return
            }
            
            // Award initial XP
            const { error: xpError } = await supabase
              .from('xp_events')
              .insert({
                user_id: signupData.user.id,
                event_type: 'user_registration',
                event_category: 'onboarding',
                xp_awarded: 50,
                base_xp: 50,
                description: 'Welcome to MadBoat! Registration completed.'
              })
            
            if (xpError) {
              console.warn('Failed to award initial XP:', xpError)
              // Don't fail signup for XP error
            }
            
            console.log('✅ Profile created manually')
          } else if (existingProfile) {
            console.log('✅ Profile already exists (trigger worked)')
          }
          
        } catch (profileErr) {
          console.error('Profile creation error:', profileErr)
          setError('Conta criada, mas houve um erro na configuração inicial.')
        }
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="text-white text-xl">Carregando...</div>
      </main>
    )
  }

  // Show Executive Dashboard only after successful login
  if (showDashboard && user) {
    return (
      <ClientOnly 
        fallback={
          <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
            <div className="text-white text-xl">Preparando dashboard...</div>
          </main>
        }
      >
        <div className="relative">
          <ExecutiveHUD
            userName={user.email?.split('@')[0] || 'Tripulante'}
            onModuleSelect={(moduleId: string) => {
              console.log('Module selected:', moduleId)
              // TODO: Navegar para módulo específico
            }}
            onActionTrigger={(moduleId: string, action: string) => {
              console.log('Action triggered:', moduleId, action)
              // TODO: Executar ação específica
            }}
            onMilestoneView={(milestone: string) => {
              console.log('Viewing milestone:', milestone)
              // TODO: Mostrar milestone
            }}
          />
          
          {/* Logout Button */}
          <button
            onClick={async () => {
              await supabase.auth.signOut()
              setShowDashboard(false)
              setUser(null)
            }}
            className="absolute top-4 right-20 p-2 bg-red-600/20 border border-red-600/50 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors z-50 text-xs"
            title="Logout"
          >
            Sair
          </button>
        </div>
      </ClientOnly>
    )
  }

  return (
    <HeroLoginPage 
      onSubmit={handleLogin}
      onSignUp={handleSignUp}
      loading={loading}
      error={error || undefined}
      mode={mode}
      onModeChange={setMode}
    />
  )
}