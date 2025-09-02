import { useState, useEffect } from 'react'
// Legacy compatibility with both old and new systems
import type { UserTier, World } from '../components/ConstellationDashboard'
import type { WorldId } from '../components/LighthouseDashboard'

export interface DashboardUser {
  id: string
  name: string
  tier: UserTier
  completedWorlds: World[]
  achievements: number
  treasures: number
  hasCompletedPersonaTest: boolean
}

export interface DashboardActions {
  onPersonaTest: () => void
  onWorldAccess: (world: World) => void
  onUpgrade: () => void
}

export interface ConstellationDashboardHook {
  user: DashboardUser
  actions: DashboardActions
  canAccessWorld: (world: World) => boolean
  getWorldStatus: (world: World) => 'accessible' | 'locked' | 'completed'
  getUpgradeMessage: () => string
  getProgressPercentage: () => number
}

/**
 * 🌊 Hook customizado para gerenciar o estado e lógica do Constellation Dashboard
 * 
 * Centraliza toda a lógica de negócio, permissões e estados do dashboard,
 * mantendo os componentes limpos e focados apenas na apresentação visual.
 * 
 * @param userId - ID do usuário (para buscar dados)
 * @param onNavigate - Função para navegação entre páginas
 */
export function useConstellationDashboard(
  userId: string,
  onNavigate: (path: string) => void
): ConstellationDashboardHook {
  
  // Estado do usuário (normalmente viria de uma API/store)
  const [user, setUser] = useState<DashboardUser>({
    id: userId,
    name: 'Explorador Digital',
    tier: 'lead',
    completedWorlds: [],
    achievements: 0,
    treasures: 0,
    hasCompletedPersonaTest: false
  })

  // Simular carregamento de dados do usuário
  useEffect(() => {
    // Em uma aplicação real, aqui faria a chamada para API
    const loadUserData = async () => {
      try {
        // const userData = await getUserData(userId)
        // setUser(userData)
        
        // Mock data para exemplo
        console.log(`🌊 Carregando dados para usuário: ${userId}`)
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error)
      }
    }

    loadUserData()
  }, [userId])

  // Verificar se usuário pode acessar um mundo
  const canAccessWorld = (world: World): boolean => {
    switch (user.tier) {
      case 'lead':
        return world === 'alma'
      case 'premium':
        return ['alma', 'vortice'].includes(world)
      case 'enterprise':
        return true
      default:
        return false
    }
  }

  // Obter status visual do mundo
  const getWorldStatus = (world: World): 'accessible' | 'locked' | 'completed' => {
    if (user.completedWorlds.includes(world)) {
      return 'completed'
    }
    return canAccessWorld(world) ? 'accessible' : 'locked'
  }

  // Mensagem de upgrade contextual
  const getUpgradeMessage = (): string => {
    switch (user.tier) {
      case 'lead':
        return 'Desbloqueie Vórtice e acelere sua transformação'
      case 'premium':
        return 'Acesse Odisseia e complete sua jornada de maestria'
      case 'enterprise':
        return 'Você já tem acesso completo!'
      default:
        return 'Faça upgrade para acessar mais mundos'
    }
  }

  // Calcular porcentagem de progresso geral
  const getProgressPercentage = (): number => {
    const totalWorlds = 3
    const completedCount = user.completedWorlds.length
    const achievementBonus = Math.min(user.achievements / 50, 0.3) // Máximo 30% bonus
    
    const baseProgress = (completedCount / totalWorlds) * 70 // 70% base
    const bonusProgress = achievementBonus * 30 // 30% bonus
    
    return Math.round(baseProgress + bonusProgress)
  }

  // Ações do dashboard
  const actions: DashboardActions = {
    
    onPersonaTest: () => {
      console.log('🧭 Iniciando teste de persona...')
      
      if (user.hasCompletedPersonaTest) {
        console.log('⚠️ Usuário já completou o teste')
        return
      }

      // Navegar para teste de persona
      onNavigate('/persona-test')
      
      // Tracking/Analytics
      // trackEvent('persona_test_started', { userId: user.id, tier: user.tier })
    },

    onWorldAccess: (world: World) => {
      console.log(`🌟 Tentativa de acesso ao mundo: ${world}`)
      
      if (!canAccessWorld(world)) {
        console.log(`🔒 Acesso negado ao mundo ${world} para tier ${user.tier}`)
        
        // Mostrar modal de upgrade ou toast informativo
        // showUpgradeModal(world)
        
        // Tracking
        // trackEvent('world_access_denied', { world, userTier: user.tier })
        return
      }

      // Sucesso - navegar para o mundo
      console.log(`✨ Acesso liberado para ${world}`)
      onNavigate(`/world/${world}`)
      
      // Tracking
      // trackEvent('world_accessed', { world, userTier: user.tier })
    },

    onUpgrade: () => {
      console.log('👑 Iniciando processo de upgrade...')
      
      // Determinar qual upgrade mostrar
      const targetTier = user.tier === 'lead' ? 'premium' : 'enterprise'
      
      // Navegar para página de upgrade
      onNavigate(`/upgrade?from=${user.tier}&to=${targetTier}`)
      
      // Tracking
      // trackEvent('upgrade_initiated', { 
      //   currentTier: user.tier, 
      //   targetTier,
      //   completedWorlds: user.completedWorlds.length 
      // })
    }
  }

  return {
    user,
    actions,
    canAccessWorld,
    getWorldStatus,
    getUpgradeMessage,
    getProgressPercentage
  }
}

// Utilitários para componentes que usam o hook
export const dashboardUtils = {
  
  // Obter cor do tier do usuário
  getTierColor: (tier: UserTier): string => {
    const colors = {
      lead: 'text-blue-400',
      premium: 'text-purple-400', 
      enterprise: 'text-amber-400'
    }
    return colors[tier] || 'text-zinc-400'
  },

  // Obter badge do tier
  getTierBadge: (tier: UserTier): string => {
    const badges = {
      lead: '🌊 Explorador',
      premium: '⚡ Transformador',
      enterprise: '👑 Mestre'
    }
    return badges[tier] || '🎯 Usuário'
  },

  // Formatar número de conquistas
  formatAchievements: (count: number): string => {
    if (count === 0) return 'Nenhuma conquista ainda'
    if (count === 1) return '1 conquista desbloqueada'
    return `${count} conquistas desbloqueadas`
  },

  // Formatar número de estratégias
  formatTreasures: (count: number): string => {
    if (count === 0) return 'Nenhuma estratégia coletada'
    if (count === 1) return '1 estratégia no tesouro'
    return `${count} estratégias no tesouro`
  }
}