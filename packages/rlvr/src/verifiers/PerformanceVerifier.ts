/**
 * Performance and efficiency verifier for code and system operations
 */

import { Verifier } from '../core/Verifier';
import { VerificationResult } from '../core/VerificationResult';

export interface PerformanceVerifierConfig {
  maxExecutionTime?: number;
  maxMemoryUsage?: number;
  benchmarkOperations?: Record<string, number>;
  strictPerformance?: boolean;
}

export interface PerformanceMetrics {
  executionTime: number;
  memoryUsage?: number;
  cpuUsage?: number;
  operations?: number;
  complexity?: string;
}

export class PerformanceVerifier extends Verifier<() => Promise<any>, PerformanceMetrics> {
  private maxExecutionTime: number;
  private maxMemoryUsage: number;
  private benchmarkOperations: Record<string, number>;
  private strictPerformance: boolean;
  
  constructor(config: PerformanceVerifierConfig = {}) {
    super({ name: 'PerformanceVerifier' });
    
    this.maxExecutionTime = config.maxExecutionTime || 5000; // 5 seconds
    this.maxMemoryUsage = config.maxMemoryUsage || 100 * 1024 * 1024; // 100MB
    this.benchmarkOperations = config.benchmarkOperations || {};
    this.strictPerformance = config.strictPerformance ?? false;
  }
  
  async verify(operation: () => Promise<any>, expectedMetrics: PerformanceMetrics): Promise<VerificationResult> {
    const result: VerificationResult = {
      score: 0,
      reason: '',
      breakdown: {
        performance: 0,
        efficiency: 0,
        scalability: 0,
        resource_usage: 0
      },
      metadata: {}
    };
    
    try {
      // Measure performance
      const metrics = await this.measurePerformance(operation);
      result.metadata = metrics;
      
      // Evaluate performance aspects
      const performanceScore = this.evaluateExecutionTime(metrics, expectedMetrics);
      result.breakdown!.performance = performanceScore;
      
      const efficiencyScore = this.evaluateEfficiency(metrics, expectedMetrics);
      result.breakdown!.efficiency = efficiencyScore;
      
      const scalabilityScore = this.evaluateScalability(metrics, expectedMetrics);
      result.breakdown!.scalability = scalabilityScore;
      
      const resourceScore = this.evaluateResourceUsage(metrics, expectedMetrics);
      result.breakdown!.resource_usage = resourceScore;
      
      // Calculate overall score
      result.score = (
        performanceScore * 0.4 +
        efficiencyScore * 0.3 +
        scalabilityScore * 0.2 +
        resourceScore * 0.1
      );
      
      // Generate detailed reason
      result.reason = this.generatePerformanceReason(result.score, metrics, expectedMetrics);
      
      // Extract performance patterns
      if (result.score > 0.8) {
        result.learnedPattern = this.extractPerformancePatterns(metrics);
      }
      
      return result;
      
    } catch (error) {
      result.score = 0;
      result.reason = `Performance verification error: ${error}`;
      result.errors = [String(error)];
      return result;
    }
  }
  
  private async measurePerformance(operation: () => Promise<any>): Promise<PerformanceMetrics> {
    const startTime = process.hrtime.bigint();
    const startMemory = process.memoryUsage();
    
    let operationCount = 0;
    let result: any;
    
    try {
      // Wrap operation to count iterations if it's iterative
      const wrappedOperation = async () => {
        const original = await operation();
        operationCount++;
        return original;
      };
      
      result = await Promise.race([
        wrappedOperation(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Operation timeout')), this.maxExecutionTime)
        )
      ]);
      
    } catch (error) {
      throw new Error(`Operation failed: ${error}`);
    }
    
    const endTime = process.hrtime.bigint();
    const endMemory = process.memoryUsage();
    
    const executionTime = Number(endTime - startTime) / 1_000_000; // Convert to milliseconds
    const memoryUsage = endMemory.heapUsed - startMemory.heapUsed;
    
    return {
      executionTime,
      memoryUsage,
      operations: operationCount,
      complexity: this.analyzeComplexity(result, executionTime)
    };
  }
  
