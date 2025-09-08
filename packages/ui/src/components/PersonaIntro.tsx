"use client"

/**
 * 🎯 PERSONA INTRO - PÁGINA MOTIVACIONAL
 * Primeira impressão que convence e motiva o tripulante
 * Experiência personalizada e contemplativa
 */

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { 
  Crown,
  Compass,
  Brain,
  Heart,
  Target,
  Sparkles,
  Users,
  TrendingUp,
  Zap,
  ArrowRight,
  Star,
  Gem,
  Eye,
  MapPin
} from 'lucide-react'

interface PersonaIntroProps {
  userName?: string
  onBeginJourney: () => void
  onExit?: () => void
}

export function PersonaIntro({ userName = "Navigator", onBeginJourney, onExit }: PersonaIntroProps) {
  const [stage, setStage] = useState(0)
  const [showDetailsPopup, setShowDetailsPopup] = useState(false)

  React.useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 300),
      setTimeout(() => setStage(2), 800),
      setTimeout(() => setStage(3), 1300),
      setTimeout(() => setStage(4), 1800)
    ]
    
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="h-screen bg-white text-slate-900 flex flex-col overflow-hidden relative">
      {/* Subtle background effect */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-slate-100/30 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-blue-50/40 rounded-full blur-3xl" />
      </div>

      {/* Header with MadBoat Logo */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-40">
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-lg px-4 py-2">
          <span className="text-xl font-bold text-slate-900 tracking-wide">Mad</span>
          <Crown size={18} className="text-slate-900 animate-spin-slow" strokeWidth={2.5} />
          <span className="text-xl font-bold text-slate-900 tracking-wide">Boat</span>
        </div>
      </div>

      {/* Exit Button */}
      {onExit && (
        <button
          onClick={onExit}
          className="absolute top-6 right-6 p-2 text-slate-500 hover:text-slate-600 transition-colors z-50"
          aria-label="Sair"
        >
          ✕
        </button>
      )}

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-8 py-4 relative">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          
          {/* Personal Greeting */}
          <AnimatePresence>
            {stage >= 1 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="space-y-4"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-full backdrop-blur-sm">
                  <Compass className="w-4 h-4 text-blue-800" />
                  <span className="text-slate-600 font-light tracking-wide text-sm">Bem-vindo à sua jornada</span>
                </div>
                
                <h1 className="text-4xl font-light text-slate-900 tracking-wide leading-tight">
                  Olá, <span className="text-blue-800 font-normal">{userName}</span>
                </h1>
                
                <p className="text-base text-slate-600 font-light leading-relaxed max-w-2xl mx-auto">
                  Sua jornada de autenticidade digital começa aqui
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* The Promise */}
          <AnimatePresence>
            {stage >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="space-y-4"
              >
                <div className="space-y-3">
                  <h2 className="text-2xl font-light text-slate-900 tracking-wide">
                    Primeiro Passo: Identificação de Persona
                  </h2>
                  <p className="text-base text-slate-600 font-light leading-relaxed max-w-3xl mx-auto">
                    Em <span className="text-slate-900">10 perguntas estratégicas</span>, identificamos sua persona comportamental. 
                    Esta é a <span className="text-blue-800">base fundamental</span> que nos permite personalizar toda sua jornada no método <span className="text-blue-800 font-medium">ALMA</span> - onde sua verdadeira autenticidade será revelada.
                  </p>
                </div>

                {/* Compact Benefits */}
                <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="text-center space-y-2"
                  >
                    <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/30 flex items-center justify-center">
                      <Brain className="w-6 h-6 text-blue-800" />
                    </div>
                    <h3 className="text-slate-900 text-sm font-light">Científico</h3>
                    <p className="text-xs text-slate-500 font-light leading-relaxed">
                      Base neurocientífica
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="text-center space-y-2"
                  >
                    <div className="w-12 h-12 mx-auto rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-blue-800" />
                    </div>
                    <h3 className="text-slate-900 text-sm font-light">Personalizador</h3>
                    <p className="text-xs text-slate-500 font-light leading-relaxed">
                      Define sua jornada ALMA
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                    className="text-center space-y-2"
                  >
                    <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-emerald-600/20 to-teal-600/20 border border-emerald-500/30 flex items-center justify-center">
                      <Target className="w-6 h-6 text-emerald-400" />
                    </div>
                    <h3 className="text-slate-900 text-sm font-light">Estratégico</h3>
                    <p className="text-xs text-slate-500 font-light leading-relaxed">
                      Primeira etapa essencial
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* The Impact */}
          <AnimatePresence>
            {stage >= 3 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="space-y-4"
              >
                <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl backdrop-blur-sm max-w-4xl mx-auto">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-8 h-8 text-blue-800" />
                      <span className="text-lg font-light text-slate-900 tracking-wide">Esta identificação revelará</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-center w-full max-w-3xl">
                      <div className="flex items-center justify-center gap-2 p-3 bg-white border border-slate-200 rounded-lg">
                        <Star className="w-4 h-4 text-blue-800 flex-shrink-0" />
                        <span className="text-sm text-slate-600 font-light">Seu padrão comportamental nos negócios</span>
                      </div>
                      <div className="flex items-center justify-center gap-2 p-3 bg-white border border-slate-200 rounded-lg">
                        <Star className="w-4 h-4 text-blue-800 flex-shrink-0" />
                        <span className="text-sm text-slate-600 font-light">Como personalizar sua jornada ALMA</span>
                      </div>
                      <div className="flex items-center justify-center gap-2 p-3 bg-white border border-slate-200 rounded-lg">
                        <Star className="w-4 h-4 text-blue-800 flex-shrink-0" />
                        <span className="text-sm text-slate-600 font-light">Sua forma ideal de comunicar valor</span>
                      </div>
                      <div className="flex items-center justify-center gap-2 p-3 bg-white border border-slate-200 rounded-lg">
                        <Star className="w-4 h-4 text-blue-800 flex-shrink-0" />
                        <span className="text-sm text-slate-600 font-light">Protocolos adaptados ao seu perfil</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Call to Action */}
          <AnimatePresence>
            {stage >= 4 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="space-y-4"
              >
                <div className="space-y-3">
                  <p className="text-base text-slate-600 font-light">
                    <span className="text-slate-900">{userName}</span>, vamos começar identificando sua persona comportamental
                  </p>
                  <p className="text-sm text-slate-500 font-light">
                    ⏱️ 8-12 minutos • 🔒 Dados 100% seguros • 🎯 Primeiro passo para o método ALMA
                  </p>
                </div>

                {/* CTA com mais destaque */}
                <div className="space-y-12">
                  <motion.button
                    onClick={onBeginJourney}
                    whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4)" }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-blue-800 hover:bg-blue-900 py-4 px-16 rounded-full transition-all duration-300 font-medium tracking-wide flex items-center gap-3 text-lg text-slate-900 shadow-2xl mx-auto"
                  >
                    Iniciar Minha Descoberta
                    <ArrowRight size={20} />
                  </motion.button>

                  <button
                    onClick={() => setShowDetailsPopup(true)}
                    className="text-sm text-slate-500 hover:text-slate-600 transition-colors font-light tracking-wide underline underline-offset-4"
                  >
                    Como funciona?
                  </button>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>

      {/* Bottom Indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-light">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          <span>Módulo Core • Freemium</span>
        </div>
      </div>

      {/* Popup Modal - Como Funciona */}
      <AnimatePresence>
        {showDetailsPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDetailsPopup(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, type: "spring", bounce: 0.1 }}
              className="bg-white border border-slate-200 rounded-3xl backdrop-blur-xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-light text-slate-900 tracking-wide">Como Funciona?</h3>
                <button
                  onClick={() => setShowDetailsPopup(false)}
                  className="p-2 text-slate-500 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-100"
                >
                  ✕
                </button>
              </div>

              {/* Conteúdo */}
              <div className="space-y-6">
                <p className="text-slate-600 font-light leading-relaxed">
                  Nossa identificação de persona utiliza métodos científicos avançados para mapear seu comportamento único:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <Eye className="w-5 h-5 text-blue-800 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-slate-900 font-medium text-sm mb-1">Análise Semântica</h4>
                      <span className="text-sm text-slate-600 font-light">Processamento avançado das suas respostas textuais</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <Brain className="w-5 h-5 text-blue-800 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-slate-900 font-medium text-sm mb-1">Padrões Comportamentais</h4>
                      <span className="text-sm text-slate-600 font-light">Mapeamento neurocientifico em tempo real</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <TrendingUp className="w-5 h-5 text-emerald-400 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-slate-900 font-medium text-sm mb-1">Métricas de Digitação</h4>
                      <span className="text-sm text-slate-600 font-light">Velocidade, pausas e ritmo de escrita</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <Users className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-slate-900 font-medium text-sm mb-1">Base de 26 Personas</h4>
                      <span className="text-sm text-slate-600 font-light">Comparação com nossa base científica completa</span>
                    </div>
                  </div>
                </div>

                {/* Próximos passos */}
                <div className="mt-8 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-blue-800 mt-1" />
                    <div>
                      <h4 className="text-slate-900 font-medium mb-2">O Que Acontece Depois?</h4>
                      <p className="text-slate-600/70 text-sm font-light leading-relaxed">
                        Sua persona identificada será a chave para personalizar completamente sua experiência no método <span className="text-blue-800 font-medium">ALMA</span>, 
                        onde descobriremos sua autenticidade profunda e criaremos estratégias únicas para seu sucesso digital.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-slate-200">
                <button
                  onClick={() => setShowDetailsPopup(false)}
                  className="w-full py-3 px-6 bg-blue-800 border border-blue-800 rounded-full text-slate-900 font-light tracking-wide hover:bg-blue-900 transition-all"
                >
                  Entendi, vamos começar!
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}