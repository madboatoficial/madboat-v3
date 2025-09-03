/**
 * 👑 LEGACY PAGE WITH REAL DATA - MCP POWERED
 * 
 * Version powered by real Supabase data via MCP integration
 * Demonstrates the power of AI-collaborative development
 * 
 * @author Kraken & MCP Revolution
 */

"use client"

import React, { useState, useTransition, Suspense, useMemo, useCallback } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'motion/react'
import { 
  TrendingUp,
  Users,
  Target,
  Zap,
  BarChart3,
  Clock,
  ArrowUpRight,
  Globe,
  Star,
  Heart,
  Lightbulb,
  Rocket,
  Sparkles,
  BookOpen,
  PenTool,
  Brain,
  ChevronRight,
  Loader2,
  Activity
} from 'lucide-react'

// Import do hook MCP-powered
import { useTimelineData, useLegacyMetrics } from '../hooks/use-timeline-data'

interface LegacyPageWithDataProps {
  userName?: string
  userId?: string
  onNavigate?: (page: 'dashboard' | 'challenges' | 'missions' | 'achievements' | 'legacy') => void
}

// Mapping de icons para componentes Lucide
const iconMap: Record<string, React.ReactNode> = {
  'zap': <Zap size={20} />,
  'book-open': <BookOpen size={20} />,
  'pen-tool': <PenTool size={20} />,
  'brain': <Brain size={20} />,
  'users': <Users size={20} />,
  'star': <Star size={20} />,
  'rocket': <Rocket size={20} />,
  'globe': <Globe size={24} />,
  'lightbulb': <Lightbulb size={24} />,
  'heart': <Heart size={24} />,
  'trending-up': <TrendingUp size={24} />,
  'target': <Target size={24} />,
}

// Custom hook para optimized timeline state
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

// Loading component
const DataLoader = () => (
  <div className="min-h-[400px] flex items-center justify-center">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      className="w-8 h-8 border-2 border-zinc-600 border-t-white rounded-full"
    />
    <span className="ml-4 text-zinc-400">Carregando dados via MCP...</span>
  </div>
)

