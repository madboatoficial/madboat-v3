"use client"

import { HeroLoginPageActions, ExecutiveHUD, ClientOnly } from '@madboat/ui'
import { loginAction, signupAction } from '@/actions/auth-actions'
import { supabase } from '@madboat/core'
import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [showDashboard, setShowDashboard] = useState(false)

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
        setShowDashboard(!!session?.user)
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
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setShowDashboard(false)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  // Show dashboard if user is authenticated
  if (showDashboard && user) {
    return (
      <ClientOnly>
        <div className="min-h-screen bg-zinc-950">
          <ExecutiveHUD
            userName={user.email?.split('@')[0] || 'Navigator'}
            onModuleSelect={(moduleId) => {
              console.log(`Module selected: ${moduleId}`)
            }}
            onActionTrigger={(moduleId, action) => {
              console.log(`Action ${action} on ${moduleId}`)
            }}
            onMilestoneView={(milestone) => {
              console.log(`Viewing milestone: ${milestone}`)
            }}
          />
        </div>
      </ClientOnly>
    )
  }

  // Show React 19 login form
  return (
    <HeroLoginPageActions
      loginAction={loginAction}
      signupAction={signupAction}
      mode={mode}
      onModeChange={setMode}
    />
  )
}