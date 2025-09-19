"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Star, Lock, Crown, Shield, Anchor, LogOut } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Badge } from './ui/badge'
import { useAuth } from '@madboat/auth'

// 🐠 Mandarin Fish creation: Crew Profile with oceanic rank progression system
// Instructional design: Progressive disclosure with visual feedback and scaffolding

interface Rank {
  id: string
  name: string
  level: number
  xpRequired: number
  icon: React.ComponentType<any>
  color: string
  bgColor: string
  borderColor: string
  description: string
  unlocked: boolean
}

const ranks: Rank[] = [
  {
    id: 'tripulante',
    name: 'Tripulante',
    level: 1,
    xpRequired: 0,
    icon: Anchor,
    color: 'text-slate-600',
    bgColor: 'bg-slate-100',
    borderColor: 'border-slate-200',
    description: 'Iniciante na jornada oceânica',
    unlocked: true
  },
  {
    id: 'aspirante',
    name: 'Aspirante',
    level: 2,
    xpRequired: 100,
    icon: Star,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    description: 'Primeiro passo rumo à maestria',
    unlocked: true
  },
  {
    id: 'marujo',
    name: 'Marujo',
    level: 3,
    xpRequired: 300,
    icon: Shield,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
    description: 'Navegador experiente dos mares',
    unlocked: false
  },
  {
    id: 'timoneiro',
    name: 'Timoneiro',
    level: 4,
    xpRequired: 600,
    icon: Crown,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    description: 'Guia das correntes digitais',
    unlocked: false
  },
  {
    id: 'capitao',
    name: 'Capitão',
    level: 5,
    xpRequired: 1000,
    icon: Crown,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    description: 'Comandante de sua embarcação',
    unlocked: false
  },
  {
    id: 'almirante',
    name: 'Almirante',
    level: 6,
    xpRequired: 2000,
    icon: Crown,
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    description: 'Mestre supremo dos oceanos digitais',
    unlocked: false
  }
]

interface CrewProfileProps {
  onUpgradeClick?: () => void
  onSignOut?: () => void
  className?: string
}

