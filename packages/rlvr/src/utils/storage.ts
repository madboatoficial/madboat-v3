/**
 * Storage utilities for RLVR data persistence and dataset management
 */

import { writeFile, readFile, mkdir, access } from 'fs/promises';
import { join, dirname } from 'path';
import { VerificationResult } from '../core/VerificationResult';
import { RewardCalculation } from '../core/Reward';
import { AgentMemory, AgentMetrics } from '../core/Agent';
import { SyntheticTask } from '../training/SyntheticGenerator';
import { TrainingMetrics } from '../training/RLVRTrainer';

export interface DatasetEntry {
  id: string;
  input: any;
  output: any;
  expected?: any;
  verification: VerificationResult;
  reward: RewardCalculation;
  metadata: {
    timestamp: number;
    agentName?: string;
    task?: string;
    difficulty?: number;
  };
}

export interface DatasetMetadata {
  name: string;
  description: string;
  version: string;
  created: number;
  lastModified: number;
  totalEntries: number;
  categories: string[];
  difficultyRange: [number, number];
  tags: string[];
}

export interface MadBoatBenchDataset {
  metadata: DatasetMetadata;
  entries: DatasetEntry[];
  statistics: {
    averageScore: number;
    successRate: number;
    categoryBreakdown: Record<string, number>;
    difficultyDistribution: Record<string, number>;
  };
}

/**
 * Save verification result to persistent storage
 */
export async function saveVerification(
  result: VerificationResult,
  input: any,
  output: any,
  options: {
    filePath?: string;
    agentName?: string;
    taskName?: string;
  } = {}
): Promise<string> {
  const timestamp = Date.now();
  const fileName = options.filePath || 
    join(process.cwd(), '.rlvr', 'verifications', `verification_${timestamp}.json`);
  
  // Ensure directory exists
  await ensureDirectoryExists(dirname(fileName));
  
  const entry: DatasetEntry = {
    id: `verification_${timestamp}`,
    input,
    output,
    verification: result,
    reward: { reward: result.score, confidence: result.confidence || 0.8, reason: result.reason },
    metadata: {
      timestamp,
      agentName: options.agentName,
      task: options.taskName
    }
  };
  
  await writeFile(fileName, JSON.stringify(entry, null, 2));
  return fileName;
}

/**
 * Load verification from file
 */
export async function loadVerification(filePath: string): Promise<DatasetEntry> {
  const content = await readFile(filePath, 'utf-8');
  return JSON.parse(content);
}

/**
 * Load dataset from file or directory
 */
export async function loadDataset(
  path: string,
  format: 'json' | 'jsonl' = 'json'
): Promise<MadBoatBenchDataset | DatasetEntry[]> {
  try {
    const content = await readFile(path, 'utf-8');
    
    if (format === 'jsonl') {
      // Parse JSON Lines format
      const lines = content.split('\n').filter(line => line.trim());
      const entries = lines.map(line => JSON.parse(line));
      return entries;
    } else {
      // Parse regular JSON
      const data = JSON.parse(content);
      
      // Check if it's a full MadBoatBench dataset or just entries
      if (data.metadata && data.entries) {
        return data as MadBoatBenchDataset;
      } else if (Array.isArray(data)) {
        return data as DatasetEntry[];
      } else {
        return [data as DatasetEntry];
      }
    }
  } catch (error) {
    throw new Error(`Failed to load dataset from ${path}: ${error}`);
  }
}

/**
 * Save agent memory to persistent storage
 */
export async function saveAgentMemory(
  agentName: string,
  memory: AgentMemory[],
  filePath?: string
): Promise<string> {
  const timestamp = Date.now();
  const fileName = filePath || 
    join(process.cwd(), '.rlvr', 'memories', `${agentName}_memory_${timestamp}.json`);
  
  await ensureDirectoryExists(dirname(fileName));
  
  const memoryData = {
    agentName,
    timestamp,
    memoryCount: memory.length,
    memory: memory.map(m => ({
      ...m,
      // Compress large inputs/outputs for storage
      input: JSON.stringify(m.input).length > 1000 
        ? { compressed: true, size: JSON.stringify(m.input).length }
        : m.input,
      output: JSON.stringify(m.output).length > 1000 
        ? { compressed: true, size: JSON.stringify(m.output).length }
        : m.output
    }))
  };
  
  await writeFile(fileName, JSON.stringify(memoryData, null, 2));
  return fileName;
}

/**
 * Load agent memory from persistent storage
 */
export async function loadAgentMemory(filePath: string): Promise<{
  agentName: string;
  memory: AgentMemory[];
}> {
  const content = await readFile(filePath, 'utf-8');
  const data = JSON.parse(content);
  return {
    agentName: data.agentName,
    memory: data.memory
  };
}

/**
 * Create MadBoatBench dataset from collected data
 */
