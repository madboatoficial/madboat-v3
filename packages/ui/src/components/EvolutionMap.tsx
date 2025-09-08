"use client"

/**
 * 🗺️ MAPA DOS TESOUROS - EVOLUTION MAP MADBOAT
 * Column-based tier progression system with treasure discovery
 * Progressive reveal of tiers as journey advances
 */

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { 
  Brain,
  Heart,
  Target,
  Sparkles,
  Shield,
  Star,
  Crown,
  Gem,
  Zap,
  Lock,
  CheckCircle,
  Clock,
  Award,
  Anchor,
  Compass,
  Flame,
  Eye,
  MapPin,
  TrendingUp,
  Users,
  Mountain,
  Rocket,
  Globe,
  ArrowRight,
  Instagram,
  FileText,
  ChevronRight,
  X,
  ChevronLeft,
  Navigation,
  Ship
} from 'lucide-react'

// Treasure types and states for the column-based system
export type TreasureState = 'locked' | 'revealed' | 'unlocked' | 'completed' | 'coming_soon'

export interface Treasure {
  id: string
  title: string
  description: string
  state: TreasureState
  icon: React.ComponentType<any>
  type: 'core' | 'bonus' | 'progression' | 'rank'
  points?: number
  requirements?: string[]
  results?: string[]
  tier: number
  order: number
}

export interface Tier {
  id: number
  title: string
  description: string
  state: 'locked' | 'revealed' | 'unlocked' | 'completed'
  treasures: Treasure[]
  unlockRequirements?: string[]
}

interface EvolutionMapProps {
  userName?: string
  completedMilestones?: string[]
  onTreasureClick?: (treasure: Treasure) => void
  onClose?: () => void
}

// Define tier-based treasure data
const TIERS_DATA: Tier[] = [
  {
    id: 1,
    title: 'Tier 1',
    description: 'Fundação Pessoal',
    state: 'completed',
    treasures: [
      {
        id: 'persona-unica',
        title: 'Persona Única',
        description: 'Identidade única no mercado digital descoberta',
        state: 'completed',
        icon: Brain,
        type: 'core',
        points: 500,
        results: ['Protocolo Personalizado', 'DNA Criativo Base'],
        tier: 1,
        order: 1
      }
    ]
  },
  {
    id: 2,
    title: 'Tier 2',
    description: 'Método ALMA - Autenticidade',
    state: 'unlocked',
    treasures: [
      {
        id: 'alma-fase1',
        title: 'Autenticidade',
        description: 'Descoberta do DNA Criativo',
        state: 'unlocked',
        icon: Eye,
        type: 'core',
        points: 300,
        results: ['DNA Criativo'],
        tier: 2,
        order: 1
      },
      {
        id: 'dna-criativo',
        title: 'DNA Criativo',
        description: 'Sua essência criativa única revelada',
        state: 'revealed',
        icon: Sparkles,
        type: 'core',
        points: 200,
        requirements: ['alma-fase1'],
        tier: 2,
        order: 2
      },
      {
        id: 'instagram-autentico',
        title: 'Instagram Autêntico',
        description: 'Presença autêntica no Instagram',
        state: 'unlocked',
        icon: Instagram,
        type: 'bonus',
        points: 150,
        tier: 2,
        order: 3
      }
    ],
    unlockRequirements: ['persona-unica']
  },
  {
    id: 3,
    title: 'Tier 3',
    description: 'Método ALMA - Legado',
    state: 'revealed',
    treasures: [
      {
        id: 'alma-fase2',
        title: 'Legado',
        description: 'Construção do Legado Pessoal',
        state: 'revealed',
        icon: Crown,
        type: 'core',
        points: 300,
        results: ['Legado Pessoal'],
        requirements: ['alma-fase1'],
        tier: 3,
        order: 1
      },
      {
        id: 'legado-pessoal',
        title: 'Legado Pessoal',
        description: 'Sua marca no mundo estabelecida',
        state: 'locked',
        icon: Mountain,
        type: 'core',
        points: 200,
        requirements: ['alma-fase2'],
        tier: 3,
        order: 2
      },
      {
        id: 'pagina-vendas',
        title: 'Página de Vendas',
        description: 'Página de vendas autêntica',
        state: 'revealed',
        icon: FileText,
        type: 'bonus',
        points: 150,
        tier: 3,
        order: 3
      }
    ],
    unlockRequirements: ['alma-fase1']
  },
  {
    id: 4,
    title: 'Tier 4',
    description: 'Método ALMA - Magnetismo',
    state: 'locked',
    treasures: [
      {
        id: 'alma-fase3',
        title: 'Magnetismo',
        description: 'Desenvolvimento do Magnetismo Autêntico',
        state: 'locked',
        icon: Zap,
        type: 'core',
        points: 300,
        results: ['Magnetismo Autêntico'],
        requirements: ['alma-fase2'],
        tier: 4,
        order: 1
      },
      {
        id: 'magnetismo-autentico',
        title: 'Magnetismo Autêntico',
        description: 'Atração genuína desenvolvida',
        state: 'locked',
        icon: Target,
        type: 'core',
        points: 200,
        requirements: ['alma-fase3'],
        tier: 4,
        order: 2
      }
    ],
    unlockRequirements: ['alma-fase2']
  },
  {
    id: 5,
    title: 'Tier 5',
    description: 'Método ALMA - Abundância',
    state: 'locked',
    treasures: [
      {
        id: 'alma-fase4',
        title: 'Abundância',
        description: 'Manifestação da Abundância Autêntica',
        state: 'locked',
        icon: Gem,
        type: 'core',
        points: 300,
        results: ['Abundância Autêntica'],
        requirements: ['alma-fase3'],
        tier: 5,
        order: 1
      },
      {
        id: 'abundancia-autentica',
        title: 'Abundância Autêntica',
        description: 'Prosperidade alinhada com propósito',
        state: 'locked',
        icon: Crown,
        type: 'core',
        points: 200,
        requirements: ['alma-fase4'],
        tier: 5,
        order: 2
      }
    ],
    unlockRequirements: ['alma-fase3']
  },
  {
    id: 6,
    title: 'Tier 6',
    description: 'Método Vortex',
    state: 'locked',
    treasures: [
      {
        id: 'vortex',
        title: 'Método Vortex',
        description: 'Aceleração exponencial da transformação',
        state: 'locked',
        icon: Rocket,
        type: 'core',
        points: 2000,
        requirements: ['alma-fase4'],
        tier: 6,
        order: 1
      }
    ],
    unlockRequirements: ['alma-fase4']
  }
]

