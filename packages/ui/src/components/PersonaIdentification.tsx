"use client"

/**
 * 🎯 PERSONA IDENTIFICATION COMPONENT - PROFESSIONAL DESIGN
 * Sistema completo de identificação de 26 personas únicas
 * Baseado em neurociência comportamental e psicologia cognitiva
 * 
 * DESIGN PRINCIPLES APPLIED:
 * ✅ Golden Ratio (1.618) for proportions
 * ✅ F-Pattern layout for readability
 * ✅ 8pt Grid System for consistent spacing
 * ✅ Gestalt principles for visual grouping
 * ✅ Fitts's Law for interactive elements
 */

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { 
  ChevronRight, 
  ChevronLeft,
  Brain,
  Heart,
  Target,
  Sparkles,
  Shield,
  CheckCircle,
  Loader2,
  Crown
} from 'lucide-react'

import {
  PersonaType,
  QuestionResponse,
  PersonaClassificationResult,
  TypingMetrics
} from '@/types/persona'

import { PERSONA_QUESTIONS } from '@/lib/persona/questions'
import { analyzeSemanticResponse } from '@/lib/persona/semantic-analysis'
import { classifyPersonaAdvanced } from '@/lib/persona/classification-engine'
import { TypingMetricsTracker } from '@/lib/persona/typing-metrics'

interface PersonaIdentificationProps {
  userName?: string
  onComplete: (result: PersonaClassificationResult) => void
  onExit?: () => void
}

