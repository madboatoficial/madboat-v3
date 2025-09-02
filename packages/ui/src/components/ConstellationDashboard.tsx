/**
 * 🌟 CONSTELLATION DASHBOARD - Mapa de Constelações MadBoat
 * 
 * CONCEITO VISUAL:
 * ===============
 * Uma experiência pós-login que transforma o dashboard tradicional em um mapa
 * de constelações digitais, onde cada mundo é uma estrela com sua própria energia
 * e cor. Mantém o DNA minimalista da tela de login mas expande em escala cósmica.
 * 
 * ARQUITETURA DE EXPERIÊNCIA:
 * ===========================
 * 
 * 🔵 A.L.M.A. (Azul/Dourado) - Despertar da Consciência
 * - Mundo gratuito para leads
 * - Portal de entrada para transformação
 * - Teste de persona como anzol principal
 * 
 * 🟣 Vórtice (Roxo/Rosa) - Transformação Profunda  
 * - Premium - requer upgrade de lead
 * - Metodologias avançadas de mudança
 * - Gamificação com conquistas
 * 
 * 🔴 Odisseia (Vermelho/Dourado) - Jornada da Maestria
 * - Enterprise - 5 produtos completos
 * - Tesouro de estratégias acumuladas
 * - Nível máximo de transformação
 * 
 * DIFERENCIAÇÃO POR TIER:
 * =======================
 * 
 * LEAD (Gratuito):
 * - Acesso apenas ao A.L.M.A.
 * - CTA principal: Teste de Persona
 * - Vórtice e Odisseia aparecem "locked" mas visíveis
 * - CTA de upgrade bem posicionado
 * 
 * PREMIUM:
 * - Acesso ao A.L.M.A. + Vórtice
 * - Conquistas e progresso visíveis
 * - Odisseia locked mas aspiracional
 * 
 * ENTERPRISE:
 * - Acesso total aos 3 mundos
 * - "Tesouro" de estratégias acumuladas
 * - Conquistas e gamificação completa
 * 
 * ELEMENTOS INSTRUCTIONAIS:
 * =========================
 * - Carga cognitiva controlada (3 mundos máximo)
 * - Progressão scaffolded (ALMA -> Vórtice -> Odisseia)
 * - Affordances claras (hover states, locks, etc.)
 * - Feedback imediato (animações, cores, estados)
 * - Mental models familiares (mapa estelar)
 * 
 * TÉCNICAS VISUAIS APLICADAS:
 * ============================
 * - Glassmorphism sutil (backdrop-blur-sm)
 * - Gradientes como identidade de mundo
 * - Animações orgânicas (blob, float, pulse)
 * - Estados visuais claros (accessible, locked, completed)
 * - Micro-interações que ensinam função
 * - Hierarquia visual através de tamanho e cor
 * 
 * @author Mandarin Fish (UI Artist & Instructional Designer)
 */

"use client"

import React, { useState } from 'react'
import { 
  ShipWheel, 
  Crown, 
  Zap, 
  Compass, 
  Star, 
  Lock, 
  Play, 
  Trophy,
  Gem,
  ArrowRight,
  Sparkles
} from 'lucide-react'

export type UserTier = 'lead' | 'premium' | 'enterprise'
export type World = 'alma' | 'vortice' | 'odisseia'

interface ConstellationDashboardProps {
  userTier: UserTier
  userName: string
  completedWorlds: World[]
  achievements: number
  treasures: number
  onPersonaTest: () => void
  onWorldAccess: (world: World) => void
  onUpgrade: () => void
}

interface WorldConfig {
  id: World
  name: string
  subtitle: string
  icon: React.ReactNode
  colors: {
    from: string
    to: string
    accent: string
    glow: string
  }
  position: {
    x: string
    y: string
  }
}

