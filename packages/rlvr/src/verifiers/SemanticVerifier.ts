/**
 * Semantic correctness verifier using NLP and business logic
 */

import { Verifier } from '../core/Verifier';
import { VerificationResult } from '../core/VerificationResult';

export interface SemanticVerifierConfig {
  businessRules?: string[];
  domainKnowledge?: Record<string, any>;
  strictSemantics?: boolean;
}

export class SemanticVerifier extends Verifier<string, any> {
  private businessRules: string[];
  private domainKnowledge: Record<string, any>;
  private strictSemantics: boolean;
  
  constructor(config: SemanticVerifierConfig = {}) {
    super({ name: 'SemanticVerifier' });
    
    this.businessRules = config.businessRules || [];
    this.domainKnowledge = config.domainKnowledge || {};
    this.strictSemantics = config.strictSemantics ?? true;
  }
  
  async verify(output: string, expected: any): Promise<VerificationResult> {
    const result: VerificationResult = {
      score: 0,
      reason: '',
      breakdown: {
        semantic: 0,
        business: 0,
        consistency: 0,
        relevance: 0
      }
    };
    
    try {
      // Step 1: Semantic understanding
      const semanticScore = await this.evaluateSemanticCorrectness(output, expected);
      result.breakdown!.semantic = semanticScore;
      
      // Step 2: Business rule compliance
      const businessScore = await this.evaluateBusinessRules(output);
      result.breakdown!.business = businessScore;
      
      // Step 3: Consistency check
      const consistencyScore = await this.evaluateConsistency(output, expected);
      result.breakdown!.consistency = consistencyScore;
      
      // Step 4: Relevance scoring
      const relevanceScore = await this.evaluateRelevance(output, expected);
      result.breakdown!.relevance = relevanceScore;
      
      // Calculate overall score
      result.score = (
        semanticScore * 0.35 +
        businessScore * 0.25 +
        consistencyScore * 0.25 +
        relevanceScore * 0.15
      );
      
      // Generate reason
      if (result.score >= 0.9) {
        result.reason = 'Semantically perfect output';
      } else if (result.score >= 0.7) {
        result.reason = 'Good semantic correctness with minor issues';
      } else if (result.score >= 0.5) {
        result.reason = 'Moderate semantic correctness, needs improvement';
      } else {
        result.reason = 'Poor semantic correctness, significant issues detected';
      }
      
      // Extract learned patterns
      if (result.score > 0.8) {
        result.learnedPattern = this.extractSemanticPatterns(output);
      }
      
      return result;
      
    } catch (error) {
      result.score = 0;
      result.reason = `Semantic verification error: ${error}`;
      result.errors = [String(error)];
      return result;
    }
  }
  
  private async evaluateSemanticCorrectness(output: string, expected: any): Promise<number> {
    // Basic semantic understanding checks
    let score = 1.0;
    
    // Check for semantic coherence
    const sentences = output.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length === 0) return 0;
    
    // Penalize contradictions
    const contradictions = this.detectContradictions(sentences);
    score -= contradictions * 0.2;
    
    // Check logical flow
    const logicalFlow = this.evaluateLogicalFlow(sentences);
    score *= logicalFlow;
    
    // Check entity consistency
    const entityConsistency = this.evaluateEntityConsistency(output);
    score *= entityConsistency;
    
