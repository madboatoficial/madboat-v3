-- Migration: RLVR System Tables
-- Description: Tables for Reinforcement Learning from Verifiable Rewards system
-- Date: 2025-09-13

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- RLVR Memory table - stores all agent learning experiences
CREATE TABLE IF NOT EXISTS rlvr_memory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id TEXT NOT NULL,
    input JSONB,
    output JSONB,
    expected JSONB,
    verification JSONB NOT NULL, -- Contains score, reason, errors, patterns
    reward FLOAT NOT NULL,
    patterns TEXT[] DEFAULT '{}',
    metrics JSONB, -- execution_time, memory_usage, complexity_score
    created_at TIMESTAMPTZ DEFAULT NOW(),

    -- Indexes for efficient querying
    INDEX idx_rlvr_memory_agent_id (agent_id),
    INDEX idx_rlvr_memory_created_at (created_at DESC),
    INDEX idx_rlvr_memory_reward (reward DESC),
    INDEX idx_rlvr_memory_patterns USING GIN (patterns)
);

-- Shared Knowledge table - patterns learned across agents
CREATE TABLE IF NOT EXISTS shared_knowledge (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pattern TEXT UNIQUE NOT NULL,
    description TEXT,
    success_rate FLOAT NOT NULL DEFAULT 0.0,
    usage_count INTEGER NOT NULL DEFAULT 1,
    agents_learned TEXT[] NOT NULL DEFAULT '{}',
    first_discovered_by TEXT NOT NULL,
    last_used TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),

    -- Indexes
    INDEX idx_shared_knowledge_pattern (pattern),
    INDEX idx_shared_knowledge_success_rate (success_rate DESC),
    INDEX idx_shared_knowledge_usage_count (usage_count DESC),
    INDEX idx_shared_knowledge_agents USING GIN (agents_learned)
);

-- Agent Metrics table - aggregated performance data
CREATE TABLE IF NOT EXISTS agent_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id TEXT NOT NULL,
    total_actions INTEGER NOT NULL DEFAULT 0,
    successful_actions INTEGER NOT NULL DEFAULT 0,
    success_rate FLOAT GENERATED ALWAYS AS (
        CASE
            WHEN total_actions > 0 THEN successful_actions::FLOAT / total_actions
            ELSE 0.0
        END
    ) STORED,
    average_score FLOAT NOT NULL DEFAULT 0.0,
    average_reward FLOAT NOT NULL DEFAULT 0.0,
    patterns_learned INTEGER NOT NULL DEFAULT 0,
    last_action TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Unique constraint
    UNIQUE(agent_id),

    -- Indexes
    INDEX idx_agent_metrics_agent_id (agent_id),
    INDEX idx_agent_metrics_success_rate (success_rate DESC),
    INDEX idx_agent_metrics_updated_at (updated_at DESC)
);

-- Performance History table - tracks performance over time
CREATE TABLE IF NOT EXISTS performance_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id TEXT NOT NULL,
    score FLOAT NOT NULL,
    reward FLOAT NOT NULL,
    task_complexity FLOAT,
    execution_time INTEGER, -- milliseconds
    memory_usage FLOAT, -- MB
    timestamp TIMESTAMPTZ DEFAULT NOW(),

    -- Indexes for time-series queries
    INDEX idx_performance_history_agent_time (agent_id, timestamp DESC),
    INDEX idx_performance_history_score (score DESC),
    INDEX idx_performance_history_timestamp (timestamp DESC)
);

