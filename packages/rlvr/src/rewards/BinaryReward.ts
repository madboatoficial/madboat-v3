/**
 * Binary reward system - simple pass/fail
 */

import { Reward, RewardConfig, RewardCalculation } from '../core/Reward';
import { VerificationResult } from '../core/VerificationResult';

export interface BinaryRewardConfig extends RewardConfig {
  passThreshold?: number;
  passReward?: number;
  failReward?: number;
}

export class BinaryReward extends Reward {
  private passThreshold: number;
  private passReward: number;
  private failReward: number;
  
  constructor(config: BinaryRewardConfig) {
    super(config);
    
    this.passThreshold = config.passThreshold || 0.7;
    this.passReward = config.passReward || 1.0;
    this.failReward = config.failReward || -0.5;
  }
  
  calculate(result: VerificationResult): RewardCalculation {
    const passed = result.score >= this.passThreshold;
    const baseReward = passed ? this.passReward : this.failReward;
    
    // Apply normalization
    const reward = this.normalize(baseReward);
    
    // High confidence for binary decisions
    const confidence = passed ? 0.95 : 0.9;
    
    const reason = passed 
      ? `Passed threshold (${result.score.toFixed(3)} >= ${this.passThreshold})`
      : `Failed threshold (${result.score.toFixed(3)} < ${this.passThreshold})`;
    
    return {
      reward,
      confidence,
      reason,
      breakdown: {
        base_reward: baseReward,
        normalized_reward: reward,
        threshold_check: passed ? 1 : 0
      },
      metadata: {
        threshold: this.passThreshold,
        passed,
        actual_score: result.score
      }
    };
  }
  
  /**
   * Create a strict binary reward (0 or 1)
   */
  static strict(name: string, threshold = 0.8): BinaryReward {
    return new BinaryReward({
      name,
      passThreshold: threshold,
      passReward: 1.0,
      failReward: 0.0,
      minReward: 0.0,
      maxReward: 1.0
    });
  }
  
  /**
   * Create a lenient binary reward with negative penalties
   */
  static lenient(name: string, threshold = 0.5): BinaryReward {
    return new BinaryReward({
      name,
      passThreshold: threshold,
      passReward: 1.0,
      failReward: -0.2,
      minReward: -0.5,
      maxReward: 1.0
    });
  }
}