/**
 * Factory functions for creating RLVR components
 */

import { Verifier } from '../core/Verifier';
import { Reward } from '../core/Reward';
import { TypeScriptVerifier, TypeScriptVerifierConfig } from '../verifiers/TypeScriptVerifier';
import { CodeVerifier, CodeVerifierConfig } from '../verifiers/CodeVerifier';
import { SemanticVerifier, SemanticVerifierConfig } from '../verifiers/SemanticVerifier';
import { PerformanceVerifier, PerformanceVerifierConfig } from '../verifiers/PerformanceVerifier';
import { BinaryReward, BinaryRewardConfig } from '../rewards/BinaryReward';
import { GradedReward, GradedRewardConfig } from '../rewards/GradedReward';
import { CompositeReward, CompositeRewardConfig } from '../rewards/CompositeReward';

export type VerifierType = 
  | 'typescript'
  | 'code'
  | 'semantic'
  | 'performance';

export type RewardType = 
  | 'binary'
  | 'graded'
  | 'composite';

export interface VerifierFactoryConfig {
  type: VerifierType;
  config?: any;
}

export interface RewardFactoryConfig {
  type: RewardType;
  config?: any;
}

/**
 * Create a verifier based on type and configuration
 */
export function createVerifier(factoryConfig: VerifierFactoryConfig): Verifier {
  const { type, config = {} } = factoryConfig;
  
  switch (type) {
    case 'typescript':
      return new TypeScriptVerifier(config as TypeScriptVerifierConfig);
      
    case 'code':
      return new CodeVerifier(config as CodeVerifierConfig);
      
    case 'semantic':
      return new SemanticVerifier(config as SemanticVerifierConfig);
      
    case 'performance':
      return new PerformanceVerifier(config as PerformanceVerifierConfig);
      
    default:
      throw new Error(`Unknown verifier type: ${type}`);
  }
}

/**
 * Create a reward function based on type and configuration
 */
export function createReward(factoryConfig: RewardFactoryConfig): Reward {
  const { type, config = {} } = factoryConfig;
  
  switch (type) {
    case 'binary':
      return new BinaryReward(config as BinaryRewardConfig);
      
    case 'graded':
      return new GradedReward(config as GradedRewardConfig);
      
    case 'composite':
      return new CompositeReward(config as CompositeRewardConfig);
      
    default:
      throw new Error(`Unknown reward type: ${type}`);
  }
}

/**
 * Create multiple verifiers from a configuration array
 */
export function createVerifiers(configs: VerifierFactoryConfig[]): Verifier[] {
  return configs.map(config => createVerifier(config));
}

/**
 * Create multiple rewards from a configuration array
 */
export function createRewards(configs: RewardFactoryConfig[]): Reward[] {
  return configs.map(config => createReward(config));
}

/**
 * Create a standard TypeScript development verifier stack
 */
export function createTypeScriptStack(): {
  verifiers: Verifier[];
  rewards: Reward[];
} {
  const verifiers = [
    new TypeScriptVerifier({
      strict: true,
      noImplicitAny: true,
      strictNullChecks: true,
      noUnusedLocals: true,
      noUnusedParameters: true
    }),
    new CodeVerifier({
      language: 'typescript',
      strict: true,
      timeout: 10000
    }),
    new SemanticVerifier({
      businessRules: [
        'must_contain:function',
        'must_not_contain:console.log',
        'format:typescript'
      ],
      strictSemantics: true
    }),
    new PerformanceVerifier({
      maxExecutionTime: 5000,
      maxMemoryUsage: 50 * 1024 * 1024 // 50MB
    })
  ];
  
  const rewards = [
    BinaryReward.strict('syntax_check', 0.8),
    GradedReward.exponential('quality_score'),
    new CompositeReward({
      name: 'overall_typescript',
      rewards: [
        BinaryReward.lenient('basic_correctness', 0.6),
        GradedReward.sigmoid('advanced_features', 1.2)
      ],
      aggregationMethod: 'weighted_average',
      penalizeInconsistency: true
    })
  ];
  
  return { verifiers, rewards };
}

/**
 * Create a standard web development verifier stack
 */
export function createWebDevelopmentStack(): {
  verifiers: Verifier[];
  rewards: Reward[];
} {
  const verifiers = [
    new TypeScriptVerifier({
      strict: true,
      target: 'ES2022' as any
    }),
    new SemanticVerifier({
      businessRules: [
        'must_contain:React',
        'must_not_contain:dangerouslySetInnerHTML',
        'format:jsx'
      ],
      domainKnowledge: {
        frameworks: ['React', 'Next.js', 'TypeScript'],
        patterns: ['hooks', 'components', 'props']
      }
    }),
    new PerformanceVerifier({
      maxExecutionTime: 3000,
      benchmarkOperations: {
        'render': 100,
        'state_update': 50
      }
    })
  ];
  
  const rewards = [
    BinaryReward.strict('react_compliance', 0.7),
    GradedReward.exponential('component_quality', 0.8),
    new CompositeReward({
      name: 'web_development',
      rewards: [
        new BinaryReward({
          name: 'accessibility',
          passThreshold: 0.8,
          passReward: 1.0,
          failReward: -0.3
        }),
        GradedReward.logarithmic('performance', 2.0)
      ]
    })
  ];
  
  return { verifiers, rewards };
}

/**
 * Create a database-focused verifier stack
 */
