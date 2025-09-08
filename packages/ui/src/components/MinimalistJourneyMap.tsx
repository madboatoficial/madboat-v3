'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface JourneyStep {
  id: string
  name: string
  description: string
  value: string
  duration: string
  price?: string
  status: 'locked' | 'available' | 'completed' | 'current'
  dependencies?: string[]
}

const JOURNEY_STEPS: JourneyStep[] = [
  {
    id: 'persona',
    name: 'Persona Única',
    description: 'Descubra sua essência',
    value: 'Clareza Total',
    duration: '3 min',
    price: 'Grátis',
    status: 'current'
  },
  {
    id: 'brand-dna',
    name: 'DNA da Marca',
    description: 'Autenticidade revelada',
    value: '+47% Conexão',
    duration: '15 min',
    price: '$97',
    status: 'available',
    dependencies: ['persona']
  },
  {
    id: 'alma-method',
    name: 'Método ALMA',
    description: 'Transformação completa',
    value: '+312% ROI',
    duration: '7 dias',
    price: '$997',
    status: 'available',
    dependencies: ['brand-dna']
  },
  {
    id: 'vortex',
    name: 'VORTEX',
    description: 'Aceleração exponencial',
    value: '10x Velocidade',
    duration: '14 dias',
    price: '$1997',
    status: 'locked',
    dependencies: ['alma-method']
  },
  {
    id: 'odyssey',
    name: 'ODISSEIA',
    description: 'Maestria total',
    value: 'Infinito',
    duration: '30 dias',
    price: '$2997',
    status: 'locked',
    dependencies: ['vortex']
  }
]

export function MinimalistJourneyMap() {
  const [hoveredStep, setHoveredStep] = useState<string | null>(null)
  const [selectedStep, setSelectedStep] = useState<string>('persona')

  const selected = JOURNEY_STEPS.find(s => s.id === selectedStep)

  return (
    <div className="w-full max-w-4xl mx-auto p-8">
      {/* Journey Path */}
      <div className="relative">
        {/* Connection Lines */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 0 }}
        >
          {JOURNEY_STEPS.map((step, idx) => {
            if (idx === 0) return null
            const prevStep = JOURNEY_STEPS[idx - 1]
            const x1 = (idx - 1) * (100 / (JOURNEY_STEPS.length - 1))
            const x2 = idx * (100 / (JOURNEY_STEPS.length - 1))
            
            return (
              <line
                key={step.id}
                x1={`${x1}%`}
                y1="50%"
                x2={`${x2}%`}
                y2="50%"
                stroke={step.status === 'locked' ? '#d1d5db' : '#8b5cf6'}
                strokeWidth="2"
                strokeDasharray={step.status === 'locked' ? '5,5' : '0'}
                opacity={step.status === 'locked' ? 0.3 : 0.5}
              />
            )
          })}
        </svg>

        {/* Journey Nodes */}
        <div className="relative flex justify-between items-center h-24">
          {JOURNEY_STEPS.map((step, idx) => (
            <motion.div
              key={step.id}
              className="relative z-10"
              onMouseEnter={() => setHoveredStep(step.id)}
              onMouseLeave={() => setHoveredStep(null)}
              onClick={() => step.status !== 'locked' && setSelectedStep(step.id)}
              whileHover={{ scale: step.status !== 'locked' ? 1.1 : 1 }}
            >
              {/* Node */}
              <motion.div
                className={`
                  w-16 h-16 rounded-full flex items-center justify-center cursor-pointer
                  transition-all duration-300 relative
                  ${step.status === 'completed' ? 'bg-green-500' : ''}
                  ${step.status === 'current' ? 'bg-purple-600 ring-4 ring-purple-200' : ''}
                  ${step.status === 'available' ? 'bg-white border-2 border-purple-400' : ''}
                  ${step.status === 'locked' ? 'bg-gray-200 cursor-not-allowed' : ''}
                `}
                animate={{
                  boxShadow: selectedStep === step.id 
                    ? '0 0 30px rgba(139, 92, 246, 0.5)' 
                    : '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
              >
                <span className={`
                  text-lg font-bold
                  ${step.status === 'completed' || step.status === 'current' ? 'text-white' : ''}
                  ${step.status === 'available' ? 'text-purple-600' : ''}
                  ${step.status === 'locked' ? 'text-gray-400' : ''}
                `}>
                  {idx + 1}
                </span>

                {/* Status Icon */}
                {step.status === 'completed' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
                  >
                    <span className="text-white text-xs">✓</span>
                  </motion.div>
                )}

                {step.status === 'current' && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-purple-600"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                )}
              </motion.div>

              {/* Hover Card */}
              {hoveredStep === step.id && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 
                           bg-white dark:bg-gray-800 rounded-lg shadow-xl p-3 
                           min-w-[150px] z-20 pointer-events-none"
                >
                  <p className="font-semibold text-sm">{step.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                  <div className="flex justify-between mt-2 text-xs">
                    <span className="text-purple-600">{step.price}</span>
                    <span className="text-gray-400">{step.duration}</span>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Selected Step Details */}
      {selected && (
        <motion.div
          key={selected.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 text-center"
        >
          <h3 className="text-2xl font-bold mb-2">{selected.name}</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{selected.description}</p>
          
          <div className="flex justify-center gap-8 mb-6">
            <div>
              <p className="text-3xl font-bold text-purple-600">{selected.value}</p>
              <p className="text-xs text-gray-500">Valor Esperado</p>
            </div>
            <div>
              <p className="text-2xl font-semibold">{selected.duration}</p>
              <p className="text-xs text-gray-500">Tempo Necessário</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-green-600">{selected.price}</p>
              <p className="text-xs text-gray-500">Investimento</p>
            </div>
          </div>

          {selected.status === 'available' || selected.status === 'current' ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 
                       text-white rounded-full font-medium shadow-lg"
            >
              {selected.status === 'current' ? 'Começar Agora' : `Desbloquear por ${selected.price}`}
            </motion.button>
          ) : (
            <div className="text-gray-400 text-sm">
              🔒 Complete as etapas anteriores para desbloquear
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}