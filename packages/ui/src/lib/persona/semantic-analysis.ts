/**
 * Minimal semantic analysis for UI package compilation
 */

import { PersonaType, TypingMetrics } from '../../types/persona'

export interface PersonaAnalysis {
  type: PersonaType
  confidence: number
  indicators: string[]
  semanticScore: number
  behavioralPatterns: string[]
}

export const analyzeSemanticResponse = (text: string, typingMetrics: TypingMetrics): PersonaAnalysis => {
  // Simplified implementation for compilation
  return {
    type: PersonaType.ANALITICO,
    confidence: 50,
    indicators: [],
    semanticScore: 0,
    behavioralPatterns: []
  }
}