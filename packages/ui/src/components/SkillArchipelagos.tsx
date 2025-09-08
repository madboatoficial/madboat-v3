"use client"

/**
 * 🌊 SKILL ARCHIPELAGOS - Revolutionary Nautical Transformation Journey
 * Deep ocean exploration system with islands of knowledge and flowing currents
 * Each skill is a destination in the vast ocean of personal transformation
 */

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, PanInfo } from 'motion/react'
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
  Navigation,
  Ship,
  Waves,
  Sun,
  Moon,
  Lightbulb
} from 'lucide-react'

// Ocean depth levels - Surface to Deep Ocean
export type SkillDepth = 'surface' | 'shallow' | 'mid' | 'deep' | 'abyss'

// Skill states in the ocean journey
export type SkillState = 'locked' | 'revealed' | 'available' | 'in_progress' | 'completed' | 'mastered'

// Lighthouse milestone types
export type LighthouseType = 'foundation' | 'transformation' | 'mastery' | 'legend'

export interface SkillNode {
  id: string
  title: string
  description: string
  detailedDescription?: string
  state: SkillState
  icon: React.ComponentType<any>
  depth: SkillDepth
  archipelago: string
  position: { x: number; y: number }
  prerequisites: string[]
  unlocks: string[]
  experience: number
  maxExperience: number
  type: 'core' | 'bonus' | 'mastery' | 'legendary'
  difficulty: 1 | 2 | 3 | 4 | 5
  estimatedTime?: string
}

export interface Archipelago {
  id: string
  name: string
  theme: string
  description: string
  color: {
    primary: string
    secondary: string
    accent: string
  }
  position: { x: number; y: number }
  skills: SkillNode[]
  lighthouse?: {
    id: string
    name: string
    type: LighthouseType
    position: { x: number; y: number }
    state: 'dormant' | 'active' | 'beacon'
  }
}

interface SkillArchipelagosProps {
  userName?: string
  completedSkills?: string[]
  onSkillClick?: (skill: SkillNode) => void
  onClose?: () => void
  currentDepth?: SkillDepth
}

// Ocean color palette for depth-based theming
const depthColors = {
  surface: {
    bg: 'from-sky-200 to-cyan-300',
    water: 'bg-gradient-to-b from-cyan-100/40 to-blue-200/60',
    text: 'text-slate-800',
    glow: 'shadow-cyan-200/50'
  },
  shallow: {
    bg: 'from-cyan-300 to-blue-400',
    water: 'bg-gradient-to-b from-blue-200/40 to-blue-400/60',
    text: 'text-slate-700',
    glow: 'shadow-blue-300/50'
  },
  mid: {
    bg: 'from-blue-500 to-indigo-600',
    water: 'bg-gradient-to-b from-blue-400/40 to-indigo-500/60',
    text: 'text-white',
    glow: 'shadow-indigo-400/50'
  },
  deep: {
    bg: 'from-indigo-700 to-purple-800',
    water: 'bg-gradient-to-b from-indigo-600/40 to-purple-700/60',
    text: 'text-cyan-100',
    glow: 'shadow-purple-500/50'
  },
  abyss: {
    bg: 'from-purple-900 to-slate-900',
    water: 'bg-gradient-to-b from-purple-800/40 to-slate-800/60',
    text: 'text-cyan-200',
    glow: 'shadow-purple-600/50'
  }
}

