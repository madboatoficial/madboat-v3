'use client'

import { motion } from 'framer-motion'

interface ShipWheelProps {
  size?: number
  color?: string
  opacity?: number
  animationSpeed?: number
  className?: string
}

export function ShipWheel({ 
  size = 200, 
  color = 'currentColor',
  opacity = 1,
  animationSpeed = 20,
  className = ''
}: ShipWheelProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={className}
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{
        duration: animationSpeed,
        repeat: Infinity,
        ease: "linear"
      }}
    >
      <g opacity={opacity}>
        {/* Outer ring */}
        <circle
          cx="100"
          cy="100"
          r="95"
          fill="none"
          stroke={color}
          strokeWidth="2"
        />
        
        {/* Inner ring */}
        <circle
          cx="100"
          cy="100"
          r="30"
          fill="none"
          stroke={color}
          strokeWidth="2"
        />
        
        {/* Center hub */}
        <circle
          cx="100"
          cy="100"
          r="15"
          fill={color}
          opacity="0.3"
        />
        
        {/* Spokes - 8 handles */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * 45) * Math.PI / 180
          const x1 = 100 + Math.cos(angle) * 30
          const y1 = 100 + Math.sin(angle) * 30
          const x2 = 100 + Math.cos(angle) * 95
          const y2 = 100 + Math.sin(angle) * 95
          
          return (
            <g key={i}>
              {/* Main spoke */}
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={color}
                strokeWidth="3"
              />
              
              {/* Handle grip */}
              <circle
                cx={100 + Math.cos(angle) * 85}
                cy={100 + Math.sin(angle) * 85}
                r="8"
                fill={color}
                opacity="0.2"
              />
              
              {/* Handle end */}
              <circle
                cx={x2}
                cy={y2}
                r="4"
                fill={color}
              />
            </g>
          )
        })}
        
        {/* Decorative rope pattern on outer ring */}
        <circle
          cx="100"
          cy="100"
          r="95"
          fill="none"
          stroke={color}
          strokeWidth="1"
          strokeDasharray="5 3"
          opacity="0.3"
        />
        
        {/* Compass points */}
        {['N', 'E', 'S', 'W'].map((direction, i) => {
          const angle = (i * 90) * Math.PI / 180
          const x = 100 + Math.cos(angle - Math.PI/2) * 75
          const y = 100 + Math.sin(angle - Math.PI/2) * 75
          
          return (
            <text
              key={direction}
              x={x}
              y={y}
              fill={color}
              fontSize="12"
              fontWeight="bold"
              textAnchor="middle"
              dominantBaseline="middle"
              opacity="0.5"
            >
              {direction}
            </text>
          )
        })}
      </g>
    </motion.svg>
  )
}

// Giant background version
export function ShipWheelBackground() {
  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
      <ShipWheel 
        size={800} 
        color="white" 
        opacity={0.02}
        animationSpeed={60}
        className="absolute"
      />
    </div>
  )
}