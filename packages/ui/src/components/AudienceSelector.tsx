'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Audience {
  id: string
  emoji: string
  title: string
  subtitle: string
  painPoint: string
  solution: string
  metrics: {
    potential: string
    time: string
    investment: string
  }
  color: string
}

const AUDIENCES: Audience[] = [
  {
    id: 'usa-entrepreneur',
    emoji: '🇺🇸',
    title: 'Empresário nos EUA',
    subtitle: 'Velocidade é tudo',
    painPoint: 'Preciso de IA agora ou fico para trás',
    solution: 'Sistema pronto em 24h, ROI em 7 dias',
    metrics: {
      potential: '$10K-100K/mês',
      time: '24 horas',
      investment: '$997'
    },
    color: 'from-blue-600 to-red-600'
  },
  {
    id: 'br-entrepreneur',
    emoji: '🇧🇷',
    title: 'Empresário no Brasil',
    subtitle: 'Autenticidade que converte',
    painPoint: 'Agência não entrega, anúncios não convertem',
    solution: 'Branding único + Estratégia validada',
    metrics: {
      potential: 'R$ 20-200K/mês',
      time: '7 dias',
      investment: 'R$ 997'
    },
    color: 'from-green-600 to-yellow-500'
  },
  {
    id: 'traffic-manager',
    emoji: '💼',
    title: 'Gestor de Tráfego',
    subtitle: 'Liberdade profissional',
    painPoint: 'Preso na agência, clientes ruins',
    solution: 'Sistema white-label + Pipeline automático',
    metrics: {
      potential: 'R$ 20-50K/mês',
      time: '30 dias',
      investment: 'R$ 497/mês'
    },
    color: 'from-purple-600 to-pink-600'
  },
  {
    id: 'vibe-coder',
    emoji: '👨‍💻',
    title: 'Vibe Coder',
    subtitle: 'Crie sem programar',
    painPoint: 'Programação parece impossível',
    solution: 'No-code + IA = Seu primeiro SaaS',
    metrics: {
      potential: 'R$ 5-50K/mês',
      time: '60 dias',
      investment: 'R$ 297/mês'
    },
    color: 'from-cyan-600 to-blue-600'
  }
]

export function AudienceSelector() {
  const [selectedAudience, setSelectedAudience] = useState<string>('usa-entrepreneur')
  const [isHovering, setIsHovering] = useState<string | null>(null)

  const selected = AUDIENCES.find(a => a.id === selectedAudience)

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Question */}
      <motion.h2 
        className="text-3xl font-bold text-center mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Qual é sua jornada?
      </motion.h2>

      {/* Audience Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {AUDIENCES.map((audience) => (
          <motion.div
            key={audience.id}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => setIsHovering(audience.id)}
            onMouseLeave={() => setIsHovering(null)}
            onClick={() => setSelectedAudience(audience.id)}
            className={`
              relative p-6 rounded-2xl cursor-pointer transition-all
              ${selectedAudience === audience.id 
                ? 'ring-4 ring-purple-400 shadow-2xl' 
                : 'hover:shadow-xl'
              }
              ${selectedAudience === audience.id
                ? 'bg-gradient-to-br ' + audience.color + ' text-white'
                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
              }
            `}
          >
            {/* Emoji */}
            <div className="text-4xl mb-3">{audience.emoji}</div>
            
            {/* Title */}
            <h3 className={`font-bold text-sm mb-1 ${
              selectedAudience === audience.id ? 'text-white' : 'text-gray-900 dark:text-white'
            }`}>
              {audience.title}
            </h3>
            
            {/* Subtitle */}
            <p className={`text-xs ${
              selectedAudience === audience.id ? 'text-white/80' : 'text-gray-500'
            }`}>
              {audience.subtitle}
            </p>

            {/* Selection Indicator */}
            {selectedAudience === audience.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
              >
                <span className="text-white text-xs">✓</span>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Selected Audience Details */}
      <AnimatePresence mode="wait">
        {selected && (
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 
                     rounded-3xl p-8 shadow-xl border border-gray-200 dark:border-gray-700"
          >
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left: Problem & Solution */}
              <div className="space-y-6">
                {/* Pain Point */}
                <div>
                  <h4 className="text-sm font-semibold text-red-600 mb-2">Sua Dor</h4>
                  <p className="text-lg text-gray-700 dark:text-gray-300">
                    "{selected.painPoint}"
                  </p>
                </div>

                {/* Solution */}
                <div>
                  <h4 className="text-sm font-semibold text-green-600 mb-2">Nossa Solução</h4>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    {selected.solution}
                  </p>
                </div>
              </div>

              {/* Right: Metrics & CTA */}
              <div className="space-y-6">
                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">{selected.metrics.potential}</p>
                    <p className="text-xs text-gray-500">Potencial</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{selected.metrics.time}</p>
                    <p className="text-xs text-gray-500">Tempo</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{selected.metrics.investment}</p>
                    <p className="text-xs text-gray-500">Investimento</p>
                  </div>
                </div>

                {/* CTA */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full py-4 rounded-full font-bold text-white shadow-lg
                            bg-gradient-to-r ${selected.color}`}
                >
                  Começar Minha Transformação
                </motion.button>
              </div>
            </div>

            {/* Bottom: Trust Elements */}
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Garantia de 30 dias
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Suporte 24/7
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    +500 clientes
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}