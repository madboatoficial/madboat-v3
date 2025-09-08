"use client"

import React from 'react'
import { Brain, Star, X } from 'lucide-react'
import { motion } from 'motion/react'

interface SimpleSkillTestProps {
  userName?: string
  onClose?: () => void
}

export function SimpleSkillTest({ userName = "Navigator", onClose }: SimpleSkillTestProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col relative">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-900/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
      </div>

      {/* Header */}
      <div className="relative z-40 bg-slate-900/60 backdrop-blur-sm border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                🌊 Teste do Oceano de Habilidades
              </h1>
              <p className="text-slate-400 text-sm">
                Olá {userName}, vamos testar se está funcionando!
              </p>
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

      {/* Ocean Content */}
      <div className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0 p-8">
          <div className="relative w-full h-full">
            
            {/* Test Island 1 */}
            <motion.div
              className="absolute"
              style={{ left: '20%', top: '30%' }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Island Background */}
              <div className="absolute w-60 h-60 bg-blue-500/20 rounded-full blur-xl -translate-x-1/2 -translate-y-1/2" />
              
              {/* Island Label */}
              <div className="relative text-center -translate-x-1/2 -translate-y-32">
                <h3 className="text-lg font-bold text-white mb-2">
                  🏝️ Ilha de Teste 1
                </h3>
                <p className="text-sm text-slate-300">
                  Primeira ilha para testar
                </p>
              </div>

              {/* Skills */}
              <motion.div
                className="relative w-16 h-16 bg-green-500/80 rounded-full border-2 border-green-400 flex items-center justify-center cursor-pointer -translate-x-1/2 -translate-y-1/2"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Brain className="w-8 h-8 text-white" />
              </motion.div>
            </motion.div>

            {/* Test Island 2 */}
            <motion.div
              className="absolute"
              style={{ left: '60%', top: '50%' }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {/* Island Background */}
              <div className="absolute w-60 h-60 bg-purple-500/20 rounded-full blur-xl -translate-x-1/2 -translate-y-1/2" />
              
              {/* Island Label */}
              <div className="relative text-center -translate-x-1/2 -translate-y-32">
                <h3 className="text-lg font-bold text-white mb-2">
                  🏝️ Ilha de Teste 2
                </h3>
                <p className="text-sm text-slate-300">
                  Segunda ilha para testar
                </p>
              </div>

              {/* Skills */}
              <motion.div
                className="relative w-16 h-16 bg-purple-500/80 rounded-full border-2 border-purple-400 flex items-center justify-center cursor-pointer -translate-x-1/2 -translate-y-1/2"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Star className="w-8 h-8 text-white" />
              </motion.div>
            </motion.div>

            {/* Connection Line */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <motion.line
                x1="20%"
                y1="30%"
                x2="60%"
                y2="50%"
                stroke="#3b82f6"
                strokeWidth="3"
                strokeDasharray="8,4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.6 }}
                transition={{ duration: 1.5, delay: 0.8 }}
              />
            </svg>

          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-40 bg-slate-900/60 backdrop-blur-sm border-t border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-center">
            <p className="text-slate-400 text-sm">
              🧪 Teste simples - Se você vê as ilhas e skills, o sistema está funcionando!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}