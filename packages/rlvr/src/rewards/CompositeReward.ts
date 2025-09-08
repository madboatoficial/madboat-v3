/**
 * Composite reward system - combines multiple rewards with weights
 */

import { Reward, RewardConfig, RewardCalculation } from '../core/Reward';
import { VerificationResult } from '../core/VerificationResult';

export interface CompositeRewardConfig extends RewardConfig {
  rewards: Reward[];
  aggregationMethod?: 'weighted_average' | 'max' | 'min' | 'product' | 'harmonic_mean';
  penalizeInconsistency?: boolean;
  consistencyThreshold?: number;
}

export class CompositeReward extends Reward {
  private rewards: Reward[];
  private aggregationMethod: string;
  private penalizeInconsistency: boolean;
  private consistencyThreshold: number;
  
  constructor(config: CompositeRewardConfig) {
    super(config);
    
    this.rewards = config.rewards || [];
    this.aggregationMethod = config.aggregationMethod || 'weighted_average';
    this.penalizeInconsistency = config.penalizeInconsistency ?? true;
    this.consistencyThreshold = config.consistencyThreshold || 0.3;
  }
  
  calculate(result: VerificationResult): RewardCalculation {
    if (this.rewards.length === 0) {
      throw new Error('No rewards configured for composite reward');
    }
    
    // Calculate individual rewards
    const individualResults = this.rewards.map(reward => ({
      reward,
      calculation: reward.calculate(result)
    }));
    
    // Aggregate rewards
    const aggregatedReward = this.aggregateRewards(individualResults);
    
    // Check consistency
    const consistency = this.calculateConsistency(individualResults);
    const consistencyPenalty = this.calculateConsistencyPenalty(consistency);
    
    // Apply consistency penalty if enabled
    const finalReward = this.penalizeInconsistency 
      ? aggregatedReward - consistencyPenalty
      : aggregatedReward;
    
    // Calculate overall confidence
    const confidence = this.calculateOverallConfidence(individualResults, consistency);
    
    const reason = this.generateCompositeReason(
      individualResults,
      aggregatedReward,
      consistency,
      consistencyPenalty
    );
    
    return {
      reward: this.normalize(finalReward),
      confidence,
      reason,
      breakdown: {
        aggregated_reward: aggregatedReward,
        consistency_score: consistency,
        consistency_penalty: consistencyPenalty,
        final_reward: finalReward,
        ...this.createIndividualBreakdown(individualResults)
      },
      metadata: {
        aggregation_method: this.aggregationMethod,
        num_rewards: this.rewards.length,
        individual_results: individualResults.map(r => ({
          name: r.reward.getName(),
          reward: r.calculation.reward,
          confidence: r.calculation.confidence
        }))
      }
    };
  }
  
  private aggregateRewards(results: { reward: Reward; calculation: RewardCalculation }[]): number {
    const values = results.map(r => r.calculation.reward);
    const weights = results.map(r => r.reward.getWeight());
    
    switch (this.aggregationMethod) {
      case 'weighted_average':
        return this.weightedAverage(values, weights);
        
      case 'max':
        return Math.max(...values);
        
      case 'min':
        return Math.min(...values);
        
      case 'product':
        // Geometric mean with weights
        const weightedProduct = values.reduce((prod, val, i) => 
          prod * Math.pow(Math.max(0.01, val), weights[i]), 1
        );
        const totalWeight = weights.reduce((sum, w) => sum + w, 0);
        return Math.pow(weightedProduct, 1 / totalWeight);
        
      case 'harmonic_mean':
        return this.harmonicMean(values, weights);
        
      default:
        return this.weightedAverage(values, weights);
    }
  }
  
  private weightedAverage(values: number[], weights: number[]): number {
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    if (totalWeight === 0) return 0;
    
    return values.reduce((sum, val, i) => sum + val * weights[i], 0) / totalWeight;
  }
  
  private harmonicMean(values: number[], weights: number[]): number {
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    if (totalWeight === 0) return 0;
    
    const harmonicSum = values.reduce((sum, val, i) => {
      const positiveVal = Math.max(0.01, val); // Avoid division by zero
      return sum + weights[i] / positiveVal;
    }, 0);
    
    return totalWeight / harmonicSum;
  }
  
  private calculateConsistency(results: { reward: Reward; calculation: RewardCalculation }[]): number {
    if (results.length <= 1) return 1.0;
    
    const rewards = results.map(r => r.calculation.reward);
    const mean = rewards.reduce((sum, r) => sum + r, 0) / rewards.length;
    
    // Calculate standard deviation
    const variance = rewards.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / rewards.length;
    const stdDev = Math.sqrt(variance);
    
    // Convert to consistency score (higher is more consistent)
    // Maximum possible std dev is when values are at extremes (0 and 1)
    const maxStdDev = 0.5;
    const consistencyScore = 1.0 - Math.min(stdDev / maxStdDev, 1.0);
    
    return consistencyScore;
  }
  
