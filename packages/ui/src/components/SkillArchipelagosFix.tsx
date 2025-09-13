"use client"

import React, { useState } from 'react'
import { motion } from 'motion/react'
import { Brain, Star, X, Ship, Sparkles, Crown, Eye, Zap, Gem, Rocket } from 'lucide-react'

interface SkillArchipelagosFixProps {
  userName?: string
  onClose?: () => void
}

// Dados simplificados para teste
const SKILLS_DATA = [
  {
    id: 'persona-discovery',
    title: 'Persona Única',
    position: { x: 200, y: 300 },
    state: 'completed',
    icon: Brain,
    color: 'emerald'
  },
  {
    id: 'authentic-dna',
    title: 'DNA Criativo',
    position: { x: 400, y: 200 },
    state: 'available',
    icon: Sparkles,
    color: 'cyan'
  },
  {
    id: 'alma-authenticity',
    title: 'ALMA - Autenticidade',
    position: { x: 600, y: 350 },
    state: 'revealed',
    icon: Eye,
    color: 'amber'
  },
  {
    id: 'vortex-method',
    title: 'Método Vórtice',
    position: { x: 800, y: 250 },
    state: 'locked',
    icon: Rocket,
    color: 'slate'
  }
]

export function SkillArchipelagosFix({ 
  userName = "Navigator", 
  onClose
}: SkillArchipelagosFixProps) {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)

  const getColorClasses = (color: string, state: string) => {
    const colors = {
      emerald: {
        bg: 'bg-emerald-500/80',
        border: 'border-emerald-400',
        shadow: 'shadow-emerald-400/50'
      },
      cyan: {
        bg: 'bg-cyan-500/80', 
        border: 'border-cyan-400',
        shadow: 'shadow-cyan-400/50'
      },
      amber: {
        bg: 'bg-amber-500/80',
        border: 'border-amber-400', 
        shadow: 'shadow-amber-400/50'
      },
      slate: {
        bg: 'bg-slate-600/60',
        border: 'border-slate-500',
        shadow: 'shadow-slate-500/30'
      }
    }
    return colors[color as keyof typeof colors] || colors.slate
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-300/10 to-blue-400/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-900/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative z-40 bg-slate-900/60 backdrop-blur-sm border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Ship className="w-8 h-8 text-cyan-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">MadBoat</h1>
                <p className="text-xs text-slate-400">Skill Archipelagos - Fixed</p>
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

      {/* Main Canvas - FIXED VERSION */}
      <div className="flex-1 relative">
        <div className="absolute inset-0 p-8">
          <div className="relative w-full h-full min-h-[600px]">
            
            {SKILLS_DATA.map((skill) => {
              const colorClasses = getColorClasses(skill.color, skill.state)
              const Icon = skill.icon
              const isHovered = hoveredSkill === skill.id
              
              return (
                <div key={skill.id}>
                  
                  {/* Skill Bubble - Fixed positioning */}
                  <motion.div
                    className="absolute z-10"
                    style={{
                      left: skill.position.x,
                      top: skill.position.y,
                      width: 80,
                      height: 80
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    onMouseEnter={() => setHoveredSkill(skill.id)}
                    onMouseLeave={() => setHoveredSkill(null)}
                  >
                    <div 
                      className={`
                        w-full h-full rounded-full border-2 flex items-center justify-center 
                        cursor-pointer transition-all duration-300 backdrop-blur-sm
                        ${colorClasses.bg} ${colorClasses.border} ${colorClasses.shadow} shadow-xl
                        ${isHovered ? 'scale-110 -translate-y-2' : ''}
                      `}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    
                    {/* Label */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-center">
                      <p className="text-sm text-white font-medium whitespace-nowrap">
                        {skill.title}
                      </p>
                      <p className="text-xs text-slate-400 capitalize">
                        {skill.state}
                      </p>
                    </div>
                  </motion.div>
                </div>
              )
            })}

            {/* Connection Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-5">
              <motion.line
                x1="280"
                y1="340"
                x2="400"
                y2="240"
                stroke="#06b6d4"
                strokeWidth="3"
                strokeDasharray="8,4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.6 }}
                transition={{ duration: 1.5, delay: 0.8 }}
              />
              <motion.line
                x1="480"
                y1="240"
                x2="600"
                y2="390"
                stroke="#06b6d4"
                strokeWidth="3"
                strokeDasharray="8,4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.6 }}
                transition={{ duration: 1.5, delay: 1.2 }}
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
              🧪 Versão Fixa - Navigator: {userName} - Skills deveriam aparecer agora!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}