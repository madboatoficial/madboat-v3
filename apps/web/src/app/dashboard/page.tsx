"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check, Square } from 'lucide-react'

interface SubCard {
  id: string
  title: string
  subtitle: string
  description: string
  buttonText: string
  completed: boolean
}

interface Card {
  id: string
  title: string
  subtitle: string
  description?: string
  buttonText?: string
  completed: boolean
  subCards?: SubCard[]
}

const cards: Card[] = [
  {
    id: 'persona',
    title: 'Descoberta de Persona',
    subtitle: 'Identifique sua essência única',
    description: 'Análise completa de 47 dimensões para revelar seu potencial autêntico e criar estratégias personalizadas.',
    buttonText: 'Iniciar Descoberta',
    completed: false
  },
  {
    id: 'alma',
    title: 'Método ALMA',
    subtitle: 'Alinhamento • Leveza • Magnetismo • Autenticidade',
    completed: false,
    subCards: [
      {
        id: 'autenticidade',
        title: 'Autenticidade',
        subtitle: 'Revele sua verdadeira essência',
        description: 'Descubra e alinhe-se com seus valores fundamentais, eliminando máscaras e conectando-se com sua identidade autêntica.',
        buttonText: 'Explorar Autenticidade',
        completed: true
      },
      {
        id: 'legado', 
        title: 'Legado',
        subtitle: 'Defina seu impacto duradouro',
        description: 'Construa uma visão clara do legado que deseja deixar e das transformações que quer gerar no mundo.',
        buttonText: 'Construir Legado',
        completed: false
      },
      {
        id: 'mapeamento',
        title: 'Mapeamento', 
        subtitle: 'Trace sua jornada de transformação',
        description: 'Mapeie recursos, oportunidades e caminhos estratégicos para materializar sua visão autêntica.',
        buttonText: 'Iniciar Mapeamento',
        completed: false
      },
      {
        id: 'aplicacao',
        title: 'Aplicação',
        subtitle: 'Transforme insights em ação',
        description: 'Implemente estratégias práticas e sistemas que transformem sua autenticidade em resultados magnéticos.',
        buttonText: 'Aplicar Método',
        completed: false
      }
    ]
  },
  {
    id: 'vortex',
    title: 'VORTEX Acceleration',
    subtitle: 'Aceleração exponencial de resultados',
    description: 'Multiplique seus resultados com sistemas automatizados de IA e processos otimizados para crescimento.',
    buttonText: 'Acelerar Agora',
    completed: false
  },
  {
    id: 'odisseia',
    title: 'ODISSEIA',
    subtitle: 'Guerra, Paixão & Conquista',
    description: 'Torne-se autoridade inquestionável no seu mercado através da jornada épica de maestria e liderança.',
    buttonText: 'Iniciar Odisseia',
    completed: false
  }
]

