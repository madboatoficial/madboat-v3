/**
 * 🏆 ACHIEVEMENTS PAGE - The Trophy Room
 * 
 * Inspired by:
 * - Museum curation aesthetic
 * - PlayStation trophy system
 * - Steam achievements with rarity
 * - Secret/hidden achievements for discovery
 * 
 * Design Philosophy:
 * - Achievements as art pieces in a gallery
 * - Generous deadspace for premium feel
 * - Progressive revelation of locked content
 * - Categories for different achievement types
 * 
 * @author Kraken & Mandarin Fish
 */

"use client"

import React, { useState } from 'react'
import { 
  Trophy,
  Star,
  Lock,
  Sparkles,
  Award,
  Target,
  Zap,
  Flame,
  Crown,
  Shield,
  Heart,
  Diamond,
  Gem,
  Medal,
  ChevronRight,
  Filter,
  Share2,
  Eye,
  EyeOff,
  TrendingUp,
  Users,
  Calendar,
  BarChart3,
  Percent
} from 'lucide-react'

// Types
type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary' | 'mythic'
type AchievementCategory = 'epic' | 'sequence' | 'collection' | 'secret' | 'special'
type AchievementStatus = 'locked' | 'unlocked' | 'hidden'

interface AchievementProgress {
  current: number
  total: number
  milestones?: number[] // e.g., [5, 10, 25, 50, 100]
}

interface Achievement {
  id: string
  title: string
  description: string
  category: AchievementCategory
  rarity: AchievementRarity
  status: AchievementStatus
  icon: React.ReactNode
  unlockedAt?: string // Date when unlocked
  progress?: AchievementProgress
  points: number
  secret?: boolean
  shareable?: boolean
  percentUnlocked?: number // % of users who have this
}

interface AchievementsPageProps {
  userName: string
  onNavigate?: (page: 'dashboard' | 'challenges' | 'missions' | 'achievements' | 'legacy') => void
  onShareAchievement?: (achievementId: string) => void
}

