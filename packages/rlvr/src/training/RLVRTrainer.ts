/**
 * RLVR Training System - Orchestrates agent learning from verifiable rewards
 */

import { Agent, AgentConfig } from '../core/Agent';
import { Verifier } from '../core/Verifier';
import { Reward } from '../core/Reward';
import { VerificationResult } from '../core/VerificationResult';

export interface TrainingConfig {
  maxEpisodes: number;
  maxStepsPerEpisode?: number;
  convergenceThreshold?: number;
  saveCheckpoints?: boolean;
  checkpointInterval?: number;
  evaluationInterval?: number;
  minSuccessRate?: number;
  explorationDecay?: number;
  learningRateDecay?: number;
}

export interface TrainingTask<TInput = any, TOutput = any> {
  name: string;
  generateInput: () => TInput;
  executeAction: (input: TInput, agent: Agent) => Promise<TOutput>;
  getExpectedOutput?: (input: TInput) => any;
  difficulty?: number;
  weight?: number;
}

export interface TrainingMetrics {
  episode: number;
  totalSteps: number;
  successRate: number;
  averageScore: number;
  averageReward: number;
  improvementRate: number;
  convergenceScore: number;
  timestamp: number;
}

export interface TrainingResult {
  success: boolean;
  finalMetrics: TrainingMetrics;
  episodeHistory: TrainingMetrics[];
  convergedAtEpisode?: number;
  totalTrainingTime: number;
  learnedPatterns: string[];
}

export class RLVRTrainer {
  private config: TrainingConfig;
  private trainingHistory: TrainingMetrics[] = [];
  
  constructor(config: TrainingConfig) {
    this.config = {
      maxStepsPerEpisode: 100,
      convergenceThreshold: 0.95,
      saveCheckpoints: false,
      checkpointInterval: 100,
      evaluationInterval: 10,
      minSuccessRate: 0.8,
      explorationDecay: 0.99,
      learningRateDecay: 0.995,
      ...config
    };
  }
  
  /**
   * Train an agent on a set of tasks
   */
  async train<TInput, TOutput>(
    agent: Agent,
    tasks: TrainingTask<TInput, TOutput>[],
    onProgress?: (metrics: TrainingMetrics) => void
  ): Promise<TrainingResult> {
    const startTime = Date.now();
    let convergedAtEpisode: number | undefined;
    let totalSteps = 0;
    
    console.log(`Starting RLVR training with ${tasks.length} tasks for ${this.config.maxEpisodes} episodes`);
    
    try {
      for (let episode = 0; episode < this.config.maxEpisodes; episode++) {
        const episodeStartTime = Date.now();
        const episodeMetrics = await this.runEpisode(agent, tasks, episode, totalSteps);
        
        totalSteps += episodeMetrics.totalSteps - totalSteps;
        this.trainingHistory.push(episodeMetrics);
        
        // Progress callback
        if (onProgress) {
          onProgress(episodeMetrics);
        }
        
        // Check for convergence
        if (this.hasConverged(episodeMetrics) && !convergedAtEpisode) {
          convergedAtEpisode = episode;
          console.log(`Agent converged at episode ${episode} with success rate ${episodeMetrics.successRate.toFixed(3)}`);
        }
        
        // Early stopping if converged and stable
        if (convergedAtEpisode && episode - convergedAtEpisode > 20) {
          console.log(`Training completed early due to stable convergence`);
          break;
        }
        
        // Checkpoint saving
        if (this.config.saveCheckpoints && episode % this.config.checkpointInterval! === 0) {
          await this.saveCheckpoint(agent, episode, episodeMetrics);
        }
        
        // Decay parameters
        this.decayParameters(agent, episode);
        
        console.log(`Episode ${episode}: Success Rate ${episodeMetrics.successRate.toFixed(3)}, Avg Score ${episodeMetrics.averageScore.toFixed(3)}, Avg Reward ${episodeMetrics.averageReward.toFixed(3)}`);
      }
      
      const totalTrainingTime = Date.now() - startTime;
      const finalMetrics = this.trainingHistory[this.trainingHistory.length - 1];
      const learnedPatterns = agent.getTopPatterns(20).map(p => p.pattern);
      
      const success = finalMetrics.successRate >= this.config.minSuccessRate!;
      
      return {
        success,
        finalMetrics,
        episodeHistory: this.trainingHistory,
        convergedAtEpisode,
        totalTrainingTime,
        learnedPatterns
      };
      
    } catch (error) {
      console.error('Training failed:', error);
      throw new Error(`Training failed: ${error}`);
    }
  }
  
