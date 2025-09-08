"use client"

import { Suspense, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { HeroLoginPageActions, ExecutiveHUD, ClientOnly } from '@madboat/ui'
import { loginAction, signupAction } from '@/actions/auth-actions'
import { useAuthState } from '@/hooks/use-auth-state'
import { 
  AuthLoadingSuspense, 
  DashboardLoadingSuspense, 
  LoginLoadingSuspense, 
  ExecutiveHUDSkeleton 
} from '@/components/suspense-fallbacks'
import { AppLayout } from '@/layouts/AppLayout'

interface DashboardProps {
  user: {
    email: string | undefined
    id: string
  }
  onLogout: () => Promise<void>
}

const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const router = useRouter()
  const userName = useMemo(() => 
    user.email?.split('@')[0] || 'Navigator', 
    [user.email]
  )

  const handleNavigate = (page: string) => {
    console.log('🧭 Navigation request:', page)
    
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
      pageType="dashboard"
      user={user}
      userName={userName}
      onLogout={onLogout}
      onNavigate={handleNavigate}
    >
      <Suspense fallback={<ExecutiveHUDSkeleton />}>
        <ExecutiveHUD
          userName={userName}
          onModuleSelect={(moduleId: string) => {
            console.log(`🎯 Module selected: ${moduleId}`)
          }}
          onActionTrigger={(moduleId: string, action: string) => {
            console.log(`⚡ Action ${action} triggered on ${moduleId}`)
          }}
          onMilestoneView={(milestone: string) => {
            console.log(`🏆 Viewing milestone: ${milestone}`)
          }}
          onPersonaClick={() => {
            router.push('/persona')
          }}
          onNavigate={handleNavigate}
        />
      </Suspense>
    </AppLayout>
  )
}

export default function HomePage() {
  const { user, loading, signOut } = useAuthState()
  const [mode, setMode] = useState<'login' | 'signup'>('login')

  if (loading) {
    return <AuthLoadingSuspense />
  }

  if (user) {
    return (
      <ClientOnly fallback={<DashboardLoadingSuspense />}>
        <Suspense fallback={<DashboardLoadingSuspense />}>
          <Dashboard user={user} onLogout={signOut} />
        </Suspense>
      </ClientOnly>
    )
  }

  return (
    <Suspense fallback={<LoginLoadingSuspense />}>
      <LoginForm
        loginAction={loginAction}
        signupAction={signupAction}
        mode={mode}
        onModeChange={setMode}
      />
    </Suspense>
  )
}

interface LoginFormProps {
  loginAction: any
  signupAction: any
  mode: 'login' | 'signup'
  onModeChange: (mode: 'login' | 'signup') => void
}

function LoginForm({
  loginAction,
  signupAction,
  mode,
  onModeChange
}: LoginFormProps) {
  return (
    <HeroLoginPageActions
      loginAction={loginAction}
      signupAction={signupAction}
      mode={mode}
      onModeChange={onModeChange}
    />
  )
}