// Skill state visual configurations
const skillStateConfig = {
  locked: {
    bg: 'bg-slate-800/60',
    border: 'border-slate-600/40',
    icon: 'text-slate-400',
    text: 'text-slate-500',
    glow: '',
    bubble: 'shadow-slate-500/20',
    opacity: 0.4
  },
  revealed: {
    bg: 'bg-amber-900/40',
    border: 'border-amber-500/60',
    icon: 'text-amber-400',
    text: 'text-amber-200',
    glow: 'shadow-amber-400/30',
    bubble: 'shadow-amber-500/40',
    opacity: 0.7
  },
  available: {
    bg: 'bg-emerald-900/40',
    border: 'border-emerald-400/60',
    icon: 'text-emerald-300',
    text: 'text-emerald-100',
    glow: 'shadow-emerald-400/40',
    bubble: 'shadow-emerald-500/50',
    opacity: 1
  },
  in_progress: {
    bg: 'bg-blue-900/40',
    border: 'border-blue-400/60',
    icon: 'text-blue-300',
    text: 'text-blue-100',
    glow: 'shadow-blue-400/40',
    bubble: 'shadow-blue-500/60',
    opacity: 1
  },
  completed: {
    bg: 'bg-cyan-900/40',
    border: 'border-cyan-400/60',
    icon: 'text-cyan-300',
    text: 'text-cyan-100',
    glow: 'shadow-cyan-400/50',
    bubble: 'shadow-cyan-500/70',
    opacity: 1
  },
  mastered: {
    bg: 'bg-gradient-to-r from-yellow-600/40 to-orange-600/40',
    border: 'border-yellow-400/80',
    icon: 'text-yellow-300',
    text: 'text-yellow-100',
    glow: 'shadow-yellow-400/60',
    bubble: 'shadow-yellow-500/80',
    opacity: 1
  }
}

