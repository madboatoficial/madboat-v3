/**
 * Graded reward system - smooth reward curve based on score
 */

import { Reward, RewardConfig, RewardCalculation } from '../core/Reward';
import { VerificationResult } from '../core/VerificationResult';

export interface GradedRewardConfig extends RewardConfig {
  curve?: 'linear' | 'exponential' | 'logarithmic' | 'sigmoid';
  steepness?: number;
  bonusThresholds?: { threshold: number; bonus: number }[];
}

export class GradedReward extends Reward {
  private curve: string;
  private steepness: number;
  private bonusThresholds: { threshold: number; bonus: number }[];
  
  constructor(config: GradedRewardConfig) {
    super(config);
    
    this.curve = config.curve || 'linear';
    this.steepness = config.steepness || 1.0;
    this.bonusThresholds = config.bonusThresholds || [];
  }
  
  calculate(result: VerificationResult): RewardCalculation {
    const score = Math.max(0, Math.min(1, result.score));
    
    // Apply curve transformation
    let transformedScore = this.applyCurve(score);
    
    // Apply bonuses
    let bonus = 0;
    for (const { threshold, bonus: bonusValue } of this.bonusThresholds) {
      if (score >= threshold) {
        bonus += bonusValue;
      }
    }
    
    const baseReward = transformedScore + bonus;
    const reward = this.normalize(baseReward);
    
    // Calculate confidence based on score distribution
    const confidence = this.calculateConfidence(score, result);
    
    const reason = this.generateReason(score, transformedScore, bonus);
    
    return {
      reward,
      confidence,
      reason,
      breakdown: {
        raw_score: score,
        curve_transformed: transformedScore,
        bonus_applied: bonus,
        final_reward: reward
      },
      metadata: {
        curve: this.curve,
        steepness: this.steepness,
        bonuses_earned: this.bonusThresholds.filter(b => score >= b.threshold).length
      }
    };
  }
  
  private applyCurve(score: number): number {
    switch (this.curve) {
      case 'linear':
        return score;
        
      case 'exponential':
        // Exponential growth: more reward for higher scores
        return Math.pow(score, 2 - this.steepness);
        
      case 'logarithmic':
        // Logarithmic growth: diminishing returns for higher scores
        return Math.log(1 + score * this.steepness) / Math.log(1 + this.steepness);
        
      case 'sigmoid':
        // Sigmoid curve: smooth S-curve
        const x = (score - 0.5) * this.steepness * 10;
        return 1 / (1 + Math.exp(-x));
        
      default:
        return score;
    }
  }
  
  private calculateConfidence(score: number, result: VerificationResult): number {
    let confidence = 0.8; // Base confidence
    
    // Higher confidence for extreme scores
    if (score >= 0.9 || score <= 0.1) {
      confidence += 0.1;
    }
    
    // Higher confidence if we have detailed breakdown
    if (result.breakdown && Object.keys(result.breakdown).length > 2) {
      confidence += 0.05;
    }
    
    // Lower confidence if there are warnings
    if (result.warnings && result.warnings.length > 0) {
      confidence -= 0.1;
    }
    
    // Higher confidence if we have execution metadata
    if (result.metadata?.executionTime !== undefined) {
      confidence += 0.05;
    }
    
    return Math.max(0.5, Math.min(0.99, confidence));
  }
  
  private generateReason(score: number, transformedScore: number, bonus: number): string {
    const reasons: string[] = [];
    
    if (score >= 0.9) {
      reasons.push('excellent performance');
    } else if (score >= 0.7) {
      reasons.push('good performance');
    } else if (score >= 0.5) {
      reasons.push('acceptable performance');
    } else {
      reasons.push('poor performance');
    }
    
    if (this.curve !== 'linear') {
      const improvement = ((transformedScore - score) * 100);
      if (improvement > 5) {
        reasons.push(`${this.curve} curve boosted reward by ${improvement.toFixed(1)}%`);
      } else if (improvement < -5) {
        reasons.push(`${this.curve} curve reduced reward by ${Math.abs(improvement).toFixed(1)}%`);
      }
    }
    
    if (bonus > 0) {
      reasons.push(`earned ${bonus.toFixed(2)} bonus points`);
    }
    
    return reasons.join(', ');
  }
  
  /**
   * Create a reward with exponential growth for high performers
   */
  static exponential(name: string, steepness = 0.5): GradedReward {
    return new GradedReward({
      name,
      curve: 'exponential',
      steepness,
      bonusThresholds: [
        { threshold: 0.95, bonus: 0.1 },
        { threshold: 0.99, bonus: 0.2 }
      ]
    });
  }
  
  /**
   * Create a reward with diminishing returns
   */
  static logarithmic(name: string, steepness = 2.0): GradedReward {
    return new GradedReward({
      name,
      curve: 'logarithmic',
      steepness
    });
  }
  
  /**
   * Create a reward with smooth S-curve progression
   */
  static sigmoid(name: string, steepness = 1.0): GradedReward {
    return new GradedReward({
      name,
      curve: 'sigmoid',
      steepness,
      threshold: 0.5 // Sigmoid center point
    });
  }
}