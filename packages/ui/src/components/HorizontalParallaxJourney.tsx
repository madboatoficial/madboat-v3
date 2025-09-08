'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion'

interface JourneySection {
  id: string
  title: string
  subtitle: string
  description: string
  bgLayer: string // SVG path or gradient
  midLayer?: string
  frontLayer?: string
  metrics?: {
    label: string
    value: string
  }[]
}

const JOURNEY_SECTIONS: JourneySection[] = [
  {
    id: 'intro',
    title: 'MadBoat',
    subtitle: 'Sua Jornada de Transformação',
    description: 'Role para começar sua navegação →',
    bgLayer: 'M0,100 Q50,50 100,100 T200,100',
    midLayer: 'M0,150 Q75,100 150,150 T300,150',
  },
  {
    id: 'persona',
    title: 'Persona Única',
    subtitle: 'Descubra sua essência autêntica',
    description: 'IA analisa 47 pontos de personalidade para revelar seu potencial único',
    bgLayer: 'M0,120 Q100,80 200,120 T400,120',
    midLayer: 'M50,140 Q150,100 250,140 T450,140',
    frontLayer: 'M100,160 Q200,120 300,160 T500,160',
    metrics: [
      { label: 'Precisão', value: '94%' },
      { label: 'Tempo', value: '3 min' },
      { label: 'Grátis', value: '100%' }
    ]
  },
  {
    id: 'alma',
    title: 'Método ALMA',
    subtitle: 'Alinhamento, Leveza, Magnetismo, Autenticidade',
    description: 'Transforme sua essência em estratégia de negócio irresistível',
    bgLayer: 'M0,100 Q150,60 300,100 T600,100',
    midLayer: 'M100,130 Q250,90 400,130 T700,130',
    frontLayer: 'M200,160 Q350,120 500,160 T800,160',
    metrics: [
      { label: 'ROI Médio', value: '+312%' },
      { label: 'Conversão', value: '↑ 47%' },
      { label: 'Tempo', value: '7 dias' }
    ]
  },
  {
    id: 'vortex',
    title: 'VORTEX',
    subtitle: 'Aceleração Exponencial',
    description: 'Multiplique seus resultados com sistemas automatizados de IA',
    bgLayer: 'M0,90 Q200,50 400,90 T800,90',
    midLayer: 'M150,120 Q350,80 550,120 T950,120',
    frontLayer: 'M300,150 Q500,110 700,150 T1100,150',
    metrics: [
      { label: 'Velocidade', value: '10x' },
      { label: 'Automação', value: '85%' },
      { label: 'Escala', value: '∞' }
    ]
  },
  {
    id: 'odisseia',
    title: 'ODISSEIA',
    subtitle: 'Maestria Total',
    description: 'Torne-se referência no seu mercado com IA avançada',
    bgLayer: 'M0,80 Q250,40 500,80 T1000,80',
    midLayer: 'M200,110 Q450,70 700,110 T1200,110',
    frontLayer: 'M400,140 Q650,100 900,140 T1400,140',
    metrics: [
      { label: 'Autoridade', value: '100%' },
      { label: 'Legacy', value: 'Eterno' },
      { label: 'Impacto', value: 'Global' }
    ]
  }
]

