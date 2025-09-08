"use client"

/**
 * 🎮 HONEYCOMB MODERN - Sistema Hexagonal AAA Simplificado
 * Implementação moderna com animações suaves e visual profissional
 */

import React, { useState, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Estados do hexágono
export type HexState = 
  | 'oculto'      
  | 'revelado'    
  | 'liberado'    
  | 'ativo'       
  | 'completo'    

export interface HexNode {
  id: string
  q: number // coordenada axial q
  r: number // coordenada axial r
  name: string
  description?: string
  state: HexState
  type: 'persona' | 'principal' | 'sub'
  videoUrl?: string
  connections: string[]
}

interface HoneycombModernProps {
  userName?: string
  onNodeClick?: (node: HexNode) => void
}

// Função para converter coordenadas axiais para pixel
const hexToPixel = (q: number, r: number, size: number = 60): { x: number, y: number } => {
  const x = size * (3/2 * q)
  const y = size * (Math.sqrt(3)/2 * q + Math.sqrt(3) * r)
  return { x, y }
}

// Componente Hexágono Individual
function HexagonNode({ 
  node, 
  size = 60,
  onHover,
  onClick 
}: { 
  node: HexNode
  size?: number
  onHover: (node: HexNode | null) => void
  onClick: (node: HexNode) => void
}) {
  const [isHovered, setIsHovered] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const { x, y } = hexToPixel(node.q, node.r, size)
  
  // Criar pontos do hexágono
  const points = useMemo(() => {
    const pts: string[] = []
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6
      const px = Math.cos(angle) * size
      const py = Math.sin(angle) * size
      pts.push(`${px},${py}`)
    }
    return pts.join(' ')
  }, [size])
  
  // Cores baseadas no estado
  const colors = {
    oculto: { fill: '#1a1a2e', stroke: '#2a2a4e', glow: '#2a2a4e' },
    revelado: { fill: '#2a2a4e', stroke: '#4a4a8e', glow: '#4a4a8e' },
    liberado: { fill: '#4a4a8e', stroke: '#6a6afe', glow: '#6a6afe' },
    ativo: { fill: '#6a6afe', stroke: '#FFD700', glow: '#FFD700' },
    completo: { fill: '#FFD700', stroke: '#FFA500', glow: '#FFA500' }
  }
  
  const color = colors[node.state]
  const isClickable = node.state === 'liberado' || node.state === 'ativo'
  
  useEffect(() => {
    if (node.type === 'principal' && node.videoUrl && videoRef.current) {
      videoRef.current.play()
    }
  }, [node.type, node.videoUrl])
  
  return (
    <motion.g
      transform={`translate(${x}, ${y})`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: isHovered ? 1.1 : 1,
        opacity: node.state === 'oculto' ? 0.3 : 1
      }}
      transition={{ 
        scale: { type: "spring", stiffness: 300, damping: 20 },
        opacity: { duration: 0.3 }
      }}
      onMouseEnter={() => {
        setIsHovered(true)
        onHover(node)
      }}
      onMouseLeave={() => {
        setIsHovered(false)
        onHover(null)
      }}
      onClick={() => isClickable && onClick(node)}
      style={{ cursor: isClickable ? 'pointer' : 'default' }}
    >
      {/* Glow effect */}
      {(node.state === 'ativo' || node.state === 'completo') && (
        <motion.polygon
          points={points}
          fill="none"
          stroke={color.glow}
          strokeWidth="3"
          opacity="0.5"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.2, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ filter: 'blur(4px)' }}
        />
      )}
      
      {/* Hexágono principal */}
      <polygon
        points={points}
        fill={color.fill}
        stroke={color.stroke}
        strokeWidth="2"
        opacity={node.state === 'oculto' ? 0.3 : 0.9}
      />
      
      {/* Pattern para vídeo (principals) */}
      {node.type === 'principal' && node.videoUrl && node.state !== 'oculto' && (
        <foreignObject 
          x={-size * 0.8} 
          y={-size * 0.8} 
          width={size * 1.6} 
          height={size * 1.6}
          style={{ pointerEvents: 'none' }}
        >
          <video
            ref={videoRef}
            src={node.videoUrl}
            autoPlay
            loop
            muted
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
              opacity: 0.6
            }}
          />
        </foreignObject>
      )}
      
      {/* Texto */}
      <text
        x="0"
        y="0"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="white"
        fontSize={node.type === 'persona' ? "16" : "14"}
        fontWeight={node.type === 'persona' ? "bold" : "normal"}
        style={{ pointerEvents: 'none' }}
      >
        {node.state === 'oculto' ? '?' : node.name}
      </text>
      
      {/* Ícone de tipo */}
      {node.type === 'principal' && node.state !== 'oculto' && (
        <text
          x="0"
          y="20"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize="12"
          opacity="0.7"
          style={{ pointerEvents: 'none' }}
        >
          📹
        </text>
      )}
    </motion.g>
  )
}

