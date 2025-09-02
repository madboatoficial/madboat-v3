/**
 * 🌟 EXEMPLOS DE INTEGRAÇÃO - Constellation Dashboard
 * 
 * Demonstra como integrar o dashboard com diferentes contextos:
 * - Autenticação (Auth0, Supabase, NextAuth, etc.)
 * - Estado global (Zustand, Redux, Context API)
 * - Roteamento (Next.js App Router, React Router)
 * - APIs e backend
 */

"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { 
  LighthouseDashboard,
  type UserTier,
  type WorldId 
} from '@madboat/ui'

// Legacy compatibility
type World = WorldId

// ========================================
// EXEMPLO 1: Integração com Auth Context
// ========================================

interface AuthUser {
  id: string
  email: string
  name: string
  subscription: 'free' | 'premium' | 'enterprise'
  progress: {
    completedWorlds: World[]
    achievements: number
    treasures: number
  }
}

// Hook simulado de autenticação
function useAuth() {
  return {
    user: {
      id: 'user-123',
      email: 'explorador@madboat.com',
      name: 'Explorador Digital',
      subscription: 'free',
      progress: {
        completedWorlds: ['alma'] as World[],
        achievements: 5,
        treasures: 12
      }
    } as AuthUser,
    loading: false,
    logout: () => console.log('Logout')
  }
}

export function DashboardWithAuth() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()

  // Mapear subscription para UserTier
  const getUserTier = (subscription: string): UserTier => {
    const tierMap: Record<string, UserTier> = {
      free: 'lead',
      premium: 'premium', 
      enterprise: 'enterprise'
    }
    return tierMap[subscription] || 'lead'
  }

  // Simplified dashboard actions for lighthouse
  const dashboardActions = {
    onPersonaTest: () => router.push('/persona-test'),
    onWorldAccess: (world: WorldId) => router.push(`/world/${world}`),
    onUpgrade: () => router.push('/pricing'),
    onAction: (action: string) => console.log('Action:', action)
  }

  if (loading) {
    return <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="text-white">Carregando sua constelação...</div>
    </div>
  }

  return (
    <div>
      {/* Header adicional com logout */}
      <div className="absolute top-4 right-4 z-20">
        <button 
          onClick={logout}
          className="text-zinc-400 hover:text-white transition-colors text-sm"
        >
          Sair
        </button>
      </div>

      <LighthouseDashboard
        userTier={getUserTier(user.subscription)}
        userName={user.name}
        userLevel={1}
        currentWorld={user.progress.completedWorlds[0] || 'personas'}
        completedWorlds={user.progress.completedWorlds as WorldId[]}
        achievements={user.progress.achievements}
        treasures={user.progress.treasures}
        onPersonaTest={dashboardActions.onPersonaTest}
        onWorldAccess={dashboardActions.onWorldAccess}
        onUpgrade={dashboardActions.onUpgrade}
        onAction={dashboardActions.onAction}
      />
    </div>
  )
}

// ========================================
// EXEMPLO 2: Integração com Estado Global (Zustand)
// ========================================

interface AppState {
  user: {
    id: string
    name: string
    tier: UserTier
    progress: {
      completedWorlds: World[]
      achievements: number
      treasures: number
    }
  }
  updateProgress: (progress: Partial<AppState['user']['progress']>) => void
  completeWorld: (world: World) => void
}

// Store simulado do Zustand
function useAppStore(): AppState {
  return {
    user: {
      id: 'zustand-user',
      name: 'Usuário Zustand',
      tier: 'premium',
      progress: {
        completedWorlds: ['alma'],
        achievements: 15,
        treasures: 28
      }
    },
    updateProgress: (progress) => console.log('Atualizando progresso:', progress),
    completeWorld: (world) => console.log(`Mundo ${world} completado!`)
  }
}

export function DashboardWithZustand() {
  const { user } = useAppStore()
  const router = useRouter()

  return (
    <LighthouseDashboard
      userTier={user.tier}
      userName={user.name}
      userLevel={1}
      currentWorld={user.progress.completedWorlds[0] || 'personas'}
      completedWorlds={user.progress.completedWorlds as WorldId[]}
      achievements={user.progress.achievements}
      treasures={user.progress.treasures}
      onPersonaTest={() => router.push('/persona-test')}
      onWorldAccess={(world) => {
        console.log(`Acessando ${world}`)
        router.push(`/world/${world}`)
        // Marcar como visitado/progresso
        // completeWorld(world) - chamaria após conclusão real
      }}
      onUpgrade={() => router.push('/pricing')}
      onAction={(action) => console.log('Action:', action)}
    />
  )
}

// ========================================
// EXEMPLO 3: Integração com API Backend
// ========================================

interface UserData {
  user: {
    id: string
    name: string
    tier: UserTier
    completedWorlds: World[]
    achievements: number
    treasures: number
  }
}