export function HorizontalParallaxJourney() {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [currentSection, setCurrentSection] = useState(0)
  
  // Horizontal scroll setup
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  // Transform vertical scroll to horizontal movement
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-80%"])
  const xSmooth = useSpring(x, { stiffness: 100, damping: 30 })

  // Parallax layers with different speeds
  const bgX = useTransform(scrollYProgress, [0, 1], ["0%", "-60%"])
  const midX = useTransform(scrollYProgress, [0, 1], ["0%", "-80%"])
  const frontX = useTransform(scrollYProgress, [0, 1], ["0%", "-100%"])

  // Update current section based on scroll
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      const sectionIndex = Math.floor(latest * (JOURNEY_SECTIONS.length - 1))
      setCurrentSection(Math.min(sectionIndex, JOURNEY_SECTIONS.length - 1))
    })
    return unsubscribe
  }, [scrollYProgress])

  return (
    <>
      {/* Fixed Navigation Dots */}
      <div className="fixed top-1/2 right-8 transform -translate-y-1/2 z-50 space-y-4">
        {JOURNEY_SECTIONS.map((section, idx) => (
          <button
            key={section.id}
            onClick={() => {
              const progress = idx / (JOURNEY_SECTIONS.length - 1)
              window.scrollTo({
                top: progress * (document.body.scrollHeight - window.innerHeight),
                behavior: 'smooth'
              })
            }}
            className={`
              w-3 h-3 rounded-full transition-all duration-300
              ${currentSection === idx 
                ? 'bg-purple-600 scale-150' 
                : 'bg-gray-400 hover:bg-gray-600'
              }
            `}
            aria-label={section.title}
          >
            <span className="sr-only">{section.title}</span>
          </button>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
          style={{
            scaleX: scrollYProgress,
            transformOrigin: "0%"
          }}
        />
      </div>

      {/* Main Container - Height creates scroll area */}
      <div 
        ref={containerRef}
        className="relative"
        style={{ height: `${JOURNEY_SECTIONS.length * 100}vh` }}
      >
        {/* Sticky Horizontal Scroll Container */}
        <div className="sticky top-0 h-screen overflow-hidden">
          
          {/* Background Parallax Layer */}
          <motion.div
            className="absolute inset-0 opacity-10"
            style={{ x: bgX }}
          >
            <div className="flex h-full">
              {JOURNEY_SECTIONS.map((section) => (
                <div key={`bg-${section.id}`} className="min-w-[100vw] h-full relative">
                  <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                    <path
                      d={section.bgLayer}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-purple-600"
                    />
                  </svg>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Middle Parallax Layer */}
          <motion.div
            className="absolute inset-0 opacity-20"
            style={{ x: midX }}
          >
            <div className="flex h-full">
              {JOURNEY_SECTIONS.map((section) => (
                <div key={`mid-${section.id}`} className="min-w-[100vw] h-full relative">
                  {section.midLayer && (
                    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                      <path
                        d={section.midLayer}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="text-pink-600"
                      />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Main Content Layer */}
          <motion.div
            ref={scrollRef}
            className="absolute inset-0 flex"
            style={{ x: xSmooth }}
          >
            {JOURNEY_SECTIONS.map((section, idx) => (
              <div
                key={section.id}
                className="min-w-[100vw] h-full flex items-center justify-center px-20"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="max-w-3xl text-center space-y-8"
                >
                  {/* Section Number */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="inline-block"
                  >
                    <div className="w-20 h-20 rounded-full border-2 border-purple-600 
                                  flex items-center justify-center text-2xl font-bold">
                      {idx === 0 ? '🚢' : idx}
                    </div>
                  </motion.div>

                  {/* Title */}
                  <motion.h1
                    initial={{ y: 50 }}
                    whileInView={{ y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 
                             bg-clip-text text-transparent"
                  >
                    {section.title}
                  </motion.h1>

                  {/* Subtitle */}
                  <motion.h2
                    initial={{ y: 30 }}
                    whileInView={{ y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-2xl text-gray-600 dark:text-gray-400"
                  >
                    {section.subtitle}
                  </motion.h2>

                  {/* Description */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto"
                  >
                    {section.description}
                  </motion.p>

                  {/* Metrics */}
                  {section.metrics && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="flex justify-center gap-12 pt-8"
                    >
                      {section.metrics.map((metric, midx) => (
                        <div key={midx} className="text-center">
                          <div className="text-3xl font-bold text-purple-600">
                            {metric.value}
                          </div>
                          <div className="text-sm text-gray-500 mt-2">
                            {metric.label}
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {/* CTA for main sections */}
                  {idx > 0 && (
                    <motion.button
                      initial={{ y: 20, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 
                               text-white rounded-full font-medium shadow-lg mt-8"
                    >
                      {idx === 1 ? 'Começar Grátis' : `Desbloquear ${section.title}`}
                    </motion.button>
                  )}
                </motion.div>

                {/* Front Decorative Layer */}
                {section.frontLayer && (
                  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-5">
                    <path
                      d={section.frontLayer}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      className="text-gray-900 dark:text-white"
                    />
                  </svg>
                )}
              </div>
            ))}
          </motion.div>

          {/* Scroll Indicator (only on first section) */}
          {currentSection === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            >
              <div className="flex items-center gap-2 text-gray-600">
                <span className="text-sm">Role para navegar</span>
                <motion.div
                  animate={{ x: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  →
                </motion.div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  )
}