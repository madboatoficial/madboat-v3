/**
 * 📱💻 RESPONSIVE CONSTELLATION DASHBOARD
 * 
 * Wrapper inteligente que automaticamente alterna entre:
 * - ConstellationDashboard (desktop/tablet)
 * - MobileConstellationDashboard (mobile)
 * 
 * Baseado em breakpoints e detecção de dispositivo.
 * Mantém a mesma API para facilitar a implementação.
 */

"use client"

import React, { useState, useEffect } from 'react'
import { ConstellationDashboard } from './ConstellationDashboard'
import { MobileConstellationDashboard } from './MobileConstellationDashboard'
import type { UserTier, World } from './ConstellationDashboard'

interface ResponsiveConstellationDashboardProps {
  userTier: UserTier
  userName: string
  completedWorlds: World[]
  achievements: number
  treasures: number
  onPersonaTest: () => void
  onWorldAccess: (world: World) => void
  onUpgrade: () => void
  // Configurações opcionais
  forceMode?: 'desktop' | 'mobile' | 'auto'
  mobileBreakpoint?: number
}

function useResponsiveMode(
  forceMode: 'desktop' | 'mobile' | 'auto' = 'auto',
  breakpoint: number = 768
) {
  const [mode, setMode] = useState<'desktop' | 'mobile'>('desktop')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    if (forceMode !== 'auto') {
      setMode(forceMode)
      return
    }

    const updateMode = () => {
      const isMobile = window.innerWidth < breakpoint
      setMode(isMobile ? 'mobile' : 'desktop')
    }

    // Set initial mode
    updateMode()

    // Listen for resize events
    window.addEventListener('resize', updateMode)
    
    // Listen for orientation change on mobile devices
    window.addEventListener('orientationchange', () => {
      // Small delay to ensure dimensions are updated after orientation change
      setTimeout(updateMode, 100)
    })

    return () => {
      window.removeEventListener('resize', updateMode)
      window.removeEventListener('orientationchange', updateMode)
    }
  }, [forceMode, breakpoint])

  return { mode, isClient }
}

export function ResponsiveConstellationDashboard({
  forceMode = 'auto',
  mobileBreakpoint = 768,
  ...props
}: ResponsiveConstellationDashboardProps) {
  const { mode, isClient } = useResponsiveMode(forceMode, mobileBreakpoint)

  // Render a minimal loading state during hydration to prevent flash
  if (!isClient) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-zinc-400 text-sm animate-pulse">
          Inicializando constelação...
        </div>
      </div>
    )
  }

  // Render appropriate dashboard based on mode
  if (mode === 'mobile') {
    return <MobileConstellationDashboard {...props} />
  }

  return <ConstellationDashboard {...props} />
}

// Hook personalizado para componentes que precisam saber o modo atual
export function useConstellationMode(
  forceMode: 'desktop' | 'mobile' | 'auto' = 'auto',
  breakpoint: number = 768
) {
  const { mode, isClient } = useResponsiveMode(forceMode, breakpoint)
  
  return {
    mode,
    isClient,
    isMobile: mode === 'mobile',
    isDesktop: mode === 'desktop',
    // Utilitários para diferentes contextos
    getLayoutClasses: () => ({
      container: mode === 'mobile' ? 'p-4' : 'p-8',
      card: mode === 'mobile' ? 'rounded-xl p-4' : 'rounded-2xl p-6',
      text: mode === 'mobile' ? 'text-sm' : 'text-base',
      spacing: mode === 'mobile' ? 'space-y-4' : 'space-y-6'
    }),
    // Configurações específicas por modo
    getConfig: () => ({
      animations: mode === 'mobile' ? 'reduced' : 'full',
      interactions: mode === 'mobile' ? 'touch' : 'mouse',
      density: mode === 'mobile' ? 'compact' : 'comfortable'
    })
  }
}

// Componente de debug para desenvolvimento
export function ConstellationModeIndicator() {
  const { mode, isClient, isMobile } = useConstellationMode()

  if (!isClient) return null

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-zinc-800/90 text-white px-3 py-1 rounded-full text-xs font-mono backdrop-blur-sm border border-zinc-700/50">
      📱 {mode} {isMobile && '(touch)'}
    </div>
  )
}

// Wrapper com detecção automática de plataforma
export function SmartConstellationDashboard(props: Omit<ResponsiveConstellationDashboardProps, 'forceMode'>) {
  const [platformMode, setPlatformMode] = useState<'desktop' | 'mobile' | 'auto'>('auto')

  useEffect(() => {
    // Detectar plataforma baseado em user agent e capacidades
    const detectPlatform = () => {
      const ua = navigator.userAgent.toLowerCase()
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      const isTablet = /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)
      const isMobile = /mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua)
      
      // Preferir mobile para dispositivos touch pequenos
      if (isMobile && isTouchDevice) {
        setPlatformMode('mobile')
      } 
      // Tablets podem usar desktop layout se a tela for grande o suficiente
      else if (isTablet && window.innerWidth >= 768) {
        setPlatformMode('desktop')
      }
      // Default para auto (baseado apenas no tamanho da tela)
      else {
        setPlatformMode('auto')
      }
    }

    detectPlatform()
  }, [])

  return (
    <ResponsiveConstellationDashboard 
      {...props} 
      forceMode={platformMode}
    />
  )
}

// Re-export dos tipos necessários
export type { UserTier, World } from './ConstellationDashboard'