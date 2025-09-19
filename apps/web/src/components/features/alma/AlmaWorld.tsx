"use client"

import { motion } from 'framer-motion'
import { Heart, Lightbulb, Compass, Zap } from 'lucide-react'

// 🐠 Mandarin Fish creation: ALMA Method World
// Instructional design: 4 pillars methodology visualization

export function AlmaWorld() {
  const almaPillars = [
    {
      letter: 'A',
      title: 'Autenticidade',
      subtitle: 'Revele sua verdadeira essência',
      description: 'Descubra e alinhe-se com seus valores fundamentais, eliminando máscaras e conectando-se com sua identidade autêntica.',
      icon: Heart,
      color: 'from-red-500 to-pink-500',
      bgColor: 'from-red-50 to-pink-50'
    },
    {
      letter: 'L',
      title: 'Legado',
      subtitle: 'Defina seu impacto duradouro',
      description: 'Construa uma visão clara do legado que deseja deixar e das transformações que quer gerar no mundo.',
      icon: Lightbulb,
      color: 'from-amber-500 to-orange-500',
      bgColor: 'from-amber-50 to-orange-50'
    },
    {
      letter: 'M',
      title: 'Mapeamento',
      subtitle: 'Trace sua jornada de transformação',
      description: 'Mapeie recursos, oportunidades e caminhos estratégicos para materializar sua visão autêntica.',
      icon: Compass,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50'
    },
    {
      letter: 'A',
      title: 'Aplicação',
      subtitle: 'Transforme insights em ação',
      description: 'Implemente estratégias práticas e sistemas que transformem sua autenticidade em resultados magnéticos.',
      icon: Zap,
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'from-purple-50 to-indigo-50'
    }
  ]

  return (
    <div className="h-full overflow-y-auto">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-purple-50 via-white to-blue-50 px-12 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl"
        >
          <h1 className="text-5xl font-bold text-black mb-4">
            Método ALMA
          </h1>
          <p className="text-xl text-black/70 mb-8 leading-relaxed">
            <span className="font-semibold">Autenticidade • Legado • Mapeamento • Aplicação</span><br />
            Uma jornada estruturada para alinhar sua essência com resultados magnéticos
          </p>
        </motion.div>
      </div>

      {/* ALMA Pillars */}
      <div className="px-12 py-16">
        <div className="grid gap-8 max-w-6xl mx-auto">
          {almaPillars.map((pillar, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 * index, duration: 0.6 }}
              className={`
                relative overflow-hidden rounded-2xl border border-black/10
                bg-gradient-to-br ${pillar.bgColor}
              `}
            >
              <div className="p-8 md:p-12">
                <div className="flex items-start space-x-6">
                  {/* Letter Circle */}
                  <motion.div
                    className={`
                      flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br ${pillar.color}
                      flex items-center justify-center text-white text-2xl font-bold
                    `}
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    {pillar.letter}
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-black mb-2">
                      {pillar.title}
                    </h3>
                    <p className="text-lg text-black/70 mb-4">
                      {pillar.subtitle}
                    </p>
                    <p className="text-black/60 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>

                  {/* Icon */}
                  <motion.div
                    className="flex-shrink-0"
                    animate={{
                      y: [0, -10, 0],
                      rotate: [0, 5, 0, -5, 0]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.5
                    }}
                  >
                    <pillar.icon size={32} className={`bg-gradient-to-br ${pillar.color} bg-clip-text text-transparent`} />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="text-center mt-16"
        >
          <motion.button
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700
                     text-white px-12 py-4 rounded-lg text-lg font-semibold
                     shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Iniciar Jornada ALMA
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}