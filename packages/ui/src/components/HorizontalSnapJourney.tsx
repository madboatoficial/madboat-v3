'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface JourneyCard {
  id: string
  number: string
  title: string
  subtitle: string
  description: string
  color: string
  icon: string
  features: string[]
  price?: string
  duration?: string
}

const JOURNEY_CARDS: JourneyCard[] = [
  {
    id: 'start',
    number: '🚢',
    title: 'Bem-vindo à MadBoat',
    subtitle: 'Sua transformação começa aqui',
    description: 'Uma jornada de descoberta e crescimento exponencial com IA',
    color: 'from-blue-600 to-purple-600',
    icon: '⚓',
    features: [
      'Sistema completo de transformação',
      'Metodologia validada',
      'Suporte personalizado'
    ]
  },
  {
    id: 'persona',
    number: '01',
    title: 'Persona Única',
    subtitle: 'Descubra quem você realmente é',
    description: 'IA analisa 47 dimensões da sua personalidade para revelar sua essência autêntica',
    color: 'from-purple-600 to-pink-600',
    icon: '🎭',
    features: [
      'Análise em 3 minutos',
      '94% de precisão',
      'Relatório completo'
    ],
    price: 'GRÁTIS',
    duration: '3 min'
  },
  {
    id: 'alma',
    number: '02',
    title: 'Método ALMA',
    subtitle: 'Alinhamento • Leveza • Magnetismo • Autenticidade',
    description: 'Transforme sua essência em uma estratégia de negócio magnética e autêntica',
    color: 'from-pink-600 to-red-600',
    icon: '💎',
    features: [
      'Branding autêntico',
      'Estratégia personalizada',
      'Templates prontos'
    ],
    price: '$997',
    duration: '7 dias'
  },
  {
    id: 'vortex',
    number: '03',
    title: 'VORTEX',
    subtitle: 'Aceleração Exponencial',
    description: 'Sistemas de IA que multiplicam seus resultados em 10x',
    color: 'from-orange-600 to-yellow-600',
    icon: '🌪️',
    features: [
      'Automação completa',
      'IA generativa',
      'Escala infinita'
    ],
    price: '$1,997',
    duration: '14 dias'
  },
  {
    id: 'odisseia',
    number: '04',
    title: 'ODISSEIA',
    subtitle: 'Maestria & Legacy',
    description: 'Torne-se uma autoridade inquestionável no seu mercado',
    color: 'from-green-600 to-teal-600',
    icon: '👑',
    features: [
      'Mentoria avançada',
      'Comunidade exclusiva',
      'Certificação MadBoat'
    ],
    price: '$2,997',
    duration: '30 dias'
  }
]

