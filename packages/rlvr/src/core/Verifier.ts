/**
 * @madboat/rlvr
 * @file src/core/Verifier.ts
 * @version 1.0.0
 * @created 2025-09-06
 * @modified 2025-09-06
 * @author Claude Sonnet 4 + Captain Sandro Fidelis
 * @description Base abstract class for all verifiers in the RLVR system
 * @agent-accessible true
 * @tags verifier, abstract, base, caching
 * @madboat-version v2.0
 */

import { VerificationResult } from './VerificationResult';

export interface VerifierConfig {
  /**
   * Name of the verifier
   */
  name: string;
  
  /**
   * Weight of this verifier in composite scores
   */
  weight?: number;
  
  /**
   * Timeout for verification in milliseconds
   */
  timeout?: number;
  
  /**
   * Whether to cache verification results
   */
  enableCache?: boolean;
}

export abstract class Verifier<TInput = any, TExpected = any> {
  protected config: VerifierConfig;
  protected cache: Map<string, VerificationResult> = new Map();
  
  constructor(config: VerifierConfig) {
    this.config = {
      weight: 1.0,
      timeout: 30000,
      enableCache: true,
      ...config
    };
  }
  
  /**
   * Main verification method to be implemented by subclasses
   */
  abstract verify(
    input: TInput,
    expected: TExpected
  ): Promise<VerificationResult>;
  
  /**
   * Verify with caching support
   */
  async verifyWithCache(
    input: TInput,
    expected: TExpected
  ): Promise<VerificationResult> {
    if (!this.config.enableCache) {
      return this.verify(input, expected);
    }
    
    const cacheKey = this.getCacheKey(input, expected);
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }
    
    const result = await this.verify(input, expected);
    this.cache.set(cacheKey, result);
    return result;
  }
  
  /**
   * Generate cache key for input/expected pair
   */
  protected getCacheKey(input: TInput, expected: TExpected): string {
    return JSON.stringify({ input, expected });
  }
  
  /**
   * Compare two values with tolerance
   */
  protected compareWithTolerance(
    actual: number,
    expected: number,
    tolerance = 0.01
  ): boolean {
    return Math.abs(actual - expected) <= tolerance;
  }
  
  /**
   * Check if strings are semantically equivalent
   */
  protected areStringsSemanticallyEqual(a: string, b: string): boolean {
    // Remove whitespace and compare
    const normalize = (s: string) => s.replace(/\s+/g, ' ').trim().toLowerCase();
    return normalize(a) === normalize(b);
  }
  
  /**
   * Clear the verification cache
   */
  clearCache(): void {
    this.cache.clear();
  }
  
  /**
   * Get verifier name
   */
  getName(): string {
    return this.config.name;
  }
  
  /**
   * Get verifier weight
   */
  getWeight(): number {
    return this.config.weight || 1.0;
  }
}