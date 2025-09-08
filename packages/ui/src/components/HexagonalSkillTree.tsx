"use client"

/**
 * 🎯 HEXAGONAL SKILL TREE AAA - MADBOAT REVOLUTION
 * Sistema de hexagramas inspirado em jogos AAA com Framer Motion
 * Layout honeycomb com estados visuais e conexões douradas
 */

import React, { useState, useEffect } from 'react'
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
  Users,
  Star,
  CheckCircle,
  Lock,
  X,
  Ship
} from 'lucide-react'

// Estados dos hexagramas
export type HexagramState = 'oculto' | 'revelado' | 'liberado' | 'ativo' | 'completo'

// Tipos de hexagramas
export type HexagramType = 'principal' | 'sub' | 'liberado'

// Coordenadas hexagonais (usando sistema axial)
export interface HexCoordinate {
  q: number // eixo q (horizontal)
  r: number // eixo r (diagonal)
}

// Definição de hexagrama
export interface Hexagram {
  id: string
  title: string
  description: string
  icon: React.ComponentType<any>
  state: HexagramState
  type: HexagramType
  coordinate: HexCoordinate
  xp?: number
  dependencies?: string[]
  unlocks?: string[]
  color?: string
}

interface HexagonalSkillTreeProps {
  userName?: string
  onHexagramClick?: (hexagram: Hexagram) => void
  onClose?: () => void
}

// Configuração de estados visuais
const stateConfig = {
  oculto: {
    fill: 'transparent',
    stroke: 'transparent',
    opacity: 0,
    scale: 0,
    glow: false,
    glowColor: 'transparent',
    pulse: false,
    golden: false,
    textColor: 'transparent'
  },
  revelado: {
    fill: '#374151',
    stroke: '#6b7280',
    opacity: 1,    // Aumentado de 0.6
    scale: 1,      // Aumentado de 0.9
    glow: false,
    glowColor: '#374151',
    pulse: false,
    golden: false,
    textColor: '#9ca3af'
  },
  liberado: {
    fill: '#1e40af',
    stroke: '#3b82f6',
    opacity: 1,    // Aumentado de 0.8
    scale: 1,      // Aumentado de 0.95
    glow: true,
    glowColor: '#3b82f6',
    pulse: false,
    golden: false,
    textColor: '#93c5fd'
  },
  ativo: {
    fill: '#f59e0b',
    stroke: '#fbbf24',
    opacity: 1,
    scale: 1.2,    // Aumentado para destacar
    glow: true,
    glowColor: '#fbbf24',
    pulse: true,
    golden: false,
    textColor: '#fef3c7'
  },
  completo: {
    fill: '#eab308',
    stroke: '#fde047',
    opacity: 1,
    scale: 1,
    glow: true,
    glowColor: '#fde047',
    pulse: false,
    golden: true,
    textColor: '#fefce8'
  }
}

// Configuração de tipos (tamanhos) - Aumentados para melhor visibilidade
const typeConfig = {
  principal: {
    size: 50,     // Reduzido para caber melhor
    strokeWidth: 4,
    fontSize: 'text-sm',
    iconSize: 'w-8 h-8'
  },
  sub: {
    size: 40,     // Reduzido proporcionalmente
    strokeWidth: 3,
    fontSize: 'text-xs',
    iconSize: 'w-6 h-6'
  },
  liberado: {
    size: 45,     // Reduzido proporcionalmente
    strokeWidth: 3.5,
    fontSize: 'text-sm',
    iconSize: 'w-7 h-7'
  }
}

