"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// 🐠 Mandarin Fish creation: SPA Navigation Controller
// Instructional design: Seamless context switching without cognitive disruption

export type PageType = 'dashboard' | 'upgrade' | 'treasures' | 'journey'

interface PageContextType {
  currentPage: PageType
  navigateTo: (page: PageType) => void
  previousPage?: PageType
}

const PageContext = createContext<PageContextType | null>(null)

export function usePageController() {
  const context = useContext(PageContext)
  if (!context) {
    throw new Error('usePageController must be used within PageProvider')
  }
  return context
}

interface PageProviderProps {
  children: ReactNode
  initialPage?: PageType
}

export function PageProvider({ children, initialPage = 'dashboard' }: PageProviderProps) {
  const [currentPage, setCurrentPage] = useState<PageType>(initialPage)
  const [previousPage, setPreviousPage] = useState<PageType | undefined>()

  const navigateTo = (page: PageType) => {
    setPreviousPage(currentPage)
    setCurrentPage(page)
  }

  return (
    <PageContext.Provider value={{ currentPage, navigateTo, previousPage }}>
      {children}
    </PageContext.Provider>
  )
}

interface PageTransitionProps {
  pageKey: PageType
  currentPage: PageType
  children: ReactNode
  className?: string
}

export function PageTransition({ pageKey, currentPage, children, className = "" }: PageTransitionProps) {
  const isActive = pageKey === currentPage

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          key={pageKey}
          initial={{
            opacity: 0,
            x: 20,
            scale: 0.98
          }}
          animate={{
            opacity: 1,
            x: 0,
            scale: 1
          }}
          exit={{
            opacity: 0,
            x: -20,
            scale: 0.98
          }}
          transition={{
            duration: 0.4,
            ease: [0.23, 1, 0.32, 1]
          }}
          className={`${className}`}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Page transition variants for different animation styles
export const pageVariants = {
  dashboard: {
    initial: { opacity: 0, x: -20, scale: 0.98 },
    animate: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: 20, scale: 0.98 }
  },
  upgrade: {
    initial: { opacity: 0, y: 30, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -30, scale: 0.95 }
  },
  modal: {
    initial: { opacity: 0, scale: 0.9, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.9, y: 20 }
  }
}

// Higher-order component for lazy loading pages
export function withPageLazyLoading<P extends object>(
  Component: React.ComponentType<P>,
  fallback: ReactNode = (
    <div className="flex items-center justify-center h-64">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
      />
    </div>
  )
) {
  return function LazyPage(props: P) {
    return (
      <React.Suspense fallback={fallback}>
        <Component {...props} />
      </React.Suspense>
    )
  }
}

// Navigation breadcrumbs component
interface BreadcrumbProps {
  currentPage: PageType
  onNavigate: (page: PageType) => void
  className?: string
}

export function PageBreadcrumb({ currentPage, onNavigate, className }: BreadcrumbProps) {
  const pageLabels: Record<PageType, string> = {
    dashboard: 'Dashboard',
    upgrade: 'Upgrade',
    treasures: 'Tesouros',
    journey: 'Jornada'
  }

  return (
    <motion.nav
      className={`flex items-center space-x-2 text-sm ${className}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.button
        onClick={() => onNavigate('dashboard')}
        className={`
          px-2 py-1 rounded transition-colors duration-200
          ${currentPage === 'dashboard'
            ? 'text-black font-medium'
            : 'text-black/60 hover:text-black/80'
          }
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {pageLabels.dashboard}
      </motion.button>

      {currentPage !== 'dashboard' && (
        <>
          <span className="text-black/40">/</span>
          <motion.span
            className="text-black font-medium"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            {pageLabels[currentPage]}
          </motion.span>
        </>
      )}
    </motion.nav>
  )
}