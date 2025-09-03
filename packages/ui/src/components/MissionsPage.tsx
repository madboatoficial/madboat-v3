/**
 * 🚀 MISSIONS PAGE - Epic Journeys
 * 
 * Inspired by:
 * - RPG quest systems with meaningful rewards
 * - Multi-step journey tracking
 * - Community validation mechanics
 * - Progressive achievement unlocking
 * 
 * Design Philosophy:
 * - Hero Mission dominates (one epic quest at a time)
 * - Journey visualization (progress as adventure)
 * - Rich rewards preview (what you unlock)
 * - Evidence-based completion
 * 
 * @author Kraken & Mandarin Fish
 */

"use client"

import React, { useState } from 'react'
import { 
  Rocket,
  Trophy,
  Clock,
  Upload,
  CheckCircle2,
  Lock,
  Star,
  Users,
  Image,
  FileText,
  Gift,
  Compass,
  Mountain,
  Waves,
  Target,
  Sparkles,
  ChevronRight,
  Eye
} from 'lucide-react'

// Types
type MissionStatus = 'locked' | 'available' | 'in_progress' | 'review' | 'completed'
type MissionDifficulty = 'epic' | 'legendary' | 'mythic'

interface MissionCheckpoint {
  id: string
  title: string
  description: string
  completed: boolean
  evidence?: string // uploaded file reference
}

interface MissionReward {
  type: 'content' | 'badge' | 'method' | 'feature'
  title: string
  description: string
  icon: React.ReactNode
  value?: string // e.g., "500 XP", "Exclusive Access"
}

interface Mission {
  id: string
  title: string
  epic: string // Epic subtitle
  description: string
  longDescription: string
  status: MissionStatus
  difficulty: MissionDifficulty
  estimatedTime: string // "7 dias", "2 semanas"
  module: 'personas' | 'alma' | 'vortice' | 'odisseia'
  icon: React.ReactNode
  coverImage?: string // URL to mission cover art
  checkpoints: MissionCheckpoint[]
  rewards: MissionReward[]
  completedBy: number // number of users who completed
  currentProgress: number // 0-100
  deadline?: string // optional deadline
  community?: {
    sharing: boolean
    votes: number
    featured: boolean
  }
}

interface MissionsPageProps {
  currentModule: 'personas' | 'alma' | 'vortice' | 'odisseia'
  userName: string
  onMissionStart: (missionId: string) => void
  onMissionSubmit: (missionId: string, checkpointId: string, evidence: File) => void
  onNavigate?: (page: 'dashboard' | 'challenges' | 'missions' | 'achievements') => void
}

