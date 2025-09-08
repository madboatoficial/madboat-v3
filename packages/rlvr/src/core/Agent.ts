/**
 * @madboat/rlvr
 * @file src/core/Agent.ts
 * @version 1.0.0
 * @created 2025-09-06
 * @modified 2025-09-06
 * @author Claude Sonnet 4 + Captain Sandro Fidelis
 * @description RLVR Agent - Self-improving agent with verification-based learning
 * @agent-accessible true
 * @tags agent, learning, memory, patterns, rlvr
 * @madboat-version v2.0
 */

import { Verifier } from './Verifier';
import { VerificationResult } from './VerificationResult';
import { Reward, RewardCalculation } from './Reward';

export interface AgentConfig {
  name: string;
  verifiers: Verifier[];
  rewards: Reward[];
  learningRate?: number;
  memorySize?: number;
  explorationRate?: number;
  enablePatternLearning?: boolean;
}

export interface AgentMemory {
  input: any;
  output: any;
  expected?: any;
  verification: VerificationResult;
  reward: RewardCalculation;
  timestamp: number;
  patterns?: string[];
}

export interface AgentMetrics {
  totalAttempts: number;
  successfulAttempts: number;
  averageScore: number;
  averageReward: number;
  improvementRate: number;
  recentPerformance: number[];
  learnedPatterns: string[];
}

export class Agent {
  private config: AgentConfig;
  private memory: AgentMemory[] = [];
  private patterns: Map<string, number> = new Map();
  private performanceHistory: number[] = [];
  
  constructor(config: AgentConfig) {
    this.config = {
      learningRate: 0.1,
      memorySize: 1000,
      explorationRate: 0.1,
      enablePatternLearning: true,
      ...config
    };
  }
  
  /**
   * Execute an action and learn from verification results
   */
  async executeAndLearn<T>(
    input: any,
    action: () => Promise<T>,
    expected?: any
  ): Promise<{
    output: T;
    verification: VerificationResult;
    reward: RewardCalculation;
    learned: boolean;
  }> {
    try {
      // Execute the action
      const output = await action();
      
      // Verify the result
      const verification = await this.verifyOutput(output, expected);
      
      // Calculate reward
      const reward = this.calculateReward(verification);
      
      // Learn from the experience
      const learned = this.learn({
        input,
        output,
        expected,
        verification,
        reward,
        timestamp: Date.now(),
        patterns: verification.learnedPattern ? [verification.learnedPattern] : undefined
      });
      
      // Update performance tracking
      this.updatePerformanceHistory(verification.score);
      
      return {
        output,
        verification,
        reward,
        learned
      };
      
    } catch (error) {
      // Handle errors by creating a failure record
      const verification: VerificationResult = {
        score: 0,
        reason: `Execution error: ${error}`,
        errors: [String(error)]
      };
      
      const reward = this.calculateReward(verification);
      
      this.learn({
        input,
        output: null,
        expected,
        verification,
        reward,
        timestamp: Date.now()
      });
      
      throw error;
    }
  }
  
  /**
   * Verify output using all configured verifiers
   */
  private async verifyOutput(output: any, expected?: any): Promise<VerificationResult> {
    if (this.config.verifiers.length === 0) {
      return {
        score: 0.5,
        reason: 'No verifiers configured'
      };
    }
    
    // Run all verifiers in parallel
    const verificationPromises = this.config.verifiers.map(async verifier => {
      try {
        return await verifier.verifyWithCache(output, expected);
      } catch (error) {
        return {
          score: 0,
          reason: `Verifier ${verifier.getName()} failed: ${error}`,
          errors: [String(error)]
        };
      }
    });
    
    const results = await Promise.all(verificationPromises);
    
    // Combine verification results
    return this.combineVerificationResults(results);
  }
  
