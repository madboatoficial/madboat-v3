"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Star, Lock, CheckCircle } from 'lucide-react'

// 🐠 Mandarin Fish creation: Constellation-style dashboard for MadBoat worlds
// Instructional design: Visual progress representation that guides learning journey

export type UserTier = 'lead' | 'premium' | 'enterprise'
export type World = 'alma' | 'vortice' | 'odisseia'

export interface ConstellationDashboardProps {
  user: {
    id: string
    name: string
    tier: UserTier
    completedWorlds: World[]
    achievements: number
    treasures: number
    hasCompletedPersonaTest: boolean
  }
  onWorldClick: (world: World) => void
  onUpgrade: () => void
  className?: string
}

// World configuration with oceanic themes
const worldConfigs = {
  alma: {
    name: 'ALMA',
    description: 'Método de transformação estruturada',
    color: 'from-blue-500 to-cyan-500',
    icon: '🌊',
    position: { x: 50, y: 20 },
    tier: 'lead' as UserTier
  },
  vortice: {
    name: 'VÓRTICE',
    description: 'Aceleração de resultados',
    color: 'from-purple-500 to-pink-500',
    icon: '🌪️',
    position: { x: 20, y: 60 },
    tier: 'premium' as UserTier
  },
  odisseia: {
    name: 'ODISSEIA',
    description: 'Jornada de maestria completa',
    color: 'from-amber-500 to-orange-500',
    icon: '⚡',
    position: { x: 80, y: 60 },
    tier: 'enterprise' as UserTier
  }
}

// Animated constellation connections
const ConstellationLines: React.FC<{
  completedWorlds: World[]
  accessibleWorlds: World[]
}> = ({ completedWorlds, accessibleWorlds }) => {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none">
      {/* Connection from ALMA to VÓRTICE */}
      <motion.line
        x1="50%"
        y1="20%"
        x2="20%"
        y2="60%"
        stroke="currentColor"
        strokeWidth="1"
        className={`${
          completedWorlds.includes('alma') && accessibleWorlds.includes('vortice')
            ? 'text-purple-300'
            : 'text-gray-200'
        }`}
        initial={{ pathLength: 0 }}
        animate={{
          pathLength: completedWorlds.includes('alma') ? 1 : 0,
          opacity: completedWorlds.includes('alma') ? 0.6 : 0.2
        }}
        transition={{ duration: 1, delay: 0.5 }}
      />

      {/* Connection from ALMA to ODISSEIA */}
      <motion.line
        x1="50%"
        y1="20%"
        x2="80%"
        y2="60%"
        stroke="currentColor"
        strokeWidth="1"
        className={`${
          completedWorlds.includes('alma') && accessibleWorlds.includes('odisseia')
            ? 'text-amber-300'
            : 'text-gray-200'
        }`}
        initial={{ pathLength: 0 }}
        animate={{
          pathLength: completedWorlds.includes('alma') ? 1 : 0,
          opacity: completedWorlds.includes('alma') ? 0.6 : 0.2
        }}
        transition={{ duration: 1, delay: 1 }}
      />

      {/* Connection between VÓRTICE and ODISSEIA */}
      <motion.line
        x1="20%"
        y1="60%"
        x2="80%"
        y2="60%"
        stroke="currentColor"
        strokeWidth="1"
        className={`${
          completedWorlds.includes('vortice') && completedWorlds.includes('alma')
            ? 'text-gray-300'
            : 'text-gray-200'
        }`}
        initial={{ pathLength: 0 }}
        animate={{
          pathLength: completedWorlds.includes('vortice') ? 1 : 0,
          opacity: completedWorlds.includes('vortice') ? 0.4 : 0.1
        }}
        transition={{ duration: 1, delay: 1.5 }}
      />
    </svg>
  )
}

