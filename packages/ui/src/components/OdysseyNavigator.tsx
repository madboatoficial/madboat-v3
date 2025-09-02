/**
 * 🌊 ODYSSEY NAVIGATOR - Transformation River Experience
 * 
 * CONCEITO REVOLUCIONÁRIO:
 * ========================
 * Abandona completamente dashboards tradicionais para criar uma experiência
 * de "contemplação da jornada transformadora" - como observar um rio fluir
 * do alto de um penhasco, vendo toda a trajetória de transformação.
 * 
 * ARQUITETURA VISUAL:
 * ===================
 * 
 * 🎯 HERO FOCUS (60% da tela)
 * - Método atual em destaque dramático
 * - Visual que evolui com o progresso
 * - CTA magnético para próxima ação
 * - Conquistas como "ilhas descobertas"
 * 
 * 🌊 TRANSFORMATION RIVER (30% da tela) 
 * - Fluxo vertical que conecta todos os mundos
 * - Cada mundo é um "meandro" no rio
 * - Estados locked/unlocked como corredeiras
 * - Animações oceânicas sutis
 * 
 * 🏆 ACHIEVEMENT HORIZON (10% da tela)
 * - Milestones como constelações no horizonte
 * - Próximas recompensas visualmente atrativas
 * - Progresso geral da transformação
 * 
 * FILOSOFIA DE DESIGN:
 * ====================
 * "O rio da transformação nunca para de fluir. Cada tripulante
 * navega sua própria corrente, mas todos fazem parte do mesmo
 * oceano de possibilidades. A contemplação precede a ação."
 * 
 * PALETA EMOCIONAL:
 * =================
 * - Deep Ocean: #0f1419 (base contemplativa)
 * - Cosmic Blue: #1e3a8a (confiança A.L.M.A.)  
 * - Transformation Gold: #f59e0b (conquistas)
 * - Mystical Purple: #7c3aed (Vórtice)
 * - Passion Red: #dc2626 (Odisseia)
 * - Discovery Silver: #64748b (Personas)
 * 
 * @author Mandarin Fish (Transformation River Artist)
 */

"use client"

import React, { useState, useEffect, useRef } from 'react'
import { 
  Search,
  Compass, 
  Zap, 
  Crown,
  Star,
  Sparkles,
  ArrowRight,
  Play,
  Lock,
  Trophy,
  Target,
  ChevronDown,
  Circle,
  CheckCircle2,
  MapPin,
  Waves,
  Eye,
  Heart,
  ShipWheel,
  User,
  Settings,
  MessageCircle
} from 'lucide-react'

export type UserTier = 'lead' | 'premium' | 'enterprise'
export type WorldId = 'personas' | 'alma' | 'vortice' | 'odisseia'
export type MethodPhase = 'locked' | 'available' | 'in_progress' | 'milestone_ready' | 'completed'

export interface MethodProgress {
  worldId: WorldId
  phase: MethodPhase
  completedPhases: number
  totalPhases: number
  currentPhaseName: string
  nextAction: string
  milestones: string[]
  completedMilestones: number
}

export interface OdysseyNavigatorProps {
  userTier: UserTier
  userName: string
  userLevel: number
  currentMethod: WorldId
  methodsProgress: MethodProgress[]
  achievements: number
  treasures: number
  onMethodAccess: (method: WorldId) => void
  onAction: (action: string) => void
  onUpgrade: () => void
}

interface MethodConfig {
  id: WorldId
  name: string
  subtitle: string
  description: string
  icon: React.ReactNode
  minTier: UserTier
  colors: {
    primary: string
    secondary: string
    accent: string
    glow: string
    river: string
  }
  sequence: number
}

