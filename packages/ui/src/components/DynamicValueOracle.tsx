'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ValueMetric {
  label: string
  value: string
  highlight?: boolean
  icon?: React.ReactNode
}

interface StageContent {
  title: string
  subtitle: string
  metrics: ValueMetric[]
  cta?: {
    text: string
    action: () => void
    price?: string
  }
  testimonial?: {
    text: string
    author: string
    role: string
  }
}

const STAGE_CONTENTS: Record<string, StageContent> = {
  persona: {
    title: "Descubra Sua Essência Única",
    subtitle: "IA analisa 47 pontos de autenticidade",
    metrics: [
      { label: "Tempo", value: "3 min", highlight: true },
      { label: "Precisão", value: "94%" },
      { label: "Grátis", value: "100%" }
    ],
    cta: {
      text: "Começar Análise Gratuita",
      action: () => console.log('Start persona'),
      price: "GRÁTIS"
    },
    testimonial: {
      text: "Descobri forças que nem sabia que tinha",
      author: "Carlos M.",
      role: "Empresário em Miami"
    }
  },
  results: {
    title: "Resultados Comprovados",
    subtitle: "Números reais de clientes reais",
    metrics: [
      { label: "ROI Médio", value: "+312%", highlight: true },
      { label: "Conversão", value: "↑ 47%" },
      { label: "Tempo", value: "↓ 60%" }
    ],
    cta: {
      text: "Ver Casos de Sucesso",
      action: () => console.log('Show cases'),
    }
  },
  pricing: {
    title: "Investimento Inteligente",
    subtitle: "Comece pequeno, escale rápido",
    metrics: [
      { label: "Entry", value: "$47/mês" },
      { label: "Pro", value: "$497/mês", highlight: true },
      { label: "Scale", value: "$997/mês" }
    ],
    cta: {
      text: "Calcular Meu ROI",
      action: () => console.log('Calculate ROI'),
      price: "$47"
    }
  }
}

export function DynamicValueOracle() {
  const [currentStage, setCurrentStage] = useState('persona')
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [timeOnPage, setTimeOnPage] = useState(0)

  // Track time on page to progressively reveal value
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeOnPage(prev => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Auto-rotate content based on time
  useEffect(() => {
    if (timeOnPage > 0 && timeOnPage % 15 === 0 && !isHovering) {
      const stages = Object.keys(STAGE_CONTENTS)
      const currentIndex = stages.indexOf(currentStage)
      const nextIndex = (currentIndex + 1) % stages.length
      setCurrentStage(stages[nextIndex])
    }
  }, [timeOnPage, isHovering, currentStage])

  const content = STAGE_CONTENTS[currentStage]

  return (
    <div 
      className="relative w-full max-w-2xl mx-auto"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height
        })
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Ambient glow that follows mouse */}
      <motion.div
        className="absolute inset-0 opacity-20 pointer-events-none"
        animate={{
          background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(139, 92, 246, 0.3), transparent 50%)`
        }}
      />

      {/* Main Circle Container */}
      <motion.div 
        className="relative bg-white/5 backdrop-blur-sm rounded-full p-12 border border-purple-500/20"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-6"
          >
            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {content.title}
            </h2>
            
            {/* Subtitle */}
            <p className="text-gray-600 dark:text-gray-400">
              {content.subtitle}
            </p>

            {/* Metrics Row */}
            <div className="flex justify-center gap-8 py-4">
              {content.metrics.map((metric, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`text-center ${metric.highlight ? 'scale-110' : ''}`}
                >
                  <div className={`text-2xl font-bold ${
                    metric.highlight 
                      ? 'text-purple-600 dark:text-purple-400' 
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {metric.value}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {metric.label}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            {content.cta && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-shadow"
                onClick={content.cta.action}
              >
                <span>{content.cta.text}</span>
                {content.cta.price && (
                  <span className="ml-2 text-sm opacity-80">• {content.cta.price}</span>
                )}
              </motion.button>
            )}

            {/* Testimonial */}
            {content.testimonial && timeOnPage > 5 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
              >
                <p className="text-sm italic text-gray-600 dark:text-gray-400">
                  "{content.testimonial.text}"
                </p>
                <p className="text-xs mt-2 text-gray-500">
                  — {content.testimonial.author}, {content.testimonial.role}
                </p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Progress Indicators */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
          {Object.keys(STAGE_CONTENTS).map((stage) => (
            <button
              key={stage}
              onClick={() => setCurrentStage(stage)}
              className={`w-2 h-2 rounded-full transition-all ${
                stage === currentStage 
                  ? 'w-8 bg-purple-600' 
                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </motion.div>

      {/* Floating Value Pills - appear after 10 seconds */}
      {timeOnPage > 10 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute -top-4 -right-4"
        >
          <div className="bg-green-500 text-white text-xs px-3 py-1 rounded-full">
            Economize 60% do tempo
          </div>
        </motion.div>
      )}
    </div>
  )
}