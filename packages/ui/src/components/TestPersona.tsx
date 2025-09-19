'use client'

import React, { useState } from 'react'

interface TestPersonaProps {
  userName: string
  questions: any[]
  onComplete: (result: any) => void
  analyzeSemanticPatterns: (text: string) => any
  classifyPersona: (responses: any[]) => any
}

export const TestPersona: React.FC<TestPersonaProps> = ({
  userName,
  questions,
  onComplete
}) => {
  const [started, setStarted] = useState(false)

  if (!started) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-8">
        <div className="max-w-2xl text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              Descubra sua Persona Única
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Uma jornada de autoconhecimento profundo e autêntico para revelar quem você realmente é e como isso impacta seus negócios.
            </p>
          </div>

          <div className="pt-4">
            <button
              onClick={() => setStarted(true)}
              className="bg-black text-white px-16 py-6 text-xl font-bold tracking-wide hover:bg-gray-800 transition-colors duration-300 shadow-lg hover:shadow-xl"
            >
              DESCOBRIR AGORA
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Teste Simples Funcionando!</h1>
        <p>Persona discovery ativo para {userName}</p>
        <button
          onClick={() => onComplete({ test: 'success' })}
          className="mt-4 bg-green-600 text-white px-6 py-3 rounded"
        >
          Finalizar Teste
        </button>
      </div>
    </div>
  )
}