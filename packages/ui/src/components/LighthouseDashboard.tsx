/**
 * 🏮 LIGHTHOUSE DASHBOARD - Refúgio Digital do Tripulante
 * 
 * CONCEITO REVOLUCIONADO:
 * ======================
 * Abandona completamente o conceito de constelação para abraçar a metáfora 
 * do FAROL como refúgio seguro do tripulante - o ponto de onde partem para
 * aventuras e para onde sempre podem retornar.
 * 
 * ARQUITETURA LIGHTHOUSE:
 * =======================
 * 
 * 🏮 LIGHTHOUSE CORE (Centro da Experiência)
 * - Farol visual dinâmico que transforma com cada mundo
 * - Mostra a FASE ATUAL do tripulante
 * - CTA principal sempre destacado
 * - Sistema carrossel horizontal entre mundos
 * 
 * ⚓ ELEMENTOS FIXOS (Sempre Presentes)
 * - 🗨️ Chat (Global/Clã/Sistema) - Top Left
 * - ⚙️ Configurações - Top Right
 * - 👤 Perfil - Top Right
 * - 🎯 Desafios - Bottom Left
 * - 🎪 Missões - Bottom Left  
 * - 🏆 Conquistas - Bottom Right
 * 
 * 🌊 ELEMENTOS DINÂMICOS (Transformam por Mundo)
 * 
 * 🔍 PERSONAS (Mundo 0):
 * - Painel de descoberta de personas
 * - Teste como CTA principal
 * - Resultado e insights personalizados
 * 
 * 🔵 A.L.M.A. (Mundo 1 - Azul/Dourado):
 * - Progresso das 4 fases de despertar
 * - Consciência, Aceitação, Planejamento, Ação
 * - CTA: Próxima fase disponível
 * 
 * 🟣 VÓRTICE (Mundo 2 - Magenta/Roxo):
 * - Status da audiência (leads, conversões)
 * - Metodologias de transformação ativas
 * - CTA: Campanhas e engagement
 * 
 * 🔴 ODISSEIA (Mundo 3 - Vermelho/Dourado):
 * - Progressão pelos 5 níveis de maestria
 * - Tesouro de estratégias acumuladas
 * - CTA: Próximo nível ou masterclass
 * 
 * SISTEMA CARROSSEL:
 * ==================
 * Sequência: Personas → A.L.M.A. → Vórtice → Odisseia
 * - Navegação por tabs estilizados como âncoras
 * - Transições fluidas que transformam TODO o core
 * - Mundos locked aparecem mas com indicação visual
 * - Upgrade CTAs integrados naturalmente
 * 
 * FILOSOFIA DE DESIGN:
 * ===================
 * "O farol é simultaneamente refúgio e guia - oferece segurança
 * mas sempre aponta para novos horizontes. Cada mundo é uma nova
 * configuração da luz, mas o farol permanece como casa."
 * 
 * PRINCÍPIOS INSTRUCIONAIS:
 * ========================
 * - Carga cognitiva controlada (1 mundo ativo por vez)
 * - Scaffolding através do carrossel (progressão natural)
 * - Affordances claras (âncoras, estados, CTAs)
 * - Feedback imediato (transformação visual completa)
 * - Mental model familiar (farol como ponto fixo)
 * - Progressão scaffolded mas não forçada
 * 
 * @author Mandarin Fish (UI Artist & Instructional Designer)
 */

"use client"

import React, { useState, useEffect } from 'react'
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
  MessageCircle,
  Settings,
  User,
  Target,
  MapPin,
  Award,
  Search,
  ChevronRight,
  Anchor,
  Lightbulb,
  Users,
  TrendingUp,
  BookOpen,
  Flame
} from 'lucide-react'

export type UserTier = 'lead' | 'premium' | 'enterprise'
export type WorldId = 'personas' | 'alma' | 'vortice' | 'odisseia'

export interface LighthouseDashboardProps {
  userTier: UserTier
  userName: string
  userLevel: number
  currentWorld: WorldId
  completedWorlds: WorldId[]
  achievements: number
  treasures: number
  onPersonaTest: () => void
  onWorldAccess: (world: WorldId) => void
  onUpgrade: () => void
  onAction: (action: string) => void
}

interface WorldConfig {
  id: WorldId
  name: string
  subtitle: string
  description: string
  icon: React.ReactNode
  colors: {
    primary: string
    secondary: string
    accent: string
    glow: string
    bg: string
  }
  lighthouseStyle: {
    beam: string
    structure: string
    light: string
  }
  minTier: UserTier
}

