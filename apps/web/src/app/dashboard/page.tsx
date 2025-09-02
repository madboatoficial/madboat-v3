"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { 
  LighthouseDashboard,
  type UserTier,
  type WorldId 
} from '@madboat/ui'

export default function DashboardPage() {
  const router = useRouter()
  
  // Mock user data - in real app this would come from auth/database
  const mockUser = {
    tier: 'premium' as UserTier,
    name: 'Demo User',
    level: 1,
    currentWorld: 'alma' as WorldId,
    completedWorlds: ['alma'] as WorldId[],
    achievements: 5,
    treasures: 12
  }
  
  const handlePersonaTest = () => router.push('/persona-test')
  const handleWorldAccess = (world: WorldId) => router.push(`/world/${world}`)
  const handleUpgrade = () => router.push('/pricing')
  const handleAction = (action: string) => {
    console.log('Dashboard action:', action)
    // Handle various dashboard actions based on action string
  }

  return (
    <LighthouseDashboard
      userTier={mockUser.tier}
      userName={mockUser.name}
      userLevel={mockUser.level}
      currentWorld={mockUser.currentWorld}
      completedWorlds={mockUser.completedWorlds}
      achievements={mockUser.achievements}
      treasures={mockUser.treasures}
      onPersonaTest={handlePersonaTest}
      onWorldAccess={handleWorldAccess}
      onUpgrade={handleUpgrade}
      onAction={handleAction}
    />
  )
}

// Exemplo de como usar para diferentes tipos de usuário:

/* 
// LEAD (usuário gratuito)
<ConstellationDashboard
  userTier="lead"
  userName="João Silva"
  completedWorlds={[]}
  achievements={0}
  treasures={0}
  onPersonaTest={() => router.push('/persona-test')}
  onWorldAccess={(world) => world === 'alma' ? router.push('/world/alma') : handleUpgrade()}
  onUpgrade={() => router.push('/pricing')}
/>

// PREMIUM (pagante)
<ConstellationDashboard
  userTier="premium"
  userName="Maria Santos"
  completedWorlds={['alma']}
  achievements={5}
  treasures={12}
  onPersonaTest={() => {}} // não aplicável
  onWorldAccess={(world) => router.push(`/world/${world}`)}
  onUpgrade={() => {}} // já é premium
/>

// ENTERPRISE (tudo liberado)
<ConstellationDashboard
  userTier="enterprise"
  userName="Carlos CEO"
  completedWorlds={['alma', 'vortice']}
  achievements={15}
  treasures={45}
  onPersonaTest={() => {}} // não aplicável
  onWorldAccess={(world) => router.push(`/world/${world}`)}
  onUpgrade={() => {}} // já tem tudo
/>
*/