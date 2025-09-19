"use client"

import { motion } from 'framer-motion'
import { Compass, Gem, LogOut, Waves } from 'lucide-react'
import { CrewProfile } from '../CrewProfile'
import { useAuth } from '@madboat/auth'
import type { WorldId } from './PersistentLayout'

interface World {
  id: WorldId
  name: string
  component: React.ComponentType
  category: 'journey' | 'treasures' | 'system'
}

// 🐠 Mandarin Fish creation: Persistent sidebar with oceanic navigation
// Instructional design: Always visible navigation that maintains context

interface SidebarProps {
  activeWorld: WorldId
  onWorldChange: (worldId: WorldId) => void
  worlds: World[]
}

// Tab definitions with oceanic themes
const tabs = [
  {
    id: 'jornada' as const,
    name: 'Jornada',
    icon: Compass,
    description: 'Sua jornada de transformação',
    color: 'from-blue-500/20 to-cyan-500/20',
    iconColor: 'text-blue-600',
    borderColor: 'border-blue-200',
    worlds: ['persona', 'alma', 'vortex', 'odisseia'] as WorldId[]
  },
  {
    id: 'tesouros' as const,
    name: 'Tesouros',
    icon: Gem,
    description: 'Suas conquistas e recursos',
    color: 'from-purple-500/20 to-pink-500/20',
    iconColor: 'text-purple-600',
    borderColor: 'border-purple-200',
    worlds: ['treasures'] as WorldId[]
  }
] as const

type TabId = typeof tabs[number]['id']

export function Sidebar({ activeWorld, onWorldChange, worlds }: SidebarProps) {
  const { signOut, user } = useAuth()

  // Determine which tab is active based on current world
  const activeTab: TabId = tabs.find(tab =>
    tab.worlds.includes(activeWorld)
  )?.id || 'jornada'

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleTabChange = (tabId: TabId) => {
    // When switching tabs, go to the first world in that category
    const tab = tabs.find(t => t.id === tabId)
    if (tab && tab.worlds.length > 0) {
      onWorldChange(tab.worlds[0])
    }
  }

  const handleUpgradeClick = () => {
    onWorldChange('upgrade')
  }

  // Get worlds for current tab
  const currentTabWorlds = worlds.filter(world =>
    tabs.find(tab => tab.id === activeTab)?.worlds.includes(world.id)
  )

  return (
    <div className="w-96 bg-white border-r border-black/10 flex flex-col">
      {/* Ocean Wave Background Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <svg
            className="absolute bottom-0 w-full h-32 opacity-[0.015]"
            preserveAspectRatio="none"
            viewBox="0 0 1200 120"
            fill="none"
          >
            <motion.path
              d="M0,60 C300,100 600,20 900,60 C1050,80 1150,40 1200,60 L1200,120 L0,120 Z"
              fill="currentColor"
              className="text-black"
              animate={{
                d: [
                  "M0,60 C300,100 600,20 900,60 C1050,80 1150,40 1200,60 L1200,120 L0,120 Z",
                  "M0,50 C300,80 600,40 900,70 C1050,60 1150,60 1200,50 L1200,120 L0,120 Z",
                  "M0,60 C300,100 600,20 900,60 C1050,80 1150,40 1200,60 L1200,120 L0,120 Z"
                ]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </svg>

          <svg
            className="absolute bottom-4 w-full h-24 opacity-[0.01]"
            preserveAspectRatio="none"
            viewBox="0 0 1200 120"
            fill="none"
          >
            <motion.path
              d="M0,40 C200,80 400,0 600,40 C800,80 1000,0 1200,40 L1200,120 L0,120 Z"
              fill="currentColor"
              className="text-black"
              animate={{
                d: [
                  "M0,40 C200,80 400,0 600,40 C800,80 1000,0 1200,40 L1200,120 L0,120 Z",
                  "M0,20 C200,60 400,20 600,60 C800,40 1000,20 1200,20 L1200,120 L0,120 Z",
                  "M0,40 C200,80 400,0 600,40 C800,80 1000,0 1200,40 L1200,120 L0,120 Z"
                ]
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
            />
          </svg>
        </motion.div>
      </div>

      {/* Sidebar Content */}
      <div className="relative z-10 px-6 py-12 flex flex-col h-full">
        {/* Crew Profile Section */}
        <div className="mb-8">
          <CrewProfile onUpgradeClick={handleUpgradeClick} />
        </div>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            {/* Logo */}
            <motion.h1
              layoutId="madboat-logo"
              className="text-2xl font-medium tracking-[0.08em] text-black"
              style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
              animate={{
                opacity: [0.85, 1, 0.85],
                scale: [0.98, 1, 0.98]
              }}
              transition={{
                opacity: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                scale: { duration: 8, repeat: Infinity, ease: "easeInOut" },
                layout: { duration: 0.8, ease: [0.23, 1, 0.32, 1] }
              }}
            >
              madboat
            </motion.h1>

            {/* User Info & Logout */}
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-xs font-light text-black/60 tracking-wide">
                  {user?.email}
                </p>
              </div>
              <motion.button
                onClick={handleSignOut}
                className="group relative p-2 border border-black/20 hover:border-black/40
                         transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogOut size={14} strokeWidth={1.5} className="text-black/60 group-hover:text-black/80" />
                <motion.div
                  className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100
                           transition-opacity duration-300"
                />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <div className="flex space-x-2 p-1 bg-gray-50/50 rounded-lg backdrop-blur-sm">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id

              return (
                <motion.button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`
                    relative flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-md
                    transition-all duration-300 group
                    ${isActive
                      ? 'bg-white shadow-sm text-gray-900'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                    }
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  layout
                >
                  {/* Tab Background Animation */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabBg"
                      className="absolute inset-0 bg-white rounded-md shadow-sm"
                      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                    />
                  )}

                  {/* Tab Content */}
                  <div className="relative z-10 flex items-center space-x-2">
                    <motion.div
                      animate={{
                        scale: isActive ? 1.1 : 1,
                        rotate: isActive ? 360 : 0
                      }}
                      transition={{
                        duration: 0.5,
                        ease: "easeOut",
                        rotate: { duration: 0.8 }
                      }}
                      className={isActive ? tab.iconColor : 'text-gray-500'}
                    >
                      {(() => {
                        return <Icon size={16} strokeWidth={1.5} />
                      })()}
                    </motion.div>
                    <span className="text-sm font-medium tracking-wide">
                      {tab.name}
                    </span>
                  </div>

                  {/* Ocean Wave Indicator */}
                  {isActive && (
                    <motion.div
                      className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      {(() => {
                        return <Waves size={12} className="text-blue-400 opacity-60" />
                      })()}
                    </motion.div>
                  )}
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* World Navigation */}
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-2">
            {currentTabWorlds.map((world, index) => (
              <motion.button
                key={world.id}
                onClick={() => onWorldChange(world.id)}
                className={`
                  w-full text-left p-3 rounded-lg border transition-all duration-300
                  ${activeWorld === world.id
                    ? 'bg-black/5 border-black/20 text-black'
                    : 'bg-white border-black/10 text-black/70 hover:border-black/20 hover:text-black'
                  }
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <h3 className="text-sm font-medium tracking-wide">
                  {world.name}
                </h3>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}