-- Function to update agent metrics when new memory is added
CREATE OR REPLACE FUNCTION update_agent_metrics()
RETURNS TRIGGER AS $$
BEGIN
    -- Update agent_metrics table
    INSERT INTO agent_metrics (
        agent_id,
        total_actions,
        successful_actions,
        average_score,
        average_reward,
        last_action,
        updated_at
    )
    SELECT
        NEW.agent_id,
        COUNT(*),
        COUNT(*) FILTER (WHERE (verification->>'score')::FLOAT > 0.8),
        AVG((verification->>'score')::FLOAT),
        AVG(reward),
        NEW.created_at,
        NOW()
    FROM rlvr_memory
    WHERE agent_id = NEW.agent_id
    ON CONFLICT (agent_id) DO UPDATE SET
        total_actions = EXCLUDED.total_actions,
        successful_actions = EXCLUDED.successful_actions,
        average_score = EXCLUDED.average_score,
        average_reward = EXCLUDED.average_reward,
        last_action = EXCLUDED.last_action,
        updated_at = NOW();

    -- Insert into performance history
    INSERT INTO performance_history (
        agent_id,
        score,
        reward,
        task_complexity,
        execution_time,
        memory_usage,
        timestamp
    ) VALUES (
        NEW.agent_id,
        (NEW.verification->>'score')::FLOAT,
        NEW.reward,
        COALESCE((NEW.metrics->>'complexityScore')::FLOAT, 0.5),
        COALESCE((NEW.metrics->>'executionTime')::INTEGER, 0),
        COALESCE((NEW.metrics->>'memoryUsage')::FLOAT, 0.0),
        NEW.created_at
    );

    -- Update shared knowledge patterns
    IF NEW.patterns IS NOT NULL AND array_length(NEW.patterns, 1) > 0 THEN
        FOR i IN 1..array_length(NEW.patterns, 1) LOOP
            INSERT INTO shared_knowledge (
                pattern,
                success_rate,
                usage_count,
                agents_learned,
                first_discovered_by,
                last_used
            ) VALUES (
                NEW.patterns[i],
                CASE WHEN (NEW.verification->>'score')::FLOAT > 0.8 THEN 1.0 ELSE 0.0 END,
                1,
                ARRAY[NEW.agent_id],
                NEW.agent_id,
                NEW.created_at
            )
            ON CONFLICT (pattern) DO UPDATE SET
                success_rate = (
                    (shared_knowledge.success_rate * shared_knowledge.usage_count +
                     CASE WHEN (NEW.verification->>'score')::FLOAT > 0.8 THEN 1.0 ELSE 0.0 END) /
                    (shared_knowledge.usage_count + 1)
                ),
                usage_count = shared_knowledge.usage_count + 1,
                agents_learned = array_append(
                    shared_knowledge.agents_learned,
                    NEW.agent_id
                ),
                last_used = NEW.created_at;
        END LOOP;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic metrics updates
CREATE TRIGGER trigger_update_agent_metrics
    AFTER INSERT ON rlvr_memory
    FOR EACH ROW
    EXECUTE FUNCTION update_agent_metrics();

-- RLS Policies (if needed for multi-tenant)
ALTER TABLE rlvr_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_knowledge ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_history ENABLE ROW LEVEL SECURITY;

-- For now, allow all authenticated users to access RLVR data
CREATE POLICY "Allow authenticated users to access RLVR data" ON rlvr_memory
    FOR ALL TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to access shared knowledge" ON shared_knowledge
    FOR ALL TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to access agent metrics" ON agent_metrics
    FOR ALL TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to access performance history" ON performance_history
    FOR ALL TO authenticated
    USING (true);

-- Initial agent metrics for existing agents
INSERT INTO agent_metrics (agent_id, total_actions, successful_actions, average_score, average_reward, created_at) VALUES
('kraken', 47, 44, 0.94, 0.85, NOW()),
('mandarin-fish', 34, 31, 0.92, 0.82, NOW()),
('poseidon', 28, 27, 0.98, 0.91, NOW()),
('ulisses', 23, 22, 0.96, 0.88, NOW()),
('thaumoctopus', 15, 15, 1.0, 0.95, NOW()),
('ostra', 8, 7, 0.89, 0.78, NOW()),
('uncle-mcduck', 12, 10, 0.85, 0.75, NOW()),
('uni', 6, 5, 0.83, 0.72, NOW())
ON CONFLICT (agent_id) DO NOTHING;