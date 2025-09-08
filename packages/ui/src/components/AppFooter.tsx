"use client"

/**
 * 🦶 APP FOOTER - HUD Fixed Footer
 * Fixed footer component for all pages with dynamic content per page
 */

import React from 'react'
import { Activity, Clock, Users, Target } from 'lucide-react'

interface AppFooterProps {
  leftContent?: React.ReactNode
  centerContent?: React.ReactNode
  rightContent?: React.ReactNode
  status?: string
  progress?: {
    current: number
    total: number
    label: string
  }
}

export function AppFooter({ 
  leftContent, 
  centerContent, 
  rightContent,
  status,
  progress 
}: AppFooterProps) {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-t border-zinc-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          
          {/* Left: Status or custom content */}
          <div className="flex items-center gap-4">
            {status && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs text-zinc-400">{status}</span>
              </div>
            )}
            {leftContent}
          </div>

          {/* Center: Progress or custom content */}
          <div className="flex items-center gap-6">
            {progress && (
              <div className="flex items-center gap-3">
                <Target className="w-4 h-4 text-zinc-500" />
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-400">{progress.label}:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1 bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full transition-all duration-300"
                        style={{ width: `${(progress.current / progress.total) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-zinc-300 font-medium">
                      {progress.current}/{progress.total}
                    </span>
                  </div>
                </div>
              </div>
            )}
            {centerContent}
          </div>

          {/* Right: Actions or custom content */}
          <div className="flex items-center gap-3">
            {rightContent}
            
            {/* Always show current time */}
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <Clock className="w-3 h-3" />
              <span suppressHydrationWarning>
                {new Date().toLocaleTimeString('pt-BR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}