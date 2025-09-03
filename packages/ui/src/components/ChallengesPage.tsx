/**
 * 🎯 CHALLENGES PAGE - The Arena
 * 
 * Inspired by:
 * - Baldur's Gate 3: Meaningful achievements without grind
 * - Octalysis Framework: 8 Core Drives of motivation
 * - Trophy.so: Modern achievement systems
 * - D&D Beyond: Clear progression paths
 * 
 * Design Philosophy:
 * - Single Focus: One active challenge dominates
 * - Progressive Disclosure: Future challenges previewed
 * - Generous Deadspace: 60% empty for breathing room
 * - Dynamic Colors: Based on current module
 * 
 * @author Kraken & Mandarin Fish
 */

"use client"

import React, { useState } from 'react'
import { 
  Target,
  Trophy,
  Clock,
  ChevronRight,
  Lock,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  Zap,
  Users,
  Camera,
  FileText,
  Share2
} from 'lucide-react'

// Types
type ChallengeStatus = 'locked' | 'available' | 'in_progress' | 'completed'
type ChallengeDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'master'

interface Challenge {
  id: string
  title: string
  description: string
  module: 'personas' | 'alma' | 'vortice' | 'odisseia'
  status: ChallengeStatus
  difficulty: ChallengeDifficulty
  xpReward: number
  timeEstimate: string // "15 min", "1 hora", etc
  type: 'practical' | 'theoretical' | 'social' | 'creative'
  icon: React.ReactNode
  requirements?: string[]
  deliverables?: string[]
  progress?: number // 0-100
  unlocksNext?: string[] // IDs of challenges that unlock after this
}

interface ChallengesPageProps {
  currentModule: 'personas' | 'alma' | 'vortice' | 'odisseia'
  userName: string
  onChallengeStart: (challengeId: string) => void
  onChallengeSubmit: (challengeId: string, data: any) => void
  onNavigate?: (page: 'dashboard' | 'challenges' | 'missions' | 'achievements') => void
}

