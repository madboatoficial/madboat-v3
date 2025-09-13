/**
 * Minimal classification engine for UI package compilation
 */

import { PersonaClassificationResult, PersonaType, QuestionResponse } from '../../types/persona'

export const classifyPersonaAdvanced = (responses: QuestionResponse[]): PersonaClassificationResult => {
  // Simplified implementation for compilation
  return {
    persona: PersonaType.ANALITICO,
    confidence: 50,
    personaDisplayName: "Analítico",
    description: "Persona analítica",
    strengths: [],
    challenges: [],
    recommendations: [],
    dominantPersonas: [PersonaType.ANALITICO],
    weightedScores: {
      [PersonaType.ANALITICO]: 50,
      [PersonaType.EMOTIVO]: 20,
      [PersonaType.PRAGMATICO]: 15,
      [PersonaType.CRIATIVO]: 10,
      [PersonaType.INSEGURO]: 5
    },
    protocolType: "basic"
  }
}