"use client"

/**
 * 🎮 HONEYCOMB FIXED - Versão corrigida sem travamentos
 */

import React, { useState, useMemo } from 'react'

export type HexState = 
  | 'oculto'      
  | 'revelado'    
  | 'liberado'    
  | 'ativo'       
  | 'completo'    

export interface HexNode {
  id: string
  q: number
  r: number
  name: string
  description?: string
  state: HexState
  type: 'persona' | 'principal' | 'sub'
  connections: string[]
}

interface HoneycombFixedProps {
  userName?: string
  onNodeClick?: (node: HexNode) => void
}

// Função para converter coordenadas axiais para pixel
const hexToPixel = (q: number, r: number, size: number = 60): { x: number, y: number } => {
  const x = size * (3/2 * q)
  const y = size * (Math.sqrt(3)/2 * q + Math.sqrt(3) * r)
  return { x, y }
}

// Componente Hexágono Simples (sem Framer Motion)
function SimpleHexagon({ 
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
    oculto: { fill: '#1a1a2e', stroke: '#2a2a4e' },
    revelado: { fill: '#2a2a4e', stroke: '#4a4a8e' },
    liberado: { fill: '#4a4a8e', stroke: '#6a6afe' },
    ativo: { fill: '#6a6afe', stroke: '#FFD700' },
    completo: { fill: '#FFD700', stroke: '#FFA500' }
  }
  
  const color = colors[node.state]
  const isClickable = node.state === 'liberado' || node.state === 'ativo'
  
  return (
    <g
      transform={`translate(${x}, ${y})`}
      onMouseEnter={() => onHover(node)}
      onMouseLeave={() => onHover(null)}
      onClick={() => isClickable && onClick(node)}
      style={{ cursor: isClickable ? 'pointer' : 'default' }}
      className="transition-transform duration-200 hover:scale-110"
    >
      {/* Hexágono principal */}
      <polygon
        points={points}
        fill={color.fill}
        stroke={color.stroke}
        strokeWidth="2"
        opacity={node.state === 'oculto' ? 0.3 : 0.9}
      />
      
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
    </g>
  )
}

export function HoneycombFixed({ 
  userName = "Captain",
  onNodeClick
}: HoneycombFixedProps) {
  const [hoveredNode, setHoveredNode] = useState<HexNode | null>(null)
  const [selectedNode, setSelectedNode] = useState<HexNode | null>(null)
  
  // Estrutura de nós simplificada
  const nodes: HexNode[] = [
    {
      id: 'persona-unica',
      q: 0, r: 0,
      name: 'Persona Única',
      state: 'ativo' as HexState,
      type: 'persona' as const,
      description: 'Descubra sua essência criativa única',
      connections: []
    },
    {
      id: 'metodo-alma',
      q: 0, r: -2,
      name: 'Método ALMA',
      state: 'liberado' as HexState,
      type: 'principal' as const,
      connections: ['persona-unica']
    },
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
      id: 'dna-criativo',
      q: -2, r: -1,
      name: 'DNA Criativo',
      state: 'oculto' as HexState,
      type: 'principal' as const,
      connections: ['autenticidade']
    }
  ]
  
  const handleNodeClick = (node: HexNode) => {
    setSelectedNode(node)
    onNodeClick?.(node)
  }
  
  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#0a0a0f] overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              🎮 Honeycomb Fixed System
            </h1>
            <p className="text-gray-400 text-sm mt-1">Sistema hexagonal simplificado e funcional</p>
          </div>
          
          <div className="text-right">
            <p className="text-gray-400 text-sm">Capitão</p>
            <p className="text-white font-bold">{userName}</p>
          </div>
        </div>
      </div>

      {/* Main SVG Canvas */}
      <svg 
        className="absolute inset-0 w-full h-full"
        viewBox="-400 -300 800 600"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Renderizar hexágonos */}
        <g className="hexagons">
          {nodes.map((node) => (
            <SimpleHexagon
              key={node.id}
              node={node}
              onHover={setHoveredNode}
              onClick={handleNodeClick}
            />
          ))}
        </g>
      </svg>

      {/* Info Panel */}
      {(hoveredNode || selectedNode) && (
        <div className="absolute right-6 bottom-6 w-96 bg-black/90 backdrop-blur-xl rounded-xl p-6 border border-purple-500/30">
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
            <button className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-bold rounded-lg hover:from-yellow-600 hover:to-orange-700 transition-all">
              COMPLETAR MISSÃO
            </button>
          )}
        </div>
      )}

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