"use client"
// PÁGINA COMPLETAMENTE NOVA - CACHE LIMPO
import { useState, useRef, useCallback } from 'react'

interface PersonaQuestion {
  id: number
  question: string
  subText?: string
  placeholder?: string
}

const QUESTIONS: PersonaQuestion[] = [
  {
    id: 0,
    question: "Descreva sua abordagem ideal para resolver um problema complexo no trabalho ou vida pessoal. Como você prefere pensar, planejar e executar soluções?",
    subText: "Seja específico sobre seu processo mental, preferências de planejamento e estilo de execução...",
    placeholder: "Digite aqui sua resposta detalhada..."
  },
  {
    id: 1,
    question: "Como você se comporta em situações de pressão ou deadline?",
    subText: "Descreva suas reações, estratégias e padrões de comportamento...",
    placeholder: "Digite sua resposta..."
  }
]

// Textarea ultra-simples sem NENHUMA funcionalidade extra
function StableTextarea({ placeholder }: { placeholder?: string }) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleChange = useCallback(() => {
    // Completamente vazio - zero side effects para manter foco
  }, [])

  return (
    <textarea
      ref={textareaRef}
      onChange={handleChange}
      placeholder={placeholder || "Digite sua resposta..."}
      className="w-full h-48 bg-white/5 border border-white/20 rounded-xl p-6 text-white placeholder:text-purple-300 text-lg resize-none focus:outline-none focus:border-purple-400"
      style={{ fontFamily: 'system-ui, sans-serif' }}
      suppressHydrationWarning
    />
  )
}

export default function PersonaPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const question = QUESTIONS[currentQuestion]

  if (!question) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Persona Identificada!</h1>
          <p className="text-purple-200">Suas respostas foram analisadas com sucesso.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-full mb-6">
            🚨 NOVA PÁGINA - QUESTÃO {currentQuestion + 1} DE {QUESTIONS.length}
          </div>
          <h1 className="text-3xl font-bold text-white mb-6 leading-tight">
            {question.question}
          </h1>
          {question.subText && (
            <p className="text-purple-200 text-lg max-w-3xl mx-auto">
              {question.subText}
            </p>
          )}
        </div>

        {/* Question Card */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-xl">
          <StableTextarea placeholder={question.placeholder} />

          <div className="flex justify-center mt-8">
            <button
              onClick={() => setCurrentQuestion(prev => prev + 1)}
              className="px-12 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-bold text-white transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {currentQuestion === QUESTIONS.length - 1 ? 'Revelar Minha Persona' : 'Próxima Questão'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}