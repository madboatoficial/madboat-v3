"use client"

/**
 * 🎮 HEXAGONAL SKILL TREE AAA - MADBOAT REVOLUTION v2.0
 * Sistema inspirado em jogos AAA com layout honeycomb perfeito
 * Baseado em referências de alta qualidade com vídeos e efeitos
 */

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useAnimation } from 'motion/react'
import { 
  Brain,
  Heart,
  Target,
  Sparkles,
  Crown,
  Gem,
  Zap,
  Eye,
  MapPin,
  TrendingUp,
  Building2,
  Palette,
  Star,
  Lock,
  X
} from 'lucide-react'

// Estados dos hexagramas AAA
export type HexagramState = 'oculto' | 'revelado' | 'liberado' | 'ativo' | 'completo'

// Interface para hexagrama
export interface Hexagram {
  id: string
  title: string
  subtitle?: string
  description: string
  icon?: React.ComponentType<any>
  videoUrl?: string // Para animações .webm
  state: HexagramState
  row: number
  col: number
  xp?: number
  dependencies?: string[]
  unlocks?: string[]
  isPrincipal?: boolean
}

interface HexagonalSkillTreeAAAProps {
  userName?: string
  onHexagramClick?: (hexagram: Hexagram) => void
  onClose?: () => void
}

// Configuração de estados visuais AAA
const stateConfig = {
  oculto: {
    fill: 'rgba(0, 0, 0, 0.8)',
    stroke: 'rgba(255, 255, 255, 0.05)',
    glow: false,
    opacity: 0.3,
    blur: 10
  },
  revelado: {
    fill: 'rgba(20, 20, 30, 0.9)',
    stroke: 'rgba(255, 255, 255, 0.2)',
    glow: false,
    opacity: 0.6,
    blur: 0
  },
  liberado: {
    fill: 'rgba(30, 60, 150, 0.4)',
    stroke: 'rgba(100, 150, 255, 0.8)',
    glow: true,
    glowColor: 'rgba(100, 150, 255, 0.4)',
    opacity: 0.9,
    blur: 0
  },
  ativo: {
    fill: 'rgba(255, 150, 0, 0.3)',
    stroke: 'rgba(255, 200, 50, 1)',
    glow: true,
    glowColor: 'rgba(255, 200, 50, 0.6)',
    opacity: 1,
    pulse: true,
    blur: 0
  },
  completo: {
    fill: 'rgba(255, 215, 0, 0.2)',
    stroke: 'rgba(255, 255, 100, 1)',
    glow: true,
    glowColor: 'rgba(255, 215, 0, 0.5)',
    opacity: 1,
    blur: 0
  }
}

// Dados dos hexagramas com layout honeycomb
const HEXAGRAMS_DATA: Hexagram[] = [
  // Linha 1 (topo)
  {
    id: 'metodo-alma',
    title: 'MÉTODO ALMA',
    subtitle: 'LEGENDARY',
    description: 'Transformação autêntica completa',
    icon: Heart,
    videoUrl: '/videos/alma-animation.webm', // Vamos adicionar depois
    state: 'liberado',
    row: 0,
    col: 1,
    xp: 1000,
    isPrincipal: true,
    dependencies: ['persona-unica']
  },
  
  // Linha 2
  {
    id: 'alma-autenticidade',
    title: 'Autenticidade',
    description: 'DNA Criativo',
    icon: Eye,
    state: 'revelado',
    row: 1,
    col: 0,
    dependencies: ['metodo-alma']
  },
  {
    id: 'persona-unica',
    title: 'PERSONA ÚNICA',
    subtitle: 'CORE',
    description: 'Identidade única no mercado',
    icon: Brain,
    videoUrl: '/videos/persona-animation.webm',
    state: 'ativo',
    row: 1,
    col: 1,
    xp: 500,
    isPrincipal: true,
    unlocks: ['metodo-alma']
  },
  {
    id: 'alma-legado',
    title: 'Legado',
    description: 'Construção pessoal',
    icon: Crown,
    state: 'revelado',
    row: 1,
    col: 2,
    dependencies: ['metodo-alma']
  },
  
  // Linha 3 (centro expandido)
  {
    id: 'dna-criativo',
    title: 'DNA CRIATIVO',
    subtitle: 'EPIC',
    description: 'Essência criativa única',
    icon: Sparkles,
    videoUrl: '/videos/dna-animation.webm',
    state: 'liberado',
    row: 2,
    col: 0,
    xp: 300,
    isPrincipal: true,
    dependencies: ['alma-autenticidade']
  },
  {
    id: 'alma-mapeamento',
    title: 'Mapeamento',
    description: 'Estratégia definida',
    icon: MapPin,
    state: 'revelado',
    row: 2,
    col: 1,
    dependencies: ['metodo-alma']
  },
  {
    id: 'arquitetura-negocio',
    title: 'ARQUITETURA',
    subtitle: 'RARE',
    description: 'Estrutura estratégica',
    icon: Building2,
    videoUrl: '/videos/arch-animation.webm',
    state: 'liberado',
    row: 2,
    col: 2,
    xp: 400,
    isPrincipal: true,
    dependencies: ['alma-legado']
  },
  
  // Linha 4
  {
    id: 'alma-aplicacao',
    title: 'Aplicação',
    description: 'Execução prática',
    icon: TrendingUp,
    state: 'revelado',
    row: 3,
    col: 1,
    dependencies: ['metodo-alma']
  }
]