export async function createMadBoatBenchDataset(
  entries: DatasetEntry[],
  metadata: Omit<DatasetMetadata, 'created' | 'lastModified' | 'totalEntries' | 'categories' | 'difficultyRange'>
): Promise<MadBoatBenchDataset> {
  const now = Date.now();
  
  // Calculate statistics
  const scores = entries.map(e => e.verification.score);
  const averageScore = scores.reduce((sum, s) => sum + s, 0) / scores.length;
  const successRate = entries.filter(e => e.verification.score >= 0.7).length / entries.length;
  
  // Extract categories
  const categorySet = new Set<string>();
  entries.forEach(entry => {
    if (entry.metadata.task) {
      categorySet.add(entry.metadata.task);
    }
  });
  const categories = Array.from(categorySet);
  
  // Calculate category breakdown
  const categoryBreakdown: Record<string, number> = {};
  categories.forEach(cat => {
    categoryBreakdown[cat] = entries.filter(e => e.metadata.task === cat).length;
  });
  
  // Calculate difficulty range
  const difficulties = entries
    .map(e => e.metadata.difficulty)
    .filter(d => d !== undefined) as number[];
  
  const difficultyRange: [number, number] = difficulties.length > 0 
    ? [Math.min(...difficulties), Math.max(...difficulties)]
    : [0, 1];
  
  // Calculate difficulty distribution
  const difficultyDistribution: Record<string, number> = {
    'easy (0.0-0.3)': difficulties.filter(d => d <= 0.3).length,
    'medium (0.3-0.7)': difficulties.filter(d => d > 0.3 && d <= 0.7).length,
    'hard (0.7-1.0)': difficulties.filter(d => d > 0.7).length
  };
  
  return {
    metadata: {
      ...metadata,
      created: now,
      lastModified: now,
      totalEntries: entries.length,
      categories,
      difficultyRange
    },
    entries,
    statistics: {
      averageScore,
      successRate,
      categoryBreakdown,
      difficultyDistribution
    }
  };
}

/**
 * Save MadBoatBench dataset
 */
export async function saveMadBoatBenchDataset(
  dataset: MadBoatBenchDataset,
  filePath: string,
  format: 'json' | 'jsonl' = 'json'
): Promise<void> {
  await ensureDirectoryExists(dirname(filePath));
  
  if (format === 'jsonl') {
    // Save as JSON Lines for large datasets
    const lines = dataset.entries.map(entry => JSON.stringify(entry));
    const content = [
      JSON.stringify({ metadata: dataset.metadata }),
      JSON.stringify({ statistics: dataset.statistics }),
      ...lines
    ].join('\n');
    
    await writeFile(filePath, content);
  } else {
    // Save as regular JSON
    await writeFile(filePath, JSON.stringify(dataset, null, 2));
  }
  
  console.log(`MadBoatBench dataset saved: ${dataset.metadata.totalEntries} entries to ${filePath}`);
}

/**
 * Load and merge multiple datasets
 */
export async function mergeDatasets(
  filePaths: string[],
  outputPath: string,
  mergedName: string
): Promise<MadBoatBenchDataset> {
  const datasets: (MadBoatBenchDataset | DatasetEntry[])[] = [];
  
  for (const filePath of filePaths) {
    const dataset = await loadDataset(filePath);
    datasets.push(dataset);
  }
  
  // Extract all entries
  const allEntries: DatasetEntry[] = [];
  datasets.forEach(dataset => {
    if (Array.isArray(dataset)) {
      allEntries.push(...dataset);
    } else {
      allEntries.push(...dataset.entries);
    }
  });
  
  // Remove duplicates by ID
  const uniqueEntries = Array.from(
    new Map(allEntries.map(entry => [entry.id, entry])).values()
  );
  
  // Create merged dataset
  const mergedDataset = await createMadBoatBenchDataset(uniqueEntries, {
    name: mergedName,
    description: `Merged dataset from ${filePaths.length} sources`,
    version: '1.0.0',
    tags: ['merged', 'comprehensive']
  });
  
  // Save merged dataset
  await saveMadBoatBenchDataset(mergedDataset, outputPath);
  
  return mergedDataset;
}

/**
 * Export synthetic tasks to dataset format
 */
export async function exportSyntheticTasks(
  tasks: SyntheticTask[],
  outputPath: string,
  agentName?: string
): Promise<void> {
  const entries: DatasetEntry[] = tasks.map((task, index) => ({
    id: task.id || `synthetic_${index}`,
    input: task.input,
    output: task.expectedOutput,
    expected: task.expectedOutput,
    verification: {
      score: 1.0, // Synthetic tasks are assumed correct
      reason: 'Synthetic data generation'
    },
    reward: {
      reward: 1.0,
      confidence: 0.95,
      reason: 'Perfect synthetic example'
    },
    metadata: {
      timestamp: Date.now(),
      agentName,
      task: task.category,
      difficulty: task.difficulty
    }
  }));
  
  const dataset = await createMadBoatBenchDataset(entries, {
    name: 'Synthetic Training Dataset',
    description: 'Generated synthetic tasks for RLVR training',
    version: '1.0.0',
    tags: ['synthetic', 'training', agentName || 'general'].filter(Boolean) as string[]
  });
  
  await saveMadBoatBenchDataset(dataset, outputPath);
}

