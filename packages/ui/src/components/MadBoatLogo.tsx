"use client"

import React from 'react'

interface MadBoatLogoProps {
  size?: number
  className?: string
  animated?: boolean
}

export function MadBoatLogo({ 
  size = 40, 
  className = '',
  animated = true
}: MadBoatLogoProps) {
  return (
    <div className={`flex items-center justify-center font-bold ${className}`}>
      <span 
        className="text-white"
        style={{ 
          fontSize: `${size}px`,
          letterSpacing: '0.05em'
        }}
      >
        Mad
      </span>
      
      {/* Ship Wheel SVG */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className={`mx-2 ${animated ? 'animate-spin-slow' : ''}`}
        style={{ display: 'inline-block' }}
      >
        {/* Outer circle */}
        <circle
          cx="50"
          cy="50"
          r="42"
          stroke="white"
          strokeWidth="3"
          fill="none"
          opacity="0.9"
        />
        
        {/* Inner circle */}
        <circle
          cx="50"
          cy="50"
          r="12"
          stroke="white"
          strokeWidth="3"
          fill="none"
          opacity="0.9"
        />
        
        {/* Center dot */}
        <circle
          cx="50"
          cy="50"
          r="4"
          fill="white"
        />
        
        {/* 8 Spokes */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <line
            key={angle}
            x1="50"
            y1="50"
            x2={50 + 38 * Math.cos((angle * Math.PI) / 180)}
            y2={50 + 38 * Math.sin((angle * Math.PI) / 180)}
            stroke="white"
            strokeWidth="3"
            opacity="0.9"
          />
        ))}
        
        {/* Handle grips */}
        {[0, 90, 180, 270].map((angle) => {
          const handleX = 50 + 30 * Math.cos((angle * Math.PI) / 180)
          const handleY = 50 + 30 * Math.sin((angle * Math.PI) / 180)
          return (
            <circle
              key={`handle-${angle}`}
              cx={handleX}
              cy={handleY}
              r="5"
              fill="white"
              opacity="0.9"
            />
          )
        })}
      </svg>
      
      <span 
        className="text-white"
        style={{ 
          fontSize: `${size}px`,
          letterSpacing: '0.05em'
        }}
      >
        Boat
      </span>
    </div>
  )
}