"use client"

/**
 * 🗺️ MAPA DOS TESOUROS - TREASURE MAP MADBOAT
 * Column-based tier progression system with treasure discovery
 * Progressive reveal of tiers as journey advances
 */

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
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
  Play,
  Pause,
  RotateCcw,
  Ship,
  Navigation,
  ChevronLeft
} from 'lucide-react'

// Types
// Estados da Jornada do Usuário
export type MilestoneState = 'hidden' | 'available' | 'ready' | 'claimed' | 'coming_soon' | 'unlocked' | 'locked' | 'revealed'
export type MilestoneType = 'core' | 'bonus' | 'progression' | 'rank' | 'milestone'

export interface HorizontalMilestone {
  id: string
  title: string
  description: string
  state: MilestoneState
  icon: React.ComponentType<any>
  type: MilestoneType
  tier: number // 0 = start, 1 = early, 2 = mid, 3 = late, 4 = end
  lane: number // 0 = main, 1 = bonus top, -1 = bonus bottom
  connections?: string[]
  points?: number
  requirements?: string[]
  results?: string[]
  position?: { x: number; y: number }
  // Novos campos para jornada do usuário
  instructions?: string // Como adquirir esta etapa
  deliverables?: string[] // O que cada etapa entrega
  missionType?: 'task' | 'challenge' | 'test' | 'bonus' // Tipo de missão
}

interface EvolutionMapHorizontalProps {
  userName?: string
  completedMilestones?: string[]
  currentXP?: number
  onMilestoneClick?: (milestone: HorizontalMilestone) => void
  onXPClaimed?: (milestone: HorizontalMilestone, xpGained: number) => void
  onClose?: () => void
  autoPlay?: boolean
}

