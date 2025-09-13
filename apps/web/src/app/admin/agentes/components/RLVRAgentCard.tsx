'use client'

import { motion } from 'framer-motion'
import { useRLVRAgent } from '@madboat/rlvr/integration/useRLVRAgent'
import { supabase } from '@madboat/auth'

interface Agent {
  id: string
  name: string
  emoji: string
  role: string
  specialization: string
  mood: 'focused' | 'learning' | 'debugging' | 'celebrating' | 'ready' | 'creative' | 'narrative' | 'vigilant'
}

interface RLVRAgentCardProps {
  agent: Agent
}

const moodColors = {
  focused: 'border-blue-500 bg-blue-50',
  learning: 'border-yellow-500 bg-yellow-50',
  debugging: 'border-red-500 bg-red-50',
  celebrating: 'border-green-500 bg-green-50',
  ready: 'border-gray-500 bg-gray-50',
  creative: 'border-purple-500 bg-purple-50',
  narrative: 'border-indigo-500 bg-indigo-50',
  vigilant: 'border-orange-500 bg-orange-50'
}

const moodIcons = {
  focused: '🎯',
  learning: '🧠',
  debugging: '🔍',
  celebrating: '🎉',
  ready: '⚡',
  creative: '🎨',
  narrative: '📝',
  vigilant: '👁️'
}

export function RLVRAgentCard({ agent }: RLVRAgentCardProps) {
  const { metrics, loading, trackAction } = useRLVRAgent(agent.id, {
    supabase,
    autoRefresh: true,
    refreshInterval: 10000,
  })

  const simulateAction = async () => {
    await trackAction({
      task: `${agent.name} test action`,
      input: { test: true },
      output: { result: 'success' },
      success: true,
      metrics: {
        executionTime: Math.random() * 1000,
        memoryUsage: Math.random() * 100,
        complexityScore: Math.random()
      }
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative rounded-xl border-2 p-6 transition-all duration-300 hover:shadow-lg ${
        moodColors[agent.mood]
      }`}
    >
      {/* Agent Header */}
      <div className="flex items-center gap-4 mb-4">
        <div className="text-4xl">{agent.emoji}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold text-gray-800">{agent.name}</h3>
            <span className="text-lg">{moodIcons[agent.mood]}</span>
          </div>
          <p className="text-sm text-gray-600">{agent.role}</p>
          <p className="text-xs text-gray-500">{agent.specialization}</p>
        </div>

        {/* Real-time Status */}
        <div className="text-right">
          <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
            metrics ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {loading ? 'Loading...' : metrics ? 'RLVR Active' : 'Offline'}
          </div>
        </div>
      </div>

      {/* RLVR Metrics */}
      {metrics && !loading && (
        <div className="space-y-4">
          {/* Performance Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-3">
              <div className="text-xs text-gray-500 uppercase tracking-wide">Success Rate</div>
              <div className="text-2xl font-bold text-green-600">
                {(metrics.successRate * 100).toFixed(1)}%
              </div>
            </div>

            <div className="bg-white rounded-lg p-3">
              <div className="text-xs text-gray-500 uppercase tracking-wide">Avg Score</div>
              <div className="text-2xl font-bold text-blue-600">
                {metrics.averageScore.toFixed(2)}
              </div>
            </div>

            <div className="bg-white rounded-lg p-3">
              <div className="text-xs text-gray-500 uppercase tracking-wide">Total Actions</div>
              <div className="text-2xl font-bold text-purple-600">
                {metrics.totalActions}
              </div>
            </div>

            <div className="bg-white rounded-lg p-3">
              <div className="text-xs text-gray-500 uppercase tracking-wide">Patterns</div>
              <div className="text-2xl font-bold text-orange-600">
                {metrics.learnedPatterns.length}
              </div>
            </div>
          </div>

          {/* Performance Trend */}
          {metrics.recentPerformance.length > 0 && (
            <div className="bg-white rounded-lg p-3">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                Recent Performance
              </div>
              <div className="flex items-end gap-1 h-8">
                {metrics.recentPerformance.slice(-10).map((score, index) => (
                  <div
                    key={index}
                    className="bg-blue-500 rounded-t"
                    style={{
                      height: `${score * 100}%`,
                      width: '8px',
                      minHeight: '2px'
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Learned Patterns */}
          {metrics.learnedPatterns.length > 0 && (
            <div className="bg-white rounded-lg p-3">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                Latest Patterns
              </div>
              <div className="space-y-1">
                {metrics.learnedPatterns.slice(0, 3).map((pattern, index) => (
                  <div key={index} className="text-xs bg-gray-100 rounded px-2 py-1">
                    {pattern}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Test Action Button */}
          <button
            onClick={simulateAction}
            className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
          >
            Simulate Action
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
        </div>
      )}
    </motion.div>
  )
}