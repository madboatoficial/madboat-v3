/**
 * 👑 LEGACY PAGE WITH REAL DATA - GitKraken Inspired Timeline
 * 
 * Esta é a versão original do design GitKraken com todas as animações,
 * agora conectada aos dados reais do Supabase via MCP
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
  Activity,
  Award,
  Flame,
  Crown,
  Calendar,
  MessageCircle,
  Share2,
  Bookmark,
  Coffee,
  Smile
} from 'lucide-react'

// Import do hook MCP-powered
import { useTimelineData, useLegacyMetrics } from '../hooks/use-timeline-data'

interface LegacyPageWithDataProps {
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
  'award': <Award size={20} />,
  'flame': <Flame size={20} />,
  'crown': <Crown size={20} />,
  'smile': <Smile size={20} />
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

// Enhanced Loading Component
const TimelineLoader = () => (
  <div className="flex items-center justify-center h-96">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      className="w-8 h-8 border-2 border-zinc-600 border-t-white rounded-full"
    />
    <span className="ml-4 text-zinc-400">Carregando timeline mágica...</span>
  </div>
)

export function LegacyPageWithData({
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

  // Convert timeline events to GitKraken format
  const memoizedTimelineEvents = useMemo(() => {
    if (!timelineData?.timeline_events) return []
    
    return timelineData.timeline_events.map(event => ({
      id: event.id,
      date: event.event_date,
      title: event.title,
      description: event.description,
      type: event.event_type,
      icon: iconMap[event.icon_name] || <Star size={20} />,
      color: `bg-[${event.color_primary}]` || 'bg-blue-500',
      metrics: event.metrics_before && event.metrics_after ? {
        before: event.metrics_before,
        after: event.metrics_after,
        unit: event.metrics_unit || 'pontos'
      } : undefined,
      story: event.story_content ? {
        content: event.story_content,
        emotions: event.story_emotions,
        lessons: event.story_lessons
      } : undefined,
      diaryEntry: event.diary_content ? {
        content: event.diary_content,
        mood: event.diary_mood || 'reflective',
        tags: event.diary_tags
      } : undefined,
      skill: event.skill_name ? {
        name: event.skill_name,
        level: event.skill_level || 'beginner',
        evidence: event.skill_evidence
      } : undefined
    }))
  }, [timelineData])

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
        <TimelineLoader />
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
                  onClick={() => setSelectedTimeRange(range as typeof selectedTimeRange)}
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
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
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

          {/* GitKraken Timeline Tab - ORIGINAL DESIGN RESTORED */}
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
                    Jornada de {timelineData.display_name}
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

                {/* Optimized Horizontal Timeline Container - GitKraken Style */}
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
                        const isExpanded = expandedEvents.has(event.id)
                        // Asymmetric positioning for visual variety
                        const cardOffset = index % 4 === 0 ? 'mb-16' : index % 4 === 1 ? 'mb-8' : index % 4 === 2 ? 'mb-12' : 'mb-20'
                        const cardHeight = index % 3 === 0 ? 'h-64' : index % 3 === 1 ? 'h-80' : 'h-72'
                        
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
                            
                            {/* Animated Flag Card - GitKraken Style */}
                            <motion.div 
                              className={`relative w-56 ${cardHeight} ${event.color} rounded-lg shadow-2xl border border-zinc-600 overflow-hidden cursor-pointer`}
                              whileHover={{ 
                                scale: 1.02,
                                rotateY: 5,
                                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
                              }}
                              transition={{ type: "spring", stiffness: 300, damping: 20 }}
                              onClick={() => toggleEventExpansion(event.id)}
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
                                      📔 Diary Entry
                                    </motion.div>
                                  )}
                                  {event.skill && (
                                    <motion.div 
                                      className="text-xs bg-black/20 rounded px-2 py-1 text-center"
                                      whileHover={{ backgroundColor: "rgba(0,0,0,0.3)" }}
                                    >
                                      🎯 Skill: {event.skill.level}
                                    </motion.div>
                                  )}
                                </motion.div>
                              </div>
                            </motion.div>
                            
                            {/* GitKraken-style connection line */}
                            <motion.div 
                              className="flex flex-col items-center"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.7 + index * 0.05 }}
                            >
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
                                {new Date(event.date).toLocaleDateString('pt-BR', { 
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </div>
                            </motion.div>
                          </motion.div>
                        )
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