// Horizontal milestone data - Game-like progression
const HORIZONTAL_MILESTONES: HorizontalMilestone[] = [
  // TIER 0 - Start
  {
    id: 'persona-unica',
    title: 'Persona Única',
    description: 'Identidade digital descoberta através do teste de persona',
    state: 'ready', // Pronto para claim XP após completar teste
    icon: Brain,
    type: 'core',
    tier: 0,
    lane: 0,
    connections: ['metodo-alma'],
    points: 500,
    results: ['Protocolo Personalizado', 'DNA Base'],
    instructions: 'Complete o teste de identificação de persona de 10 perguntas',
    deliverables: ['Protocolo de comunicação personalizado', 'Base do DNA criativo', 'Liberação do Método ALMA'],
    missionType: 'test'
  },

  // TIER 1 - Early Game
  {
    id: 'metodo-alma',
    title: 'Método ALMA',
    description: 'Portal da transformação autêntica',
    state: 'hidden', // Oculto até persona ser claimed
    icon: Star,
    type: 'core',
    tier: 1,
    lane: 0,
    connections: ['alma-fase1', 'odisseia'],
    points: 1000,
    requirements: ['persona-unica'],
    instructions: 'Acesse o módulo ALMA e inicie sua jornada de autenticidade',
    deliverables: ['Acesso às 4 fases da transformação', 'Desbloqueio de milestones exclusivos'],
    missionType: 'challenge'
  },
  {
    id: 'odisseia',
    title: 'Odisseia',
    description: 'Jornada paralela de crescimento progressivo',
    state: 'coming_soon',
    icon: Compass,
    type: 'core',
    tier: 1,
    lane: -1,
    connections: ['aspirante'],
    points: 1500,
    requirements: ['persona-unica'],
    instructions: 'Sistema em desenvolvimento - Em breve disponível!',
    deliverables: ['5 níveis de progressão naval', 'Conquistas exclusivas'],
    missionType: 'challenge'
  },

  // TIER 2 - Mid Game - ALMA Phases
  {
    id: 'alma-fase1',
    title: 'Autenticidade',
    description: 'Descoberta do DNA Criativo',
    state: 'unlocked',
    icon: Eye,
    type: 'progression',
    tier: 2,
    lane: 0,
    connections: ['dna-criativo', 'alma-fase2'],
    points: 300,
    requirements: ['metodo-alma'],
    results: ['DNA Criativo']
  },
  {
    id: 'dna-criativo',
    title: 'DNA Criativo',
    description: 'Essência criativa única revelada',
    state: 'locked',
    icon: Sparkles,
    type: 'milestone',
    tier: 2,
    lane: 1,
    points: 400,
    requirements: ['alma-fase1']
  },

  // TIER 3 - Mid-Late Game
  {
    id: 'alma-fase2',
    title: 'Legado',
    description: 'Construção do Legado Pessoal',
    state: 'revealed',
    icon: Crown,
    type: 'progression',
    tier: 3,
    lane: 0,
    connections: ['legado-pessoal', 'alma-fase3', 'instagram-autentico'],
    points: 350,
    requirements: ['alma-fase1'],
    results: ['Legado Pessoal']
  },
  {
    id: 'legado-pessoal',
    title: 'Legado Pessoal',
    description: 'Sua marca única no mundo',
    state: 'locked',
    icon: Mountain,
    type: 'milestone',
    tier: 3,
    lane: 1,
    points: 500,
    requirements: ['alma-fase2']
  },
  {
    id: 'instagram-autentico',
    title: 'Instagram Autêntico',
    description: 'Bonus: Presença autêntica',
    state: 'unlocked',
    icon: Instagram,
    type: 'bonus',
    tier: 3,
    lane: -1,
    points: 200,
    requirements: ['alma-fase2']
  },

  // TIER 4 - Late Game
  {
    id: 'alma-fase3',
    title: 'Magnetismo',
    description: 'Desenvolvimento do Magnetismo',
    state: 'revealed',
    icon: Zap,
    type: 'progression',
    tier: 4,
    lane: 0,
    connections: ['magnetismo-autentico', 'alma-fase4', 'pagina-vendas'],
    points: 400,
    requirements: ['alma-fase2'],
    results: ['Magnetismo Autêntico']
  },
  {
    id: 'magnetismo-autentico',
    title: 'Magnetismo Autêntico',
    description: 'Atração genuína dominada',
    state: 'locked',
    icon: Target,
    type: 'milestone',
    tier: 4,
    lane: 1,
    points: 600,
    requirements: ['alma-fase3']
  },
  {
    id: 'pagina-vendas',
    title: 'Página de Vendas',
    description: 'Bonus: Conversão autêntica',
    state: 'unlocked',
    icon: FileText,
    type: 'bonus',
    tier: 4,
    lane: -1,
    points: 250,
    requirements: ['alma-fase3']
  },

  // TIER 5 - End Game
  {
    id: 'alma-fase4',
    title: 'Abundância',
    description: 'Manifestação da Abundância',
    state: 'revealed',
    icon: Gem,
    type: 'progression',
    tier: 5,
    lane: 0,
    connections: ['abundancia-autentica', 'vortex'],
    points: 500,
    requirements: ['alma-fase3'],
    results: ['Abundância Autêntica']
  },
  {
    id: 'abundancia-autentica',
    title: 'Abundância Autêntica',
    description: 'Prosperidade alinhada alcançada',
    state: 'locked',
    icon: Crown,
    type: 'milestone',
    tier: 5,
    lane: 1,
    points: 800,
    requirements: ['alma-fase4']
  },

  // TIER 6 - Master Level
  {
    id: 'vortex',
    title: 'Método Vortex',
    description: 'Aceleração exponencial',
    state: 'revealed',
    icon: Rocket,
    type: 'core',
    tier: 6,
    lane: 0,
    points: 2000,
    requirements: ['alma-fase4', 'dna-criativo', 'legado-pessoal', 'magnetismo-autentico', 'abundancia-autentica']
  },

  // Odisseia Branch (Bottom Lane) - Todos em linha horizontal
  {
    id: 'aspirante',
    title: 'Aspirante',
    description: 'Primeiro nível da Odisseia',
    state: 'coming_soon',
    icon: Anchor,
    type: 'rank',
    tier: 2, // Tier base, será reposicionado pela função de cálculo
    lane: -1,
    connections: ['marujo'],
    points: 200,
    requirements: ['odisseia']
  },
  {
    id: 'marujo',
    title: 'Marujo',
    description: 'Segundo nível da Odisseia',
    state: 'coming_soon',
    icon: Users,
    type: 'rank',
    tier: 3,
    lane: -1,
    connections: ['timoneiro'],
    points: 300,
    requirements: ['aspirante']
  },
  {
    id: 'timoneiro',
    title: 'Timoneiro',
    description: 'Terceiro nível da Odisseia',
    state: 'coming_soon',
    icon: MapPin,
    type: 'rank',
    tier: 4,
    lane: -1,
    connections: ['capitao'],
    points: 400,
    requirements: ['marujo']
  },
  {
    id: 'capitao',
    title: 'Capitão',
    description: 'Quarto nível da Odisseia',
    state: 'coming_soon',
    icon: Crown,
    type: 'rank',
    tier: 5,
    lane: -1,
    connections: ['almirante'],
    points: 500,
    requirements: ['timoneiro']
  },
  {
    id: 'almirante',
    title: 'Almirante',
    description: 'Nível máximo da Odisseia',
    state: 'coming_soon',
    icon: Crown,
    type: 'rank',
    tier: 6,
    lane: -1,
    points: 1000,
    requirements: ['capitao']
  }
]

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const milestoneVariants: Variants = {
  hidden: { 
    scale: 0,
    opacity: 0,
    rotate: -90 
  },
  visible: { 
    scale: 1,
    opacity: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 20
    }
  },
  hover: {
    scale: 1.08,
    rotate: 0, // Sem rotação no hover para evitar bugs visuais
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 15,
      duration: 0.15
    }
  },
  tap: {
    scale: 0.95,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 20,
      duration: 0.1
    }
  }
}