const worlds: WorldConfig[] = [
  {
    id: 'alma',
    name: 'A.L.M.A.',
    subtitle: 'Despertar da Consciência',
    icon: <Compass size={24} />,
    colors: {
      from: 'from-blue-500',
      to: 'to-amber-400',
      accent: 'text-blue-400',
      glow: 'shadow-blue-400/20'
    },
    position: { x: 'left-1/4', y: 'top-1/3' }
  },
  {
    id: 'vortice',
    name: 'Vórtice',
    subtitle: 'Transformação Profunda',
    icon: <Zap size={24} />,
    colors: {
      from: 'from-purple-500',
      to: 'to-pink-500',
      accent: 'text-purple-400',
      glow: 'shadow-purple-400/20'
    },
    position: { x: 'right-1/4', y: 'top-1/4' }
  },
  {
    id: 'odisseia',
    name: 'Odisseia',
    subtitle: 'Jornada da Maestria',
    icon: <Crown size={24} />,
    colors: {
      from: 'from-red-500',
      to: 'to-amber-500',
      accent: 'text-red-400',
      glow: 'shadow-red-400/20'
    },
    position: { x: 'left-1/2', y: 'bottom-1/3' }
  }
]

const WorldConstellation: React.FC<{
  world: WorldConfig
  isAccessible: boolean
  isCompleted: boolean
  userTier: UserTier
  onClick: () => void
}> = ({ world, isAccessible, isCompleted, userTier, onClick }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div 
      className={`absolute ${world.position.x} ${world.position.y} transform -translate-x-1/2 -translate-y-1/2`}
    >
      {/* Constellation glow effect */}
      <div className={`absolute inset-0 rounded-full blur-xl transition-all duration-500 ${
        isAccessible 
          ? `bg-gradient-to-br ${world.colors.from} ${world.colors.to} opacity-20 ${isHovered ? 'scale-150 opacity-30' : 'scale-100'}`
          : 'bg-zinc-800 opacity-10'
      }`} />
      
      {/* Stars around constellation */}
      {isCompleted && (
        <>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-1 h-1 bg-amber-400 rounded-full animate-pulse`}
              style={{
                top: `${20 + Math.sin(i * 72 * Math.PI / 180) * 60}px`,
                left: `${20 + Math.cos(i * 72 * Math.PI / 180) * 60}px`,
                animationDelay: `${i * 200}ms`
              }}
            />
          ))}
        </>
      )}

      {/* Main constellation circle */}
      <button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative w-32 h-32 rounded-full border-2 transition-all duration-300 group ${
          isAccessible
            ? `border-white/20 hover:border-white/40 hover:scale-105 cursor-pointer ${world.colors.glow} hover:shadow-lg`
            : 'border-zinc-800/50 cursor-not-allowed opacity-50'
        } bg-zinc-900/50 backdrop-blur-sm`}
        disabled={!isAccessible}
      >
        {/* Icon */}
        <div className={`flex items-center justify-center mb-2 transition-colors ${
          isAccessible ? world.colors.accent : 'text-zinc-600'
        }`}>
          {world.icon}
        </div>

        {/* Lock overlay for inaccessible worlds */}
        {!isAccessible && (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/80 rounded-full">
            <Lock size={20} className="text-zinc-500" />
          </div>
        )}

        {/* Completion indicator */}
        {isCompleted && (
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center animate-bounce">
            <Star size={16} className="text-white fill-current" />
          </div>
        )}

        {/* World info */}
        <div className="text-center px-2">
          <h3 className={`font-semibold text-sm transition-colors ${
            isAccessible ? 'text-white' : 'text-zinc-600'
          }`}>
            {world.name}
          </h3>
          <p className={`text-xs transition-colors ${
            isAccessible ? 'text-zinc-400' : 'text-zinc-700'
          }`}>
            {world.subtitle}
          </p>
        </div>

        {/* Hover effect */}
        {isAccessible && (
          <div className="absolute inset-0 rounded-full border border-white/0 group-hover:border-white/20 transition-colors" />
        )}
      </button>

      {/* Floating label on hover */}
      {isHovered && isAccessible && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 bg-zinc-800 px-3 py-1 rounded-full text-xs text-white whitespace-nowrap animate-float">
          {userTier === 'lead' && world.id !== 'alma' ? 'Upgrade para acessar' : 'Explorar mundo'}
        </div>
      )}
    </div>
  )
}