const methods: MethodConfig[] = [
  {
    id: 'personas',
    name: 'Personas',
    subtitle: 'Descoberta Interior',
    description: 'Identifique seu perfil único e receba estratégias personalizadas',
    icon: <Search size={24} />,
    minTier: 'lead',
    sequence: 1,
    colors: {
      primary: 'from-slate-400 to-slate-600',
      secondary: 'from-slate-500 to-slate-700', 
      accent: 'text-slate-300',
      glow: 'shadow-slate-400/30',
      river: 'bg-gradient-to-b from-slate-500/20 to-transparent'
    }
  },
  {
    id: 'alma',
    name: 'A.L.M.A.',
    subtitle: 'Despertar da Consciência',
    description: 'Jornada através das 4 fases de transformação digital',
    icon: <Compass size={24} />,
    minTier: 'lead',
    sequence: 2,
    colors: {
      primary: 'from-blue-400 to-amber-500',
      secondary: 'from-blue-500 to-amber-600',
      accent: 'text-blue-300',
      glow: 'shadow-blue-400/30',
      river: 'bg-gradient-to-b from-blue-500/20 via-amber-500/10 to-transparent'
    }
  },
  {
    id: 'vortice',
    name: 'Vórtice',
    subtitle: 'Transformação Profunda',
    description: 'Metodologias avançadas para crescimento e engajamento',
    icon: <Zap size={24} />,
    minTier: 'premium',
    sequence: 3,
    colors: {
      primary: 'from-purple-400 to-pink-500',
      secondary: 'from-purple-500 to-pink-600',
      accent: 'text-purple-300',
      glow: 'shadow-purple-400/30',
      river: 'bg-gradient-to-b from-purple-500/20 via-pink-500/10 to-transparent'
    }
  },
  {
    id: 'odisseia',
    name: 'Odisseia',
    subtitle: 'Jornada da Maestria',
    description: 'Os 5 níveis de excelência em transformação digital',
    icon: <Crown size={24} />,
    minTier: 'enterprise',
    sequence: 4,
    colors: {
      primary: 'from-red-400 to-amber-500',
      secondary: 'from-red-500 to-amber-600',
      accent: 'text-red-300',
      glow: 'shadow-red-400/30',
      river: 'bg-gradient-to-b from-red-500/20 via-amber-500/10 to-transparent'
    }
  }
]