export function CrewProfile({ onUpgradeClick, onSignOut, className }: CrewProfileProps) {
  const { user } = useAuth()
  const [currentXP] = useState(75) // Mock XP - would come from user data
  const [selectedRank, setSelectedRank] = useState('tripulante')
  const [isRankDropdownOpen, setIsRankDropdownOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  // Calculate current rank based on XP
  const currentRank = ranks.reduce((prev, curr) =>
    currentXP >= curr.xpRequired && curr.unlocked ? curr : prev
  )

  // Calculate XP progress to next rank
  const nextRank = ranks.find(rank => rank.xpRequired > currentXP && rank.level === currentRank.level + 1)
  const xpProgress = nextRank
    ? ((currentXP - currentRank.xpRequired) / (nextRank.xpRequired - currentRank.xpRequired)) * 100
    : 100

  const handleRankSelect = (rankId: string) => {
    const rank = ranks.find(r => r.id === rankId)
    if (rank?.unlocked) {
      setSelectedRank(rankId)
      setIsRankDropdownOpen(false)
    }
  }

  const displayRank = ranks.find(r => r.id === selectedRank) || currentRank

  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
    >
      {/* Artistic Border Frame */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 280 90"
        fill="none"
        preserveAspectRatio="none"
      >
        <rect
          x="1" y="1" width="278" height="88"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-black/15"
        />

        {/* Elegant corner accents */}
        <g className="text-black/20">
          <line x1="0" y1="8" x2="0" y2="0" stroke="currentColor" strokeWidth="2"/>
          <line x1="0" y1="0" x2="8" y2="0" stroke="currentColor" strokeWidth="2"/>
          <line x1="272" y1="0" x2="280" y2="0" stroke="currentColor" strokeWidth="2"/>
          <line x1="280" y1="0" x2="280" y2="8" stroke="currentColor" strokeWidth="2"/>
          <line x1="280" y1="82" x2="280" y2="90" stroke="currentColor" strokeWidth="2"/>
          <line x1="280" y1="90" x2="272" y2="90" stroke="currentColor" strokeWidth="2"/>
          <line x1="8" y1="90" x2="0" y2="90" stroke="currentColor" strokeWidth="2"/>
          <line x1="0" y1="90" x2="0" y2="82" stroke="currentColor" strokeWidth="2"/>
        </g>
      </svg>

      {/* Content */}
      <div
        className="relative z-10 p-3 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          {/* Avatar Section */}
          <motion.div
            className="relative"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className={`p-0.5 rounded-full ${displayRank.borderColor} border bg-gradient-to-br ${displayRank.bgColor}`}>
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.email?.charAt(0).toUpperCase() || 'U')}&background=random`}
                  alt="Crew Avatar"
                />
                <AvatarFallback className={`${displayRank.bgColor} ${displayRank.color} text-lg font-semibold`}>
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Rank Icon Badge */}
            <motion.div
              className={`absolute -bottom-0.5 -right-0.5 ${displayRank.bgColor} ${displayRank.borderColor} border rounded-full p-0.5`}
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 360]
              }}
              transition={{
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 8, repeat: Infinity, ease: "linear" }
              }}
            >
              {(() => {
                const RankIcon = displayRank.icon
                return <RankIcon size={8} className={displayRank.color} />
              })()}
            </motion.div>
          </motion.div>

          {/* Profile Info */}
          <div className="flex-1">
            {/* Name */}
            <h2 className="text-sm font-semibold text-black mb-1 tracking-wide">
              {user?.user_metadata?.full_name ||
               user?.email?.split('@')[0] ||
               'Brave Navigator'}
            </h2>

            {/* XP Bar */}
            <div className="mb-1.5">
              <div className="flex justify-between items-center mb-0.5">
                <span className="text-[10px] text-black/60 tracking-wide">
                  XP: {currentXP} / {nextRank?.xpRequired || currentRank.xpRequired}
                </span>
                <span className="text-[10px] text-black/40">
                  {Math.floor(xpProgress)}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-black/10 rounded-full h-1 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${xpProgress}%` }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                />
              </div>
            </div>

            {/* Rank Selector */}
            <div className="flex items-center space-x-2">
              <div className="relative">
                <motion.button
                  onClick={() => setIsRankDropdownOpen(!isRankDropdownOpen)}
                  className={`
                    flex items-center space-x-1 px-1.5 py-0.5 rounded-md border
                    ${displayRank.borderColor} ${displayRank.bgColor}
                    hover:bg-opacity-80 transition-all duration-300 group
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {(() => {
                    const RankIcon = displayRank.icon
                    return <RankIcon size={8} className={displayRank.color} />
                  })()}
                  <span className={`text-[11px] font-medium ${displayRank.color} tracking-wide`}>
                    {displayRank.name}
                  </span>
                  <motion.div
                    animate={{ rotate: isRankDropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className={displayRank.color}
                  >
                    <ChevronDown size={10} />
                  </motion.div>
                </motion.button>

                {/* Rank Dropdown */}
                <AnimatePresence>
                  {isRankDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full mt-2 left-0 w-64 bg-white border border-black/10 rounded-lg shadow-lg z-50 overflow-hidden"
                    >
                      <div className="p-2">
                        <h4 className="text-xs font-semibold text-black/80 mb-2 px-2">
                          Progressão de Patente
                        </h4>
                        <div className="space-y-1">
                          {ranks.map((rank, index) => {
                            const Icon = rank.icon
                            const isSelected = rank.id === selectedRank
                            const canSelect = rank.unlocked

                            return (
                              <motion.button
                                key={rank.id}
                                onClick={() => handleRankSelect(rank.id)}
                                disabled={!canSelect}
                                className={`
                                  w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left
                                  transition-all duration-200 group
                                  ${canSelect
                                    ? `hover:${rank.bgColor} cursor-pointer`
                                    : 'cursor-not-allowed opacity-50'
                                  }
                                  ${isSelected ? `${rank.bgColor} ${rank.borderColor} border` : ''}
                                `}
                                whileHover={canSelect ? { x: 4 } : {}}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                              >
                                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${rank.bgColor} ${rank.borderColor} border`}>
                                  {canSelect ? (
                                    <Icon size={12} className={rank.color} />
                                  ) : (
                                    <Lock size={12} className="text-black/30" />
                                  )}
                                </div>

                                <div className="flex-1">
                                  <div className="flex items-center space-x-2">
                                    <h5 className={`text-sm font-medium ${canSelect ? 'text-black' : 'text-black/40'}`}>
                                      {rank.name}
                                    </h5>
                                    <Badge
                                      variant="outline"
                                      className={`text-[10px] px-1.5 py-0 ${canSelect ? '' : 'opacity-50'}`}
                                    >
                                      Nível {rank.level}
                                    </Badge>
                                  </div>
                                  <p className={`text-xs ${canSelect ? 'text-black/60' : 'text-black/30'} leading-tight`}>
                                    {rank.description}
                                  </p>
                                  {!canSelect && (
                                    <p className="text-[10px] text-black/40 mt-1">
                                      Requer {rank.xpRequired} XP
                                    </p>
                                  )}
                                </div>
                              </motion.button>
                            )
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Upgrade Button */}
              <motion.button
                onClick={onUpgradeClick}
                className="group relative px-2 py-0.5 border border-black/20 rounded-md
                         hover:border-black/40 transition-all duration-300 overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Animated background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10
                           opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  animate={{
                    x: ['-100%', '100%']
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />

                <span className="relative z-10 text-[10px] font-medium text-black tracking-wide group-hover:text-black/80">
                  Upgrade
                </span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Logout Section */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 pt-1">
              <motion.button
                onClick={(e) => {
                  e.stopPropagation()
                  onSignOut?.()
                }}
                className="w-full flex items-center justify-between px-3 py-2 text-xs text-gray-600 hover:text-black hover:bg-gray-50 transition-colors rounded"
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="font-light tracking-wide">Sair</span>
                <LogOut size={12} strokeWidth={1.5} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ocean Wave Accent */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 1 }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400"
          animate={{
            x: ['-100%', '100%']
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
    </motion.div>
  )
}