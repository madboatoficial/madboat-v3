/**
 * Minimal persona types for UI package compilation
 * These are simplified versions to avoid module resolution errors
 */

export enum PersonaType {
  ANALITICO = 'analitico',
  EMOTIVO = 'emotivo',
  PRAGMATICO = 'pragmatico',
  CRIATIVO = 'criativo',
  INSEGURO = 'inseguro'
}

export interface QuestionResponse {
  questionId: number
  answer: string | number
  timestamp: number
}

export interface TypingMetrics {
  averageTypingSpeed: number
  pauseCount: number
  backspaceCount: number
  hesitationCount: number
  totalTime: number
}

export interface PersonaClassificationResult {
  persona: PersonaType
  confidence: number
  personaDisplayName: string
  description: string
  strengths: string[]
  challenges: string[]
  recommendations: string[]
  dominantPersonas: PersonaType[]
  weightedScores: Record<PersonaType, number>
  protocolType: string
}