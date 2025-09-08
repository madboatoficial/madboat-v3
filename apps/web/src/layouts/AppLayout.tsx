"use client"

import { ReactNode, Suspense } from 'react'
import { AppHeader } from './AppHeader'
import { AppFooter } from './AppFooter'
import { AuthLoadingSuspense } from '@/components/suspense-fallbacks'
import { DebugLogger } from '@madboat/ui'

export type PageType = 'dashboard' | 'desafios' | 'missoes' | 'conquistas' | 'progresso' | 'timeline' | 'produtos' | 'alma' | 'vortice' | 'odisseia'

interface AppLayoutProps {
  children: ReactNode
  pageType: PageType
  user?: {
    email: string | undefined
    id: string
  }
  userName?: string
  onLogout?: () => Promise<void>
  onNavigate?: (page: string) => void
}

export function AppLayout({
  children,
  pageType,
  user,
  userName,
  onLogout,
  onNavigate
}: AppLayoutProps) {
  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      <Suspense fallback={<div className="h-16 md:h-20 bg-slate-100 animate-pulse" />}>
        <AppHeader 
          pageType={pageType}
          user={user}
          userName={userName}
          onLogout={onLogout}
          onNavigate={onNavigate}
        />
      </Suspense>
      
      <main className="flex-1 overflow-hidden">
        <Suspense fallback={<AuthLoadingSuspense />}>
          {children}
        </Suspense>
      </main>
      
      <Suspense fallback={<div className="h-12 md:h-16 bg-slate-100 animate-pulse" />}>
        <AppFooter 
          pageType={pageType}
          onNavigate={onNavigate}
        />
      </Suspense>
      
      {/* Debug Logger - Always visible in development */}
      <DebugLogger />
    </div>
  )
}