export default function DashboardPage() {
  const [expandedCards, setExpandedCards] = useState<string[]>([])
  const [expandedSubCards, setExpandedSubCards] = useState<string[]>([])

  const toggleCard = (cardId: string) => {
    setExpandedCards(prev => 
      prev.includes(cardId)
        ? prev.filter(id => id !== cardId)
        : [...prev, cardId]
    )
  }

  const toggleSubCard = (subCardId: string) => {
    setExpandedSubCards(prev => 
      prev.includes(subCardId)
        ? prev.filter(id => id !== subCardId)
        : [...prev, subCardId]
    )
  }

  const isExpanded = (cardId: string) => expandedCards.includes(cardId)
  const isSubExpanded = (subCardId: string) => expandedSubCards.includes(subCardId)

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Ocean Wave Background Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <svg 
            className="absolute bottom-0 w-full h-32 opacity-[0.015]"
            preserveAspectRatio="none"
            viewBox="0 0 1200 120"
            fill="none"
          >
            <motion.path
              d="M0,60 C300,100 600,20 900,60 C1050,80 1150,40 1200,60 L1200,120 L0,120 Z"
              fill="currentColor"
              className="text-black"
              animate={{
                d: [
                  "M0,60 C300,100 600,20 900,60 C1050,80 1150,40 1200,60 L1200,120 L0,120 Z",
                  "M0,50 C300,80 600,40 900,70 C1050,60 1150,60 1200,50 L1200,120 L0,120 Z",
                  "M0,60 C300,100 600,20 900,60 C1050,80 1150,40 1200,60 L1200,120 L0,120 Z"
                ]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </svg>
          
          {/* Additional subtle wave layer */}
          <svg 
            className="absolute bottom-4 w-full h-24 opacity-[0.01]"
            preserveAspectRatio="none" 
            viewBox="0 0 1200 120"
            fill="none"
          >
            <motion.path
              d="M0,40 C200,80 400,0 600,40 C800,80 1000,0 1200,40 L1200,120 L0,120 Z"
              fill="currentColor"
              className="text-black"
              animate={{
                d: [
                  "M0,40 C200,80 400,0 600,40 C800,80 1000,0 1200,40 L1200,120 L0,120 Z",
                  "M0,20 C200,60 400,20 600,60 C800,40 1000,20 1200,20 L1200,120 L0,120 Z",
                  "M0,40 C200,80 400,0 600,40 C800,80 1000,0 1200,40 L1200,120 L0,120 Z"
                ]
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
            />
          </svg>
        </motion.div>
      </div>
      {/* Main Container */}
      <div className="flex">
        {/* Left Panel - Cards */}
        <div className="w-96 px-6 py-12">
          {/* Header */}
          <div className="mb-8 text-center">
            {/* Font Import */}
            <style jsx>{`
              @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
            `}</style>
            
            {/* Logo */}
            <motion.h1 
              layoutId="madboat-logo"
              className="text-2xl font-medium tracking-[0.08em] text-black"
              style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
              animate={{
                opacity: [0.85, 1, 0.85],
                scale: [0.98, 1, 0.98]
              }}
              transition={{
                opacity: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                scale: { duration: 8, repeat: Infinity, ease: "easeInOut" },
                layout: { duration: 0.8, ease: [0.23, 1, 0.32, 1] }
              }}
            >
              madboat
            </motion.h1>
          </div>

          {/* Cards Container */}
          <div className="space-y-4">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              className="relative"
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.5, 
                ease: [0.23, 1, 0.32, 1],
                delay: 0.8 + (index * 0.15) // Stagger: cada card aparece 150ms depois do anterior
              }}
            >
              {/* Card Header - Clickable */}
              <motion.div
                className="relative cursor-pointer group"
                onClick={() => toggleCard(card.id)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {/* Line Art Border */}
                <svg 
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  viewBox="0 0 320 60"
                  fill="none"
                >
                  <rect
                    x="1" y="1" width="318" height="58"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    className={`${isExpanded(card.id) ? 'text-black/40' : 'text-black/20'} group-hover:text-black/40 transition-colors duration-300`}
                  />
                  
                  {/* Corner accents */}
                  <g className={`${isExpanded(card.id) ? 'text-black/30' : 'text-black/15'} group-hover:text-black/30 transition-colors duration-300`}>
                    <line x1="0" y1="6" x2="0" y2="0" stroke="currentColor" strokeWidth="1.5"/>
                    <line x1="0" y1="0" x2="6" y2="0" stroke="currentColor" strokeWidth="1.5"/>
                    <line x1="314" y1="0" x2="320" y2="0" stroke="currentColor" strokeWidth="1.5"/>
                    <line x1="320" y1="0" x2="320" y2="6" stroke="currentColor" strokeWidth="1.5"/>
                    <line x1="320" y1="54" x2="320" y2="60" stroke="currentColor" strokeWidth="1.5"/>
                    <line x1="320" y1="60" x2="314" y2="60" stroke="currentColor" strokeWidth="1.5"/>
                    <line x1="6" y1="60" x2="0" y2="60" stroke="currentColor" strokeWidth="1.5"/>
                    <line x1="0" y1="60" x2="0" y2="54" stroke="currentColor" strokeWidth="1.5"/>
                  </g>
                </svg>

                {/* Content */}
                <div className="relative z-10 p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-black/60">
                      {card.completed ? (
                        <Check size={16} strokeWidth={1.5} className="text-green-600" />
                      ) : (
                        <Square size={16} strokeWidth={1.5} />
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-black tracking-wide">
                        {card.title}
                      </h3>
                      <p className="text-xs font-light text-black/60 tracking-wide">
                        {card.subtitle}
                      </p>
                    </div>
                  </div>
                  
                  <motion.div
                    animate={{ rotate: isExpanded(card.id) ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="text-black/40"
                  >
                    <ChevronDown size={14} strokeWidth={1.5} />
                  </motion.div>
                </div>
              </motion.div>

              {/* Expanded Content */}
              <AnimatePresence>
                {isExpanded(card.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="relative">
                      {/* Extension Line Art */}
                      <svg 
                        className="absolute top-0 left-0 w-full h-full pointer-events-none"
                        preserveAspectRatio="none"
                        viewBox={`0 0 320 ${card.subCards ? 200 + (card.subCards.length * 60) : 120}`}
                        fill="none"
                      >
                        {/* Left and right borders only */}
                        <line x1="1" y1="0" x2="1" y2="100%" stroke="currentColor" strokeWidth="1" className="text-black/20" />
                        <line x1="319" y1="0" x2="319" y2="100%" stroke="currentColor" strokeWidth="1" className="text-black/20" />
                        
                        {/* Bottom border */}
                        <line x1="1" y1="100%" x2="319" y2="100%" stroke="currentColor" strokeWidth="1" className="text-black/20" />
                        
                        {/* Bottom corner accents */}
                        <g className="text-black/15">
                          <line x1="314" y1="100%" x2="320" y2="100%" stroke="currentColor" strokeWidth="1.5"/>
                          <line x1="320" y1="100%" x2="320" y2="94%" stroke="currentColor" strokeWidth="1.5"/>
                          <line x1="6" y1="100%" x2="0" y2="100%" stroke="currentColor" strokeWidth="1.5"/>
                          <line x1="0" y1="100%" x2="0" y2="94%" stroke="currentColor" strokeWidth="1.5"/>
                        </g>
                      </svg>

                      {/* Expanded Content */}
                      <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="relative z-10 p-5 pt-2"
                      >
                        {/* Regular card content */}
                        {!card.subCards && (
                          <>
                            <p className="text-xs font-light text-black/70 leading-relaxed mb-5 tracking-wide">
                              {card.description}
                            </p>
                            
                            <motion.button
                              className="group relative px-4 py-1.5 border border-black/20 
                                       hover:border-black/40 transition-colors duration-300"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <span className="text-xs font-light text-black tracking-wide">
                                {card.buttonText}
                              </span>
                              <motion.div
                                className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100
                                         transition-opacity duration-300"
                              />
                            </motion.button>
                          </>
                        )}

                        {/* SubCards content */}
                        {card.subCards && (
                          <div className="space-y-2">
                            {card.subCards.map((subCard) => (
                              <motion.div
                                key={subCard.id}
                                className="relative"
                                layout
                                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                              >
                                {/* SubCard Header */}
                                <motion.div
                                  className="relative cursor-pointer group/sub border border-black/10 hover:border-black/20 transition-colors duration-300"
                                  onClick={() => toggleSubCard(subCard.id)}
                                  whileHover={{ scale: 1.005 }}
                                  whileTap={{ scale: 0.995 }}
                                >
                                  <div className="p-3 flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                      <div className="text-black/50">
                                        {subCard.completed ? (
                                          <Check size={14} strokeWidth={1.5} className="text-green-600" />
                                        ) : (
                                          <Square size={14} strokeWidth={1.5} />
                                        )}
                                      </div>
                                      <div>
                                        <h4 className="text-xs font-medium text-black tracking-wide">
                                          {subCard.title}
                                        </h4>
                                        <p className="text-[10px] font-light text-black/60 tracking-wide">
                                          {subCard.subtitle}
                                        </p>
                                      </div>
                                    </div>
                                    
                                    <motion.div
                                      animate={{ rotate: isSubExpanded(subCard.id) ? 180 : 0 }}
                                      transition={{ duration: 0.2, ease: "easeOut" }}
                                      className="text-black/30"
                                    >
                                      <ChevronDown size={12} strokeWidth={1.5} />
                                    </motion.div>
                                  </div>
                                </motion.div>

                                {/* SubCard Expanded Content */}
                                <AnimatePresence>
                                  {isSubExpanded(subCard.id) && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                                      className="overflow-hidden border-l border-r border-b border-black/10"
                                    >
                                      <motion.div
                                        initial={{ y: -10, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -10, opacity: 0 }}
                                        transition={{ duration: 0.2, delay: 0.05 }}
                                        className="p-3 pt-0"
                                      >
                                        <p className="text-[10px] font-light text-black/60 leading-relaxed mb-3 tracking-wide">
                                          {subCard.description}
                                        </p>
                                        
                                        <motion.button
                                          className="group/sub-btn relative px-3 py-1 border border-black/15 
                                                   hover:border-black/30 transition-colors duration-300"
                                          whileHover={{ scale: 1.01 }}
                                          whileTap={{ scale: 0.99 }}
                                        >
                                          <span className="text-[10px] font-light text-black tracking-wide">
                                            {subCard.buttonText}
                                          </span>
                                          <motion.div
                                            className="absolute inset-0 bg-black/3 opacity-0 group-hover/sub-btn:opacity-100
                                                     transition-opacity duration-300"
                                          />
                                        </motion.button>
                                      </motion.div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
          </div>
        </div>

        {/* Right Panel - Empty Space */}
        <div className="flex-1 bg-white">
          {/* Reserved for future content */}
        </div>
      </div>
    </div>
  )
}