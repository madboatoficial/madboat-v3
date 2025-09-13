"use client"

/**
 * 🎯 PERSONA RESULT - PÁGINA ÉPICA DE REVELAÇÃO
 * O momento mais importante da jornada MadBoat
 * Onde o tripulante descobre sua identidade única no mercado digital
 */

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { 
  Brain,
  Heart,
  Target,
  Sparkles,
  Shield,
  Award,
  TrendingUp,
  Users,
  Zap,
  Share2,
  Download,
  Unlock,
  Star,
  Crown,
  Gem,
  Flame,
  ArrowRight,
  CheckCircle
} from 'lucide-react'

import { PersonaClassificationResult, PersonaType } from '../types/persona'
import { getPersonaTheme, getPersonaSymbol, getPersonaGradient } from '../config/persona-themes'
import { AchievementNotification, Achievement } from './AchievementNotification'

interface PersonaResultProps {
  userName?: string
  result: PersonaClassificationResult
  onContinue?: () => void
  onShare?: () => void
  onDownload?: () => void
  onViewEvolutionMap?: () => void
}

export function PersonaResult({ userName = "Navigator", result, onContinue, onShare, onDownload, onViewEvolutionMap }: PersonaResultProps) {
  const personaTheme = getPersonaTheme(result.persona)
  const [revealStage, setRevealStage] = useState(0)
  const [showImpact, setShowImpact] = useState(false)
  const [showAchievement, setShowAchievement] = useState(false)
  
  useEffect(() => {
    // Progressive reveal animation
    const timers = [
      setTimeout(() => setRevealStage(1), 500),   // Show main persona
      setTimeout(() => setRevealStage(2), 1500),  // Show exclusivity
      setTimeout(() => setRevealStage(3), 2500),  // Show advantage
      setTimeout(() => setRevealStage(4), 3500),  // Show transformation
      setTimeout(() => setShowImpact(true), 4500), // Show unlocked features
      setTimeout(() => setShowAchievement(true), 5000) // Show achievement notification
    ]
    
    return () => timers.forEach(clearTimeout)
  }, [])

  // Use the persona theme system for consistent theming
  const getStyledPersonaSymbol = (size = 'w-8 h-8') => {
    return getPersonaSymbol(result.persona, size)
  }

  // Get rarity badge
  const getRarityBadge = () => {
    switch(result.rarityLevel) {
      case 'extremely_rare':
        return { icon: <Crown className="w-5 h-5" />, color: 'from-yellow-400 to-orange-500', label: 'EXTREMAMENTE RARO' }
      case 'very_rare':
        return { icon: <Gem className="w-5 h-5" />, color: 'from-purple-400 to-pink-500', label: 'MUITO RARO' }
      case 'rare':
        return { icon: <Star className="w-5 h-5" />, color: 'from-blue-400 to-cyan-500', label: 'RARO' }
      case 'common':
        return { icon: <Award className="w-5 h-5" />, color: 'from-green-400 to-emerald-500', label: 'COMUM' }
      case 'very_common':
        return { icon: <CheckCircle className="w-5 h-5" />, color: 'from-gray-400 to-gray-500', label: 'MUITO COMUM' }
      default:
        return { icon: <Award className="w-5 h-5" />, color: 'from-green-400 to-emerald-500', label: 'COMUM' }
    }
  }

  const rarity = getRarityBadge()

  // Achievement notification data
  const personaAchievement: Achievement = {
    id: `persona-${result.persona}-${Date.now()}`,
    title: `Persona ${result.personaDisplayName}`,
    description: `Você descobriu sua identidade única no mercado digital! Esta conquista libera recursos personalizados e revela o próximo módulo da jornada.`,
    type: 'milestone',
    icon: result.persona === PersonaType.ANALITICO ? 'award' : 
          result.persona === PersonaType.EMOTIVO ? 'sparkles' :
          result.persona === PersonaType.PRAGMATICO ? 'zap' :
          result.persona === PersonaType.CRIATIVO ? 'star' : 'gem',
    rarity: result.rarityLevel === 'extremely_rare' ? 'legendary' :
            result.rarityLevel === 'very_rare' ? 'epic' :
            result.rarityLevel === 'rare' ? 'rare' : 'common',
    points: 500,
    unlocks: ['Método ALMA', 'DNA Criativo', 'Protocolo Personalizado', 'Mapa de Evolução']
  }

  // Single persona circle - main focal point
  const getMainPersonaCircle = () => (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
      className="relative"
    >
      <div className="w-40 h-40 rounded-full bg-slate-50 border-4 border-slate-200 flex items-center justify-center shadow-xl">
        <div className="text-blue-800">
          {getPersonaSymbol(result.persona, 'w-20 h-20')}
        </div>
      </div>
      {result.confidence >= 90 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg"
        >
          <Crown className="w-7 h-7 text-slate-900" />
        </motion.div>
      )}
    </motion.div>
  )

  return (
    <div className="h-screen bg-white text-slate-900 flex flex-col overflow-hidden relative">
      {/* Subtle background effect matching ExecutiveHUD */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-slate-100/30 rounded-full blur-3xl" />
      </div>

      {/* TOP-LEFT: System Status */}
      <div className="absolute top-4 left-4 z-50">
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-lg px-3 py-1.5">
          <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
          <span className="text-xs text-slate-500 font-mono">PERSONA REVELADA</span>
        </div>
      </div>

      {/* TOP-CENTER: MadBoat Logo */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-40">
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-lg px-4 py-2">
          <span className="text-xl font-bold text-slate-900 tracking-wide">Mad</span>
          <Crown size={18} className="text-slate-900" strokeWidth={2.5} />
          <span className="text-xl font-bold text-slate-900 tracking-wide">Boat</span>
        </div>
      </div>

      {/* MAIN CONTENT: Improved Professional Layout */}
      <div className="flex-1 flex items-center justify-center px-8 pt-20 pb-24 relative">
        <div className="w-full max-w-6xl relative">
          {/* LAYOUT HORIZONTAL PROFISSIONAL com melhor distribuição */}
          <div className="flex items-center justify-center gap-16 relative">
            
            {/* Linha Pontilhada Conectora */}
            <div className="absolute top-1/2 left-0 right-0 h-px border-t-2 border-dotted border-slate-200 -translate-y-1/2 z-0"></div>
            
            {/* ELEMENTO CENTRAL: Persona Principal - Aplicando Golden Ratio */}
            <AnimatePresence>
              {revealStage >= 1 && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                  className="relative z-20 flex flex-col items-center"
                >
                  <div className="mb-6">{getMainPersonaCircle()}</div>
                  <div className="text-center space-y-3">
                    <h2 className="text-3xl font-light text-slate-900 tracking-wide max-w-xs">{result.personaDisplayName}</h2>
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${rarity.color} text-slate-900 text-sm font-medium shadow-lg`}>
                      {rarity.icon}
                      <span>{rarity.label}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ELEMENTO ESQUERDO: Exclusividade */}
            <AnimatePresence>
              {revealStage >= 2 && (
                <motion.div
                  initial={{ scale: 0, opacity: 0, x: -30 }}
                  animate={{ scale: 1, opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.5, type: "spring" }}
                  className="relative z-10 flex flex-col items-center space-y-4"
                >
                  <div className="w-20 h-20 rounded-full bg-slate-50 border-2 border-slate-200 flex items-center justify-center shadow-xl backdrop-blur-sm">
                    <Gem className="w-7 h-7 text-blue-800" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-slate-900 font-light text-base mb-2">Exclusividade</h3>
                    <p className="text-slate-600 text-sm font-light">{result.populationPercentage}% população</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ELEMENTO DIREITO: Vantagem Competitiva */}
            <AnimatePresence>
              {revealStage >= 3 && (
                <motion.div
                  initial={{ scale: 0, opacity: 0, x: 30 }}
                  animate={{ scale: 1, opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 1.0, type: "spring" }}
                  className="relative z-10 flex flex-col items-center space-y-4"
                >
                  <div className="w-20 h-20 rounded-full bg-slate-50 border-2 border-slate-200 flex items-center justify-center shadow-xl backdrop-blur-sm">
                    <TrendingUp className="w-7 h-7 text-blue-800" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-slate-900 font-light text-base mb-2">Vantagem</h3>
                    <p className="text-slate-600 text-sm font-light">Competitiva</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            
          </div>
          
          {/* SEÇÃO INFERIOR: Detalhes e CTAs - Melhor Espaçamento */}
          <AnimatePresence>
            {revealStage >= 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                className="mt-20 max-w-5xl mx-auto"
              >
                
                {/* CTAs - Distribuição Profissional */}
                <div className="text-center space-y-12">
                  
                  {/* Título da Seção - 8pt Grid System */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-4"
                  >
                    <h2 className="text-4xl font-light text-slate-900 tracking-wide leading-tight">
                      {personaTheme.congratulations}, {userName}
                    </h2>
                    <p className={`text-base font-light max-w-2xl mx-auto leading-relaxed ${personaTheme.accentColor}`}>
                      {personaTheme.impactDescription}
                    </p>
                    <p className="text-slate-600 text-sm font-light max-w-2xl mx-auto leading-relaxed">
                      4 recursos exclusivos foram desbloqueados para sua persona única
                    </p>
                  </motion.div>
                  
                  {/* Recursos Desbloqueados - Melhor Distribuição */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
                    <motion.div 
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="flex flex-col items-center p-6 bg-slate-50 border border-slate-200 rounded-2xl backdrop-blur-sm hover:border-slate-300 transition-colors"
                    >
                      <CheckCircle className="w-6 h-6 text-green-600 mb-3" />
                      <span className="text-slate-600 text-sm text-center font-light leading-relaxed">Protocolo Personalizado</span>
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="flex flex-col items-center p-6 bg-slate-50 border border-slate-200 rounded-2xl backdrop-blur-sm hover:border-slate-300 transition-colors"
                    >
                      <CheckCircle className="w-6 h-6 text-green-600 mb-3" />
                      <span className="text-slate-600 text-sm text-center font-light leading-relaxed">DNA Criativo</span>
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="flex flex-col items-center p-6 bg-slate-50 border border-slate-200 rounded-2xl backdrop-blur-sm hover:border-slate-300 transition-colors"
                    >
                      <CheckCircle className="w-6 h-6 text-green-600 mb-3" />
                      <span className="text-slate-600 text-sm text-center font-light leading-relaxed">Jornada Adaptada</span>
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="flex flex-col items-center p-6 bg-slate-50 border border-slate-200 rounded-2xl backdrop-blur-sm hover:border-slate-300 transition-colors"
                    >
                      <CheckCircle className="w-6 h-6 text-green-600 mb-3" />
                      <span className="text-slate-600 text-sm text-center font-light leading-relaxed">Mapa de Evolução</span>
                    </motion.div>
                  </div>

                  {/* CTAs Principais - Melhor Espaçamento */}
                  <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <motion.button
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      onClick={onViewEvolutionMap}
                      className="border border-slate-300 py-4 px-10 rounded-full transition-all duration-300 font-light tracking-wide flex items-center gap-3 mx-auto text-base hover:border-slate-400 hover:bg-slate-50 text-slate-900 hover:scale-105"
                    >
                      <Target size={18} />
                      Ver Mapa de Evolução
                    </motion.button>

                    <motion.button
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 }}
                      onClick={onContinue}
                      className="border border-slate-300 py-4 px-10 rounded-full transition-all duration-300 font-light tracking-wide flex items-center gap-3 mx-auto text-base hover:border-slate-400 hover:bg-slate-50 text-slate-900 hover:scale-105"
                    >
                      Continuar Jornada
                      <ArrowRight size={18} />
                    </motion.button>
                  </div>

                  {/* Ações Secundárias - Melhor Espaçamento */}
                  <div className="flex items-center justify-center gap-8 mt-8">
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.0 }}
                      onClick={onShare}
                      className="text-sm text-slate-500 hover:text-slate-600 transition-colors font-light tracking-wide hover:scale-105"
                    >
                      Compartilhar resultado
                    </motion.button>
                    <div className="w-px h-4 bg-zinc-700" />
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.1 }}
                      onClick={onDownload}
                      className="text-sm text-slate-500 hover:text-slate-600 transition-colors font-light tracking-wide hover:scale-105"
                    >
                      Baixar relatório
                    </motion.button>
                  </div>
                </div>

                {/* Important note - Melhor Distribuição */}
                <motion.div 
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="mt-12 p-8 bg-yellow-50 border border-yellow-200 rounded-2xl backdrop-blur-sm max-w-3xl mx-auto"
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <Flame className="w-8 h-8 text-yellow-600" />
                    <div className="space-y-3">
                      <p className="text-slate-900 font-light text-lg tracking-wide leading-relaxed">
                        {personaTheme.encouragement}, {userName}
                      </p>
                      <p className="text-slate-600 font-light text-base leading-relaxed max-w-2xl mx-auto">
                        {personaTheme.nextStepsIntro} - sua jornada será única e alinhada com sua essência.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* BOTTOM BAR: Legacy Stats & Quick Info matching ExecutiveHUD */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-slate-300/50 bg-zinc-950/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            
            {/* Left: Persona Info */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Brain size={12} />
                <span>Persona: {result.personaDisplayName}</span>
              </div>
              <div className="w-px h-4 bg-slate-300" />
              <div className="text-xs text-slate-500">
                <span className="text-slate-600">Confiança:</span> {result.confidence}%
              </div>
            </div>

            {/* Center: Quick Stats */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                <span className="text-xs text-slate-600 font-light">Raridade {rarity.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-xs text-slate-600 font-light">4 Recursos Ativos</span>
              </div>
            </div>

            {/* Right: Population */}
            <div className="flex items-center gap-4">
              <div className="text-xs text-slate-500">
                <span className="text-slate-600">{result.populationPercentage}%</span> da população
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Users size={12} />
                <span className="text-slate-600">Exclusiva</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Notification */}
      <AchievementNotification
        achievement={personaAchievement}
        isVisible={showAchievement}
        onClose={() => setShowAchievement(false)}
        position="top-center"
        duration={8000}
      />

    </div>
  )
}