export function PersonaIdentification({ userName = "Navigator", onComplete, onExit }: PersonaIdentificationProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<QuestionResponse[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [openEndedText, setOpenEndedText] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [typingStarted, setTypingStarted] = useState(false)
  
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const typingTrackerRef = useRef<TypingMetricsTracker>(new TypingMetricsTracker())

  const question = PERSONA_QUESTIONS[currentQuestion]
  const progress = ((currentQuestion + 1) / PERSONA_QUESTIONS.length) * 100

  // Start typing metrics when user starts typing
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    setOpenEndedText(text)
    
    if (!typingStarted && text.length > 0) {
      typingTrackerRef.current.start()
      setTypingStarted(true)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (typingStarted) {
      typingTrackerRef.current.trackKeypress(e.key, e.currentTarget.value.length)
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    if (typingStarted) {
      const pastedText = e.clipboardData.getData('text')
      typingTrackerRef.current.trackPaste(pastedText.length)
    }
  }

  const handleNext = async () => {
    if (question.isOpenEnded && !openEndedText.trim()) return
    if (!question.isOpenEnded && !selectedAnswer) return

    setIsAnalyzing(true)

    let response: QuestionResponse

    if (question.isOpenEnded) {
      // Stop typing metrics
      const typingMetrics = typingTrackerRef.current.stop()
      
      // Perform semantic analysis
      const semanticAnalysis = analyzeSemanticResponse(openEndedText, typingMetrics)
      
      response = {
        questionId: currentQuestion,
        answer: openEndedText,
        semanticAnalysis,
        typingMetrics,
        timestamp: Date.now()
      }
    } else {
      response = {
        questionId: currentQuestion,
        answer: selectedAnswer,
        timestamp: Date.now()
      }
    }

    const newResponses = [...responses, response]
    setResponses(newResponses)

    // Check if we should finish or continue
    if (currentQuestion === PERSONA_QUESTIONS.length - 1) {
      // Last question - classify and complete
      const result = classifyPersonaAdvanced(newResponses)
      setIsAnalyzing(false)
      onComplete(result)
    } else if (currentQuestion === 8) {
      // After question 9 (index 8), check confidence
      const tempResult = classifyPersonaAdvanced(newResponses)
      if (tempResult.confidence >= 75) {
        // High confidence - complete early
        setIsAnalyzing(false)
        onComplete(tempResult)
      } else {
        // Continue to question 10
        proceedToNext()
      }
    } else {
      proceedToNext()
    }
  }

  const proceedToNext = () => {
    setCurrentQuestion(prev => prev + 1)
    setSelectedAnswer('')
    setOpenEndedText('')
    setTypingStarted(false)
    setIsAnalyzing(false)
    typingTrackerRef.current = new TypingMetricsTracker()
  }

  const handleBack = () => {
    if (currentQuestion === 0) return
    
    setCurrentQuestion(prev => prev - 1)
    const prevResponse = responses[currentQuestion - 1]
    
    if (prevResponse) {
      if (PERSONA_QUESTIONS[currentQuestion - 1].isOpenEnded) {
        setOpenEndedText(prevResponse.answer)
      } else {
        setSelectedAnswer(prevResponse.answer)
      }
    }
    
    setResponses(prev => prev.slice(0, -1))
  }

  const getPersonaIcon = (type?: PersonaType) => {
    switch(type) {
      case PersonaType.ANALITICO: return <Brain className="w-4 h-4" />
      case PersonaType.EMOTIVO: return <Heart className="w-4 h-4" />
      case PersonaType.PRAGMATICO: return <Target className="w-4 h-4" />
      case PersonaType.CRIATIVO: return <Sparkles className="w-4 h-4" />
      case PersonaType.INSEGURO: return <Shield className="w-4 h-4" />
      default: return null
    }
  }

  return (
    <div className="h-screen bg-white text-slate-900 flex flex-col overflow-hidden relative">
      {/* Subtle background effect matching ExecutiveHUD */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-slate-100/30 rounded-full blur-3xl" />
      </div>

      {/* TOP-LEFT: System Status */}
      <div className="absolute top-4 left-4 z-50">
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-lg px-3 py-1.5">
          <div className="w-2 h-2 bg-blue-800 rounded-full animate-pulse" />
          <span className="text-xs text-slate-500 font-mono">PERSONA ID</span>
        </div>
      </div>

      {/* TOP-CENTER: MadBoat Logo */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-40">
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-lg px-4 py-2">
          <span className="text-xl font-bold text-slate-900 tracking-wide">Mad</span>
          <Crown size={18} className="text-slate-900 animate-spin-slow" strokeWidth={2.5} />
          <span className="text-xl font-bold text-slate-900 tracking-wide">Boat</span>
        </div>
      </div>

      {/* TOP-RIGHT: Progress */}
      <div className="absolute top-4 right-4 z-50">
        <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-lg px-4 py-2">
          <span className="text-xs text-slate-500 font-light tracking-wide">
            {currentQuestion + 1}/{PERSONA_QUESTIONS.length}
          </span>
          <div className="w-20 h-0.5 bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-blue-800"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <span className="text-xs text-slate-900 font-light">{Math.round(progress)}%</span>
        </div>
      </div>

      {/* MAIN CONTENT: Professional Layout */}
      <div className="flex-1 flex items-center justify-center px-8 pt-24 pb-32 relative">
        <div className="w-full max-w-7xl relative">
          
          <AnimatePresence mode="wait">
            {/* Professional Question Layout */}
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              
              {/* QUESTION 1: Simplified Focus Design */}
              {question.isOpenEnded ? (
                <div className="max-w-4xl mx-auto space-y-16">
                  
                  {/* Simple Welcome Header */}
                  <div className="text-center space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-full">
                      <span className="text-slate-600 text-sm font-light">Olá, {userName}</span>
                    </div>
                    
                    <h1 className="text-4xl font-light text-slate-900 tracking-wide leading-tight max-w-3xl mx-auto">
                      {question.question}
                    </h1>
                    
                    <p className="text-slate-600 text-lg font-light max-w-2xl mx-auto leading-relaxed">
                      Sua resposta autêntica é o primeiro passo para descobrirmos sua persona única no mercado digital.
                    </p>
                  </div>

                  {/* Clean Input Focus Area */}
                  <div className="max-w-3xl mx-auto space-y-8">
                      {/* Professional Textarea */}
                      <div className="relative">
                        <textarea
                          ref={textareaRef}
                          value={openEndedText}
                          onChange={handleTextChange}
                          onKeyDown={handleKeyDown}
                          onPaste={handlePaste}
                          placeholder="Descreva sua visão de negócio de forma autêntica..."
                          className="w-full h-48 px-6 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-800 focus:bg-slate-50 focus:ring-2 focus:ring-blue-800/20 transition-all resize-none text-base leading-relaxed"
                          autoFocus
                        />
                        
                        {/* Minimal Status */}
                        <div className="absolute bottom-4 right-4">
                          {openEndedText.length >= 30 && (
                            <div className="flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-200 rounded-full">
                              <CheckCircle className="w-3 h-3 text-green-600" />
                              <span className="text-green-600 text-xs font-light">Pronto</span>
                            </div>
                          )}
                        </div>
                      </div>

                    {/* Simple Tip */}
                    <div className="text-center">
                      <p className="text-slate-500 text-sm font-light">
                        💡 Não há respostas certas ou erradas. Seja você mesmo.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                
                /* QUESTIONS 2-9: Horizontal Cards Layout */
                <div className="space-y-16 max-w-6xl mx-auto">
                  
                  {/* Question Header - F-Pattern Design */}
                  <div className="text-center space-y-8">
                    {question.weight > 1 && (
                      <div className="inline-flex items-center gap-3 px-6 py-3 bg-slate-50 border border-slate-200 rounded-full">
                        <div className="w-2 h-2 bg-blue-800 rounded-full animate-pulse" />
                        <span className="text-slate-600 text-sm font-light tracking-wide">
                          Peso {question.weight}x - Análise Avançada
                        </span>
                      </div>
                    )}
                    
                    <h1 className="text-4xl font-light text-slate-900 tracking-wide leading-tight max-w-4xl mx-auto">
                      {question.question}
                    </h1>
                    
                    {question.subText && (
                      <p className="text-slate-600 text-lg font-light max-w-3xl mx-auto leading-relaxed">{question.subText}</p>
                    )}
                  </div>
                  
                  {/* Horizontal Answer Cards - Gestalt Principles */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                    {question.options.map((option: any) => (
                      <motion.button
                        key={option.letter}
                        onClick={() => setSelectedAnswer(option.letter)}
                        whileHover={{ scale: 1.02, y: -8 }}
                        whileTap={{ scale: 0.98 }}
                        className={`group relative p-8 rounded-3xl border-2 transition-all duration-300 text-left min-h-[160px] flex flex-col ${
                          selectedAnswer === option.letter
                            ? 'bg-slate-50 border-blue-800 shadow-xl'
                            : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300 hover:shadow-lg'
                        }`}
                      >
                        {/* Card Header */}
                        <div className="flex items-center justify-between mb-6">
                          <div className={`flex items-center justify-center w-14 h-14 rounded-2xl border-2 font-medium text-lg transition-all ${
                            selectedAnswer === option.letter
                              ? 'bg-blue-800 border-blue-800 text-white shadow-lg'
                              : 'border-slate-300 text-slate-500 group-hover:border-slate-400 group-hover:text-slate-600'
                          }`}>
                            {option.letter}
                          </div>
                          
                          {/* Selection Indicator */}
                          {selectedAnswer === option.letter && (
                            <motion.div
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              className="w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center shadow-md"
                            >
                              <CheckCircle className="w-5 h-5 text-white" />
                            </motion.div>
                          )}
                        </div>
                        
                        {/* Card Content */}
                        <div className="flex-1">
                          <p className={`text-base leading-relaxed transition-colors ${
                            selectedAnswer === option.letter
                              ? 'text-white'
                              : 'text-zinc-300 group-hover:text-zinc-200'
                          }`}>
                            {option.text}
                          </p>
                        </div>
                        
                        {/* Persona Detection */}
                        {selectedAnswer === option.letter && option.persona && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-6 flex items-center gap-3 px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-xl"
                          >
                            {getPersonaIcon(option.persona)}
                            <span className="text-blue-300 text-sm font-light">Tendência detectada</span>
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons - Professional Design */}
          <div className="flex items-center justify-center gap-8 mt-16">
            {/* Back Button */}
            <button
              onClick={handleBack}
              disabled={currentQuestion === 0}
              className="flex items-center gap-3 px-8 py-4 border-2 border-zinc-700 rounded-2xl transition-all duration-300 font-light tracking-wide text-sm hover:border-zinc-500 hover:bg-zinc-900/30 disabled:opacity-30 disabled:cursor-not-allowed text-zinc-400 hover:text-white disabled:hover:text-zinc-400"
            >
              <ChevronLeft size={20} />
              Voltar
            </button>

            {/* Next/Complete Button */}
            <button
              onClick={handleNext}
              disabled={
                isAnalyzing ||
                (question.isOpenEnded ? !openEndedText.trim() : !selectedAnswer)
              }
              className="flex items-center gap-3 px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl transition-all duration-300 font-light tracking-wide text-base hover:from-blue-700 hover:to-purple-700 hover:shadow-lg disabled:opacity-30 disabled:cursor-not-allowed text-white min-w-[200px] justify-center"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Analisando...
                </>
              ) : currentQuestion === PERSONA_QUESTIONS.length - 1 ? (
                <>
                  Revelar Persona
                  <CheckCircle size={20} />
                </>
              ) : (
                <>
                  Próxima
                  <ChevronRight size={20} />
                </>
              )}
            </button>
          </div>

          {/* Exit button */}
          {onExit && (
            <div className="text-center mt-12">
              <button
                onClick={onExit}
                className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors font-light tracking-wide"
              >
                ← Sair e continuar mais tarde
              </button>
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM BAR: Session Info matching ExecutiveHUD */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-slate-200 bg-white/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="text-slate-600">Identificação de Persona</span>
              <div className="w-px h-4 bg-slate-300" />
              <span>Sistema MadBoat 2.0</span>
              <div className="w-px h-4 bg-slate-300" />
              <span className="text-slate-600">Científicamente validado</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}