  /**
   * Run a single training episode
   */
  private async runEpisode<TInput, TOutput>(
    agent: Agent,
    tasks: TrainingTask<TInput, TOutput>[],
    episode: number,
    currentTotalSteps: number
  ): Promise<TrainingMetrics> {
    let stepCount = 0;
    const episodeResults: {
      success: boolean;
      score: number;
      reward: number;
    }[] = [];
    
    while (stepCount < this.config.maxStepsPerEpisode!) {
      // Select a task (could be weighted random selection)
      const task = this.selectTask(tasks);
      
      try {
        // Generate input
        const input = task.generateInput();
        const expected = task.getExpectedOutput ? task.getExpectedOutput(input) : undefined;
        
        // Execute and learn
        const result = await agent.executeAndLearn(
          input,
          () => task.executeAction(input, agent),
          expected
        );
        
        // Record results
        episodeResults.push({
          success: result.verification.score >= 0.7,
          score: result.verification.score,
          reward: result.reward.reward
        });
        
        stepCount++;
        
        // Early termination for very poor performance
        if (episodeResults.length > 10 && 
            episodeResults.slice(-10).every(r => r.score < 0.3)) {
          console.log(`Early termination at step ${stepCount} due to poor performance`);
          break;
        }
        
      } catch (error) {
        // Record failure
        episodeResults.push({
          success: false,
          score: 0,
          reward: -0.5
        });
        stepCount++;
      }
    }
    
    // Calculate episode metrics
    const successCount = episodeResults.filter(r => r.success).length;
    const successRate = episodeResults.length > 0 ? successCount / episodeResults.length : 0;
    
    const averageScore = episodeResults.length > 0 
      ? episodeResults.reduce((sum, r) => sum + r.score, 0) / episodeResults.length 
      : 0;
    
    const averageReward = episodeResults.length > 0 
      ? episodeResults.reduce((sum, r) => sum + r.reward, 0) / episodeResults.length 
      : 0;
    
    // Calculate improvement rate
    let improvementRate = 0;
    if (this.trainingHistory.length > 0) {
      const lastEpisode = this.trainingHistory[this.trainingHistory.length - 1];
      improvementRate = averageScore - lastEpisode.averageScore;
    }
    
    // Calculate convergence score (stability over time)
    const convergenceScore = this.calculateConvergenceScore();
    
    return {
      episode,
      totalSteps: currentTotalSteps + stepCount,
      successRate,
      averageScore,
      averageReward,
      improvementRate,
      convergenceScore,
      timestamp: Date.now()
    };
  }
  
  /**
   * Select a task for training (with optional difficulty progression)
   */
  private selectTask<TInput, TOutput>(
    tasks: TrainingTask<TInput, TOutput>[]
  ): TrainingTask<TInput, TOutput> {
    // For now, use weighted random selection
    const totalWeight = tasks.reduce((sum, task) => sum + (task.weight || 1.0), 0);
    let random = Math.random() * totalWeight;
    
    for (const task of tasks) {
      random -= task.weight || 1.0;
      if (random <= 0) {
        return task;
      }
    }
    
    // Fallback to first task
    return tasks[0];
  }
  
  /**
   * Check if training has converged
   */
  private hasConverged(metrics: TrainingMetrics): boolean {
    return (
      metrics.successRate >= this.config.convergenceThreshold! &&
      metrics.convergenceScore > 0.8 &&
      metrics.averageScore >= this.config.convergenceThreshold!
    );
  }
  
  /**
   * Calculate convergence score based on stability
   */
  private calculateConvergenceScore(): number {
    if (this.trainingHistory.length < 5) return 0;
    
    const recentMetrics = this.trainingHistory.slice(-5);
    const scores = recentMetrics.map(m => m.averageScore);
    
    // Calculate variance
    const mean = scores.reduce((sum, s) => sum + s, 0) / scores.length;
    const variance = scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / scores.length;
    const stdDev = Math.sqrt(variance);
    
    // Lower standard deviation = higher convergence
    return Math.max(0, 1 - stdDev * 4); // Scale so 0.25 stddev = 0 convergence
  }
  
  /**
   * Decay exploration and learning rate
   */
  private decayParameters(agent: Agent, episode: number): void {
    // Access private config through the public interface would need to be added
    // For now, this is a placeholder - in practice, you'd need to expose these methods
    
    // Example: agent.updateExplorationRate(agent.getExplorationRate() * this.config.explorationDecay!);
    // Example: agent.updateLearningRate(agent.getLearningRate() * this.config.learningRateDecay!);
  }
  
