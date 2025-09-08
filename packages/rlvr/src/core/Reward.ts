/**
 * @madboat/rlvr
 * @file src/core/Reward.ts
 * @version 1.0.0
 * @created 2025-09-06
 * @modified 2025-09-06
 * @author Claude Sonnet 4 + Captain Sandro Fidelis
 * @description Base reward system for RLVR
 * @agent-accessible true
 * @tags reward, abstract, calculation, normalization
 * @madboat-version v2.0
 */

import { VerificationResult } from './VerificationResult';

export interface RewardConfig {
  name: string;
  weight?: number;
  threshold?: number;
  maxReward?: number;
  minReward?: number;
}

export interface RewardCalculation {
  reward: number;
  confidence: number;
  reason: string;
  breakdown?: Record<string, number>;
  metadata?: Record<string, any>;
}

export abstract class Reward {
  protected config: RewardConfig;
  
  constructor(config: RewardConfig) {
    this.config = {
      weight: 1.0,
      threshold: 0.5,
      maxReward: 1.0,
      minReward: -1.0,
      ...config
    };
  }
  
  /**
   * Calculate reward from verification result
   */
  abstract calculate(result: VerificationResult): RewardCalculation;
  
  /**
   * Normalize reward value to configured range
   */
  protected normalize(value: number): number {
    return Math.max(
      this.config.minReward!,
      Math.min(this.config.maxReward!, value * this.config.weight!)
    );
  }
  
  /**
   * Apply threshold logic
   */
  protected applyThreshold(score: number): number {
    if (score >= this.config.threshold!) {
      return score;
    } else {
      // Penalty for not meeting threshold
      return score * 0.5 - 0.1;
    }
  }
  
  getName(): string {
    return this.config.name;
  }
  
  getWeight(): number {
    return this.config.weight || 1.0;
  }
}