const HeroSection: React.FC<{
  method: MethodConfig
  progress: MethodProgress
  userTier: UserTier
  onAction: () => void
}> = ({ method, progress, userTier, onAction }) => {
  const isAccessible = userTier === 'enterprise' || 
    (userTier === 'premium' && method.minTier !== 'enterprise') ||
    (userTier === 'lead' && method.minTier === 'lead')

  const progressPercentage = (progress.completedPhases / progress.totalPhases) * 100
  
  return (
    <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
      {/* Hero Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${method.colors.primary} opacity-5`} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-slate-900/20 to-slate-950" />
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 bg-gradient-to-r ${method.colors.primary} rounded-full animate-float opacity-30`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center space-y-8 max-w-4xl mx-auto px-8">
        
        {/* Method Icon & Status */}
        <div className="flex flex-col items-center space-y-6">
          <div className={`relative p-8 bg-gradient-to-br ${method.colors.secondary} rounded-full ${method.colors.glow} shadow-2xl`}>
            {method.icon}
            
            {/* Progress Ring */}
            <div className="absolute inset-0 rounded-full">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="48"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="2"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="48"
                  stroke="url(#progressGradient)"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${progressPercentage * 3.014} 301.4`}
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* Method Title */}
          <div className="space-y-2">
            <h1 className="text-5xl font-bold text-white tracking-tight">
              {method.name}
            </h1>
            <p className={`text-xl ${method.colors.accent} font-medium`}>
              {method.subtitle}
            </p>
          </div>
        </div>

        {/* Progress Status */}
        <div className="bg-slate-900/40 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/30">
          <div className="flex items-center justify-between mb-4">
            <div className="text-left">
              <p className="text-slate-400 text-sm">Progresso Atual</p>
              <p className="text-white font-semibold text-lg">
                {progress.completedPhases}/{progress.totalPhases} fases concluídas
              </p>
            </div>
            <div className="text-right">
              <p className="text-slate-400 text-sm">Fase Atual</p>
              <p className="text-white font-semibold">{progress.currentPhaseName}</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-slate-800 rounded-full h-2">
            <div 
              className={`h-2 bg-gradient-to-r ${method.colors.primary} rounded-full transition-all duration-1000 ease-out`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Call to Action */}
        {isAccessible ? (
          <button
            onClick={onAction}
            className={`group relative px-12 py-4 bg-gradient-to-r ${method.colors.primary} text-white font-bold text-lg rounded-full hover:scale-105 transition-all duration-300 ${method.colors.glow} hover:shadow-xl`}
          >
            <div className="flex items-center gap-3">
              <Play size={20} />
              <span>{progress.nextAction}</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </div>
            
            {/* Button Glow Effect */}
            <div className={`absolute inset-0 bg-gradient-to-r ${method.colors.primary} rounded-full opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300`} />
          </button>
        ) : (
          <div className="text-center space-y-4">
            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/30">
              <Lock size={32} className="text-slate-500 mx-auto mb-2" />
              <p className="text-slate-400">
                Upgrade necessário para acessar {method.name}
              </p>
            </div>
          </div>
        )}

        {/* Milestone Islands */}
        {progress.milestones.length > 0 && (
          <div className="flex justify-center space-x-6 mt-8">
            {progress.milestones.map((milestone, index) => (
              <div
                key={index}
                className={`flex flex-col items-center space-y-2 ${
                  index < progress.completedMilestones ? 'opacity-100' : 'opacity-50'
                }`}
              >
                <div className={`p-3 rounded-full ${
                  index < progress.completedMilestones 
                    ? `bg-gradient-to-br from-amber-400 to-amber-600 shadow-amber-400/30` 
                    : 'bg-slate-800 border border-slate-600'
                } shadow-lg transition-all duration-300`}>
                  {index < progress.completedMilestones ? (
                    <Star size={16} className="text-white fill-current" />
                  ) : (
                    <Circle size={16} className="text-slate-500" />
                  )}
                </div>
                <span className="text-xs text-slate-400 text-center max-w-20">
                  {milestone}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const TransformationRiver: React.FC<{
  methods: MethodConfig[]
  currentMethod: WorldId
  methodsProgress: MethodProgress[]
  userTier: UserTier
  onMethodChange: (method: WorldId) => void
}> = ({ methods, currentMethod, methodsProgress, userTier, onMethodChange }) => {
  return (
    <div className="relative h-[30vh] overflow-hidden">
      {/* River Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/20 via-slate-800/10 to-transparent" />
      
      {/* River Flow */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-blue-500/30 via-purple-500/20 to-transparent h-full" />
      
      <div className="relative z-10 flex flex-col items-center justify-center h-full space-y-8">
        
        {/* Methods Flow */}
        <div className="flex items-center space-x-8">
          {methods.map((method, index) => {
            const progress = methodsProgress.find(p => p.worldId === method.id)
            const isActive = method.id === currentMethod
            const isAccessible = userTier === 'enterprise' || 
              (userTier === 'premium' && method.minTier !== 'enterprise') ||
              (userTier === 'lead' && method.minTier === 'lead')
            
            const getPhaseColor = () => {
              if (!progress) return 'bg-slate-800 border-slate-600'
              
              switch (progress.phase) {
                case 'completed': return `bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-emerald-400/30`
                case 'milestone_ready': return `bg-gradient-to-br from-amber-400 to-amber-600 shadow-amber-400/30`
                case 'in_progress': return `bg-gradient-to-br ${method.colors.primary} ${method.colors.glow}`
                case 'available': return 'bg-slate-700 border-slate-500 hover:bg-slate-600'
                default: return 'bg-slate-900 border-slate-700'
              }
            }

            return (
              <div key={method.id} className="flex flex-col items-center space-y-3">
                
                {/* Method Node */}
                <button
                  onClick={() => isAccessible && onMethodChange(method.id)}
                  disabled={!isAccessible}
                  className={`relative p-4 rounded-full transition-all duration-300 ${
                    isActive ? 'scale-110' : 'scale-100 hover:scale-105'
                  } ${getPhaseColor()} ${!isAccessible ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {React.isValidElement(method.icon) && React.cloneElement(method.icon, { 
                    size: isActive ? 20 : 16,
                    className: progress?.phase === 'completed' ? 'text-white' : 'text-slate-300'
                  } as any)}
                  
                  {/* Status Indicator */}
                  <div className="absolute -top-1 -right-1">
                    {progress?.phase === 'completed' && (
                      <CheckCircle2 size={12} className="text-emerald-400 bg-slate-900 rounded-full" />
                    )}
                    {progress?.phase === 'milestone_ready' && (
                      <Star size={12} className="text-amber-400 bg-slate-900 rounded-full fill-current" />
                    )}
                    {!isAccessible && (
                      <Lock size={12} className="text-slate-500 bg-slate-900 rounded-full" />
                    )}
                  </div>
                </button>

                {/* Method Name */}
                <div className="text-center">
                  <p className={`text-sm font-medium transition-colors ${
                    isActive ? 'text-white' : 'text-slate-400'
                  }`}>
                    {method.name}
                  </p>
                  {progress && (
                    <p className="text-xs text-slate-500">
                      {progress.completedPhases}/{progress.totalPhases}
                    </p>
                  )}
                </div>

                {/* Connection Line */}
                {index < methods.length - 1 && (
                  <div className="absolute left-full top-1/2 w-8 h-0.5 bg-gradient-to-r from-slate-600 to-slate-700 transform -translate-y-1/2" />
                )}
              </div>
            )
          })}
        </div>

        {/* River Current Indicator */}
        <div className="flex items-center space-x-2 text-slate-500">
          <Waves size={16} />
          <span className="text-sm">Fluxo da Transformação</span>
          <ChevronDown size={16} className="animate-bounce" />
        </div>
      </div>
    </div>
  )
}

