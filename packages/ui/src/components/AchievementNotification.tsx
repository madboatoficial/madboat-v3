"use client"

/**
 * 🏆 ACHIEVEMENT NOTIFICATION SYSTEM
 * Elegant milestone completion notifications
 * Positioned to not interfere with main workflow
 */

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { 
  Trophy,
  Star,
  Crown,
  Gem,
  CheckCircle,
  X,
  Sparkles,
  Zap,
  Award
} from 'lucide-react'

export interface Achievement {
  id: string
  title: string
  description: string
  type: 'milestone' | 'bonus' | 'progression' | 'rare'
  icon?: 'trophy' | 'star' | 'crown' | 'gem' | 'check' | 'sparkles' | 'zap' | 'award'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  points?: number
  unlocks?: string[]
}

interface AchievementNotificationProps {
  achievement: Achievement
  isVisible: boolean
  onClose: () => void
  position?: 'top-right' | 'top-center' | 'bottom-right' | 'bottom-center'
  duration?: number
}

const iconMap = {
  trophy: Trophy,
  star: Star,
  crown: Crown,
  gem: Gem,
  check: CheckCircle,
  sparkles: Sparkles,
  zap: Zap,
  award: Award
}

const rarityThemes = {
  common: {
    gradient: 'from-blue-500 to-blue-600',
    border: 'border-blue-400/50',
    bg: 'bg-blue-950/40',
    glow: 'shadow-blue-500/20',
    particles: 'text-blue-400'
  },
  rare: {
    gradient: 'from-purple-500 to-purple-600',
    border: 'border-purple-400/50',
    bg: 'bg-purple-950/40',
    glow: 'shadow-purple-500/20',
    particles: 'text-purple-400'
  },
  epic: {
    gradient: 'from-orange-500 to-red-600',
    border: 'border-orange-400/50',
    bg: 'bg-orange-950/40',
    glow: 'shadow-orange-500/20',
    particles: 'text-orange-400'
  },
  legendary: {
    gradient: 'from-yellow-400 to-orange-500',
    border: 'border-yellow-400/50',
    bg: 'bg-yellow-950/40',
    glow: 'shadow-yellow-500/30',
    particles: 'text-yellow-400'
  }
}

const positionClasses = {
  'top-right': 'top-20 right-6',
  'top-center': 'top-20 left-1/2 transform -translate-x-1/2',
  'bottom-right': 'bottom-6 right-6',
  'bottom-center': 'bottom-6 left-1/2 transform -translate-x-1/2'
}

export function AchievementNotification({ 
  achievement, 
  isVisible, 
  onClose, 
  position = 'top-right',
  duration = 6000 
}: AchievementNotificationProps) {
  const [showDetails, setShowDetails] = useState(false)
  const theme = rarityThemes[achievement.rarity]
  const Icon = iconMap[achievement.icon || 'trophy']
  
  // Auto-close after duration
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])
  
  // Expand details after initial animation
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setShowDetails(true)
      }, 800)
      
      return () => clearTimeout(timer)
    } else {
      setShowDetails(false)
    }
  }, [isVisible])

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
          className={`fixed ${positionClasses[position]} z-50 max-w-sm`}
        >
          {/* Achievement Card */}
          <motion.div
            className={`
              relative overflow-hidden backdrop-blur-sm rounded-2xl border-2 
              ${theme.border} ${theme.bg} ${theme.glow} shadow-2xl
            `}
            whileHover={{ scale: 1.02 }}
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-r ${theme.gradient} opacity-10`} />
            
            {/* Particles Effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0], 
                    scale: [0, 1, 0],
                    x: [0, (Math.random() - 0.5) * 100],
                    y: [0, (Math.random() - 0.5) * 100]
                  }}
                  transition={{ 
                    duration: 2,
                    delay: i * 0.2,
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                  className={`absolute top-1/2 left-1/2 w-1 h-1 ${theme.particles} rounded-full`}
                />
              ))}
            </div>
            
            {/* Main Content */}
            <div className="relative p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {/* Icon */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring", bounce: 0.4 }}
                    className={`
                      w-12 h-12 rounded-xl bg-gradient-to-r ${theme.gradient}
                      flex items-center justify-center shadow-lg
                    `}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </motion.div>
                  
                  {/* Title */}
                  <div>
                    <motion.p 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-white font-medium text-sm mb-1"
                    >
                      Conquista Desbloqueada!
                    </motion.p>
                    <motion.h3
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-white font-bold text-lg leading-tight"
                    >
                      {achievement.title}
                    </motion.h3>
                  </div>
                </div>
                
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="text-zinc-400 hover:text-white transition-colors p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              {/* Rarity Badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-3"
              >
                <span className={`
                  inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium
                  bg-gradient-to-r ${theme.gradient} text-white shadow-sm
                `}>
                  <Gem className="w-3 h-3" />
                  {achievement.rarity.toUpperCase()}
                </span>
              </motion.div>
              
              {/* Description - Expandable */}
              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="text-zinc-300 text-sm leading-relaxed mb-4">
                      {achievement.description}
                    </p>
                    
                    {/* Points & Unlocks */}
                    {(achievement.points || achievement.unlocks) && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {achievement.points && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-zinc-800/50 rounded-lg text-xs text-zinc-300">
                            <Star className="w-3 h-3" />
                            +{achievement.points} XP
                          </span>
                        )}
                        {achievement.unlocks && achievement.unlocks.length > 0 && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-zinc-800/50 rounded-lg text-xs text-zinc-300">
                            <Zap className="w-3 h-3" />
                            {achievement.unlocks.length} desbloqueado{achievement.unlocks.length > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800/50">
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: duration / 1000, ease: "linear" }}
                className={`h-full bg-gradient-to-r ${theme.gradient}`}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Hook for managing achievement notifications
export function useAchievementNotification() {
  const [achievements, setAchievements] = useState<(Achievement & { visible: boolean })[]>([])
  
  const showAchievement = (achievement: Achievement) => {
    setAchievements(prev => [...prev, { ...achievement, visible: true }])
  }
  
  const hideAchievement = (id: string) => {
    setAchievements(prev => prev.filter(a => a.id !== id))
  }
  
  return {
    achievements,
    showAchievement,
    hideAchievement
  }
}

// Achievement Notification Container Component
export function AchievementNotificationContainer() {
  const { achievements, hideAchievement } = useAchievementNotification()
  
  return (
    <>
      {achievements.map((achievement, index) => (
        <AchievementNotification
          key={achievement.id}
          achievement={achievement}
          isVisible={achievement.visible}
          onClose={() => hideAchievement(achievement.id)}
          position={index % 2 === 0 ? 'top-right' : 'top-center'}
        />
      ))}
    </>
  )
}