/**
 * Create training metrics log
 */
export async function saveTrainingMetrics(
  agentName: string,
  metrics: TrainingMetrics[],
  filePath?: string
): Promise<string> {
  const timestamp = Date.now();
  const fileName = filePath || 
    join(process.cwd(), '.rlvr', 'training', `${agentName}_training_${timestamp}.json`);
  
  await ensureDirectoryExists(dirname(fileName));
  
  const trainingLog = {
    agentName,
    startTime: metrics.length > 0 ? metrics[0].timestamp : timestamp,
    endTime: metrics.length > 0 ? metrics[metrics.length - 1].timestamp : timestamp,
    totalEpisodes: metrics.length,
    finalSuccessRate: metrics.length > 0 ? metrics[metrics.length - 1].successRate : 0,
    metrics
  };
  
  await writeFile(fileName, JSON.stringify(trainingLog, null, 2));
  return fileName;
}

/**
 * Analyze dataset and generate report
 */
export async function analyzeDataset(
  dataset: MadBoatBenchDataset | string
): Promise<{
  summary: {
    totalEntries: number;
    averageScore: number;
    successRate: number;
    scoreDistribution: Record<string, number>;
  };
  trends: {
    improvementOverTime: number;
    consistencyScore: number;
    learningVelocity: number;
  };
  recommendations: string[];
}> {
  let data: MadBoatBenchDataset;
  
  if (typeof dataset === 'string') {
    data = await loadDataset(dataset) as MadBoatBenchDataset;
  } else {
    data = dataset;
  }
  
  const entries = data.entries;
  const scores = entries.map(e => e.verification.score);
  
  // Score distribution
  const scoreDistribution = {
    'excellent (0.9-1.0)': scores.filter(s => s >= 0.9).length,
    'good (0.7-0.9)': scores.filter(s => s >= 0.7 && s < 0.9).length,
    'fair (0.5-0.7)': scores.filter(s => s >= 0.5 && s < 0.7).length,
    'poor (0.0-0.5)': scores.filter(s => s < 0.5).length
  };
  
  // Time-based analysis
  const sortedEntries = entries.sort((a, b) => a.metadata.timestamp - b.metadata.timestamp);
  const firstHalf = sortedEntries.slice(0, Math.floor(sortedEntries.length / 2));
  const secondHalf = sortedEntries.slice(Math.floor(sortedEntries.length / 2));
  
  const firstAvg = firstHalf.reduce((sum, e) => sum + e.verification.score, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, e) => sum + e.verification.score, 0) / secondHalf.length;
  const improvementOverTime = secondAvg - firstAvg;
  
  // Consistency analysis
  const variance = scores.reduce((sum, s) => sum + Math.pow(s - data.statistics.averageScore, 2), 0) / scores.length;
  const consistencyScore = Math.max(0, 1 - Math.sqrt(variance));
  
  // Learning velocity (improvement per day)
  const timeSpan = sortedEntries.length > 0 
    ? (sortedEntries[sortedEntries.length - 1].metadata.timestamp - sortedEntries[0].metadata.timestamp) / (1000 * 60 * 60 * 24)
    : 1;
  const learningVelocity = improvementOverTime / Math.max(1, timeSpan);
  
  // Generate recommendations
  const recommendations: string[] = [];
  
  if (data.statistics.successRate < 0.7) {
    recommendations.push('Consider easier training tasks or more supportive verifiers');
  }
  if (improvementOverTime < 0.1) {
    recommendations.push('Learning progress is slow - review training methodology');
  }
  if (consistencyScore < 0.6) {
    recommendations.push('High variance in performance - consider stabilizing training environment');
  }
  if (data.statistics.categoryBreakdown && Object.keys(data.statistics.categoryBreakdown).length < 3) {
    recommendations.push('Limited task diversity - add more categories for robust learning');
  }
  
  return {
    summary: {
      totalEntries: entries.length,
      averageScore: data.statistics.averageScore,
      successRate: data.statistics.successRate,
      scoreDistribution
    },
    trends: {
      improvementOverTime,
      consistencyScore,
      learningVelocity
    },
    recommendations
  };
}

/**
 * Utility function to ensure directory exists
 */
async function ensureDirectoryExists(dirPath: string): Promise<void> {
  try {
    await access(dirPath);
  } catch {
    await mkdir(dirPath, { recursive: true });
  }
}