export function HorizontalSnapJourney() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [currentCard, setCurrentCard] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)

  // Handle scroll to update current card
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    let scrollTimeout: NodeJS.Timeout

    const handleScroll = () => {
      setIsScrolling(true)
      clearTimeout(scrollTimeout)
      
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false)
      }, 150)

      const scrollLeft = container.scrollLeft
      const cardWidth = container.offsetWidth
      const newIndex = Math.round(scrollLeft / cardWidth)
      setCurrentCard(newIndex)
    }

    container.addEventListener('scroll', handleScroll)
    return () => {
      container.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimeout)
    }
  }, [])

  // Navigate to specific card
  const scrollToCard = (index: number) => {
    const container = scrollContainerRef.current
    if (!container) return

    const cardWidth = container.offsetWidth
    container.scrollTo({
      left: cardWidth * index,
      behavior: 'smooth'
    })
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && currentCard < JOURNEY_CARDS.length - 1) {
        scrollToCard(currentCard + 1)
      } else if (e.key === 'ArrowLeft' && currentCard > 0) {
        scrollToCard(currentCard - 1)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentCard])

  const current = JOURNEY_CARDS[currentCard]

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-white 
                    dark:from-gray-900 dark:to-black">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-800 z-20">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
          animate={{
            scaleX: (currentCard + 1) / JOURNEY_CARDS.length,
          }}
          style={{ transformOrigin: '0%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 
                    flex gap-3 px-6 py-3 bg-white/80 dark:bg-gray-900/80 
                    backdrop-blur-md rounded-full shadow-lg">
        {JOURNEY_CARDS.map((card, idx) => (
          <button
            key={card.id}
            onClick={() => scrollToCard(idx)}
            className={`
              transition-all duration-300 rounded-full
              ${currentCard === idx 
                ? 'w-8 h-3 bg-gradient-to-r ' + card.color
                : 'w-3 h-3 bg-gray-400 hover:bg-gray-600'
              }
            `}
            aria-label={card.title}
          />
        ))}
      </div>

      {/* Arrow Navigation */}
      <AnimatePresence>
        {currentCard > 0 && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onClick={() => scrollToCard(currentCard - 1)}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20
                     w-12 h-12 rounded-full bg-white/80 dark:bg-gray-900/80 
                     backdrop-blur-md shadow-lg flex items-center justify-center
                     hover:scale-110 transition-transform"
          >
            ←
          </motion.button>
        )}
        
        {currentCard < JOURNEY_CARDS.length - 1 && (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            onClick={() => scrollToCard(currentCard + 1)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20
                     w-12 h-12 rounded-full bg-white/80 dark:bg-gray-900/80 
                     backdrop-blur-md shadow-lg flex items-center justify-center
                     hover:scale-110 transition-transform"
          >
            →
          </motion.button>
        )}
      </AnimatePresence>

      {/* Main Scroll Container */}
      <div
        ref={scrollContainerRef}
        className="w-full h-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory 
                 scrollbar-hide scroll-smooth"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <div className="flex h-full">
          {JOURNEY_CARDS.map((card, idx) => (
            <div
              key={card.id}
              className="min-w-full h-full snap-center flex items-center justify-center px-8 py-16"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl w-full"
              >
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  
                  {/* Left: Visual */}
                  <div className="relative">
                    {/* Card Number/Icon */}
                    <motion.div
                      initial={{ rotate: -180, opacity: 0 }}
                      whileInView={{ rotate: 0, opacity: 1 }}
                      transition={{ delay: 0.2, type: 'spring' }}
                      className="relative"
                    >
                      <div className={`
                        w-64 h-64 mx-auto rounded-3xl bg-gradient-to-br ${card.color}
                        flex items-center justify-center shadow-2xl
                        transform hover:rotate-3 transition-transform
                      `}>
                        <span className="text-8xl text-white/90">
                          {card.icon}
                        </span>
                      </div>
                      
                      {/* Floating Number */}
                      <div className="absolute -top-4 -right-4 w-20 h-20 
                                    bg-white dark:bg-gray-900 rounded-full 
                                    flex items-center justify-center shadow-lg
                                    border-4 border-gray-100 dark:border-gray-800">
                        <span className="text-2xl font-bold bg-gradient-to-r 
                                       from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          {card.number}
                        </span>
                      </div>
                    </motion.div>

                    {/* Decorative Elements */}
                    <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                        className="w-80 h-80 border border-gray-200 dark:border-gray-800 rounded-full"
                      />
                    </div>
                  </div>

                  {/* Right: Content */}
                  <div className="space-y-6">
                    {/* Title */}
                    <motion.div
                      initial={{ x: 50, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h1 className={`text-5xl font-bold bg-gradient-to-r ${card.color} 
                                    bg-clip-text text-transparent`}>
                        {card.title}
                      </h1>
                      <h2 className="text-xl text-gray-600 dark:text-gray-400 mt-2">
                        {card.subtitle}
                      </h2>
                    </motion.div>

                    {/* Description */}
                    <motion.p
                      initial={{ x: 30, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-lg text-gray-700 dark:text-gray-300"
                    >
                      {card.description}
                    </motion.p>

                    {/* Features */}
                    <motion.ul
                      initial={{ y: 20, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="space-y-3"
                    >
                      {card.features.map((feature, fidx) => (
                        <li key={fidx} className="flex items-center gap-3">
                          <span className="text-green-500">✓</span>
                          <span className="text-gray-600 dark:text-gray-400">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </motion.ul>

                    {/* Metrics & CTA */}
                    {card.price && (
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="flex items-center gap-6 pt-4"
                      >
                        <div>
                          <p className="text-3xl font-bold text-gray-900 dark:text-white">
                            {card.price}
                          </p>
                          <p className="text-sm text-gray-500">{card.duration}</p>
                        </div>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`px-8 py-3 bg-gradient-to-r ${card.color} 
                                   text-white rounded-full font-medium shadow-lg`}
                        >
                          {card.price === 'GRÁTIS' ? 'Começar Agora' : 'Desbloquear'}
                        </motion.button>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      {/* Keyboard Hint */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 
                    text-sm text-gray-500 dark:text-gray-500">
        <AnimatePresence>
          {!isScrolling && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <span>Use</span>
              <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-800 rounded text-xs">←</kbd>
              <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-800 rounded text-xs">→</kbd>
              <span>ou deslize</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}