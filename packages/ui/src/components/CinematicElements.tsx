'use client'

import { motion } from 'framer-motion'

// Geometric line art elements for each scene
export const SceneElements = {
  // Opening scene - compass/navigation elements
  opening: (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 1000">
      <g className="text-white/10">
        {/* Compass rose */}
        <motion.circle
          cx="500"
          cy="500"
          r="200"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        <motion.path
          d="M 500 300 L 500 700 M 300 500 L 700 500"
          stroke="currentColor"
          strokeWidth="0.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
        />
        {/* Orbit rings */}
        {[250, 300, 350].map((r, i) => (
          <motion.circle
            key={r}
            cx="500"
            cy="500"
            r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth="0.3"
            strokeDasharray="5 10"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 20 + i * 5,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{ transformOrigin: "500px 500px" }}
          />
        ))}
      </g>
    </svg>
  ),

  // Discovery scene - interconnected nodes
  discovery: (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 1000">
      <g className="text-white/10">
        {/* Neural network visualization */}
        {Array.from({ length: 7 }).map((_, i) => {
          const angle = (i / 7) * Math.PI * 2
          const x = 500 + Math.cos(angle) * 200
          const y = 500 + Math.sin(angle) * 200
          return (
            <g key={i}>
              <motion.circle
                cx={x}
                cy={y}
                r="8"
                fill="currentColor"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1, 0.8, 1] }}
                transition={{
                  duration: 2,
                  delay: i * 0.1,
                  repeat: Infinity,
                  repeatDelay: 5
                }}
              />
              {/* Connections */}
              <motion.line
                x1="500"
                y1="500"
                x2={x}
                y2={y}
                stroke="currentColor"
                strokeWidth="0.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 1,
                  delay: i * 0.1
                }}
              />
            </g>
          )
        })}
        {/* Central node */}
        <motion.circle
          cx="500"
          cy="500"
          r="15"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 3,
            repeat: Infinity
          }}
        />
      </g>
    </svg>
  ),

  // Transformation scene - metamorphosis shapes
  transformation: (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 1000">
      <g className="text-white/10">
        {/* Morphing diamond */}
        <motion.path
          d="M 500 250 L 650 500 L 500 750 L 350 500 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          animate={{
            d: [
              "M 500 250 L 650 500 L 500 750 L 350 500 Z",
              "M 500 300 L 700 500 L 500 700 L 300 500 Z",
              "M 500 250 L 650 500 L 500 750 L 350 500 Z"
            ]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        {/* Rotating squares */}
        {[0, 45, 90, 135].map((rotation, i) => (
          <motion.rect
            key={rotation}
            x="400"
            y="400"
            width="200"
            height="200"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.3"
            initial={{ rotate: rotation }}
            animate={{ rotate: rotation + 360 }}
            transition={{
              duration: 20 + i * 2,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{ transformOrigin: "500px 500px" }}
          />
        ))}
      </g>
    </svg>
  ),

  // Acceleration scene - vortex/spiral
  acceleration: (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 1000">
      <g className="text-white/10">
        {/* Spiral vortex */}
        <motion.path
          d={(() => {
            const points = []
            for (let i = 0; i < 720; i += 5) {
              const angle = (i * Math.PI) / 180
              const radius = i * 0.3
              const x = 500 + Math.cos(angle) * radius
              const y = 500 + Math.sin(angle) * radius
              points.push(`${x},${y}`)
            }
            return `M ${points.join(' L ')}`
          })()}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        {/* Orbiting particles */}
        {Array.from({ length: 5 }).map((_, i) => {
          const delay = i * 0.4
          return (
            <motion.circle
              key={i}
              r="3"
              fill="currentColor"
              initial={{ x: 500, y: 500 }}
              animate={{
                x: [500, 600, 500, 400, 500],
                y: [500, 450, 350, 450, 500]
              }}
              transition={{
                duration: 4,
                delay,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )
        })}
      </g>
    </svg>
  ),

  // Mastery scene - crown/infinity symbol
  mastery: (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 1000">
      <g className="text-white/10">
        {/* Infinity symbol */}
        <motion.path
          d="M 350 500 Q 350 400, 450 400 T 550 500 Q 550 600, 650 600 T 750 500 Q 750 400, 650 400 T 550 500 Q 550 600, 450 600 T 350 500"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        {/* Crown points */}
        {[
          { x: 400, y: 350 },
          { x: 450, y: 300 },
          { x: 500, y: 250 },
          { x: 550, y: 300 },
          { x: 600, y: 350 }
        ].map((point, i) => (
          <motion.circle
            key={i}
            cx={point.x}
            cy={point.y}
            r="5"
            fill="currentColor"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 1, 1, 0],
              scale: [0, 1, 1, 0]
            }}
            transition={{
              duration: 3,
              delay: i * 0.2,
              repeat: Infinity,
              repeatDelay: 2
            }}
          />
        ))}
        {/* Radiating lines */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2
          const x2 = 500 + Math.cos(angle) * 300
          const y2 = 500 + Math.sin(angle) * 300
          return (
            <motion.line
              key={i}
              x1="500"
              y1="500"
              x2={x2}
              y2={y2}
              stroke="currentColor"
              strokeWidth="0.2"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{
                duration: 3,
                delay: i * 0.1,
                repeat: Infinity
              }}
            />
          )
        })}
      </g>
    </svg>
  )
}

// Floating particles component
export function FloatingParticles({ count = 20 }: { count?: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/20 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 100
          }}
          animate={{
            y: -100,
            x: Math.random() * window.innerWidth
          }}
          transition={{
            duration: Math.random() * 20 + 10,
            repeat: Infinity,
            delay: Math.random() * 10,
            ease: "linear"
          }}
        />
      ))}
    </div>
  )
}

// Wave generator for background
export function WaveBackground({ 
  color = "white",
  opacity = 0.05 
}: { 
  color?: string
  opacity?: number 
}) {
  return (
    <svg 
      className="absolute bottom-0 w-full" 
      viewBox="0 0 1440 320"
      preserveAspectRatio="none"
      style={{ height: '40vh' }}
    >
      <motion.path
        fill={color}
        fillOpacity={opacity}
        animate={{
          d: [
            "M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,128C672,107,768,117,864,138.7C960,160,1056,192,1152,197.3C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
            "M0,192L48,197.3C96,203,192,213,288,192C384,171,480,117,576,106.7C672,96,768,128,864,154.7C960,181,1056,203,1152,192C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
            "M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,128C672,107,768,117,864,138.7C960,160,1056,192,1152,197.3C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </svg>
  )
}