// Hook customizado para API
function useUserData(userId: string) {
  const [data, setData] = React.useState<UserData | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        // const response = await fetch(`/api/users/${userId}/dashboard`)
        // const userData = await response.json()
        
        // Mock data
        const userData: UserData = {
          user: {
            id: userId,
            name: 'Usuário API',
            tier: 'enterprise',
            completedWorlds: ['alma', 'vortice'],
            achievements: 42,
            treasures: 89
          }
        }
        
        setData(userData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchUserData()
    }
  }, [userId])

  return { data, loading, error }
}

export function DashboardWithAPI() {
  const { data, loading, error } = useUserData('api-user-123')
  const router = useRouter()

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-white animate-pulse">
          Sincronizando com as estrelas...
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-red-400">
          Erro ao carregar dashboard: {error}
        </div>
      </div>
    )
  }

  return (
    <LighthouseDashboard
      userTier={data.user.tier}
      userName={data.user.name}
      userLevel={1}
      currentWorld={data.user.completedWorlds[0] || 'personas'}
      completedWorlds={data.user.completedWorlds as WorldId[]}
      achievements={data.user.achievements}
      treasures={data.user.treasures}
      onPersonaTest={() => {
        // Tracking analytics
        // analytics.track('persona_test_started', { userId: data.user.id })
        router.push('/persona-test')
      }}
      onWorldAccess={(world) => {
        // API call para registrar acesso
        // trackWorldAccess(data.user.id, world)
        router.push(`/world/${world}`)
      }}
      onUpgrade={() => {
        // Analytics + navegação
        // analytics.track('upgrade_button_clicked', { 
        //   currentTier: data.user.tier,
        //   achievements: data.user.achievements 
        // })
        router.push('/pricing')
      }}
      onAction={(action) => console.log('Action:', action)}
    />
  )
}

// ========================================
// EXEMPLO 4: Dashboard Responsivo com Detecção de Dispositivo
// ========================================

function useDeviceType() {
  const [deviceType, setDeviceType] = React.useState<'mobile' | 'tablet' | 'desktop'>('desktop')

  React.useEffect(() => {
    const updateDeviceType = () => {
      const width = window.innerWidth
      if (width < 768) {
        setDeviceType('mobile')
      } else if (width < 1024) {
        setDeviceType('tablet')
      } else {
        setDeviceType('desktop')
      }
    }

    updateDeviceType()
    window.addEventListener('resize', updateDeviceType)
    return () => window.removeEventListener('resize', updateDeviceType)
  }, [])

  return deviceType
}

export function ResponsiveDashboard() {
  const deviceType = useDeviceType()

  // Configurações diferentes por device
  const getDeviceConfig = () => {
    switch (deviceType) {
      case 'mobile':
        return {
          showTierBadge: false,
          compactMode: true,
          gesturesEnabled: true
        }
      case 'tablet':
        return {
          showTierBadge: true,
          compactMode: false,
          gesturesEnabled: true
        }
      default:
        return {
          showTierBadge: true,
          compactMode: false,
          gesturesEnabled: false
        }
    }
  }

  const config = getDeviceConfig()

  return (
    <div className="relative">
      {/* Indicador de device type para debug */}
      <div className="absolute top-2 left-2 z-20 text-xs text-zinc-500">
        {deviceType} - {config.compactMode ? 'compact' : 'full'}
      </div>

      <LighthouseDashboard
        userTier="premium"
        userName={`Usuário ${deviceType}`}
        userLevel={1}
        currentWorld={'alma'}
        completedWorlds={['alma'] as WorldId[]}
        achievements={Math.floor(Math.random() * 20)}
        treasures={Math.floor(Math.random() * 50)}
        onPersonaTest={() => console.log(`Persona test - ${deviceType}`)}
        onWorldAccess={(world) => console.log(`World access: ${world} on ${deviceType}`)}
        onUpgrade={() => console.log(`Upgrade on ${deviceType}`)}
        onAction={(action) => console.log(`Action: ${action} on ${deviceType}`)}
      />
    </div>
  )
}

// ========================================
// EXPORTS PARA STORYBOOK E TESTES
// ========================================

export const integrationExamples = {
  DashboardWithAuth,
  DashboardWithZustand,
  DashboardWithAPI,
  ResponsiveDashboard
}

// Utilitários para testes
export const testUtils = {
  mockUser: (tier: UserTier = 'lead') => ({
    id: `test-${tier}-user`,
    name: `Teste ${tier}`,
    tier,
    completedWorlds: tier === 'enterprise' ? ['alma', 'vortice'] : tier === 'premium' ? ['alma'] : [] as WorldId[],
    achievements: tier === 'enterprise' ? 50 : tier === 'premium' ? 20 : 0,
    treasures: tier === 'enterprise' ? 100 : tier === 'premium' ? 40 : 0
  }),
  
  mockActions: () => ({
    onPersonaTest: () => console.log('🧪 Mock: Persona test'),
    onWorldAccess: (world: WorldId) => console.log(`🧪 Mock: World access - ${world}`),
    onUpgrade: () => console.log('🧪 Mock: Upgrade'),
    onAction: (action: string) => console.log(`🧪 Mock: Action - ${action}`)
  })
}