export function LegacyPageWithData({
  userName,
  userId,
  onNavigate
}: LegacyPageWithDataProps) {
  
  const {
    selectedTimeRange,
    setSelectedTimeRange,
    activeTab,
    setActiveTab,
    expandedEvents,
    toggleEventExpansion,
    isPending
  } = useTimelineState()

  // Hooks MCP-powered para dados reais
  const { data: timelineData, loading: timelineLoading, error: timelineError } = useTimelineData(userId)
  const { metrics, loading: metricsLoading, error: metricsError } = useLegacyMetrics(userId)
  
  // Scroll-based animation controls
  const { scrollYProgress } = useScroll()
  const timelineProgress = useTransform(scrollYProgress, [0, 0.8], [0, 1])
  const springProgress = useSpring(timelineProgress, { stiffness: 300, damping: 30 })

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

  // Error state
  if (timelineError || metricsError) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-light text-red-400 mb-4">Erro ao carregar dados</h2>
          <p className="text-zinc-400">{timelineError || metricsError}</p>
        </div>
      </div>
    )
  }

  // Loading state
  if (timelineLoading || metricsLoading || !timelineData || !metrics) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white">
        <DataLoader />
      </div>
    )
  }

  // Transform metrics to legacy format
  const legacyMetrics = [
    {
      id: 'digital-influence',
      label: 'Influência Digital',
      value: metrics.digital_influence.toLocaleString(),
      change: 23.5,
      icon: iconMap['globe'],
      color: 'text-blue-400',
      description: 'Pontos de experiência acumulados através da jornada',
      trend: 'up' as const
    },
    {
      id: 'knowledge-shared',
      label: 'Conhecimento Compartilhado',
      value: metrics.knowledge_shared.toString(),
      change: 12.3,
      icon: iconMap['lightbulb'],
      color: 'text-yellow-400',
      description: 'Histórias, habilidades e conteúdos educativos criados',
      trend: 'up' as const
    },
    {
      id: 'connections-made',
      label: 'Conexões Genuínas',
      value: metrics.connections_made.toString(),
      change: 8.7,
      icon: iconMap['heart'],
      color: 'text-pink-400',
      description: 'Relacionamentos autênticos e parcerias estratégicas',
      trend: 'up' as const
    },
    {
      id: 'value-created',
      label: 'Valor Criado',
      value: metrics.value_created,
      change: 34.1,
      icon: iconMap['trending-up'],
      color: 'text-green-400',
      description: 'Valor econômico estimado gerado através da jornada',
      trend: 'up' as const
    },
    {
      id: 'skills-mastered',
      label: 'Habilidades Dominadas',
      value: metrics.skills_mastered.toString(),
      change: 2,
      icon: iconMap['target'],
      color: 'text-purple-400',
      description: 'Skills desenvolvidas até nível avançado ou expert',
      trend: 'up' as const
    },
    {
      id: 'impact-score',
      label: 'Score de Impacto',
      value: metrics.impact_score.toString(),
      change: 15.2,
      icon: iconMap['rocket'],
      color: 'text-orange-400',
      description: 'Métrica proprietária baseada em impacto dos eventos',
      trend: 'up' as const
    }
  ]

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
                <h1 className="text-3xl font-light tracking-wide text-white mb-1">
                  Legado de {timelineData.display_name}
                </h1>
                <p className="text-sm text-zinc-500 font-light">
                  {timelineData.current_world} • {timelineData.current_persona} • Level {timelineData.current_level}
                </p>
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
              { id: 'predictions', label: 'Insights', icon: <Sparkles size={16} /> }
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
                  <motion.div
                    key={metric.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
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
                  </motion.div>
                ))}
              </div>

              {/* MCP Integration Status */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-8 bg-gradient-to-br from-zinc-900/50 to-zinc-900/30 backdrop-blur-sm border border-zinc-800/50 rounded-3xl"
              >
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-light text-white mb-4">🐙 Powered by MCP Revolution</h3>
                  <p className="text-zinc-400">
                    Dados em tempo real do Supabase via Model Context Protocol
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-light text-green-400 mb-2">
                      {timelineData.timeline_events.length}
                    </div>
                    <div className="text-sm text-zinc-500">Eventos de Timeline</div>
                  </div>
                  <div>
                    <div className="text-3xl font-light text-blue-400 mb-2">
                      {timelineData.total_xp.toLocaleString()}
                    </div>
                    <div className="text-sm text-zinc-500">Total XP</div>
                  </div>
                  <div>
                    <div className="text-3xl font-light text-purple-400 mb-2">
                      {timelineData.current_level}
                    </div>
                    <div className="text-sm text-zinc-500">Level Atual</div>
                  </div>
                </div>
              </motion.div>
            </>
          )}

          {/* Timeline Tab */}
          {activeTab === 'timeline' && (
            <Suspense fallback={<DataLoader />}>
              <motion.div 
                className="max-w-7xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                {/* Timeline Header */}
                <motion.div 
                  className="text-center mb-12"
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <h2 className="text-3xl font-light text-white mb-4">
                    Jornada de {timelineData.display_name}
                  </h2>
                  <p className="text-zinc-400 font-light">
                    {timelineData.timeline_events.length} marcos importantes na evolução digital
                  </p>
                </motion.div>

                {/* Timeline Container */}
                <div className="space-y-8">
                  {timelineData.timeline_events.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.6 }}
                      className={`flex items-start gap-6 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                    >
                      {/* Event Card */}
                      <div className="flex-1 max-w-md">
                        <div 
                          className="p-6 rounded-2xl border border-zinc-700 shadow-2xl"
                          style={{ backgroundColor: event.color_primary + '20', borderColor: event.color_primary + '40' }}
                        >
                          <div className="flex items-center gap-3 mb-4">
                            <div 
                              className="w-12 h-12 rounded-full flex items-center justify-center text-white"
                              style={{ backgroundColor: event.color_primary }}
                            >
                              {iconMap[event.icon_name] || <Star size={20} />}
                            </div>
                            <div>
                              <h3 className="text-lg font-medium text-white">{event.title}</h3>
                              <p className="text-sm text-zinc-400">{event.event_type}</p>
                            </div>
                          </div>
                          
                          <p className="text-zinc-300 mb-4">{event.description}</p>
                          
                          {event.impact_score > 0 && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-zinc-400">Impact Score:</span>
                              <span className="text-white font-medium">{event.impact_score}</span>
                            </div>
                          )}
                          
                          <div className="mt-4 text-xs text-zinc-500">
                            {new Date(event.event_date).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                      </div>

                      {/* Timeline Line */}
                      <div className="flex flex-col items-center">
                        <div 
                          className="w-4 h-4 rounded-full border-2 border-white"
                          style={{ backgroundColor: event.color_primary }}
                        />
                        {index < timelineData.timeline_events.length - 1 && (
                          <div className="w-0.5 h-16 bg-zinc-700 mt-2" />
                        )}
                      </div>

                      {/* Spacer for alternating layout */}
                      <div className="flex-1 max-w-md" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </Suspense>
          )}

          {/* Insights Tab */}
          {activeTab === 'predictions' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Sparkles size={48} className="mx-auto text-purple-400 mb-6" />
              <h3 className="text-2xl font-light text-white mb-4">
                Insights Baseados em Dados Reais
              </h3>
              <p className="text-zinc-400 max-w-2xl mx-auto">
                Análises preditivas baseadas na jornada de {timelineData.display_name} 
                serão implementadas na próxima fase do MCP Revolution.
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
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
            <span className="text-xs text-white font-light">Legado MCP</span>
          </div>
        </div>
      </div>
    </div>
  )
}