'use client'

import { motion } from 'framer-motion'

export function VortexAnimation() {
  return (
    <svg 
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 1000 1000"
    >
      <defs>
        <linearGradient id="vortexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgb(147, 51, 234)" stopOpacity="0.1" />
          <stop offset="100%" stopColor="rgb(79, 70, 229)" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      
      {/* Spiral Vortex Paths */}
      {Array.from({ length: 5 }).map((_, i) => {
        const rotation = i * 72 // 360/5 for even distribution
        const scale = 1 - (i * 0.15) // Progressively smaller
        
        return (
          <motion.path
            key={i}
            d={(() => {
              const points = []
              for (let angle = 0; angle < 1080; angle += 10) { // 3 full rotations
                const radians = (angle * Math.PI) / 180
                const radius = (angle / 1080) * 400 // Expanding radius
                const x = 500 + Math.cos(radians) * radius * scale
                const y = 500 + Math.sin(radians) * radius * scale
                points.push(`${x},${y}`)
              }
              return `M ${points.join(' L ')}`
            })()}
            fill="none"
            stroke="url(#vortexGradient)"
            strokeWidth={2 - i * 0.3}
            initial={{ 
              pathLength: 0,
              rotate: rotation,
              opacity: 0 
            }}
            animate={{ 
              pathLength: 1,
              rotate: rotation + 360,
              opacity: [0, 0.5, 0.3, 0.5, 0]
            }}
            transition={{
              pathLength: { duration: 3, ease: "easeInOut" },
              rotate: { duration: 20 + i * 2, repeat: Infinity, ease: "linear" },
              opacity: { duration: 4, repeat: Infinity, repeatType: "reverse" }
            }}
            style={{ transformOrigin: "500px 500px" }}
          />
        )
      })}
      
      {/* Center Eye of the Vortex */}
      <motion.circle
        cx="500"
        cy="500"
        r="10"
        fill="rgb(147, 51, 234)"
        opacity="0.3"
        animate={{
          r: [10, 20, 10],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Orbiting Particles */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2
        const orbitRadius = 200 + i * 30
        
        return (
          <motion.circle
            key={`particle-${i}`}
            r="3"
            fill="rgb(147, 51, 234)"
            opacity="0.4"
            initial={{
              cx: 500 + Math.cos(angle) * orbitRadius,
              cy: 500 + Math.sin(angle) * orbitRadius
            }}
            animate={{
              cx: [
                500 + Math.cos(angle) * orbitRadius,
                500 + Math.cos(angle + Math.PI) * orbitRadius,
                500 + Math.cos(angle) * orbitRadius
              ],
              cy: [
                500 + Math.sin(angle) * orbitRadius,
                500 + Math.sin(angle + Math.PI) * orbitRadius,
                500 + Math.sin(angle) * orbitRadius
              ]
            }}
            transition={{
              duration: 10 + i,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )
      })}
    </svg>
  )
}