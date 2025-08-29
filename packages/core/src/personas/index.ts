export interface Persona {
  id: string
  name: string
  description: string
  characteristics: string[]
}

export const PERSONAS: Record<string, Persona> = {
  analitico: {
    id: 'analitico',
    name: 'Analítico',
    description: 'Lógico, estruturado, orientado por dados',
    characteristics: ['Frameworks', 'Métricas', 'Análises profundas']
  },
  criativo: {
    id: 'criativo', 
    name: 'Criativo',
    description: 'Inovador, inspirado, não-linear',
    characteristics: ['Brainstorming', 'Possibilidades', 'Experimentação']
  }
}