const stateConfig = {
  locked: {
    bg: 'bg-zinc-900/40',
    border: 'border-zinc-800/50',
    icon: 'text-zinc-600',
    text: 'text-zinc-500',
    glow: '',
    opacity: 'opacity-40'
  },
  revealed: {
    bg: 'bg-yellow-950/30',
    border: 'border-yellow-600/40',
    icon: 'text-yellow-400',
    text: 'text-yellow-200',
    glow: 'shadow-yellow-500/10',
    opacity: 'opacity-70'
  },
  unlocked: {
    bg: 'bg-blue-950/40',
    border: 'border-blue-500/60',
    icon: 'text-blue-400',
    text: 'text-blue-200',
    glow: 'shadow-blue-500/20',
    opacity: 'opacity-100'
  },
  completed: {
    bg: 'bg-green-950/40',
    border: 'border-green-500/60',
    icon: 'text-green-400',
    text: 'text-green-200',
    glow: 'shadow-green-500/20',
    opacity: 'opacity-100'
  }
}

const typeConfig = {
  core: { size: 'w-20 h-20', iconSize: 'w-10 h-10' },
  bonus: { size: 'w-16 h-16', iconSize: 'w-8 h-8' },
  progression: { size: 'w-18 h-18', iconSize: 'w-9 h-9' },
  rank: { size: 'w-14 h-14', iconSize: 'w-7 h-7' }
}

const tierConfig = {
  locked: {
    bg: 'bg-zinc-900/20',
    border: 'border-zinc-700/30',
    header: 'bg-zinc-800/40',
    headerText: 'text-zinc-500'
  },
  revealed: {
    bg: 'bg-yellow-950/20',
    border: 'border-yellow-600/30',
    header: 'bg-yellow-900/40',
    headerText: 'text-yellow-300'
  },
  unlocked: {
    bg: 'bg-blue-950/20',
    border: 'border-blue-500/30',
    header: 'bg-blue-900/40',
    headerText: 'text-blue-300'
  },
  completed: {
    bg: 'bg-green-950/20',
    border: 'border-green-500/30',
    header: 'bg-green-900/40',
    headerText: 'text-green-300'
  }
}

