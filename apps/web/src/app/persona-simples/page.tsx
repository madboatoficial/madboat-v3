"use client"

import { useState, useRef, useCallback } from 'react'

interface PersonaQuestion {
  id: number
  question: string
  subText?: string
  placeholder?: string
}

const SIMPLE_QUESTIONS: PersonaQuestion[] = [
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
function SimpleTextarea({ placeholder }: { placeholder?: string }) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleChange = useCallback(() => {
    // Literalmente vazio - zero side effects
  }, [])

  return (
    <textarea
      ref={textareaRef}
      onChange={handleChange}
      placeholder={placeholder || "Digite sua resposta..."}
      className="w-full h-48 bg-gray-50 border border-gray-300 rounded-lg p-4 text-gray-900 placeholder:text-gray-500 text-base resize-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      style={{ fontFamily: 'system-ui, sans-serif' }}
    />
  )
}

export default function PersonaSimplesPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const question = SIMPLE_QUESTIONS[currentQuestion]

  if (!question) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Concluído!</h1>
          <p className="text-gray-600">Suas respostas foram registradas.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full mb-4">
            QUESTÃO {currentQuestion + 1} DE {SIMPLE_QUESTIONS.length}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {question.question}
          </h1>
          {question.subText && (
            <p className="text-gray-600 text-lg">
              {question.subText}
            </p>
          )}
        </div>

        {/* Question */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
          <SimpleTextarea placeholder={question.placeholder} />

          <div className="flex justify-center mt-8">
            <button
              onClick={() => setCurrentQuestion(prev => prev + 1)}
              className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {currentQuestion === SIMPLE_QUESTIONS.length - 1 ? 'Finalizar' : 'Próxima Questão'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}