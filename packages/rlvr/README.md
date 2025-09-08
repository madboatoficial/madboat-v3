# @madboat/rlvr

**Reinforcement Learning from Verifiable Rewards** - MadBoat's anti-hallucination system for self-improving agents.

## 🎯 Overview

RLVR is a revolutionary approach to agent training that eliminates hallucinations through verifiable rewards. Instead of relying on human feedback or subjective measures, RLVR uses concrete verification methods (code execution, formal verification, measurable outcomes) to provide reliable training signals.

## 🚀 Quick Start

```typescript
import { Agent, createTypeScriptStack } from '@madboat/rlvr';

// Create an agent with TypeScript verification capabilities
const { verifiers, rewards } = createTypeScriptStack();
const agent = new Agent({
  name: 'TypeScript Agent',
  verifiers,
  rewards
});

// Train on a simple task
const result = await agent.executeAndLearn(
  { task: 'implement isPrime function' },
  async () => `function isPrime(n: number): boolean {
    if (n <= 1) return false;
    for (let i = 2; i * i <= n; i++) {
      if (n % i === 0) return false;
    }
    return true;
  }`,
  'function that correctly determines if a number is prime'
);

console.log(`Score: ${result.verification.score}, Reward: ${result.reward.reward}`);
```

## 📦 Installation

```bash
npm install @madboat/rlvr
```

## 🏗️ Architecture

### Core Components

- **Verifiers**: Concrete verification methods (TypeScript compilation, code execution, semantic analysis)
- **Rewards**: Scoring systems that convert verification results into learning signals
- **Agents**: Self-improving entities that learn from verifiable feedback
- **Training**: Systematic improvement through synthetic data and progressive difficulty
- **MadBoatBench**: Standardized dataset for agent evaluation

### Verification Stack

```typescript
// TypeScript Development Stack
const { verifiers, rewards } = createTypeScriptStack();

// Custom Stack
const stack = createCustomStack({
  name: 'Custom Stack',
  verifiers: [
    { type: 'typescript', config: { strict: true } },
    { type: 'semantic', config: { businessRules: ['must_contain:function'] } },
    { type: 'performance', config: { maxExecutionTime: 5000 } }
  ],
  rewards: [
    { type: 'binary', config: { passThreshold: 0.8 } },
    { type: 'graded', config: { curve: 'exponential' } },
    { type: 'composite', config: { aggregationMethod: 'weighted_average' } }
  ]
});
```

## 🎓 Training

### Synthetic Data Generation

```typescript
import { SyntheticGenerator } from '@madboat/rlvr';

const generator = new SyntheticGenerator({
  categories: ['code', 'nlp', 'math', 'database'],
  difficultyRange: [0.1, 0.9],
  taskCount: 100
});

// Generate progressive difficulty tasks
const tasks = generator.generateProgressiveTasks('code', 50, 0.2, 0.9);
```

### Agent Training

```typescript
import { RLVRTrainer } from '@madboat/rlvr';

const trainer = new RLVRTrainer({
  maxEpisodes: 100,
  convergenceThreshold: 0.95,
  minSuccessRate: 0.8
});

const result = await trainer.train(agent, trainingTasks, (metrics) => {
  console.log(`Episode ${metrics.episode}: Success Rate ${metrics.successRate}`);
});
```

### Agent-Environment Loop

```typescript
import { AgentEnvironmentLoop } from '@madboat/rlvr';

const loop = new AgentEnvironmentLoop(agent, environment, {
  maxEpisodes: 50,
  adaptiveTaskGeneration: true,
  realTimeAdaptation: true
});

const result = await loop.run();
```

## 🎯 MadBoat Agent Presets

Pre-configured stacks for MadBoat agents:

```typescript
import { getAgentPreset } from '@madboat/rlvr';

// Specialized agent configurations
const kraken = getAgentPreset('kraken');         // TypeScript development
const poseidon = getAgentPreset('poseidon');     // Database operations
const mandarin_fish = getAgentPreset('mandarin_fish'); // UI development
const uncle_mcduck = getAgentPreset('uncle_mcduck');   // Mathematical computation
const ulisses = getAgentPreset('ulisses');       // Natural language processing
```

## 📊 MadBoatBench Dataset

Standardized evaluation dataset for agent performance:

```typescript
import { exportSyntheticTasks, analyzeDataset } from '@madboat/rlvr';

// Create benchmark dataset
await exportSyntheticTasks(tasks, './madboat-bench-v1.0.json', 'kraken');

// Analyze performance
const analysis = await analyzeDataset('./madboat-bench-v1.0.json');
console.log('Success Rate:', analysis.summary.successRate);
console.log('Recommendations:', analysis.recommendations);
```

## 🔬 Verification Methods

### TypeScript Verification

```typescript
import { TypeScriptVerifier } from '@madboat/rlvr';

const verifier = new TypeScriptVerifier({
  strict: true,
  noImplicitAny: true,
  strictNullChecks: true,
  noUnusedLocals: true
});

const result = await verifier.verify(code);
```

### Code Execution Verification

```typescript
import { CodeVerifier } from '@madboat/rlvr';

const verifier = new CodeVerifier({
  language: 'typescript',
  strict: true,
  timeout: 10000
});

const result = await verifier.verify(code, expectedOutput);
```

