'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, Zap, TrendingUp, Brain, Target, Award, Activity } from 'lucide-react'

interface AgentXPData {
  name: string
  codename: string
  emoji: string
  level: number
  currentXP: number
  totalXP: number
  xpToNext: number
  specialization: string
  lastActive: string
  eventsToday: number
  currentStreak: number
  recentAchievements: string[]
  status: 'active' | 'idle' | 'offline'
  mood: 'focused' | 'learning' | 'debugging' | 'celebrating' | 'ready' | 'creative' | 'narrative'
}

interface RLVRAgentCardProps {
  agent: AgentXPData
  onViewDetails?: (agentId: string) => void
}

const getMoodColor = (mood: string) => {
  switch (mood) {
    case 'focused': return 'text-blue-400'
    case 'learning': return 'text-green-400'
    case 'debugging': return 'text-orange-400'
    case 'celebrating': return 'text-purple-400'
    case 'ready': return 'text-cyan-400'
    case 'creative': return 'text-pink-400'
    case 'narrative': return 'text-amber-400'
    default: return 'text-gray-400'
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-500'
    case 'idle': return 'bg-yellow-500'
    case 'offline': return 'bg-gray-500'
    default: return 'bg-gray-500'
  }
}

export function RLVRAgentCard({ agent, onViewDetails }: RLVRAgentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const xpProgress = (agent.currentXP / agent.xpToNext) * 100
  const levelTitle = agent.level === 1 ? 'Digital Seedling' :
                    agent.level === 2 ? 'Ocean Apprentice' :
                    agent.level === 3 ? 'Deep Navigator' :
                    agent.level === 4 ? 'Sea Master' :
                    agent.level >= 5 ? 'Ocean Lord' : 'Evolving'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:bg-white/10 transition-all duration-300"
    >
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">{agent.emoji}</div>
            <div>
              <h3 className="text-xl font-bold text-white">{agent.name}</h3>
              <p className="text-sm text-gray-400">{agent.codename}</p>
            </div>
          </div>

          {/* Status & Level */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)}`} />
              <span className="text-xs text-gray-400 capitalize">{agent.status}</span>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              Lv. {agent.level}
            </div>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">{levelTitle}</span>
            <span className="text-sm text-gray-400">{agent.currentXP} / {agent.xpToNext} XP</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Zap className="w-4 h-4 text-yellow-400 mr-1" />
              <span className="text-lg font-bold text-white">{agent.eventsToday}</span>
            </div>
            <span className="text-xs text-gray-400">Today</span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
              <span className="text-lg font-bold text-white">{agent.currentStreak}</span>
            </div>
            <span className="text-xs text-gray-400">Streak</span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Brain className={`w-4 h-4 mr-1 ${getMoodColor(agent.mood)}`} />
              <span className={`text-lg font-bold capitalize ${getMoodColor(agent.mood)}`}>
                {agent.mood}
              </span>
            </div>
            <span className="text-xs text-gray-400">Mood</span>
          </div>
        </div>

        {/* Specialization */}
        <div className="bg-black/20 rounded-lg p-3 mb-4">
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-gray-300">Specialization</span>
          </div>
          <p className="text-white font-medium mt-1">{agent.specialization}</p>
        </div>

        {/* Expand/Collapse Button */}
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between bg-white/5 hover:bg-white/10 rounded-lg p-3 transition-colors"
        >
          <span className="text-sm text-gray-300">
            {isExpanded ? 'Hide Details' : 'Show Details'}
          </span>
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </motion.div>
        </motion.button>
      </div>

      {/* Expanded Details */}
      <motion.div
        initial={false}
        animate={{
          height: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div className="px-6 pb-6 border-t border-white/10">
          <div className="pt-4 space-y-4">
            {/* Recent Achievements */}
            {agent.recentAchievements.length > 0 && (
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Award className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-medium text-gray-300">Recent Achievements</span>
                </div>
                <div className="space-y-1">
                  {agent.recentAchievements.slice(0, 3).map((achievement, index) => (
                    <div key={index} className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-2">
                      <span className="text-xs text-yellow-300">{achievement}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Activity Timeline */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Activity className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-gray-300">Last Activity</span>
              </div>
              <div className="bg-black/20 rounded-lg p-3">
                <p className="text-sm text-gray-300">{agent.lastActive}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <button
                onClick={() => onViewDetails?.(agent.name.toLowerCase())}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
              >
                View Full Details
              </button>
              <button className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                Award XP
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}