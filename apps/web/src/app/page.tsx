"use client"

import { Suspense, useMemo } from 'react'
import { HeroLoginPageActions, ExecutiveHUD, ClientOnly } from '@madboat/ui'
import { loginAction, signupAction } from '@/actions/auth-actions'
import { useAuthState } from '@/hooks/use-auth-state'

interface AuthLoadingProps {
  message?: string
}

const AuthLoading = ({ message = "Carregando..." }: AuthLoadingProps) => (
  <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      <span className="text-white/60 text-sm">{message}</span>
    </div>
  </div>
)

interface DashboardProps {
  user: {
    email: string | undefined
    id: string
  }
  onLogout: () => Promise<void>
}

const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const userName = useMemo(() => 
    user.email?.split('@')[0] || 'Navigator', 
    [user.email]
  )

  return (
    <div className="min-h-screen bg-zinc-950 relative">
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
      />
      
      <button
        onClick={onLogout}
        className="absolute top-4 right-20 p-2 bg-red-600/20 border border-red-600/50 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors z-50 text-xs backdrop-blur-sm"
        title="Logout"
        aria-label="Sair da aplicação"
      >
        Sair
      </button>
    </div>
  )
}

export default function HomePage() {
  const { user, loading, signOut } = useAuthState()

  if (loading) {
    return <AuthLoading message="Verificando autenticação..." />
  }

  if (user) {
    return (
      <ClientOnly fallback={<AuthLoading message="Preparando dashboard..." />}>
        <Suspense fallback={<AuthLoading message="Carregando interface..." />}>
          <Dashboard user={user} onLogout={signOut} />
        </Suspense>
      </ClientOnly>
    )
  }

  return (
    <Suspense fallback={<AuthLoading message="Carregando login..." />}>
      <HeroLoginPageActions
        loginAction={loginAction}
        signupAction={signupAction}
      />
    </Suspense>
  )
}