export function AchievementsPage({
  userName,
  onNavigate,
  onShareAchievement
}: AchievementsPageProps) {
  
  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'all'>('all')
  const [showSecrets, setShowSecrets] = useState(false)
  const [hoveredAchievement, setHoveredAchievement] = useState<string | null>(null)
  
  // Rarity colors and styles
  const getRarityStyle = (rarity: AchievementRarity) => {
    const styles = {
      common: 'from-zinc-600/20 to-zinc-700/10 border-zinc-500/30',
      rare: 'from-blue-600/20 to-blue-700/10 border-blue-500/30',
      epic: 'from-purple-600/20 to-purple-700/10 border-purple-500/30',
      legendary: 'from-orange-600/20 to-orange-700/10 border-orange-500/30',
      mythic: 'from-red-600/20 to-red-700/10 border-red-500/30'
    }
    return styles[rarity]
  }

  const getRarityColor = (rarity: AchievementRarity) => {
    const colors = {
      common: 'text-zinc-400',
      rare: 'text-blue-400',
      epic: 'text-purple-400',
      legendary: 'text-orange-400',
      mythic: 'text-red-400'
    }
    return colors[rarity]
  }

  const getRarityLabel = (rarity: AchievementRarity) => {
    const labels = {
      common: 'Comum',
      rare: 'Raro',
      epic: 'Épico',
      legendary: 'Lendário',
      mythic: 'Mítico'
    }
    return labels[rarity]
  }

  // Mock achievements data
  const achievements: Achievement[] = [
    // Epic Achievements
    {
      id: 'ach-1',
      title: 'Primeiro Passo',
      description: 'Complete sua primeira missão',
      category: 'epic',
      rarity: 'common',
      status: 'unlocked',
      icon: <Trophy size={24} />,
      unlockedAt: '2025-09-01',
      points: 100,
      percentUnlocked: 87.3,
      shareable: true
    },
    {
      id: 'ach-2',
      title: 'Persona Revelada',
      description: 'Descubra sua persona única através do teste',
      category: 'epic',
      rarity: 'rare',
      status: 'unlocked',
      icon: <Star size={24} />,
      unlockedAt: '2025-08-29',
      points: 250,
      percentUnlocked: 45.2,
      shareable: true
    },
    {
      id: 'ach-3',
      title: 'Mestre dos Três Mundos',
      description: 'Complete todos os módulos: ALMA, Vórtice e Odisseia',
      category: 'epic',
      rarity: 'mythic',
      status: 'locked',
      icon: <Crown size={24} />,
      points: 1000,
      percentUnlocked: 0.8
    },
    
    // Sequence Achievements
    {
      id: 'ach-4',
      title: 'Consistência Digital',
      description: 'Entre no sistema por dias consecutivos',
      category: 'sequence',
      rarity: 'rare',
      status: 'unlocked',
      icon: <Flame size={24} />,
      progress: {
        current: 15,
        total: 100,
        milestones: [5, 10, 15, 30, 50, 100]
      },
      points: 500,
      percentUnlocked: 23.1
    },
    {
      id: 'ach-5',
      title: 'Desafiante',
      description: 'Complete desafios consecutivos',
      category: 'sequence',
      rarity: 'epic',
      status: 'unlocked',
      icon: <Target size={24} />,
      progress: {
        current: 8,
        total: 50,
        milestones: [5, 10, 25, 50]
      },
      points: 750,
      percentUnlocked: 12.4
    },
    
    // Collection Achievements
    {
      id: 'ach-6',
      title: 'Colecionador de Personas',
      description: 'Identifique múltiplas personas em seu perfil',
      category: 'collection',
      rarity: 'epic',
      status: 'unlocked',
      icon: <Diamond size={24} />,
      progress: {
        current: 3,
        total: 26,
        milestones: [1, 5, 10, 20, 26]
      },
      points: 600,
      percentUnlocked: 8.7
    },
    {
      id: 'ach-7',
      title: 'Arsenal de Métodos',
      description: 'Desbloqueie todos os métodos disponíveis',
      category: 'collection',
      rarity: 'legendary',
      status: 'locked',
      icon: <Shield size={24} />,
      progress: {
        current: 1,
        total: 4
      },
      points: 800,
      percentUnlocked: 2.1
    },
    
    // Secret Achievements
    {
      id: 'ach-8',
      title: '???',
      description: 'Um segredo aguarda descoberta...',
      category: 'secret',
      rarity: 'legendary',
      status: 'hidden',
      icon: <EyeOff size={24} />,
      points: 500,
      secret: true
    },
    {
      id: 'ach-9',
      title: 'Easter Egg Hunter',
      description: 'Encontrou o easter egg escondido no sistema',
      category: 'secret',
      rarity: 'mythic',
      status: 'unlocked',
      icon: <Gem size={24} />,
      unlockedAt: '2025-09-02',
      points: 1000,
      percentUnlocked: 0.3,
      secret: true,
      shareable: true
    },
    
    // Special Achievements
    {
      id: 'ach-10',
      title: 'Early Adopter',
      description: 'Entre os primeiros 100 usuários do MadBoat',
      category: 'special',
      rarity: 'legendary',
      status: 'unlocked',
      icon: <Medal size={24} />,
      unlockedAt: '2025-08-29',
      points: 750,
      percentUnlocked: 100,
      shareable: true
    }
  ]

  // Filter achievements
  const filteredAchievements = achievements.filter(ach => {
    if (selectedCategory === 'all') return true
    return ach.category === selectedCategory
  })

  // Calculate stats
  const totalAchievements = achievements.length
  const unlockedAchievements = achievements.filter(a => a.status === 'unlocked').length
  const totalPoints = achievements.filter(a => a.status === 'unlocked').reduce((sum, a) => sum + a.points, 0)
  const completionPercentage = (unlockedAchievements / totalAchievements) * 100

  // Category counts
  const categoryCounts = {
    all: achievements.length,
    epic: achievements.filter(a => a.category === 'epic').length,
    sequence: achievements.filter(a => a.category === 'sequence').length,
    collection: achievements.filter(a => a.category === 'collection').length,
    secret: achievements.filter(a => a.category === 'secret').length,
    special: achievements.filter(a => a.category === 'special').length
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-hidden">
      
      {/* Museum-like gradient background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-1/3 w-[600px] h-[600px] bg-purple-900/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-[800px] h-[800px] bg-blue-900/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative z-10 pt-8 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-6">
              <button 
                onClick={() => onNavigate?.('dashboard')}
                className="w-10 h-10 border border-zinc-800 rounded-full flex items-center justify-center hover:bg-zinc-900/50 transition-colors"
              >
                <ChevronRight size={18} className="rotate-180 text-zinc-400" />
              </button>
              <div>
                <h1 className="text-3xl font-light tracking-wide text-white mb-1">Sala de Troféus</h1>
                <p className="text-sm text-zinc-500 font-light">Seu legado em conquistas épicas</p>
              </div>
            </div>
            
            {/* Stats Overview */}
            <div className="flex items-center gap-4">
              <div className="bg-zinc-950/80 backdrop-blur-sm border border-zinc-800/50 rounded-lg px-4 py-2">
                <div className="flex items-center gap-2 mb-1">
                  <Trophy size={14} className="text-yellow-400" />
                  <span className="text-xs text-zinc-500">Desbloqueadas</span>
                </div>
                <div className="text-lg font-light text-white">{unlockedAchievements}/{totalAchievements}</div>
              </div>
              <div className="bg-zinc-950/80 backdrop-blur-sm border border-zinc-800/50 rounded-lg px-4 py-2">
                <div className="flex items-center gap-2 mb-1">
                  <Star size={14} className="text-purple-400" />
                  <span className="text-xs text-zinc-500">Pontos</span>
                </div>
                <div className="text-lg font-light text-white">{totalPoints.toLocaleString()}</div>
              </div>
              <div className="bg-zinc-950/80 backdrop-blur-sm border border-zinc-800/50 rounded-lg px-4 py-2">
                <div className="flex items-center gap-2 mb-1">
                  <Percent size={14} className="text-green-400" />
                  <span className="text-xs text-zinc-500">Completo</span>
                </div>
                <div className="text-lg font-light text-white">{completionPercentage.toFixed(1)}%</div>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full text-xs font-light transition-all ${
                  selectedCategory === 'all' 
                    ? 'bg-white text-zinc-900' 
                    : 'bg-zinc-900/50 text-zinc-400 hover:bg-zinc-900/70'
                }`}
              >
                Todas ({categoryCounts.all})
              </button>
              <button
                onClick={() => setSelectedCategory('epic')}
                className={`px-4 py-2 rounded-full text-xs font-light transition-all ${
                  selectedCategory === 'epic' 
                    ? 'bg-white text-zinc-900' 
                    : 'bg-zinc-900/50 text-zinc-400 hover:bg-zinc-900/70'
                }`}
              >
                Épicas ({categoryCounts.epic})
              </button>
              <button
                onClick={() => setSelectedCategory('sequence')}
                className={`px-4 py-2 rounded-full text-xs font-light transition-all ${
                  selectedCategory === 'sequence' 
                    ? 'bg-white text-zinc-900' 
                    : 'bg-zinc-900/50 text-zinc-400 hover:bg-zinc-900/70'
                }`}
              >
                Sequências ({categoryCounts.sequence})
              </button>
              <button
                onClick={() => setSelectedCategory('collection')}
                className={`px-4 py-2 rounded-full text-xs font-light transition-all ${
                  selectedCategory === 'collection' 
                    ? 'bg-white text-zinc-900' 
                    : 'bg-zinc-900/50 text-zinc-400 hover:bg-zinc-900/70'
                }`}
              >
                Coleções ({categoryCounts.collection})
              </button>
              <button
                onClick={() => setSelectedCategory('secret')}
                className={`px-4 py-2 rounded-full text-xs font-light transition-all ${
                  selectedCategory === 'secret' 
                    ? 'bg-white text-zinc-900' 
                    : 'bg-zinc-900/50 text-zinc-400 hover:bg-zinc-900/70'
                }`}
              >
                Secretas ({categoryCounts.secret})
              </button>
              <button
                onClick={() => setSelectedCategory('special')}
                className={`px-4 py-2 rounded-full text-xs font-light transition-all ${
                  selectedCategory === 'special' 
                    ? 'bg-white text-zinc-900' 
                    : 'bg-zinc-900/50 text-zinc-400 hover:bg-zinc-900/70'
                }`}
              >
                Especiais ({categoryCounts.special})
              </button>
            </div>

            <button
              onClick={() => setShowSecrets(!showSecrets)}
              className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900/50 border border-zinc-800 rounded-full text-xs text-zinc-400 hover:text-white transition-colors"
            >
              {showSecrets ? <Eye size={14} /> : <EyeOff size={14} />}
              {showSecrets ? 'Esconder' : 'Mostrar'} Secretas
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Trophy Gallery */}
      <div className="relative z-10 px-8 pb-24">
        <div className="max-w-7xl mx-auto">
          
          {/* Achievements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAchievements.map((achievement) => {
              const isHidden = achievement.status === 'hidden' && !showSecrets
              const isLocked = achievement.status === 'locked'
              const isUnlocked = achievement.status === 'unlocked'
              
              return (
                <div
                  key={achievement.id}
                  onMouseEnter={() => setHoveredAchievement(achievement.id)}
                  onMouseLeave={() => setHoveredAchievement(null)}
                  className={`relative p-6 rounded-2xl border transition-all duration-300 ${
                    isUnlocked 
                      ? `bg-gradient-to-br ${getRarityStyle(achievement.rarity)} hover:scale-[1.02]`
                      : isHidden
                        ? 'bg-zinc-900/30 border-zinc-800/50 opacity-50'
                        : 'bg-zinc-900/50 border-zinc-800/50 opacity-75'
                  }`}
                >
                  {/* Rarity Indicator */}
                  {isUnlocked && (
                    <div className="absolute top-4 right-4">
                      <div className={`text-xs font-light ${getRarityColor(achievement.rarity)}`}>
                        {getRarityLabel(achievement.rarity)}
                      </div>
                    </div>
                  )}

                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${
                    isUnlocked 
                      ? 'bg-zinc-900/50 border border-zinc-700/50' 
                      : 'bg-zinc-900/30 border border-zinc-800/50'
                  }`}>
                    {isHidden ? (
                      <EyeOff size={24} className="text-zinc-600" />
                    ) : isLocked ? (
                      <Lock size={24} className="text-zinc-600" />
                    ) : (
                      <div className={getRarityColor(achievement.rarity)}>
                        {achievement.icon}
                      </div>
                    )}
                  </div>

                  {/* Title & Description */}
                  <h3 className={`text-base font-light mb-2 ${
                    isUnlocked ? 'text-white' : 'text-zinc-500'
                  }`}>
                    {isHidden ? '???' : achievement.title}
                  </h3>
                  <p className="text-xs text-zinc-500 mb-4 line-clamp-2">
                    {isHidden ? 'Conquista secreta' : achievement.description}
                  </p>

                  {/* Progress Bar (if applicable) */}
                  {achievement.progress && !isHidden && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-zinc-400">Progresso</span>
                        <span className="text-xs text-white">
                          {achievement.progress.current}/{achievement.progress.total}
                        </span>
                      </div>
                      <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-white to-zinc-300 transition-all duration-500"
                          style={{ width: `${(achievement.progress.current / achievement.progress.total) * 100}%` }}
                        />
                      </div>
                      {achievement.progress.milestones && (
                        <div className="flex items-center gap-1 mt-2">
                          {achievement.progress.milestones.map((milestone) => (
                            <div
                              key={milestone}
                              className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                                achievement.progress!.current >= milestone
                                  ? 'bg-green-400/20 text-green-400'
                                  : 'bg-zinc-800 text-zinc-600'
                              }`}
                            >
                              {milestone}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Footer Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Points */}
                      <div className="flex items-center gap-1">
                        <Star size={12} className="text-yellow-400" />
                        <span className="text-xs text-zinc-400">{achievement.points}</span>
                      </div>
                      
                      {/* Rarity Percentage */}
                      {achievement.percentUnlocked !== undefined && !isHidden && (
                        <div className="flex items-center gap-1">
                          <Users size={12} className="text-zinc-500" />
                          <span className="text-xs text-zinc-500">
                            {achievement.percentUnlocked}%
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    {isUnlocked && achievement.shareable && (
                      <button
                        onClick={() => onShareAchievement?.(achievement.id)}
                        className="p-1.5 rounded-lg hover:bg-zinc-800/50 transition-colors"
                      >
                        <Share2 size={14} className="text-zinc-400" />
                      </button>
                    )}
                  </div>

                  {/* Unlock Date */}
                  {isUnlocked && achievement.unlockedAt && (
                    <div className="mt-3 pt-3 border-t border-zinc-800/50">
                      <div className="flex items-center gap-1 text-xs text-zinc-500">
                        <Calendar size={10} />
                        <span>Desbloqueado em {new Date(achievement.unlockedAt).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                  )}

                  {/* Hover Effect for Locked */}
                  {isLocked && hoveredAchievement === achievement.id && (
                    <div className="absolute inset-0 bg-zinc-900/80 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <div className="text-center p-4">
                        <Lock size={24} className="text-zinc-500 mx-auto mb-2" />
                        <p className="text-xs text-zinc-400">Conquista bloqueada</p>
                        <p className="text-xs text-zinc-500 mt-1">Continue sua jornada para desbloquear</p>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Completion Overview */}
          <div className="mt-12 p-8 bg-zinc-900/30 rounded-2xl border border-zinc-800/50">
            <h3 className="text-lg font-light text-white mb-6">Visão Geral do Progresso</h3>
            
            <div className="grid grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-3 relative">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-zinc-800"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - completionPercentage / 100)}`}
                      className="text-white transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-light text-white">
                      {completionPercentage.toFixed(0)}%
                    </span>
                  </div>
                </div>
                <p className="text-xs text-zinc-500">Progresso Total</p>
              </div>

              <div className="text-center">
                <div className="text-3xl font-light text-white mb-2">{unlockedAchievements}</div>
                <p className="text-xs text-zinc-500">Conquistas Desbloqueadas</p>
              </div>

              <div className="text-center">
                <div className="text-3xl font-light text-white mb-2">{totalPoints}</div>
                <p className="text-xs text-zinc-500">Pontos Totais</p>
              </div>

              <div className="text-center">
                <div className="text-3xl font-light text-white mb-2">
                  {achievements.filter(a => a.rarity === 'legendary' || a.rarity === 'mythic').filter(a => a.status === 'unlocked').length}
                </div>
                <p className="text-xs text-zinc-500">Conquistas Raras</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Float */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex items-center gap-2 bg-zinc-950/90 backdrop-blur-xl border border-zinc-800 rounded-full px-2 py-2">
          <button 
            onClick={() => onNavigate?.('challenges')}
            className="px-4 py-2 text-xs text-zinc-400 hover:text-white transition-colors font-light"
          >
            Desafios
          </button>
          <button 
            onClick={() => onNavigate?.('missions')}
            className="px-4 py-2 text-xs text-zinc-400 hover:text-white transition-colors font-light"
          >
            Missões
          </button>
          <div className="px-4 py-2 bg-zinc-800 rounded-full">
            <span className="text-xs text-white font-light">Conquistas</span>
          </div>
          <button 
            onClick={() => onNavigate?.('legacy')}
            className="px-4 py-2 text-xs text-zinc-400 hover:text-white transition-colors font-light"
          >
            Legado
          </button>
        </div>
      </div>
    </div>
  )
}