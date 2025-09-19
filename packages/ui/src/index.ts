// 🌊 MadBoat UI Package - Clean Exports After Grande Limpeza
// Only essential components remain after 74% reduction

export { Button } from './components/Button'
export { Input } from './components/Input'
export { ModernInput } from './components/ModernInput'
export { MadBoatLogo } from './components/MadBoatLogo'
export { AestheticBackground } from './components/AestheticBackground'
export { DarkMadBoatLogo } from './components/DarkMadBoatLogo'
export { DarkBackground } from './components/DarkBackground'
export { ClientOnly } from './components/ClientOnly'

// HUD Layout System
export { AppHeader } from './components/AppHeader'
export { AppFooter } from './components/AppFooter'
export { AppLayout } from './components/AppLayout'

// Evolution System
export { EvolutionMapHorizontal } from './components/EvolutionMapHorizontal'
export { PersonaIdentification } from './components/PersonaIdentification'
export { PersonaResult } from './components/PersonaResult'

// Persona Discovery System
export { EpicPersonaDiscovery } from './components/EpicPersonaDiscovery'
export { CinematicLanding } from './components/CinematicLanding'
export { SimpleLanding } from './components/SimpleLanding'
export { TestPersona } from './components/TestPersona'

// 🐙 KRAKEN ORCHESTRATED ANIMATION FRAMEWORK
export {
  MandarinFishAnimationToolkit,
  creativeVariants,
  CreativeWrapper,
  PersonaQuestionContainer,
  InteractiveElement,
  WisdomCard,
  OceanicFlow
} from './components/CreativeAnimationFramework'

export {
  UncleMcDuckPerformanceToolkit,
  LazyAnimatedWrapper,
  OptimizedQuestionContainer,
  EfficientInteractiveButton,
  PerformancePresets,
  usePerformanceOptimizedAnimation,
  useInViewAnimation,
  detectPerformanceLevel
} from './components/PerformanceOptimizedAnimations'

// Error Boundaries (existing)
export { ErrorBoundary, GlobalErrorBoundary } from './error'

// Debug utilities (create placeholder)
export const DebugLogger = {
  log: (...args: any[]) => console.log('[DEBUG]', ...args),
  error: (...args: any[]) => console.error('[ERROR]', ...args),
  warn: (...args: any[]) => console.warn('[WARN]', ...args)
}

// Dashboard Components
export { ConstellationDashboard } from './components/ConstellationDashboard'
export { LighthouseDashboard } from './components/LighthouseDashboard'

// Hooks (Only existing ones)
export { useConstellationDashboard, dashboardUtils } from './hooks/useConstellationDashboard'

// Core Types (import from @madboat/core)
export type {
  PersonaClassificationResult,
  PersonaQuestion,
  QuestionResponse
} from '@madboat/core'