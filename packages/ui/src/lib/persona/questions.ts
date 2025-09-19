/**
 * Persona questions for UI package compilation
 * Updated to match comprehensive PersonaQuestion interface
 */

import { PersonaQuestion } from '../../types/persona'

export const PERSONA_QUESTIONS: PersonaQuestion[] = [
  {
    id: 1,
    question: "How do you typically approach new challenges?", // Updated to match interface
    subText: "Choose the option that best describes your natural approach",
    options: [
      {
        letter: 'A',
        text: "Analyze thoroughly first",
        persona: 'ANALITICO'
      },
      {
        letter: 'B',
        text: "Jump in and adapt",
        persona: 'PRAGMATICO'
      },
      {
        letter: 'C',
        text: "Seek guidance from others",
        persona: 'EMOTIVO'
      },
      {
        letter: 'D',
        text: "Create a structured plan",
        persona: 'ANALITICO'
      }
    ],
    weight: 2 // Added weight property
  }
  // Simplified for compilation
]