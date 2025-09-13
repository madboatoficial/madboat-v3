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

// Animation System (TODO: Create when needed)
// export { OceanWaves } from './animations/OceanWaves'

// Error Boundaries (TODO: Create when needed for Next.js 15)
// export { ErrorBoundary, GlobalErrorBoundary } from './error'

// Hooks (Only existing ones)
export { useConstellationDashboard, dashboardUtils } from './hooks/useConstellationDashboard'

// Core Types (only existing ones)
export type {
  PersonaClassificationResult,
  PersonaQuestion,
  QuestionResponse
} from './types'