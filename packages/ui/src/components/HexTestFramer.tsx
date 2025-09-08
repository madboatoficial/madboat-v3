"use client"

/**
 * 🎮 HEXAGON TEST - Framer Motion Version
 * Estilo minimalista black & white, line-art como a página de login
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'

interface HexTestFramerProps {
  userName?: string
}

// Componente Hexágono com Framer Motion
function FramerHexagon({ 
  x, 
  y, 
  size = 60, 
  isActive = false,
  onClick 
}: { 
  x: number
  y: number
  size?: number
  isActive?: boolean
  onClick?: () => void
}) {
  const [isHovered, setIsHovered] = useState(false)
  
  // Calcular pontos do hexágono
  const points = React.useMemo(() => {
    const pts: string[] = []
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6
      const px = Math.cos(angle) * size + x
      const py = Math.sin(angle) * size + y
      pts.push(`${px},${py}`)
    }
    return pts.join(' ')
  }, [x, y, size])
  
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: 1, 
        scale: isHovered ? 1.1 : 1,
        rotate: isActive ? [0, 360] : 0
      }}
      transition={{ 
        duration: 0.6, 
        rotate: { duration: 2, repeat: isActive ? Infinity : 0, ease: "linear" }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      {/* Glow effect quando ativo */}
      {isActive && (
        <motion.polygon
          points={points}
          fill="none"
          stroke="white"
          strokeWidth="3"
          opacity="0.3"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.1, 0.3]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
      
      {/* Hexágono principal */}
      <polygon
        points={points}
        fill="none"
        stroke="white"
        strokeWidth={isActive ? "2" : "1"}
        opacity={isActive ? "1" : "0.7"}
      />
      
      {/* Ponto central */}
      <circle
        cx={x}
        cy={y}
        r={isActive ? 4 : 2}
        fill="white"
        opacity={isActive ? "1" : "0.5"}
      />
    </motion.g>
  )
}

export function HexTestFramer({ userName = "Captain" }: HexTestFramerProps) {
  const [activeHex, setActiveHex] = useState<number | null>(0)
  
  return (
    <div className="w-full h-screen bg-black flex flex-col items-center justify-center">
      {/* Header minimalista */}
      <div className="absolute top-8 text-center">
        <h1 className="text-2xl font-light text-white/90 tracking-wide">
          HEXAGON TEST
        </h1>
        <p className="text-sm text-white/50 mt-2 font-light">
          Framer Motion • {userName}
        </p>
      </div>
      
      {/* SVG Canvas */}
      <svg 
        className="w-full h-full max-w-4xl"
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Hexágono central */}
        <FramerHexagon
          x={400}
          y={300}
          size={80}
          isActive={activeHex === 0}
          onClick={() => setActiveHex(0)}
        />
        
        {/* Honeycomb ao redor - primeira camada */}
        {[...Array(6)].map((_, i) => {
          const angle = (Math.PI / 3) * i
          const x = 400 + Math.cos(angle) * 140
          const y = 300 + Math.sin(angle) * 140
          
          return (
            <FramerHexagon
              key={`ring1-${i}`}
              x={x}
              y={y}
              size={60}
              isActive={activeHex === i + 1}
              onClick={() => setActiveHex(i + 1)}
            />
          )
        })}
        
        {/* Conexões minimalistas */}
        {activeHex !== null && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 0.5 }}
          >
            {[...Array(6)].map((_, i) => {
              const angle = (Math.PI / 3) * i
              const x = 400 + Math.cos(angle) * 140
              const y = 300 + Math.sin(angle) * 140
              
              return (
                <line
                  key={`connection-${i}`}
                  x1={400}
                  y1={300}
                  x2={x}
                  y2={y}
                  stroke="white"
                  strokeWidth="1"
                  opacity="0.2"
                  strokeDasharray="5,5"
                />
              )
            })}
          </motion.g>
        )}
      </svg>
      
      {/* Info panel minimalista */}
      <div className="absolute bottom-8 text-center">
        <p className="text-white/70 text-sm font-light">
          {activeHex !== null ? `HEXAGON ${activeHex} SELECTED` : 'SELECT A HEXAGON'}
        </p>
        <div className="flex justify-center mt-4 space-x-2">
          {[0, 1, 2, 3, 4, 5, 6].map(i => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                activeHex === i ? 'bg-white' : 'bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}