// Componente do Hexágono Individual AAA
const HexagonNodeAAA: React.FC<{
  hexagram: Hexagram
  onClick: (hexagram: Hexagram) => void
  size: number
}> = ({ hexagram, onClick, size }) => {
  const [isHovered, setIsHovered] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const state = stateConfig[hexagram.state]
  
  // Calcular posição baseada em grid honeycomb
  const hexWidth = size * 2
  const hexHeight = size * Math.sqrt(3)
  const x = hexagram.col * hexWidth * 0.75 + hexWidth
  const y = hexagram.row * hexHeight + (hexagram.col % 2 === 1 ? hexHeight / 2 : 0) + hexHeight
  
  useEffect(() => {
    if (videoRef.current && hexagram.videoUrl) {
      videoRef.current.play().catch(() => {})
    }
  }, [hexagram.videoUrl])
  
  const handleClick = () => {
    if (hexagram.state !== 'oculto') {
      onClick(hexagram)
    }
  }
  
  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${size * 2}px`,
        height: `${size * Math.sqrt(3)}px`,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: state.opacity,
        filter: `blur(${state.blur || 0}px)`
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      transition={{ 
        duration: 0.5,
        delay: Math.random() * 0.3
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Background glow effect */}
      {state.glow && (
        <motion.div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle, ${'glowColor' in state ? state.glowColor : 'transparent'}, transparent)`,
            filter: 'blur(20px)',
            transform: 'scale(1.5)',
          }}
          animate={'pulse' in state && state.pulse ? {
            opacity: [0.4, 0.8, 0.4],
            scale: [1.3, 1.6, 1.3]
          } : {}}
          transition={{
            duration: 2,
            repeat: 'pulse' in state && state.pulse ? Infinity : 0,
            ease: "easeInOut"
          }}
        />
      )}
      
      {/* Hexagon SVG */}
      <svg 
        className="absolute inset-0 w-full h-full"
        viewBox={`0 0 ${size * 2} ${size * Math.sqrt(3)}`}
      >
        <defs>
          <linearGradient id={`gradient-${hexagram.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={state.stroke} stopOpacity="0.8" />
            <stop offset="100%" stopColor={state.stroke} stopOpacity="0.3" />
          </linearGradient>
          {state.glow && (
            <filter id={`glow-${hexagram.id}`}>
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          )}
        </defs>
        
        <polygon
          points={`${size},0 ${size * 1.5},${size * 0.866} ${size * 1.5},${size * 1.732} ${size},${size * 1.732 * 1.154} ${size * 0.5},${size * 1.732} ${size * 0.5},${size * 0.866}`}
          fill={state.fill}
          stroke={`url(#gradient-${hexagram.id})`}
          strokeWidth="2"
          filter={state.glow ? `url(#glow-${hexagram.id})` : ''}
        />
      </svg>
      
      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
        {/* Video for principal hexagrams */}
        {hexagram.isPrincipal && hexagram.videoUrl ? (
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-screen"
            src={hexagram.videoUrl}
            loop
            muted
            playsInline
          />
        ) : null}
        
        {/* Icon or Text */}
        {hexagram.icon && hexagram.isPrincipal ? (
          <hexagram.icon className="w-12 h-12 text-white/80 mb-2 relative z-10" />
        ) : null}
        
        {/* Title */}
        <div className="text-center relative z-10">
          <h3 className={`font-bold ${hexagram.isPrincipal ? 'text-sm' : 'text-xs'} text-white/90`}>
            {hexagram.title}
          </h3>
          {hexagram.subtitle && (
            <p className="text-xs text-yellow-400/80 mt-1">{hexagram.subtitle}</p>
          )}
          {hexagram.xp && (
            <p className="text-xs text-blue-400/80 mt-1">+{hexagram.xp} XP</p>
          )}
        </div>
        
        {/* Status indicator */}
        {hexagram.state === 'completo' && (
          <div className="absolute top-2 right-2 w-4 h-4 bg-green-500 rounded-full border border-white/50" />
        )}
        {hexagram.state === 'ativo' && (
          <motion.div
            className="absolute top-2 right-2 w-4 h-4 bg-yellow-500 rounded-full border border-white/50"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </div>
    </motion.div>
  )
}

// Componente de Conexões Luminosas
const ConnectionLines: React.FC<{
  hexagrams: Hexagram[]
  size: number
}> = ({ hexagrams, size }) => {
  const hexWidth = size * 2
  const hexHeight = size * Math.sqrt(3)
  
  const getHexPosition = (hex: Hexagram) => {
    const x = hex.col * hexWidth * 0.75 + hexWidth + size
    const y = hex.row * hexHeight + (hex.col % 2 === 1 ? hexHeight / 2 : 0) + hexHeight + (hexHeight / 2)
    return { x, y }
  }
  
  const connections: Array<{ from: Hexagram, to: Hexagram }> = []
  hexagrams.forEach(hexagram => {
    if (hexagram.dependencies) {
      hexagram.dependencies.forEach(depId => {
        const dependency = hexagrams.find(h => h.id === depId)
        if (dependency && dependency.state !== 'oculto' && hexagram.state !== 'oculto') {
          connections.push({ from: dependency, to: hexagram })
        }
      })
    }
  })
  
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none">
      <defs>
        <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#dc2626" stopOpacity="0.4" />
        </linearGradient>
        <filter id="glowConnection">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {connections.map(({ from, to }, index) => {
        const fromPos = getHexPosition(from)
        const toPos = getHexPosition(to)
        
        // Determinar cor baseada no estado
        let strokeColor = 'rgba(100, 100, 100, 0.3)'
        let strokeWidth = 1
        
        if (from.state === 'completo' || from.state === 'ativo') {
          strokeColor = 'url(#connectionGradient)'
          strokeWidth = 2
        }
        
        return (
          <motion.line
            key={`${from.id}-${to.id}`}
            x1={fromPos.x}
            y1={fromPos.y}
            x2={toPos.x}
            y2={toPos.y}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            opacity="0.8"
            filter="url(#glowConnection)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.8 }}
            transition={{ 
              duration: 1,
              delay: index * 0.1,
              ease: "easeInOut"
            }}
          />
        )
      })}
      
      {/* Animated particles along connections */}
      {connections.map(({ from, to }, index) => {
        if (from.state !== 'completo' && from.state !== 'ativo') return null
        
        const fromPos = getHexPosition(from)
        const toPos = getHexPosition(to)
        
        return (
          <motion.circle
            key={`particle-${from.id}-${to.id}`}
            r="3"
            fill="#fbbf24"
            filter="url(#glowConnection)"
            animate={{
              x: [fromPos.x, toPos.x],
              y: [fromPos.y, toPos.y],
              opacity: [0, 1, 1, 0]
            }}
            transition={{
              duration: 2,
              delay: index * 0.3,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        )
      })}
    </svg>
  )
}

// Componente Principal
export function HexagonalSkillTreeAAA({ userName = "Navigator", onHexagramClick, onClose }: HexagonalSkillTreeAAAProps) {
  const [selectedHexagram, setSelectedHexagram] = useState<Hexagram | null>(null)
  const [hexagrams, setHexagrams] = useState(HEXAGRAMS_DATA)
  const hexSize = 80
  
  const handleHexagramClick = (hexagram: Hexagram) => {
    if (hexagram.state === 'ativo') {
      // Completar hexagrama e desbloquear próximos
      const updatedHexagrams = hexagrams.map(h => {
        if (h.id === hexagram.id) {
          return { ...h, state: 'completo' as HexagramState }
        }
        if (hexagram.unlocks?.includes(h.id)) {
          return { ...h, state: 'ativo' as HexagramState }
        }
        return h
      })
      setHexagrams(updatedHexagrams)
    } else if (hexagram.state === 'liberado') {
      // Ativar hexagrama
      const updatedHexagrams = hexagrams.map(h => 
        h.id === hexagram.id ? { ...h, state: 'ativo' as HexagramState } : h
      )
      setHexagrams(updatedHexagrams)
    }
    
    setSelectedHexagram(hexagram)
    onHexagramClick?.(hexagram)
  }
  
  return (
    <div className="h-screen bg-black text-white flex flex-col relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950/20 via-black to-blue-950/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.9)_100%)]" />
        
        {/* Animated particles background */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              initial={{ 
                x: Math.random() * 1920, 
                y: Math.random() * 1080 
              }}
              animate={{
                x: Math.random() * 1920,
                y: Math.random() * 1080
              }}
              transition={{
                duration: Math.random() * 20 + 10,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Header */}
      <div className="relative z-40 bg-black/60 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-600 bg-clip-text text-transparent">
                HEXAGONAL SKILL TREE
              </h1>
              <p className="text-zinc-400 text-sm">Sistema AAA de Evolução</p>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="p-3 text-zinc-400 hover:text-white transition-colors rounded-xl hover:bg-white/10"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Main Skill Tree Container */}
      <div className="flex-1 relative">
        <div className="absolute inset-0 overflow-auto">
          <div className="relative min-w-[1400px] min-h-[900px]">
            {/* Connections */}
            <ConnectionLines hexagrams={hexagrams} size={hexSize} />
            
            {/* Hexagrams */}
            {hexagrams.map(hexagram => (
              <HexagonNodeAAA
                key={hexagram.id}
                hexagram={hexagram}
                onClick={handleHexagramClick}
                size={hexSize}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Footer Stats */}
      <div className="relative z-40 bg-black/60 backdrop-blur-md border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-medium">
                  {hexagrams.filter(h => h.state === 'completo').length}/{hexagrams.length}
                </span>
                <span className="text-xs text-zinc-400">Completos</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-400" />
                <span className="text-white font-medium">
                  {hexagrams.reduce((acc, h) => acc + (h.xp || 0), 0)} XP
                </span>
              </div>
            </div>
            <div className="text-zinc-400 text-sm">
              {userName} - Level 15
            </div>
          </div>
        </div>
      </div>
      
      {/* Detail Modal */}
      <AnimatePresence>
        {selectedHexagram && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setSelectedHexagram(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-zinc-900 to-black border border-white/20 rounded-2xl p-8 max-w-md w-full"
            >
              <div className="flex items-start gap-4 mb-6">
                {selectedHexagram.icon && (
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 border border-white/20 flex items-center justify-center">
                    <selectedHexagram.icon className="w-8 h-8 text-white" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-white font-bold text-xl">{selectedHexagram.title}</h3>
                  {selectedHexagram.subtitle && (
                    <p className="text-yellow-400 text-sm">{selectedHexagram.subtitle}</p>
                  )}
                  <p className="text-zinc-400 text-sm mt-2">{selectedHexagram.description}</p>
                </div>
              </div>
              
              <button
                onClick={() => setSelectedHexagram(null)}
                className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl text-white text-sm font-medium transition-all"
              >
                Fechar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}