const connectionVariants: Variants = {
  hidden: { 
    pathLength: 0,
    opacity: 0 
  },
  visible: { 
    pathLength: 1,
    opacity: 0.6,
    transition: {
      pathLength: { duration: 1.5, ease: "easeInOut" },
      opacity: { duration: 0.5 }
    }
  }
}

// Configuração dos Estados da Jornada do Usuário
const stateConfig = {
  hidden: {
    bg: 'bg-zinc-900/30',
    border: 'border-zinc-700/40',
    icon: 'text-zinc-500',
    text: 'text-zinc-400',
    glow: '',
    opacity: 'opacity-50',
    description: 'Não revelado - Complete pré-requisitos para desbloquear'
  },
  available: {
    bg: 'bg-blue-950/40',
    border: 'border-blue-500/60',
    icon: 'text-blue-400',
    text: 'text-blue-200',
    glow: 'shadow-blue-500/20',
    opacity: 'opacity-90',
    description: 'Disponível - Clique para ver instruções'
  },
  ready: {
    bg: 'bg-green-950/40',
    border: 'border-green-400/70',
    icon: 'text-green-300',
    text: 'text-green-100',
    glow: 'shadow-green-400/30 shadow-lg',
    opacity: 'opacity-100',
    description: 'Missão completa - Clique para receber XP!'
  },
  claimed: {
    bg: 'bg-gradient-to-br from-yellow-900/40 to-amber-900/40',
    border: 'border-yellow-400/80',
    icon: 'text-yellow-300',
    text: 'text-yellow-100',
    glow: 'shadow-yellow-400/40 shadow-xl',
    opacity: 'opacity-100',
    description: 'Concluído - XP recebido!'
  },
  coming_soon: {
    bg: 'bg-purple-950/40',
    border: 'border-purple-400/60',
    icon: 'text-purple-300',
    text: 'text-purple-100',
    glow: 'shadow-purple-400/20',
    opacity: 'opacity-80',
    description: 'Em breve - Sistema em desenvolvimento'
  },
  unlocked: {
    bg: 'bg-blue-950/40',
    border: 'border-blue-500/60',
    icon: 'text-blue-400',
    text: 'text-blue-200',
    glow: 'shadow-blue-500/20',
    opacity: 'opacity-90',
    description: 'Desbloqueado - Complete para progredir'
  },
  locked: {
    bg: 'bg-zinc-900/30',
    border: 'border-zinc-600/40',
    icon: 'text-zinc-500',
    text: 'text-zinc-400',
    glow: '',
    opacity: 'opacity-60',
    description: 'Bloqueado - Complete pré-requisitos'
  },
  revealed: {
    bg: 'bg-slate-950/40',
    border: 'border-slate-500/60',
    icon: 'text-slate-400',
    text: 'text-slate-200',
    glow: 'shadow-slate-500/20',
    opacity: 'opacity-75',
    description: 'Revelado - Em preparação'
  }
}

