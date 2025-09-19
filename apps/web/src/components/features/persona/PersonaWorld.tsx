"use client"

import { motion } from 'framer-motion'
import { Target, Brain, Star, ChevronRight } from 'lucide-react'

// 🐠 Mandarin Fish creation: Persona Discovery World
// Instructional design: Progressive disclosure with clear value proposition

export function PersonaWorld() {
  return (
    <div className="h-full overflow-y-auto">
      {/* Hero Section */}
      <div className="relative">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50" />

        {/* Content */}
        <div className="relative z-10 px-12 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="max-w-4xl"
          >
            {/* Title */}
            <div className="mb-8">
              <motion.div
                className="inline-flex items-center space-x-3 mb-6"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="p-3 bg-blue-100 rounded-full">
                  <Target size={32} className="text-blue-600" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-black mb-2">
                    Descoberta de Persona
                  </h1>
                  <p className="text-lg text-black/70">
                    Identifique sua essência única através de 47 dimensões
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Value Proposition */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="space-y-4"
              >
                <h2 className="text-2xl font-semibold text-black mb-4">
                  O que você descobrirá
                </h2>
                <div className="space-y-3">
                  {[
                    'Seus padrões de comportamento únicos',
                    'Talentos naturais e pontos de força',
                    'Motivações profundas e valores centrais',
                    'Estratégias personalizadas de crescimento'
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="flex items-center space-x-3"
                    >
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span className="text-black/80">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="bg-white/50 rounded-2xl p-6 border border-black/10"
              >
                <div className="text-center">
                  <Brain size={48} className="text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-black mb-2">
                    Análise Profunda
                  </h3>
                  <p className="text-black/70 text-sm leading-relaxed">
                    Nossa metodologia analisa 47 dimensões diferentes da personalidade,
                    criando um mapa detalhado do seu potencial único.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="bg-white rounded-2xl p-8 border border-black/10 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-black mb-2">
                    Pronto para descobrir sua persona?
                  </h3>
                  <p className="text-black/70">
                    Complete a análise em aproximadamente 15 minutos
                  </p>
                </div>
                <motion.button
                  className="group bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg
                           flex items-center space-x-2 transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="font-medium">Iniciar Descoberta</span>
                  <ChevronRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform duration-300"
                  />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Steps Preview */}
      <div className="px-12 py-16 bg-gray-50/30">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-black text-center mb-12">
            Como funciona
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: '01',
                title: 'Questionário Detalhado',
                description: 'Responda perguntas cuidadosamente elaboradas sobre seus comportamentos e preferências',
                icon: Brain
              },
              {
                step: '02',
                title: 'Análise Multidimensional',
                description: 'Nosso algoritmo processa suas respostas através de 47 dimensões da personalidade',
                icon: Star
              },
              {
                step: '03',
                title: 'Relatório Personalizado',
                description: 'Receba insights únicos e estratégias específicas para seu perfil',
                icon: Target
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.2 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <step.icon size={24} className="text-blue-600" />
                </div>
                <div className="text-xs font-mono text-blue-600 mb-2 tracking-wider">
                  ETAPA {step.step}
                </div>
                <h3 className="text-lg font-semibold text-black mb-2">
                  {step.title}
                </h3>
                <p className="text-black/70 text-sm leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}