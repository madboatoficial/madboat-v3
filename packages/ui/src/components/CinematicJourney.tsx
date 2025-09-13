'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion'
import { useInView } from 'framer-motion'
// import { VortexAnimation } from './VortexAnimation'

interface Scene {
  id: string
  chapter: string
  title: string
  subtitle: string
  description: string
  epicPhrase?: string // Epic opening phrase
  triggerQuestion?: string // Pain point question
  cta?: {
    text: string
    price?: string
  }
  metrics?: {
    label: string
    value: string
    highlight?: boolean
  }[]
  // Visual layers for parallax
  layers: {
    background?: React.ReactNode
    midground?: React.ReactNode
    foreground?: React.ReactNode
  }
  color: {
    background: string
    text: string
    accent: string
  }
  isWhite?: boolean // For white background scenes
}

interface CinematicJourneyProps {
  userName?: string
}

const createScenes = (userName: string = 'Navegador'): Scene[] => [
  {
    id: 'opening',
    chapter: 'Prólogo',
    title: 'O Despertar Digital',
    subtitle: `${userName}, a Madboat muda a sua história com IA`,
    description: '',
    epicPhrase: 'Toda grande jornada começa com um único passo corajoso',
    triggerQuestion: 'Onde está o valor da IA na minha empresa?',
    color: {
      background: 'bg-white',
      text: 'text-gray-900',
      accent: 'text-gray-600'
    },
    isWhite: true,
    layers: {}
  },
  {
    id: 'discovery',
    chapter: 'Capítulo I',
    title: 'Persona Única',
    subtitle: 'Descubra Sua Essência',
    description: `${userName}, 47 dimensões analisadas por IA para revelar seu potencial autêntico`,
    triggerQuestion: 'Por que minha agência não entrega resultados?',
    cta: {
      text: 'Começar Descoberta',
      price: 'GRÁTIS'
    },
    metrics: [
      { label: 'Precisão', value: '94%', highlight: true },
      { label: 'Tempo', value: '3 min' },
      { label: 'Insights', value: '47+' }
    ],
    color: {
      background: 'bg-gradient-to-br from-purple-900 to-pink-900',
      text: 'text-white',
      accent: 'text-purple-300'
    },
    layers: {}
  },
  {
    id: 'transformation',
    chapter: 'Capítulo II',
    title: 'Método ALMA',
    subtitle: 'Alinhamento • Leveza • Magnetismo • Autenticidade',
    description: 'Transforme sua essência em estratégia magnética de negócio',
    triggerQuestion: 'Como converter 47% mais clientes?',
    cta: {
      text: 'Iniciar Transformação',
      price: '$997'
    },
    metrics: [
      { label: 'ROI', value: '+312%', highlight: true },
      { label: 'Conversão', value: '↑47%' },
      { label: 'Tempo', value: '7 dias' }
    ],
    color: {
      background: 'bg-gradient-to-br from-teal-900 to-cyan-900',
      text: 'text-white',
      accent: 'text-teal-300'
    },
    layers: {}
  },
  {
    id: 'acceleration',
    chapter: 'Capítulo III',
    title: 'VORTEX',
    subtitle: 'Aceleração Exponencial',
    description: 'Multiplique resultados com sistemas automatizados de IA',
    triggerQuestion: 'E se você pudesse trabalhar 10x mais rápido?',
    cta: {
      text: 'Acelerar Agora',
      price: '$1,997'
    },
    metrics: [
      { label: 'Velocidade', value: '10x', highlight: true },
      { label: 'Automação', value: '85%' },
      { label: 'Escala', value: '∞' }
    ],
    color: {
      background: 'bg-gradient-to-br from-purple-900 to-indigo-900',
      text: 'text-white',
      accent: 'text-purple-300'
    },
    layers: {}
  },
  {
    id: 'mastery',
    chapter: 'Epílogo',
    title: 'ODISSEIA',
    subtitle: 'Guerra, Paixão & Conquista',
    description: `${userName}, torne-se autoridade inquestionável no seu mercado`,
    triggerQuestion: 'Qual legado você quer deixar?',
    cta: {
      text: 'Alcançar Maestria',
      price: '$2,997'
    },
    metrics: [
      { label: 'Autoridade', value: '100%', highlight: true },
      { label: 'Legacy', value: 'Eterno' },
      { label: 'Impacto', value: 'Global' }
    ],
    color: {
      background: 'bg-gradient-to-br from-red-900 to-rose-900',
      text: 'text-white',
      accent: 'text-red-300'
    },
    layers: {}
  }
]