    return Math.max(0, score);
  }
  
  private async evaluateBusinessRules(output: string): Promise<number> {
    if (this.businessRules.length === 0) return 1.0;
    
    let violations = 0;
    const outputLower = output.toLowerCase();
    
    for (const rule of this.businessRules) {
      // Simple rule matching - in production this would be more sophisticated
      if (rule.startsWith('must_contain:')) {
        const required = rule.substring(13).toLowerCase();
        if (!outputLower.includes(required)) {
          violations++;
        }
      } else if (rule.startsWith('must_not_contain:')) {
        const forbidden = rule.substring(17).toLowerCase();
        if (outputLower.includes(forbidden)) {
          violations++;
        }
      } else if (rule.startsWith('format:')) {
        const format = rule.substring(7);
        if (!this.matchesFormat(output, format)) {
          violations++;
        }
      }
    }
    
    const compliance = 1.0 - (violations / this.businessRules.length);
    return Math.max(0, compliance);
  }
  
  private async evaluateConsistency(output: string, expected: any): Promise<number> {
    if (!expected || typeof expected !== 'string') return 1.0;
    
    // Check key concept consistency
    const outputConcepts = this.extractKeyConcepts(output);
    const expectedConcepts = this.extractKeyConcepts(expected);
    
    const commonConcepts = outputConcepts.filter(c => expectedConcepts.includes(c));
    const consistency = commonConcepts.length / Math.max(expectedConcepts.length, 1);
    
    return Math.min(1.0, consistency);
  }
  
  private async evaluateRelevance(output: string, expected: any): Promise<number> {
    if (!expected || typeof expected !== 'string') return 1.0;
    
    // Simple relevance scoring based on keyword overlap
    const outputWords = this.getSignificantWords(output);
    const expectedWords = this.getSignificantWords(expected);
    
    const overlap = outputWords.filter(w => expectedWords.includes(w));
    const relevance = overlap.length / Math.max(expectedWords.length, 1);
    
    return Math.min(1.0, relevance * 1.2); // Slight boost for good relevance
  }
  
  private detectContradictions(sentences: string[]): number {
    // Simple contradiction detection
    let contradictions = 0;
    const polarityWords = {
      positive: ['is', 'can', 'will', 'should', 'yes', 'true', 'correct'],
      negative: ['is not', 'cannot', 'will not', 'should not', 'no', 'false', 'incorrect']
    };
    
    for (let i = 0; i < sentences.length; i++) {
      for (let j = i + 1; j < sentences.length; j++) {
        const sent1 = sentences[i].toLowerCase();
        const sent2 = sentences[j].toLowerCase();
        
        // Very basic contradiction check
        const hasPositive1 = polarityWords.positive.some(w => sent1.includes(w));
        const hasNegative1 = polarityWords.negative.some(w => sent1.includes(w));
        const hasPositive2 = polarityWords.positive.some(w => sent2.includes(w));
        const hasNegative2 = polarityWords.negative.some(w => sent2.includes(w));
        
        if ((hasPositive1 && hasNegative2) || (hasNegative1 && hasPositive2)) {
          // Check if they're about the same topic
          const words1 = sent1.split(' ').filter(w => w.length > 3);
          const words2 = sent2.split(' ').filter(w => w.length > 3);
          const overlap = words1.filter(w => words2.includes(w));
          
          if (overlap.length > 2) {
            contradictions++;
          }
        }
      }
    }
    
    return contradictions;
  }
  
  private evaluateLogicalFlow(sentences: string[]): number {
    if (sentences.length <= 1) return 1.0;
    
    // Check for logical connectors
    const connectors = ['therefore', 'however', 'moreover', 'furthermore', 'consequently', 'thus', 'because'];
    let connectorsFound = 0;
    
    sentences.forEach(sentence => {
      const lowerSent = sentence.toLowerCase();
      if (connectors.some(c => lowerSent.includes(c))) {
        connectorsFound++;
      }
    });
    
    // Bonus for good logical flow
    const flowScore = Math.min(1.0, 0.7 + (connectorsFound / sentences.length) * 0.3);
    return flowScore;
  }
  
  private evaluateEntityConsistency(output: string): number {
    // Extract entities and check for consistency
    const entities = this.extractEntities(output);
    const entityCounts = new Map<string, number>();
    
    entities.forEach(entity => {
      entityCounts.set(entity, (entityCounts.get(entity) || 0) + 1);
    });
    
    // Penalize entity confusion (same entity referred to differently)
    let consistencyScore = 1.0;
    const variations = this.findEntityVariations(entities);
    consistencyScore -= variations * 0.1;
    
    return Math.max(0.5, consistencyScore);
  }
  
  private extractKeyConcepts(text: string): string[] {
    // Simple concept extraction
    const words = text.toLowerCase().match(/\b\w{4,}\b/g) || [];
    const concepts = [...new Set(words)];
    return concepts.filter(c => !this.isStopWord(c));
  }
  
  private getSignificantWords(text: string): string[] {
    const words = text.toLowerCase().match(/\b\w{3,}\b/g) || [];
    return [...new Set(words.filter(w => !this.isStopWord(w)))];
  }
  
  private extractEntities(text: string): string[] {
    // Simple entity extraction - capitalized words
    const entities = text.match(/\b[A-Z][a-z]+\b/g) || [];
    return [...new Set(entities)];
  }
  
  private findEntityVariations(entities: string[]): number {
    // Simple variation detection
    let variations = 0;
    const sorted = entities.sort();
    
    for (let i = 0; i < sorted.length - 1; i++) {
      const current = sorted[i].toLowerCase();
      const next = sorted[i + 1].toLowerCase();
      
      // Check for similar entities (simple edit distance)
      if (this.editDistance(current, next) <= 2 && current !== next) {
        variations++;
      }
    }
    
    return variations;
  }
  
  private editDistance(a: string, b: string): number {
    const dp = Array(a.length + 1).fill(null).map(() => Array(b.length + 1).fill(0));
    
    for (let i = 0; i <= a.length; i++) dp[i][0] = i;
    for (let j = 0; j <= b.length; j++) dp[0][j] = j;
    
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        if (a[i - 1] === b[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]) + 1;
        }
      }
    }
    
    return dp[a.length][b.length];
  }
  
  private matchesFormat(output: string, format: string): boolean {
    switch (format) {
      case 'json':
        try {
          JSON.parse(output);
          return true;
        } catch {
          return false;
        }
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(output.trim());
      case 'url':
        try {
          new URL(output.trim());
          return true;
        } catch {
          return false;
        }
      case 'markdown':
        return output.includes('#') || output.includes('*') || output.includes('```');
      default:
        return true;
    }
  }
  
  private isStopWord(word: string): boolean {
    const stopWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those'];
    return stopWords.includes(word.toLowerCase());
  }
  
  private extractSemanticPatterns(output: string): string {
    const patterns: string[] = [];
    
    if (output.includes('because') || output.includes('therefore')) {
      patterns.push('causal reasoning');
    }
    if (output.includes('however') || output.includes('although')) {
      patterns.push('contrastive reasoning');
    }
    if (output.match(/\d+%/) || output.match(/\$\d+/)) {
      patterns.push('quantitative analysis');
    }
    if (output.includes('step') || output.includes('first') || output.includes('then')) {
      patterns.push('sequential reasoning');
    }
    if (output.includes('example') || output.includes('for instance')) {
      patterns.push('exemplification');
    }
    
    return patterns.length > 0 
      ? `Semantic patterns: ${patterns.join(', ')}`
      : 'Standard semantic structure';
  }
}