"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function HoneycombPage() {
  const [activeHex, setActiveHex] = useState(0)
  const [isExploding, setIsExploding] = useState(false)
  const [layoutMode, setLayoutMode] = useState<'line' | 'circle' | 'random'>('line')
  
  // Posições dinâmicas baseadas no layout
  const getPositions = () => {
    switch (layoutMode) {
      case 'circle':
        return [
          { x: 410, y: 300, id: 0 }, // Centro
          { x: 410 + Math.cos(0) * 120, y: 300 + Math.sin(0) * 120, id: 1 },
          { x: 410 + Math.cos(Math.PI/2) * 120, y: 300 + Math.sin(Math.PI/2) * 120, id: 2 },
          { x: 410 + Math.cos(Math.PI) * 120, y: 300 + Math.sin(Math.PI) * 120, id: 3 },
          { x: 410 + Math.cos(3*Math.PI/2) * 120, y: 300 + Math.sin(3*Math.PI/2) * 120, id: 4 }
        ]
      case 'random':
        return [
          { x: Math.random() * 600 + 100, y: Math.random() * 400 + 150, id: 0 },
          { x: Math.random() * 600 + 100, y: Math.random() * 400 + 150, id: 1 },
          { x: Math.random() * 600 + 100, y: Math.random() * 400 + 150, id: 2 },
          { x: Math.random() * 600 + 100, y: Math.random() * 400 + 150, id: 3 },
          { x: Math.random() * 600 + 100, y: Math.random() * 400 + 150, id: 4 }
        ]
      default: // line
        return [
          { x: 150, y: 300, id: 0 },
          { x: 280, y: 300, id: 1 },
          { x: 410, y: 300, id: 2 },
          { x: 540, y: 300, id: 3 },
          { x: 670, y: 300, id: 4 }
        ]
    }
  }
  
  const hexPositions = getPositions()
  
  const getHexInfo = (id: number) => {
    return { position: 'LINE', name: `HEX ${id}` }
  }
  
  return (
    <div className="w-full h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <motion.h1 
          className="text-2xl font-light text-white/90 tracking-wide mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          SKILL GRID
        </motion.h1>
        
        <motion.p
          className="text-white/50 text-sm mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Square Grid System • AAA Architecture
        </motion.p>
        
        {/* SVG com sistema de quadrados */}
        <motion.svg 
          width="800" 
          height="600" 
          viewBox="0 0 800 600"
          className="max-w-4xl max-h-screen"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Partículas de fundo flutuantes */}
          {[...Array(15)].map((_, i) => (
            <motion.circle
              key={`particle-${i}`}
              cx={Math.random() * 800}
              cy={Math.random() * 600}
              r={Math.random() * 3 + 1}
              fill="white"
              opacity="0.1"
              animate={{
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
                opacity: [0.1, 0.3, 0.1],
                scale: [1, 1.5, 1]
              }}
              transition={{
                duration: Math.random() * 5 + 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
          
          {/* Ondas de energia quando explode */}
          <AnimatePresence>
            {isExploding && (
              <>
                {[...Array(3)].map((_, i) => (
                  <motion.circle
                    key={`wave-${i}`}
                    cx="410"
                    cy="300"
                    r="0"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    opacity="0.8"
                    initial={{ r: 0, opacity: 0.8 }}
                    animate={{ r: 300, opacity: 0 }}
                    exit={{ r: 300, opacity: 0 }}
                    transition={{
                      duration: 1.5,
                      delay: i * 0.3,
                      ease: "easeOut"
                    }}
                  />
                ))}
              </>
            )}
          </AnimatePresence>
          
          {/* 5 quadrados em linha horizontal */}
          {hexPositions.map((squarePos, index) => {
            const x = squarePos.x
            const y = squarePos.y
            const size = 80 // Quadrados maiores
            const isActive = activeHex === squarePos.id
            
            return (
              <motion.g
                key={squarePos.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1
                }}
                transition={{ 
                  duration: 0.8,
                  delay: 0.1 + (index * 0.1),
                  type: "spring",
                  stiffness: 100,
                  damping: 15
                }}
              >
                {/* Glow para quadrado ativo */}
                <AnimatePresence>
                  {isActive && (
                    <motion.rect
                      animate={{ 
                        x: x - size/2 - 5, 
                        y: y - size/2 - 5 
                      }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 80, 
                        damping: 20 
                      }}
                      width={size + 10}
                      height={size + 10}
                      fill="none"
                      stroke="white"
                      strokeWidth="3"
                      opacity="0.2"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.2, 0.1, 0.2]
                      }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  )}
                </AnimatePresence>
                
                {/* Quadrado principal */}
                <motion.rect
                  animate={{ 
                    x: x - size/2, 
                    y: y - size/2 
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 80, 
                    damping: 20,
                    duration: 0.6
                  }}
                  width={size}
                  height={size}
                  fill="none"
                  stroke="white"
                  strokeWidth={isActive ? "2" : "1"}
                  opacity={isActive ? "1" : "0.7"}
                  whileHover={{ 
                    scale: 1.15,
                    strokeWidth: 2.5,
                    opacity: 1,
                    fill: "rgba(255,255,255,0.1)",
                    filter: "drop-shadow(0 0 15px rgba(255,255,255,0.6))",
                    rotateY: 15,
                    rotateX: 5
                  }}
                  whileTap={{ 
                    scale: 0.85,
                    rotateZ: 180,
                    backgroundColor: "#ff0000"
                  }}
                  animate={isActive ? { 
                    rotate: [0, 360],
                    scale: [1, 1.2, 0.8, 1],
                    strokeWidth: [2, 3, 2],
                    borderRadius: ["0%", "50%", "0%"]
                  } : isExploding ? {
                    x: [0, Math.random() * 200 - 100],
                    y: [0, Math.random() * 200 - 100],
                    rotate: [0, 720],
                    scale: [1, 2, 0],
                    opacity: [1, 0.5, 0]
                  } : { 
                    rotate: 0,
                    strokeWidth: 1,
                    x: 0,
                    y: 0,
                    scale: 1,
                    opacity: 0.7
                  }}
                  transition={{ 
                    rotate: { duration: isActive ? 2 : 1.5, repeat: isActive ? Infinity : 0, ease: "easeInOut" },
                    scale: { duration: 0.6, ease: "backOut" },
                    strokeWidth: { duration: 0.8, repeat: isActive ? Infinity : 0, ease: "easeInOut" },
                    borderRadius: { duration: 2, repeat: isActive ? Infinity : 0, ease: "easeInOut" },
                    x: { duration: 1, ease: "easeOut" },
                    y: { duration: 1, ease: "easeOut" },
                    opacity: { duration: 1 }
                  }}
                />
                
                {/* Área clicável invisível */}
                <motion.rect
                  animate={{ 
                    x: x - size/2, 
                    y: y - size/2 
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 80, 
                    damping: 20 
                  }}
                  width={size}
                  height={size}
                  fill="transparent"
                  stroke="none"
                  className="cursor-pointer"
                  onClick={() => {
                    setActiveHex(squarePos.id)
                    if (squarePos.id === 2) { // Quadrado central tem poder especial
                      setIsExploding(true)
                      setTimeout(() => setIsExploding(false), 2000)
                    }
                  }}
                  whileHover={{ 
                    scale: 1.1,
                    transition: { duration: 0.2 }
                  }}
                />
                
                {/* Número do quadrado */}
                <motion.text
                  animate={{ 
                    x: x, 
                    y: y + 8 
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 80, 
                    damping: 20 
                  }}
                  fontSize="20"
                  textAnchor="middle"
                  fill="white"
                  opacity={isActive ? "1" : "0.7"}
                  className="pointer-events-none select-none font-mono font-bold"
                  whileHover={{
                    scale: 1.2,
                    opacity: 1
                  }}
                  animate={isActive ? {
                    scale: [1, 1.1, 1],
                    rotate: [0, 10, -10, 0],
                    color: ["#ffffff", "#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#ffffff"]
                  } : isExploding && squarePos.id === 2 ? {
                    scale: [1, 3, 0],
                    rotate: [0, 720],
                    opacity: [1, 0]
                  } : {}}
                  transition={{
                    scale: { duration: 0.4 },
                    rotate: { duration: 2, repeat: isActive ? Infinity : 0 },
                    color: { duration: 3, repeat: isActive ? Infinity : 0 }
                  }}
                >
                  {squarePos.id}
                </motion.text>
                
                {/* Texto flutuante quando ativo */}
                <AnimatePresence>
                  {isActive && (
                    <motion.text
                      animate={{ 
                        x: x, 
                        y: y - 60 
                      }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 80, 
                        damping: 20 
                      }}
                      fontSize="12"
                      textAnchor="middle"
                      fill="white"
                      className="pointer-events-none select-none font-mono"
                      initial={{ opacity: 0, y: y + 20 }}
                      animate={{ 
                        opacity: [0, 1, 0],
                        y: y - 80,
                        scale: [0.8, 1, 1.2]
                      }}
                      exit={{ opacity: 0, y: y - 100 }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeOut"
                      }}
                    >
                      ACTIVE
                    </motion.text>
                  )}
                </AnimatePresence>
              </motion.g>
            )
          })}
          
          {/* Conexões entre vizinhos próximos (opcional - pode ativar depois) */}
          {/* Lines conectando hexágonos adjacentes seriam adicionadas aqui */}
        </motion.svg>
        
        <motion.div 
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.5 }}
        >
          <motion.div 
            className="mb-4 space-y-1"
            key={activeHex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-white/90 text-2xl font-mono font-bold">
              SQUARE {activeHex}
            </p>
            <p className="text-white/60 text-xs font-light tracking-wider">
              {getHexInfo(activeHex).position} • {getHexInfo(activeHex).name}
            </p>
          </motion.div>
          
          <div className="space-y-4">
            {/* Controles de Layout */}
            <div className="flex justify-center space-x-4">
              {['line', 'circle', 'random'].map((mode) => (
                <motion.button
                  key={mode}
                  className={`px-4 py-2 rounded-lg border font-mono text-sm ${
                    layoutMode === mode 
                      ? 'bg-white text-black border-white' 
                      : 'bg-transparent text-white border-white/30'
                  }`}
                  onClick={() => setLayoutMode(mode as any)}
                  whileHover={{ 
                    scale: 1.05,
                    backgroundColor: layoutMode === mode ? '#ffffff' : 'rgba(255,255,255,0.1)'
                  }}
                  whileTap={{ scale: 0.95 }}
                  animate={layoutMode === mode ? {
                    boxShadow: [
                      '0 0 0px rgba(255,255,255,0)',
                      '0 0 20px rgba(255,255,255,0.5)',
                      '0 0 0px rgba(255,255,255,0)'
                    ]
                  } : {}}
                  transition={{ 
                    boxShadow: { duration: 2, repeat: Infinity },
                    scale: { duration: 0.2 },
                    backgroundColor: { duration: 0.2 }
                  }}
                >
                  {mode.toUpperCase()}
                </motion.button>
              ))}
            </div>
            
            {/* Indicadores de quadrados */}
            <div className="flex justify-center space-x-2">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className={`w-2 h-2 rounded-full cursor-pointer ${
                    activeHex === i ? 'bg-white' : 'bg-white/20'
                  }`}
                  onClick={() => setActiveHex(i)}
                  whileHover={{ scale: 1.5, rotate: 180 }}
                  whileTap={{ scale: 0.5 }}
                  animate={{ 
                    backgroundColor: activeHex === i ? '#ffffff' : 'rgba(255,255,255,0.2)',
                    scale: activeHex === i ? 1.3 : 1,
                    rotate: activeHex === i ? [0, 360] : 0
                  }}
                  transition={{ 
                    duration: 0.3,
                    rotate: { duration: 2, repeat: activeHex === i ? Infinity : 0, ease: "linear" }
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}