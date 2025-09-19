"use client"

import { motion } from 'framer-motion'
import { Crown, Zap, Gem, Star, ArrowRight, Check } from 'lucide-react'

// 🐠 Mandarin Fish creation: PlayStation Plus style upgrade marketplace
// Instructional design: Tiered subscription model with clear value progression

export function UpgradeWorld() {
  const plans = [
    {
      id: 'navigator',
      name: 'Navigator',
      rank: 'Atual',
      price: 'Gratuito',
      description: 'Acesso básico aos fundamentos',
      color: 'from-gray-500 to-slate-500',
      bgColor: 'from-gray-50 to-slate-50',
      borderColor: 'border-gray-200',
      icon: Star,
      features: [
        'Descoberta de Persona básica',
        'Acesso ao método ALMA',
        'Comunidade básica',
        'Relatórios essenciais'
      ],
      current: true
    },
    {
      id: 'captain',
      name: 'Captain',
      rank: 'Próximo nível',
      price: 'R$ 97/mês',
      description: 'Aceleração completa com mentoria',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50',
      borderColor: 'border-blue-200',
      icon: Zap,
      features: [
        'Análise avançada de 47 dimensões',
        'Sistema VORTEX completo',
        'Mentoria semanal individual',
        'Templates e ferramentas premium',
        'Acesso prioritário a eventos',
        'Dashboard analítico avançado'
      ],
      popular: true
    },
    {
      id: 'admiral',
      name: 'Admiral',
      rank: 'Elite',
      price: 'R$ 297/mês',
      description: 'Transformação total com acompanhamento VIP',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50',
      borderColor: 'border-purple-200',
      icon: Crown,
      features: [
        'Tudo do Captain +',
        'Odisseia personalizada completa',
        'Coaching 1:1 ilimitado',
        'Acesso a masterminds exclusivos',
        'Implementação assistida',
        'ROI garantido ou dinheiro de volta',
        'Certificação oficial'
      ]
    }
  ]

  const benefits = [
    {
      title: 'Aceleração 10x',
      description: 'Resultados em 90 dias ao invés de anos',
      icon: Zap
    },
    {
      title: 'Suporte Premium',
      description: 'Mentoria individual e suporte prioritário',
      icon: Star
    },
    {
      title: 'Comunidade VIP',
      description: 'Networking com outros líderes em transformação',
      icon: Gem
    }
  ]

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="px-12 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center space-x-3 mb-6"
            >
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full">
                <Crown size={32} className="text-white" />
              </div>
            </motion.div>

            <h1 className="text-5xl font-bold text-black mb-4">
              Acelere sua Jornada
            </h1>

            <p className="text-xl text-black/70 max-w-2xl mx-auto">
              Desbloqueie todo o potencial do MadBoat com acesso a ferramentas premium,
              mentoria personalizada e suporte VIP.
            </p>
          </div>

          {/* Plans Grid */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {plans.map((plan, index) => {
              const Icon = plan.icon

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className={`
                    relative overflow-hidden rounded-3xl border-2 transition-all duration-500
                    ${plan.current
                      ? `${plan.borderColor} bg-gradient-to-br ${plan.bgColor}`
                      : `${plan.borderColor} bg-white hover:shadow-xl hover:scale-105`
                    }
                    ${plan.popular ? 'ring-4 ring-blue-200 ring-opacity-50' : ''}
                  `}
                >
                  {/* Popular Badge */}
                  {plan.popular && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-2 rounded-full text-sm font-semibold">
                        Mais Popular
                      </div>
                    </div>
                  )}

                  {/* Current Badge */}
                  {plan.current && (
                    <div className="absolute top-4 right-4">
                      <div className="bg-gray-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Atual
                      </div>
                    </div>
                  )}

                  <div className="p-8">
                    {/* Plan Header */}
                    <div className="text-center mb-8">
                      <motion.div
                        className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${plan.color} mb-4`}
                        animate={{
                          rotate: [0, 360],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: index * 0.5
                        }}
                      >
                        <Icon size={24} className="text-white" />
                      </motion.div>

                      <h3 className="text-2xl font-bold text-black mb-2">
                        {plan.name}
                      </h3>

                      <p className="text-sm text-black/60 mb-4">
                        {plan.rank}
                      </p>

                      <div className="text-3xl font-bold text-black mb-2">
                        {plan.price}
                      </div>

                      <p className="text-black/70 text-sm">
                        {plan.description}
                      </p>
                    </div>

                    {/* Features */}
                    <div className="space-y-3 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <motion.div
                          key={featureIndex}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + featureIndex * 0.1 }}
                          className="flex items-center space-x-3"
                        >
                          <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${plan.color} flex items-center justify-center flex-shrink-0`}>
                            <Check size={12} className="text-white" />
                          </div>
                          <span className="text-black/80 text-sm">{feature}</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <motion.button
                      className={`
                        w-full py-4 rounded-xl font-semibold transition-all duration-300
                        flex items-center justify-center space-x-2
                        ${plan.current
                          ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                          : `bg-gradient-to-r ${plan.color} text-white hover:shadow-lg hover:scale-105`
                        }
                      `}
                      disabled={plan.current}
                      whileHover={!plan.current ? { scale: 1.02 } : {}}
                      whileTap={!plan.current ? { scale: 0.98 } : {}}
                    >
                      <span>
                        {plan.current ? 'Plano Atual' : 'Fazer Upgrade'}
                      </span>
                      {!plan.current && <ArrowRight size={16} />}
                    </motion.button>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Benefits Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white rounded-3xl p-12 border border-black/10 shadow-sm"
          >
            <h2 className="text-3xl font-bold text-black text-center mb-8">
              Por que fazer upgrade?
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + index * 0.2 }}
                    className="text-center"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4">
                      <Icon size={24} className="text-white" />
                    </div>

                    <h3 className="text-xl font-semibold text-black mb-2">
                      {benefit.title}
                    </h3>

                    <p className="text-black/70">
                      {benefit.description}
                    </p>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Guarantee */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="text-center mt-12 p-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200"
          >
            <h3 className="text-xl font-semibold text-black mb-2">
              Garantia de 30 dias
            </h3>
            <p className="text-black/70">
              Se não ficar completamente satisfeito, devolvemos 100% do seu investimento.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}