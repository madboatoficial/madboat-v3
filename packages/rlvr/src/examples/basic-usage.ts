/**
 * Basic usage examples of the RLVR framework
 * Demonstrates how to set up agents, train them, and evaluate performance
 */

import { Agent } from '../core/Agent';
import { RLVRTrainer, TrainingTask } from '../training/RLVRTrainer';
import { SyntheticGenerator } from '../training/SyntheticGenerator';
import { AgentEnvironmentLoop, Environment } from '../loops/AgentEnvironmentLoop';
import { 
  getAgentPreset, 
  createCustomStack,
  createTypeScriptStack 
} from '../utils/factory';
import { 
  saveMadBoatBenchDataset, 
  exportSyntheticTasks,
  analyzeDataset 
} from '../utils/storage';

/**
 * Example 1: Basic TypeScript Code Verification
 */
export async function basicTypeScriptExample() {
  console.log('=== Basic TypeScript Verification Example ===');
  
  // Create TypeScript verifier stack
  const { verifiers, rewards } = createTypeScriptStack();
  
  // Create agent
  const agent = new Agent({
    name: 'TypeScript Agent',
    verifiers,
    rewards,
    learningRate: 0.1,
    explorationRate: 0.2
  });
  
  // Simple function implementation task
  const result = await agent.executeAndLearn(
    { 
      task: 'implement isPrime function',
      language: 'typescript'
    },
    async () => {
      // Simulate agent generating code
      return `function isPrime(n: number): boolean {
  if (n <= 1) return false;
  if (n <= 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
}`;
    },
    'function that correctly determines if a number is prime'
  );
  
  console.log('Verification Result:', {
    score: result.verification.score,
    reason: result.verification.reason,
    reward: result.reward.reward,
    learned: result.learned
  });
  
  return result;
}

/**
 * Example 2: Training with Synthetic Data
 */
export async function syntheticTrainingExample() {
  console.log('\n=== Synthetic Training Example ===');
  
  // Create synthetic data generator
  const generator = new SyntheticGenerator({
    categories: ['code', 'math'],
    difficultyRange: [0.2, 0.8],
    taskCount: 50,
    seed: 42 // Reproducible results
  });
  
  // Generate training tasks
  const syntheticTasks = generator.generateTasks(20);
  console.log(`Generated ${syntheticTasks.length} synthetic tasks`);
  
  // Convert to training tasks
  const trainingTasks: TrainingTask[] = syntheticTasks.map(task => ({
    name: task.id,
    generateInput: () => task.input,
    executeAction: async (input, agent) => {
      // Simulate agent processing the task
      if (task.category === 'code') {
        return `// Implementation for: ${JSON.stringify(input)}
function solution() {
  return ${JSON.stringify(task.expectedOutput)};
}`;
      } else {
        return task.expectedOutput;
      }
    },
    getExpectedOutput: (input) => task.expectedOutput,
    difficulty: task.difficulty,
    weight: 1.0
  }));
  
  // Create agent and trainer
  const { verifiers, rewards } = getAgentPreset('kraken');
  const agent = new Agent({
    name: 'Kraken Training Agent',
    verifiers,
    rewards
  });
  
  const trainer = new RLVRTrainer({
    maxEpisodes: 10,
    convergenceThreshold: 0.8,
    minSuccessRate: 0.7
  });
  
  // Train the agent
  const trainingResult = await trainer.train(agent, trainingTasks, (metrics) => {
    console.log(`Episode ${metrics.episode}: Success Rate ${metrics.successRate.toFixed(3)}, Avg Score ${metrics.averageScore.toFixed(3)}`);
  });
  
  console.log('Training completed:', {
    success: trainingResult.success,
    finalSuccessRate: trainingResult.finalMetrics.successRate,
    totalTrainingTime: trainingResult.totalTrainingTime,
    learnedPatterns: trainingResult.learnedPatterns.slice(0, 5) // Top 5 patterns
  });
  
  // Export synthetic tasks as dataset
  await exportSyntheticTasks(
    syntheticTasks,
    './madboat-bench-synthetic.json',
    'kraken'
  );
  
  return trainingResult;
}

/**
 * Example 3: Agent Environment Loop
 */
export async function agentEnvironmentLoopExample() {
  console.log('\n=== Agent Environment Loop Example ===');
  
  // Create a simple coding environment
  class CodingEnvironment implements Environment<any, any, any> {
    name = 'Coding Challenge Environment';
    private currentTask: any = null;
    private tasks = [
      { problem: 'reverse string', difficulty: 0.3 },
      { problem: 'find factorial', difficulty: 0.5 },
      { problem: 'fibonacci sequence', difficulty: 0.7 }
    ];
    private taskIndex = 0;
    
    async reset() {
      this.taskIndex = 0;
      this.currentTask = this.tasks[this.taskIndex];
      return this.currentTask;
    }
    
    async step(action: any) {
      // Evaluate the action (code solution)
      const success = Math.random() > (this.currentTask.difficulty * 0.5); // Simplified evaluation
      const reward = success ? 1.0 : -0.5;
      
      this.taskIndex++;
      const done = this.taskIndex >= this.tasks.length;
      
      if (!done) {
        this.currentTask = this.tasks[this.taskIndex];
      }
      
      return {
        observation: this.currentTask,
        reward,
        done,
        info: { success, taskCompleted: this.taskIndex }
      };
    }
    
    getState() {
      return {
        currentTask: this.currentTask,
        taskIndex: this.taskIndex,
        totalTasks: this.tasks.length
      };
    }
    
    isValidAction(action: any): boolean {
      return action && typeof action.code === 'string';
    }
  }
  
  // Create agent and environment
  const { verifiers, rewards } = createCustomStack({
    name: 'Simple Coding Agent',
    verifiers: [
      { type: 'semantic', config: { strictSemantics: false } },
      { type: 'code', config: { language: 'javascript', strict: false } }
    ],
    rewards: [
      { type: 'binary', config: { name: 'completion', passThreshold: 0.6 } },
      { type: 'graded', config: { name: 'quality', curve: 'linear' } }
    ]
  });
  
  const agent = new Agent({
    name: 'Loop Agent',
    verifiers,
    rewards
  });
  
  const environment = new CodingEnvironment();
  
  // Create and run the loop
  const loop = new AgentEnvironmentLoop(agent, environment, {
    maxEpisodes: 5,
    maxSteps: 10,
    adaptiveTaskGeneration: true,
    realTimeAdaptation: true
  });
  
  const loopResult = await loop.run((metrics) => {
    console.log(`Loop Episode ${metrics.episode}: Reward ${metrics.episodeReward.toFixed(3)}, Progress ${metrics.learningProgress.toFixed(3)}`);
  });
  
  console.log('Loop completed:', {
    success: loopResult.success,
    totalEpisodes: loopResult.totalEpisodes,
    totalSteps: loopResult.totalSteps,
    learnedBehaviors: loopResult.learnedBehaviors.slice(0, 3)
  });
  
  return loopResult;
}

