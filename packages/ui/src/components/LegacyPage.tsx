/**
 * 👑 LEGACY PAGE - Your Digital Legacy Dashboard
 * 
 * Inspired by:
 * - Executive dashboards with premium aesthetics
 * - Data visualization best practices
 * - Personal brand legacy tracking
 * - Timeline-based life progress
 * 
 * Design Philosophy:
 * - Your digital footprint as measurable legacy
 * - Big numbers that matter, not vanity metrics
 * - Journey visualization over time
 * - Predictions and future milestones
 * 
 * @author Kraken & Mandarin Fish
 */

"use client"

import React, { useState, useTransition, Suspense, useMemo, useCallback } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'motion/react'
import { 
  TrendingUp,
  Calendar,
  Users,
  Award,
  Target,
  Zap,
  Crown,
  BarChart3,
  PieChart,
  Activity,
  Globe,
  Star,
  Flame,
  ChevronRight,
  Clock,
  ArrowUpRight,
  MapPin,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Coffee,
  Lightbulb,
  Rocket,
  Sparkles,
  BookOpen,
  PenTool,
  Smile,
  Brain,
  TrendingUp as TrendingUpIcon,
  Loader2
} from 'lucide-react'

// Types
interface LegacyMetric {
  id: string
  label: string
  value: number | string
  change?: number // percentage change
  icon: React.ReactNode
  color: string
  description: string
  trend: 'up' | 'down' | 'stable'
}

interface TimelineEvent {
  id: string
  date: string
  title: string
  description: string
  type: 'milestone' | 'achievement' | 'breakthrough' | 'launch' | 'story' | 'diary' | 'skill'
  icon: React.ReactNode
  color: string
  metrics?: {
    before: number
    after: number
    unit: string
  }
  story?: {
    content: string
    emotions?: string[]
    lessons?: string[]
  }
  diaryEntry?: {
    content: string
    mood: 'excited' | 'focused' | 'challenged' | 'accomplished' | 'reflective'
    tags?: string[]
  }
  skill?: {
    name: string
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
    evidence?: string
  }
}

interface Prediction {
  id: string
  title: string
  description: string
  targetDate: string
  probability: number
  icon: React.ReactNode
  impact: 'low' | 'medium' | 'high'
}

interface LegacyPageProps {
  userName: string
  onNavigate?: (page: 'dashboard' | 'challenges' | 'missions' | 'achievements' | 'legacy') => void
}

// Custom hook for optimized timeline state
const useTimelineState = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<'7d' | '30d' | '90d' | '1y' | 'all'>('30d')
  const [activeTab, setActiveTab] = useState<'timeline' | 'overview' | 'predictions'>('timeline')
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set())
  const [isPending, startTransition] = useTransition()

  const toggleEventExpansion = useCallback((eventId: string) => {
    startTransition(() => {
      setExpandedEvents(prev => {
        const newSet = new Set(prev)
        if (newSet.has(eventId)) {
          newSet.delete(eventId)
        } else {
          newSet.add(eventId)
        }
        return newSet
      })
    })
  }, [])

  const setActiveTabWithTransition = useCallback((tab: 'timeline' | 'overview' | 'predictions') => {
    startTransition(() => {
      setActiveTab(tab)
    })
  }, [])

  return {
    selectedTimeRange,
    setSelectedTimeRange,
    activeTab,
    setActiveTab: setActiveTabWithTransition,
    expandedEvents,
    toggleEventExpansion,
    isPending
  }
}

// Suspense fallback component
const TimelineLoader = () => (
  <div className="min-h-[400px] flex items-center justify-center">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      className="w-8 h-8 border-2 border-zinc-600 border-t-white rounded-full"
    />
  </div>
)

