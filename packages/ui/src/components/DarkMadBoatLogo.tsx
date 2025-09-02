"use client"

import React from 'react'
import { Anchor } from 'lucide-react'

interface DarkMadBoatLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function DarkMadBoatLogo({ 
  size = 'lg',
  className = ''
}: DarkMadBoatLogoProps) {
  
  const sizes = {
    sm: { text: 'text-2xl', icon: 24 },
    md: { text: 'text-3xl', icon: 28 },
    lg: { text: 'text-5xl', icon: 36 },
    xl: { text: 'text-6xl', icon: 48 }
  }
  
  const config = sizes[size]
  
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <span className={`${config.text} font-bold text-white tracking-tight`}>
        Mad
      </span>
      <Anchor 
        size={config.icon} 
        className="text-white animate-spin-slow"
        strokeWidth={2.5}
      />
      <span className={`${config.text} font-bold text-white tracking-tight`}>
        Boat
      </span>
    </div>
  )
}