// Individual world star component
const WorldStar: React.FC<{
  world: World
  isAccessible: boolean
  isCompleted: boolean
  onClick: () => void
}> = ({ world, isAccessible, isCompleted, onClick }) => {
  const config = worldConfigs[world]

  const getStatusIcon = () => {
    if (isCompleted) return <CheckCircle size={16} className="text-green-400" />
    if (!isAccessible) return <Lock size={16} className="text-gray-400" />
    return <Star size={16} className="text-white" />
  }

  const getStatusColor = () => {
    if (isCompleted) return 'from-green-400 to-emerald-500'
    if (!isAccessible) return 'from-gray-300 to-gray-400'
    return config.color
  }

  return (
    <motion.button
      onClick={onClick}
      disabled={!isAccessible}
      className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
      style={{
        left: `${config.position.x}%`,
        top: `${config.position.y}%`
      }}
      whileHover={isAccessible ? { scale: 1.1 } : {}}
      whileTap={isAccessible ? { scale: 0.95 } : {}}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: Object.keys(worldConfigs).indexOf(world) * 0.2 }}
    >
      {/* Glow effect for accessible worlds */}
      {isAccessible && !isCompleted && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `linear-gradient(135deg, ${config.color.split(' ')[1]}, ${config.color.split(' ')[3]})`,
            filter: 'blur(8px)',
            opacity: 0.3
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}

      {/* World star */}
      <div className={`
        relative w-16 h-16 rounded-full bg-gradient-to-br ${getStatusColor()}
        border-2 border-white shadow-lg flex items-center justify-center
        ${isAccessible && !isCompleted ? 'hover:shadow-xl' : ''}
        ${!isAccessible ? 'opacity-50' : ''}
      `}>
        <div className="text-xl">{config.icon}</div>
        <div className="absolute -bottom-1 -right-1">
          {getStatusIcon()}
        </div>
      </div>

      {/* World name tooltip */}
      <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
          <div className="font-medium">{config.name}</div>
          <div className="text-gray-300">{config.description}</div>
        </div>
      </div>
    </motion.button>
  )
}

export const ConstellationDashboard: React.FC<ConstellationDashboardProps> = ({
  user,
  onWorldClick,
  onUpgrade,
  className = ""
}) => {
  // Determine which worlds are accessible based on user tier
  const getAccessibleWorlds = (): World[] => {
    switch (user.tier) {
      case 'lead':
        return ['alma']
      case 'premium':
        return ['alma', 'vortice']
      case 'enterprise':
        return ['alma', 'vortice', 'odisseia']
      default:
        return []
    }
  }

  const accessibleWorlds = getAccessibleWorlds()

  return (
    <div className={`relative w-full h-96 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 rounded-xl overflow-hidden ${className}`}>
      {/* Starfield background */}
      <div className="absolute inset-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      {/* Constellation connections */}
      <ConstellationLines
        completedWorlds={user.completedWorlds}
        accessibleWorlds={accessibleWorlds}
      />

      {/* World stars */}
      {(Object.keys(worldConfigs) as World[]).map((world) => (
        <WorldStar
          key={world}
          world={world}
          isAccessible={accessibleWorlds.includes(world)}
          isCompleted={user.completedWorlds.includes(world)}
          onClick={() => onWorldClick(world)}
        />
      ))}

      {/* Progress indicator */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white text-sm font-medium">
              Progresso da Jornada
            </span>
            <span className="text-white text-sm">
              {user.completedWorlds.length} / {accessibleWorlds.length}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: `${(user.completedWorlds.length / accessibleWorlds.length) * 100}%`
              }}
              transition={{ duration: 1, delay: 1 }}
            />
          </div>
        </div>
      </div>

      {/* Upgrade prompt for locked worlds */}
      {accessibleWorlds.length < 3 && (
        <div className="absolute top-4 right-4">
          <motion.button
            onClick={onUpgrade}
            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-amber-600 hover:to-orange-600 transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 }}
          >
            🚀 Desbloquear Mundos
          </motion.button>
        </div>
      )}
    </div>
  )
}

export default ConstellationDashboard