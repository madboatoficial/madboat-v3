'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface CinematicLandingProps {
  onStartDiscovery: () => void
}

export const CinematicLanding: React.FC<CinematicLandingProps> = ({ onStartDiscovery }) => {
  // Cinematic Animation State
  const [cinematicPhase, setCinematicPhase] = useState<'buildup' | 'blackout' | 'reveal'>('buildup')
  const [currentWordIndex, setCurrentWordIndex] = useState(-1)
  const [showButton, setShowButton] = useState(false)
  const [showUrgencyText, setShowUrgencyText] = useState(false)
  const [backgroundFlash, setBackgroundFlash] = useState(false)
  const [showMagneticWords, setShowMagneticWords] = useState(false)

  // Cinematic Script - Word by Word (Estilo Sandro)
  const cinematicWords = [
    { text: "TODO", delay: 0 },
    { text: "MUNDO", delay: 800 },
    { text: "SE", delay: 1600 },
    { text: "ACHA", delay: 2400 },
    { text: "ESPECIAL", delay: 3200 }
  ]

  // Magnetic Words - Palavras que serão sugadas pelo botão
  const magneticWords = [
    'autenticidade', 'personalidade', 'descoberta',
    'transformação', 'identidade', 'essência',
    'propósito', 'crescimento', 'potencial'
  ]

  // Cinematic Sequence Controller
  useEffect(() => {
    const sequence = async () => {
      // FASE 1: BUILDUP - Palavras aparecendo uma por uma
      for (let i = 0; i < cinematicWords.length; i++) {
        await new Promise(resolve => setTimeout(resolve, cinematicWords[i].delay))
        setCurrentWordIndex(i)

        // Flash do background a cada palavra
        setBackgroundFlash(true)
        setTimeout(() => setBackgroundFlash(false), 200)
      }

      // FASE 2: CLIMAX - Última palavra treme
      await new Promise(resolve => setTimeout(resolve, 1200))

      // FASE 3: BLACKOUT DRAMÁTICO - 3 segundos de suspense total
      setCinematicPhase('blackout')
      await new Promise(resolve => setTimeout(resolve, 3000))

      // FASE 4: REVEAL - Botão surge com spotlight
      setCinematicPhase('reveal')
      setShowButton(true)

      // FASE 5: URGÊNCIA - Texto final aparece
      await new Promise(resolve => setTimeout(resolve, 800))
      setShowUrgencyText(true)

      // FASE 6: EFEITO MAGNÉTICO - Palavras aparecem flutuando
      await new Promise(resolve => setTimeout(resolve, 1000))
      setShowMagneticWords(true)
    }

    sequence()
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden bg-white">

      {/* FASE 1: BUILDUP - TEXTO CINEMATOGRÁFICO PREENCHENDO TELA */}
      <AnimatePresence>
        {cinematicPhase === 'buildup' && (
          <div className="absolute inset-0">
            {/* Texto cinematográfico preenchendo todo o background */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center leading-none">

              {/* LINHA 1 - GIGANTE NO TOPO */}
              <motion.div
                initial={{ opacity: 0, y: -200, scale: 0.5 }}
                animate={{ opacity: currentWordIndex >= 0 ? 1 : 0, y: 0, scale: 1 }}
                transition={{ duration: 1, ease: "backOut" }}
                className="w-full"
              >
                <h1 className="text-[12rem] md:text-[20rem] lg:text-[25rem] font-black text-black/90 tracking-tighter leading-none">
                  TODO
                </h1>
              </motion.div>

              {/* LINHA 2 - MÉDIA NO CENTRO */}
              <motion.div
                initial={{ opacity: 0, x: -300, scale: 0.7 }}
                animate={{ opacity: currentWordIndex >= 1 ? 1 : 0, x: 0, scale: 1 }}
                transition={{ duration: 1, delay: 0.3, ease: "backOut" }}
                className="w-full -mt-16"
              >
                <h2 className="text-[8rem] md:text-[14rem] lg:text-[18rem] font-light text-gray-600 tracking-wide leading-none">
                  MUNDO
                </h2>
              </motion.div>

              {/* LINHA 3 - PEQUENA MAS IMPACTANTE */}
              <motion.div
                initial={{ opacity: 0, x: 300, scale: 0.8 }}
                animate={{ opacity: currentWordIndex >= 2 ? 1 : 0, x: 0, scale: 1 }}
                transition={{ duration: 1, delay: 0.6, ease: "backOut" }}
                className="w-full -mt-12"
              >
                <h3 className="text-[6rem] md:text-[10rem] lg:text-[14rem] font-bold text-black tracking-normal leading-none">
                  SE
                </h3>
              </motion.div>

              {/* LINHA 4 - MÉDIA NOVAMENTE */}
              <motion.div
                initial={{ opacity: 0, y: 200, scale: 0.6 }}
                animate={{ opacity: currentWordIndex >= 3 ? 1 : 0, y: 0, scale: 1 }}
                transition={{ duration: 1, delay: 0.9, ease: "backOut" }}
                className="w-full -mt-10"
              >
                <h2 className="text-[7rem] md:text-[12rem] lg:text-[16rem] font-extrabold text-gray-800 tracking-tight leading-none">
                  ACHA
                </h2>
              </motion.div>

              {/* LINHA 5 - EXPLOSÃO FINAL */}
              <motion.div
                initial={{ opacity: 0, scale: 0.3, rotateZ: 45 }}
                animate={{
                  opacity: currentWordIndex >= 4 ? 1 : 0,
                  scale: 1,
                  rotateZ: 0
                }}
                transition={{ duration: 1.2, delay: 1.2, ease: "backOut" }}
                className="w-full -mt-8"
              >
                <motion.h1
                  className="text-[10rem] md:text-[18rem] lg:text-[22rem] font-black text-black tracking-tighter leading-none"
                  animate={currentWordIndex >= 4 ? {
                    scale: [1, 1.1, 1.05, 1],
                    rotate: [0, 2, -1, 0],
                    textShadow: [
                      "0 0 0 rgba(0,0,0,0)",
                      "0 0 20px rgba(0,0,0,0.3)",
                      "0 0 0 rgba(0,0,0,0)"
                    ]
                  } : {}}
                  transition={{
                    duration: 0.6,
                    repeat: 3,
                    ease: "easeInOut"
                  }}
                >
                  ESPECIAL
                </motion.h1>
              </motion.div>

            </div>

            {/* Flash effect overlay */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              animate={{
                backgroundColor: backgroundFlash ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0)"
              }}
              transition={{ duration: 0.2 }}
            />
          </div>
        )}
      </AnimatePresence>

      {/* FASE 2: BLACKOUT - 3 segundos de suspense */}
      <AnimatePresence>
        {cinematicPhase === 'blackout' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black flex items-center justify-center"
          >
            {/* Opcional: Pequeno indicador de loading ou apenas preto total */}
            <motion.div
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-2 h-2 bg-white rounded-full"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* FASE 3: REVEAL - Botão surge com spotlight */}
      <AnimatePresence>
        {cinematicPhase === 'reveal' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-white flex flex-col items-center justify-center"
          >
            {/* Spotlight Effect */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute w-96 h-96 bg-gradient-radial from-gray-300 to-transparent rounded-full blur-3xl"
            />

            {/* Botão Central */}
            <AnimatePresence>
              {showButton && (
                <motion.div
                  initial={{ scale: 0, opacity: 0, rotateZ: 45 }}
                  animate={{ scale: 1, opacity: 1, rotateZ: 0 }}
                  transition={{
                    duration: 1.2,
                    ease: "backOut",
                    type: "spring",
                    stiffness: 150
                  }}
                  className="mb-8"
                >
                  <div className="relative group">
                    <motion.button
                      onClick={onStartDiscovery}
                      className="relative bg-black text-white px-16 py-6 text-xl font-bold tracking-wide transition-all duration-500 shadow-2xl border-2 border-gray-800 z-10"
                      whileHover={{
                        scale: 1.05,
                        borderColor: "#ffffff",
                        boxShadow: "0 25px 50px rgba(0,0,0,0.4)"
                      }}
                      whileTap={{ scale: 0.95 }}
                      animate={{
                        boxShadow: [
                          "0 15px 30px rgba(0,0,0,0.3)",
                          "0 20px 40px rgba(0,0,0,0.4)",
                          "0 15px 30px rgba(0,0,0,0.3)"
                        ]
                      }}
                      transition={{
                        boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                      }}
                    >
                      {/* Corner details minimalistas */}
                      <motion.div
                        className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-white/50"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <motion.div
                        className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-white/50"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                      />
                      <motion.div
                        className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-white/50"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                      />
                      <motion.div
                        className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-white/50"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                      />

                      {/* Texto do botão */}
                      <span className="relative z-10">
                        DESCOBRIR AGORA
                      </span>
                    </motion.button>

                    {/* Palavras Magnéticas Flutuando */}
                    <AnimatePresence>
                      {showMagneticWords && (
                        <div className="absolute inset-0 pointer-events-none">
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            {magneticWords.map((word, index) => {
                              const angle = (index * 40) * Math.PI / 180
                              const radius = 150 + (index % 3) * 30
                              const x = Math.cos(angle) * radius
                              const y = Math.sin(angle) * radius

                              return (
                                <motion.div
                                  key={word}
                                  className="absolute text-gray-400 text-sm font-light tracking-wide select-none whitespace-nowrap"
                                  initial={{
                                    x: x * 2,
                                    y: y * 2,
                                    opacity: 0,
                                    scale: 0,
                                    filter: "blur(10px)"
                                  }}
                                  animate={{
                                    x: x,
                                    y: y,
                                    opacity: 0.7,
                                    scale: 1,
                                    filter: "blur(0px)"
                                  }}
                                  exit={{
                                    x: 0,
                                    y: 0,
                                    opacity: 0,
                                    scale: 0.1,
                                    filter: "blur(20px)"
                                  }}
                                  transition={{
                                    duration: 1.5,
                                    delay: index * 0.15,
                                    type: "spring",
                                    damping: 12
                                  }}
                                  style={{
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)'
                                  }}
                                >
                                  {word}
                                </motion.div>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </AnimatePresence>

                    {/* Efeito de Sucção no Hover */}
                    <div className="absolute inset-0 pointer-events-none group-hover:block hidden">
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        {magneticWords.slice(0, 6).map((word, index) => {
                          const angle = (index * 60) * Math.PI / 180
                          const x = Math.cos(angle) * 80
                          const y = Math.sin(angle) * 80

                          return (
                            <motion.div
                              key={`suction-${word}`}
                              className="absolute text-gray-300 text-xs font-light tracking-wide select-none opacity-50"
                              animate={{
                                x: [x, x * 0.5, 0],
                                y: [y, y * 0.5, 0],
                                opacity: [0.5, 0.2, 0],
                                scale: [1, 0.7, 0.1],
                                filter: ["blur(0px)", "blur(2px)", "blur(8px)"]
                              }}
                              transition={{
                                duration: 1.2,
                                delay: index * 0.1,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                              style={{
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)'
                              }}
                            >
                              {word}
                            </motion.div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Texto de Urgência */}
            <AnimatePresence>
              {showUrgencyText && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-center"
                >
                  <motion.p
                    className="text-sm font-medium text-gray-600"
                    animate={{
                      opacity: [0.7, 1, 0.7],
                      scale: [1, 1.02, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <span className="text-red-500 font-bold">LIMITADO:</span> Apenas hoje • Resultado em 8 minutos • <span className="text-green-600 font-bold">100% GRÁTIS</span>
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}