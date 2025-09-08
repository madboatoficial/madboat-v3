/**
 * ⏰ TIMELINE PAGE - GitKraken Style Timeline
 * Using the original LegacyPage component with AppLayout
 */

"use client"

import { useAuthState } from '@/hooks/use-auth-state'
import { useRouter } from 'next/navigation'
import { LegacyPage } from '@madboat/ui'
import { AppLayout } from '@/layouts/AppLayout'

export default function TimelinePage() {
  const { user, loading, signOut } = useAuthState()
  const router = useRouter()

  if (loading) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full mx-auto mb-4 animate-spin" />
          <p className="text-white/60 text-sm">Carregando timeline...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    router.push('/')
    return null
  }

  const userName = user.email?.split('@')[0] || 'Navigator'

  const handleNavigate = (page: string) => {
    switch (page) {
      case 'dashboard':
        router.push('/')
        break
      case 'progresso':
        router.push('/progresso')
        break
      case 'timeline':
        router.push('/timeline')
        break
      case 'desafios':
        console.log('🎯 Desafios - Em desenvolvimento')
        break
      case 'missoes':
        console.log('🗡️ Missões - Em desenvolvimento')
        break
      case 'conquistas':
        console.log('🏆 Conquistas - Em desenvolvimento')
        break
      case 'produtos':
        console.log('📦 Produtos - Em desenvolvimento')
        break
      default:
        console.log('📄 Page navigation:', page)
    }
  }

  return (
    <AppLayout
      pageType="timeline"
      user={user}
      userName={userName}
      onLogout={signOut}
      onNavigate={handleNavigate}
    >
      <LegacyPage
        userName={userName}
        onNavigate={handleNavigate}
      />
    </AppLayout>
  )
}