  /**
   * Calculate reward using all configured reward functions
   */
  private calculateReward(verification: VerificationResult): RewardCalculation {
    if (this.config.rewards.length === 0) {
      return {
        reward: verification.score,
        confidence: 0.5,
        reason: 'Direct score mapping (no reward functions configured)'
      };
    }
    
    // Calculate all rewards
    const rewardCalculations = this.config.rewards.map(reward => {
      try {
        return reward.calculate(verification);
      } catch (error) {
        return {
          reward: 0,
          confidence: 0.1,
          reason: `Reward calculation failed: ${error}`
        };
      }
    });
    
    // Aggregate rewards (weighted average)
    const totalWeight = this.config.rewards.reduce((sum, r) => sum + r.getWeight(), 0);
    const weightedReward = rewardCalculations.reduce((sum, calc, i) => {
      const weight = this.config.rewards[i].getWeight();
      return sum + calc.reward * weight;
    }, 0) / totalWeight;
    
    const avgConfidence = rewardCalculations.reduce((sum, calc) => 
      sum + calc.confidence, 0
    ) / rewardCalculations.length;
    
    return {
      reward: weightedReward,
      confidence: avgConfidence,
      reason: `Aggregated from ${this.config.rewards.length} reward functions`,
      breakdown: rewardCalculations.reduce((breakdown, calc, i) => {
        const name = this.config.rewards[i].getName();
        breakdown[name] = calc.reward;
        return breakdown;
      }, {} as Record<string, number>),
      metadata: {
        individual_calculations: rewardCalculations
      }
    };
  }
  
  /**
   * Learn from experience and update internal models
   */
  private learn(memory: AgentMemory): boolean {
    // Add to memory
    this.memory.push(memory);
    
    // Trim memory if needed
    if (this.memory.length > this.config.memorySize!) {
      this.memory.shift();
    }
    
    let learned = false;
    
    // Pattern learning
    if (this.config.enablePatternLearning && memory.patterns) {
      for (const pattern of memory.patterns) {
        const count = this.patterns.get(pattern) || 0;
        this.patterns.set(pattern, count + 1);
        learned = true;
      }
    }
    
    // Adaptive learning (adjust exploration based on recent performance)
    this.adaptExploration();
    
    return learned;
  }
  
  /**
   * Combine multiple verification results into a single result
   */
  private combineVerificationResults(results: VerificationResult[]): VerificationResult {
    if (results.length === 0) {
      return { score: 0, reason: 'No verification results' };
    }
    
    if (results.length === 1) {
      return results[0];
    }
    
    // Weighted average of scores
    const totalWeight = this.config.verifiers.reduce((sum, v) => sum + v.getWeight(), 0);
    const weightedScore = results.reduce((sum, result, i) => {
      const weight = this.config.verifiers[i].getWeight();
      return sum + result.score * weight;
    }, 0) / totalWeight;
    
    // Combine breakdowns
    const combinedBreakdown: Record<string, number> = {};
    results.forEach((result, i) => {
      const verifierName = this.config.verifiers[i].getName();
      combinedBreakdown[verifierName] = result.score;
      
      if (result.breakdown) {
        Object.entries(result.breakdown).forEach(([key, value]) => {
          combinedBreakdown[`${verifierName}_${key}`] = value || 0;
        });
      }
    });
    
    // Collect all errors and warnings
    const allErrors = results.flatMap(r => r.errors || []);
    const allWarnings = results.flatMap(r => r.warnings || []);
    
    // Collect learned patterns
    const learnedPatterns = results
      .map(r => r.learnedPattern)
      .filter(p => p)
      .join('; ');
    
    return {
      score: weightedScore,
      reason: `Combined verification from ${results.length} verifiers`,
      breakdown: combinedBreakdown,
      errors: allErrors.length > 0 ? allErrors : undefined,
      warnings: allWarnings.length > 0 ? allWarnings : undefined,
      learnedPattern: learnedPatterns || undefined,
      confidence: results.reduce((sum, r) => sum + (r.confidence || 0.5), 0) / results.length
    };
  }
  
