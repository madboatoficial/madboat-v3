/**
 * Agent-Environment Loop for continuous RLVR learning
 * Implements the core interaction pattern between agent and environment
 */

import { Agent } from '../core/Agent';
import { VerificationResult } from '../core/VerificationResult';
import { RLVRTrainer, TrainingTask } from '../training/RLVRTrainer';
import { SyntheticGenerator } from '../training/SyntheticGenerator';

export interface Environment<TState = any, TAction = any, TObservation = any> {
  name: string;
  reset(): Promise<TState>;
  step(action: TAction): Promise<{
    observation: TObservation;
    reward: number;
    done: boolean;
    info?: any;
  }>;
  getState(): TState;
  isValidAction(action: TAction): boolean;
}

export interface LoopConfig {
  maxSteps?: number;
  maxEpisodes?: number;
  evaluationInterval?: number;
  checkpointInterval?: number;
  adaptiveTaskGeneration?: boolean;
  difficultyProgression?: boolean;
  realTimeAdaptation?: boolean;
}

export interface LoopMetrics {
  episode: number;
  step: number;
  totalReward: number;
  episodeReward: number;
  averageScore: number;
  explorationRate: number;
  learningProgress: number;
  environmentState: any;
  timestamp: number;
}

export interface LoopResult {
  success: boolean;
  totalEpisodes: number;
  totalSteps: number;
  finalMetrics: LoopMetrics;
  performanceHistory: LoopMetrics[];
  learnedBehaviors: string[];
}

export class AgentEnvironmentLoop<TState = any, TAction = any, TObservation = any> {
  private agent: Agent;
  private environment: Environment<TState, TAction, TObservation>;
  private config: LoopConfig;
  private trainer: RLVRTrainer;
  private syntheticGenerator: SyntheticGenerator;
  private metricsHistory: LoopMetrics[] = [];
  
  constructor(
    agent: Agent,
    environment: Environment<TState, TAction, TObservation>,
    config: LoopConfig = {}
  ) {
    this.agent = agent;
    this.environment = environment;
    this.config = {
      maxSteps: 1000,
      maxEpisodes: 100,
      evaluationInterval: 10,
      checkpointInterval: 25,
      adaptiveTaskGeneration: true,
      difficultyProgression: true,
      realTimeAdaptation: true,
      ...config
    };
    
    // Initialize trainer and synthetic generator
    this.trainer = new RLVRTrainer({
      maxEpisodes: this.config.maxEpisodes!,
      convergenceThreshold: 0.9,
      minSuccessRate: 0.8
    });
    
    this.syntheticGenerator = new SyntheticGenerator({
      categories: ['code', 'nlp', 'math', 'database'],
      difficultyRange: [0.1, 0.9],
      taskCount: 100
    });
  }
  
  /**
   * Run the agent-environment interaction loop
   */
  async run(onProgress?: (metrics: LoopMetrics) => void): Promise<LoopResult> {
    console.log(`Starting Agent-Environment Loop: ${this.environment.name}`);
    console.log(`Configuration: ${this.config.maxEpisodes} episodes, ${this.config.maxSteps} steps per episode`);
    
    let totalSteps = 0;
    const performanceHistory: LoopMetrics[] = [];
    
    try {
      for (let episode = 0; episode < this.config.maxEpisodes!; episode++) {
        const episodeResult = await this.runEpisode(episode, totalSteps);
        
        totalSteps += episodeResult.steps;
        performanceHistory.push(episodeResult.metrics);
        this.metricsHistory.push(episodeResult.metrics);
        
        // Progress callback
        if (onProgress) {
          onProgress(episodeResult.metrics);
        }
        
        // Evaluation and adaptation
        if (episode % this.config.evaluationInterval! === 0) {
          await this.evaluateAndAdapt(episode);
        }
        
        // Checkpointing
        if (episode % this.config.checkpointInterval! === 0) {
          await this.saveCheckpoint(episode, episodeResult.metrics);
        }
        
        // Check for convergence
        if (this.hasConverged()) {
          console.log(`Loop converged at episode ${episode}`);
          break;
        }
        
        console.log(`Episode ${episode}: Reward ${episodeResult.metrics.episodeReward.toFixed(3)}, ` +
                   `Avg Score ${episodeResult.metrics.averageScore.toFixed(3)}, ` +
                   `Steps ${episodeResult.steps}`);
      }
      
      const finalMetrics = performanceHistory[performanceHistory.length - 1];
      const learnedBehaviors = this.extractLearnedBehaviors();
      
      return {
        success: finalMetrics.averageScore >= 0.8,
        totalEpisodes: performanceHistory.length,
        totalSteps,
        finalMetrics,
        performanceHistory,
        learnedBehaviors
      };
      
    } catch (error) {
      console.error('Agent-Environment Loop failed:', error);
      throw new Error(`Loop execution failed: ${error}`);
    }
  }
  
