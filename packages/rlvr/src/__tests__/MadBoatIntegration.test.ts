import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MadBoatRLVR, AgentAction } from '../integration/MadBoatIntegration'

// Mock Supabase
const mockSupabase = {
  from: vi.fn(() => ({
    insert: vi.fn(() => Promise.resolve({ error: null })),
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        order: vi.fn(() => ({
          limit: vi.fn(() => Promise.resolve({ data: [], error: null }))
        }))
      })),
      order: vi.fn(() => Promise.resolve({ data: [], error: null }))
    }))
  }))
}

// Mock filesystem
vi.mock('fs/promises', () => ({
  readFile: vi.fn(() => Promise.resolve('test: context'))
}))

// Mock YAML parser
vi.mock('js-yaml', () => ({
  load: vi.fn(() => ({ test: 'context' }))
}))

describe('MadBoatRLVR', () => {
  let rlvr: MadBoatRLVR

  beforeEach(() => {
    vi.clearAllMocks()
    rlvr = new MadBoatRLVR(mockSupabase as any, 'test-context.yaml')
  })

  it('should initialize with default agents', async () => {
    const result = await rlvr.initialize()

    expect(result).toBe(true)
  })

  it('should track agent action successfully', async () => {
    await rlvr.initialize()

    const action: AgentAction = {
      agentId: 'kraken',
      task: 'Test task',
      input: { test: 'input' },
      output: { result: 'success' },
      timestamp: new Date(),
      success: true,
      metrics: {
        executionTime: 100,
        memoryUsage: 50,
        complexityScore: 0.5
      }
    }

    const metrics = await rlvr.trackAgentAction(action)

    expect(metrics).toBeTruthy()
    expect(metrics?.agentId).toBe('kraken')
  })

  it('should return null for unknown agent', async () => {
    await rlvr.initialize()

    const action: AgentAction = {
      agentId: 'unknown-agent',
      task: 'Test task',
      input: { test: 'input' },
      output: { result: 'success' },
      timestamp: new Date(),
      success: true
    }

    const metrics = await rlvr.trackAgentAction(action)

    expect(metrics).toBeNull()
  })

  it('should get metrics for specific agent', async () => {
    await rlvr.initialize()

    const metrics = await rlvr.getAgentMetrics('kraken')

    expect(metrics).toBeTruthy()
    expect(metrics?.agentId).toBe('kraken')
  })

  it('should get metrics for all agents', async () => {
    await rlvr.initialize()

    const allMetrics = await rlvr.getAllAgentMetrics()

    expect(allMetrics).toBeInstanceOf(Array)
    expect(allMetrics.length).toBeGreaterThan(0)
  })

  it('should handle Supabase errors gracefully', async () => {
    mockSupabase.from.mockReturnValue({
      insert: vi.fn(() => Promise.resolve({ error: 'Database error' })),
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => ({
            limit: vi.fn(() => Promise.resolve({ data: [], error: 'Select error' }))
          }))
        }))
      }))
    })

    await rlvr.initialize()

    const action: AgentAction = {
      agentId: 'kraken',
      task: 'Test task',
      input: { test: 'input' },
      output: { result: 'success' },
      timestamp: new Date(),
      success: true
    }

    // Should not throw even with database errors
    const metrics = await rlvr.trackAgentAction(action)
    expect(metrics).toBeTruthy()
  })

  it('should get shared knowledge patterns', async () => {
    mockSupabase.from.mockReturnValue({
      select: vi.fn(() => ({
        order: vi.fn(() => Promise.resolve({
          data: [
            {
              pattern: 'test-pattern',
              usage_count: 5,
              agents_learned: ['kraken', 'poseidon']
            }
          ],
          error: null
        }))
      }))
    })

    const knowledge = await rlvr.getSharedKnowledge()

    expect(knowledge).toBeInstanceOf(Array)
    expect(knowledge.length).toBe(1)
    expect(knowledge[0].pattern).toBe('test-pattern')
  })
})