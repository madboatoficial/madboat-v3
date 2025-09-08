/**
 * Basic tests for the RLVR framework
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { Agent } from '../core/Agent';
import { TypeScriptVerifier } from '../verifiers/TypeScriptVerifier';
import { BinaryReward } from '../rewards/BinaryReward';
import { SyntheticGenerator } from '../training/SyntheticGenerator';
import { createTypeScriptStack, getAgentPreset } from '../utils/factory';

describe('RLVR Framework', () => {
  describe('TypeScript Verifier', () => {
    let verifier: TypeScriptVerifier;
    
    beforeEach(() => {
      verifier = new TypeScriptVerifier({
        strict: true,
        noImplicitAny: true
      });
    });
    
    it('should verify valid TypeScript code', async () => {
      const code = `function add(a: number, b: number): number {
        return a + b;
      }`;
      
      const result = await verifier.verify(code);
      
      expect(result.score).toBeGreaterThan(0.8);
      expect(result.reason).toContain('TypeScript verification passed');
    });
    
    it('should detect TypeScript errors', async () => {
      const code = `function add(a, b) {
        return a + b + undefinedVariable;
      }`;
      
      const result = await verifier.verify(code);
      
      expect(result.score).toBeLessThan(0.5);
      expect(result.errors).toBeDefined();
      expect(result.errors!.length).toBeGreaterThan(0);
    });
  });
  
  describe('Binary Reward', () => {
    it('should give positive reward for passing threshold', () => {
      const reward = new BinaryReward({
        name: 'test',
        passThreshold: 0.7,
        passReward: 1.0,
        failReward: 0.0
      });
      
      const result = reward.calculate({
        score: 0.8,
        reason: 'Good performance'
      });
      
      expect(result.reward).toBe(1.0);
      expect(result.confidence).toBeGreaterThan(0.9);
    });
    
    it('should give negative reward for failing threshold', () => {
      const reward = new BinaryReward({
        name: 'test',
        passThreshold: 0.7,
        passReward: 1.0,
        failReward: -0.5
      });
      
      const result = reward.calculate({
        score: 0.6,
        reason: 'Below threshold'
      });
      
      expect(result.reward).toBe(-0.5);
    });
  });
  
  describe('Agent', () => {
    let agent: Agent;
    
    beforeEach(() => {
      const { verifiers, rewards } = createTypeScriptStack();
      agent = new Agent({
        name: 'Test Agent',
        verifiers: verifiers.slice(0, 1), // Use only TypeScript verifier for speed
        rewards: rewards.slice(0, 1),     // Use only first reward
        learningRate: 0.1
      });
    });
    
    it('should execute and learn from valid code', async () => {
      const result = await agent.executeAndLearn(
        { task: 'simple function' },
        async () => `function test(): string { return "hello"; }`,
        'function that returns a string'
      );
      
      expect(result.output).toContain('function test');
      expect(result.verification.score).toBeGreaterThan(0);
      expect(result.reward.reward).toBeGreaterThan(0);
    });
    
    it('should track metrics over time', async () => {
      // Execute multiple tasks
      for (let i = 0; i < 3; i++) {
        await agent.executeAndLearn(
          { task: `task_${i}` },
          async () => `function task${i}(): number { return ${i}; }`,
          'simple function'
        );
      }
      
      const metrics = agent.getMetrics();
      expect(metrics.totalAttempts).toBe(3);
      expect(metrics.averageScore).toBeGreaterThan(0);
    });
  });
  
  describe('Synthetic Generator', () => {
    let generator: SyntheticGenerator;
    
    beforeEach(() => {
      generator = new SyntheticGenerator({
        categories: ['code', 'math'],
        difficultyRange: [0.1, 0.9],
        taskCount: 10,
        seed: 42 // For reproducible tests
      });
    });
    
    it('should generate synthetic tasks', () => {
      const tasks = generator.generateTasks(5);
      
      expect(tasks).toHaveLength(5);
      tasks.forEach(task => {
        expect(task.id).toBeDefined();
        expect(task.category).toBeDefined();
        expect(task.difficulty).toBeGreaterThanOrEqual(0.1);
        expect(task.difficulty).toBeLessThanOrEqual(0.9);
        expect(task.input).toBeDefined();
        expect(task.expectedOutput).toBeDefined();
      });
    });
    
    it('should generate progressive difficulty tasks', () => {
      const tasks = generator.generateProgressiveTasks('code', 5, 0.2, 0.8);
      
      expect(tasks).toHaveLength(5);
      
      // Check that difficulty increases
      for (let i = 1; i < tasks.length; i++) {
        expect(tasks[i].difficulty).toBeGreaterThanOrEqual(tasks[i - 1].difficulty);
      }
    });
  });
  
  describe('Agent Presets', () => {
    it('should create kraken preset', () => {
      const { verifiers, rewards } = getAgentPreset('kraken');
      
      expect(verifiers.length).toBeGreaterThan(0);
      expect(rewards.length).toBeGreaterThan(0);
      expect(verifiers[0].getName()).toContain('TypeScript');
    });
    
    it('should create all agent presets', () => {
      const agentNames = ['kraken', 'poseidon', 'mandarin_fish', 'uncle_mcduck', 'ulisses'] as const;
      
      agentNames.forEach(name => {
        const preset = getAgentPreset(name);
        expect(preset.verifiers.length).toBeGreaterThan(0);
        expect(preset.rewards.length).toBeGreaterThan(0);
      });
    });
  });
  
  describe('Integration Test', () => {
    it('should run a complete RLVR cycle', async () => {
      // Create agent
      const { verifiers, rewards } = createTypeScriptStack();
      const agent = new Agent({
        name: 'Integration Test Agent',
        verifiers: [verifiers[0]], // Use only TypeScript verifier for speed
        rewards: [rewards[0]],     // Use only binary reward for speed
        learningRate: 0.2
      });
      
      // Generate synthetic tasks
      const generator = new SyntheticGenerator({
        categories: ['code'],
        difficultyRange: [0.3, 0.7],
        taskCount: 3,
        seed: 123
      });
      
      const tasks = generator.generateTasks(3);
      
      // Execute tasks and verify learning
      const results = [];
      for (const task of tasks) {
        const result = await agent.executeAndLearn(
          task.input,
          async () => {
            // Simulate simple code generation
            if (typeof task.input === 'object' && 'functionName' in task.input) {
              return `function ${task.input.functionName}() { return true; }`;
            }
            return 'function placeholder() { return null; }';
          },
          task.expectedOutput
        );
        
        results.push(result);
      }
      
      // Verify that the agent learned something
      const metrics = agent.getMetrics();
      expect(metrics.totalAttempts).toBe(3);
      expect(metrics.averageScore).toBeGreaterThan(0);
      
      // Verify that results were generated
      expect(results).toHaveLength(3);
      results.forEach(result => {
        expect(result.verification).toBeDefined();
        expect(result.reward).toBeDefined();
        expect(typeof result.learned).toBe('boolean');
      });
    }, 30000); // 30 second timeout for integration test
  });
});