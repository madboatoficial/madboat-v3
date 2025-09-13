/**
 * Minimal persona questions for UI package compilation
 */

export interface PersonaQuestion {
  id: number
  text: string
  subText?: string
  options: string[]
  isOpenEnded?: boolean
  placeholder?: string
}

export const PERSONA_QUESTIONS: PersonaQuestion[] = [
  {
    id: 1,
    text: "How do you typically approach new challenges?",
    options: ["Analyze thoroughly first", "Jump in and adapt", "Seek guidance from others", "Create a structured plan"]
  }
  // Simplified for compilation
]