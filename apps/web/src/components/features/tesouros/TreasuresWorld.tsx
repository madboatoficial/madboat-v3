"use client"

import { motion } from 'framer-motion'
import { Gem, Award, Trophy, Star, Crown, Zap } from 'lucide-react'

// 🐠 Mandarin Fish creation: Treasures World with achievement gallery
// Instructional design: Progressive accomplishment showcase

export function TreasuresWorld() {
  const achievements = [
    {
      id: 'persona-complete',
      title: 'Autodescoberta',
      description: 'Completou a análise de persona',
      icon: Star,
      unlocked: true,
      rarity: 'comum',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50'
    },
    {
      id: 'alma-pillar-1',
      title: 'Autenticidade Revelada',
      description: 'Primeiro pilar do método ALMA',
      icon: Award,
      unlocked: false,
      rarity: 'raro',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50'
    },
    {
      id: 'vortex-acceleration',
      title: 'Aceleração Iniciada',
      description: 'Ativou o sistema VORTEX',
      icon: Zap,
      unlocked: false,
      rarity: 'épico',
      color: 'from-cyan-500 to-blue-500',
      bgColor: 'from-cyan-50 to-blue-50'
    },
    {
      id: 'odisseia-warrior',
      title: 'Guerreiro da Odisseia',
      description: 'Iniciou a jornada épica',
      icon: Crown,
      unlocked: false,
      rarity: 'lendário',
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-50 to-red-50'
    }
  ]

  const resources = [
    {
      title: 'Relatório de Persona',
      description: 'Análise detalhada das 47 dimensões',
      type: 'documento',
      unlocked: true
    },
    {
      title: 'Guia ALMA Completo',
      description: 'Material exclusivo do método',
      type: 'guia',
      unlocked: false
    },
    {
      title: 'Templates VORTEX',
      description: 'Ferramentas de aceleração',
      type: 'template',
      unlocked: false
    },
    {
      title: 'Mapa da Odisseia',
      description: 'Roadmap estratégico personalizado',
      type: 'mapa',
      unlocked: false
    }
  ]

  const getRarityStyle = (rarity: string) => {
    switch (rarity) {
      case 'comum':
        return 'border-gray-300 shadow-gray-100'
      case 'raro':
        return 'border-purple-300 shadow-purple-100'
      case 'épico':
        return 'border-cyan-300 shadow-cyan-100'
      case 'lendário':
        return 'border-orange-300 shadow-orange-100'
      default:
        return 'border-gray-300 shadow-gray-100'
    }
  }

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="px-12 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl"
        >
          {/* Header */}
          <div className="flex items-center space-x-4 mb-8">
            <div className="p-4 bg-purple-100 rounded-full">
              <Gem size={40} className="text-purple-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-black mb-2">TESOUROS</h1>
              <p className="text-xl text-black/70">Suas conquistas e recursos</p>
            </div>
          </div>

          {/* Achievements Section */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-black mb-6">Conquistas</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {achievements.map((achievement, index) => {
                const Icon = achievement.icon

                return (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`
                      relative overflow-hidden rounded-2xl border-2 transition-all duration-300
                      ${achievement.unlocked
                        ? `bg-gradient-to-br ${achievement.bgColor} ${getRarityStyle(achievement.rarity)} hover:scale-105`
                        : 'bg-gray-50 border-gray-200 opacity-60'
                      }
                    `}
                  >
                    <div className="p-6 text-center">
                      <motion.div
                        className={`
                          inline-flex items-center justify-center w-16 h-16 rounded-full mb-4
                          ${achievement.unlocked
                            ? `bg-gradient-to-br ${achievement.color}`
                            : 'bg-gray-300'
                          }
                        `}
                        animate={achievement.unlocked ? {
                          rotate: [0, 360],
                          scale: [1, 1.1, 1]
                        } : {}}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <Icon
                          size={24}
                          className={achievement.unlocked ? 'text-white' : 'text-gray-500'}
                        />
                      </motion.div>

                      <h3 className={`text-lg font-semibold mb-2 ${
                        achievement.unlocked ? 'text-black' : 'text-gray-500'
                      }`}>
                        {achievement.title}
                      </h3>

                      <p className={`text-sm ${
                        achievement.unlocked ? 'text-black/70' : 'text-gray-400'
                      }`}>
                        {achievement.description}
                      </p>

                      <div className={`mt-3 text-xs font-medium uppercase tracking-wider ${
                        achievement.unlocked ? achievement.color.replace('from-', 'text-').replace(' to-cyan-500', '') : 'text-gray-400'
                      }`}>
                        {achievement.rarity}
                      </div>
                    </div>

                    {/* Lock overlay for locked achievements */}
                    {!achievement.unlocked && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                          <div className="w-3 h-3 border-2 border-white rounded-sm" />
                        </div>
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Resources Section */}
          <div>
            <h2 className="text-2xl font-bold text-black mb-6">Recursos Desbloqueados</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {resources.map((resource, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className={`
                    p-6 rounded-2xl border transition-all duration-300
                    ${resource.unlocked
                      ? 'bg-white border-black/10 hover:border-black/20 hover:shadow-sm cursor-pointer'
                      : 'bg-gray-50 border-gray-200 opacity-60'
                    }
                  `}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className={`text-lg font-semibold mb-2 ${
                        resource.unlocked ? 'text-black' : 'text-gray-500'
                      }`}>
                        {resource.title}
                      </h3>
                      <p className={`text-sm ${
                        resource.unlocked ? 'text-black/70' : 'text-gray-400'
                      }`}>
                        {resource.description}
                      </p>
                      <div className={`mt-3 text-xs font-medium uppercase tracking-wider ${
                        resource.unlocked ? 'text-purple-600' : 'text-gray-400'
                      }`}>
                        {resource.type}
                      </div>
                    </div>

                    {resource.unlocked ? (
                      <motion.button
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Acessar
                      </motion.button>
                    ) : (
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 border-2 border-white rounded-sm" />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}