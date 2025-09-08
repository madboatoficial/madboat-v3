"use client"

import React from 'react'
import { motion } from 'motion/react'
import { Brain, X, Ship } from 'lucide-react'

interface SkillArchipelagosDebugProps {
  userName?: string
  onClose?: () => void
}

export function SkillArchipelagosDebug({ 
  userName = "Navigator", 
  onClose
}: SkillArchipelagosDebugProps) {
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-300/10 to-blue-400/10" />
      </div>

      {/* Header */}
      <div className="relative z-40 bg-slate-900/60 backdrop-blur-sm border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Ship className="w-8 h-8 text-cyan-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">MadBoat Debug</h1>
                <p className="text-xs text-slate-400">Testing Skill Rendering</p>
              </div>
            </div>
            
            {onClose && (
              <button
                onClick={onClose}
                className="p-3 text-slate-400 hover:text-white transition-colors rounded-xl hover:bg-slate-800/50"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Canvas - Simplified */}
      <div className="flex-1 relative p-8">
        <div className="relative w-full h-full min-h-[600px]">
          
          {/* Test Skills - Fixed positions */}
          <div className="absolute" style={{ left: 200, top: 200 }}>
            <motion.div
              className="w-16 h-16 bg-emerald-500/80 rounded-full border-2 border-emerald-400 
                         flex items-center justify-center cursor-pointer shadow-emerald-400/50 shadow-xl"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.1 }}
            >
              <Brain className="w-8 h-8 text-white" />
            </motion.div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-center">
              <p className="text-sm text-white font-medium">Persona Única</p>
            </div>
          </div>

          <div className="absolute" style={{ left: 400, top: 300 }}>
            <motion.div
              className="w-16 h-16 bg-cyan-500/80 rounded-full border-2 border-cyan-400 
                         flex items-center justify-center cursor-pointer shadow-cyan-400/50 shadow-xl"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.1 }}
            >
              <Brain className="w-8 h-8 text-white" />
            </motion.div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-center">
              <p className="text-sm text-white font-medium">DNA Criativo</p>
            </div>
          </div>

          <div className="absolute" style={{ left: 600, top: 150 }}>
            <motion.div
              className="w-16 h-16 bg-purple-500/80 rounded-full border-2 border-purple-400 
                         flex items-center justify-center cursor-pointer shadow-purple-400/50 shadow-xl"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ scale: 1.1 }}
            >
              <Brain className="w-8 h-8 text-white" />
            </motion.div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-center">
              <p className="text-sm text-white font-medium">Método ALMA</p>
            </div>
          </div>

          {/* Connection Line */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <motion.line
              x1="216"
              y1="216"
              x2="400"
              y2="316"
              stroke="#06b6d4"
              strokeWidth="3"
              strokeDasharray="8,4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.6 }}
              transition={{ duration: 1.5, delay: 0.8 }}
            />
          </svg>

        </div>
      </div>

      {/* Footer */}
      <div className="relative z-40 bg-slate-900/60 backdrop-blur-sm border-t border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-center">
            <p className="text-slate-400 text-sm">
              🧪 Debug: Testing if skills render at fixed positions
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}