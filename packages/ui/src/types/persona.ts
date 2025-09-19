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

export interface PersonaQuestion {
  id: number
  alertText?: string
  introText?: string
  question: string // NOW INCLUDED!
  subText?: string
  type?: 'multiple_choice' | 'open_ended' | 'dual_range_slider' | 'visual_analog_scale' | 'situational_judgment' | 'reaction_time'
  placeholder?: string
  options: Array<{
    letter: 'A' | 'B' | 'C' | 'D' | 'E'
    text: string
    persona?: string
    points?: Record<string, number>
  }>
  sliderConfig?: {
    leftLabel: string
    rightLabel: string
    isDualRange?: boolean
    personas: Record<string, { min: number, max: number }>
  }
  scenario?: {
    title: string
    description: string
    choices: Array<{
      id: string
      text: string
      personas: Record<string, number>
      priority?: boolean
    }>
  }
  reactionConfig?: {
    words: Array<{
      word: string
      personas: Record<string, number>
    }>
    timeoutMs: number
  }
  weight: number // NOW INCLUDED!
}

export interface PersonaClassificationResult {
  // Core results
  persona: PersonaType
  primaryPersona: {
    id: string
    name: string
    traits: string[]
  }
  confidence: number
  personaDisplayName: string
  description: string

  // Classification details
  strengths: string[]
  challenges: string[]
  recommendations: string[]
  dominantPersonas: PersonaType[]
  weightedScores: Record<PersonaType, number>
  personaComposition: 'pure' | 'dual' | 'triple' | 'complex'

  // Protocol information
  protocolType: string
  videoUrl?: string

  // Additional insights (FIXED - NOW INCLUDED!)
  populationPercentage: number
  rarityLevel: 'very_common' | 'common' | 'rare' | 'very_rare' | 'extremely_rare'
  businessImpact?: string
  transformationPotential?: string
}