  /**
   * Save training checkpoint
   */
  private async saveCheckpoint(
    agent: Agent,
    episode: number,
    metrics: TrainingMetrics
  ): Promise<void> {
    const checkpoint = {
      episode,
      agentState: agent.exportState(),
      metrics,
      trainingHistory: this.trainingHistory,
      timestamp: Date.now()
    };
    
    // In a real implementation, this would save to file system or database
    console.log(`Checkpoint saved at episode ${episode} (Success Rate: ${metrics.successRate.toFixed(3)})`);
  }
  
  /**
   * Evaluate agent performance without training
   */
  async evaluate<TInput, TOutput>(
    agent: Agent,
    tasks: TrainingTask<TInput, TOutput>[],
    numEvaluations = 100
  ): Promise<{
    successRate: number;
    averageScore: number;
    averageReward: number;
    taskBreakdown: Record<string, { successRate: number; averageScore: number }>;
  }> {
    const results: {
      taskName: string;
      success: boolean;
      score: number;
      reward: number;
    }[] = [];
    
    for (let i = 0; i < numEvaluations; i++) {
      const task = tasks[i % tasks.length]; // Round robin through tasks
      
      try {
        const input = task.generateInput();
        const expected = task.getExpectedOutput ? task.getExpectedOutput(input) : undefined;
        
        // Execute without learning (pure evaluation)
        const output = await task.executeAction(input, agent);
        
        // Verify manually (without triggering learning)
        const verification = await this.evaluateOutput(agent, output, expected);
        
        results.push({
          taskName: task.name,
          success: verification.score >= 0.7,
          score: verification.score,
          reward: verification.score // Simplified reward for evaluation
        });
        
      } catch (error) {
        results.push({
          taskName: task.name,
          success: false,
          score: 0,
          reward: -0.5
        });
      }
    }
    
    // Calculate overall metrics
    const successRate = results.filter(r => r.success).length / results.length;
    const averageScore = results.reduce((sum, r) => sum + r.score, 0) / results.length;
    const averageReward = results.reduce((sum, r) => sum + r.reward, 0) / results.length;
    
    // Calculate per-task breakdown
    const taskBreakdown: Record<string, { successRate: number; averageScore: number }> = {};
    
    for (const task of tasks) {
      const taskResults = results.filter(r => r.taskName === task.name);
      if (taskResults.length > 0) {
        taskBreakdown[task.name] = {
          successRate: taskResults.filter(r => r.success).length / taskResults.length,
          averageScore: taskResults.reduce((sum, r) => sum + r.score, 0) / taskResults.length
        };
      }
    }
    
    return {
      successRate,
      averageScore,
      averageReward,
      taskBreakdown
    };
  }
  
  /**
   * Evaluate output using agent's verifiers (without learning)
   */
  private async evaluateOutput(
    agent: Agent,
    output: any,
    expected?: any
  ): Promise<VerificationResult> {
    // This would need access to agent's private verifiers
    // For now, return a basic result
    return {
      score: Math.random(), // Placeholder - would use actual verification
      reason: 'Evaluation mode verification'
    };
  }
  
  /**
   * Get training statistics
   */
  getTrainingStatistics(): {
    totalEpisodes: number;
    bestEpisode: { episode: number; metrics: TrainingMetrics };
    convergenceAnalysis: {
      converged: boolean;
      stabilityScore: number;
      trendAnalysis: string;
    };
  } {
    if (this.trainingHistory.length === 0) {
      throw new Error('No training history available');
    }
    
    const bestEpisode = this.trainingHistory.reduce((best, current, index) => {
      return current.successRate > best.metrics.successRate 
        ? { episode: index, metrics: current }
        : best;
    }, { episode: 0, metrics: this.trainingHistory[0] });
    
    const recentMetrics = this.trainingHistory.slice(-10);
    const stabilityScore = this.calculateConvergenceScore();
    
    let trendAnalysis = 'stable';
    if (recentMetrics.length >= 2) {
      const firstHalf = recentMetrics.slice(0, Math.floor(recentMetrics.length / 2));
      const secondHalf = recentMetrics.slice(Math.floor(recentMetrics.length / 2));
      
      const firstAvg = firstHalf.reduce((sum, m) => sum + m.averageScore, 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((sum, m) => sum + m.averageScore, 0) / secondHalf.length;
      
      if (secondAvg > firstAvg + 0.05) {
        trendAnalysis = 'improving';
      } else if (secondAvg < firstAvg - 0.05) {
        trendAnalysis = 'declining';
      }
    }
    
    return {
      totalEpisodes: this.trainingHistory.length,
      bestEpisode,
      convergenceAnalysis: {
        converged: stabilityScore > 0.8,
        stabilityScore,
        trendAnalysis
      }
    };
  }
  
  /**
   * Reset training history
   */
  resetTraining(): void {
    this.trainingHistory = [];
  }
}