  /**
   * Update performance history and calculate improvement rate
   */
  private updatePerformanceHistory(score: number): void {
    this.performanceHistory.push(score);
    
    // Keep only recent history (last 100 attempts)
    if (this.performanceHistory.length > 100) {
      this.performanceHistory.shift();
    }
  }
  
  /**
   * Adapt exploration rate based on recent performance
   */
  private adaptExploration(): void {
    if (this.performanceHistory.length < 10) return;
    
    const recentScores = this.performanceHistory.slice(-10);
    const avgRecent = recentScores.reduce((sum, s) => sum + s, 0) / recentScores.length;
    
    const olderScores = this.performanceHistory.slice(-20, -10);
    if (olderScores.length > 0) {
      const avgOlder = olderScores.reduce((sum, s) => sum + s, 0) / olderScores.length;
      const improvement = avgRecent - avgOlder;
      
      // If improving, reduce exploration. If stagnating, increase exploration.
      if (improvement > 0.05) {
        this.config.explorationRate = Math.max(0.05, this.config.explorationRate! * 0.95);
      } else if (improvement < -0.02) {
        this.config.explorationRate = Math.min(0.3, this.config.explorationRate! * 1.05);
      }
    }
  }
  
  /**
   * Get agent metrics and performance statistics
   */
  getMetrics(): AgentMetrics {
    const totalAttempts = this.memory.length;
    const successfulAttempts = this.memory.filter(m => m.verification.score >= 0.7).length;
    
    const scores = this.memory.map(m => m.verification.score);
    const rewards = this.memory.map(m => m.reward.reward);
    
    const averageScore = scores.length > 0 
      ? scores.reduce((sum, s) => sum + s, 0) / scores.length 
      : 0;
    
    const averageReward = rewards.length > 0 
      ? rewards.reduce((sum, r) => sum + r, 0) / rewards.length 
      : 0;
    
    // Calculate improvement rate (recent vs older performance)
    let improvementRate = 0;
    if (this.performanceHistory.length >= 20) {
      const recentAvg = this.performanceHistory.slice(-10)
        .reduce((sum, s) => sum + s, 0) / 10;
      const olderAvg = this.performanceHistory.slice(-20, -10)
        .reduce((sum, s) => sum + s, 0) / 10;
      improvementRate = recentAvg - olderAvg;
    }
    
    const recentPerformance = this.performanceHistory.slice(-10);
    const learnedPatterns = Array.from(this.patterns.keys());
    
    return {
      totalAttempts,
      successfulAttempts,
      averageScore,
      averageReward,
      improvementRate,
      recentPerformance,
      learnedPatterns
    };
  }
  
  /**
   * Get the most successful patterns learned
   */
  getTopPatterns(limit = 10): { pattern: string; frequency: number }[] {
    return Array.from(this.patterns.entries())
      .map(([pattern, frequency]) => ({ pattern, frequency }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, limit);
  }
  
  /**
   * Get recent memory entries
   */
  getRecentMemory(limit = 10): AgentMemory[] {
    return this.memory.slice(-limit);
  }
  
  /**
   * Clear agent memory (useful for testing or reset)
   */
  clearMemory(): void {
    this.memory = [];
    this.patterns.clear();
    this.performanceHistory = [];
  }
  
  /**
   * Export agent state for persistence
   */
  exportState(): {
    config: AgentConfig;
    memory: AgentMemory[];
    patterns: Record<string, number>;
    performanceHistory: number[];
  } {
    return {
      config: this.config,
      memory: this.memory,
      patterns: Object.fromEntries(this.patterns),
      performanceHistory: this.performanceHistory
    };
  }
  
  /**
   * Import agent state from persistence
   */
  importState(state: {
    memory: AgentMemory[];
    patterns: Record<string, number>;
    performanceHistory: number[];
  }): void {
    this.memory = state.memory;
    this.patterns = new Map(Object.entries(state.patterns));
    this.performanceHistory = state.performanceHistory;
  }
}