// Sample archipelago data - MadBoat transformation journey
const ARCHIPELAGOS_DATA: Archipelago[] = [
  {
    id: 'foundation',
    name: 'Ilhas da Fundação',
    theme: 'Personal Foundation',
    description: 'Descoberta da identidade pessoal e propósito',
    color: {
      primary: '#0ea5e9',
      secondary: '#0284c7',
      accent: '#f59e0b'
    },
    position: { x: 200, y: 300 },
    lighthouse: {
      id: 'foundation-beacon',
      name: 'Farol da Autenticidade',
      type: 'foundation',
      position: { x: 150, y: 250 },
      state: 'beacon'
    },
    skills: [
      {
        id: 'persona-discovery',
        title: 'Persona Única',
        description: 'Descoberta da sua identidade única no mercado',
        detailedDescription: 'Mergulhe fundo em quem você realmente é e como se diferencia no oceano digital',
        state: 'completed',
        icon: Brain,
        depth: 'surface',
        archipelago: 'foundation',
        position: { x: 180, y: 280 },
        prerequisites: [],
        unlocks: ['authentic-dna'],
        experience: 500,
        maxExperience: 500,
        type: 'core',
        difficulty: 2,
        estimatedTime: '2-3 horas'
      },
      {
        id: 'authentic-dna',
        title: 'DNA Criativo',
        description: 'Sua essência criativa única revelada',
        detailedDescription: 'Explore as profundezas da sua criatividade autêntica',
        state: 'available',
        icon: Sparkles,
        depth: 'shallow',
        archipelago: 'foundation',
        position: { x: 220, y: 320 },
        prerequisites: ['persona-discovery'],
        unlocks: ['authentic-magnetism'],
        experience: 200,
        maxExperience: 400,
        type: 'core',
        difficulty: 3,
        estimatedTime: '3-4 horas'
      }
    ]
  },
  {
    id: 'transformation',
    name: 'Arquipélago ALMA',
    theme: 'Método ALMA',
    description: 'Jornada através das 4 fases da transformação autêntica',
    color: {
      primary: '#8b5cf6',
      secondary: '#7c3aed',
      accent: '#f59e0b'
    },
    position: { x: 500, y: 400 },
    lighthouse: {
      id: 'alma-beacon',
      name: 'Farol da Transformação',
      type: 'transformation',
      position: { x: 550, y: 350 },
      state: 'active'
    },
    skills: [
      {
        id: 'alma-authenticity',
        title: 'ALMA - Autenticidade',
        description: 'Primeira fase: descoberta do seu eu autêntico',
        state: 'revealed',
        icon: Eye,
        depth: 'shallow',
        archipelago: 'transformation',
        position: { x: 480, y: 380 },
        prerequisites: ['authentic-dna'],
        unlocks: ['alma-legacy'],
        experience: 0,
        maxExperience: 300,
        type: 'core',
        difficulty: 3
      },
      {
        id: 'alma-legacy',
        title: 'ALMA - Legado',
        description: 'Segunda fase: construção do seu legado pessoal',
        state: 'locked',
        icon: Crown,
        depth: 'mid',
        archipelago: 'transformation',
        position: { x: 520, y: 420 },
        prerequisites: ['alma-authenticity'],
        unlocks: ['alma-magnetism'],
        experience: 0,
        maxExperience: 300,
        type: 'core',
        difficulty: 4
      },
      {
        id: 'alma-magnetism',
        title: 'ALMA - Magnetismo',
        description: 'Terceira fase: desenvolvimento do magnetismo autêntico',
        state: 'locked',
        icon: Zap,
        depth: 'deep',
        archipelago: 'transformation',
        position: { x: 560, y: 460 },
        prerequisites: ['alma-legacy'],
        unlocks: ['alma-abundance'],
        experience: 0,
        maxExperience: 300,
        type: 'core',
        difficulty: 4
      },
      {
        id: 'alma-abundance',
        title: 'ALMA - Abundância',
        description: 'Quarta fase: manifestação da abundância autêntica',
        state: 'locked',
        icon: Gem,
        depth: 'deep',
        archipelago: 'transformation',
        position: { x: 600, y: 400 },
        prerequisites: ['alma-magnetism'],
        unlocks: ['vortex-method'],
        experience: 0,
        maxExperience: 300,
        type: 'core',
        difficulty: 5
      }
    ]
  },
  {
    id: 'mastery',
    name: 'Ilha do Vórtice',
    theme: 'Método Vórtice',
    description: 'Aceleração exponencial e maestria transformacional',
    color: {
      primary: '#ec4899',
      secondary: '#db2777',
      accent: '#f59e0b'
    },
    position: { x: 800, y: 300 },
    lighthouse: {
      id: 'vortex-beacon',
      name: 'Farol da Maestria',
      type: 'mastery',
      position: { x: 850, y: 250 },
      state: 'dormant'
    },
    skills: [
      {
        id: 'vortex-method',
        title: 'Método Vórtice',
        description: 'Aceleração exponencial da transformação',
        state: 'locked',
        icon: Rocket,
        depth: 'abyss',
        archipelago: 'mastery',
        position: { x: 820, y: 280 },
        prerequisites: ['alma-abundance'],
        unlocks: ['transformation-master'],
        experience: 0,
        maxExperience: 2000,
        type: 'legendary',
        difficulty: 5
      },
      {
        id: 'transformation-master',
        title: 'Mestre da Transformação',
        description: 'Domínio completo da jornada transformacional',
        state: 'locked',
        icon: Crown,
        depth: 'abyss',
        archipelago: 'mastery',
        position: { x: 860, y: 320 },
        prerequisites: ['vortex-method'],
        unlocks: [],
        experience: 0,
        maxExperience: 1000,
        type: 'legendary',
        difficulty: 5
      }
    ]
  }
]