/**
 * Example 4: MadBoatBench Dataset Creation and Analysis
 */
export async function madBoatBenchExample() {
  console.log('\n=== MadBoatBench Dataset Example ===');
  
  // Generate diverse training data
  const generator = new SyntheticGenerator({
    categories: ['code', 'nlp', 'math', 'database'],
    difficultyRange: [0.1, 0.9],
    taskCount: 100,
    seed: 123
  });
  
  // Create progressive tasks for each category
  const progressiveTasks = [
    ...generator.generateProgressiveTasks('code', 25, 0.2, 0.9),
    ...generator.generateProgressiveTasks('nlp', 25, 0.1, 0.8),
    ...generator.generateProgressiveTasks('math', 25, 0.3, 0.9),
    ...generator.generateProgressiveTasks('database', 25, 0.2, 0.7)
  ];
  
  console.log(`Created MadBoatBench dataset with ${progressiveTasks.length} tasks`);
  
  // Save as MadBoatBench format
  const datasetPath = './madboat-bench-v1.0.json';
  await exportSyntheticTasks(progressiveTasks, datasetPath, 'benchmark');
  
  // Analyze the dataset
  const analysis = await analyzeDataset(datasetPath);
  
  console.log('Dataset Analysis:', {
    summary: analysis.summary,
    recommendations: analysis.recommendations.slice(0, 3)
  });
  
  return { tasksCreated: progressiveTasks.length, analysis };
}

/**
 * Example 5: Multi-Agent RLVR System
 */
export async function multiAgentExample() {
  console.log('\n=== Multi-Agent RLVR System Example ===');
  
  // Create different agents for different specialties
  const agents = {
    kraken: new Agent({
      name: 'Kraken (TypeScript)',
      ...getAgentPreset('kraken')
    }),
    poseidon: new Agent({
      name: 'Poseidon (Database)',
      ...getAgentPreset('poseidon')
    }),
    mandarin_fish: new Agent({
      name: 'Mandarin Fish (UI)',
      ...getAgentPreset('mandarin_fish')
    })
  };
  
  // Test tasks for each agent
  const tasks = {
    kraken: {
      input: { task: 'create TypeScript interface', requirements: ['strict typing', 'optional properties'] },
      action: async () => 'interface User { id: number; name: string; email?: string; }',
      expected: 'well-formed TypeScript interface'
    },
    poseidon: {
      input: { table: 'users', operation: 'complex_query' },
      action: async () => 'SELECT u.*, p.name as profile_name FROM users u LEFT JOIN profiles p ON u.id = p.user_id WHERE u.active = true',
      expected: 'optimized SQL query with proper joins'
    },
    mandarin_fish: {
      input: { component: 'button', style: 'modern', accessibility: true },
      action: async () => '<button className="btn-modern" aria-label="Submit form" onClick={handleClick}>Submit</button>',
      expected: 'accessible React component with modern styling'
    }
  };
  
  // Test each agent
  const results: Record<string, any> = {};
  
  for (const [agentName, agent] of Object.entries(agents)) {
    const task = tasks[agentName as keyof typeof tasks];
    
    const result = await agent.executeAndLearn(
      task.input,
      task.action,
      task.expected
    );
    
    results[agentName] = {
      score: result.verification.score,
      reward: result.reward.reward,
      patterns: result.verification.learnedPattern
    };
    
    console.log(`${agentName}: Score ${result.verification.score.toFixed(3)}, Reward ${result.reward.reward.toFixed(3)}`);
  }
  
  // Get performance summary
  const overallPerformance = Object.values(results).reduce((sum, r: any) => sum + r.score, 0) / Object.keys(results).length;
  console.log(`Overall multi-agent performance: ${overallPerformance.toFixed(3)}`);
  
  return { results, overallPerformance };
}

/**
 * Run all examples
 */
export async function runAllExamples() {
  console.log('🐙 MadBoat RLVR Framework - Complete Examples\n');
  
  try {
    await basicTypeScriptExample();
    await syntheticTrainingExample();
    await agentEnvironmentLoopExample();
    await madBoatBenchExample();
    await multiAgentExample();
    
    console.log('\n✅ All examples completed successfully!');
    console.log('🎯 RLVR framework is ready for production use');
    
  } catch (error) {
    console.error('❌ Example execution failed:', error);
    throw error;
  }
}

// Export for CLI usage
if (require.main === module) {
  runAllExamples().catch(console.error);
}