const typeConfig = {
  core: { size: 'w-20 h-20', iconSize: 'w-10 h-10' },
  bonus: { size: 'w-14 h-14', iconSize: 'w-7 h-7' },
  progression: { size: 'w-16 h-16', iconSize: 'w-8 h-8' },
  rank: { size: 'w-12 h-12', iconSize: 'w-6 h-6' },
  milestone: { size: 'w-14 h-14', iconSize: 'w-7 h-7' }
}

// Position calculator for horizontal layout - GRADE ORGANIZADA
const calculatePositions = (milestones: HorizontalMilestone[]) => {
  const positions: { [key: string]: { x: number; y: number } } = {}
  
  // Definir grid parameters
  const GRID_START_X = 120
  const TIER_WIDTH = 200
  const LANE_HEIGHT = 140
  const BASE_Y = 280 // Centro da tela
  
  milestones.forEach(milestone => {
    // X baseado no tier com espaçamento uniforme
    const gridX = GRID_START_X + milestone.tier * TIER_WIDTH
    
    // Y baseado na lane com espaçamento uniforme
    let gridY: number
    switch (milestone.lane) {
      case 1: // Top lane (bonus/milestones)
        gridY = BASE_Y - LANE_HEIGHT
        break
      case 0: // Main lane (centro)
        gridY = BASE_Y
        break
      case -1: // Bottom lane (odisseia/bonus)
        gridY = BASE_Y + LANE_HEIGHT
        break
      default:
        gridY = BASE_Y
    }
    
    // Ajustes específicos para evitar sobreposições
    let finalX = gridX
    let finalY = gridY
    
    // Ajustes específicos para milestones que ficam na mesma posição
    if (milestone.type === 'milestone') {
      // Milestones ficam ligeiramente deslocados para cima na lane superior
      finalY = gridY - 20
    }
    
    // Ajustar ranks da odisseia para ficarem em linha
    if (milestone.type === 'rank') {
      const rankOrder = ['aspirante', 'marujo', 'timoneiro', 'capitao', 'almirante']
      const rankIndex = rankOrder.indexOf(milestone.id)
      if (rankIndex >= 0) {
        // Espaçar os ranks igualmente na lane inferior
        finalX = GRID_START_X + 160 + rankIndex * 140
        finalY = BASE_Y + LANE_HEIGHT
      }
    }
    
    positions[milestone.id] = { x: finalX, y: finalY }
  })
  
  return positions
}