export function ChallengesPage({
  currentModule,
  userName,
  onChallengeStart,
  onChallengeSubmit,
  onNavigate
}: ChallengesPageProps) {
  
  const [activeChallenge, setActiveChallenge] = useState<string>('challenge-1')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  
  // Module color mapping
  const getModuleColor = (module: string) => {
    const colors = {
      personas: 'from-purple-500/20 to-purple-600/10 border-purple-500/30',
      alma: 'from-teal-500/20 to-teal-600/10 border-teal-500/30',
      vortice: 'from-purple-800/20 to-purple-900/10 border-purple-700/30',
      odisseia: 'from-red-800/20 to-red-900/10 border-red-700/30'
    }
    return colors[module as keyof typeof colors]
  }

  // Difficulty badge colors
  const getDifficultyColor = (difficulty: ChallengeDifficulty) => {
    const colors = {
      beginner: 'text-green-400 border-green-400/30 bg-green-400/10',
      intermediate: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
      advanced: 'text-orange-400 border-orange-400/30 bg-orange-400/10',
      master: 'text-red-400 border-red-400/30 bg-red-400/10'
    }
    return colors[difficulty]
  }

  // Mock challenges data
  const challenges: Challenge[] = [
    {
      id: 'challenge-1',
      title: 'Descubra Seu Instagram Autêntico',
      description: 'Aplique o método de identificação de persona para criar um perfil Instagram que represente verdadeiramente quem você é.',
      module: 'personas',
      status: 'in_progress',
      difficulty: 'beginner',
      xpReward: 250,
      timeEstimate: '30 min',
      type: 'practical',
      icon: <Camera size={20} />,
      requirements: [
        'Ter completado a identificação de persona',
        'Conta Instagram ativa'
      ],
      deliverables: [
        'Screenshot do perfil atualizado',
        'Descrição de 150 palavras sobre as mudanças'
      ],
      progress: 65,
      unlocksNext: ['challenge-2', 'challenge-3']
    },
    {
      id: 'challenge-2',
      title: 'Primeira Conexão Autêntica',
      description: 'Engage com 5 perfis alinhados com sua persona e inicie conversas significativas.',
      module: 'personas',
      status: 'available',
      difficulty: 'intermediate',
      xpReward: 500,
      timeEstimate: '1 hora',
      type: 'social',
      icon: <Users size={20} />,
      requirements: [
        'Instagram Autêntico configurado',
        'Lista de interesses definida'
      ],
      deliverables: [
        'Screenshots das 5 interações',
        'Reflexão sobre as conexões'
      ],
      progress: 0
    },
    {
      id: 'challenge-3',
      title: 'Manifesto Pessoal',
      description: 'Escreva um manifesto de 500 palavras sobre sua jornada de autenticidade.',
      module: 'alma',
      status: 'locked',
      difficulty: 'advanced',
      xpReward: 750,
      timeEstimate: '2 horas',
      type: 'creative',
      icon: <FileText size={20} />,
      progress: 0
    }
  ]

  const active = challenges.find(c => c.id === activeChallenge)!
  const upcoming = challenges.filter(c => c.status === 'available' || c.status === 'locked').slice(0, 3)

  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-hidden">
      
      {/* Subtle background gradient */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-zinc-800/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative z-10 pt-8 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-6">
              <button 
                onClick={() => onNavigate?.('dashboard')}
                className="w-10 h-10 border border-zinc-800 rounded-full flex items-center justify-center hover:bg-zinc-900/50 transition-colors"
              >
                <ChevronRight size={18} className="rotate-180 text-zinc-400" />
              </button>
              <div>
                <h1 className="text-3xl font-light tracking-wide text-white mb-2">Desafios</h1>
                <p className="text-sm text-zinc-500 font-light">Prove o que você aprendeu e evolua</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-zinc-950/80 backdrop-blur-sm border border-zinc-800/50 rounded-lg px-4 py-2">
                <span className="text-xs text-zinc-500">Desafios Completos</span>
                <div className="text-lg font-light text-white mt-1">12/45</div>
              </div>
              <div className="bg-zinc-950/80 backdrop-blur-sm border border-zinc-800/50 rounded-lg px-4 py-2">
                <span className="text-xs text-zinc-500">XP Total</span>
                <div className="text-lg font-light text-white mt-1">3,450</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area with massive deadspace */}
      <div className="relative z-10 px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-12 gap-8">
            
            {/* Left: Active Challenge (8 cols) */}
            <div className="col-span-8">
              {/* Active Challenge Card - Large and prominent */}
              <div className={`bg-gradient-to-br ${getModuleColor(active.module)} backdrop-blur-sm border rounded-2xl p-8 relative overflow-hidden`}>
                
                {/* Status Badge */}
                <div className="absolute top-6 right-6">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${getDifficultyColor(active.difficulty)}`}>
                    <Zap size={12} />
                    <span className="text-xs font-light capitalize">{active.difficulty}</span>
                  </div>
                </div>

                {/* Challenge Icon */}
                <div className="w-16 h-16 bg-zinc-900/50 rounded-2xl flex items-center justify-center mb-6 border border-zinc-700/50">
                  {active.icon}
                </div>

                {/* Title & Description */}
                <h2 className="text-2xl font-light mb-3 text-white">{active.title}</h2>
                <p className="text-sm text-zinc-300 mb-6 leading-relaxed font-light">
                  {active.description}
                </p>

                {/* Progress Bar (if in progress) */}
                {active.status === 'in_progress' && active.progress !== undefined && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-zinc-400">Progresso</span>
                      <span className="text-xs text-white">{active.progress}%</span>
                    </div>
                    <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-white to-zinc-300 transition-all duration-500"
                        style={{ width: `${active.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Requirements */}
                {active.requirements && (
                  <div className="mb-6">
                    <h3 className="text-xs text-zinc-400 uppercase tracking-wider mb-3">Requisitos</h3>
                    <div className="space-y-2">
                      {active.requirements.map((req, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <CheckCircle2 size={14} className="text-green-400" />
                          <span className="text-sm text-zinc-300 font-light">{req}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Deliverables */}
                {active.deliverables && (
                  <div className="mb-8">
                    <h3 className="text-xs text-zinc-400 uppercase tracking-wider mb-3">Entregáveis</h3>
                    <div className="space-y-2">
                      {active.deliverables.map((del, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full mt-1.5" />
                          <span className="text-sm text-zinc-300 font-light">{del}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Area */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <Clock size={14} />
                      <span>{active.timeEstimate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <Trophy size={14} />
                      <span>{active.xpReward} XP</span>
                    </div>
                  </div>

                  {active.status === 'in_progress' ? (
                    <button
                      onClick={() => onChallengeSubmit(active.id, { file: uploadedFile })}
                      className="flex items-center gap-2 px-6 py-2 bg-white text-zinc-900 rounded-full font-light text-sm hover:bg-zinc-100 transition-colors"
                    >
                      Enviar Desafio
                      <ArrowUpRight size={16} />
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setActiveChallenge(active.id)
                        onChallengeStart(active.id)
                      }}
                      className="flex items-center gap-2 px-6 py-2 border border-white/30 text-white rounded-full font-light text-sm hover:bg-white/10 transition-colors"
                    >
                      Iniciar Desafio
                      <ChevronRight size={16} />
                    </button>
                  )}
                </div>

                {/* Upload Area (if in progress) */}
                {active.status === 'in_progress' && (
                  <div className="mt-6 p-4 bg-zinc-900/30 rounded-xl border border-zinc-800/50">
                    <label className="block">
                      <span className="text-xs text-zinc-400 mb-2 block">Upload de Arquivo</span>
                      <input
                        type="file"
                        onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
                        className="block w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-light file:bg-zinc-800 file:text-zinc-300 hover:file:bg-zinc-700"
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Upcoming Challenges (4 cols) */}
            <div className="col-span-4">
              <h3 className="text-xs text-zinc-500 uppercase tracking-wider mb-4">Próximos Desafios</h3>
              
              <div className="space-y-3">
                {upcoming.map((challenge) => (
                  <button
                    key={challenge.id}
                    onClick={() => challenge.status === 'available' && setActiveChallenge(challenge.id)}
                    disabled={challenge.status === 'locked'}
                    className={`w-full p-4 bg-zinc-900/50 border border-zinc-800/50 rounded-xl text-left transition-all duration-200 ${
                      challenge.status === 'available' 
                        ? 'hover:bg-zinc-900/70 hover:border-zinc-700 cursor-pointer' 
                        : 'opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center">
                        {challenge.status === 'locked' ? (
                          <Lock size={14} className="text-zinc-600" />
                        ) : (
                          <div className="scale-75">{challenge.icon}</div>
                        )}
                      </div>
                      <div className={`text-xs px-2 py-0.5 rounded-full border ${getDifficultyColor(challenge.difficulty)}`}>
                        {challenge.xpReward} XP
                      </div>
                    </div>
                    <h4 className="text-sm text-white font-light mb-1 line-clamp-1">{challenge.title}</h4>
                    <p className="text-xs text-zinc-500 line-clamp-2">{challenge.description}</p>
                  </button>
                ))}
              </div>

              {/* Motivational Section */}
              <div className="mt-8 p-4 bg-gradient-to-br from-zinc-900/50 to-zinc-900/30 rounded-xl border border-zinc-800/50">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={14} className="text-yellow-400" />
                  <span className="text-xs text-zinc-400 uppercase tracking-wider">Dica do Dia</span>
                </div>
                <p className="text-xs text-zinc-300 font-light leading-relaxed">
                  "Cada desafio completado não é apenas XP ganho, mas um passo real em direção à sua maestria digital."
                </p>
              </div>

              {/* Social Proof */}
              <div className="mt-4 p-4 bg-zinc-900/30 rounded-xl border border-zinc-800/50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-zinc-500">Tripulantes Ativos</span>
                  <Share2 size={12} className="text-zinc-600" />
                </div>
                <div className="flex -space-x-2">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="w-6 h-6 bg-zinc-700 rounded-full border border-zinc-950" />
                  ))}
                  <div className="w-6 h-6 bg-zinc-800 rounded-full border border-zinc-950 flex items-center justify-center">
                    <span className="text-[8px] text-zinc-400">+15</span>
                  </div>
                </div>
                <p className="text-[10px] text-zinc-500 mt-2">
                  20 tripulantes completaram desafios hoje
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Float */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex items-center gap-2 bg-zinc-950/90 backdrop-blur-xl border border-zinc-800 rounded-full px-2 py-2">
          <div className="px-4 py-2 bg-zinc-800 rounded-full">
            <span className="text-xs text-white font-light">Desafios</span>
          </div>
          <button className="px-4 py-2 text-xs text-zinc-400 hover:text-white transition-colors font-light">
            Missões
          </button>
          <button className="px-4 py-2 text-xs text-zinc-400 hover:text-white transition-colors font-light">
            Conquistas
          </button>
        </div>
      </div>
    </div>
  )
}