export function SkillArchipelagos({ 
  userName = "Navigator", 
  completedSkills = [], 
  onSkillClick, 
  onClose,
  currentDepth = 'surface'
}: SkillArchipelagosProps) {
  const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(null)
  const [viewportTransform, setViewportTransform] = useState({ x: 0, y: 0, scale: 1 })
  const [isDragging, setIsDragging] = useState(false)
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [oceanDepth, setOceanDepth] = useState<SkillDepth>(currentDepth)
  const [isMobile, setIsMobile] = useState(false)
  const [selectedArchipelago, setSelectedArchipelago] = useState<string>('foundation')

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  // Handle viewport panning and zooming
  const handlePan = useCallback((event: any, info: PanInfo) => {
    setViewportTransform(prev => ({
      ...prev,
      x: prev.x + info.delta.x,
      y: prev.y + info.delta.y
    }))
  }, [])

  const handleWheel = useCallback((event: React.WheelEvent) => {
    event.preventDefault()
    const delta = event.deltaY > 0 ? 0.9 : 1.1
    const newScale = Math.max(0.3, Math.min(2, viewportTransform.scale * delta))
    
    setViewportTransform(prev => ({
      ...prev,
      scale: newScale
    }))
  }, [viewportTransform.scale])

  // Skill interaction handlers
  const handleSkillClick = (skill: SkillNode) => {
    if (skill.state === 'locked') return
    setSelectedSkill(skill)
    onSkillClick?.(skill)
  }

  // Generate flowing current paths between connected skills
  const generateCurrentPath = (from: { x: number; y: number }, to: { x: number; y: number }) => {
    const dx = to.x - from.x
    const dy = to.y - from.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    // Create flowing curve
    const controlOffset = distance * 0.3
    const controlX1 = from.x + dx * 0.3 + dy * 0.2
    const controlY1 = from.y + dy * 0.3 - dx * 0.2
    const controlX2 = to.x - dx * 0.3 + dy * 0.2
    const controlY2 = to.y - dy * 0.3 - dx * 0.2
    
    return `M ${from.x} ${from.y} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${to.x} ${to.y}`
  }

  // Render skill node with ocean bubble aesthetic
  const renderSkillNode = (skill: SkillNode) => {
    const config = skillStateConfig[skill.state]
    const Icon = skill.icon
    const isHovered = hoveredSkill === skill.id
    const progressPercent = (skill.experience / skill.maxExperience) * 100

    const bubbleSize = skill.type === 'legendary' ? 80 : skill.type === 'mastery' ? 70 : skill.type === 'core' ? 60 : 50
    
    return (
      <motion.div
        key={skill.id}
        className="absolute z-10"
        style={{
          left: skill.position.x - bubbleSize/2,
          top: skill.position.y - bubbleSize/2
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: isHovered ? 1.1 : 1, 
          opacity: config.opacity,
          y: isHovered ? -5 : 0
        }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 25,
          opacity: { duration: 0.3 }
        }}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Skill Bubble */}
        <motion.div
          className={`
            relative rounded-full border-2 backdrop-blur-sm cursor-pointer
            ${config.bg} ${config.border} ${config.glow} ${config.bubble}
            flex items-center justify-center transition-all duration-500
            group hover:shadow-2xl
          `}
          style={{ width: bubbleSize, height: bubbleSize }}
          onClick={() => handleSkillClick(skill)}
          onMouseEnter={() => setHoveredSkill(skill.id)}
          onMouseLeave={() => setHoveredSkill(null)}
          animate={{
            boxShadow: skill.state === 'available' ? [
              `0 0 0 0 ${config.border.replace('border-', '').replace('/60', '')}40`,
              `0 0 0 10px ${config.border.replace('border-', '').replace('/60', '')}20`,
              `0 0 0 20px ${config.border.replace('border-', '').replace('/60', '')}00`,
            ] : undefined
          }}
          transition={{ 
            boxShadow: { 
              duration: 2, 
              repeat: skill.state === 'available' ? Infinity : 0,
              ease: "easeOut"
            }
          }}
        >
          {/* Progress ring for in-progress skills */}
          {skill.state === 'in_progress' && (
            <div className="absolute inset-0 rounded-full">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-blue-400/30"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray={`${progressPercent * 2.83} ${283 - progressPercent * 2.83}`}
                  className="text-blue-400"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          )}

          {/* Skill Icon */}
          <Icon className={`${bubbleSize > 60 ? 'w-8 h-8' : 'w-6 h-6'} ${config.icon} relative z-10`} />
          
          {/* State indicators */}
          {skill.state === 'completed' && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-cyan-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
              <CheckCircle className="w-3 h-3 text-white" />
            </div>
          )}
          
          {skill.state === 'mastered' && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
              <Crown className="w-3 h-3 text-white" />
            </div>
          )}
          
          {skill.state === 'locked' && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-slate-700 rounded-full border-2 border-slate-900 flex items-center justify-center">
              <Lock className="w-3 h-3 text-slate-400" />
            </div>
          )}

          {/* Depth indicator */}
          <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs px-2 py-1 rounded-full ${config.bg} ${config.text} opacity-80`}>
            {skill.depth}
          </div>
        </motion.div>

        {/* Skill tooltip on hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: -10, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full mb-2 z-20"
            >
              <div className={`
                bg-slate-800/90 backdrop-blur-sm border border-slate-600/50 
                rounded-xl p-3 text-white text-sm max-w-xs shadow-xl
              `}>
                <h4 className="font-bold text-cyan-300 mb-1">{skill.title}</h4>
                <p className="text-slate-300 text-xs mb-2">{skill.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className={`px-2 py-1 rounded-full ${config.bg} ${config.text}`}>
                    {skill.type === 'legendary' ? '🌟 Lendário' : 
                     skill.type === 'mastery' ? '👑 Maestria' :
                     skill.type === 'core' ? '⚡ Essencial' : '✨ Bônus'}
                  </span>
                  <span className="text-slate-400">
                    Dificuldade: {'⭐'.repeat(skill.difficulty)}
                  </span>
                </div>
                {skill.estimatedTime && (
                  <div className="text-xs text-slate-400 mt-1">
                    ⏱️ {skill.estimatedTime}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    )
  }

  // Render lighthouse beacon
  const renderLighthouse = (lighthouse: Archipelago['lighthouse'], archipelago: Archipelago) => {
    if (!lighthouse) return null

    return (
      <motion.div
        className="absolute"
        style={{
          left: lighthouse.position.x - 30,
          top: lighthouse.position.y - 60
        }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: lighthouse.state === 'dormant' ? 0.4 : 1,
          scale: 1
        }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        {/* Lighthouse Structure */}
        <div className="relative">
          {/* Lighthouse Base */}
          <div className="w-12 h-16 bg-gradient-to-t from-slate-600 to-slate-400 rounded-t-full relative">
            {/* Lighthouse Light */}
            <div className={`
              absolute -top-2 left-1/2 transform -translate-x-1/2 
              w-6 h-6 rounded-full flex items-center justify-center
              ${lighthouse.state === 'beacon' ? 'bg-yellow-400 shadow-yellow-400/80 shadow-2xl' :
                lighthouse.state === 'active' ? 'bg-blue-400 shadow-blue-400/60 shadow-xl' :
                'bg-slate-600'
              }
            `}>
              <Lightbulb className="w-3 h-3 text-white" />
            </div>

            {/* Rotating Light Beam */}
            {lighthouse.state === 'beacon' && (
              <motion.div
                className="absolute -top-4 left-1/2 transform -translate-x-1/2 origin-bottom"
                animate={{ rotate: 360 }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
              >
                <div className="w-1 h-32 bg-gradient-to-t from-yellow-400/80 to-transparent rounded-full blur-sm" />
              </motion.div>
            )}

            {/* Lighthouse Name */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-center">
              <p className="text-xs text-slate-300 font-medium whitespace-nowrap">
                {lighthouse.name}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  // Render flowing current connections
  const renderCurrents = () => {
    const allSkills = ARCHIPELAGOS_DATA.flatMap(arch => arch.skills)
    const connections: JSX.Element[] = []

    allSkills.forEach(skill => {
      skill.unlocks.forEach(unlockId => {
        const targetSkill = allSkills.find(s => s.id === unlockId)
        if (targetSkill) {
          const pathData = generateCurrentPath(skill.position, targetSkill.position)
          const isActive = skill.state === 'completed' || skill.state === 'mastered'
          
          connections.push(
            <motion.path
              key={`${skill.id}-${unlockId}`}
              d={pathData}
              fill="none"
              stroke={isActive ? '#06b6d4' : '#475569'}
              strokeWidth={isActive ? 3 : 1}
              strokeDasharray={isActive ? "0" : "5,5"}
              className={`transition-all duration-500 ${isActive ? 'opacity-80' : 'opacity-30'}`}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 0.5 }}
            />
          )

          // Animated flow particles for active connections
          if (isActive) {
            connections.push(
              <motion.circle
                key={`particle-${skill.id}-${unlockId}`}
                r="3"
                fill="#22d3ee"
                className="drop-shadow-lg"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  offsetDistance: ["0%", "100%"]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  offsetPath: `path("${pathData}")`,
                  offsetRotate: "auto"
                }}
              />
            )
          }
        }
      })
    })

    return connections
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* Animated Ocean Background */}
      <div className="absolute inset-0">
        {/* Ocean Gradient Based on Depth */}
        <div className={`
          absolute inset-0 bg-gradient-to-b opacity-30
          ${depthColors[oceanDepth].bg}
        `} />
        
        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400/40 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
              animate={{
                y: [-10, 10, -10],
                x: [-5, 5, -5],
                opacity: [0.4, 0.8, 0.4]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>

        {/* Wave Animation */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-32 opacity-20"
          animate={{
            backgroundPosition: ["0% 0%", "100% 0%"]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            background: `repeating-linear-gradient(
              90deg,
              transparent,
              transparent 50px,
              rgba(6, 182, 212, 0.3) 100px
            )`
          }}
        />
      </div>

      {/* Navigation Header */}
      <div className="relative z-40 bg-slate-900/60 backdrop-blur-sm border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <Ship className="w-8 h-8 text-cyan-400" />
                <div>
                  <h1 className="text-2xl font-bold text-white">MadBoat</h1>
                  <p className="text-xs text-slate-400">Skill Archipelagos</p>
                </div>
              </div>
              {!isMobile && (
                <>
                  <div className="h-8 w-px bg-slate-600 mx-2" />
                  <div>
                    <h2 className="text-xl font-light text-white tracking-wide">
                      🌊 Oceano de Transformação
                    </h2>
                    <p className="text-slate-400 text-sm">
                      Navegue pelas ilhas do conhecimento
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Ocean Depth Selector */}
            <div className="flex items-center gap-2">
              {!isMobile && (
                <select
                  value={oceanDepth}
                  onChange={(e) => setOceanDepth(e.target.value as SkillDepth)}
                  className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-1 text-sm text-white"
                >
                  <option value="surface">🌊 Superfície</option>
                  <option value="shallow">🐠 Águas Rasas</option>
                  <option value="mid">🐙 Águas Médias</option>
                  <option value="deep">🦈 Águas Profundas</option>
                  <option value="abyss">🐋 Abismo</option>
                </select>
              )}
              
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-3 text-slate-400 hover:text-white transition-colors rounded-xl hover:bg-slate-800/50"
                >
                  <X className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Archipelago Navigator */}
      {isMobile && (
        <div className="relative z-40 bg-slate-800/60 backdrop-blur-sm border-b border-slate-600/50 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-medium">Explorar Arquipélagos</h3>
            <select
              value={oceanDepth}
              onChange={(e) => setOceanDepth(e.target.value as SkillDepth)}
              className="bg-slate-700 border border-slate-600 rounded-lg px-2 py-1 text-xs text-white"
            >
              <option value="surface">🌊 Superfície</option>
              <option value="shallow">🐠 Rasas</option>
              <option value="mid">🐙 Médias</option>
              <option value="deep">🦈 Profundas</option>
              <option value="abyss">🐋 Abismo</option>
            </select>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2">
            {ARCHIPELAGOS_DATA.map(archipelago => (
              <button
                key={archipelago.id}
                onClick={() => {
                  setSelectedArchipelago(archipelago.id)
                  // Auto-focus on archipelago position
                  setViewportTransform({
                    x: -archipelago.position.x + 200,
                    y: -archipelago.position.y + 300,
                    scale: 1.2
                  })
                }}
                className={`
                  flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all
                  ${selectedArchipelago === archipelago.id 
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30' 
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                  }
                `}
              >
                {archipelago.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Ocean Canvas */}
      <div 
        ref={containerRef}
        className="flex-1 relative overflow-hidden cursor-grab active:cursor-grabbing"
        onWheel={handleWheel}
      >
        <motion.div
          drag
          dragConstraints={{ left: -2000, right: 2000, top: -1500, bottom: 1500 }}
          onDrag={handlePan}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
          className="relative"
          style={{
            width: '100%',
            height: '100%',
            minHeight: '600px',
            transform: `translate3d(${viewportTransform.x}px, ${viewportTransform.y}px, 0) scale(${viewportTransform.scale})`
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* SVG Layer for Currents */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
            style={{ width: '100%', height: '100%' }}
          >
            {renderCurrents()}
          </svg>

          {/* Archipelagos and Skills */}
          <div className="relative w-full h-full">
            {ARCHIPELAGOS_DATA.map(archipelago => (
              <div key={archipelago.id} className="relative">
                {/* Archipelago Background */}
                <motion.div
                  className="absolute rounded-full opacity-20"
                  style={{
                    left: archipelago.position.x - 120,
                    top: archipelago.position.y - 120,
                    width: 240,
                    height: 240,
                    background: `radial-gradient(circle, ${archipelago.color.primary}40, transparent 70%)`
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.2 }}
                  transition={{ duration: 1.5, delay: 0.3 }}
                />

                {/* Archipelago Label */}
                <motion.div
                  className="absolute text-center"
                  style={{
                    left: archipelago.position.x - 100,
                    top: archipelago.position.y - 150
                  }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  <h3 className="text-lg font-bold text-white mb-1">
                    {archipelago.name}
                  </h3>
                  <p className="text-sm text-slate-300 opacity-80">
                    {archipelago.description}
                  </p>
                </motion.div>

                {/* Lighthouse */}
                {renderLighthouse(archipelago.lighthouse, archipelago)}

                {/* Skills */}
                {archipelago.skills.map(skill => renderSkillNode(skill))}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Skill Detail Modal */}
      <AnimatePresence>
        {selectedSkill && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setSelectedSkill(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className={`
                  w-20 h-20 rounded-2xl border-2 flex items-center justify-center
                  ${skillStateConfig[selectedSkill.state].bg} 
                  ${skillStateConfig[selectedSkill.state].border}
                  ${skillStateConfig[selectedSkill.state].glow}
                `}>
                  <selectedSkill.icon className={`w-10 h-10 ${skillStateConfig[selectedSkill.state].icon}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-2xl mb-2">{selectedSkill.title}</h3>
                  <p className="text-slate-300 text-sm mb-3">{selectedSkill.description}</p>
                  {selectedSkill.detailedDescription && (
                    <p className="text-slate-400 text-sm">{selectedSkill.detailedDescription}</p>
                  )}
                </div>
              </div>

              {/* Skill Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-800/50 rounded-xl p-4">
                  <p className="text-slate-400 text-xs mb-1">Profundidade</p>
                  <p className="text-white font-medium capitalize">{selectedSkill.depth}</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4">
                  <p className="text-slate-400 text-xs mb-1">Dificuldade</p>
                  <p className="text-white font-medium">{'⭐'.repeat(selectedSkill.difficulty)}</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4">
                  <p className="text-slate-400 text-xs mb-1">Experiência</p>
                  <p className="text-white font-medium">{selectedSkill.experience}/{selectedSkill.maxExperience} XP</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4">
                  <p className="text-slate-400 text-xs mb-1">Tipo</p>
                  <p className="text-white font-medium capitalize">
                    {selectedSkill.type === 'legendary' ? '🌟 Lendário' : 
                     selectedSkill.type === 'mastery' ? '👑 Maestria' :
                     selectedSkill.type === 'core' ? '⚡ Essencial' : '✨ Bônus'}
                  </p>
                </div>
              </div>

              {/* Progress Bar for in-progress skills */}
              {selectedSkill.state === 'in_progress' && (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-medium text-sm">Progresso</span>
                    <span className="text-slate-400 text-sm">
                      {Math.round((selectedSkill.experience / selectedSkill.maxExperience) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(selectedSkill.experience / selectedSkill.maxExperience) * 100}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>
              )}

              {/* Prerequisites */}
              {selectedSkill.prerequisites.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-white font-medium text-sm mb-2 flex items-center gap-2">
                    <Anchor className="w-4 h-4 text-slate-400" />
                    Pré-requisitos
                  </h4>
                  <div className="space-y-1">
                    {selectedSkill.prerequisites.map(prereqId => {
                      const prereqSkill = ARCHIPELAGOS_DATA
                        .flatMap(a => a.skills)
                        .find(s => s.id === prereqId)
                      return (
                        <div key={prereqId} className="text-slate-400 text-sm flex items-center gap-2">
                          <ChevronRight className="w-3 h-3" />
                          {prereqSkill?.title || prereqId}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Unlocks */}
              {selectedSkill.unlocks.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-white font-medium text-sm mb-2 flex items-center gap-2">
                    <Compass className="w-4 h-4 text-slate-400" />
                    Desbloqueios
                  </h4>
                  <div className="space-y-1">
                    {selectedSkill.unlocks.map(unlockId => {
                      const unlockSkill = ARCHIPELAGOS_DATA
                        .flatMap(a => a.skills)
                        .find(s => s.id === unlockId)
                      return (
                        <div key={unlockId} className="text-cyan-400 text-sm flex items-center gap-2">
                          <Star className="w-3 h-3" />
                          {unlockSkill?.title || unlockId}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
                <button
                  onClick={() => setSelectedSkill(null)}
                  className="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-white text-sm transition-colors"
                >
                  Fechar
                </button>
                {selectedSkill.state === 'available' && (
                  <button
                    className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-xl text-white text-sm transition-colors"
                  >
                    Iniciar Jornada
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="fixed bottom-6 right-6 z-30 flex flex-col gap-2">
        <button
          onClick={() => setViewportTransform(prev => ({ ...prev, scale: Math.min(2, prev.scale * 1.2) }))}
          className="p-3 bg-slate-800/80 backdrop-blur-sm border border-slate-600/50 rounded-xl text-white hover:bg-slate-700/80 transition-colors"
        >
          <span className="text-lg">+</span>
        </button>
        <button
          onClick={() => setViewportTransform(prev => ({ ...prev, scale: Math.max(0.3, prev.scale / 1.2) }))}
          className="p-3 bg-slate-800/80 backdrop-blur-sm border border-slate-600/50 rounded-xl text-white hover:bg-slate-700/80 transition-colors"
        >
          <span className="text-lg">−</span>
        </button>
        <button
          onClick={() => setViewportTransform({ x: 0, y: 0, scale: 1 })}
          className="p-3 bg-slate-800/80 backdrop-blur-sm border border-slate-600/50 rounded-xl text-white hover:bg-slate-700/80 transition-colors"
        >
          <Navigation className="w-4 h-4" />
        </button>
      </div>

      {/* Ocean Status Footer */}
      <div className="relative z-40 bg-slate-900/60 backdrop-blur-sm border-t border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Waves className="w-5 h-5 text-cyan-400" />
                <div>
                  <p className="text-white font-medium">Navigator: {userName}</p>
                  <p className="text-xs text-slate-400">Profundidade: {oceanDepth}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-white font-medium">
                    {ARCHIPELAGOS_DATA.flatMap(a => a.skills).filter(s => s.state === 'completed' || s.state === 'mastered').length}/
                    {ARCHIPELAGOS_DATA.flatMap(a => a.skills).length}
                  </p>
                  <p className="text-xs text-slate-400">Habilidades Dominadas</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-white font-medium">
                    {ARCHIPELAGOS_DATA.filter(a => a.lighthouse?.state === 'beacon').length}/
                    {ARCHIPELAGOS_DATA.filter(a => a.lighthouse).length}
                  </p>
                  <p className="text-xs text-slate-400">Faróis Ativos</p>
                </div>
              </div>
            </div>

            {/* Ocean Controls */}
            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-cyan-500/60 rounded-full shadow-cyan-500/50 shadow-md"></div>
                <span className="text-slate-300">Dominado</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-emerald-500/60 rounded-full shadow-emerald-500/50 shadow-md"></div>
                <span className="text-slate-300">Disponível</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-amber-500/60 rounded-full"></div>
                <span className="text-slate-300">Revelado</span>
              </div>
              <div className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-slate-500" />
                <span className="text-slate-300">Bloqueado</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}