export function EvolutionMapHorizontal({ 
  userName = "Navigator", 
  completedMilestones = [], 
  currentXP = 0,
  onMilestoneClick, 
  onXPClaimed,
  onClose, 
  autoPlay = false 
}: EvolutionMapHorizontalProps) {
  const [selectedMilestone, setSelectedMilestone] = useState<HorizontalMilestone | null>(null)
  const [currentTierIndex, setCurrentTierIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [userXP, setUserXP] = useState(currentXP)
  
  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Group milestones by tier for column-based layout
  const tiers = HORIZONTAL_MILESTONES.reduce((acc, milestone) => {
    if (!acc[milestone.tier]) {
      acc[milestone.tier] = []
    }
    acc[milestone.tier].push(milestone)
    return acc
  }, {} as Record<number, HorizontalMilestone[]>)

  const tierArray = Object.keys(tiers)
    .map(Number)
    .sort((a, b) => a - b)
    .map(tier => ({
      id: tier,
      title: `Tier ${tier}`,
      description: getTierDescription(tier),
      state: getTierState(tier),
      treasures: tiers[tier].sort((a, b) => (a.lane || 0) - (b.lane || 0))
    }))

  // Calculate positions for connections
  const positions = calculatePositions(HORIZONTAL_MILESTONES)

  // Calculate current tier based on progress
  const activeTiers = Object.keys(tiers).map(Number).filter(tier => {
    const tierMilestones = tiers[tier]
    return tierMilestones && tierMilestones.some(m => ['claimed', 'available', 'unlocked'].includes(m.state))
  })
  const currentTier = activeTiers.length > 0 ? Math.max(...activeTiers) : 0
    
  function getTierDescription(tier: number): string {
    switch(tier) {
      case 0: return 'Fundação Pessoal'
      case 1: return 'Portal da Transformação'  
      case 2: return 'DNA & Autenticidade'
      case 3: return 'Legado & Presença'
      case 4: return 'Magnetismo & Vendas'
      case 5: return 'Abundância Manifestada'
      case 6: return 'Aceleração Exponencial'
      default: return 'Nível Especial'
    }
  }
  
  function getTierState(tier: number): 'locked' | 'revealed' | 'unlocked' | 'completed' {
    const tierMilestones = tiers[tier]
    if (!tierMilestones) return 'locked'
    
    const completedCount = tierMilestones.filter(m => m.state === 'claimed').length
    const unlockedCount = tierMilestones.filter(m => ['ready', 'available', 'unlocked'].includes(m.state)).length
    
    if (completedCount === tierMilestones.length) return 'completed'
    if (unlockedCount > 0 || completedCount > 0) return 'unlocked' 
    if (tierMilestones.some(m => m.state === 'revealed')) return 'revealed'
    return 'locked'
  }

  // Função para verificar se um milestone deve estar desbloqueado
  const isMilestoneUnlocked = (milestone: HorizontalMilestone) => {
    if (!milestone.requirements || milestone.requirements.length === 0) {
      return true // Sem pré-requisitos = sempre desbloqueado
    }
    
    // Verificar se todos os pré-requisitos estão completados
    return milestone.requirements.every(reqId => {
      const reqMilestone = HORIZONTAL_MILESTONES.find(m => m.id === reqId)
      return reqMilestone && reqMilestone.state === 'claimed'
    })
  }



  const handleMilestoneClick = (milestone: HorizontalMilestone) => {
    // Se o milestone está "ready", claim XP
    if (milestone.state === 'ready' && milestone.points) {
      const xpGained = milestone.points
      setUserXP(prev => prev + xpGained)
      onXPClaimed?.(milestone, xpGained)
      
      // Atualizar o estado do milestone para claimed (localmente)
      HORIZONTAL_MILESTONES.forEach(m => {
        if (m.id === milestone.id) {
          m.state = 'claimed'
        }
      })
      
      // Verificar e revelar próximos milestones baseado em requirements
      HORIZONTAL_MILESTONES.forEach(m => {
        if (m.state === 'hidden' && m.requirements?.includes(milestone.id)) {
          m.state = 'available'
        }
      })
      
    } else {
      // Para outros estados, apenas abrir modal de informações
      setSelectedMilestone(milestone)
      onMilestoneClick?.(milestone)
    }
  }

  const renderConnections = () => {
    const connections: JSX.Element[] = []
    
    HORIZONTAL_MILESTONES.forEach(milestone => {
      if (!milestone.connections) return
      
      milestone.connections.forEach(targetId => {
        const target = HORIZONTAL_MILESTONES.find(m => m.id === targetId)
        if (!target) return
        
        const start = positions[milestone.id]
        const end = positions[targetId]
        
        if (!start || !end) return
        
        // Determinar estilo da linha baseado no tipo de conexão
        let strokeDasharray = "8,4" // Padrão pontilhado
        let strokeColor = "url(#connectionGradient)"
        let strokeWidth = "3"
        
        // Conexões da Odisseia (ranks) ficam diferentes
        if (milestone.type === 'rank' || target.type === 'rank') {
          strokeDasharray = "12,6" // Pontilhado mais longo
          strokeColor = "url(#odysseyGradient)"
          strokeWidth = "2.5"
        }
        
        // Conexões principais (core) ficam mais grossas
        if (milestone.type === 'core' || target.type === 'core') {
          strokeWidth = "4"
          strokeDasharray = "10,5"
        }
        
        connections.push(
          <motion.line
            key={`${milestone.id}-${targetId}`}
            x1={start.x}
            y1={start.y}
            x2={end.x}
            y2={end.y}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            variants={connectionVariants}
            initial="hidden"
            animate="visible" // Sempre visível para mostrar progressão
            className="drop-shadow-sm"
            style={{ 
              opacity: 0.7,
              transition: 'all 0.3s ease'
            }}
          />
        )
      })
    })
    
    return connections
  }

  const renderMilestone = (milestone: HorizontalMilestone, index: number) => {
    const config = stateConfig[milestone.state] || stateConfig.hidden // Fallback para hidden se estado não existir
    const typeConf = typeConfig[milestone.type]
    const Icon = milestone.icon
    const pos = positions[milestone.id]
    
    if (!pos) return null

    const isUnlocked = isMilestoneUnlocked(milestone)
    const isInteractable = isUnlocked && milestone.state !== 'locked'

    // Determinar opacidade e filtros baseado no estado - MELHOR VISIBILIDADE
    let visualOpacity = 1
    let visualFilter = 'none'
    
    if (milestone.state === 'locked' && !isUnlocked) {
      // Itens bloqueados ficam visíveis com boa visibilidade para gerar desejo
      visualOpacity = 0.65
      visualFilter = 'grayscale(60%) brightness(0.7)'
    } else if (milestone.state === 'coming_soon') {
      // Coming soon fica bem visível com efeito roxo
      visualOpacity = 0.85
      visualFilter = 'hue-rotate(280deg) saturate(1.2)'
    }

    return (
      <motion.div
        key={milestone.id}
        variants={milestoneVariants}
        initial="hidden"
        animate="visible" // Sempre animar para visible após aparecer
        whileHover={isInteractable ? "hover" : undefined}
        whileTap={isInteractable ? "tap" : undefined}
        className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
        style={{ 
          left: pos.x, 
          top: pos.y,
          opacity: visualOpacity,
          filter: visualFilter,
          pointerEvents: isInteractable ? 'auto' : 'none',
          cursor: isInteractable ? 'pointer' : 'default'
        }}
        onClick={() => isInteractable && handleMilestoneClick(milestone)}
      >
        {/* Milestone Circle */}
        <motion.div className={`
          ${typeConf.size} rounded-2xl border-2 ${config.border} ${config.bg} ${config.glow}
          flex items-center justify-center backdrop-blur-sm transition-all duration-300
          group relative ${config.opacity}
        `}>
          {/* Pulsing ring for ready items (claim XP) */}
          {milestone.state === 'ready' && (
            <motion.div
              className="absolute inset-0 rounded-2xl border-2 border-green-400/60"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.8, 0, 0.8]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
          
          {/* Golden glow for claimed items */}
          {milestone.state === 'claimed' && (
            <motion.div
              className="absolute inset-0 rounded-2xl bg-gradient-to-br from-yellow-400/20 to-amber-400/20"
              animate={{
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
          
          {/* State Indicators */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute -top-2 -right-2 z-10"
          >
            {milestone.state === 'claimed' && (
              <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full border-2 border-zinc-950 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-yellow-900" />
              </div>
            )}
            
            {milestone.state === 'ready' && (
              <motion.div 
                className="w-6 h-6 bg-green-500 rounded-full border-2 border-zinc-950 flex items-center justify-center"
                animate={{ 
                  scale: [1, 1.2, 1],
                  boxShadow: ['0 0 0 rgba(34, 197, 94, 0)', '0 0 20px rgba(34, 197, 94, 0.5)', '0 0 0 rgba(34, 197, 94, 0)']
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Star className="w-4 h-4 text-white" />
              </motion.div>
            )}
            
            {milestone.state === 'hidden' && (
              <div className="w-6 h-6 bg-zinc-700 rounded-full border-2 border-zinc-950 flex items-center justify-center">
                <Lock className="w-4 h-4 text-zinc-400" />
              </div>
            )}
            
            {milestone.state === 'coming_soon' && (
              <div className="w-6 h-6 bg-purple-600 rounded-full border-2 border-zinc-950 flex items-center justify-center">
                <Clock className="w-4 h-4 text-white" />
              </div>
            )}
          </motion.div>

          <Icon className={`${typeConf.iconSize} ${config.icon}`} />
        </motion.div>
        
        {/* Milestone Label */}
        <motion.div 
          className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-zinc-900/90 backdrop-blur-sm border border-zinc-700/50 rounded-lg px-3 py-2 min-w-24">
            <p className={`text-sm font-medium ${config.text} whitespace-nowrap`}>
              {milestone.title}
            </p>
            {milestone.type === 'bonus' && (
              <p className="text-xs text-yellow-400 mt-1">✨ Bonus</p>
            )}
            {milestone.points && (
              <p className="text-xs text-blue-400 mt-1">+{milestone.points} XP</p>
            )}
          </div>
        </motion.div>

        {/* Tier indicator */}
        <motion.div
          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-zinc-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.8 }}
        >
          T{milestone.tier}
        </motion.div>
      </motion.div>
    )
  }

  const nextTier = () => {
    if (currentTierIndex < tierArray.length - 1) {
      setCurrentTierIndex(currentTierIndex + 1)
    }
  }

  const prevTier = () => {
    if (currentTierIndex > 0) {
      setCurrentTierIndex(currentTierIndex - 1)
    }
  }

  const getUnlockedTiers = () => {
    return tierArray.filter(tier => tier.state !== 'locked').length
  }

  const getTotalTreasures = () => {
    return HORIZONTAL_MILESTONES.length
  }

  const getDiscoveredTreasures = () => {
    return HORIZONTAL_MILESTONES.filter(m => ['claimed', 'ready', 'available'].includes(m.state)).length
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

  const renderTierColumn = (tier: any, index: number) => {
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
          ${isMobile ? 'w-full' : 'min-w-96 flex-shrink-0'} 
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
          {tier.treasures.map((treasure: HorizontalMilestone, treasureIndex: number) => {
            const config = stateConfig[treasure.state] || stateConfig.hidden
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
                onClick={() => handleMilestoneClick(treasure)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Treasure Icon */}
                <div className={`
                  ${typeConf.size} rounded-2xl border-2 ${config.border} ${config.bg} ${config.glow}
                  flex items-center justify-center backdrop-blur-sm transition-all duration-300
                  ${config.opacity} relative
                `}>
                  {treasure.state === 'claimed' && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full border-2 border-zinc-950 flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-yellow-900" />
                    </div>
                  )}
                  
                  {treasure.state === 'ready' && (
                    <motion.div 
                      className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-zinc-950 flex items-center justify-center"
                      animate={{ 
                        scale: [1, 1.2, 1],
                        boxShadow: ['0 0 0 rgba(34, 197, 94, 0)', '0 0 20px rgba(34, 197, 94, 0.5)', '0 0 0 rgba(34, 197, 94, 0)']
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <Star className="w-3 h-3 text-white" />
                    </motion.div>
                  )}
                  
                  {['hidden', 'locked'].includes(treasure.state) && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-zinc-700 rounded-full border-2 border-zinc-950 flex items-center justify-center">
                      <Lock className="w-3 h-3 text-zinc-400" />
                    </div>
                  )}
                  
                  {treasure.state === 'coming_soon' && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-purple-600 rounded-full border-2 border-zinc-950 flex items-center justify-center">
                      <Clock className="w-3 h-3 text-white" />
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
                {tierArray[currentTierIndex]?.title}
              </p>
              <p className="text-xs text-zinc-400">
                {currentTierIndex + 1} de {tierArray.length}
              </p>
            </div>
            
            <button
              onClick={nextTier}
              disabled={currentTierIndex === tierArray.length - 1}
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
            {tierArray.map((tier, index) => renderTierColumn(tier, index))}
          </div>
        </div>
      </div>

      {/* Horizontal Skill Tree Container */}
      <div className="flex-1 relative overflow-x-auto overflow-y-hidden">
        <motion.div 
          className="relative min-w-[1800px] h-full" // Aumentar largura para acomodar melhor
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* SVG for Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
            <defs>
              <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.6" />
              </linearGradient>
              <linearGradient id="odysseyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.5" />
                <stop offset="50%" stopColor="#a855f7" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#c084fc" stopOpacity="0.5" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            {renderConnections()}
          </svg>

          {/* Lane Labels */}
          <div className="absolute left-4 top-0 h-full flex flex-col justify-center text-xs text-zinc-500 space-y-32">
            <div className="transform -rotate-90 whitespace-nowrap">Milestones & Bonus</div>
            <div className="transform -rotate-90 whitespace-nowrap">Jornada Principal</div>
            <div className="transform -rotate-90 whitespace-nowrap">Odisseia & Bonus</div>
          </div>

          {/* Tier Indicators */}
          <div className="absolute top-8 left-0 right-0 flex justify-center">
            <div className="flex items-center gap-8 text-xs text-zinc-500">
              {Array.from({ length: 7 }, (_, i) => (
                <motion.div
                  key={i}
                  className={`px-3 py-1 rounded-full border ${
                    i <= currentTier 
                      ? 'border-blue-500/50 bg-blue-950/30 text-blue-300' 
                      : 'border-zinc-700/50 bg-zinc-900/30'
                  }`}
                  animate={{
                    scale: i === currentTier ? [1, 1.1, 1] : 1
                  }}
                  transition={{ duration: 0.3 }}
                >
                  Tier {i}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Milestones */}
          {HORIZONTAL_MILESTONES.map((milestone, index) => renderMilestone(milestone, index))}
        </motion.div>
      </div>

      {/* Milestone Detail Modal */}
      <AnimatePresence>
        {selectedMilestone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setSelectedMilestone(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-zinc-900 border border-zinc-700 rounded-2xl p-8 max-w-md w-full"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className={`w-12 h-12 rounded-xl ${stateConfig[selectedMilestone.state].bg} border-2 ${stateConfig[selectedMilestone.state].border} flex items-center justify-center relative`}>
                  <selectedMilestone.icon className={`w-6 h-6 ${stateConfig[selectedMilestone.state].icon}`} />
                  {selectedMilestone.state === 'ready' && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg">{selectedMilestone.title}</h3>
                  <p className="text-zinc-400 text-sm mt-1">{selectedMilestone.description}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs">
                    <span className={`px-2 py-1 rounded text-xs ${stateConfig[selectedMilestone.state].bg} ${stateConfig[selectedMilestone.state].text}`}>
                      {stateConfig[selectedMilestone.state].description}
                    </span>
                    <span className="px-2 py-1 bg-zinc-800 rounded text-zinc-400">
                      Tier {selectedMilestone.tier}
                    </span>
                    {selectedMilestone.missionType && (
                      <span className="px-2 py-1 bg-blue-900/50 rounded text-blue-300 capitalize">
                        {selectedMilestone.missionType}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {selectedMilestone.requirements && (
                <div className="mb-4">
                  <h4 className="text-white font-medium text-sm mb-2">Pré-requisitos:</h4>
                  <div className="space-y-1">
                    {selectedMilestone.requirements.map(req => (
                      <div key={req} className="text-zinc-400 text-sm flex items-center gap-2">
                        <ChevronRight className="w-3 h-3" />
                        {HORIZONTAL_MILESTONES.find(m => m.id === req)?.title || req}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Instructions */}
              {selectedMilestone.instructions && (
                <div className="mb-4">
                  <h4 className="text-white font-medium text-sm mb-2">Como conquistar:</h4>
                  <div className="p-3 bg-blue-950/30 border border-blue-700/30 rounded-lg">
                    <p className="text-blue-200 text-sm leading-relaxed">
                      {selectedMilestone.instructions}
                    </p>
                  </div>
                </div>
              )}

              {/* Deliverables */}
              {selectedMilestone.deliverables && (
                <div className="mb-4">
                  <h4 className="text-white font-medium text-sm mb-2">O que você ganha:</h4>
                  <div className="space-y-1">
                    {selectedMilestone.deliverables.map(deliverable => (
                      <div key={deliverable} className="text-green-400 text-sm flex items-center gap-2">
                        <CheckCircle className="w-3 h-3" />
                        {deliverable}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedMilestone.results && (
                <div className="mb-4">
                  <h4 className="text-white font-medium text-sm mb-2">Recompensas:</h4>
                  <div className="space-y-1">
                    {selectedMilestone.results.map(result => (
                      <div key={result} className="text-yellow-400 text-sm flex items-center gap-2">
                        <Star className="w-3 h-3" />
                        {result}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center gap-4">
                {selectedMilestone.points && (
                  <span className="text-yellow-400 text-sm font-medium flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    +{selectedMilestone.points} XP
                  </span>
                )}
                
                <div className="flex gap-2">
                  {selectedMilestone.state === 'ready' && (
                    <button
                      onClick={() => {
                        handleMilestoneClick(selectedMilestone)
                        setSelectedMilestone(null)
                      }}
                      className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-xl text-white text-sm transition-colors font-medium flex items-center gap-2"
                    >
                      <Star className="w-4 h-4" />
                      Receber XP
                    </button>
                  )}
                  
                  <button
                    onClick={() => setSelectedMilestone(null)}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-white text-sm transition-colors"
                  >
                    Fechar
                  </button>
                </div>
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
                    {getUnlockedTiers()}/{tierArray.length}
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
              
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center">
                  <Star className="w-3 h-3 text-yellow-900" />
                </div>
                <div>
                  <p className="text-white font-medium">
                    {userXP.toLocaleString()}
                  </p>
                  <p className="text-xs text-zinc-400">XP Total</p>
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