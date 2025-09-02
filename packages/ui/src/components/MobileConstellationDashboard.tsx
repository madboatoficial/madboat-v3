/**
 * 📱 MOBILE CONSTELLATION DASHBOARD
 * 
 * Versão mobile-first do dashboard de constelações, otimizada para:
 * - Telas pequenas (320px+) 
 * - Gestos touch
 * - Performance em dispositivos móveis
 * - Experiência one-handed
 * 
 * Mantém o mesmo DNA visual mas com layout vertical e interações otimizadas.
 */

"use client"

import React, { useState, useRef } from 'react'
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
  Sparkles,
  ChevronDown,
  Menu
} from 'lucide-react'
import type { UserTier, World } from './ConstellationDashboard'

interface MobileConstellationDashboardProps {
  userTier: UserTier
  userName: string
  completedWorlds: World[]
  achievements: number
  treasures: number
  onPersonaTest: () => void
  onWorldAccess: (world: World) => void
  onUpgrade: () => void
}

interface MobileWorldConfig {
  id: World
  name: string
  subtitle: string
  description: string
  icon: React.ReactNode
  colors: {
    from: string
    to: string
    accent: string
    bg: string
  }
}

const mobileWorlds: MobileWorldConfig[] = [
  {
    id: 'alma',
    name: 'A.L.M.A.',
    subtitle: 'Despertar da Consciência',
    description: 'Inicie sua jornada de transformação digital descobrindo quem você é',
    icon: <Compass size={20} />,
    colors: {
      from: 'from-blue-500',
      to: 'to-amber-400',
      accent: 'text-blue-400',
      bg: 'bg-blue-500/10'
    }
  },
  {
    id: 'vortice',
    name: 'Vórtice',
    subtitle: 'Transformação Profunda',
    description: 'Mergulhe nas metodologias avançadas e acelere sua evolução',
    icon: <Zap size={20} />,
    colors: {
      from: 'from-purple-500',
      to: 'to-pink-500',
      accent: 'text-purple-400',
      bg: 'bg-purple-500/10'
    }
  },
  {
    id: 'odisseia',
    name: 'Odisseia',
    subtitle: 'Jornada da Maestria',
    description: 'Domine os 5 produtos e torne-se um mestre da transformação',
    icon: <Crown size={20} />,
    colors: {
      from: 'from-red-500',
      to: 'to-amber-500',
      accent: 'text-red-400',
      bg: 'bg-red-500/10'
    }
  }
]