  private evaluateExecutionTime(metrics: PerformanceMetrics, expected: PerformanceMetrics): number {
    const actualTime = metrics.executionTime;
    const expectedTime = expected.executionTime;
    
    if (actualTime <= expectedTime) {
      // Excellent performance - faster than expected
      return Math.min(1.0, expectedTime / actualTime);
    } else {
      // Slower than expected
      const ratio = actualTime / expectedTime;
      if (ratio <= 1.5) {
        return 0.8; // Acceptable performance
      } else if (ratio <= 2.0) {
        return 0.6; // Below expectations
      } else if (ratio <= 3.0) {
        return 0.4; // Poor performance
      } else {
        return 0.2; // Very poor performance
      }
    }
  }
  
  private evaluateEfficiency(metrics: PerformanceMetrics, expected: PerformanceMetrics): number {
    let efficiencyScore = 1.0;
    
    // Memory efficiency
    if (metrics.memoryUsage && expected.memoryUsage) {
      const memoryRatio = metrics.memoryUsage / expected.memoryUsage;
      if (memoryRatio <= 1.0) {
        efficiencyScore *= 1.0; // Good memory usage
      } else if (memoryRatio <= 1.5) {
        efficiencyScore *= 0.8;
      } else if (memoryRatio <= 2.0) {
        efficiencyScore *= 0.6;
      } else {
        efficiencyScore *= 0.4;
      }
    }
    
    // Operations efficiency
    if (metrics.operations && expected.operations) {
      const operationRatio = expected.operations / metrics.operations;
      efficiencyScore *= Math.min(1.0, operationRatio);
    }
    
    return Math.max(0, efficiencyScore);
  }
  
  private evaluateScalability(metrics: PerformanceMetrics, expected: PerformanceMetrics): number {
    // Analyze complexity for scalability
    let scalabilityScore = 1.0;
    
    const complexity = metrics.complexity?.toLowerCase() || '';
    
    switch (complexity) {
      case 'o(1)':
      case 'constant':
        scalabilityScore = 1.0;
        break;
      case 'o(log n)':
      case 'logarithmic':
        scalabilityScore = 0.9;
        break;
      case 'o(n)':
      case 'linear':
        scalabilityScore = 0.8;
        break;
      case 'o(n log n)':
      case 'linearithmic':
        scalabilityScore = 0.7;
        break;
      case 'o(n^2)':
      case 'quadratic':
        scalabilityScore = 0.5;
        break;
      case 'o(n^3)':
      case 'cubic':
        scalabilityScore = 0.3;
        break;
      case 'o(2^n)':
      case 'exponential':
        scalabilityScore = 0.1;
        break;
      default:
        scalabilityScore = 0.6; // Unknown complexity
    }
    
    // Adjust based on actual performance vs expected
    if (expected.complexity) {
      const expectedComplexity = expected.complexity.toLowerCase();
      if (complexity === expectedComplexity) {
        scalabilityScore *= 1.2; // Bonus for meeting complexity expectations
      }
    }
    
    return Math.min(1.0, scalabilityScore);
  }
  
  private evaluateResourceUsage(metrics: PerformanceMetrics, expected: PerformanceMetrics): number {
    let resourceScore = 1.0;
    
    // Check memory limits
    if (metrics.memoryUsage && metrics.memoryUsage > this.maxMemoryUsage) {
      resourceScore *= 0.3; // Heavy penalty for exceeding memory limits
    }
    
    // Check execution time limits
    if (metrics.executionTime > this.maxExecutionTime) {
      resourceScore *= 0.2; // Heavy penalty for timeout
    }
    
    // Reward efficient resource usage
    if (metrics.memoryUsage && expected.memoryUsage) {
      const memoryEfficiency = expected.memoryUsage / metrics.memoryUsage;
      if (memoryEfficiency > 1.0) {
        resourceScore *= Math.min(1.2, memoryEfficiency); // Bonus for low memory usage
      }
    }
    
    return Math.min(1.0, Math.max(0, resourceScore));
  }
  