  /**
   * Run a single episode
   */
  private async runEpisode(episode: number, totalStepsSoFar: number): Promise<{
    steps: number;
    metrics: LoopMetrics;
  }> {
    let state = await this.environment.reset();
    let done = false;
    let steps = 0;
    let episodeReward = 0;
    const episodeScores: number[] = [];
    
    while (!done && steps < this.config.maxSteps!) {
      try {
        // Agent selects action based on current state
        const action = await this.selectAction(state, episode);
        
        // Environment processes action
        const envResult = await this.environment.step(action);
        
        // Agent learns from the interaction
        const learnResult = await this.agent.executeAndLearn(
          { state, action },
          async () => envResult.observation,
          envResult.reward
        );
        
        // Update tracking
        episodeReward += envResult.reward;
        episodeScores.push(learnResult.verification.score);
        
        // Update state and check termination
        state = envResult.observation as TState;
        done = envResult.done;
        steps++;
        
        // Real-time adaptation
        if (this.config.realTimeAdaptation) {
          await this.adaptInRealTime(learnResult.verification, episode, steps);
        }
        
      } catch (error) {
        console.warn(`Step failed in episode ${episode}, step ${steps}:`, error);
        // Continue with penalty
        episodeReward -= 0.5;
        episodeScores.push(0);
        steps++;
      }
    }
    
    // Calculate episode metrics
    const averageScore = episodeScores.length > 0 
      ? episodeScores.reduce((sum, s) => sum + s, 0) / episodeScores.length 
      : 0;
    
    const metrics: LoopMetrics = {
      episode,
      step: totalStepsSoFar + steps,
      totalReward: this.metricsHistory.reduce((sum, m) => sum + m.episodeReward, 0) + episodeReward,
      episodeReward,
      averageScore,
      explorationRate: this.getExplorationRate(episode),
      learningProgress: this.calculateLearningProgress(),
      environmentState: this.environment.getState(),
      timestamp: Date.now()
    };
    
    return { steps, metrics };
  }
  
  /**
   * Select action based on current state
   */
  private async selectAction(state: TState, episode: number): Promise<TAction> {
    // This would typically use the agent's learned policy
    // For now, we'll generate synthetic actions based on the environment
    
    if (this.config.adaptiveTaskGeneration) {
      // Generate action based on synthetic task
      const task = this.generateAdaptiveTask(state, episode);
      return this.actionFromTask(task) as TAction;
    }
    
    // Default random action selection
    return this.generateRandomAction(state);
  }
  
  /**
   * Generate adaptive task based on current performance
   */
  private generateAdaptiveTask(state: TState, episode: number): any {
    const recentPerformance = this.getRecentPerformance();
    
    // Adjust difficulty based on performance
    let targetDifficulty = 0.5;
    if (recentPerformance > 0.8) {
      targetDifficulty = Math.min(0.9, recentPerformance + 0.1);
    } else if (recentPerformance < 0.5) {
      targetDifficulty = Math.max(0.2, recentPerformance - 0.1);
    }
    
    // Generate progressive tasks if enabled
    if (this.config.difficultyProgression) {
      const progressRatio = episode / this.config.maxEpisodes!;
      targetDifficulty = 0.2 + (progressRatio * 0.7); // Linear progression from 0.2 to 0.9
    }
    
    // Use synthetic generator to create appropriate task
    const categories = ['code', 'nlp', 'math', 'database'];
    const category = categories[episode % categories.length];
    
    const tasks = this.syntheticGenerator.generateProgressiveTasks(
      category, 1, targetDifficulty, targetDifficulty
    );
    
    return tasks[0] || { input: state, expectedOutput: null };
  }
  
  /**
   * Convert synthetic task to action
   */
  private actionFromTask(task: any): any {
    // This is environment-specific logic
    // In a real implementation, this would map tasks to valid environment actions
    return {
      type: 'process_task',
      task: task.input,
      expected: task.expectedOutput
    };
  }
  
  /**
   * Generate random valid action for fallback
   */
  private generateRandomAction(state: TState): TAction {
    // This should be implemented based on the specific environment
    // Return a default action structure
    return { type: 'default', data: state } as TAction;
  }
  
  /**
   * Real-time adaptation during episode
   */
  private async adaptInRealTime(
    verification: VerificationResult, 
    episode: number, 
    step: number
  ): Promise<void> {
    // Adjust exploration based on recent performance
    if (verification.score < 0.3 && step > 10) {
      // Increase exploration if performing poorly
      console.log(`Increasing exploration at episode ${episode}, step ${step}`);
      // This would adjust agent parameters
    } else if (verification.score > 0.9) {
      // Decrease exploration if performing very well
      console.log(`Decreasing exploration at episode ${episode}, step ${step}`);
    }
    
    // Learn from errors
    if (verification.errors && verification.errors.length > 0) {
      console.log(`Learning from errors: ${verification.errors.join(', ')}`);
      // This could trigger specific learning mechanisms
    }
  }
  
