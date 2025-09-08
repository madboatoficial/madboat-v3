/**
 * @madboat/rlvr
 * @file src/index.ts
 * @version 1.0.0
 * @created 2025-09-06
 * @modified 2025-09-06
 * @author Claude Sonnet 4 + Captain Sandro Fidelis
 * @description Main entry point for Reinforcement Learning from Verifiable Rewards
 * @agent-accessible true
 * @tags rlvr, exports, anti-hallucination, framework
 * @madboat-version v2.0
 */

// Core exports
export * from './core/Verifier';
export * from './core/VerificationResult';
export * from './core/Reward';
export * from './core/Agent';

// Verifiers
export * from './verifiers/CodeVerifier';
export * from './verifiers/SemanticVerifier';
export * from './verifiers/PerformanceVerifier';
export * from './verifiers/TypeScriptVerifier';

// Rewards
export * from './rewards/BinaryReward';
export * from './rewards/GradedReward';
export * from './rewards/CompositeReward';

// Training
export * from './training/RLVRTrainer';
export * from './training/SyntheticGenerator';

// Loops
export * from './loops/AgentEnvironmentLoop';

// Utils
export * from './utils/factory';
export * from './utils/storage';

// Examples
export * from './examples/basic-usage';