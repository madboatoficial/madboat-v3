/**
 * ⏰ TIMELINE PAGE - GitKraken Style Timeline
 * Using the original LegacyPage component with AppLayout
 */

"use client"

import { useRouter } from 'next/navigation'
import { LegacyPage } from '@madboat/ui'
import { AppLayout } from '@/layouts/AppLayout'

export default function TimelinePage() {
  const router = useRouter()
  const userName = 'Navigator'
  const user = { id: 'mock-user-id', email: 'navigator@madboat.com' }

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
      onLogout={() => console.log('Logout bypassed')}
      onNavigate={handleNavigate}
    >
      <LegacyPage
        userName={userName}
        onNavigate={handleNavigate}
      />
    </AppLayout>
  )
}