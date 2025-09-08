"use client"

import { useState, useRef, useEffect } from 'react'
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings, 
  Crown, 
  Shield, 
  Compass, 
  Clock, 
  Trophy, 
  Target 
} from 'lucide-react'
import { motion, AnimatePresence, useSpring, useMotionValue, useTransform } from 'framer-motion'
import { PageType } from './AppLayout'

interface AppHeaderProps {
  pageType: PageType
  user?: {
    email: string | undefined
    id: string
  }
  userName?: string
  onLogout?: () => Promise<void>
  onNavigate?: (page: string) => void
}

export function AppHeader({ pageType, user, userName, onLogout, onNavigate }: AppHeaderProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const navigationItems = [
    { id: 'desafios', label: 'Desafios', icon: Target, active: pageType === 'desafios', gradient: 'from-red-500 to-orange-500' },
    { id: 'missoes', label: 'Missões', icon: Compass, active: pageType === 'missoes', gradient: 'from-blue-500 to-cyan-500' },
    { id: 'conquistas', label: 'Conquistas', icon: Trophy, active: pageType === 'conquistas', gradient: 'from-yellow-500 to-orange-500' },
    { id: 'progresso', label: 'Progresso', icon: Shield, active: pageType === 'progresso', gradient: 'from-green-500 to-emerald-500' },
    { id: 'timeline', label: 'Timeline', icon: Clock, active: pageType === 'timeline', gradient: 'from-purple-500 to-pink-500' }
  ]

  // Floating particle system
  const particles = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    x: Math.random() * 200,
    y: Math.random() * 200,
    size: Math.random() * 4 + 2
  }))

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        mouseX.set(e.clientX - rect.left)
        mouseY.set(e.clientY - rect.top)
      }
    }

    if (userMenuOpen) {
      window.addEventListener('mousemove', handleMouseMove)
      return () => window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [userMenuOpen, mouseX, mouseY])

  return (
    <header className="bg-white backdrop-blur-sm border-b border-slate-200 relative z-50">
      <div className="px-4 md:px-6">
        {/* Main Header */}
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Left: Spacer */}
          <div className="w-8"></div>

          {/* Center: MadBoat Logo */}
          <div className="flex-1 flex justify-center">
            <h1 className="text-xl md:text-2xl font-bold text-slate-900">
              MadBoat
            </h1>
          </div>

          {/* Right: Navigation + User Avatar */}
          <div className="flex items-center gap-4">
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate?.(item.id)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors duration-200 ${
                    item.active
                      ? 'bg-blue-800 text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {item.label.replace('Progresso', 'Legado')}
                </button>
              ))}
            </nav>

            {/* Minimalist User Avatar */}
            <div className="relative">
            {user ? (
              <div className="flex items-center">
                <motion.button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="relative w-10 h-10 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-900 font-semibold text-sm hover:bg-slate-50 hover:border-slate-400 transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Menu do usuário"
                >
                  {userName?.charAt(0) || 'N'}
                </motion.button>

                {/* SPECTACULAR DROPDOWN MENU */}
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      ref={containerRef}
                      className="absolute right-0 top-full mt-4 w-80 z-50"
                      initial={{ opacity: 0, y: -20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.9 }}
                      transition={{ 
                        type: "spring", 
                        damping: 25, 
                        stiffness: 300,
                        duration: 0.3
                      }}
                    >
                      {/* Minimalist Container */}
                      <motion.div
                        className="relative bg-white backdrop-blur-xl rounded-xl border border-slate-200 shadow-lg overflow-hidden"
                      >

                        {/* User Profile Section */}
                        <motion.div 
                          className="p-4 border-b border-slate-200"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-100 border border-slate-300 rounded-full flex items-center justify-center text-slate-900 text-sm font-semibold">
                              {userName?.charAt(0) || 'N'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-slate-900 text-sm font-medium truncate">
                                {userName || 'Navigator'}
                              </h3>
                              <p className="text-slate-500 text-xs truncate">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </motion.div>

                        {/* Navigation Grid */}
                        <div className="p-4">
                          <motion.div 
                            className="grid grid-cols-2 gap-3 lg:hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            {navigationItems.map((item, index) => {
                              const Icon = item.icon
                              return (
                                <motion.button
                                  key={item.id}
                                  onClick={() => {
                                    onNavigate?.(item.id)
                                    setUserMenuOpen(false)
                                  }}
                                  className={`relative group p-3 rounded-lg transition-all duration-200 ${
                                    item.active
                                      ? 'bg-blue-800 text-white'
                                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                  }`}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.3 + index * 0.05 }}
                                  whileHover={{ 
                                    scale: 1.05,
                                    transition: { duration: 0.2 }
                                  }}
                                  whileTap={{ scale: 0.95 }}
                                  onHoverStart={() => setHoveredItem(item.id)}
                                  onHoverEnd={() => setHoveredItem(null)}
                                >
                                  <div className="flex flex-col items-center gap-2">
                                    <Icon className="w-5 h-5" />
                                    <span className="text-xs font-medium">
                                      {item.label}
                                    </span>
                                  </div>
                                </motion.button>
                              )
                            })}
                          </motion.div>
                        </div>

                        {/* Footer Actions */}
                        {onLogout && (
                          <motion.div 
                            className="p-4 border-t border-slate-200"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                          >
                            <button
                              onClick={() => {
                                onLogout()
                                setUserMenuOpen(false)
                              }}
                              className="w-full flex items-center justify-center gap-2 p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                            >
                              <LogOut className="w-4 h-4" />
                              <span className="text-sm font-medium">Sair</span>
                            </button>
                          </motion.div>
                        )}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="w-12 h-12"></div>
            )}
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close menu */}
      {userMenuOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setUserMenuOpen(false)}
        />
      )}
    </header>
  )
}