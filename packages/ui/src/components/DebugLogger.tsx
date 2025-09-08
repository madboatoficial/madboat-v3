"use client"

import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Monitor, X, Minimize2, Maximize2 } from 'lucide-react'

interface DebugLoggerProps {
  className?: string
}

export function DebugLogger({ className = '' }: DebugLoggerProps) {
  const [isMinimized, setIsMinimized] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const pathname = usePathname()

  // Get current page name from pathname
  const getPageName = (path: string): string => {
    if (path === '/') return 'Dashboard'
    if (path === '/persona') return 'Persona'
    if (path === '/progresso') return 'Progresso'
    if (path === '/timeline') return 'Timeline'
    
    // Remove leading slash and capitalize
    const cleanPath = path.replace('/', '')
    return cleanPath.charAt(0).toUpperCase() + cleanPath.slice(1)
  }

  // Get current file name (simplified - based on route)
  const getFileName = (path: string): string => {
    if (path === '/') return 'page.tsx'
    if (path === '/persona') return 'page.tsx'
    if (path === '/progresso') return 'page.tsx'
    if (path === '/timeline') return 'page.tsx'
    
    return `${path.replace('/', '')}/page.tsx`
  }

  const pageName = getPageName(pathname)
  const fileName = getFileName(pathname)

  if (!isVisible) return null

  return (
    <div className={`fixed bottom-4 right-4 z-[9999] ${className}`}>
      <div className="bg-black/90 backdrop-blur-sm border border-zinc-700 rounded-lg shadow-2xl text-white font-mono text-xs">
        
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-700">
          <div className="flex items-center gap-2">
            <Monitor size={12} className="text-blue-400" />
            <span className="text-blue-400 font-semibold">Debug Logger</span>
          </div>
          
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="w-5 h-5 flex items-center justify-center hover:bg-zinc-700 rounded transition-colors"
              title={isMinimized ? "Maximizar" : "Minimizar"}
            >
              {isMinimized ? <Maximize2 size={10} /> : <Minimize2 size={10} />}
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="w-5 h-5 flex items-center justify-center hover:bg-red-600 rounded transition-colors"
              title="Fechar"
            >
              <X size={10} />
            </button>
          </div>
        </div>

        {/* Content */}
        {!isMinimized && (
          <div className="px-3 py-2 space-y-1 min-w-[220px]">
            <div className="flex justify-between">
              <span className="text-zinc-400">Página:</span>
              <span className="text-green-400 font-semibold">{pageName}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-zinc-400">Arquivo:</span>
              <span className="text-yellow-400">{fileName}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-zinc-400">Rota:</span>
              <span className="text-cyan-400">{pathname}</span>
            </div>
            
            <div className="pt-1 border-t border-zinc-800 text-[10px]">
              <div className="flex justify-between">
                <span className="text-zinc-500">Timestamp:</span>
                <span className="text-zinc-300">{new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}