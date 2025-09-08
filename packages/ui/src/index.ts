export { Button } from './components/Button'
export { Input } from './components/Input'
export { LoginForm } from './components/LoginForm'
export { ModernInput } from './components/ModernInput'
export { ModernLoginForm } from './components/ModernLoginForm'
export { MadBoatLogo } from './components/MadBoatLogo'
export { AestheticBackground } from './components/AestheticBackground'
export { DarkMadBoatLogo } from './components/DarkMadBoatLogo'
export { DarkLoginForm } from './components/DarkLoginForm'
export { DarkBackground } from './components/DarkBackground'
export { HeroLoginPage } from './components/HeroLoginPage'
export { ClientOnly } from './components/ClientOnly'

// HUD Layout System
export { AppHeader } from './components/AppHeader'
export { AppFooter } from './components/AppFooter'
export { AppLayout } from './components/AppLayout'
// Legacy Constellation Components (deprecated)
export { ConstellationDashboard } from './components/ConstellationDashboard'
export { MobileConstellationDashboard } from './components/MobileConstellationDashboard'
export { 
  ResponsiveConstellationDashboard,
  SmartConstellationDashboard,
  ConstellationModeIndicator,
  useConstellationMode
} from './components/ResponsiveConstellationDashboard'

// New Lighthouse Dashboard System
export { LighthouseDashboard } from './components/LighthouseDashboard'
export { ClientOnlyLighthouseDashboard } from './components/ClientOnlyLighthouseDashboard'
export type { UserTier, WorldId, LighthouseDashboardProps } from './components/LighthouseDashboard'

// Executive Progression Path System
export { ExecutiveProgressionPath } from './components/ExecutiveProgressionPath'

// Timeline Page (GitKraken-inspired)
export { TimelinePage } from './components/TimelinePage'

// HUD Interface System
export { HUDInterface } from './components/HUDInterface'
export { ExecutiveHUD } from './components/ExecutiveHUD'
export { ExecutiveHUDOptimistic } from './components/ExecutiveHUDOptimistic'
export { ExecutiveHUDOptimisticActions } from './components/ExecutiveHUDOptimisticActions'

// Gamification System
export { ChallengesPage } from './components/ChallengesPage'
export { MissionsPage } from './components/MissionsPage'
export { AchievementsPage } from './components/AchievementsPage'
export { LegacyPage } from './components/LegacyPage'

// Persona Identification System - Core Freemium Module
export { PersonaIntro } from './components/PersonaIntro'
export { PersonaIdentification } from './components/PersonaIdentification'
export { PersonaResult } from './components/PersonaResult'

// Achievement Notification System
export { 
  AchievementNotification, 
  AchievementNotificationContainer, 
  useAchievementNotification 
} from './components/AchievementNotification'
export type { Achievement } from './components/AchievementNotification'

// Evolution Map System - Mapa dos Tesouros
export { EvolutionMap } from './components/EvolutionMap'
export { SkillArchipelagos } from './components/SkillArchipelagos'
export { SkillArchipelagosDebug } from './components/SkillArchipelagosDebug'
export { SkillArchipelagosFix } from './components/SkillArchipelagosFix'
export { SkillArchipelagosElegant } from './components/SkillArchipelagosElegant'
export { SimpleSkillTest } from './components/SimpleSkillTest'
export { HexagonalSkillTree } from './components/HexagonalSkillTree'
export { HexagonalSkillTreeAAA } from './components/HexagonalSkillTreeAAA'
export { HoneycombModern } from './components/HoneycombModern'
export { HoneycombSimple } from './components/HoneycombSimple'
export { HoneycombFixed } from './components/HoneycombFixed'
export { HoneycombBasic } from './components/HoneycombBasic'
export { HexTestFramer } from './components/HexTestFramer'
export { HexTestThree } from './components/HexTestThree'
export type { Treasure, TreasureState, Tier } from './components/EvolutionMap'
export type { SkillNode, Archipelago, SkillDepth, SkillState, LighthouseType } from './components/SkillArchipelagos'
export type { Hexagram, HexagramState, HexagramType, HexCoordinate } from './components/HexagonalSkillTree'
export type { Hexagram as HexagramAAA, HexagramState as HexagramStateAAA } from './components/HexagonalSkillTreeAAA'
export type { HexState, HexNode } from './components/HoneycombModern'

// React 19 Components
export { ModernLoginFormActions } from './components/ModernLoginFormActions'
export { HeroLoginPageActions } from './components/HeroLoginPageActions'
export { ConversionOptimizedHero } from './components/ConversionOptimizedHero'

// Theme System - Light & Dark Mode
export { ThemeToggle, useTheme } from './components/ThemeToggle'
export type { Theme } from './components/ThemeToggle'
export { ThemeShowcase } from './components/ThemeShowcase'
export { HeroLoginPageThemed } from './components/HeroLoginPageThemed'

// Debug Tools
export { DebugLogger } from './components/DebugLogger'

// Revolutionary Odyssey Navigator - Transformation River Experience
export { OdysseyNavigator } from './components/OdysseyNavigator'
export { OdysseyNavigatorExample } from './components/OdysseyNavigatorExample'
export type { 
  MethodProgress, 
  MethodPhase, 
  OdysseyNavigatorProps 
} from './components/OdysseyNavigator'

// Minimalist Value Display Components
export { DynamicValueOracle } from './components/DynamicValueOracle'
export { MinimalistJourneyMap } from './components/MinimalistJourneyMap'
export { AudienceSelector } from './components/AudienceSelector'

// Horizontal Parallax Journey System
export { HorizontalParallaxJourney } from './components/HorizontalParallaxJourney'
export { HorizontalSnapJourney } from './components/HorizontalSnapJourney'

// Cinematic Journey System
export { CinematicJourney } from './components/CinematicJourney'
export { SceneElements, FloatingParticles, WaveBackground } from './components/CinematicElements'
export { ShipWheel, ShipWheelBackground } from './components/ShipWheel'

// Epic Persona Discovery System
export { EpicPersonaDiscovery } from './components/EpicPersonaDiscovery'

// Legacy type exports for backwards compatibility
export type { World } from './components/ConstellationDashboard'

// Hooks
export { useConstellationDashboard, dashboardUtils } from './hooks/useConstellationDashboard'
export type { 
  DashboardUser, 
  DashboardActions, 
  ConstellationDashboardHook 
} from './hooks/useConstellationDashboard'