const worlds: WorldConfig[] = [
  {
    id: 'personas',
    name: 'Personas',
    subtitle: 'Descoberta Interior',
    description: 'Identifique seu perfil único e receba estratégias personalizadas',
    icon: <Search size={20} />,
    colors: {
      primary: 'from-slate-500 to-slate-400',
      secondary: 'from-zinc-600 to-zinc-500', 
      accent: 'text-slate-300',
      glow: 'shadow-slate-400/20',
      bg: 'bg-slate-500/5'
    },
    lighthouseStyle: {
      beam: 'bg-gradient-conic from-slate-400/30 via-transparent to-slate-400/30',
      structure: 'bg-gradient-to-t from-slate-800 to-slate-600',
      light: 'bg-slate-300'
    },
    minTier: 'lead'
  },
  {
    id: 'alma',
    name: 'A.L.M.A.',
    subtitle: 'Despertar da Consciência',
    description: 'Jornada através das 4 fases de transformação digital',
    icon: <Compass size={20} />,
    colors: {
      primary: 'from-blue-500 to-amber-400',
      secondary: 'from-blue-600 to-amber-500',
      accent: 'text-blue-300',
      glow: 'shadow-blue-400/20',
      bg: 'bg-blue-500/5'
    },
    lighthouseStyle: {
      beam: 'bg-gradient-conic from-blue-400/40 via-amber-400/40 to-blue-400/40',
      structure: 'bg-gradient-to-t from-blue-800 to-amber-600',
      light: 'bg-amber-300'
    },
    minTier: 'lead'
  },
  {
    id: 'vortice',
    name: 'Vórtice',
    subtitle: 'Transformação Profunda',
    description: 'Metodologias avançadas para crescimento e engajamento',
    icon: <Zap size={20} />,
    colors: {
      primary: 'from-purple-500 to-pink-500',
      secondary: 'from-purple-600 to-pink-600',
      accent: 'text-purple-300',
      glow: 'shadow-purple-400/20',
      bg: 'bg-purple-500/5'
    },
    lighthouseStyle: {
      beam: 'bg-gradient-conic from-purple-400/40 via-pink-400/40 to-purple-400/40',
      structure: 'bg-gradient-to-t from-purple-800 to-pink-600',
      light: 'bg-pink-300'
    },
    minTier: 'premium'
  },
  {
    id: 'odisseia',
    name: 'Odisseia',
    subtitle: 'Jornada da Maestria',
    description: 'Os 5 níveis de excelência em transformação digital',
    icon: <Crown size={20} />,
    colors: {
      primary: 'from-red-500 to-amber-500',
      secondary: 'from-red-600 to-amber-600',
      accent: 'text-red-300',
      glow: 'shadow-red-400/20',
      bg: 'bg-red-500/5'
    },
    lighthouseStyle: {
      beam: 'bg-gradient-conic from-red-400/40 via-amber-400/40 to-red-400/40',
      structure: 'bg-gradient-to-t from-red-800 to-amber-600',
      light: 'bg-amber-300'
    },
    minTier: 'enterprise'
  }
]