export function createDatabaseStack(): {
  verifiers: Verifier[];
  rewards: Reward[];
} {
  const verifiers = [
    new SemanticVerifier({
      businessRules: [
        'must_contain:SELECT|INSERT|UPDATE|DELETE',
        'must_not_contain:DROP TABLE',
        'must_contain:WHERE'
      ],
      domainKnowledge: {
        sqlKeywords: ['SELECT', 'FROM', 'WHERE', 'JOIN', 'GROUP BY', 'ORDER BY'],
        securityRules: ['no_sql_injection', 'parameterized_queries']
      }
    }),
    new PerformanceVerifier({
      maxExecutionTime: 2000,
      benchmarkOperations: {
        'select_query': 500,
        'insert_query': 200,
        'update_query': 300
      }
    })
  ];
  
  const rewards = [
    BinaryReward.strict('sql_correctness', 0.9),
    new GradedReward({
      name: 'query_optimization',
      curve: 'exponential',
      steepness: 0.7,
      bonusThresholds: [
        { threshold: 0.95, bonus: 0.2 },
        { threshold: 0.99, bonus: 0.3 }
      ]
    }),
    new CompositeReward({
      name: 'database_mastery',
      rewards: [
        BinaryReward.lenient('security_compliance', 0.8),
        GradedReward.sigmoid('efficiency', 1.5)
      ],
      aggregationMethod: 'harmonic_mean'
    })
  ];
  
  return { verifiers, rewards };
}

/**
 * Create a natural language processing verifier stack
 */
export function createNLPStack(): {
  verifiers: Verifier[];
  rewards: Reward[];
} {
  const verifiers = [
    new SemanticVerifier({
      businessRules: [
        'must_contain:summarize|classify|extract|translate',
        'format:text'
      ],
      domainKnowledge: {
        nlpTasks: ['classification', 'extraction', 'summarization', 'translation'],
        metrics: ['accuracy', 'precision', 'recall', 'f1_score']
      },
      strictSemantics: true
    }),
    new PerformanceVerifier({
      maxExecutionTime: 8000, // NLP tasks can be slower
      maxMemoryUsage: 200 * 1024 * 1024 // 200MB for model processing
    })
  ];
  
  const rewards = [
    new GradedReward({
      name: 'semantic_accuracy',
      curve: 'sigmoid',
      steepness: 2.0
    }),
    new GradedReward({
      name: 'language_fluency',
      curve: 'exponential',
      steepness: 0.6,
      bonusThresholds: [
        { threshold: 0.9, bonus: 0.15 },
        { threshold: 0.95, bonus: 0.25 }
      ]
    }),
    CompositeReward.balanced('nlp_overall', [
      BinaryReward.lenient('task_completion', 0.7),
      GradedReward.logarithmic('output_quality', 1.5)
    ])
  ];
  
  return { verifiers, rewards };
}

/**
 * Create a mathematics/computation verifier stack
 */
export function createMathStack(): {
  verifiers: Verifier[];
  rewards: Reward[];
} {
  const verifiers = [
    new CodeVerifier({
      language: 'python', // Math often uses Python
      strict: true,
      timeout: 15000
    }),
    new SemanticVerifier({
      businessRules: [
        'must_contain:calculate|solve|compute',
        'format:number'
      ],
      domainKnowledge: {
        mathOperations: ['add', 'subtract', 'multiply', 'divide', 'power', 'sqrt'],
        precisionRequirement: 0.0001
      }
    }),
    new PerformanceVerifier({
      maxExecutionTime: 10000,
      benchmarkOperations: {
        'basic_arithmetic': 1000,
        'advanced_calculation': 100
      }
    })
  ];
  
  const rewards = [
    BinaryReward.strict('mathematical_correctness', 0.95),
    new GradedReward({
      name: 'precision_score',
      curve: 'exponential',
      steepness: 0.3 // Very steep curve for precision
    }),
    CompositeReward.strict('math_mastery', [
      BinaryReward.strict('accuracy', 0.99),
      GradedReward.exponential('elegance', 0.8),
      new BinaryReward({
        name: 'efficiency',
        passThreshold: 0.8,
        passReward: 1.2,
        failReward: -0.2
      })
    ])
  ];
  
  return { verifiers, rewards };
}

/**
 * Create a custom verifier/reward stack from configuration
 */
export function createCustomStack(config: {
  name: string;
  verifiers: VerifierFactoryConfig[];
  rewards: RewardFactoryConfig[];
}): {
  name: string;
  verifiers: Verifier[];
  rewards: Reward[];
} {
  return {
    name: config.name,
    verifiers: createVerifiers(config.verifiers),
    rewards: createRewards(config.rewards)
  };
}

/**
 * Preset configurations for different MadBoat agents
 */
export const AGENT_PRESETS = {
  kraken: () => createTypeScriptStack(),
  poseidon: () => createDatabaseStack(),
  mandarin_fish: () => createWebDevelopmentStack(),
  uncle_mcduck: () => createMathStack(),
  ulisses: () => createNLPStack()
} as const;

/**
 * Get preset configuration for a MadBoat agent
 */
export function getAgentPreset(agentName: keyof typeof AGENT_PRESETS) {
  const preset = AGENT_PRESETS[agentName];
  if (!preset) {
    throw new Error(`No preset found for agent: ${agentName}`);
  }
  return preset();
}