### Semantic Verification

```typescript
import { SemanticVerifier } from '@madboat/rlvr';

const verifier = new SemanticVerifier({
  businessRules: [
    'must_contain:function',
    'must_not_contain:console.log',
    'format:typescript'
  ],
  strictSemantics: true
});

const result = await verifier.verify(output, expected);
```

### Performance Verification

```typescript
import { PerformanceVerifier } from '@madboat/rlvr';

const verifier = new PerformanceVerifier({
  maxExecutionTime: 5000,
  maxMemoryUsage: 100 * 1024 * 1024 // 100MB
});

const result = await verifier.verify(operation, expectedMetrics);
```

## 🏆 Reward Systems

### Binary Rewards

```typescript
import { BinaryReward } from '@madboat/rlvr';

const reward = BinaryReward.strict('correctness', 0.8); // Pass/fail at 80%
```

### Graded Rewards

```typescript
import { GradedReward } from '@madboat/rlvr';

const reward = GradedReward.exponential('quality', 0.5); // Exponential growth
```

### Composite Rewards

```typescript
import { CompositeReward } from '@madboat/rlvr';

const reward = CompositeReward.balanced('overall', [
  BinaryReward.strict('correctness', 0.8),
  GradedReward.exponential('elegance', 0.6)
]);
```

## 📈 Performance Metrics

### Agent Metrics

```typescript
const metrics = agent.getMetrics();
console.log({
  totalAttempts: metrics.totalAttempts,
  successfulAttempts: metrics.successfulAttempts,
  averageScore: metrics.averageScore,
  improvementRate: metrics.improvementRate,
  learnedPatterns: metrics.learnedPatterns
});
```

### Training Analysis

```typescript
const stats = trainer.getTrainingStatistics();
console.log({
  totalEpisodes: stats.totalEpisodes,
  bestEpisode: stats.bestEpisode,
  convergenceAnalysis: stats.convergenceAnalysis
});
```

## 🔧 Configuration

### Environment Variables

```bash
# Optional: Set data directory
RLVR_DATA_DIR=./rlvr-data

# Optional: Enable debug logging
RLVR_DEBUG=true

# Optional: Set default timeout
RLVR_DEFAULT_TIMEOUT=30000
```

### Agent Configuration

```typescript
const agent = new Agent({
  name: 'My Agent',
  verifiers: [...],
  rewards: [...],
  learningRate: 0.1,        // Learning rate (0.0-1.0)
  memorySize: 1000,         // Memory entries to keep
  explorationRate: 0.1,     // Exploration vs exploitation
  enablePatternLearning: true
});
```

## 🎯 Best Practices

### 1. Progressive Difficulty

Start with simple tasks and gradually increase complexity:

```typescript
const easyTasks = generator.generateProgressiveTasks('code', 20, 0.1, 0.4);
const mediumTasks = generator.generateProgressiveTasks('code', 30, 0.4, 0.7);
const hardTasks = generator.generateProgressiveTasks('code', 20, 0.7, 0.9);
```

### 2. Multiple Verification Methods

Use complementary verifiers for robust evaluation:

```typescript
const verifiers = [
  new TypeScriptVerifier({ strict: true }),    // Syntax & types
  new SemanticVerifier({ businessRules: [...] }), // Business logic
  new PerformanceVerifier({ maxTime: 5000 })   // Performance bounds
];
```

### 3. Balanced Reward Systems

Combine different reward types:

```typescript
const rewards = [
  BinaryReward.strict('correctness', 0.8),     // Must be correct
  GradedReward.exponential('quality', 0.7),   // Reward excellence
  CompositeReward.balanced('overall', [...])   // Balanced assessment
];
```

### 4. Continuous Learning

Use the Agent-Environment Loop for ongoing improvement:

```typescript
const loop = new AgentEnvironmentLoop(agent, environment, {
  adaptiveTaskGeneration: true,  // Adapt to performance
  difficultyProgression: true,   // Increase difficulty over time
  realTimeAdaptation: true       // Adjust during training
});
```

## 📚 Examples

See the [`examples/`](./src/examples/) directory for comprehensive usage examples:

- **Basic Usage**: Simple verification and learning
- **Synthetic Training**: Training with generated data
- **Agent-Environment Loop**: Continuous learning setup
- **MadBoatBench**: Dataset creation and analysis
- **Multi-Agent System**: Coordinated agent training

## 🔬 Scientific Foundation

RLVR is based on cutting-edge research in:

- **Verifiable Rewards**: Concrete, measurable feedback signals
- **Synthetic Data Generation**: High-quality training data creation
- **Multi-Agent Learning**: Coordinated improvement across specialized agents
- **Anti-Hallucination**: Elimination of false positives through verification

For detailed scientific background, see our [research article](../.madboat/shared-knowledge/articles/001-rlvr-anti-hallucination-system.md).

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is part of the MadBoat ecosystem and follows the project's licensing terms.

## 🆘 Support

For questions and support:

- 📖 [Documentation](../.madboat/shared-knowledge/)
- 🐛 [Issues](https://github.com/your-org/madboat/issues)
- 💬 [Discussions](https://github.com/your-org/madboat/discussions)

---

**MadBoat RLVR** - Building the future of verifiable AI agents 🐙