export function MissionsPage({
  currentModule,
  userName,
  onMissionStart,
  onMissionSubmit,
  onNavigate
}: MissionsPageProps) {
  
  const [activeMission, setActiveMission] = useState<string>('mission-1')
  const [uploadedFiles, setUploadedFiles] = useState<Map<string, File>>(new Map())
  const [expandedRewards, setExpandedRewards] = useState(false)
  
  // Difficulty colors
  const getDifficultyStyle = (difficulty: MissionDifficulty) => {
    const styles = {
      epic: 'from-purple-600/20 to-purple-700/10 border-purple-500/30 text-purple-400',
      legendary: 'from-orange-600/20 to-orange-700/10 border-orange-500/30 text-orange-400',
      mythic: 'from-red-600/20 to-red-700/10 border-red-500/30 text-red-400'
    }
    return styles[difficulty]
  }

  // Mock missions data
  const missions: Mission[] = [
    {
      id: 'mission-1',
      title: 'Instagram Autêntico',
      epic: 'Jornada de Autenticidade Digital',
      description: 'Transforme seu Instagram em uma expressão verdadeira de quem você é.',
      longDescription: 'Esta missão épica guiará você através de uma transformação completa do seu perfil Instagram, alinhando cada aspecto com sua persona autêntica. Você aprenderá a criar conteúdo que ressoa com sua essência, construir uma comunidade genuína e usar a plataforma como ferramenta de crescimento pessoal.',
      status: 'in_progress',
      difficulty: 'epic',
      estimatedTime: '7 dias',
      module: 'personas',
      icon: <Compass size={24} />,
      checkpoints: [
        {
          id: 'cp-1',
          title: 'Auditoria de Autenticidade',
          description: 'Analise seu perfil atual e identifique gaps',
          completed: true,
          evidence: 'audit-screenshot.png'
        },
        {
          id: 'cp-2',
          title: 'Redesign Visual',
          description: 'Crie uma estética alinhada com sua persona',
          completed: true,
          evidence: 'new-profile.png'
        },
        {
          id: 'cp-3',
          title: 'Primeiro Post Autêntico',
          description: 'Publique conteúdo verdadeiramente seu',
          completed: false
        },
        {
          id: 'cp-4',
          title: 'Engajamento Genuíno',
          description: 'Conecte com 10 perfis alinhados',
          completed: false
        },
        {
          id: 'cp-5',
          title: 'Reflexão e Ajustes',
          description: 'Documente sua transformação',
          completed: false
        }
      ],
      rewards: [
        {
          type: 'content',
          title: 'Guia Avançado de Storytelling',
          description: 'Método exclusivo de narrativa visual',
          icon: <FileText size={16} />,
          value: 'PDF + Videos'
        },
        {
          type: 'badge',
          title: 'Authentic Creator',
          description: 'Badge raro de autenticidade',
          icon: <Star size={16} />,
          value: 'Permanente'
        },
        {
          type: 'method',
          title: 'Acesso ao Método Vórtice',
          description: 'Desbloqueie o próximo mundo',
          icon: <Waves size={16} />,
          value: 'Acesso Total'
        },
        {
          type: 'feature',
          title: 'Analytics Dashboard',
          description: 'Métricas avançadas de crescimento',
          icon: <Target size={16} />,
          value: 'Premium'
        }
      ],
      completedBy: 127,
      currentProgress: 40,
      community: {
        sharing: true,
        votes: 89,
        featured: true
      }
    },
    {
      id: 'mission-2',
      title: 'Legado Digital',
      epic: 'Construa Seu Império Online',
      description: 'Crie uma presença digital que transcende plataformas.',
      longDescription: 'Uma jornada para estabelecer seu legado digital duradouro.',
      status: 'available',
      difficulty: 'legendary',
      estimatedTime: '14 dias',
      module: 'alma',
      icon: <Mountain size={24} />,
      checkpoints: [],
      rewards: [
        {
          type: 'content',
          title: 'Masterclass Legado',
          description: '10 horas de conteúdo exclusivo',
          icon: <Gift size={16} />,
          value: '10h Video'
        }
      ],
      completedBy: 45,
      currentProgress: 0
    },
    {
      id: 'mission-3',
      title: 'Vórtice de Influência',
      epic: 'Domine a Arte da Persuasão',
      description: 'Aprenda a criar movimento e influenciar com propósito.',
      longDescription: 'Missão mítica para mestres digitais.',
      status: 'locked',
      difficulty: 'mythic',
      estimatedTime: '30 dias',
      module: 'vortice',
      icon: <Waves size={24} />,
      checkpoints: [],
      rewards: [],
      completedBy: 12,
      currentProgress: 0
    }
  ]

  const active = missions.find(m => m.id === activeMission)!
  const availableMissions = missions.filter(m => m.status === 'available' || m.status === 'locked')
  
  const handleFileUpload = (checkpointId: string, file: File) => {
    const newMap = new Map(uploadedFiles)
    newMap.set(checkpointId, file)
    setUploadedFiles(newMap)
  }

  const completedCheckpoints = active.checkpoints.filter(cp => cp.completed).length
  const progressPercentage = (completedCheckpoints / active.checkpoints.length) * 100

  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-hidden">
      
      {/* Epic background gradient */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-800/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-blue-800/10 rounded-full blur-3xl" />
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
                <h1 className="text-3xl font-light tracking-wide text-white mb-1">Missões Épicas</h1>
                <p className="text-sm text-zinc-500 font-light">Jornadas transformadoras com recompensas valiosas</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-zinc-950/80 backdrop-blur-sm border border-zinc-800/50 rounded-lg px-4 py-2">
                <span className="text-xs text-zinc-500">Missões Completas</span>
                <div className="text-lg font-light text-white mt-1">3/12</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-8 py-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Hero Mission Card */}
          <div className={`bg-gradient-to-br ${getDifficultyStyle(active.difficulty)} backdrop-blur-sm border rounded-3xl p-8 mb-12 relative overflow-hidden`}>
            
            {/* Difficulty Badge */}
            <div className="absolute top-6 right-6">
              <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900/50 rounded-full border border-zinc-700/50">
                <Sparkles size={12} className={active.difficulty === 'mythic' ? 'text-red-400' : active.difficulty === 'legendary' ? 'text-orange-400' : 'text-purple-400'} />
                <span className="text-xs font-light capitalize">{active.difficulty}</span>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-8">
              
              {/* Left: Mission Info */}
              <div className="col-span-7">
                {/* Icon & Title */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-20 h-20 bg-zinc-900/50 rounded-2xl flex items-center justify-center border border-zinc-700/50">
                    {active.icon}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-light text-white mb-1">{active.title}</h2>
                    <p className="text-sm text-zinc-300 font-light italic">{active.epic}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-zinc-300 leading-relaxed mb-6 font-light">
                  {active.longDescription}
                </p>

                {/* Meta Info */}
                <div className="flex items-center gap-6 mb-8">
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <Clock size={14} />
                    <span>{active.estimatedTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <Users size={14} />
                    <span>{active.completedBy} tripulantes completaram</span>
                  </div>
                  {active.community?.featured && (
                    <div className="flex items-center gap-2 text-xs text-yellow-400">
                      <Star size={14} />
                      <span>Destaque</span>
                    </div>
                  )}
                </div>

                {/* Progress Journey */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-zinc-400 uppercase tracking-wider">Jornada de Progresso</span>
                    <span className="text-xs text-white">{progressPercentage.toFixed(0)}%</span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="relative h-2 bg-zinc-800 rounded-full overflow-hidden mb-4">
                    <div 
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-white to-zinc-300 transition-all duration-700"
                      style={{ width: `${progressPercentage}%` }}
                    />
                    {/* Milestone markers */}
                    {active.checkpoints.map((_, index) => (
                      <div
                        key={index}
                        className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-zinc-700 rounded-full"
                        style={{ left: `${(index / (active.checkpoints.length - 1)) * 100}%` }}
                      />
                    ))}
                  </div>

                  {/* Checkpoints */}
                  <div className="space-y-3">
                    {active.checkpoints.map((checkpoint, index) => (
                      <div key={checkpoint.id} className="flex items-start gap-3">
                        <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          checkpoint.completed 
                            ? 'bg-green-400/20 border-green-400' 
                            : index === completedCheckpoints 
                              ? 'bg-white/20 border-white animate-pulse'
                              : 'bg-zinc-900/50 border-zinc-700'
                        }`}>
                          {checkpoint.completed && (
                            <CheckCircle2 size={12} className="text-green-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className={`text-sm font-light ${checkpoint.completed ? 'text-zinc-400 line-through' : 'text-white'}`}>
                              {checkpoint.title}
                            </h4>
                            {checkpoint.completed && checkpoint.evidence && (
                              <span className="text-[10px] text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">
                                Evidência enviada
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-zinc-500 mt-1">{checkpoint.description}</p>
                          
                          {/* Upload area for current checkpoint */}
                          {!checkpoint.completed && index === completedCheckpoints && (
                            <div className="mt-3 p-3 bg-zinc-900/30 rounded-lg border border-zinc-800/50">
                              <label className="block">
                                <span className="text-xs text-zinc-400 mb-2 block">Upload de Evidência</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) handleFileUpload(checkpoint.id, file)
                                  }}
                                  className="block w-full text-xs text-zinc-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-light file:bg-zinc-800 file:text-zinc-300 hover:file:bg-zinc-700"
                                />
                              </label>
                              {uploadedFiles.has(checkpoint.id) && (
                                <div className="mt-2 flex items-center justify-between">
                                  <span className="text-xs text-green-400">
                                    {uploadedFiles.get(checkpoint.id)?.name}
                                  </span>
                                  <button
                                    onClick={() => onMissionSubmit(active.id, checkpoint.id, uploadedFiles.get(checkpoint.id)!)}
                                    className="text-xs px-3 py-1 bg-white text-zinc-900 rounded-full hover:bg-zinc-100 transition-colors"
                                  >
                                    Enviar
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4">
                  {active.status === 'in_progress' ? (
                    <>
                      <button className="px-6 py-2 bg-white text-zinc-900 rounded-full font-light text-sm hover:bg-zinc-100 transition-colors">
                        Continuar Missão
                      </button>
                      <button className="px-6 py-2 border border-zinc-700 text-zinc-400 rounded-full font-light text-sm hover:bg-zinc-900/50 transition-colors">
                        Pausar
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => onMissionStart(active.id)}
                      className="px-6 py-2 bg-white text-zinc-900 rounded-full font-light text-sm hover:bg-zinc-100 transition-colors flex items-center gap-2"
                    >
                      Iniciar Jornada
                      <Rocket size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Right: Rewards */}
              <div className="col-span-5">
                <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800/50 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm text-zinc-400 uppercase tracking-wider">Recompensas</h3>
                    <button
                      onClick={() => setExpandedRewards(!expandedRewards)}
                      className="text-xs text-zinc-500 hover:text-white transition-colors"
                    >
                      {expandedRewards ? 'Minimizar' : 'Expandir'}
                    </button>
                  </div>

                  <div className="space-y-3">
                    {active.rewards.map((reward, index) => (
                      <div
                        key={index}
                        className={`p-3 bg-zinc-900/50 rounded-xl border border-zinc-800/50 transition-all ${
                          expandedRewards ? '' : index > 1 ? 'hidden' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center flex-shrink-0">
                            {reward.icon}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm text-white font-light mb-1">{reward.title}</h4>
                            <p className="text-xs text-zinc-500 mb-2">{reward.description}</p>
                            <span className="text-xs text-zinc-400 bg-zinc-800/50 px-2 py-0.5 rounded-full">
                              {reward.value}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {!expandedRewards && active.rewards.length > 2 && (
                    <p className="text-xs text-zinc-500 text-center mt-3">
                      +{active.rewards.length - 2} recompensas
                    </p>
                  )}

                  {/* Special Unlock Preview */}
                  <div className="mt-6 p-4 bg-gradient-to-br from-purple-900/20 to-purple-800/10 rounded-xl border border-purple-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Gift size={14} className="text-purple-400" />
                      <span className="text-xs text-purple-400 uppercase tracking-wider">Desbloqueio Especial</span>
                    </div>
                    <p className="text-xs text-zinc-300 font-light">
                      Complete esta missão para acessar conteúdo exclusivo do próximo módulo
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Available Missions Grid */}
          <div>
            <h3 className="text-xs text-zinc-500 uppercase tracking-wider mb-6">Próximas Missões</h3>
            <div className="grid grid-cols-3 gap-6">
              {availableMissions.map((mission) => (
                <button
                  key={mission.id}
                  onClick={() => mission.status === 'available' && setActiveMission(mission.id)}
                  disabled={mission.status === 'locked'}
                  className={`p-6 bg-zinc-900/50 border border-zinc-800/50 rounded-2xl text-left transition-all ${
                    mission.status === 'available' 
                      ? 'hover:bg-zinc-900/70 hover:border-zinc-700 cursor-pointer' 
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center">
                      {mission.status === 'locked' ? (
                        <Lock size={20} className="text-zinc-600" />
                      ) : (
                        mission.icon
                      )}
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full ${getDifficultyStyle(mission.difficulty)}`}>
                      {mission.difficulty}
                    </div>
                  </div>
                  
                  <h3 className="text-base text-white font-light mb-2">{mission.title}</h3>
                  <p className="text-xs text-zinc-500 mb-4 line-clamp-2">{mission.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-zinc-500">
                      <div className="flex items-center gap-1">
                        <Clock size={10} />
                        <span>{mission.estimatedTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users size={10} />
                        <span>{mission.completedBy}</span>
                      </div>
                    </div>
                    {mission.status === 'available' && (
                      <Eye size={14} className="text-zinc-400" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Community Section */}
          <div className="mt-12 p-6 bg-zinc-900/30 rounded-2xl border border-zinc-800/50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Users size={16} className="text-zinc-400" />
                <span className="text-sm text-zinc-400">Comunidade MadBoat</span>
              </div>
              <span className="text-xs text-zinc-500">312 tripulantes online</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-light text-white mb-1">1,247</div>
                <p className="text-xs text-zinc-500">Missões Ativas</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-light text-white mb-1">89</div>
                <p className="text-xs text-zinc-500">Completadas Hoje</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-light text-white mb-1">15</div>
                <p className="text-xs text-zinc-500">Em Destaque</p>
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
          <div className="px-4 py-2 bg-zinc-800 rounded-full">
            <span className="text-xs text-white font-light">Missões</span>
          </div>
          <button 
            onClick={() => onNavigate?.('achievements')}
            className="px-4 py-2 text-xs text-zinc-400 hover:text-white transition-colors font-light"
          >
            Conquistas
          </button>
        </div>
      </div>
    </div>
  )
}