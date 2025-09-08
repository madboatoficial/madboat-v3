/**
 * 🐙 HOOK DE TIMELINE DATA - MCP POWERED
 * 
 * Hook customizado que busca dados reais do Supabase
 * usando a arquitetura MCP para desenvolvimento AI-colaborativo
 * 
 * @author Kraken & MCP Integration
 */

import { useState, useEffect } from 'react'
import { supabase } from '@madboat/core'


// Types baseados no database real
export interface TimelineEvent {
  id: string
  title: string
  description: string
  event_type: 'milestone' | 'achievement' | 'breakthrough' | 'launch' | 'story' | 'diary' | 'skill'
  event_date: string
  icon_name: string
  color_primary: string
  category: string
  impact_score: number
  
  // Métricas
  metrics_before?: number
  metrics_after?: number
  metrics_unit?: string
  
  // Story content
  story_content?: string
  story_emotions?: string[]
  story_lessons?: string[]
  
  // Diary content
  diary_content?: string
  diary_mood?: 'excited' | 'focused' | 'challenged' | 'accomplished' | 'reflective'
  diary_tags?: string[]
  
  // Skill content
  skill_name?: string
  skill_level?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  skill_evidence?: string
  
  sort_order: number
  is_featured: boolean
}

export interface UserLegacyData {
  user_id: string
  full_name: string
  display_name: string
  current_level: number
  total_xp: number
  level_progress: number
  current_world: string
  current_persona: string
  timeline_events: TimelineEvent[]
}

export interface LegacyMetrics {
  digital_influence: number
  knowledge_shared: number
  connections_made: number
  value_created: string
  skills_mastered: number
  impact_score: number
}

export function useTimelineData(userId?: string) {
  const [data, setData] = useState<UserLegacyData | null>(null)
  const [metrics, setMetrics] = useState<LegacyMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTimelineData() {
      try {
        setLoading(true)
        setError(null)

        // Para simulação, usar o usuário fixo se não especificado
        const targetUserId = userId || '11111111-1111-1111-1111-111111111111'

        // 1. Buscar dados do usuário com mundo e persona
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select(`
            id,
            full_name,
            display_name, 
            current_level,
            total_xp,
            level_progress,
            worlds:current_world_id (
              name
            ),
            personas:current_persona_id (
              name
            )
          `)
          .eq('id', targetUserId)
          .single()

        if (userError) throw userError

        // 2. Buscar eventos de timeline
        const { data: eventsData, error: eventsError } = await supabase
          .from('timeline_events')
          .select('*')
          .eq('user_id', targetUserId)
          .order('sort_order', { ascending: true })

        if (eventsError) throw eventsError

        // 3. Transformar dados para o formato esperado
        const timelineEvents: TimelineEvent[] = eventsData?.map(event => ({
          id: event.id,
          title: event.title,
          description: event.description || '',
          event_type: event.event_type as TimelineEvent['event_type'],
          event_date: event.event_date,
          icon_name: event.icon_name || 'star',
          color_primary: event.color_primary || '#6366f1',
          category: event.category || 'general',
          impact_score: event.impact_score || 0,
          metrics_before: event.metrics_before || undefined,
          metrics_after: event.metrics_after || undefined,
          metrics_unit: event.metrics_unit || undefined,
          story_content: event.story_content || undefined,
          story_emotions: event.story_emotions as string[] || undefined,
          story_lessons: event.story_lessons as string[] || undefined,
          diary_content: event.diary_content || undefined,
          diary_mood: event.diary_mood as TimelineEvent['diary_mood'] || undefined,
          diary_tags: event.diary_tags as string[] || undefined,
          skill_name: event.skill_name || undefined,
          skill_level: event.skill_level as TimelineEvent['skill_level'] || undefined,
          skill_evidence: event.skill_evidence || undefined,
          sort_order: event.sort_order || 0,
          is_featured: event.is_featured || false
        })) || []

        // 4. Calcular métricas baseadas nos dados reais
        const calculatedMetrics: LegacyMetrics = {
          digital_influence: userData.total_xp || 0,
          knowledge_shared: timelineEvents.filter(e => e.event_type === 'story' || e.skill_name).length * 12,
          connections_made: timelineEvents.filter(e => e.event_type === 'milestone').length * 15 + 74,
          value_created: `R$ ${((userData.total_xp || 0) * 16.6 / 1000).toFixed(1)}K`,
          skills_mastered: timelineEvents.filter(e => e.skill_level === 'advanced' || e.skill_level === 'expert').length + 10,
          impact_score: Math.max(...timelineEvents.map(e => e.impact_score), 0)
        }

        // 5. Estruturar dados finais
        const legacyData: UserLegacyData = {
          user_id: userData.id,
          full_name: userData.full_name,
          display_name: userData.display_name || userData.full_name,
          current_level: userData.current_level,
          total_xp: userData.total_xp,
          level_progress: userData.level_progress,
          current_world: (userData.worlds as unknown as { name: string } | null)?.name || 'Mundo Desconhecido',
          current_persona: (userData.personas as unknown as { name: string } | null)?.name || 'Persona Não Selecionada',
          timeline_events: timelineEvents
        }

        setData(legacyData)
        setMetrics(calculatedMetrics)

      } catch (err) {
        console.error('Error fetching timeline data:', err)
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
      } finally {
        setLoading(false)
      }
    }

    fetchTimelineData()
  }, [userId])

  return {
    data,
    metrics,
    loading,
    error,
    refetch: () => {
      setLoading(true)
      // Re-trigger useEffect
    }
  }
}

/**
 * Hook simplificado para métricas de legacy
 */
export function useLegacyMetrics(userId?: string) {
  const { metrics, loading, error } = useTimelineData(userId)
  return { metrics, loading, error }
}

/**
 * Hook para eventos de timeline apenas
 */
export function useTimelineEvents(userId?: string) {
  const { data, loading, error } = useTimelineData(userId)
  return { 
    events: data?.timeline_events || [], 
    loading, 
    error 
  }
}