export function ConstellationDashboard({
  userTier,
  userName,
  completedWorlds,
  achievements,
  treasures,
  onPersonaTest,
  onWorldAccess,
  onUpgrade
}: ConstellationDashboardProps) {
  const isWorldAccessible = (worldId: World) => {
    if (userTier === 'lead') return worldId === 'alma'
    if (userTier === 'premium') return ['alma', 'vortice'].includes(worldId)
    return true // enterprise
  }

  const isWorldCompleted = (worldId: World) => {
    return completedWorlds.includes(worldId)
  }

  return (
    <div className="min-h-screen bg-zinc-950 overflow-hidden">
      {/* Subtle cosmic background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-500/3 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-purple-500/3 rounded-full blur-3xl animate-blob" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-amber-500/3 rounded-full blur-3xl animate-blob" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative z-10 p-8">
        {/* Header com logo e boas-vindas */}
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <ShipWheel size={24} className="text-white animate-spin-slow" strokeWidth={2.5} />
            <span className="text-xl font-bold text-white tracking-wide">MadBoat</span>
          </div>
          
          <div className="text-right">
            <p className="text-zinc-400 text-sm">Bem-vindo de volta</p>
            <p className="text-white font-semibold">{userName}</p>
          </div>
        </header>

        {/* Main constellation area */}
        <div className="relative w-full h-96 mb-16">
          {/* Connection lines between worlds (subtle) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
            <defs>
              <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgb(63, 63, 70)" />
                <stop offset="50%" stopColor="rgb(113, 113, 122)" />
                <stop offset="100%" stopColor="rgb(63, 63, 70)" />
              </linearGradient>
            </defs>
            
            {/* Lines connecting the worlds */}
            <path
              d={`M ${25}% ${33}% Q ${50}% ${20}% ${75}% ${25}%`}
              stroke="url(#connectionGradient)"
              strokeWidth="1"
              fill="none"
              className="animate-pulse"
            />
            <path
              d={`M ${25}% ${33}% Q ${40}% ${55}% ${50}% ${67}%`}
              stroke="url(#connectionGradient)"
              strokeWidth="1"
              fill="none"
              className="animate-pulse"
              style={{ animationDelay: '1s' }}
            />
            <path
              d={`M ${75}% ${25}% Q ${65}% ${45}% ${50}% ${67}%`}
              stroke="url(#connectionGradient)"
              strokeWidth="1"
              fill="none"
              className="animate-pulse"
              style={{ animationDelay: '2s' }}
            />
          </svg>

          {/* World constellations */}
          {worlds.map((world) => (
            <WorldConstellation
              key={world.id}
              world={world}
              isAccessible={isWorldAccessible(world.id)}
              isCompleted={isWorldCompleted(world.id)}
              userTier={userTier}
              onClick={() => onWorldAccess(world.id)}
            />
          ))}
        </div>

        {/* Bottom section - different for leads vs clients */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          
          {/* Lead CTA: Persona Test */}
          {userTier === 'lead' && (
            <div className="md:col-span-2 bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-amber-400 rounded-full flex items-center justify-center">
                  <Sparkles size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold mb-2">Descubra Sua Persona de Transformação</h3>
                  <p className="text-zinc-400 text-sm mb-4">
                    Identifique seu perfil único e receba estratégias personalizadas para acelerar sua jornada digital.
                  </p>
                  <button
                    onClick={onPersonaTest}
                    className="bg-white text-black px-6 py-2 rounded-full font-medium hover:bg-zinc-100 transition-colors flex items-center gap-2 group"
                  >
                    <Play size={16} />
                    Iniciar Teste de Persona
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Client Stats: Achievements & Treasures */}
          {userTier !== 'lead' && (
            <>
              <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6 backdrop-blur-sm text-center">
                <Trophy size={32} className="text-amber-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white mb-1">{achievements}</div>
                <div className="text-zinc-400 text-sm">Conquistas</div>
              </div>
              
              <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6 backdrop-blur-sm text-center">
                <Gem size={32} className="text-purple-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white mb-1">{treasures}</div>
                <div className="text-zinc-400 text-sm">Estratégias</div>
              </div>
            </>
          )}

          {/* Upgrade CTA for leads */}
          {userTier === 'lead' && (
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6 backdrop-blur-sm text-center">
              <Crown size={32} className="text-purple-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Desbloquear Tudo</h3>
              <p className="text-zinc-400 text-sm mb-4">
                Acesse todos os mundos e estratégias
              </p>
              <button
                onClick={onUpgrade}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full font-medium hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                Fazer Upgrade
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}