const LighthouseCore: React.FC<{
  world: WorldConfig
  isActive: boolean
  userTier: UserTier
  onAction: () => void
}> = ({ world, isActive, userTier, onAction }) => {
  const isAccessible = userTier === 'enterprise' || 
    (userTier === 'premium' && world.minTier !== 'enterprise') ||
    (userTier === 'lead' && world.minTier === 'lead')

  return (
    <div className={`relative transition-all duration-1000 ${isActive ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
      {/* Lighthouse Structure */}
      <div className={`relative w-32 h-48 mx-auto mb-6 ${world.lighthouseStyle.structure} rounded-t-full transition-all duration-1000`}>
        
        {/* Rotating Light Beam (only when active) */}
        {isActive && isAccessible && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-64 h-64 animate-spin-slow">
            <div className={`w-full h-full ${world.lighthouseStyle.beam} rounded-full blur-sm opacity-60`} />
          </div>
        )}
        
        {/* Lighthouse Light */}
        <div className={`absolute -top-6 left-1/2 transform -translate-x-1/2 w-16 h-12 ${world.lighthouseStyle.light} rounded-full ${isActive ? 'animate-pulse' : ''} transition-all duration-500`}>
          <div className="absolute inset-0 flex items-center justify-center">
            {world.icon}
          </div>
        </div>
        
        {/* Lock Overlay */}
        {!isAccessible && (
          <div className="absolute inset-0 bg-zinc-900/80 rounded-t-full flex items-center justify-center">
            <Lock size={24} className="text-zinc-500" />
          </div>
        )}
      </div>

      {/* World Information */}
      <div className="text-center space-y-4">
        <div>
          <h2 className={`text-2xl font-bold transition-colors duration-500 ${isAccessible ? 'text-white' : 'text-zinc-600'}`}>
            {world.name}
          </h2>
          <p className={`text-sm transition-colors duration-500 ${isAccessible && world.colors ? world.colors.accent : 'text-zinc-700'}`}>
            {world.subtitle}
          </p>
        </div>
        
        <p className={`text-sm max-w-md mx-auto transition-colors duration-500 ${isAccessible ? 'text-zinc-400' : 'text-zinc-700'}`}>
          {world.description}
        </p>

        {/* Action Button */}
        {isAccessible ? (
          <button
            onClick={onAction}
            className={`bg-gradient-to-r ${world.colors?.primary || 'from-zinc-600 to-zinc-500'} text-white px-8 py-3 rounded-full font-semibold hover:scale-105 transition-all duration-300 flex items-center gap-2 mx-auto group ${world.colors?.glow || 'shadow-zinc-400/20'} hover:shadow-lg`}
          >
            <Play size={16} />
            {world.id === 'personas' && 'Descobrir Persona'}
            {world.id === 'alma' && 'Continuar Jornada'}
            {world.id === 'vortice' && 'Abrir Vórtice'}
            {world.id === 'odisseia' && 'Navegar Odisseia'}
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        ) : (
          <button className="bg-zinc-800 text-zinc-500 px-8 py-3 rounded-full font-semibold cursor-not-allowed">
            <Lock size={16} className="inline mr-2" />
            Upgrade Necessário
          </button>
        )}
      </div>
    </div>
  )
}

const WorldCarousel: React.FC<{
  worlds: WorldConfig[]
  activeWorld: WorldId
  userTier: UserTier
  onWorldChange: (worldId: WorldId) => void
}> = ({ worlds, activeWorld, userTier, onWorldChange }) => {
  return (
    <div className="flex justify-center space-x-1 mb-8">
      {worlds.map((world, index) => {
        const isActive = world.id === activeWorld
        const isAccessible = userTier === 'enterprise' || 
          (userTier === 'premium' && world.minTier !== 'enterprise') ||
          (userTier === 'lead' && world.minTier === 'lead')
        
        return (
          <button
            key={world.id}
            onClick={() => onWorldChange(world.id)}
            className={`relative px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-2 ${
              isActive 
                ? `bg-gradient-to-r ${world.colors?.primary || 'from-zinc-600 to-zinc-500'} text-white shadow-lg ${world.colors?.glow || 'shadow-zinc-400/20'}`
                : isAccessible
                  ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
                  : 'bg-zinc-900 text-zinc-600 cursor-not-allowed'
            }`}
            disabled={!isAccessible}
          >
            <Anchor size={16} className={isActive ? 'animate-bounce' : ''} />
            <span className="text-sm font-medium">{world.name}</span>
            {!isAccessible && <Lock size={12} />}
            
            {/* Connector line to next tab */}
            {index < worlds.length - 1 && (
              <ChevronRight size={16} className="absolute -right-2 text-zinc-600" />
            )}
          </button>
        )
      })}
    </div>
  )
}

const FixedNavigation: React.FC<{
  onAction: (action: string) => void
  achievements: number
  userName: string
}> = ({ onAction, achievements, userName }) => {
  return (
    <>
      {/* Top Navigation */}
      <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-20">
        {/* Left Side - Logo & Chat */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <ShipWheel size={24} className="text-white animate-spin-slow" strokeWidth={2.5} />
            <span className="text-xl font-bold text-white tracking-wide">MadBoat</span>
          </div>
          
          <button
            onClick={() => onAction('chat')}
            className="p-3 bg-zinc-800/50 hover:bg-zinc-700/50 rounded-full backdrop-blur-sm transition-all duration-300 border border-zinc-700/30"
          >
            <MessageCircle size={18} className="text-zinc-300" />
          </button>
        </div>

        {/* Right Side - Profile & Settings */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-zinc-400 text-sm">Tripulante</p>
            <p className="text-white font-semibold">{userName}</p>
          </div>
          
          <button
            onClick={() => onAction('profile')}
            className="p-3 bg-zinc-800/50 hover:bg-zinc-700/50 rounded-full backdrop-blur-sm transition-all duration-300 border border-zinc-700/30"
          >
            <User size={18} className="text-zinc-300" />
          </button>
          
          <button
            onClick={() => onAction('settings')}
            className="p-3 bg-zinc-800/50 hover:bg-zinc-700/50 rounded-full backdrop-blur-sm transition-all duration-300 border border-zinc-700/30"
          >
            <Settings size={18} className="text-zinc-300" />
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end z-20">
        {/* Left Side - Challenges & Missions */}
        <div className="space-y-4">
          <button
            onClick={() => onAction('challenges')}
            className="flex items-center gap-3 p-4 bg-zinc-900/50 hover:bg-zinc-800/50 rounded-2xl backdrop-blur-sm transition-all duration-300 border border-zinc-700/30 group"
          >
            <Target size={20} className="text-amber-400" />
            <div className="text-left">
              <div className="text-white font-semibold text-sm">Desafios</div>
              <div className="text-zinc-400 text-xs">3 ativos</div>
            </div>
            <ArrowRight size={16} className="text-zinc-500 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button
            onClick={() => onAction('missions')}
            className="flex items-center gap-3 p-4 bg-zinc-900/50 hover:bg-zinc-800/50 rounded-2xl backdrop-blur-sm transition-all duration-300 border border-zinc-700/30 group"
          >
            <MapPin size={20} className="text-purple-400" />
            <div className="text-left">
              <div className="text-white font-semibold text-sm">Missões</div>
              <div className="text-zinc-400 text-xs">2 disponíveis</div>
            </div>
            <ArrowRight size={16} className="text-zinc-500 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Right Side - Achievements */}
        <button
          onClick={() => onAction('achievements')}
          className="flex items-center gap-3 p-4 bg-zinc-900/50 hover:bg-zinc-800/50 rounded-2xl backdrop-blur-sm transition-all duration-300 border border-zinc-700/30 group"
        >
          <Trophy size={20} className="text-amber-400" />
          <div className="text-left">
            <div className="text-white font-semibold text-sm">Conquistas</div>
            <div className="text-zinc-400 text-xs">{achievements} desbloqueadas</div>
          </div>
          <ArrowRight size={16} className="text-zinc-500 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </>
  )
}

export function LighthouseDashboard({
  userTier,
  userName,
  userLevel,
  currentWorld,
  completedWorlds,
  achievements,
  treasures,
  onPersonaTest,
  onWorldAccess,
  onUpgrade,
  onAction
}: LighthouseDashboardProps) {
  const [activeWorld, setActiveWorld] = useState<WorldId>(currentWorld)
  
  const activeWorldConfig = worlds.find(w => w.id === activeWorld) || worlds[0]

  const handleWorldChange = (worldId: WorldId) => {
    setActiveWorld(worldId)
    onWorldAccess(worldId)
  }

  const handleCoreAction = () => {
    if (activeWorld === 'personas') {
      onPersonaTest()
    } else {
      onAction(`open_${activeWorld}`)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 overflow-hidden relative">
      {/* Dynamic Background based on active world */}
      <div className={`absolute inset-0 transition-all duration-1000 ${activeWorldConfig?.colors?.bg || 'bg-zinc-900/20'}`}>
        <div className={`absolute top-1/4 left-1/3 w-96 h-96 bg-gradient-to-br ${activeWorldConfig?.colors?.primary || 'from-zinc-600 to-zinc-500'} opacity-5 rounded-full blur-3xl animate-blob`} />
        <div className={`absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-br ${activeWorldConfig?.colors?.secondary || 'from-zinc-700 to-zinc-600'} opacity-5 rounded-full blur-3xl animate-blob`} style={{ animationDelay: '2s' }} />
        <div className={`absolute bottom-1/4 left-1/4 w-72 h-72 bg-gradient-to-br ${activeWorldConfig?.colors?.primary || 'from-zinc-600 to-zinc-500'} opacity-3 rounded-full blur-3xl animate-blob`} style={{ animationDelay: '4s' }} />
      </div>

      {/* Fixed Navigation Elements */}
      <FixedNavigation 
        onAction={onAction}
        achievements={achievements}
        userName={userName}
      />

      {/* Main Content Area */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen py-24">
        
        {/* World Carousel */}
        <WorldCarousel 
          worlds={worlds}
          activeWorld={activeWorld}
          userTier={userTier}
          onWorldChange={handleWorldChange}
        />

        {/* Dynamic Lighthouse Core */}
        <div className="relative w-full max-w-2xl mx-auto">
          {worlds.map((world) => (
            <div
              key={world.id}
              className={`absolute inset-0 transition-all duration-1000 ${
                world.id === activeWorld ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
              }`}
            >
              <LighthouseCore
                world={world}
                isActive={world.id === activeWorld}
                userTier={userTier}
                onAction={handleCoreAction}
              />
            </div>
          ))}
        </div>

        {/* Upgrade CTA for locked worlds */}
        {activeWorldConfig?.minTier !== 'lead' && userTier === 'lead' && (
          <div className="mt-12 p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl backdrop-blur-sm max-w-md mx-auto text-center">
            <Crown size={32} className="text-purple-400 mx-auto mb-3" />
            <h3 className="text-white font-semibold mb-2">Navegue Novos Mundos</h3>
            <p className="text-zinc-400 text-sm mb-4">
              Desbloqueie {activeWorldConfig?.name || 'novos mundos'} e explore territórios inexplorados
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
  )
}