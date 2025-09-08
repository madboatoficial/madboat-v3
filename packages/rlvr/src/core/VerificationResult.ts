/**
 * @madboat/rlvr
 * @file src/core/VerificationResult.ts
 * @version 1.0.0
 * @created 2025-09-06
 * @modified 2025-09-06
 * @author Claude Sonnet 4 + Captain Sandro Fidelis
 * @description Core verification result structure for RLVR
 * @agent-accessible true
 * @tags verification, result, scoring, metadata
 * @madboat-version v2.0
 */

export interface VerificationResult {
  /**
   * Overall verification score (0.0 to 1.0)
   */
  score: number;
  
  /**
   * Detailed breakdown of scores by category
   */
  breakdown?: {
    syntax?: number;
    semantic?: number;
    performance?: number;
    business?: number;
    [key: string]: number | undefined;
  };
  
  /**
   * Human-readable reason for the score
   */
  reason: string;
  
  /**
   * Specific errors or warnings
   */
  errors?: string[];
  
  /**
   * Warnings that don't affect score
   */
  warnings?: string[];
  
  /**
   * Execution metadata
   */
  metadata?: {
    executionTime?: number;
    memoryUsed?: number;
    testsRun?: number;
    testsPassed?: number;
  };
  
  /**
   * Pattern learned from this verification
   */
  learnedPattern?: string;
  
  /**
   * Confidence in the verification (0.0 to 1.0)
   */
  confidence?: number;
}

export class VerificationError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'VerificationError';
  }
}