  private calculateConsistencyPenalty(consistency: number): number {
    if (consistency >= this.consistencyThreshold) {
      return 0; // No penalty for consistent rewards
    }
    
    // Linear penalty based on how far below threshold
    const penaltyFactor = (this.consistencyThreshold - consistency) / this.consistencyThreshold;
    return penaltyFactor * 0.2; // Maximum penalty of 0.2
  }
  
  private calculateOverallConfidence(
    results: { reward: Reward; calculation: RewardCalculation }[],
    consistency: number
  ): number {
    // Average individual confidences
    const avgConfidence = results.reduce(
      (sum, r) => sum + r.calculation.confidence, 0
    ) / results.length;
    
    // Boost confidence if rewards are consistent
    const consistencyBoost = consistency * 0.1;
    
    // Reduce confidence if too few verifiers
    const diversityPenalty = results.length < 3 ? 0.05 : 0;
    
    return Math.max(0.3, Math.min(0.99, avgConfidence + consistencyBoost - diversityPenalty));
  }
  
  private generateCompositeReason(
    results: { reward: Reward; calculation: RewardCalculation }[],
    aggregatedReward: number,
    consistency: number,
    consistencyPenalty: number
  ): string {
    const reasons: string[] = [];
    
    // Overall assessment
    if (aggregatedReward >= 0.8) {
      reasons.push('strong composite performance');
    } else if (aggregatedReward >= 0.6) {
      reasons.push('good composite performance');
    } else if (aggregatedReward >= 0.4) {
      reasons.push('moderate composite performance');
    } else {
      reasons.push('weak composite performance');
    }
    
    // Aggregation method
    reasons.push(`using ${this.aggregationMethod.replace('_', ' ')}`);
    
    // Individual contributors
    const topPerformers = results
      .filter(r => r.calculation.reward >= 0.7)
      .map(r => r.reward.getName());
    
    if (topPerformers.length > 0) {
      reasons.push(`strong: ${topPerformers.join(', ')}`);
    }
    
    const weakPerformers = results
      .filter(r => r.calculation.reward < 0.4)
      .map(r => r.reward.getName());
    
    if (weakPerformers.length > 0) {
      reasons.push(`weak: ${weakPerformers.join(', ')}`);
    }
    
    // Consistency assessment
    if (consistency < this.consistencyThreshold) {
      reasons.push(`inconsistent rewards (${consistency.toFixed(2)})`);
    }
    
    if (consistencyPenalty > 0) {
      reasons.push(`${(consistencyPenalty * 100).toFixed(1)}% penalty applied`);
    }
    
    return reasons.join(', ');
  }
  
  private createIndividualBreakdown(
    results: { reward: Reward; calculation: RewardCalculation }[]
  ): Record<string, number> {
    const breakdown: Record<string, number> = {};
    
    results.forEach(({ reward, calculation }) => {
      const name = reward.getName().toLowerCase().replace(/\s+/g, '_');
      breakdown[`${name}_reward`] = calculation.reward;
      breakdown[`${name}_confidence`] = calculation.confidence;
    });
    
    return breakdown;
  }
  
  /**
   * Add a reward to the composite
   */
  addReward(reward: Reward): void {
    this.rewards.push(reward);
  }
  
  /**
   * Remove a reward from the composite
   */
  removeReward(rewardName: string): boolean {
    const index = this.rewards.findIndex(r => r.getName() === rewardName);
    if (index >= 0) {
      this.rewards.splice(index, 1);
      return true;
    }
    return false;
  }
  
  /**
   * Get all rewards in the composite
   */
  getRewards(): Reward[] {
    return [...this.rewards];
  }
  
  /**
   * Create a balanced composite reward with common verifiers
   */
  static balanced(name: string, rewards: Reward[]): CompositeReward {
    return new CompositeReward({
      name,
      rewards,
      aggregationMethod: 'weighted_average',
      penalizeInconsistency: true,
      consistencyThreshold: 0.7
    });
  }
  
  /**
   * Create a strict composite that requires all rewards to be high
   */
  static strict(name: string, rewards: Reward[]): CompositeReward {
    return new CompositeReward({
      name,
      rewards,
      aggregationMethod: 'min', // Weakest link determines score
      penalizeInconsistency: false, // Inconsistency is expected with min
      consistencyThreshold: 0.5
    });
  }
  
  /**
   * Create an optimistic composite that rewards peak performance
   */
  static optimistic(name: string, rewards: Reward[]): CompositeReward {
    return new CompositeReward({
      name,
      rewards,
      aggregationMethod: 'max', // Best performance determines score
      penalizeInconsistency: true,
      consistencyThreshold: 0.6
    });
  }
}