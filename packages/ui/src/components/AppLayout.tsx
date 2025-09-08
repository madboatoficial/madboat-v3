"use client"

/**
 * 🏗️ APP LAYOUT - HUD Layout System
 * Layout wrapper with fixed header and footer for all pages
 */

import React from 'react'
import { AppHeader } from './AppHeader'
import { AppFooter } from './AppFooter'

interface AppLayoutProps {
  children: React.ReactNode
  
  // Header props
  userName?: string
  pageTitle?: string
  pageSubtitle?: string
  onUserClick?: () => void
  onLogout?: () => void
  headerRightContent?: React.ReactNode
  
  // Footer props
  footerLeftContent?: React.ReactNode
  footerCenterContent?: React.ReactNode
  footerRightContent?: React.ReactNode
  status?: string
  progress?: {
    current: number
    total: number
    label: string
  }
  
  // Layout options
  className?: string
  contentClassName?: string
}

export function AppLayout({
  children,
  userName,
  pageTitle,
  pageSubtitle,
  onUserClick,
  onLogout,
  headerRightContent,
  footerLeftContent,
  footerCenterContent,
  footerRightContent,
  status,
  progress,
  className = '',
  contentClassName = ''
}: AppLayoutProps) {
  return (
    <div className={`min-h-screen bg-black ${className}`}>
      {/* Fixed Header */}
      <AppHeader
        userName={userName}
        pageTitle={pageTitle}
        pageSubtitle={pageSubtitle}
        onUserClick={onUserClick}
        onLogout={onLogout}
        rightContent={headerRightContent}
      />

      {/* Main Content Area - with padding for fixed header/footer */}
      <main className={`pt-16 pb-14 min-h-screen ${contentClassName}`}>
        {children}
      </main>

      {/* Fixed Footer */}
      <AppFooter
        leftContent={footerLeftContent}
        centerContent={footerCenterContent}
        rightContent={footerRightContent}
        status={status}
        progress={progress}
      />
    </div>
  )
}