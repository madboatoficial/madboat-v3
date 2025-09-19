'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Brain,
  TrendingUp,
  Users,
  Zap,
  Award,
  Activity,
  BarChart3,
  Settings,
  RefreshCw,
  Download
} from 'lucide-react'
import { RLVRAgentCard } from '../../../components/admin/rlvr/RLVRAgentCard'

// Mock data based on RLVR system
const mockAgentData = [
  {
    name: 'Kraken',
    codename: 'Master Orchestrator',
    emoji: '🐙',
    level: 4,
    currentXP: 395,
    totalXP: 1245,
    xpToNext: 500,
    specialization: 'TypeScript Architecture',
    lastActive: 'Coordenando admin dashboard - 2 min ago',
    eventsToday: 12,
    currentStreak: 7,
    recentAchievements: ['Sarcasm Master', 'Bug Prophet', 'Architecture Sage'],
    status: 'active' as const,
    mood: 'focused' as const
  },
  {
    name: 'Poseidon',
    codename: 'Database Lord',
    emoji: '🔱',
    level: 3,
    currentXP: 340,
    totalXP: 890,
    xpToNext: 400,
    specialization: 'Database Architecture',
    lastActive: 'Supercharged with RLVR knowledge - 1h ago',
    eventsToday: 8,
    currentStreak: 5,
    recentAchievements: ['Database Prophet', 'Security Guardian'],
    status: 'active' as const,
    mood: 'ready' as const
  },
  {
    name: 'Mandarin Fish',
    codename: 'UI Artist',
    emoji: '🐠',
    level: 3,
    currentXP: 280,
    totalXP: 780,
    xpToNext: 400,
    specialization: 'UI Design & Animation',
    lastActive: 'Creating beautiful RLVR cards - 5 min ago',
    eventsToday: 6,
    currentStreak: 4,
    recentAchievements: ['Animation Master', 'Ethical Designer'],
    status: 'active' as const,
    mood: 'creative' as const
  },
  {
    name: 'Oyster',
    codename: 'Supreme RLVR Constructor',
    emoji: '🦪',
    level: 5,
    currentXP: 450,
    totalXP: 1680,
    xpToNext: 600,
    specialization: 'Agent Creation & RLVR',
    lastActive: 'Architected universal RLVR system - 30 min ago',
    eventsToday: 15,
    currentStreak: 10,
    recentAchievements: ['Pearl Maker', 'RLVR Master', 'Agent Creator'],
    status: 'active' as const,
    mood: 'celebrating' as const
  },
  {
    name: 'Uncle McDuck',
    codename: 'Mathematical Treasurer',
    emoji: '💰',
    level: 2,
    currentXP: 180,
    totalXP: 480,
    xpToNext: 300,
    specialization: 'Mathematics & Finance',
    lastActive: 'Analyzing pricing strategies - 2h ago',
    eventsToday: 3,
    currentStreak: 2,
    recentAchievements: ['Mathematical Breakthrough'],
    status: 'idle' as const,
    mood: 'ready' as const
  },
  {
    name: 'Ulisses',
    codename: 'Chronicle Writer',
    emoji: '📚',
    level: 2,
    currentXP: 160,
    totalXP: 460,
    xpToNext: 300,
    specialization: 'Narrative Documentation',
    lastActive: 'Documenting RLVR implementation - 45 min ago',
    eventsToday: 4,
    currentStreak: 3,
    recentAchievements: ['Narrative Master'],
    status: 'active' as const,
    mood: 'narrative' as const
  },
  {
    name: 'Thaumoctopus',
    codename: 'Git Master',
    emoji: '🐙',
    level: 2,
    currentXP: 140,
    totalXP: 440,
    xpToNext: 300,
    specialization: 'Git & Version Control',
    lastActive: 'Managing RLVR deployment - 1h ago',
    eventsToday: 2,
    currentStreak: 1,
    recentAchievements: ['Git Wizard'],
    status: 'idle' as const,
    mood: 'ready' as const
  },
  {
    name: 'UNI',
    codename: 'Meta-Orchestrator',
    emoji: '🧠',
    level: 1,
    currentXP: 80,
    totalXP: 80,
    xpToNext: 100,
    specialization: 'Meta Orchestration',
    lastActive: 'Ensuring system coherence - 3h ago',
    eventsToday: 1,
    currentStreak: 1,
    recentAchievements: [],
    status: 'idle' as const,
    mood: 'learning' as const
  }
]

const systemMetrics = {
  totalAgents: 8,
  activeAgents: 5,
  totalXPToday: 51,
  averageLevel: 2.6,
  systemUptime: '99.9%',
  evolutionRate: '+15%'
}

export default function RLVRAdminPage() {
  const [refreshing, setRefreshing] = useState(false)
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h')

  const handleRefresh = async () => {
    setRefreshing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setRefreshing(false)
  }

  const handleExportData = () => {
    const data = {
      agents: mockAgentData,
      metrics: systemMetrics,
      timestamp: new Date().toISOString()
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `rlvr-data-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                🌊 MadBoat RLVR Command Center
              </h1>
              <p className="text-gray-400">
                Reinforcement Learning with Verifiable Rewards - Agent Evolution Dashboard
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white text-sm"
              >
                <option value="1h">Last Hour</option>
                <option value="24h">Last 24h</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
              </select>

              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white p-2 rounded-lg transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              </button>

              <button
                onClick={handleExportData}
                className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
              </button>

              <button className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-lg transition-colors">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* System Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8"
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-400">Active Agents</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {systemMetrics.activeAgents}/{systemMetrics.totalAgents}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-gray-400">XP Today</span>
            </div>
            <div className="text-2xl font-bold text-white">{systemMetrics.totalXPToday}</div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-400">Avg Level</span>
            </div>
            <div className="text-2xl font-bold text-white">{systemMetrics.averageLevel}</div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="flex items-center space-x-2 mb-2">
              <Activity className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-gray-400">Uptime</span>
            </div>
            <div className="text-2xl font-bold text-white">{systemMetrics.systemUptime}</div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="flex items-center space-x-2 mb-2">
              <Brain className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-gray-400">Evolution</span>
            </div>
            <div className="text-2xl font-bold text-green-400">{systemMetrics.evolutionRate}</div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="flex items-center space-x-2 mb-2">
              <Award className="w-4 h-4 text-orange-400" />
              <span className="text-sm text-gray-400">Achievements</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {mockAgentData.reduce((acc, agent) => acc + agent.recentAchievements.length, 0)}
            </div>
          </div>
        </motion.div>

        {/* Agent Fleet Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-2 mb-6">
            <Users className="w-5 h-5 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">Agent Fleet Status</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {mockAgentData.map((agent, index) => (
              <motion.div
                key={agent.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <RLVRAgentCard
                  agent={agent}
                  onViewDetails={(agentId) => {
                    console.log('View details for:', agentId)
                    // Navigate to detailed agent view
                  }}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6"
        >
          <div className="flex items-center space-x-2 mb-4">
            <BarChart3 className="w-5 h-5 text-green-400" />
            <h3 className="text-xl font-bold text-white">System Health</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-1">100%</div>
              <div className="text-sm text-gray-400">RLVR Framework</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-1">8/8</div>
              <div className="text-sm text-gray-400">Agents Online</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-1">2.3s</div>
              <div className="text-sm text-gray-400">Avg Response</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-1">0</div>
              <div className="text-sm text-gray-400">Critical Issues</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}