// Componente de Conexões
function Connections({ nodes, size = 60 }: { nodes: HexNode[], size?: number }) {
  const paths = useMemo(() => {
    const connections: Array<{ from: HexNode, to: HexNode }> = []
    
    nodes.forEach(node => {
      node.connections.forEach(targetId => {
        const target = nodes.find(n => n.id === targetId)
        if (target) {
          connections.push({ from: node, to: target })
        }
      })
    })
    
    return connections
  }, [nodes])
  
  return (
    <g className="connections">
      {paths.map((path, idx) => {
        const from = hexToPixel(path.from.q, path.from.r, size)
        const to = hexToPixel(path.to.q, path.to.r, size)
        
        const color = path.to.state === 'completo' ? '#FFD700' :
                     path.to.state === 'ativo' ? '#6a6afe' :
                     path.to.state === 'liberado' ? '#4a4a8e' :
                     '#2a2a4e'
        
        return (
          <motion.line
            key={idx}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke={color}
            strokeWidth="2"
            strokeDasharray={path.to.state === 'oculto' ? "5,5" : "0"}
            opacity={path.to.state === 'oculto' ? 0.2 : 0.5}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: idx * 0.1 }}
          />
        )
      })}
    </g>
  )
}

export function HoneycombModern({ 
  userName = "Captain",
  onNodeClick
}: HoneycombModernProps) {
  const [hoveredNode, setHoveredNode] = useState<HexNode | null>(null)
  const [selectedNode, setSelectedNode] = useState<HexNode | null>(null)
  
  // Estrutura de nós
  const nodes: HexNode[] = useMemo(() => [
    // Centro - Persona Única
    {
      id: 'persona-unica',
      q: 0, r: 0,
      name: 'Persona Única',
      state: 'ativo' as HexState,
      type: 'persona' as const,
      description: 'Descubra sua essência criativa única',
      connections: []
    },
    
    // Método ALMA
    {
      id: 'metodo-alma',
      q: 0, r: -2,
      name: 'Método ALMA',
      state: 'liberado' as HexState,
      type: 'principal' as const,
      videoUrl: '/videos/alma.webm',
      connections: ['persona-unica']
    },
    
    // Subs do ALMA
    {
      id: 'autenticidade',
      q: -1, r: -2,
      name: 'Autenticidade',
      state: 'revelado' as HexState,
      type: 'sub' as const,
      connections: ['metodo-alma']
    },
    {
      id: 'legado',
      q: 1, r: -3,
      name: 'Legado',
      state: 'revelado' as HexState,
      type: 'sub' as const,
      connections: ['metodo-alma']
    },
    {
      id: 'mapeamento',
      q: -1, r: -1,
      name: 'Mapeamento',
      state: 'oculto' as HexState,
      type: 'sub' as const,
      connections: ['metodo-alma']
    },
    {
      id: 'aplicacao',
      q: 1, r: -2,
      name: 'Aplicação',
      state: 'oculto' as HexState,
      type: 'sub' as const,
      connections: ['metodo-alma']
    },
    
    // DNA Criativo
    {
      id: 'dna-criativo',
      q: -2, r: -1,
      name: 'DNA Criativo',
      state: 'oculto' as HexState,
      type: 'principal' as const,
      videoUrl: '/videos/dna.webm',
      connections: ['autenticidade']
    },
    
    // Arquitetura de Negócio
    {
      id: 'arquitetura-negocio',
      q: 2, r: -3,
      name: 'Arquitetura',
      state: 'oculto' as HexState,
      type: 'principal' as const,
      videoUrl: '/videos/arquitetura.webm',
      connections: ['legado']
    },
    
    // Hexágonos adicionais
    {
      id: 'storytelling',
      q: 2, r: -1,
      name: 'Storytelling',
      state: 'oculto' as HexState,
      type: 'sub' as const,
      connections: ['dna-criativo']
    },
    {
      id: 'branding',
      q: -2, r: 1,
      name: 'Branding',
      state: 'oculto' as HexState,
      type: 'sub' as const,
      connections: ['dna-criativo']
    },
    {
      id: 'estrategia',
      q: 0, r: 2,
      name: 'Estratégia',
      state: 'oculto' as HexState,
      type: 'sub' as const,
      connections: ['arquitetura-negocio']
    }
  ], [])
  
  const handleNodeClick = (node: HexNode) => {
    setSelectedNode(node)
    onNodeClick?.(node)
  }
  
  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#0a0a0f] overflow-hidden">
      {/* Background particles */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => {
          // Usar seed baseado no index para consistência SSR/client
          const seedX = (i * 137.5) % 1920
          const seedY = ((i * 73.3) % 1080)
          const seedDuration = (i % 10) + 10
          const seedTargetX = ((i * 189.7) % 1920)
          const seedTargetY = ((i * 91.1) % 1080)
          
          return (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/10 rounded-full"
              initial={{ 
                x: seedX,
                y: seedY
              }}
              animate={{
                x: seedTargetX,
                y: seedTargetY
              }}
              transition={{
                duration: seedDuration,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "linear"
              }}
            />
          )
        })}
      </div>

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 p-6">
        <motion.div 
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              🎮 Honeycomb Modern System
            </h1>
            <p className="text-gray-400 text-sm mt-1">Sistema hexagonal de última geração</p>
          </div>
          
          <div className="text-right">
            <p className="text-gray-400 text-sm">Capitão</p>
            <p className="text-white font-bold">{userName}</p>
          </div>
        </motion.div>
      </div>

      {/* Main SVG Canvas */}
      <svg 
        className="absolute inset-0 w-full h-full"
        viewBox="-400 -300 800 600"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Definir filtros e gradientes */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="100%" stopColor="#FFA500" />
          </linearGradient>
        </defs>

        {/* Renderizar conexões */}
        <Connections nodes={nodes} />

        {/* Renderizar hexágonos */}
        <g className="hexagons">
          {nodes.map((node, idx) => (
            <HexagonNode
              key={node.id}
              node={node}
              onHover={setHoveredNode}
              onClick={handleNodeClick}
            />
          ))}
        </g>
      </svg>

      {/* Info Panel */}
      <AnimatePresence>
        {(hoveredNode || selectedNode) && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="absolute right-6 bottom-6 w-96 bg-black/90 backdrop-blur-xl rounded-xl p-6 border border-purple-500/30"
          >
            <h3 className="text-2xl font-bold text-white mb-2">
              {(hoveredNode || selectedNode)?.name}
            </h3>
            <p className="text-gray-400 mb-4">
              {(hoveredNode || selectedNode)?.description}
            </p>
            
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs text-gray-500">Estado:</span>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                (hoveredNode || selectedNode)?.state === 'completo' ? 'bg-yellow-500/20 text-yellow-400' :
                (hoveredNode || selectedNode)?.state === 'ativo' ? 'bg-blue-500/20 text-blue-400' :
                (hoveredNode || selectedNode)?.state === 'liberado' ? 'bg-purple-500/20 text-purple-400' :
                (hoveredNode || selectedNode)?.state === 'revelado' ? 'bg-gray-500/20 text-gray-400' :
                'bg-gray-700/20 text-gray-600'
              }`}>
                {(hoveredNode || selectedNode)?.state?.toUpperCase()}
              </span>
            </div>
            
            {(hoveredNode || selectedNode)?.state === 'liberado' && (
              <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105">
                INICIAR JORNADA
              </button>
            )}
            
            {(hoveredNode || selectedNode)?.state === 'ativo' && (
              <button className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-bold rounded-lg hover:from-yellow-600 hover:to-orange-700 transition-all animate-pulse transform hover:scale-105">
                COMPLETAR MISSÃO
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur rounded-lg p-4">
        <h4 className="text-xs font-bold text-white mb-2">LEGENDA</h4>
        <div className="space-y-1">
          {[
            { state: 'oculto', color: '#1a1a2e', label: 'Oculto' },
            { state: 'revelado', color: '#2a2a4e', label: 'Revelado' },
            { state: 'liberado', color: '#4a4a8e', label: 'Liberado' },
            { state: 'ativo', color: '#6a6afe', label: 'Ativo' },
            { state: 'completo', color: '#FFD700', label: 'Completo' }
          ].map(item => (
            <div key={item.state} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }}></div>
              <span className="text-xs text-gray-400">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}