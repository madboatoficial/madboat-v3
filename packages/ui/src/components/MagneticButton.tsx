'use client'

import React from 'react'

interface MagneticButtonProps {
  onClick: () => void
  children: string
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({ onClick, children }) => {
  return (
    <div className="relative group">
      {/* Botão Principal */}
      <button
        onClick={onClick}
        className="relative bg-black text-white px-16 py-6 text-xl font-bold tracking-wide
                   transition-all duration-500 hover:scale-105 hover:shadow-2xl z-10"
      >
        {children}
      </button>

      {/* Palavras Magnéticas */}
      <div className="absolute inset-0 pointer-events-none">
        {['autenticidade', 'personalidade', 'descoberta', 'transformação', 'identidade', 'essência'].map((word, index) => (
          <div
            key={word}
            className="absolute text-gray-400 text-sm font-light tracking-wide
                       transition-all duration-1000 opacity-0 group-hover:opacity-100
                       group-hover:scale-0 group-hover:blur-sm"
            style={{
              top: '50%',
              left: '50%',
              transform: `
                translate(-50%, -50%)
                translate(${Math.cos((index * 60) * Math.PI / 180) * 100}px, ${Math.sin((index * 60) * Math.PI / 180) * 100}px)
              `,
              transitionDelay: `${index * 100}ms`
            }}
          >
            {word}
          </div>
        ))}
      </div>
    </div>
  )
}