export function LegacyPage({
  userName,
  onNavigate
}: LegacyPageProps) {
  
  const {
    selectedTimeRange,
    setSelectedTimeRange,
    activeTab,
    setActiveTab,
    expandedEvents,
    toggleEventExpansion,
    isPending
  } = useTimelineState()
  
  // Legacy Metrics
  const legacyMetrics: LegacyMetric[] = [
    {
      id: 'digital-influence',
      label: 'Influência Digital',
      value: '2,847',
      change: 23.5,
      icon: <Globe size={24} />,
      color: 'text-blue-400',
      description: 'Pessoas alcançadas através da sua presença digital',
      trend: 'up'
    },
    {
      id: 'knowledge-shared',
      label: 'Conhecimento Compartilhado',
      value: '156',
      change: 12.3,
      icon: <Lightbulb size={24} />,
      color: 'text-yellow-400',
      description: 'Insights, artigos e conteúdos educativos criados',
      trend: 'up'
    },
    {
      id: 'connections-made',
      label: 'Conexões Genuínas',
      value: '89',
      change: 8.7,
      icon: <Heart size={24} />,
      color: 'text-pink-400',
      description: 'Relacionamentos autênticos construídos',
      trend: 'up'
    },
    {
      id: 'value-created',
      label: 'Valor Criado',
      value: 'R$ 47.2K',
      change: 34.1,
      icon: <TrendingUp size={24} />,
      color: 'text-green-400',
      description: 'Valor econômico estimado gerado para terceiros',
      trend: 'up'
    },
    {
      id: 'skills-mastered',
      label: 'Habilidades Dominadas',
      value: '12',
      change: 2,
      icon: <Target size={24} />,
      color: 'text-purple-400',
      description: 'Skills desenvolvidas até nível avançado',
      trend: 'up'
    },
    {
      id: 'impact-score',
      label: 'Score de Impacto',
      value: '847',
      change: 15.2,
      icon: <Rocket size={24} />,
      color: 'text-orange-400',
      description: 'Métrica proprietária baseada em impacto social',
      trend: 'up'
    }
  ]

  // Timeline Events - Comprehensive Journey
  const timelineEvents: TimelineEvent[] = [
    {
      id: 'event-1',
      date: '2025-09-03',
      title: 'Revolução Gamificação Implementada',
      description: 'Sistema completo de desafios, missões e conquistas em funcionamento',
      type: 'breakthrough',
      icon: <Zap size={20} />,
      color: 'bg-purple-500',
      metrics: {
        before: 450,
        after: 847,
        unit: 'Impact Score'
      }
    },
    {
      id: 'diary-1',
      date: '2025-09-02',
      title: 'Diário de Bordo - Dia Intenso',
      description: 'Reflexão sobre o processo de desenvolvimento e aprendizados',
      type: 'diary',
      icon: <PenTool size={20} />,
      color: 'bg-emerald-500',
      diaryEntry: {
        content: 'Hoje foi um dia transformador. Consegui implementar toda a arquitetura de gamificação e ver tudo funcionando foi incrível. Cada desafio superado me fez perceber como estou evoluindo tecnicamente e estrategicamente.',
        mood: 'accomplished',
        tags: ['desenvolvimento', 'gamificação', 'breakthrough', 'aprendizado']
      }
    },
    {
      id: 'story-1',
      date: '2025-09-01',
      title: 'A História da Minha Autenticidade',
      description: 'Descoberta da persona única através de autoconhecimento profundo',
      type: 'story',
      icon: <BookOpen size={20} />,
      color: 'bg-amber-500',
      story: {
        content: 'Sempre soube que era diferente dos outros empreendedores. Quando descobri que minha força não estava em seguir fórmulas prontas, mas em criar meu próprio caminho autêntico, tudo mudou. Essa jornada de autoconhecimento me revelou quem eu realmente sou no mercado digital.',
        emotions: ['determinação', 'clareza', 'confiança', 'propósito'],
        lessons: ['Autenticidade é minha maior vantagem competitiva', 'Não preciso ser igual aos outros para ter sucesso', 'Minha história única é meu maior ativo']
      }
    },
    {
      id: 'skill-1',
      date: '2025-08-30',
      title: 'Storytelling Empresarial Desenvolvido',
      description: 'Evolução significativa na habilidade de contar histórias autênticas',
      type: 'skill',
      icon: <Brain size={20} />,
      color: 'bg-indigo-500',
      skill: {
        name: 'Storytelling Estratégico',
        level: 'intermediate',
        evidence: 'Criação de narrativas envolventes que conectam com a audiência e transmitem valores empresariais de forma autêntica'
      }
    },
    {
      id: 'event-2',
      date: '2025-08-29',
      title: 'Early Adopter MadBoat',
      description: 'Pioneiro no ecossistema - Entre os primeiros 100 tripulantes',
      type: 'achievement',
      icon: <Star size={20} />,
      color: 'bg-blue-500'
    },
    {
      id: 'diary-2',
      date: '2025-08-25',
      title: 'Reflexão sobre Networking Autêntico',
      description: 'Pensamentos sobre a diferença entre conexões superficiais e genuínas',
      type: 'diary',
      icon: <Smile size={20} />,
      color: 'bg-pink-500',
      diaryEntry: {
        content: 'Percebi que as melhores parcerias surgem quando sou genuinamente eu mesmo. Não preciso fingir ser quem não sou para impressionar. As pessoas certas se conectam com minha autenticidade.',
        mood: 'reflective',
        tags: ['networking', 'autenticidade', 'parcerias', 'relacionamentos']
      }
    },
    {
      id: 'event-3',
      date: '2025-08-15',
      title: 'Primeira Parceria Estratégica',
      description: 'Conexão genuína que resultou em colaboração empresarial',
      type: 'milestone',
      icon: <Users size={20} />,
      color: 'bg-green-500',
      metrics: {
        before: 0,
        after: 1,
        unit: 'Parcerias Estratégicas'
      }
    }
  ]

  // Predictions
  const predictions: Prediction[] = [
    {
      id: 'pred-1',
      title: 'Próximo Marco: 5K Influence',
      description: 'Baseado no crescimento atual, você alcançará 5.000 pontos de influência',
      targetDate: '2025-12-15',
      probability: 87,
      icon: <Globe size={20} />,
      impact: 'high'
    },
    {
      id: 'pred-2',
      title: 'Especialista Reconhecido',
      description: 'Projeção para ser reconhecido como especialista na sua área',
      targetDate: '2026-03-22',
      probability: 73,
      icon: <Award size={20} />,
      impact: 'high'
    },
    {
      id: 'pred-3',
      title: '100 Conexões Genuínas',
      description: 'Rede de relacionamentos autênticos alcançará 100 pessoas',
      targetDate: '2025-11-30',
      probability: 92,
      icon: <Heart size={20} />,
      impact: 'medium'
    }
  ]

  const getChangeIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <ArrowUpRight size={16} className="text-green-400" />
      case 'down':
        return <ArrowUpRight size={16} className="rotate-90 text-red-400" />
      case 'stable':
        return <Activity size={16} className="text-zinc-400" />
    }
  }

  const getImpactColor = (impact: 'low' | 'medium' | 'high') => {
    switch (impact) {
      case 'high':
        return 'text-green-400 bg-green-400/10 border-green-400/30'
      case 'medium':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30'
      case 'low':
        return 'text-zinc-400 bg-zinc-400/10 border-zinc-400/30'
    }
  }

  // Memoized timeline events for performance
  const memoizedTimelineEvents = useMemo(() => timelineEvents, [timelineEvents])

  // Scroll-based animation controls
  const { scrollYProgress } = useScroll()
  const timelineProgress = useTransform(scrollYProgress, [0, 0.8], [0, 1])
  const springProgress = useSpring(timelineProgress, { stiffness: 300, damping: 30 })

  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-hidden">
      
      {/* Premium gradient background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-900/3 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-blue-900/3 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-green-900/2 rounded-full blur-3xl" />
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
                <h1 className="text-3xl font-light tracking-wide text-white mb-1">Seu Legado Digital</h1>
                <p className="text-sm text-zinc-500 font-light">O impacto mensurável da sua jornada</p>
              </div>
            </div>
            
            {/* Time Range Selector */}
            <div className="flex items-center gap-2 bg-zinc-950/80 backdrop-blur-sm border border-zinc-800/50 rounded-lg p-1">
              {['7d', '30d', '90d', '1y', 'all'].map((range) => (
                <button
                  key={range}
                  onClick={() => setSelectedTimeRange(range as any)}
                  className={`px-3 py-1.5 rounded-md text-xs font-light transition-all ${
                    selectedTimeRange === range 
                      ? 'bg-white text-zinc-900' 
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {range === 'all' ? 'Todo' : range.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-6 mb-8">
            {[
              { id: 'timeline', label: 'Linha do Tempo', icon: <Clock size={16} /> },
              { id: 'overview', label: 'Visão Geral', icon: <BarChart3 size={16} /> },
              { id: 'predictions', label: 'Previsões', icon: <Sparkles size={16} /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-light transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-zinc-900'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-8 pb-24">
        <div className="max-w-7xl mx-auto">
          
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              {/* Legacy Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {legacyMetrics.map((metric) => (
                  <div
                    key={metric.id}
                    className="p-6 bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-2xl hover:bg-zinc-900/70 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-zinc-800/50 flex items-center justify-center ${metric.color}`}>
                        {metric.icon}
                      </div>
                      {metric.change && (
                        <div className="flex items-center gap-1">
                          {getChangeIcon(metric.trend)}
                          <span className={`text-xs font-light ${
                            metric.trend === 'up' ? 'text-green-400' : 
                            metric.trend === 'down' ? 'text-red-400' : 'text-zinc-400'
                          }`}>
                            {metric.change > 0 ? '+' : ''}{metric.change}%
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mb-3">
                      <div className="text-2xl font-light text-white mb-1">{metric.value}</div>
                      <div className="text-sm text-zinc-400 font-light">{metric.label}</div>
                    </div>
                    
                    <p className="text-xs text-zinc-500 leading-relaxed">{metric.description}</p>
                  </div>
                ))}
              </div>

              {/* Legacy Summary */}
              <div className="p-8 bg-gradient-to-br from-zinc-900/50 to-zinc-900/30 backdrop-blur-sm border border-zinc-800/50 rounded-3xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  
                  {/* Left: Progress Circle */}
                  <div className="flex items-center justify-center">
                    <div className="relative">
                      <div className="w-48 h-48">
                        <svg className="w-48 h-48 transform -rotate-90">
                          <circle
                            cx="96"
                            cy="96"
                            r="80"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            className="text-zinc-800"
                          />
                          <circle
                            cx="96"
                            cy="96"
                            r="80"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 80}`}
                            strokeDashoffset={`${2 * Math.PI * 80 * (1 - 0.73)}`}
                            className="text-white transition-all duration-2000"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-4xl font-light text-white">73%</span>
                          <span className="text-sm text-zinc-500">Legado Construído</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Insights */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-light text-white">Insights do Seu Legado</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2" />
                        <div>
                          <p className="text-sm text-white font-light mb-1">Crescimento Acelerado</p>
                          <p className="text-xs text-zinc-500">Seus últimos 30 dias mostraram o maior crescimento em influência digital da sua história.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2" />
                        <div>
                          <p className="text-sm text-white font-light mb-1">Especialização Emergente</p>
                          <p className="text-xs text-zinc-500">Você está se tornando reconhecido como especialista em transformação digital.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mt-2" />
                        <div>
                          <p className="text-sm text-white font-light mb-1">Rede de Valor</p>
                          <p className="text-xs text-zinc-500">Suas conexões estão criando um efeito multiplicador no seu impacto.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2" />
                        <div>
                          <p className="text-sm text-white font-light mb-1">Próximo Nível</p>
                          <p className="text-xs text-zinc-500">Você está a 27% de alcançar o próximo marco de legado significativo.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Timeline Tab - Optimized GitKraken Style with Animations */}
          {activeTab === 'timeline' && (
            <Suspense fallback={<TimelineLoader />}>
              <motion.div 
                className="max-w-7xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                {/* Animated Timeline Header */}
                <motion.div 
                  className="text-center mb-12"
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <motion.h2 
                    className="text-3xl font-light text-white mb-4"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    Sua Jornada de Transformação
                  </motion.h2>
                  <motion.p 
                    className="text-zinc-400 font-light"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    Conquistas, histórias, aprendizados e evolução ao longo do tempo
                  </motion.p>
                </motion.div>

                {/* Optimized Horizontal Timeline Container */}
                <div className="relative overflow-x-auto pb-8">
                  {/* Progress Line Background */}
                  <motion.div 
                    className="absolute bottom-12 left-8 right-8 h-px bg-zinc-800"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1.2, delay: 0.8 }}
                  />
                  
                  {/* Animated Progress Line */}
                  <motion.div 
                    className="absolute bottom-12 left-8 h-px bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500"
                    style={{ 
                      scaleX: springProgress,
                      transformOrigin: "0 50%",
                      width: "100%"
                    }}
                  />

                  <div className="flex items-end gap-12 min-w-max px-8 pb-20">
                    <AnimatePresence mode="popLayout">
                      {memoizedTimelineEvents.map((event, index) => {
                        const isExpanded = expandedEvents.has(event.id);
                        // Asymmetric positioning for visual variety
                        const cardOffset = index % 4 === 0 ? 'mb-16' : index % 4 === 1 ? 'mb-8' : index % 4 === 2 ? 'mb-12' : 'mb-20';
                        const cardHeight = index % 3 === 0 ? 'h-64' : index % 3 === 1 ? 'h-80' : 'h-72';
                        
                        return (
                          <motion.div 
                            key={event.id} 
                            className={`relative flex flex-col items-start ${cardOffset}`}
                            initial={{ y: 100, opacity: 0, scale: 0.8 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: -100, opacity: 0, scale: 0.8 }}
                            transition={{ 
                              duration: 0.6,
                              delay: index * 0.1,
                              type: "spring",
                              stiffness: 300,
                              damping: 30
                            }}
                            whileHover={{ y: -8 }}
                            layout
                          >
                            
                            {/* Animated Flag Card */}
                            <motion.div 
                              className={`relative w-56 ${cardHeight} ${event.color} rounded-lg shadow-2xl border border-zinc-600 overflow-hidden cursor-pointer`}
                              whileHover={{ 
                                scale: 1.02,
                                rotateY: 5,
                                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
                              }}
                              transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                              
                              {/* Large Symbol/Image Space with Animation */}
                              <motion.div 
                                className="h-20 bg-black/10 flex items-center justify-center border-b border-black/20"
                                whileHover={{ backgroundColor: "rgba(0,0,0,0.15)" }}
                              >
                                <motion.div 
                                  className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center text-2xl"
                                  whileHover={{ 
                                    scale: 1.1,
                                    rotate: 360 
                                  }}
                                  transition={{ duration: 0.6 }}
                                >
                                  {event.icon as JSX.Element}
                                </motion.div>
                              </motion.div>
                              
                              {/* Card Content */}
                              <div className="p-4 h-full flex flex-col text-white">
                                {/* Animated Title */}
                                <motion.h3 
                                  className="text-lg font-medium mb-2 text-center leading-tight"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.3 }}
                                >
                                  {event.title}
                                </motion.h3>
                                
                                {/* Animated Description */}
                                <motion.p 
                                  className="text-sm opacity-90 flex-1 text-center leading-relaxed"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.4 }}
                                >
                                  {event.description}
                                </motion.p>
                                
                                {/* Animated Footer Info */}
                                <motion.div 
                                  className="mt-auto space-y-1"
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.5 }}
                                >
                                  {event.metrics && (
                                    <motion.div 
                                      className="text-xs bg-black/20 rounded px-2 py-1 text-center"
                                      whileHover={{ backgroundColor: "rgba(0,0,0,0.3)" }}
                                    >
                                      Impact: {event.metrics.before} → {event.metrics.after}
                                    </motion.div>
                                  )}
                                  {event.story && (
                                    <motion.div 
                                      className="text-xs bg-black/20 rounded px-2 py-1 text-center"
                                      whileHover={{ backgroundColor: "rgba(0,0,0,0.3)" }}
                                    >
                                      📖 Personal Story
                                    </motion.div>
                                  )}
                                  {event.diaryEntry && (
                                    <motion.div 
                                      className="text-xs bg-black/20 rounded px-2 py-1 text-center"
                                      whileHover={{ backgroundColor: "rgba(0,0,0,0.3)" }}
                                    >
                                      📝 Mood: {event.diaryEntry.mood}
                                    </motion.div>
                                  )}
                                  {event.skill && (
                                    <motion.div 
                                      className="text-xs bg-black/20 rounded px-2 py-1 text-center"
                                      whileHover={{ backgroundColor: "rgba(0,0,0,0.3)" }}
                                    >
                                      🎯 Level: {event.skill.level}
                                    </motion.div>
                                  )}
                                </motion.div>
                              </div>

                              {/* Animated Expand Button */}
                              <motion.button
                                onClick={() => toggleEventExpansion(event.id)}
                                className="absolute top-2 right-2 w-6 h-6 bg-black/30 rounded-full flex items-center justify-center text-white text-xs"
                                whileHover={{ 
                                  scale: 1.2,
                                  backgroundColor: "rgba(0,0,0,0.6)"
                                }}
                                whileTap={{ scale: 0.9 }}
                                transition={{ type: "spring", stiffness: 400 }}
                              >
                                <motion.span
                                  animate={{ rotate: isExpanded ? 45 : 0 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  +
                                </motion.span>
                              </motion.button>
                            </motion.div>

                            {/* Animated Flag Pole */}
                            <motion.div 
                              className="relative"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.6 }}
                            >
                              {/* Wide part connected to card */}
                              <motion.div 
                                className={`w-12 h-3 ${event.color} opacity-80 -mt-1`}
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ delay: 0.7, duration: 0.3 }}
                              />
                              {/* Thin pole going down */}
                              <motion.div 
                                className="w-1 h-16 bg-zinc-500 ml-6"
                                initial={{ scaleY: 0 }}
                                animate={{ scaleY: 1 }}
                                transition={{ delay: 0.8, duration: 0.4 }}
                                style={{ transformOrigin: "top" }}
                              />
                              {/* Connection to timeline */}
                              <motion.div 
                                className="w-4 h-4 bg-zinc-400 rounded-full -ml-1.5 border-2 border-zinc-300"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ 
                                  delay: 0.9,
                                  type: "spring",
                                  stiffness: 400
                                }}
                                whileHover={{ 
                                  scale: 1.2,
                                  backgroundColor: "#ffffff"
                                }}
                              />
                            </motion.div>
                            
                            {/* Animated Date Label */}
                            <motion.div 
                              className="text-center mt-2 ml-6"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 1 + index * 0.05 }}
                            >
                              <div className="text-xs text-zinc-400 font-light">
                                {new Date(event.date).toLocaleDateString('en-US', { 
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </div>
                            </motion.div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>

                  {/* Timeline Labels with Animation */}
                  <motion.div 
                    className="absolute bottom-8 left-8 right-8 flex justify-between text-xs text-zinc-500"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5 }}
                  >
                    <span>Início da Jornada</span>
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2 }}
                    >
                      Agora
                    </motion.span>
                  </motion.div>
                </div>

                {/* Optimized Add New Entry Buttons */}
                <motion.div 
                  className="flex justify-center mt-12 gap-4"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.8, duration: 0.6 }}
                >
                  <motion.button 
                    className="px-6 py-3 border border-amber-600/30 text-amber-400 rounded-full hover:bg-amber-950/20 transition-all flex items-center gap-2 text-sm font-light"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <BookOpen size={16} />
                    Adicionar História
                  </motion.button>
                  <motion.button 
                    className="px-6 py-3 border border-emerald-600/30 text-emerald-400 rounded-full hover:bg-emerald-950/20 transition-all flex items-center gap-2 text-sm font-light"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <PenTool size={16} />
                    Diário de Bordo
                  </motion.button>
                </motion.div>
              </motion.div>
            </Suspense>
          )}

          {/* Enhanced Modal System */}
          <AnimatePresence>
            {Array.from(expandedEvents).map(eventId => {
              const event = memoizedTimelineEvents.find(e => e.id === eventId);
              if (!event) return null;

              return (
                <motion.div 
                  key={eventId}
                  className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => toggleEventExpansion(eventId)}
                >
                  <motion.div 
                    className="max-w-3xl w-full bg-zinc-900 rounded-2xl p-8 shadow-2xl border border-zinc-700 max-h-[90vh] overflow-y-auto"
                    initial={{ scale: 0.8, opacity: 0, rotateX: -15 }}
                    animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                    exit={{ scale: 0.8, opacity: 0, rotateX: 15 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 300, 
                      damping: 30,
                      duration: 0.5
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    
                    {/* Enhanced Modal Header */}
                    <motion.div 
                      className="flex items-center justify-between mb-8"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="flex items-center gap-4">
                        <motion.div 
                          className={`w-16 h-16 ${event.color} rounded-full flex items-center justify-center`}
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          transition={{ duration: 0.6 }}
                        >
                          {event.icon as JSX.Element}
                        </motion.div>
                        <div>
                          <motion.h3 
                            className="text-2xl font-light text-white"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                          >
                            {event.title}
                          </motion.h3>
                          <motion.p 
                            className="text-sm text-zinc-400 uppercase tracking-wider"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                          >
                            {event.type}
                          </motion.p>
                        </div>
                      </div>
                      <motion.button
                        onClick={() => toggleEventExpansion(eventId)}
                        className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white"
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 0 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        ×
                      </motion.button>
                    </motion.div>

                    {/* Enhanced Modal Content with Stagger Animation */}
                    <motion.div 
                      className="space-y-6"
                      initial="hidden"
                      animate="visible"
                      variants={{
                        hidden: {},
                        visible: {
                          transition: {
                            staggerChildren: 0.1,
                            delayChildren: 0.3
                          }
                        }
                      }}
                    >
                      
                      {/* Basic Info with Animation */}
                      <motion.div 
                        className="p-6 bg-zinc-800/50 rounded-xl"
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          visible: { opacity: 1, y: 0 }
                        }}
                      >
                        <p className="text-zinc-300 leading-relaxed text-lg">{event.description}</p>
                        <motion.div 
                          className="mt-4 text-zinc-500"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.6 }}
                        >
                          {new Date(event.date).toLocaleDateString('pt-BR', { 
                            weekday: 'long',
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </motion.div>
                      </motion.div>

                      {/* Story Content with Rich Animation */}
                      {event.story && (
                        <motion.div 
                          className="p-8 bg-amber-950/20 border border-amber-800/30 rounded-xl"
                          variants={{
                            hidden: { opacity: 0, scale: 0.9 },
                            visible: { opacity: 1, scale: 1 }
                          }}
                        >
                          <motion.h4 
                            className="flex items-center gap-3 text-amber-200 font-light mb-6 text-xl"
                            whileHover={{ scale: 1.02 }}
                          >
                            <BookOpen size={24} />
                            Minha História
                          </motion.h4>
                          <motion.blockquote 
                            className="text-amber-100/90 leading-relaxed mb-6 italic text-lg border-l-4 border-amber-600 pl-6"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                          >
                            "{event.story.content}"
                          </motion.blockquote>
                          
                          {event.story.emotions && (
                            <motion.div 
                              className="mb-6"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.5 }}
                            >
                              <span className="text-amber-300 font-light block mb-3">Emoções vivenciadas</span>
                              <div className="flex flex-wrap gap-2">
                                {event.story.emotions.map((emotion, i) => (
                                  <motion.span 
                                    key={i} 
                                    className="px-3 py-1 bg-amber-800/30 text-amber-200 rounded-full"
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.6 + i * 0.1 }}
                                    whileHover={{ scale: 1.1 }}
                                  >
                                    {emotion}
                                  </motion.span>
                                ))}
                              </div>
                            </motion.div>
                          )}
                          
                          {event.story.lessons && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.7 }}
                            >
                              <span className="text-amber-300 font-light block mb-4">Principais aprendizados</span>
                              <ul className="space-y-3">
                                {event.story.lessons.map((lesson, i) => (
                                  <motion.li 
                                    key={i} 
                                    className="text-amber-100/80 flex items-start gap-3"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.8 + i * 0.1 }}
                                  >
                                    <span className="text-amber-400 text-lg">•</span>
                                    <span>{lesson}</span>
                                  </motion.li>
                                ))}
                              </ul>
                            </motion.div>
                          )}
                        </motion.div>
                      )}

                      {/* Enhanced Diary Entry */}
                      {event.diaryEntry && (
                        <motion.div 
                          className="p-8 bg-emerald-950/20 border border-emerald-800/30 rounded-xl"
                          variants={{
                            hidden: { opacity: 0, scale: 0.9 },
                            visible: { opacity: 1, scale: 1 }
                          }}
                        >
                          <motion.h4 
                            className="flex items-center gap-3 text-emerald-200 font-light mb-6 text-xl"
                            whileHover={{ scale: 1.02 }}
                          >
                            <PenTool size={24} />
                            Diário de Bordo
                          </motion.h4>
                          <motion.p 
                            className="text-emerald-100/90 leading-relaxed mb-6 text-lg"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                          >
                            {event.diaryEntry.content}
                          </motion.p>
                          
                          <div className="flex items-center gap-8">
                            <motion.div 
                              className="flex items-center gap-2"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.5 }}
                            >
                              <span className="text-emerald-300">Estado emocional:</span>
                              <motion.span 
                                className="px-4 py-2 bg-emerald-800/30 text-emerald-200 rounded-full capitalize"
                                whileHover={{ scale: 1.05 }}
                              >
                                {event.diaryEntry.mood}
                              </motion.span>
                            </motion.div>
                            
                            {event.diaryEntry.tags && (
                              <motion.div 
                                className="flex items-center gap-2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 }}
                              >
                                <span className="text-emerald-300">Tags:</span>
                                <div className="flex gap-2">
                                  {event.diaryEntry.tags.map((tag, i) => (
                                    <motion.span 
                                      key={i} 
                                      className="px-2 py-1 bg-emerald-900/40 text-emerald-300 rounded"
                                      initial={{ opacity: 0, scale: 0 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{ delay: 0.7 + i * 0.1 }}
                                      whileHover={{ scale: 1.1 }}
                                    >
                                      #{tag}
                                    </motion.span>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      )}

                      {/* Enhanced Skill Development */}
                      {event.skill && (
                        <motion.div 
                          className="p-8 bg-indigo-950/20 border border-indigo-800/30 rounded-xl"
                          variants={{
                            hidden: { opacity: 0, scale: 0.9 },
                            visible: { opacity: 1, scale: 1 }
                          }}
                        >
                          <motion.h4 
                            className="flex items-center gap-3 text-indigo-200 font-light mb-6 text-xl"
                            whileHover={{ scale: 1.02 }}
                          >
                            <Brain size={24} />
                            Desenvolvimento de Habilidade
                          </motion.h4>
                          
                          <div className="mb-6">
                            <motion.div 
                              className="flex items-center gap-4 mb-4"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.4 }}
                            >
                              <span className="text-2xl text-indigo-100 font-light">{event.skill.name}</span>
                              <motion.span 
                                className="px-4 py-2 bg-indigo-800/30 text-indigo-200 rounded-full capitalize"
                                whileHover={{ scale: 1.05, backgroundColor: "rgba(67, 56, 202, 0.4)" }}
                              >
                                {event.skill.level}
                              </motion.span>
                            </motion.div>
                            {event.skill.evidence && (
                              <motion.p 
                                className="text-indigo-100/80 leading-relaxed text-lg"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                              >
                                {event.skill.evidence}
                              </motion.p>
                            )}
                          </div>
                          
                          {/* Enhanced Skill Level Visual */}
                          <motion.div 
                            className="flex items-center gap-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                          >
                            <span className="text-indigo-300">Progresso de Maestria:</span>
                            <div className="flex gap-2 flex-1 max-w-xs">
                              {['beginner', 'intermediate', 'advanced', 'expert'].map((level, i) => (
                                <motion.div 
                                  key={level} 
                                  className={`h-3 rounded-full flex-1 ${
                                    ['beginner', 'intermediate', 'advanced', 'expert'].indexOf(event.skill!.level) >= i
                                      ? 'bg-indigo-400' 
                                      : 'bg-indigo-900/50'
                                  }`}
                                  initial={{ scaleX: 0 }}
                                  animate={{ scaleX: 1 }}
                                  transition={{ 
                                    delay: 0.7 + i * 0.1,
                                    duration: 0.3,
                                    ease: "easeOut"
                                  }}
                                  style={{ transformOrigin: "0 50%" }}
                                />
                              ))}
                            </div>
                          </motion.div>
                        </motion.div>
                      )}

                      {/* Enhanced Metrics Impact */}
                      {event.metrics && (
                        <motion.div 
                          className="p-8 bg-zinc-800/40 rounded-xl"
                          variants={{
                            hidden: { opacity: 0, scale: 0.9 },
                            visible: { opacity: 1, scale: 1 }
                          }}
                        >
                          <motion.h4 
                            className="text-xl font-light text-white mb-6 text-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                          >
                            Impacto Mensurável
                          </motion.h4>
                          <div className="grid grid-cols-3 gap-8 text-center">
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.4 }}
                            >
                              <motion.div 
                                className="text-3xl font-light text-zinc-300"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.5, type: "spring" }}
                              >
                                {event.metrics.before}
                              </motion.div>
                              <div className="text-sm text-zinc-500 uppercase tracking-wide">Estado Anterior</div>
                            </motion.div>
                            
                            <motion.div 
                              className="flex flex-col items-center justify-center"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.6 }}
                            >
                              <motion.div
                                animate={{ 
                                  rotate: [0, 10, -10, 0],
                                  scale: [1, 1.1, 1]
                                }}
                                transition={{ 
                                  duration: 2,
                                  repeat: Infinity,
                                  repeatType: "reverse"
                                }}
                              >
                                <ArrowUpRight size={28} className="text-green-400 mb-2" />
                              </motion.div>
                              <motion.span 
                                className="text-xl text-green-400 font-light"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 }}
                              >
                                +{event.metrics.after - event.metrics.before}
                              </motion.span>
                              <span className="text-sm text-green-300">crescimento</span>
                            </motion.div>
                            
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.8 }}
                            >
                              <motion.div 
                                className="text-3xl font-light text-white"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.9, type: "spring" }}
                              >
                                {event.metrics.after}
                              </motion.div>
                              <div className="text-sm text-zinc-500 uppercase tracking-wide">Estado Atual</div>
                            </motion.div>
                          </div>
                          <motion.div 
                            className="text-center mt-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                          >
                            <span className="text-zinc-400 bg-zinc-700/50 px-4 py-2 rounded-full">
                              {event.metrics.unit}
                            </span>
                          </motion.div>
                        </motion.div>
                      )}
                    </motion.div>
                  </motion.div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Predictions Tab */}
          {activeTab === 'predictions' && (
            <div className="space-y-6">
              {predictions.map((prediction) => (
                <div
                  key={prediction.id}
                  className="p-6 bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-2xl"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-zinc-800/50 rounded-xl flex items-center justify-center text-zinc-400">
                        {prediction.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-light text-white mb-1">{prediction.title}</h3>
                        <p className="text-sm text-zinc-400">{prediction.description}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs ${getImpactColor(prediction.impact)}`}>
                        {prediction.impact === 'high' ? 'Alto Impacto' : 
                         prediction.impact === 'medium' ? 'Médio Impacto' : 'Baixo Impacto'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-zinc-500">Probabilidade</span>
                        <span className="text-xs text-white">{prediction.probability}%</span>
                      </div>
                      <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-1000"
                          style={{ width: `${prediction.probability}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-zinc-500">Previsão para</span>
                        <div className="text-sm text-white font-light">
                          {new Date(prediction.targetDate).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                      <div className="text-xs text-zinc-400">
                        {Math.ceil((new Date(prediction.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} dias
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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
          <button 
            onClick={() => onNavigate?.('achievements')}
            className="px-4 py-2 text-xs text-zinc-400 hover:text-white transition-colors font-light"
          >
            Conquistas
          </button>
          <div className="px-4 py-2 bg-zinc-800 rounded-full">
            <span className="text-xs text-white font-light">Legado</span>
          </div>
        </div>
      </div>
    </div>
  )
}