// Componente para elementos visuais line art
function LineArtWave({ 
  amplitude = 50, 
  frequency = 0.01, 
  speed = 1,
  opacity = 0.1,
  color = 'currentColor' 
}: {
  amplitude?: number
  frequency?: number
  speed?: number
  opacity?: number
  color?: string
}) {
  const [offset, setOffset] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setOffset(prev => prev + speed)
    }, 50)
    return () => clearInterval(interval)
  }, [speed])

  const generatePath = () => {
    const points = []
    for (let x = 0; x <= 100; x += 2) {
      const y = 50 + amplitude * Math.sin((x + offset) * frequency)
      points.push(`${x},${y}`)
    }
    return `M ${points.join(' L ')}`
  }

  return (
    <svg 
      className="absolute inset-0 w-full h-full pointer-events-none"
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
    >
      <path
        d={generatePath()}
        fill="none"
        stroke={color}
        strokeWidth="0.5"
        opacity={opacity}
      />
    </svg>
  )
}

export function CinematicJourney({ userName = 'Tripulante' }: CinematicJourneyProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentScene, setCurrentScene] = useState(0)
  const [isTouch, setIsTouch] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  
  // Create scenes with user name
  const SCENES = createScenes(userName)
  
  // Words for dramatic zoom effect
  const openingWords = [
    userName + ',',
    'a', 'Madboat', 'muda', 'a', 'sua', 'história', 'com', 'IA'
  ]
  
  // Detect touch device
  useEffect(() => {
    setIsTouch('ontouchstart' in window)
  }, [])

  // Scroll progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  // Main horizontal transform
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", `-${(SCENES.length - 1) * 100}%`]
  )
  const xSmooth = useSpring(x, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  // Parallax layers with different speeds
  const bgX = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"])
  const midX = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"])
  const fgX = useTransform(scrollYProgress, [0, 1], ["0%", "-120%"])
  
  // Dramatic zoom effect for opening text
  const openingScale = useTransform(scrollYProgress, [0, 0.15], [1, 50])
  const openingOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0])
  const openingBlur = useTransform(scrollYProgress, [0, 0.15], [0, 20])

  // Update current scene
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      const sceneIndex = Math.round(latest * (SCENES.length - 1))
      setCurrentScene(sceneIndex)
    })
    return unsubscribe
  }, [scrollYProgress])

  // Touch/swipe handling for mobile
  const handleTouchStart = useRef({ x: 0, y: 0 })
  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaX = e.changedTouches[0].clientX - handleTouchStart.current.x
    const deltaY = e.changedTouches[0].clientY - handleTouchStart.current.y
    
    // Horizontal swipe detection
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0 && currentScene > 0) {
        // Swipe right - go to previous
        scrollToScene(currentScene - 1)
      } else if (deltaX < 0 && currentScene < SCENES.length - 1) {
        // Swipe left - go to next
        scrollToScene(currentScene + 1)
      }
    }
  }

  const scrollToScene = (index: number) => {
    const progress = index / (SCENES.length - 1)
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
    window.scrollTo({
      top: progress * scrollHeight,
      behavior: 'smooth'
    })
  }

  const handlePersonaTransition = () => {
    setIsTransitioning(true)
    
    // Delay para animação e then redirect
    setTimeout(() => {
      window.location.href = '/persona'
    }, 1500)
  }

  return (
    <>
      {/* Transição Épica para Persona */}
      {isTransitioning && (
        <motion.div
          initial={{ opacity: 0, scale: 0.1 }}
          animate={{ opacity: 1, scale: 50 }}
          transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[9999] bg-purple-900 flex items-center justify-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-center text-white"
          >
            <motion.h2
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5, type: "spring" }}
              className="text-4xl md:text-6xl font-bold mb-4"
            >
              Inicializando Análise Neural
            </motion.h2>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 0.8, duration: 0.7 }}
              className="w-64 h-2 bg-purple-600 rounded-full mx-auto overflow-hidden"
            >
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ delay: 1, duration: 0.5, ease: "easeInOut" }}
                className="h-full w-full bg-gradient-to-r from-purple-400 to-pink-400"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
      
      {/* Giant MadBoat watermark */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
        <h1 className="text-[20rem] font-bold text-gray-900/[0.02] select-none">
          MADBOAT
        </h1>
      </div>

      {/* Scene Indicators */}
      <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex items-center gap-4 px-6 py-3 
                      bg-black/20 backdrop-blur-md rounded-full">
          {SCENES.map((scene, idx) => (
            <button
              key={scene.id}
              onClick={() => scrollToScene(idx)}
              className="relative group"
            >
              <div className={`
                w-2 h-2 rounded-full transition-all duration-500
                ${currentScene === idx 
                  ? 'w-12 bg-white' 
                  : 'bg-white/40 hover:bg-white/60'
                }
              `} />
              {currentScene === idx && (
                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2
                               text-xs text-white/80 whitespace-nowrap">
                  {scene.chapter}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Container */}
      <div 
        ref={containerRef}
        className="relative"
        style={{ height: `${SCENES.length * 100}vh` }}
        onTouchStart={(e) => {
          handleTouchStart.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
          }
        }}
        onTouchEnd={handleTouchEnd}
      >
        {/* Sticky Viewport */}
        <div className="sticky top-0 h-screen overflow-hidden">
          
          {/* Dynamic Background Color */}
          <motion.div
            className="absolute inset-0 transition-colors duration-1000"
            style={{
              backgroundColor: '#ffffff'
            }}
          />
          
          {/* Background color overlay based on scroll */}
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundColor: useTransform(scrollYProgress, 
                [0, 0.2, 0.4, 0.6, 0.8, 1],
                [
                  'rgba(255,255,255,1)', // white for opening
                  'rgba(147,51,234,1)', // purple for Persona
                  'rgba(20,184,166,1)', // teal for ALMA
                  'rgba(147,51,234,1)', // purple for VORTEX
                  'rgba(128,0,32,1)', // bordeaux for ODISSEIA
                  'rgba(128,0,32,1)' // stay bordeaux at end
                ]
              )
            }}
          />
          
          {/* Background Layer - Slowest */}
          <motion.div
            className="absolute inset-0"
            style={{ x: bgX }}
          >
            <div className="flex h-full">
              {SCENES.map((scene, idx) => (
                <div
                  key={`bg-${scene.id}`}
                  className="min-w-[100vw] h-full"
                >
                  <LineArtWave 
                    amplitude={30} 
                    frequency={0.02} 
                    speed={0.5}
                    opacity={scene.isWhite ? 0.1 : 0.05}
                    color={scene.isWhite ? '#6b7280' : 'white'}
                  />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Midground Layer */}
          <motion.div
            className="absolute inset-0"
            style={{ x: midX }}
          >
            <div className="flex h-full">
              {SCENES.map((scene, idx) => (
                <div key={`mid-${scene.id}`} className="min-w-[100vw] h-full relative">
                  {/* Special Vortex animation for VORTEX section */}
                  {scene.id === 'acceleration' ? (
                    <div className="text-white text-center">Vortex Animation (disabled for now)</div>
                  ) : (
                    <>
                      <LineArtWave 
                        amplitude={40} 
                        frequency={0.015} 
                        speed={0.7}
                        opacity={scene.isWhite ? 0.08 : 0.08}
                        color={scene.isWhite ? '#6b7280' : 'white'}
                      />
                      {/* Floating geometric shapes */}
                      <motion.div
                        animate={{
                          y: [0, -20, 0],
                          rotate: [0, 5, 0]
                        }}
                        transition={{
                          duration: 10,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className={`absolute top-1/4 left-1/4 w-32 h-32 
                                 border ${scene.isWhite ? 'border-gray-300/20' : 'border-white/10'} rounded-full`}
                      />
                      <motion.div
                        animate={{
                          y: [0, 20, 0],
                          rotate: [0, -5, 0]
                        }}
                        transition={{
                          duration: 8,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className={`absolute bottom-1/4 right-1/4 w-24 h-24 
                                 border ${scene.isWhite ? 'border-gray-300/20' : 'border-white/10'} rounded-lg rotate-45`}
                      />
                    </>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Content Layer - Main Speed */}
          <motion.div
            className="absolute inset-0 flex items-center"
            style={{ x: xSmooth }}
          >
            <div className="flex">
              {SCENES.map((scene, idx) => (
                <div
                  key={scene.id}
                  className="min-w-[100vw] h-screen flex items-center justify-center px-8"
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    className={`max-w-4xl text-center ${idx === 0 ? 'text-gray-900' : 'text-white'}`}
                  >
                    {/* Epic Phrase for Opening */}
                    {scene.epicPhrase && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 1 }}
                        className="mb-12"
                      >
                        <h2 className={`text-2xl md:text-3xl font-serif italic ${scene.color.accent}`}>
                          "{scene.epicPhrase}"
                        </h2>
                      </motion.div>
                    )}

                    {/* Trigger Question - Pain Point */}
                    {scene.triggerQuestion && !scene.epicPhrase && (
                      <motion.div
                        initial={{ y: -30, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="mb-8"
                      >
                        <h2 className={`text-3xl md:text-4xl font-light italic ${
                          scene.isWhite ? 'text-gray-700' : 'text-white/80'
                        }`}>
                          "{scene.triggerQuestion}"
                        </h2>
                      </motion.div>
                    )}

                    {/* Chapter */}
                    <motion.p
                      initial={{ y: 20, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className={`text-sm uppercase tracking-[0.3em] mb-4 ${
                        scene.isWhite ? 'text-gray-500' : 'text-white/60'
                      }`}
                    >
                      {scene.chapter}
                    </motion.p>

                    {/* Title */}
                    {idx === 0 ? (
                      // Special dramatic zoom for opening
                      <motion.div
                        className="relative"
                        style={{
                          scale: openingScale,
                          opacity: openingOpacity,
                          filter: useTransform(openingBlur, (v) => `blur(${v}px)`)
                        }}
                      >
                        <h1 className="text-5xl md:text-7xl font-bold mb-8">
                          {openingWords.map((word, i) => (
                            <motion.span
                              key={i}
                              initial={{ opacity: 0, scale: 0.5, y: 50 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              transition={{
                                delay: 0.5 + i * 0.15,
                                duration: 0.8,
                                ease: [0.68, -0.55, 0.265, 1.55]
                              }}
                              className="inline-block mx-2"
                              style={{
                                transformOrigin: 'center center'
                              }}
                            >
                              {word}
                            </motion.span>
                          ))}
                        </h1>
                      </motion.div>
                    ) : (
                      <motion.h1
                        initial={{ y: 30, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-7xl md:text-8xl font-bold mb-4 text-white"
                      >
                        {scene.title}
                      </motion.h1>
                    )}

                    {/* Subtitle - Skip for opening scene */}
                    {idx !== 0 && (
                      <motion.h2
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-2xl mb-6 text-white/80"
                      >
                        {scene.subtitle}
                      </motion.h2>
                    )}

                    {/* Description - Skip for opening scene */}
                    {idx !== 0 && scene.description && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-lg mb-12 max-w-2xl mx-auto text-white/60"
                      >
                        {scene.description}
                      </motion.p>
                    )}

                    {/* Metrics */}
                    {scene.metrics && (
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="flex justify-center gap-12 mb-12"
                      >
                        {scene.metrics.map((metric, midx) => (
                          <div 
                            key={midx} 
                            className={`text-center ${
                              metric.highlight ? 'scale-110' : ''
                            }`}
                          >
                            <div className={`text-4xl font-bold ${
                              metric.highlight ? 'text-white' : 'text-white/70'
                            }`}>
                              {metric.value}
                            </div>
                            <div className="text-sm text-white/50 mt-2">
                              {metric.label}
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}

                    {/* CTA */}
                    {scene.cta && (
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.7 }}
                      >
                        <motion.button 
                          className="group relative px-12 py-4 
                                       bg-white/10 backdrop-blur-md rounded-full
                                       border border-white/20 overflow-hidden
                                       hover:bg-white/20 transition-all duration-500"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            if (scene.cta?.text === 'Começar Descoberta') {
                              // Transição épica para Persona
                              handlePersonaTransition()
                            }
                          }}
                        >
                          <span className="relative z-10 font-medium">
                            {scene.cta.text}
                          </span>
                          {scene.cta.price && (
                            <span className="ml-3 text-white/60">
                              • {scene.cta.price}
                            </span>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent 
                                        via-white/10 to-transparent -translate-x-full
                                        group-hover:translate-x-full transition-transform duration-1000" />
                        </motion.button>
                      </motion.div>
                    )}
                  </motion.div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Foreground Layer - Fastest */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ x: fgX }}
          >
            <div className="flex h-full">
              {SCENES.map((scene) => (
                <div key={`fg-${scene.id}`} className="min-w-[100vw] h-full relative">
                  <LineArtWave 
                    amplitude={20} 
                    frequency={0.025} 
                    speed={1}
                    opacity={0.03}
                    color="white"
                  />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Navigation Hints */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-40">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="flex items-center gap-4 text-white/60 text-sm"
            >
              {isTouch ? (
                <div className="flex items-center gap-2">
                  <span>Deslize para navegar</span>
                  <motion.span
                    animate={{ x: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    →
                  </motion.span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Role para explorar</span>
                  <motion.span
                    animate={{ y: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    ↓
                  </motion.span>
                </div>
              )}
            </motion.div>
          </div>


          {/* Progress Bar */}
          <motion.div
            className="absolute bottom-0 left-0 h-1 bg-white/50"
            style={{
              width: '100%',
              scaleX: scrollYProgress,
              transformOrigin: '0%'
            }}
          />
        </div>
      </div>
    </>
  )
}