  /**
   * Evaluate and adapt between episodes
   */
  private async evaluateAndAdapt(episode: number): Promise<void> {
    console.log(`Evaluating performance at episode ${episode}`);
    
    const recentMetrics = this.metricsHistory.slice(-this.config.evaluationInterval!);
    const avgScore = recentMetrics.reduce((sum, m) => sum + m.averageScore, 0) / recentMetrics.length;
    const avgReward = recentMetrics.reduce((sum, m) => sum + m.episodeReward, 0) / recentMetrics.length;
    
    console.log(`Recent performance: Score ${avgScore.toFixed(3)}, Reward ${avgReward.toFixed(3)}`);
    
    // Adapt synthetic task generation
    if (this.config.adaptiveTaskGeneration) {
      // Adjust task difficulty distribution based on performance
      if (avgScore > 0.8) {
        console.log('Increasing task difficulty due to high performance');
        // This would adjust the synthetic generator parameters
      } else if (avgScore < 0.5) {
        console.log('Decreasing task difficulty due to low performance');
      }
    }
    
    // Generate new synthetic tasks if needed
    const newTasks = this.syntheticGenerator.generateTasks(20);
    console.log(`Generated ${newTasks.length} new tasks for continued learning`);
  }
  
  /**
   * Save checkpoint of current state
   */
  private async saveCheckpoint(episode: number, metrics: LoopMetrics): Promise<void> {
    const checkpoint = {
      episode,
      agentState: this.agent.exportState(),
      environmentState: this.environment.getState(),
      metrics,
      timestamp: Date.now()
    };
    
    console.log(`Checkpoint saved at episode ${episode} (Score: ${metrics.averageScore.toFixed(3)})`);
    // In practice, this would save to persistent storage
  }
  
  /**
   * Check if the loop has converged
   */
  private hasConverged(): boolean {
    if (this.metricsHistory.length < 20) return false;
    
    const recent = this.metricsHistory.slice(-20);
    const scores = recent.map(m => m.averageScore);
    
    // Check if performance has stabilized at high level
    const avgScore = scores.reduce((sum, s) => sum + s, 0) / scores.length;
    const variance = scores.reduce((sum, s) => sum + Math.pow(s - avgScore, 2), 0) / scores.length;
    
    return avgScore >= 0.9 && variance < 0.01; // High performance and low variance
  }
  
  /**
   * Get current exploration rate
   */
  private getExplorationRate(episode: number): number {
    // Decay exploration over time
    const initialRate = 0.3;
    const finalRate = 0.05;
    const decayRate = Math.log(finalRate / initialRate) / this.config.maxEpisodes!;
    
    return Math.max(finalRate, initialRate * Math.exp(decayRate * episode));
  }
  
  /**
   * Calculate learning progress indicator
   */
  private calculateLearningProgress(): number {
    if (this.metricsHistory.length < 2) return 0;
    
    const recent = this.metricsHistory.slice(-10);
    const older = this.metricsHistory.slice(-20, -10);
    
    if (older.length === 0) return 0;
    
    const recentAvg = recent.reduce((sum, m) => sum + m.averageScore, 0) / recent.length;
    const olderAvg = older.reduce((sum, m) => sum + m.averageScore, 0) / older.length;
    
    return recentAvg - olderAvg; // Positive means improving
  }
  
  /**
   * Get recent performance average
   */
  private getRecentPerformance(windowSize = 5): number {
    if (this.metricsHistory.length === 0) return 0.5;
    
    const recent = this.metricsHistory.slice(-windowSize);
    return recent.reduce((sum, m) => sum + m.averageScore, 0) / recent.length;
  }
  
  /**
   * Extract learned behaviors from agent
   */
  private extractLearnedBehaviors(): string[] {
    const topPatterns = this.agent.getTopPatterns(10);
    return topPatterns.map(p => `${p.pattern} (${p.frequency} times)`);
  }
  
  /**
   * Get loop statistics
   */
  getStatistics(): {
    totalSteps: number;
    averageEpisodeLength: number;
    bestEpisode: LoopMetrics;
    convergenceAnalysis: {
      hasConverged: boolean;
      stabilityScore: number;
      improvementTrend: number;
    };
  } {
    if (this.metricsHistory.length === 0) {
      throw new Error('No loop history available');
    }
    
    const totalSteps = this.metricsHistory[this.metricsHistory.length - 1].step;
    const averageEpisodeLength = totalSteps / this.metricsHistory.length;
    
    const bestEpisode = this.metricsHistory.reduce((best, current) => 
      current.averageScore > best.averageScore ? current : best
    );
    
    const hasConverged = this.hasConverged();
    const recentScores = this.metricsHistory.slice(-10).map(m => m.averageScore);
    const variance = recentScores.length > 1 ? 
      recentScores.reduce((sum, s) => sum + Math.pow(s - recentScores[0], 2), 0) / recentScores.length : 0;
    const stabilityScore = Math.max(0, 1 - variance * 10);
    const improvementTrend = this.calculateLearningProgress();
    
    return {
      totalSteps,
      averageEpisodeLength,
      bestEpisode,
      convergenceAnalysis: {
        hasConverged,
        stabilityScore,
        improvementTrend
      }
    };
  }
}