const AchievementHorizon: React.FC<{
  achievements: number
  treasures: number
  onAction: (action: string) => void
}> = ({ achievements, treasures, onAction }) => {
  return (
    <div className="relative h-[10vh] bg-gradient-to-t from-slate-900/30 to-transparent">
      <div className="absolute inset-0 flex items-center justify-center">
        
        <div className="flex items-center space-x-12">
          
          {/* Achievements */}
          <button
            onClick={() => onAction('achievements')}
            className="group flex items-center space-x-3 p-4 bg-slate-900/40 hover:bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/30 transition-all duration-300"
          >
            <Trophy size={20} className="text-amber-400" />
            <div className="text-left">
              <p className="text-white font-semibold text-sm">Conquistas</p>
              <p className="text-slate-400 text-xs">{achievements} desbloqueadas</p>
            </div>
            <ArrowRight size={16} className="text-slate-500 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Central Separator */}
          <div className="w-px h-8 bg-slate-600" />

          {/* Treasures */}
          <button
            onClick={() => onAction('treasures')}
            className="group flex items-center space-x-3 p-4 bg-slate-900/40 hover:bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/30 transition-all duration-300"
          >
            <Sparkles size={20} className="text-purple-400" />
            <div className="text-left">
              <p className="text-white font-semibold text-sm">Tesouros</p>
              <p className="text-slate-400 text-xs">{treasures} coletados</p>
            </div>
            <ArrowRight size={16} className="text-slate-500 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  )
}

const FloatingNavigation: React.FC<{
  userName: string
  onAction: (action: string) => void
}> = ({ userName, onAction }) => {
  return (
    <>
      {/* Top Navigation */}
      <div className="fixed top-6 left-6 right-6 flex justify-between items-center z-50">
        
        {/* Logo */}
        <div className="flex items-center space-x-3 p-3 bg-slate-900/50 backdrop-blur-sm rounded-full border border-slate-700/30">
          <ShipWheel size={20} className="text-white animate-spin-slow" strokeWidth={2.5} />
          <span className="text-white font-bold tracking-wide">MadBoat</span>
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onAction('chat')}
            className="p-3 bg-slate-900/50 hover:bg-slate-800/50 backdrop-blur-sm rounded-full border border-slate-700/30 transition-all duration-300"
          >
            <MessageCircle size={18} className="text-slate-300" />
          </button>
          
          <button
            onClick={() => onAction('profile')}
            className="flex items-center space-x-3 p-3 bg-slate-900/50 hover:bg-slate-800/50 backdrop-blur-sm rounded-full border border-slate-700/30 transition-all duration-300"
          >
            <User size={18} className="text-slate-300" />
            <span className="text-slate-300 text-sm hidden md:block">{userName}</span>
          </button>
          
          <button
            onClick={() => onAction('settings')}
            className="p-3 bg-slate-900/50 hover:bg-slate-800/50 backdrop-blur-sm rounded-full border border-slate-700/30 transition-all duration-300"
          >
            <Settings size={18} className="text-slate-300" />
          </button>
        </div>
      </div>

      {/* Contemplation Indicator */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex items-center space-x-2 p-3 bg-slate-900/50 backdrop-blur-sm rounded-full border border-slate-700/30">
          <Eye size={16} className="text-slate-400" />
          <span className="text-slate-400 text-sm">Contemplando a jornada</span>
          <Heart size={16} className="text-red-400 animate-pulse" />
        </div>
      </div>
    </>
  )
}

export function OdysseyNavigator({
  userTier,
  userName,
  userLevel,
  currentMethod,
  methodsProgress,
  achievements,
  treasures,
  onMethodAccess,
  onAction,
  onUpgrade
}: OdysseyNavigatorProps) {
  const [activeMethod, setActiveMethod] = useState<WorldId>(currentMethod)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const activeMethodConfig = methods.find(m => m.id === activeMethod) || methods[0]
  const activeProgress = methodsProgress.find(p => p.worldId === activeMethod)!

  const handleMethodChange = (methodId: WorldId) => {
    setActiveMethod(methodId)
    onMethodAccess(methodId)
  }

  const handleHeroAction = () => {
    onAction(`continue_${activeMethod}`)
  }

  // Smooth scroll and contemplation effects
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const scrolled = container.scrollTop
      const maxScroll = container.scrollHeight - container.clientHeight
      const scrollProgress = scrolled / maxScroll
      
      // Parallax effect on background
      const bg = container.querySelector('.parallax-bg') as HTMLElement
      if (bg) {
        bg.style.transform = `translateY(${scrollProgress * 100}px)`
      }
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-slate-950 overflow-x-hidden overflow-y-auto scrollbar-thin scrollbar-track-slate-900 scrollbar-thumb-slate-700"
    >
      {/* Dynamic Background */}
      <div className="fixed inset-0 parallax-bg">
        <div className={`absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br ${activeMethodConfig.colors.primary} opacity-[0.03] rounded-full blur-3xl animate-blob`} />
        <div className={`absolute bottom-1/4 left-1/3 w-80 h-80 bg-gradient-to-br ${activeMethodConfig.colors.secondary} opacity-[0.02] rounded-full blur-3xl animate-blob`} style={{ animationDelay: '3s' }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-slate-900/5 to-slate-950/80" />
      </div>

      {/* Floating Navigation */}
      <FloatingNavigation userName={userName} onAction={onAction} />

      {/* Main Content */}
      <div className="relative z-10 pt-20">
        
        {/* Hero Section */}
        <HeroSection
          method={activeMethodConfig}
          progress={activeProgress}
          userTier={userTier}
          onAction={handleHeroAction}
        />

        {/* Transformation River */}
        <TransformationRiver
          methods={methods}
          currentMethod={activeMethod}
          methodsProgress={methodsProgress}
          userTier={userTier}
          onMethodChange={handleMethodChange}
        />

        {/* Achievement Horizon */}
        <AchievementHorizon
          achievements={achievements}
          treasures={treasures}
          onAction={onAction}
        />

        {/* Upgrade CTA */}
        {userTier !== 'enterprise' && (
          <div className="relative z-10 py-12 px-8">
            <div className="max-w-md mx-auto text-center p-8 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl backdrop-blur-sm">
              <Crown size={32} className="text-purple-400 mx-auto mb-4" />
              <h3 className="text-white font-bold text-lg mb-2">Navegue Novos Oceanos</h3>
              <p className="text-slate-400 text-sm mb-6">
                Desbloqueie métodos avançados e explore territórios inexplorados
              </p>
              <button
                onClick={onUpgrade}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105"
              >
                Fazer Upgrade
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// CSS personalizado para animações
const styles = `
  @keyframes float {
    0%, 100% {
      transform: translateY(0px) rotate(0deg);
      opacity: 0.3;
    }
    50% {
      transform: translateY(-20px) rotate(180deg);
      opacity: 0.8;
    }
  }

  @keyframes blob {
    0%, 100% {
      transform: translate(0px, 0px) scale(1);
    }
    33% {
      transform: translate(30px, -50px) scale(1.1);
    }
    66% {
      transform: translate(-20px, 20px) scale(0.9);
    }
  }

  .animate-float {
    animation: float linear infinite;
  }

  .animate-blob {
    animation: blob 20s ease-in-out infinite;
  }

  .animate-spin-slow {
    animation: spin 10s linear infinite;
  }

  .scrollbar-thin::-webkit-scrollbar {
    width: 4px;
  }

  .scrollbar-track-slate-900::-webkit-scrollbar-track {
    background: #0f172a;
  }

  .scrollbar-thumb-slate-700::-webkit-scrollbar-thumb {
    background: #334155;
    border-radius: 2px;
  }

  .scrollbar-thumb-slate-700::-webkit-scrollbar-thumb:hover {
    background: #475569;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}