// Dados dos hexagramas com posições calculadas
const HEXAGRAMS_DATA: Hexagram[] = [
  // Hexagrama central - Persona Única
  {
    id: 'persona-unica',
    title: 'Persona Única',
    description: 'Identidade única no mercado digital',
    icon: Brain,
    state: 'ativo',
    type: 'principal',
    coordinate: { q: 0, r: 0 }, // Centro
    xp: 500,
    unlocks: ['metodo-alma']
  },
  
  // Método ALMA - Principal (posição superior)
  {
    id: 'metodo-alma',
    title: 'Método ALMA',
    description: 'Transformação autêntica completa',
    icon: Heart,
    state: 'liberado',
    type: 'principal',
    coordinate: { q: 0, r: -2 },
    xp: 1000,
    dependencies: ['persona-unica']
  },
  
  // 4 Subs do ALMA (em volta do ALMA)
  {
    id: 'alma-autenticidade',
    title: 'Autenticidade',
    description: 'Descoberta do DNA Criativo',
    icon: Eye,
    state: 'revelado',
    type: 'sub',
    coordinate: { q: -1, r: -1 },
    dependencies: ['metodo-alma'],
    unlocks: ['dna-criativo']
  },
  
  {
    id: 'alma-legado',
    title: 'Legado',
    description: 'Construção do legado pessoal',
    icon: Crown,
    state: 'revelado',
    type: 'sub',
    coordinate: { q: 1, r: -2 },
    dependencies: ['metodo-alma'],
    unlocks: ['arquitetura-negocio']
  },
  
  {
    id: 'alma-mapeamento',
    title: 'Mapeamento',
    description: 'Estratégia de transformação',
    icon: MapPin,
    state: 'revelado',
    type: 'sub',
    coordinate: { q: 1, r: -1 },
    dependencies: ['metodo-alma']
  },
  
  {
    id: 'alma-aplicacao',
    title: 'Aplicação',
    description: 'Execução da estratégia',
    icon: TrendingUp,
    state: 'revelado',
    type: 'sub',
    coordinate: { q: -1, r: -2 },
    dependencies: ['metodo-alma']
  },
  
  // Hexagramas liberados pelas fases
  {
    id: 'dna-criativo',
    title: 'DNA Criativo',
    description: 'Sua essência criativa única',
    icon: Sparkles,
    state: 'liberado',
    type: 'liberado',
    coordinate: { q: -2, r: 0 },
    xp: 300,
    dependencies: ['alma-autenticidade']
  },
  
  {
    id: 'arquitetura-negocio',
    title: 'Arquitetura Negócio',
    description: 'Estrutura estratégica do negócio',
    icon: Building2,
    state: 'liberado',
    type: 'liberado',
    coordinate: { q: 2, r: -2 },
    xp: 400,
    dependencies: ['alma-legado']
  }
]

// Função para converter coordenadas axiais em coordenadas cartesianas
const hexToPixel = (hex: HexCoordinate, size: number = 80): { x: number, y: number } => {
  // Coordenadas hexagonais para cartesianas
  const x = size * (3/2 * hex.q)  // Offset horizontal
  const y = size * (Math.sqrt(3)/2 * hex.q + Math.sqrt(3) * hex.r)  // Offset vertical
  return { x, y }
}

