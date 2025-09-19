'use client'

import React from 'react'

interface SimpleLandingProps {
  onStartDiscovery: () => void
}

export const SimpleLanding: React.FC<SimpleLandingProps> = ({ onStartDiscovery }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-8">
      <div className="max-w-2xl text-center space-y-8">
        {/* Texto explicativo */}
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
            Descubra sua Persona Única
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Uma jornada de autoconhecimento profundo e autêntico para revelar quem você realmente é e como isso impacta seus negócios.
          </p>
        </div>

        {/* Botão */}
        <div className="pt-4">
          <button
            onClick={onStartDiscovery}
            className="bg-black text-white px-16 py-6 text-xl font-bold tracking-wide hover:bg-gray-800 transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            DESCOBRIR AGORA
          </button>
        </div>
      </div>
    </div>
  )
}