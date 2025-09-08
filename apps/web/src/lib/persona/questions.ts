/**
 * 📋 PERSONA IDENTIFICATION QUESTIONNAIRE
 * 10 perguntas estratégicas com pesos diferenciados
 * Baseado em neurociência comportamental e psicologia cognitiva
 */

import { PersonaQuestion, PersonaType } from '@/types/persona'

export const PERSONA_QUESTIONS: PersonaQuestion[] = [
  {
    id: 0,
    question: "Como você normalmente toma decisões importantes na sua vida?",
    subText: "Pode ser sobre trabalho, investimentos, relacionamentos... me conta seu processo.",
    isOpenEnded: true,
    placeholder: "Digite aqui sua resposta...",
    options: [],
    weight: 3 // PESO 3X - ANÁLISE SEMÂNTICA
  },
  {
    id: 1,
    question: "Quando você precisa tomar uma decisão importante, qual seu primeiro impulso?",
    options: [
      { 
        letter: "A", 
        text: "Busco dados e informações para analisar todas as opções",
        persona: PersonaType.ANALITICO
      },
      { 
        letter: "B", 
        text: "Sinto o que meu coração diz e sigo minha intuição",
        persona: PersonaType.EMOTIVO
      },
      { 
        letter: "C", 
        text: "Vou direto ao que sei que funciona, sem perder tempo",
        persona: PersonaType.PRAGMATICO
      },
      { 
        letter: "D", 
        text: "Exploro várias possibilidades criativas antes de escolher",
        persona: PersonaType.CRIATIVO
      },
      { 
        letter: "E", 
        text: "Peço opinião de outras pessoas porque não confio só na minha",
        persona: PersonaType.INSEGURO
      }
    ],
    weight: 1
  },
  {
    id: 2,
    question: "Como você prefere trabalhar em projetos importantes?",
    options: [
      { 
        letter: "A", 
        text: "Com cronograma estruturado e métricas claras de progresso",
        persona: PersonaType.ANALITICO
      },
      { 
        letter: "B", 
        text: "Seguindo o que me inspira e motiva emocionalmente",
        persona: PersonaType.EMOTIVO
      },
      { 
        letter: "C", 
        text: "Focado no resultado, de forma rápida e eficiente",
        persona: PersonaType.PRAGMATICO
      },
      { 
        letter: "D", 
        text: "Experimentando abordagens diferentes até encontrar a ideal",
        persona: PersonaType.CRIATIVO
      },
      { 
        letter: "E", 
        text: "Com supervisão constante para ter certeza que estou no caminho certo",
        persona: PersonaType.INSEGURO
      }
    ],
    weight: 1
  },
  {
    id: 3,
    question: "Quando alguém critica seu trabalho, sua primeira reação é:",
    options: [
      { 
        letter: "A", 
        text: "Analisar objetivamente se a crítica tem fundamento",
        persona: PersonaType.ANALITICO
      },
      { 
        letter: "B", 
        text: "Sentir-me tocado emocionalmente, mas buscar o aprendizado",
        persona: PersonaType.EMOTIVO
      },
      { 
        letter: "C", 
        text: "Avaliar se vale a pena fazer mudanças ou seguir em frente",
        persona: PersonaType.PRAGMATICO
      },
      { 
        letter: "D", 
        text: "Ver como uma oportunidade de criar algo ainda melhor",
        persona: PersonaType.CRIATIVO
      },
      { 
        letter: "E", 
        text: "Ficar inseguro e questionar se realmente sei o que estou fazendo",
        persona: PersonaType.INSEGURO
      }
    ],
    weight: 1
  },
  {
    id: 4,
    question: "O que mais te motiva em um projeto?",
    options: [
      { 
        letter: "A", 
        text: "Resolver problemas complexos de forma lógica e sistemática",
        persona: PersonaType.ANALITICO
      },
      { 
        letter: "B", 
        text: "Criar conexões significativas e impacto emocional",
        persona: PersonaType.EMOTIVO
      },
      { 
        letter: "C", 
        text: "Alcançar resultados concretos rapidamente",
        persona: PersonaType.PRAGMATICO
      },
      { 
        letter: "D", 
        text: "Expressar criatividade e inovar",
        persona: PersonaType.CRIATIVO
      },
      { 
        letter: "E", 
        text: "Receber validação de que estou fazendo um bom trabalho",
        persona: PersonaType.INSEGURO
      }
    ],
    weight: 1
  },
  {
    id: 5,
    question: "Como você lida com situações onde não tem todas as informações?",
    options: [
      { 
        letter: "A", 
        text: "Busco mais dados antes de agir",
        persona: PersonaType.ANALITICO
      },
      { 
        letter: "B", 
        text: "Confio na minha intuição e experiência emocional",
        persona: PersonaType.EMOTIVO
      },
      { 
        letter: "C", 
        text: "Ajo com o que tenho e ajusto no caminho",
        persona: PersonaType.PRAGMATICO
      },
      { 
        letter: "D", 
        text: "Vejo como oportunidade para soluções criativas",
        persona: PersonaType.CRIATIVO
      },
      { 
        letter: "E", 
        text: "Fico ansioso e prefiro aguardar mais clareza",
        persona: PersonaType.INSEGURO
      }
    ],
    weight: 1
  },
  {
    id: 6,
    question: "Quando explica algo importante, você tende a:",
    options: [
      { 
        letter: "A", 
        text: "Usar dados, gráficos e evidências",
        persona: PersonaType.ANALITICO
      },
      { 
        letter: "B", 
        text: "Contar histórias e conectar emocionalmente",
        persona: PersonaType.EMOTIVO
      },
      { 
        letter: "C", 
        text: "Ser direto e focado nos pontos principais",
        persona: PersonaType.PRAGMATICO
      },
      { 
        letter: "D", 
        text: "Usar metáforas e exemplos criativos",
        persona: PersonaType.CRIATIVO
      },
      { 
        letter: "E", 
        text: "Perguntar constantemente se está sendo claro",
        persona: PersonaType.INSEGURO
      }
    ],
    weight: 1
  },
  {
    id: 7,
    question: "Você se sente mais confiante quando:",
    options: [
      { 
        letter: "A", 
        text: "Tem informações suficientes para tomar decisões embasadas",
        persona: PersonaType.ANALITICO
      },
      { 
        letter: "B", 
        text: "Está alinhado com seus valores e propósito",
        persona: PersonaType.EMOTIVO
      },
      { 
        letter: "C", 
        text: "Está executando algo que já sabe que funciona",
        persona: PersonaType.PRAGMATICO
      },
      { 
        letter: "D", 
        text: "Está explorando novas possibilidades",
        persona: PersonaType.CRIATIVO
      },
      { 
        letter: "E", 
        text: "Tem alguém para validar suas escolhas",
        persona: PersonaType.INSEGURO
      }
    ],
    weight: 1
  },
  // ===== NOVAS PERGUNTAS ESTRATÉGICAS =====
  {
    id: 8,
    question: "Em situações de pressão e prazo apertado, você:",
    options: [
      { 
        letter: "A", 
        text: "Organiza os dados disponíveis e prioriza baseado em análise rápida",
        persona: PersonaType.ANALITICO
      },
      { 
        letter: "B", 
        text: "Segue sua intuição sobre o que é mais importante naquele momento",
        persona: PersonaType.EMOTIVO
      },
      { 
        letter: "C", 
        text: "Foca no essencial e elimina tudo que não agrega resultado imediato",
        persona: PersonaType.PRAGMATICO
      },
      { 
        letter: "D", 
        text: "Busca soluções criativas que resolvam múltiplos problemas de uma vez",
        persona: PersonaType.CRIATIVO
      },
      { 
        letter: "E", 
        text: "Procura orientação de alguém mais experiente antes de agir",
        persona: PersonaType.INSEGURO
      }
    ],
    weight: 2 // PESO 2X - COMPORTAMENTO SOB STRESS
  },
  {
    id: 9,
    question: "Quando você apresenta uma ideia nova para um grupo, você:",
    options: [
      { 
        letter: "A", 
        text: "Prepara dados e argumentos sólidos para fundamentar sua proposta",
        persona: PersonaType.ANALITICO
      },
      { 
        letter: "B", 
        text: "Compartilha sua paixão e conecta a ideia com valores e benefícios humanos",
        persona: PersonaType.EMOTIVO
      },
      { 
        letter: "C", 
        text: "Mostra claramente como a ideia gera resultados práticos e econômicos",
        persona: PersonaType.PRAGMATICO
      },
      { 
        letter: "D", 
        text: "Apresenta múltiplas variações e possibilidades de implementação",
        persona: PersonaType.CRIATIVO
      },
      { 
        letter: "E", 
        text: "Testa a receptividade do grupo antes de se comprometer totalmente com a ideia",
        persona: PersonaType.INSEGURO
      }
    ],
    weight: 2 // PESO 2X - COMPORTAMENTO SOCIAL/PROFISSIONAL
  }
]

// Helper function to get persona from answer
export function getPersonaFromAnswer(questionId: number, answer: string): PersonaType | undefined {
  const question = PERSONA_QUESTIONS[questionId]
  if (!question || question.isOpenEnded) return undefined
  
  const option = question.options.find(opt => opt.letter === answer)
  return option?.persona
}

// Get question by ID
export function getQuestionById(id: number): PersonaQuestion | undefined {
  return PERSONA_QUESTIONS.find(q => q.id === id)
}

// Get total number of questions
export function getTotalQuestions(): number {
  return PERSONA_QUESTIONS.length
}

// Check if question is open-ended
export function isOpenEndedQuestion(id: number): boolean {
  const question = getQuestionById(id)
  return question?.isOpenEnded || false
}

// Get question weight
export function getQuestionWeight(id: number): number {
  const question = getQuestionById(id)
  return question?.weight || 1
}