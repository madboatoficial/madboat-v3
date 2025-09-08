"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { 
  Brain, Sparkles, Eye, Crown, Zap, Gem, Rocket, 
  CheckCircle, Lock, Star, ArrowRight, X, Ship, Waves
} from 'lucide-react'

interface SkillNode {
  id: string
  title: string
  description: string
  state: 'locked' | 'available' | 'completed'
  icon: React.ComponentType<any>
  unlocks: string[]
}

interface SkillArchipelagosElegantProps {
  userName?: string
  onClose?: () => void
  onSkillClick?: (skill: SkillNode) => void
}

// Dados organizados em progressão linear
const SKILLS_PROGRESSION: SkillNode[] = [
  {
    id: 'persona-discovery',
    title: 'Persona Única',
    description: 'Descoberta da sua identidade única no mercado',
    state: 'completed',
    icon: Brain,
    unlocks: ['authentic-dna']
  },
  {
    id: 'authentic-dna',
    title: 'DNA Criativo',
    description: 'Sua essência criativa única revelada',
    state: 'available',
    icon: Sparkles,
    unlocks: ['alma-authenticity']
  },
  {
    id: 'alma-authenticity',
    title: 'ALMA - Autenticidade',
    description: 'Primeira fase: descoberta do seu eu autêntico',
    state: 'locked',
    icon: Eye,
    unlocks: ['alma-legacy']
  },
  {
    id: 'alma-legacy',
    title: 'ALMA - Legado',
    description: 'Segunda fase: construção do seu legado pessoal',
    state: 'locked',
    icon: Crown,
    unlocks: ['alma-magnetism']
  },
  {
    id: 'alma-magnetism',
    title: 'ALMA - Magnetismo',
    description: 'Terceira fase: desenvolvimento do magnetismo autêntico',
    state: 'locked',
    icon: Zap,
    unlocks: ['alma-abundance']
  },
  {
    id: 'alma-abundance',
    title: 'ALMA - Abundância',
    description: 'Quarta fase: manifestação da abundância autêntica',
    state: 'locked',
    icon: Gem,
    unlocks: ['vortex-method']
  },
  {
    id: 'vortex-method',
    title: 'Método Vórtice',
    description: 'Aceleração exponencial da transformação',
    state: 'locked',
    icon: Rocket,
    unlocks: []
  }
]

