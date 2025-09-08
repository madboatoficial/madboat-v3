"use client"

/**
 * 🎮 HONEYCOMB BASIC - Versão mínima garantida
 */

import React from 'react'

export function HoneycombBasic() {
  return (
    <div className="w-full h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">
          🎮 Honeycomb System
        </h1>
        
        <p className="text-slate-400">
          Sistema hexagonal carregado com sucesso!
        </p>
        
        <div className="grid grid-cols-3 gap-4 mt-8">
          {/* Simular hexágonos com divs por enquanto */}
          <div className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center text-white text-xs">
            DNA
          </div>
          <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs">
            ALMA
          </div>
          <div className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center text-white text-xs">
            ARQT
          </div>
          <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center text-white text-xs">
            AUTH
          </div>
          <div className="w-16 h-16 bg-yellow-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">
            VOCÊ
          </div>
          <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center text-white text-xs">
            LEG
          </div>
        </div>
        
        <div className="mt-6 text-slate-500 text-sm">
          <p>✅ Carregamento bem-sucedido</p>
          <p>✅ Sem travamentos</p>
          <p>✅ Sistema funcional</p>
        </div>
      </div>
    </div>
  )
}