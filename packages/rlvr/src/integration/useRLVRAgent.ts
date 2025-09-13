import { useState, useEffect } from 'react'
import { SupabaseClient } from '@supabase/supabase-js'
import { MadBoatRLVR, AgentMetrics, AgentAction } from './MadBoatIntegration'

export interface RLVRHookOptions {
  supabase: SupabaseClient
  autoRefresh?: boolean
  refreshInterval?: number
}

export function useRLVRAgent(agentId: string, options: RLVRHookOptions) {
  const [metrics, setMetrics] = useState<AgentMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [rlvr, setRLVR] = useState<MadBoatRLVR | null>(null)

  // Initialize RLVR system
  useEffect(() => {
    const initRLVR = async () => {
      try {
        const rlvrSystem = new MadBoatRLVR(options.supabase)
        const initialized = await rlvrSystem.initialize()

        if (initialized) {
          setRLVR(rlvrSystem)
          const agentMetrics = await rlvrSystem.getAgentMetrics(agentId)
          setMetrics(agentMetrics)
        }
        setLoading(false)
      } catch (err) {
        setError(err as Error)
        setLoading(false)
      }
    }

    initRLVR()
  }, [agentId, options.supabase])

  // Real-time updates via Supabase subscriptions
  useEffect(() => {
    if (!rlvr) return

    const subscription = options.supabase
      .from('rlvr_memory')
      .on('INSERT', (payload) => {
        if (payload.new.agent_id === agentId) {
          // Refresh metrics when new data comes in
          rlvr.getAgentMetrics(agentId).then(setMetrics)
        }
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [rlvr, agentId, options.supabase])

  // Auto-refresh metrics
  useEffect(() => {
    if (!options.autoRefresh || !rlvr) return

    const interval = setInterval(async () => {
      const agentMetrics = await rlvr.getAgentMetrics(agentId)
      setMetrics(agentMetrics)
    }, options.refreshInterval || 30000)

    return () => clearInterval(interval)
  }, [rlvr, agentId, options.autoRefresh, options.refreshInterval])

  const trackAction = async (action: Omit<AgentAction, 'agentId' | 'timestamp'>) => {
    if (!rlvr) return null

    const fullAction: AgentAction = {
      ...action,
      agentId,
      timestamp: new Date(),
    }

    return await rlvr.trackAgentAction(fullAction)
  }

  return {
    metrics,
    loading,
    error,
    trackAction,
    rlvr,
  }
}

// Hook for all agents
export function useRLVRSystem(options: RLVRHookOptions) {
  const [allMetrics, setAllMetrics] = useState<AgentMetrics[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [rlvr, setRLVR] = useState<MadBoatRLVR | null>(null)

  useEffect(() => {
    const initRLVR = async () => {
      try {
        const rlvrSystem = new MadBoatRLVR(options.supabase)
        const initialized = await rlvrSystem.initialize()

        if (initialized) {
          setRLVR(rlvrSystem)
          const metrics = await rlvrSystem.getAllAgentMetrics()
          setAllMetrics(metrics)
        }
        setLoading(false)
      } catch (err) {
        setError(err as Error)
        setLoading(false)
      }
    }

    initRLVR()
  }, [options.supabase])

  const refreshAllMetrics = async () => {
    if (!rlvr) return
    const metrics = await rlvr.getAllAgentMetrics()
    setAllMetrics(metrics)
  }

  return {
    allMetrics,
    loading,
    error,
    rlvr,
    refreshAllMetrics,
  }
}