export function SkillArchipelagosElegant({ 
  userName = "Navigator", 
  onClose,
  onSkillClick
}: SkillArchipelagosElegantProps) {
  const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(null)
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)

  const getSkillStyles = (state: SkillNode['state']) => {
    switch (state) {
      case 'completed':
        return {
          bg: 'bg-emerald-500/20',
          border: 'border-emerald-400/60',
          icon: 'text-emerald-300',
          text: 'text-emerald-100',
          glow: 'shadow-emerald-400/40',
          ring: 'ring-emerald-400/30'
        }
      case 'available':
        return {
          bg: 'bg-cyan-500/20',
          border: 'border-cyan-400/60',
          icon: 'text-cyan-300',
          text: 'text-cyan-100',
          glow: 'shadow-cyan-400/40',
          ring: 'ring-cyan-400/30'
        }
      default: // locked
        return {
          bg: 'bg-slate-600/20',
          border: 'border-slate-500/40',
          icon: 'text-slate-400',
          text: 'text-slate-500',
          glow: 'shadow-slate-500/20',
          ring: 'ring-slate-500/20'
        }
    }
  }

  const handleSkillClick = (skill: SkillNode) => {
    if (skill.state === 'locked') return
    setSelectedSkill(skill)
    onSkillClick?.(skill)
  }

  const completedCount = SKILLS_PROGRESSION.filter(s => s.state === 'completed').length
  const totalCount = SKILLS_PROGRESSION.length
  const progressPercent = (completedCount / totalCount) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      
      {/* Header */}
      <div className="relative z-40 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Ship className="w-8 h-8 text-cyan-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">Jornada de Transformação</h1>
                <p className="text-slate-400 text-sm">
                  Navegue sua evolução pessoal e profissional
                </p>
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

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-300 font-medium">Progresso da Jornada</span>
              <span className="text-cyan-400 font-bold">{completedCount}/{totalCount}</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-emerald-400 to-cyan-400 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Skills Journey - Linear Flow */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="relative">
          
          {/* Journey Path - Flowing Line */}
          <div className="absolute left-16 top-16 bottom-0 w-0.5 bg-gradient-to-b from-cyan-400/60 via-cyan-400/30 to-transparent"></div>
          
          <div className="space-y-8">
            {SKILLS_PROGRESSION.map((skill, index) => {
              const styles = getSkillStyles(skill.state)
              const Icon = skill.icon
              const isHovered = hoveredSkill === skill.id
              const isLast = index === SKILLS_PROGRESSION.length - 1
              
              return (
                <motion.div
                  key={skill.id}
                  className="relative flex items-center gap-6"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  
                  {/* Skill Node */}
                  <motion.div
                    className={`
                      relative w-16 h-16 rounded-2xl border-2 backdrop-blur-sm
                      flex items-center justify-center cursor-pointer transition-all duration-300
                      ${styles.bg} ${styles.border} ${styles.glow} shadow-xl
                      ${skill.state !== 'locked' ? 'hover:scale-110' : 'cursor-not-allowed'}
                      ${isHovered && skill.state !== 'locked' ? 'ring-4 ' + styles.ring : ''}
                    `}
                    onClick={() => handleSkillClick(skill)}
                    onMouseEnter={() => setHoveredSkill(skill.id)}
                    onMouseLeave={() => setHoveredSkill(null)}
                    whileHover={skill.state !== 'locked' ? { scale: 1.05, y: -2 } : {}}
                    whileTap={skill.state !== 'locked' ? { scale: 0.98 } : {}}
                  >
                    <Icon className={`w-7 h-7 ${styles.icon}`} />
                    
                    {/* State Indicator */}
                    <div className="absolute -top-2 -right-2">
                      {skill.state === 'completed' && (
                        <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      )}
                      {skill.state === 'available' && (
                        <motion.div 
                          className="w-3 h-3 bg-cyan-400 rounded-full"
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                      {skill.state === 'locked' && (
                        <div className="w-5 h-5 bg-slate-600 rounded-full flex items-center justify-center">
                          <Lock className="w-3 h-3 text-slate-400" />
                        </div>
                      )}
                    </div>
                  </motion.div>

                  {/* Skill Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className={`text-lg font-bold ${styles.text}`}>
                        {skill.title}
                      </h3>
                      {skill.state === 'available' && (
                        <motion.div
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Star className="w-5 h-5 text-cyan-400" />
                        </motion.div>
                      )}
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {skill.description}
                    </p>
                    
                    {/* Connection Arrow */}
                    {!isLast && skill.state === 'completed' && (
                      <motion.div 
                        className="flex items-center gap-2 mt-3 text-emerald-400"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        <div className="w-8 h-0.5 bg-gradient-to-r from-emerald-400 to-transparent"></div>
                        <ArrowRight className="w-4 h-4" />
                        <span className="text-xs font-medium">Desbloqueado</span>
                      </motion.div>
                    )}
                  </div>

                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Skill Detail Modal */}
      <AnimatePresence>
        {selectedSkill && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setSelectedSkill(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-2xl p-8 max-w-md w-full"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className={`
                  w-16 h-16 rounded-2xl border-2 flex items-center justify-center
                  ${getSkillStyles(selectedSkill.state).bg} 
                  ${getSkillStyles(selectedSkill.state).border}
                  ${getSkillStyles(selectedSkill.state).glow}
                `}>
                  <selectedSkill.icon className={`w-8 h-8 ${getSkillStyles(selectedSkill.state).icon}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-xl mb-2">{selectedSkill.title}</h3>
                  <p className="text-slate-300 text-sm">{selectedSkill.description}</p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
                <button
                  onClick={() => setSelectedSkill(null)}
                  className="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-white text-sm transition-colors"
                >
                  Fechar
                </button>
                {selectedSkill.state === 'available' && (
                  <button className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-xl text-white text-sm transition-colors">
                    Iniciar
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="relative bg-slate-900/80 backdrop-blur-xl border-t border-slate-700/50 mt-16">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Waves className="w-5 h-5 text-cyan-400" />
              <div>
                <p className="text-white font-medium">Navigator: {userName}</p>
                <p className="text-xs text-slate-400">
                  {progressPercent.toFixed(0)}% da jornada concluída
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <span className="text-slate-300">Concluído</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
                <span className="text-slate-300">Disponível</span>
              </div>
              <div className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-slate-500" />
                <span className="text-slate-300">Bloqueado</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}