  private analyzeComplexity(result: any, executionTime: number): string {
    // Simple complexity analysis based on execution time patterns
    // In a real implementation, this would analyze the actual algorithm
    
    if (executionTime < 1) {
      return 'O(1)'; // Constant time
    } else if (executionTime < 10) {
      return 'O(log n)'; // Logarithmic
    } else if (executionTime < 100) {
      return 'O(n)'; // Linear
    } else if (executionTime < 1000) {
      return 'O(n log n)'; // Linearithmic
    } else if (executionTime < 5000) {
      return 'O(n^2)'; // Quadratic
    } else {
      return 'O(n^3)'; // Cubic or worse
    }
  }
  
  private generatePerformanceReason(score: number, metrics: PerformanceMetrics, expected: PerformanceMetrics): string {
    const reasons: string[] = [];
    
    if (score >= 0.9) {
      reasons.push('Excellent performance');
    } else if (score >= 0.7) {
      reasons.push('Good performance');
    } else if (score >= 0.5) {
      reasons.push('Acceptable performance');
    } else {
      reasons.push('Poor performance');
    }
    
    // Add specific details
    if (metrics.executionTime > expected.executionTime * 2) {
      reasons.push(`slow execution (${metrics.executionTime.toFixed(2)}ms vs expected ${expected.executionTime.toFixed(2)}ms)`);
    }
    
    if (metrics.memoryUsage && expected.memoryUsage && metrics.memoryUsage > expected.memoryUsage * 1.5) {
      const actualMB = (metrics.memoryUsage / (1024 * 1024)).toFixed(2);
      const expectedMB = (expected.memoryUsage / (1024 * 1024)).toFixed(2);
      reasons.push(`high memory usage (${actualMB}MB vs expected ${expectedMB}MB)`);
    }
    
    if (metrics.complexity && metrics.complexity.includes('exponential')) {
      reasons.push('exponential complexity detected');
    }
    
    return reasons.join(', ');
  }
  
  private extractPerformancePatterns(metrics: PerformanceMetrics): string {
    const patterns: string[] = [];
    
    if (metrics.executionTime < 10) {
      patterns.push('fast execution');
    }
    
    if (metrics.memoryUsage && metrics.memoryUsage < 10 * 1024 * 1024) {
      patterns.push('low memory footprint');
    }
    
    if (metrics.complexity?.includes('O(1)') || metrics.complexity?.includes('O(log n)')) {
      patterns.push('efficient algorithm');
    }
    
    if (metrics.operations && metrics.operations > 0) {
      patterns.push('operation counting');
    }
    
    return patterns.length > 0 
      ? `Performance patterns: ${patterns.join(', ')}`
      : 'Standard performance profile';
  }
  
  // Static helper method for benchmarking operations
  static async benchmark<T>(operation: () => Promise<T>, iterations = 1): Promise<PerformanceMetrics> {
    const verifier = new PerformanceVerifier();
    const metrics: PerformanceMetrics[] = [];
    
    for (let i = 0; i < iterations; i++) {
      const metric = await verifier.measurePerformance(operation);
      metrics.push(metric);
    }
    
    // Calculate averages
    const avgExecutionTime = metrics.reduce((sum, m) => sum + m.executionTime, 0) / iterations;
    const avgMemoryUsage = metrics.reduce((sum, m) => sum + (m.memoryUsage || 0), 0) / iterations;
    
    return {
      executionTime: avgExecutionTime,
      memoryUsage: avgMemoryUsage,
      operations: metrics[0].operations,
      complexity: metrics[0].complexity
    };
  }
}