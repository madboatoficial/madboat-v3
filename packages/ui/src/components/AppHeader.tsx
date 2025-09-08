"use client"

/**
 * 🏔️ APP HEADER - HUD Fixed Header
 * Fixed header component for all pages with MadBoat logo
 */

import React from 'react'
import { ShipWheel, User, LogOut } from 'lucide-react'

interface AppHeaderProps {
  userName?: string
  pageTitle?: string
  pageSubtitle?: string
  onUserClick?: () => void
  onLogout?: () => void
  rightContent?: React.ReactNode
}

export function AppHeader({ 
  userName, 
  pageTitle, 
  pageSubtitle, 
  onUserClick,
  onLogout,
  rightContent 
}: AppHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-zinc-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: MadBoat Logo */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-white tracking-wide">Mad</span>
            <ShipWheel size={16} className="text-white animate-spin-slow" strokeWidth={2.5} />
            <span className="text-lg font-bold text-white tracking-wide">Boat</span>
            
            {pageTitle && (
              <>
                <div className="w-px h-4 bg-zinc-700 mx-3" />
                <div>
                  <h1 className="text-sm font-medium text-white">{pageTitle}</h1>
                  {pageSubtitle && (
                    <p className="text-xs text-zinc-400">{pageSubtitle}</p>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Center: Custom content area */}
          <div className="flex-1 flex justify-center">
            {rightContent && <div className="text-center">{rightContent}</div>}
          </div>

          {/* Right: User actions */}
          <div className="flex items-center gap-3">
            {userName && (
              <div className="flex items-center gap-2">
                <button
                  onClick={onUserClick}
                  className="flex items-center gap-2 px-3 py-2 bg-zinc-900/50 border border-zinc-800/50 rounded-lg hover:bg-zinc-800/50 transition-colors group"
                >
                  <User className="w-4 h-4 text-zinc-400 group-hover:text-white" />
                  <span className="text-sm text-zinc-300 group-hover:text-white">{userName}</span>
                </button>
                
                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="p-2 bg-red-600/20 border border-red-600/50 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}