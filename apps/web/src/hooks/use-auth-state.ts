/**
 * 🚀 REACT 19 OPTIMIZED AUTH HOOK
 * 
 * Custom hook for managing authentication state with React 19 patterns
 */

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@madboat/core'

interface AuthUser {
  id: string
  email: string | undefined
}

interface AuthState {
  user: AuthUser | null
  loading: boolean
  signOut: () => Promise<void>
}

export function useAuthState(): AuthState {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  const signOut = useCallback(async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Logout error:', error)
      }
      // Clear any localStorage data
      localStorage.removeItem('madboat_persona')
      localStorage.removeItem('madboat_persona_date')
      localStorage.removeItem('madboat_user_progress')
      
      // Force redirect to login page
      window.location.href = '/'
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let mounted = true

    const getInitialSession = async () => {
      try {
        console.log('🔍 Verificando sessão inicial...')
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('❌ Session error:', error)
          if (mounted) {
            setUser(null)
            setLoading(false)
          }
          return
        }
        
        console.log('📊 Session data:', session ? 'Logado' : 'Não logado')
        
        if (mounted) {
          if (session?.user) {
            console.log('✅ Usuário encontrado:', session.user.email)
            setUser({
              id: session.user.id,
              email: session.user.email
            })
          } else {
            console.log('👤 Nenhum usuário logado')
            setUser(null)
          }
          console.log('⏰ Loading finalizado')
          setLoading(false)
        }
      } catch (error) {
        console.error('❌ Session error:', error)
        if (mounted) {
          setUser(null)
          setLoading(false)
        }
      }
    }

    getInitialSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return

        switch (event) {
          case 'SIGNED_IN':
            if (session?.user) {
              setUser({
                id: session.user.id,
                email: session.user.email
              })
            }
            setLoading(false)
            break
            
          case 'SIGNED_OUT':
            setUser(null)
            setLoading(false)
            break
            
          case 'TOKEN_REFRESHED':
            if (session?.user) {
              setUser({
                id: session.user.id,
                email: session.user.email
              })
            }
            break
            
          default:
            setLoading(false)
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  return { user, loading, signOut }
}

/**
 * 🎯 BENEFITS OF THIS APPROACH:
 * 
 * ✅ Single responsibility - only handles auth state
 * ✅ Clean separation of concerns
 * ✅ Proper cleanup and memory management
 * ✅ TypeScript strict compliance
 * ✅ Optimized re-renders with useCallback
 * ✅ Race condition protection with mounted flag
 * ✅ Comprehensive error handling
 */