// Componente individual do hexágono
const HexagonNode: React.FC<{
  hexagram: Hexagram
  onClick: (hexagram: Hexagram) => void
  centerX: number
  centerY: number
}> = ({ hexagram, onClick, centerX, centerY }) => {
  const [isHovered, setIsHovered] = useState(false)
  const state = stateConfig[hexagram.state]
  const typeConf = typeConfig[hexagram.type]
  const controls = useAnimation()
  
  // Posição calculada com espaçamento menor
  const position = hexToPixel(hexagram.coordinate, 80)  // Reduzido de 120 para 80
  const x = centerX + position.x
  const y = centerY + position.y
  
  // Gerar pontos do hexágono
  const generateHexagonPoints = (size: number): string => {
    const points: string[] = []
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 180) * (60 * i + 30)
      const px = size * Math.cos(angle)
      const py = size * Math.sin(angle)
      points.push(`${px},${py}`)
    }
    return points.join(' ')
  }
  
  // Animações de pulso para estado ativo
  useEffect(() => {
    if (hexagram.state === 'ativo') {
      controls.start({
        scale: [1, 1.05, 1],
        transition: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }
      })
    }
  }, [hexagram.state, controls])
  
  const handleClick = () => {
    if (hexagram.state === 'oculto') {
      return
    }
    onClick(hexagram)
  }
  
  if (hexagram.state === 'oculto') {
    console.log(`🚫 Hexagram ${hexagram.id} is hidden`)
    return null
  }
  
  const Icon = hexagram.icon
  console.log(`🎯 Rendering hexagram ${hexagram.id} at position (${x}, ${y}) with state: ${hexagram.state}`)
  
  return (
    <motion.g
      initial={{ scale: state.scale * 0.5, opacity: state.opacity * 0.5 }}
      animate={{ 
        scale: state.scale,
        opacity: state.opacity,
        ...controls
      }}
      transition={{ 
        type: "spring",
        stiffness: 300,
        damping: 30,
        delay: Math.random() * 0.2
      }}
      whileHover={{ scale: state.scale * 1.1 }}
      whileTap={{ scale: state.scale * 0.95 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
      transform={`translate(${x}, ${y})`}
    >
      {/* Glow Effect */}
      {state.glow && (
        <motion.polygon
          points={generateHexagonPoints(typeConf.size + 15)}
          fill={state.glowColor}
          opacity={0.3}
          animate={{
            opacity: hexagram.state === 'ativo' ? [0.3, 0.6, 0.3] : 0.3
          }}
          transition={{
            duration: 2,
            repeat: hexagram.state === 'ativo' ? Infinity : 0,
            ease: "easeInOut"
          }}
          filter="blur(10px)"
        />
      )}
      
      {/* Hexágono principal */}
      <motion.polygon
        points={generateHexagonPoints(typeConf.size)}
        fill={state.fill}
        stroke={state.stroke}
        strokeWidth={typeConf.strokeWidth}
        animate={{
          fill: isHovered 
            ? hexagram.state === 'completo' ? '#facc15' : '#60a5fa'
            : state.fill
        }}
        transition={{ duration: 0.2 }}
      />
      
      {/* Borda dourada para completos */}
      {hexagram.state === 'completo' && (
        <motion.polygon
          points={generateHexagonPoints(typeConf.size + 5)}
          fill="none"
          stroke="#fde047"
          strokeWidth="2"
          opacity="0.8"
          animate={{
            strokeDasharray: ["0 1000", "1000 0"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      )}
      
      {/* Ícone */}
      <foreignObject
        x={-typeConf.size/3}
        y={-typeConf.size/3}
        width={typeConf.size * 2/3}
        height={typeConf.size * 2/3}
      >
        <div className="flex items-center justify-center h-full">
          <Icon 
            className={`${typeConf.iconSize}`}
            style={{ color: state.textColor }}
          />
        </div>
      </foreignObject>
      
      {/* Status Indicator */}
      {hexagram.state === 'completo' && (
        <motion.circle
          cx={typeConf.size * 0.6}
          cy={-typeConf.size * 0.6}
          r="12"
          fill="#16a34a"
          stroke="#ffffff"
          strokeWidth="2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
        />
      )}
      
      {hexagram.state === 'completo' && (
        <foreignObject
          x={typeConf.size * 0.6 - 8}
          y={-typeConf.size * 0.6 - 8}
          width="16"
          height="16"
        >
          <CheckCircle className="w-4 h-4 text-white" />
        </foreignObject>
      )}
      
      {hexagram.state === 'revelado' && hexagram.dependencies && (
        <motion.circle
          cx={typeConf.size * 0.6}
          cy={-typeConf.size * 0.6}
          r="10"
          fill="#6b7280"
          stroke="#ffffff"
          strokeWidth="2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 }}
        />
      )}
      
      {hexagram.state === 'revelado' && hexagram.dependencies && (
        <foreignObject
          x={typeConf.size * 0.6 - 6}
          y={-typeConf.size * 0.6 - 6}
          width="12"
          height="12"
        >
          <Lock className="w-3 h-3 text-white" />
        </foreignObject>
      )}
      
      {/* Título */}
      <motion.text
        x="0"
        y={typeConf.size + 25}
        textAnchor="middle"
        fill={state.textColor}
        fontSize="14"
        fontWeight="600"
        animate={{
          opacity: isHovered ? 1 : 0.8
        }}
      >
        {hexagram.title}
      </motion.text>
      
      {/* XP Badge */}
      {hexagram.xp && (
        <motion.g transform="translate(0, 110)">
          <motion.rect
            x="-25"
            y="-10"
            width="50"
            height="20"
            rx="10"
            fill="#1f2937"
            stroke="#fbbf24"
            strokeWidth="1"
            opacity="0.9"
          />
          <motion.text
            x="0"
            y="4"
            textAnchor="middle"
            fill="#fbbf24"
            fontSize="12"
            fontWeight="500"
          >
            +{hexagram.xp} XP
          </motion.text>
        </motion.g>
      )}
    </motion.g>
  )
}

// Componente das conexões douradas
const ConnectionLines: React.FC<{
  hexagrams: Hexagram[]
  centerX: number
  centerY: number
}> = ({ hexagrams, centerX, centerY }) => {
  const connections: Array<{ from: Hexagram, to: Hexagram }> = []
  
  // Gerar conexões baseadas nas dependências
  hexagrams.forEach(hexagram => {
    if (hexagram.dependencies) {
      hexagram.dependencies.forEach(depId => {
        const dependency = hexagrams.find(h => h.id === depId)
        if (dependency) {
          connections.push({ from: dependency, to: hexagram })
        }
      })
    }
  })
  
  return (
    <g>
      {connections.map(({ from, to }, index) => {
        const fromPos = hexToPixel(from.coordinate, 80)  // Mesma escala
        const toPos = hexToPixel(to.coordinate, 80)
        
        const x1 = centerX + fromPos.x
        const y1 = centerY + fromPos.y
        const x2 = centerX + toPos.x
        const y2 = centerY + toPos.y
        
        // Mostrar conexão apenas se ambos não estão ocultos
        if (from.state === 'oculto' || to.state === 'oculto') {
          return null
        }
        
        // Cor da linha baseada no estado
        let strokeColor = '#6b7280'
        let opacity = 0.3
        
        if (from.state === 'completo') {
          strokeColor = '#fbbf24'
          opacity = 0.8
        } else if (from.state === 'ativo') {
          strokeColor = '#f59e0b'
          opacity = 0.6
        }
        
        return (
          <motion.line
            key={`${from.id}-${to.id}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={strokeColor}
            strokeWidth="2"
            opacity={opacity}
            strokeDasharray="5,5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ 
              duration: 1,
              delay: index * 0.2,
              ease: "easeInOut"
            }}
          />
        )
      })}
    </g>
  )
}

// Componente principal
export function HexagonalSkillTree({ userName = "Navigator", onHexagramClick, onClose }: HexagonalSkillTreeProps) {
  const [selectedHexagram, setSelectedHexagram] = useState<Hexagram | null>(null)
  const [hexagrams, setHexagrams] = useState(HEXAGRAMS_DATA)
  
  const centerX = 600  // Centro horizontal do viewBox 1200
  const centerY = 450  // Movido mais para baixo para acomodar hexágonos superiores
  
  // Debug log
  console.log('🎯 HexagonalSkillTree rendering with hexagrams:', hexagrams.length)
  console.log('Hexagrams data:', hexagrams.map(h => ({ id: h.id, state: h.state, coordinate: h.coordinate })))
  
  const handleHexagramClick = (hexagram: Hexagram) => {
    if (hexagram.state === 'ativo') {
      // Hexagrama ativo - completar e desbloquear próximos
      const updatedHexagrams = hexagrams.map(h => {
        if (h.id === hexagram.id) {
          return { ...h, state: 'completo' as HexagramState }
        }
        // Desbloquear hexagramas que dependem deste
        if (hexagram.unlocks && hexagram.unlocks.includes(h.id)) {
          return { ...h, state: 'liberado' as HexagramState }
        }
        return h
      })
      setHexagrams(updatedHexagrams)
    } else if (hexagram.state === 'liberado') {
      // Tornar ativo
      const updatedHexagrams = hexagrams.map(h => 
        h.id === hexagram.id ? { ...h, state: 'ativo' as HexagramState } : h
      )
      setHexagrams(updatedHexagrams)
    }
    
    setSelectedHexagram(hexagram)
    onHexagramClick?.(hexagram)
  }
  
  return (
    <div className="h-screen bg-zinc-950 text-white flex flex-col relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1500px] h-[1500px] bg-gradient-radial from-blue-950/20 via-transparent to-transparent rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
      </div>
      
      {/* Header */}
      <div className="relative z-40 bg-zinc-900/60 backdrop-blur-sm border-b border-zinc-700/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Ship className="w-8 h-8 text-blue-400" />
              <div>
                <h1 className="text-2xl font-bold">🎯 Hexagonal Skill Tree</h1>
                <p className="text-zinc-400 text-sm">Sistema de evolução AAA</p>
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
      
      {/* SVG Skill Tree */}
      <div className="flex-1 relative bg-red-500/10">
        <svg 
          className="absolute inset-0 w-full h-full border border-green-500/20"
          viewBox="0 0 1200 900"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Debug Center Point */}
          <circle
            cx={centerX}
            cy={centerY}
            r="10"
            fill="red"
            opacity="0.5"
          />
          <text x={centerX + 15} y={centerY + 5} fill="red" fontSize="12">
            Center ({centerX}, {centerY})
          </text>
          
          {/* Conexões */}
          <ConnectionLines 
            hexagrams={hexagrams}
            centerX={centerX}
            centerY={centerY}
          />
          
          {/* Hexagramas */}
          {hexagrams.map(hexagram => (
            <HexagonNode
              key={hexagram.id}
              hexagram={hexagram}
              onClick={handleHexagramClick}
              centerX={centerX}
              centerY={centerY}
            />
          ))}
        </svg>
      </div>
      
      {/* Hexagram Detail Modal */}
      <AnimatePresence>
        {selectedHexagram && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setSelectedHexagram(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-zinc-900 border border-zinc-700 rounded-2xl p-8 max-w-md w-full"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 border-2 border-blue-400 flex items-center justify-center`}>
                  <selectedHexagram.icon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-xl">{selectedHexagram.title}</h3>
                  <p className="text-zinc-400 text-sm mt-1">{selectedHexagram.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-xs text-yellow-400">{selectedHexagram.type} Hexagram</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-zinc-700">
                <div className="flex items-center gap-4">
                  {selectedHexagram.xp && (
                    <span className="text-blue-400 text-sm font-medium">
                      +{selectedHexagram.xp} XP
                    </span>
                  )}
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    selectedHexagram.state === 'ativo' ? 'bg-yellow-500/20 text-yellow-400' :
                    selectedHexagram.state === 'completo' ? 'bg-green-500/20 text-green-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {selectedHexagram.state.charAt(0).toUpperCase() + selectedHexagram.state.slice(1)}
                  </span>
                </div>
                
                <button
                  onClick={() => setSelectedHexagram(null)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-white text-sm transition-colors"
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}