export function EvolutionMap({ userName = "Navigator", completedMilestones = [], onTreasureClick, onClose }: EvolutionMapProps) {
  const [selectedTreasure, setSelectedTreasure] = useState<Treasure | null>(null)
  const [currentTierIndex, setCurrentTierIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleTreasureClick = (treasure: Treasure) => {
    setSelectedTreasure(treasure)
    onTreasureClick?.(treasure)
  }

  const getUnlockedTiers = () => {
    const unlockedTiers = TIERS_DATA.filter(tier => tier.state !== 'locked')
    return Math.max(unlockedTiers.length, 1)
  }

  const getTotalTreasures = () => {
    return TIERS_DATA.reduce((total, tier) => total + tier.treasures.length, 0)
  }

  const getDiscoveredTreasures = () => {
    return TIERS_DATA.reduce((total, tier) => {
      return total + tier.treasures.filter(t => t.state === 'completed' || t.state === 'unlocked').length
    }, 0)
  }

  const nextTier = () => {
    if (currentTierIndex < TIERS_DATA.length - 1) {
      setCurrentTierIndex(currentTierIndex + 1)
    }
  }

  const prevTier = () => {
    if (currentTierIndex > 0) {
      setCurrentTierIndex(currentTierIndex - 1)
    }
  }

  const renderTierColumn = (tier: Tier, index: number) => {
    const tierStyle = tierConfig[tier.state]
    const isVisible = !isMobile || index === currentTierIndex
    
    return (
      <motion.div
        key={tier.id}
        initial={{ opacity: 0, x: 50 }}
        animate={{ 
          opacity: isVisible ? 1 : 0,
          x: isVisible ? 0 : 50,
          display: isVisible ? 'block' : 'none'
        }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className={`
          ${isMobile ? 'w-full' : 'min-w-80 flex-shrink-0'} 
          border-2 rounded-2xl backdrop-blur-sm p-6 space-y-6
          ${tierStyle.bg} ${tierStyle.border}
        `}
      >
        {/* Tier Header */}
        <div className={`rounded-xl p-4 ${tierStyle.header}`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-xl font-bold ${tierStyle.headerText}`}>
                {tier.title}
              </h3>
              <p className={`text-sm opacity-80 ${tierStyle.headerText}`}>
                {tier.description}
              </p>
            </div>
            <div className={`text-2xl ${tierStyle.headerText}`}>
              {tier.state === 'completed' && '🏆'}
              {tier.state === 'unlocked' && '🗝️'}
              {tier.state === 'revealed' && '👁️'}
              {tier.state === 'locked' && '🔒'}
            </div>
          </div>
        </div>

        {/* Treasures */}
        <div className="space-y-4">
          {tier.treasures.map((treasure, treasureIndex) => {
            const config = stateConfig[treasure.state]
            const typeConf = typeConfig[treasure.type]
            const Icon = treasure.icon

            return (
              <motion.div
                key={treasure.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  delay: (index * 0.2) + (treasureIndex * 0.1),
                  duration: 0.4,
                  type: "spring",
                  bounce: 0.3
                }}
                className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/40 backdrop-blur-sm border border-zinc-700/50 hover:border-zinc-600/50 transition-all duration-300 cursor-pointer group"
                onClick={() => handleTreasureClick(treasure)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Treasure Icon */}
                <div className={`
                  ${typeConf.size} rounded-2xl border-2 ${config.border} ${config.bg} ${config.glow}
                  flex items-center justify-center backdrop-blur-sm transition-all duration-300
                  ${config.opacity} relative
                `}>
                  {treasure.state === 'completed' && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-zinc-950 flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                  )}
                  
                  {treasure.state === 'locked' && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-zinc-700 rounded-full border-2 border-zinc-950 flex items-center justify-center">
                      <Lock className="w-3 h-3 text-zinc-400" />
                    </div>
                  )}

                  <Icon className={`${typeConf.iconSize} ${config.icon}`} />
                </div>

                {/* Treasure Info */}
                <div className="flex-1">
                  <h4 className={`font-bold text-lg ${config.text}`}>
                    {treasure.title}
                  </h4>
                  <p className={`text-sm opacity-80 ${config.text}`}>
                    {treasure.description}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    {treasure.type === 'bonus' && (
                      <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full">
                        ✨ Bônus
                      </span>
                    )}
                    {treasure.points && (
                      <span className="text-xs text-blue-400">
                        +{treasure.points} XP
                      </span>
                    )}
                  </div>
                </div>

                <ChevronRight className={`w-5 h-5 ${config.icon} group-hover:translate-x-1 transition-transform`} />
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col relative">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-zinc-800/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
      </div>

      {/* MadBoat Header */}
      <div className="relative z-40 bg-zinc-900/60 backdrop-blur-sm border-b border-zinc-700/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <Ship className="w-8 h-8 text-blue-400" />
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    MadBoat
                  </h1>
                  <p className="text-xs text-zinc-400">
                    Navigation System
                  </p>
                </div>
              </div>
              <div className="h-8 w-px bg-zinc-600 mx-2" />
              <div>
                <h2 className="text-xl font-light text-white tracking-wide">
                  🗺️ Mapa dos Tesouros
                </h2>
                <p className="text-zinc-400 text-sm">
                  Jornada de transformação autêntica
                </p>
              </div>
            </div>
            
            {onClose && (
              <button
                onClick={onClose}
                className="p-3 text-zinc-400 hover:text-white transition-colors rounded-xl hover:bg-zinc-800/50"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobile && (
        <div className="relative z-40 bg-zinc-900/40 backdrop-blur-sm border-b border-zinc-700/50 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={prevTier}
              disabled={currentTierIndex === 0}
              className="p-2 text-zinc-400 hover:text-white transition-colors rounded-xl hover:bg-zinc-800/50 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="text-center">
              <p className="text-white font-medium">
                {TIERS_DATA[currentTierIndex]?.title}
              </p>
              <p className="text-xs text-zinc-400">
                {currentTierIndex + 1} de {TIERS_DATA.length}
              </p>
            </div>
            
            <button
              onClick={nextTier}
              disabled={currentTierIndex === TIERS_DATA.length - 1}
              className="p-2 text-zinc-400 hover:text-white transition-colors rounded-xl hover:bg-zinc-800/50 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Tiers Container */}
      <div className="flex-1 relative overflow-hidden">
        <div className="h-full">
          <div className={`
            ${isMobile 
              ? 'flex transition-transform duration-300'
              : 'flex gap-6 p-6 overflow-x-auto'
            }
            h-full
          `}>
            {TIERS_DATA.map((tier, index) => renderTierColumn(tier, index))}
          </div>
        </div>
      </div>

      {/* Treasure Detail Modal */}
      <AnimatePresence>
        {selectedTreasure && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setSelectedTreasure(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-zinc-900 border border-zinc-700 rounded-2xl p-8 max-w-md w-full"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className={`w-16 h-16 rounded-xl ${stateConfig[selectedTreasure.state].bg} border-2 ${stateConfig[selectedTreasure.state].border} flex items-center justify-center`}>
                  <selectedTreasure.icon className={`w-8 h-8 ${stateConfig[selectedTreasure.state].icon}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-xl">{selectedTreasure.title}</h3>
                  <p className="text-zinc-400 text-sm mt-1">{selectedTreasure.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-xs text-yellow-400">Tier {selectedTreasure.tier} Treasure</span>
                  </div>
                </div>
              </div>

              {selectedTreasure.requirements && (
                <div className="mb-4">
                  <h4 className="text-white font-medium text-sm mb-2">🗝️ Pré-requisitos:</h4>
                  <div className="space-y-1">
                    {selectedTreasure.requirements.map(req => {
                      const reqTreasure = TIERS_DATA.flatMap(t => t.treasures).find(t => t.id === req)
                      return (
                        <div key={req} className="text-zinc-400 text-sm flex items-center gap-2">
                          <ChevronRight className="w-3 h-3" />
                          {reqTreasure?.title || req}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {selectedTreasure.results && (
                <div className="mb-6">
                  <h4 className="text-white font-medium text-sm mb-2">🏆 Recompensas:</h4>
                  <div className="space-y-1">
                    {selectedTreasure.results.map(result => (
                      <div key={result} className="text-green-400 text-sm flex items-center gap-2">
                        <Star className="w-3 h-3" />
                        {result}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t border-zinc-700">
                <div className="flex items-center gap-4">
                  {selectedTreasure.points && (
                    <span className="text-blue-400 text-sm font-medium">
                      +{selectedTreasure.points} XP
                    </span>
                  )}
                  {selectedTreasure.type === 'bonus' && (
                    <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full">
                      ✨ Bônus
                    </span>
                  )}
                </div>
                
                <button
                  onClick={() => setSelectedTreasure(null)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-white text-sm transition-colors"
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Footer */}
      <div className="relative z-40 bg-zinc-900/60 backdrop-blur-sm border-t border-zinc-700/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* Treasure Statistics */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-white font-medium">
                    {getDiscoveredTreasures()}/{getTotalTreasures()}
                  </p>
                  <p className="text-xs text-zinc-400">Tesouros Descobertos</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Navigation className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-white font-medium">
                    {getUnlockedTiers()}/{TIERS_DATA.length}
                  </p>
                  <p className="text-xs text-zinc-400">Territórios Desbloqueados</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-white font-medium">
                    {userName}
                  </p>
                  <p className="text-xs text-zinc-400">Navigator Ativo</p>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-400" />
                <span className="text-zinc-300">Completo</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-500/60 rounded-full"></div>
                <span className="text-zinc-300">Desbloqueado</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-yellow-500/60 rounded-full"></div>
                <span className="text-zinc-300">Revelado</span>
              </div>
              <div className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-zinc-500" />
                <span className="text-zinc-300">Bloqueado</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}