const WorldCard: React.FC<{
  world: MobileWorldConfig
  isAccessible: boolean
  isCompleted: boolean
  userTier: UserTier
  onClick: () => void
}> = ({ world, isAccessible, isCompleted, userTier, onClick }) => {
  const [isPressed, setIsPressed] = useState(false)

  return (
    <button
      onClick={onClick}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      className={`w-full p-4 rounded-2xl border transition-all duration-200 text-left relative overflow-hidden ${
        isAccessible
          ? `border-white/10 hover:border-white/20 active:scale-[0.98] ${world.colors.bg} backdrop-blur-sm`
          : 'border-zinc-800/50 opacity-50 cursor-not-allowed bg-zinc-900/30'
      } ${isPressed && isAccessible ? 'scale-[0.98]' : ''}`}
      disabled={!isAccessible}
    >
      {/* Background gradient effect */}
      <div className={`absolute inset-0 bg-gradient-to-r ${world.colors.from} ${world.colors.to} opacity-5 transition-opacity duration-200 ${
        isPressed && isAccessible ? 'opacity-10' : ''
      }`} />
      
      {/* Lock overlay */}
      {!isAccessible && (
        <div className="absolute top-3 right-3 w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center">
          <Lock size={14} className="text-zinc-500" />
        </div>
      )}

      {/* Completion star */}
      {isCompleted && (
        <div className="absolute top-3 right-3 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center animate-pulse">
          <Star size={14} className="text-white fill-current" />
        </div>
      )}

      <div className="relative z-10">
        {/* Icon and title */}
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${world.colors.from} ${world.colors.to} flex items-center justify-center text-white shadow-lg`}>
            {world.icon}
          </div>
          <div>
            <h3 className={`font-semibold text-sm ${isAccessible ? 'text-white' : 'text-zinc-600'}`}>
              {world.name}
            </h3>
            <p className={`text-xs ${isAccessible ? 'text-zinc-400' : 'text-zinc-700'}`}>
              {world.subtitle}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className={`text-xs mb-3 leading-relaxed ${isAccessible ? 'text-zinc-300' : 'text-zinc-700'}`}>
          {world.description}
        </p>

        {/* Action indicator */}
        {isAccessible && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400">
              {userTier === 'lead' && world.id !== 'alma' ? 'Upgrade necessário' : 'Tocar para explorar'}
            </span>
            <ArrowRight size={14} className="text-zinc-400" />
          </div>
        )}
      </div>
    </button>
  )
}

export function MobileConstellationDashboard({
  userTier,
  userName,
  completedWorlds,
  achievements,
  treasures,
  onPersonaTest,
  onWorldAccess,
  onUpgrade
}: MobileConstellationDashboardProps) {
  const [isStatsExpanded, setIsStatsExpanded] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const isWorldAccessible = (worldId: World) => {
    if (userTier === 'lead') return worldId === 'alma'
    if (userTier === 'premium') return ['alma', 'vortice'].includes(worldId)
    return true
  }

  const isWorldCompleted = (worldId: World) => {
    return completedWorlds.includes(worldId)
  }

  const getTierInfo = () => {
    const tiers = {
      lead: { badge: '🌊 Explorador', color: 'text-blue-400' },
      premium: { badge: '⚡ Transformador', color: 'text-purple-400' },
      enterprise: { badge: '👑 Mestre', color: 'text-amber-400' }
    }
    return tiers[userTier]
  }

  return (
    <div className="min-h-screen bg-zinc-950 pb-safe">
      {/* Fixed header */}
      <header className="sticky top-0 z-10 bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-800/50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShipWheel size={18} className="text-white animate-spin-slow" strokeWidth={2.5} />
            <span className="text-lg font-bold text-white tracking-wide">MadBoat</span>
          </div>
          
          <button className="p-2 rounded-full bg-zinc-800/50 text-zinc-400">
            <Menu size={18} />
          </button>
        </div>
        
        {/* User greeting */}
        <div className="mt-3">
          <p className="text-sm text-zinc-400">Bem-vindo de volta</p>
          <div className="flex items-center gap-2">
            <p className="font-semibold text-white">{userName}</p>
            <span className={`text-xs px-2 py-1 rounded-full bg-zinc-800/50 ${getTierInfo().color}`}>
              {getTierInfo().badge}
            </span>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Lead CTA: Persona Test */}
        {userTier === 'lead' && (
          <div className="bg-gradient-to-r from-blue-500/10 to-amber-400/10 border border-blue-500/20 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-amber-400 rounded-full flex items-center justify-center flex-shrink-0">
                <Sparkles size={18} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-sm mb-1">Descubra Sua Persona</h3>
                <p className="text-zinc-400 text-xs mb-3 leading-relaxed">
                  Identifique seu perfil e receba estratégias personalizadas para sua jornada.
                </p>
                <button
                  onClick={onPersonaTest}
                  className="bg-white text-black px-4 py-2 rounded-full font-medium text-sm hover:bg-zinc-100 transition-colors flex items-center gap-2 active:scale-95"
                >
                  <Play size={14} />
                  Iniciar Teste
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats section - collapsible for leads */}
        {userTier !== 'lead' && (
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-4 text-center">
              <Trophy size={24} className="text-amber-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white mb-1">{achievements}</div>
              <div className="text-zinc-400 text-xs">Conquistas</div>
            </div>
            
            <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-4 text-center">
              <Gem size={24} className="text-purple-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white mb-1">{treasures}</div>
              <div className="text-zinc-400 text-xs">Estratégias</div>
            </div>
          </div>
        )}

        {/* Worlds section */}
        <div>
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            <span>Seus Mundos</span>
            <div className="flex-1 h-px bg-zinc-800" />
          </h2>
          
          <div ref={scrollRef} className="space-y-3">
            {mobileWorlds.map((world) => (
              <WorldCard
                key={world.id}
                world={world}
                isAccessible={isWorldAccessible(world.id)}
                isCompleted={isWorldCompleted(world.id)}
                userTier={userTier}
                onClick={() => onWorldAccess(world.id)}
              />
            ))}
          </div>
        </div>

        {/* Upgrade CTA for leads */}
        {userTier === 'lead' && (
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-4 text-center">
            <Crown size={32} className="text-purple-400 mx-auto mb-3" />
            <h3 className="text-white font-semibold mb-1">Desbloquear Todos os Mundos</h3>
            <p className="text-zinc-400 text-sm mb-4">
              Acesse Vórtice, Odisseia e todas as estratégias premium
            </p>
            <button
              onClick={onUpgrade}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-medium hover:from-purple-600 hover:to-pink-600 transition-all active:scale-95"
            >
              Fazer Upgrade
            </button>
          </div>
        )}
        
        {/* Bottom safe area */}
        <div className="h-4" />
      </div>
    </div>
  )
}