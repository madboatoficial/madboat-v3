'use client'

import React, { useState, useEffect, useRef, memo, useCallback, useDeferredValue, useTransition, startTransition, createElement, useMemo } from 'react'
import { motion, AnimatePresence, useAnimation, useMotionValue, useTransform, useSpring, useCycle, MotionValue, PanInfo, useAnimationFrame, useViewportScroll, LayoutGroup, Reorder, LazyMotion, domAnimation } from 'framer-motion'
import { SimpleLanding } from './SimpleLanding'
import { MandarinFishAnimationToolkit } from './CreativeAnimationFramework'
import { UncleMcDuckPerformanceToolkit } from './PerformanceOptimizedAnimations'

// Type definitions (now local to UI package)
export interface PersonaQuestion {
  id: number
  alertText?: string
  introText?: string
  question: string
  subText?: string
  type: 'multiple_choice' | 'open_ended' | 'dual_range_slider' | 'visual_analog_scale' | 'situational_judgment' | 'reaction_time'
  placeholder?: string
  options: Array<{
    letter: 'A' | 'B' | 'C' | 'D' | 'E'
    text: string
    persona?: string
    points?: Record<string, number> // Points for each persona
  }>
  // Slider configurations
  sliderConfig?: {
    leftLabel: string
    rightLabel: string
    isDualRange?: boolean
    personas: Record<string, { min: number, max: number }> // Score ranges for each persona
  }
  // Situational Judgment configs
  scenario?: {
    title: string
    description: string
    choices: Array<{
      id: string
      text: string
      personas: Record<string, number>
      priority?: boolean // If this is a priority ranking question
    }>
  }
  // Reaction time configs
  reactionConfig?: {
    words: Array<{
      word: string
      personas: Record<string, number> // Faster reaction = higher score
    }>
    timeoutMs: number
  }
  weight: number
}

export interface QuestionResponse {
  questionId: number
  type: string
  answer: string | number | Array<any>
  // Traditional metrics
  semanticAnalysis?: any
  typingMetrics?: TypingMetrics
  timestamp: number
  // Interactive metrics
  sliderValues?: {
    primary?: number // 0-100
    secondary?: number // For dual range
    confidence?: number // User's confidence in their answer
  }
  reactionTimes?: Array<{
    word: string
    reactionTimeMs: number
    accuracy: boolean
  }>
  behavioralMetrics?: {
    mouseMovements?: number
    hesitationTime?: number
    clickPattern?: string
    scrollBehavior?: string
  }
  priorityRanking?: Array<{
    choiceId: string
    rank: number
  }>
  // Enhanced interactive metrics for new hybrid system
  interactiveMetrics?: {
    sliderValues?: [number, number]
    analogValue?: number
    confidence?: number
    priorityRanking?: string[]
    reactionResults?: Array<{ word: string, reactionTimeMs: number, accuracy: boolean }>
    questionType?: string
  }
}

export interface TypingMetrics {
  startTime: number
  endTime: number
  totalTime: number
  characterCount: number
  averageTypingSpeed: number
  pauseCount: number
  backspaceCount: number
  hesitationCount: number
  corrections: number[]
}

export interface PersonaClassificationResult {
  // Core results
  personaDisplayName: string
  confidence: number
  description: string
  
  // Classification details
  personaComposition: string
  
  // Additional insights
  populationPercentage: number
  rarityLevel: 'very_common' | 'common' | 'rare' | 'very_rare' | 'extremely_rare'
  businessImpact: string
  transformationPotential: string
}

// Props interface for better typing
interface UncontrolledTextareaProps {
  placeholder?: string
  textareaRef: React.RefObject<HTMLTextAreaElement | null>
  onTextChange: (value: string) => void
  onButtonStateChange: (enabled: boolean) => void
}

// ========= COMPONENTES INTERATIVOS CIENTÍFICOS =========

// Dual Range Slider Component (Baseado em pesquisa 2024)
interface DualRangeSliderProps {
  leftLabel: string
  rightLabel: string
  isDualRange: boolean
  onValueChange: (primary: number, secondary?: number) => void
  onConfidenceChange?: (confidence: number) => void
}

const DualRangeSlider = memo<DualRangeSliderProps>(({
  leftLabel,
  rightLabel,
  isDualRange,
  onValueChange,
  onConfidenceChange
}) => {
  const [primaryValue, setPrimaryValue] = useState(50)
  const [secondaryValue, setSecondaryValue] = useState(70)
  const [confidence, setConfidence] = useState(80)

  const handlePrimaryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)
    setPrimaryValue(value)
    onValueChange(value, isDualRange ? secondaryValue : undefined)
  }, [isDualRange, secondaryValue, onValueChange])

  const handleSecondaryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)
    setSecondaryValue(value)
    onValueChange(primaryValue, value)
  }, [primaryValue, onValueChange])

  const handleConfidenceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)
    setConfidence(value)
    onConfidenceChange?.(value)
  }, [onConfidenceChange])

  return (
    <div className="space-y-6">
      {/* Primary Slider */}
      <div className="space-y-3">
        <div className="flex justify-between text-xs text-gray-600 font-light tracking-wider">
          <span>{leftLabel}</span>
          <span className="text-gray-900 font-normal">COMPORTAMENTO NORMAL</span>
          <span>{rightLabel}</span>
        </div>

        <div className="relative">
          <input
            type="range"
            min="0"
            max="100"
            value={primaryValue}
            onChange={handlePrimaryChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-primary"
          />
          <div
            className="absolute -top-8 transform -translate-x-1/2 text-xs text-gray-700 font-normal"
            style={{ left: `${primaryValue}%` }}
          >
            {primaryValue}%
          </div>
        </div>
      </div>

      {/* Secondary Slider (Dual Range) */}
      {isDualRange && (
        <div className="space-y-3">
          <div className="flex justify-between text-xs text-gray-600 font-light tracking-wider">
            <span>{leftLabel}</span>
            <span className="text-gray-900 font-normal">EM SITUAÇÕES EXTREMAS</span>
            <span>{rightLabel}</span>
          </div>

          <div className="relative">
            <input
              type="range"
              min="0"
              max="100"
              value={secondaryValue}
              onChange={handleSecondaryChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-secondary"
            />
            <div
              className="absolute -top-8 transform -translate-x-1/2 text-xs text-gray-700 font-normal"
              style={{ left: `${secondaryValue}%` }}
            >
              {secondaryValue}%
            </div>
          </div>
        </div>
      )}

      {/* Confidence Meter */}
      <div className="pt-4 border-t border-gray-200">
        <div className="space-y-3">
          <div className="flex justify-between text-xs text-gray-600 font-light tracking-wider">
            <span>POUCO CERTO</span>
            <span className="text-gray-900 font-normal">CONFIANÇA NA RESPOSTA</span>
            <span>MUITO CERTO</span>
          </div>

          <div className="relative">
            <input
              type="range"
              min="0"
              max="100"
              value={confidence}
              onChange={handleConfidenceChange}
              className="w-full h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer slider-confidence"
            />
            <div
              className="absolute -top-6 transform -translate-x-1/2 text-xs text-gray-600"
              style={{ left: `${confidence}%` }}
            >
              {confidence}%
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}, () => true)

// Situational Judgment Component (Drag & Drop)
interface SituationalJudgmentProps {
  scenario: {
    title: string
    description: string
    choices: Array<{
      id: string
      text: string
      personas: Record<string, number>
    }>
  }
  onRankingChange: (ranking: Array<{ choiceId: string, rank: number }>) => void
}

const SituationalJudgment = memo<SituationalJudgmentProps>(({
  scenario,
  onRankingChange
}) => {
  const [ranking, setRanking] = useState(scenario.choices.map(choice => choice.id))
  const [draggedItem, setDraggedItem] = useState<string | null>(null)

  const handleDragStart = useCallback((e: React.DragEvent, choiceId: string) => {
    setDraggedItem(choiceId)
    e.dataTransfer.effectAllowed = 'move'
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }, [])

  const handleDrop = useCallback((e: React.DragEvent, targetId: string) => {
    e.preventDefault()

    if (!draggedItem || draggedItem === targetId) return

    const newRanking = [...ranking]
    const draggedIndex = newRanking.indexOf(draggedItem)
    const targetIndex = newRanking.indexOf(targetId)

    newRanking.splice(draggedIndex, 1)
    newRanking.splice(targetIndex, 0, draggedItem)

    setRanking(newRanking)

    const rankingResult = newRanking.map((choiceId, index) => ({
      choiceId,
      rank: index + 1
    }))

    onRankingChange(rankingResult)
    setDraggedItem(null)
  }, [draggedItem, ranking, onRankingChange])

  return (
    <div className="space-y-6">
      {/* Scenario Description */}
      <div className="bg-gray-50 border border-gray-300 p-6">
        <h4 className="text-sm font-normal text-gray-900 mb-3 tracking-wider uppercase">{scenario.title}</h4>
        <p className="text-sm text-gray-700 font-light leading-relaxed">{scenario.description}</p>
      </div>

      {/* Instructions */}
      <div className="text-center">
        <p className="text-xs text-gray-600 font-light tracking-wider uppercase">
          Arraste os itens para organizá-los por prioridade (1º = mais importante)
        </p>
      </div>

      {/* Draggable Choices */}
      <div className="space-y-3">
        {ranking.map((choiceId, index) => {
          const choice = scenario.choices.find(c => c.id === choiceId)!
          return (
            <div
              key={choiceId}
              draggable
              onDragStart={(e) => handleDragStart(e, choiceId)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, choiceId)}
              className={`
                p-4 border border-gray-300 bg-white cursor-move transition-all duration-200
                flex items-center space-x-4 hover:border-gray-400 hover:shadow-sm
                ${draggedItem === choiceId ? 'opacity-50 scale-95' : ''}
              `}
            >
              <div className="w-8 h-8 border border-gray-400 flex items-center justify-center text-sm font-normal text-gray-700">
                {index + 1}
              </div>
              <div className="flex-1 text-sm text-gray-800 font-light">
                {choice.text}
              </div>
              <div className="text-xs text-gray-500">⋮⋮</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}, () => false)

// Visual Analog Scale Component
interface VisualAnalogScaleProps {
  leftLabel: string
  rightLabel: string
  value: number
  confidence: number
  onChange: (value: number, confidence: number) => void
  personas: Record<string, { min: number, max: number }>
}

const VisualAnalogScale = memo<VisualAnalogScaleProps>(({
  leftLabel,
  rightLabel,
  value,
  confidence,
  onChange,
  personas
}) => {
  const [isDraggingValue, setIsDraggingValue] = useState(false)
  const [isDraggingConfidence, setIsDraggingConfidence] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = useCallback((type: 'value' | 'confidence') => (e: React.MouseEvent) => {
    e.preventDefault()
    if (type === 'value') {
      setIsDraggingValue(true)
    } else {
      setIsDraggingConfidence(true)
    }
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!trackRef.current || (!isDraggingValue && !isDraggingConfidence)) return

    const rect = trackRef.current.getBoundingClientRect()
    const percentage = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))

    if (isDraggingValue) {
      onChange(percentage, confidence)
    } else if (isDraggingConfidence) {
      onChange(value, percentage)
    }
  }, [isDraggingValue, isDraggingConfidence, value, confidence, onChange])

  const handleMouseUp = useCallback(() => {
    setIsDraggingValue(false)
    setIsDraggingConfidence(false)
  }, [])

  useEffect(() => {
    if (isDraggingValue || isDraggingConfidence) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDraggingValue, isDraggingConfidence, handleMouseMove, handleMouseUp])

  return (
    <div className="space-y-6">
      {/* Main Value Scale */}
      <div className="space-y-3">
        <div className="flex justify-between text-xs text-gray-600 font-light tracking-wider uppercase">
          <span>{leftLabel}</span>
          <span>{rightLabel}</span>
        </div>

        <div
          ref={trackRef}
          className="relative h-2 bg-gray-200 border border-gray-300 cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            const percentage = ((e.clientX - rect.left) / rect.width) * 100
            onChange(percentage, confidence)
          }}
        >
          <div
            className="absolute top-0 left-0 h-full bg-black transition-all duration-150"
            style={{ width: `${value}%` }}
          />
          <div
            className="absolute top-1/2 w-4 h-4 bg-white border-2 border-black cursor-grab active:cursor-grabbing transform -translate-y-1/2 -translate-x-1/2"
            style={{ left: `${value}%` }}
            onMouseDown={handleMouseDown('value')}
          />
        </div>

        <div className="text-center text-xs text-gray-700 font-light">
          Posição: {Math.round(value)}%
        </div>
      </div>

      {/* Confidence Scale */}
      <div className="space-y-3">
        <div className="text-xs text-gray-600 font-light tracking-wider uppercase text-center">
          Confiança na Resposta
        </div>

        <div className="relative h-1 bg-gray-200 border border-gray-300">
          <div
            className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-150"
            style={{ width: `${confidence}%` }}
          />
          <div
            className="absolute top-1/2 w-3 h-3 bg-white border border-blue-500 cursor-grab active:cursor-grabbing transform -translate-y-1/2 -translate-x-1/2"
            style={{ left: `${confidence}%` }}
            onMouseDown={handleMouseDown('confidence')}
          />
        </div>

        <div className="text-center text-xs text-gray-700 font-light">
          {confidence < 30 ? 'Baixa' : confidence < 70 ? 'Média' : 'Alta'} Confiança
        </div>
      </div>
    </div>
  )
}, () => false)

// Reaction Time Component
interface ReactionTimeProps {
  words: Array<{
    word: string
    personas: Record<string, number>
  }>
  timeoutMs: number
  onComplete: (results: Array<{ word: string, reactionTimeMs: number, accuracy: boolean }>) => void
}

const ReactionTime = memo<ReactionTimeProps>(({
  words,
  timeoutMs,
  onComplete
}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [isWaiting, setIsWaiting] = useState(true)
  const [results, setResults] = useState<Array<{ word: string, reactionTimeMs: number, accuracy: boolean }>>([])
  const [startTime, setStartTime] = useState<number>(0)
  const [isComplete, setIsComplete] = useState(false)

  const currentWord = words[currentWordIndex]

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (e.code === 'Space' && !isWaiting && startTime > 0) {
      e.preventDefault()
      const reactionTime = Date.now() - startTime
      const newResult = {
        word: currentWord.word,
        reactionTimeMs: reactionTime,
        accuracy: reactionTime < timeoutMs
      }

      const newResults = [...results, newResult]
      setResults(newResults)

      if (currentWordIndex < words.length - 1) {
        setCurrentWordIndex(prev => prev + 1)
        setIsWaiting(true)
        setStartTime(0)
      } else {
        setIsComplete(true)
        onComplete(newResults)
      }
    }
  }, [isWaiting, startTime, currentWord, currentWordIndex, words, results, timeoutMs, onComplete])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleKeyPress])

  useEffect(() => {
    if (isWaiting && !isComplete) {
      const timer = setTimeout(() => {
        setIsWaiting(false)
        setStartTime(Date.now())
      }, 1000 + Math.random() * 2000) // Random delay 1-3s

      return () => clearTimeout(timer)
    }
  }, [currentWordIndex, isWaiting, isComplete])

  if (isComplete) {
    return (
      <div className="text-center py-12">
        <div className="text-lg text-gray-900 font-light mb-4">Teste de Reação Completo!</div>
        <div className="text-sm text-gray-600">
          {results.filter(r => r.accuracy).length} de {results.length} reações dentro do tempo ideal
        </div>
      </div>
    )
  }

  return (
    <div className="text-center py-12 space-y-8">
      <div className="text-sm text-gray-600 font-light tracking-wider">
        PALAVRA {currentWordIndex + 1} DE {words.length}
      </div>

      <div className="h-32 flex items-center justify-center">
        {isWaiting ? (
          <div className="text-2xl text-gray-400 font-light">Prepare-se...</div>
        ) : (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-4xl font-light text-gray-900 tracking-widest"
          >
            {currentWord.word}
          </motion.div>
        )}
      </div>

      <div className="text-xs text-gray-500 font-light">
        Pressione ESPAÇO quando a palavra se conectar com você
      </div>
    </div>
  )
}, () => false)

// Textarea usando estratégia uncontrolled + ref (ZERO re-renders)
const UncontrolledTextarea = memo<UncontrolledTextareaProps>(({
  placeholder,
  textareaRef,
  onTextChange,
  onButtonStateChange
}) => {
  const isHydratedRef = useRef(false)
  const callbacksRef = useRef({ onTextChange, onButtonStateChange })
  
  // Atualiza refs sem causar re-render
  callbacksRef.current = { onTextChange, onButtonStateChange }
  
  // Função debounced estável - criada uma única vez
  const debouncedAnalysisRef = useRef<(value: string) => void>(null)
  
  if (!debouncedAnalysisRef.current) {
    debouncedAnalysisRef.current = debounce((value: string) => {
      if (value.length > 10 && isHydratedRef.current) {
        callbacksRef.current.onTextChange(value)
      }
    }, 800)
  }
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value

    // REMOVIDO: Estado do botão imediato que causa re-render
    // callbacksRef.current.onButtonStateChange(value.trim().length > 0)

    // ANÁLISE COMPLETAMENTE DESABILITADA para evitar re-renders
    // if (isHydratedRef.current && value.length > 10) {
    //   debouncedAnalysisRef.current?.(value)
    // }
  }, [])

  // Marca como hidratado após mount
  useEffect(() => {
    // Marca hydration completa - sem state change
    isHydratedRef.current = true
    
    if (textareaRef.current) {
      // Focus após hidration estar completa
      const timer = setTimeout(() => {
        textareaRef.current?.focus()
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [])

  return (
    <textarea
      ref={textareaRef}
      onChange={handleChange}
      placeholder={placeholder}
      className="w-full h-48 bg-white/5 border border-white/20 rounded-xl p-6 text-white placeholder:text-purple-300 text-lg resize-none focus:outline-none focus:border-purple-400"
      // SEM autoFocus para evitar hydration issues
      // SEM value prop = UNCONTROLLED = ZERO re-renders
    />
  )
}, () => true) // Nunca re-renderiza

// 🚨 DEBUG TEXTAREA - Para identificar re-renders
const DebugTextarea = memo(() => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const renderCount = useRef(0)

  renderCount.current++

  console.log('🚨 DEBUG: DebugTextarea renderizado', renderCount.current, 'vezes')

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log('🚨 DEBUG: onChange disparado:', e.target.value)
    // SEM setStates ou callbacks
  }, [])

  const handleFocus = useCallback(() => {
    console.log('🚨 DEBUG: onFocus disparado')
  }, [])

  const handleBlur = useCallback(() => {
    console.log('🚨 DEBUG: onBlur disparado')
  }, [])

  return (
    <textarea
      ref={textareaRef}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      placeholder="🚨 DEBUG: Digite aqui..."
      className="w-full h-48 bg-red-900/20 border-2 border-red-500 rounded-xl p-6 text-white placeholder:text-red-300 text-lg resize-none focus:outline-none focus:border-red-400"
      suppressHydrationWarning
    />
  )
}, () => {
  console.log('🚨 DEBUG: memo comparison - NUNCA deveria re-renderizar')
  return true // NUNCA re-renderiza
})

// 🧬 HYBRID SCIENTIFIC CLASSIFICATION SYSTEM
// Combines traditional questions + interactive assessments + behavioral metrics
const classifyPersonaHybrid = (responses: QuestionResponse[]): PersonaClassificationResult => {
  const personaScores: Record<string, number> = {}
  const confidenceFactors: number[] = []
  const behavioralMetrics: any = {}

  // Initialize all 26 personas with base scores
  const personas = [
    'analitico', 'criativo', 'estrategico', 'executor', 'inovador', 'lider',
    'comunicador', 'colaborativo', 'resiliente', 'adaptavel', 'visionario', 'pragmatico',
    'empatico', 'competitivo', 'detalhista', 'intuitivo', 'metodico', 'inspirador',
    'negociador', 'investigador', 'mentor', 'aventureiro', 'tradicionalista', 'transformador',
    'harmonizador', 'disruptor'
  ]

  personas.forEach(persona => {
    personaScores[persona] = 0
  })

  responses.forEach(response => {
    const interactive = response.interactiveMetrics

    if (!interactive) return

    switch (interactive.questionType) {
      case 'dual_range_slider':
        if (interactive.sliderValues && interactive.confidence) {
          const [min, max] = interactive.sliderValues
          const variability = Math.abs(max - min)
          const position = (min + max) / 2

          // Score based on slider position and confidence
          if (position < 30) {
            personaScores.analitico += (interactive.confidence / 100) * 2
            personaScores.metodico += (interactive.confidence / 100) * 1.5
          } else if (position > 70) {
            personaScores.criativo += (interactive.confidence / 100) * 2
            personaScores.inovador += (interactive.confidence / 100) * 1.5
          }

          // High variability suggests adaptability
          if (variability > 40) {
            personaScores.adaptavel += (interactive.confidence / 100) * 1.5
          }

          confidenceFactors.push(interactive.confidence / 100)
        }
        break

      case 'visual_analog_scale':
        if (interactive.analogValue && interactive.confidence) {
          const position = interactive.analogValue

          // Extreme positions suggest strong preferences
          if (position < 20 || position > 80) {
            personaScores.competitivo += (interactive.confidence / 100) * 1.5
            personaScores.resiliente += (interactive.confidence / 100) * 1.2
          }

          // Middle positions suggest harmony-seeking
          if (position > 40 && position < 60) {
            personaScores.harmonizador += (interactive.confidence / 100) * 1.5
            personaScores.colaborativo += (interactive.confidence / 100) * 1.2
          }

          confidenceFactors.push(interactive.confidence / 100)
        }
        break

      case 'situational_judgment':
        if (interactive.priorityRanking) {
          const ranking = interactive.priorityRanking

          // First choice indicates primary decision-making style
          const firstChoice = ranking[0]
          if (firstChoice) {
            // Mock scoring based on choice patterns
            if (firstChoice.includes('analis') || firstChoice.includes('dados')) {
              personaScores.analitico += 2
              personaScores.investigador += 1.5
            }
            if (firstChoice.includes('equipe') || firstChoice.includes('colabor')) {
              personaScores.colaborativo += 2
              personaScores.lider += 1.5
            }
            if (firstChoice.includes('inova') || firstChoice.includes('novo')) {
              personaScores.inovador += 2
              personaScores.visionario += 1.5
            }
          }

          // Last choice indicates what they avoid/de-prioritize
          const lastChoice = ranking[ranking.length - 1]
          if (lastChoice) {
            // Inverse scoring for avoided behaviors
            if (lastChoice.includes('risk') || lastChoice.includes('incert')) {
              personaScores.tradicionalista += 1.5
              personaScores.metodico += 1.2
            }
          }

          confidenceFactors.push(0.8) // Assume moderate confidence for behavioral choices
        }
        break

      case 'reaction_time':
        if (interactive.reactionResults) {
          const avgReactionTime = interactive.reactionResults.reduce((sum, r) => sum + r.reactionTimeMs, 0) / interactive.reactionResults.length
          const accuracy = interactive.reactionResults.filter(r => r.accuracy).length / interactive.reactionResults.length

          // Fast reactions suggest intuitive processing
          if (avgReactionTime < 800) {
            personaScores.intuitivo += 2
            personaScores.executor += 1.5
          }

          // Slow, accurate reactions suggest analytical processing
          if (avgReactionTime > 1200 && accuracy > 0.8) {
            personaScores.analitico += 2
            personaScores.detalhista += 1.5
          }

          // Store behavioral metrics
          behavioralMetrics.avgReactionTime = avgReactionTime
          behavioralMetrics.accuracy = accuracy

          confidenceFactors.push(accuracy) // Use accuracy as confidence proxy
        }
        break

      case 'multiple_choice':
      case 'open_ended':
      default:
        // Traditional scoring based on answer content
        const answer = response.answer?.toLowerCase() || ''

        // Simple keyword-based scoring (could be enhanced with NLP)
        if (answer.includes('analis') || answer.includes('dados')) {
          personaScores.analitico += 1
        }
        if (answer.includes('criativ') || answer.includes('inovad')) {
          personaScores.criativo += 1
        }
        if (answer.includes('equipe') || answer.includes('colabor')) {
          personaScores.colaborativo += 1
        }

        confidenceFactors.push(0.6) // Lower confidence for text-based analysis
        break
    }
  })

  // Calculate overall confidence
  const overallConfidence = Math.round(
    (confidenceFactors.reduce((sum, c) => sum + c, 0) / confidenceFactors.length) * 100
  )

  // Find top persona
  const sortedPersonas = Object.entries(personaScores)
    .sort(([,a], [,b]) => b - a)
    .filter(([,score]) => score > 0)

  const topPersona = sortedPersonas[0]
  const secondPersona = sortedPersonas[1]

  if (!topPersona) {
    // Fallback if no clear scoring
    return {
      personaDisplayName: 'Explorador',
      confidence: 65,
      description: 'Uma persona única em desenvolvimento, com características ainda sendo reveladas através da experiência.',
      rarityLevel: 'rare',
      populationPercentage: 8.3,
      businessImpact: 'Potencial inexplorado com versatilidade adaptativa.',
      transformationPotential: 'Alto potencial para desenvolvimento em múltiplas direções.'
    }
  }

  // Determine rarity based on score distribution and confidence
  const scoreSpread = topPersona[1] - (secondPersona?.[1] || 0)
  let rarityLevel: 'common' | 'rare' | 'very_rare' | 'extremely_rare' = 'common'
  let populationPercentage = 15

  if (scoreSpread > 3 && overallConfidence > 85) {
    rarityLevel = 'extremely_rare'
    populationPercentage = 1.2
  } else if (scoreSpread > 2 && overallConfidence > 75) {
    rarityLevel = 'very_rare'
    populationPercentage = 3.8
  } else if (scoreSpread > 1 && overallConfidence > 65) {
    rarityLevel = 'rare'
    populationPercentage = 8.3
  }

  // Enhanced persona descriptions based on hybrid assessment
  const personaDescriptions: Record<string, any> = {
    analitico: {
      name: 'Analítico Científico',
      description: 'Combina processamento metódico com insights profundos. Suas análises são precisas e baseadas em dados, mas também revelam padrões que outros não conseguem ver.',
      businessImpact: 'Transforma dados complexos em estratégias acionáveis. Reduz riscos através de análise precisa.',
      transformationPotential: 'Potencial para se tornar Chief Data Officer ou Head of Analytics.'
    },
    criativo: {
      name: 'Inovador Criativo',
      description: 'Sua criatividade não é apenas artística, mas estratégica. Combina imaginação com execução prática.',
      businessImpact: 'Gera soluções únicas para problemas complexos. Impulsiona diferenciação no mercado.',
      transformationPotential: 'Potencial para liderar inovação de produtos ou design thinking organizacional.'
    },
    colaborativo: {
      name: 'Orquestrador Social',
      description: 'Não apenas trabalha bem em equipe, mas orquestra sinergia entre pessoas diferentes.',
      businessImpact: 'Aumenta produtividade de equipes em 40%. Reduz conflitos interpessoais.',
      transformationPotential: 'Potencial para HR Business Partner ou Team Leadership roles.'
    }
    // Add more enhanced descriptions as needed
  }

  const personaInfo = personaDescriptions[topPersona[0]] || {
    name: topPersona[0]?.charAt(0).toUpperCase() + topPersona[0]?.slice(1) || 'Explorador',
    description: 'Uma persona única com características distintivas reveladas pela análise híbrida.',
    businessImpact: 'Impacto significativo através de suas características únicas.',
    transformationPotential: 'Alto potencial para desenvolvimento e liderança.'
  }

  return {
    personaDisplayName: personaInfo.name,
    confidence: overallConfidence,
    description: personaInfo.description,
    rarityLevel,
    populationPercentage,
    businessImpact: personaInfo.businessImpact,
    transformationPotential: personaInfo.transformationPotential,
    // Additional metadata for enhanced system
    personaComposition: secondPersona ? 'hybrid' : 'pure',
    behavioralMetrics
  }
}

// Função debounce simples
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Componente isolado para análise - usa deferred value
interface LiveAnalysisDisplayProps {
  analysis: any
}

const LiveAnalysisDisplay = memo<LiveAnalysisDisplayProps>(({ analysis }) => {
  if (!analysis) return null
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-purple-800/50 rounded-lg p-4 text-sm"
    >
      <p className="text-purple-200 mb-2">Análise em tempo real:</p>
      <div className="grid grid-cols-3 gap-4 text-white">
        <div>Padrão: <span className="font-semibold">{analysis.type}</span></div>
        <div>Confiança: <span className="font-semibold">{analysis.confidence}%</span></div>
        <div>Indicadores: <span className="font-semibold">{analysis.indicators.length}</span></div>
      </div>
    </motion.div>
  )
})

// Interface for StableTextarea props
interface StableTextareaProps {
  placeholder?: string
  textareaRef: React.RefObject<HTMLTextAreaElement | null>
  onTextChange: (value: string) => void
  onButtonStateChange: (enabled: boolean) => void
  questionId: number
}

// Textarea estável que mantém valor durante hydration
const StableTextarea = memo<StableTextareaProps>(({ 
  placeholder, 
  textareaRef,
  onTextChange,
  onButtonStateChange,
  questionId
}) => {
  const isHydratedRef = useRef(false)
  const callbacksRef = useRef({ onTextChange, onButtonStateChange })
  const lastQuestionRef = useRef(questionId)
  
  // Atualiza refs sem causar re-render
  callbacksRef.current = { onTextChange, onButtonStateChange }
  
  // Limpa textarea quando muda de questão (SEM textareaRef como dependência)
  useEffect(() => {
    if (lastQuestionRef.current !== questionId && textareaRef.current) {
      textareaRef.current.value = ''
      lastQuestionRef.current = questionId
    }
  }, [questionId])
  
  // Função debounced estável - criada uma única vez
  const debouncedAnalysisRef = useRef<(value: string) => void>(null)
  
  if (!debouncedAnalysisRef.current) {
    debouncedAnalysisRef.current = debounce((value: string) => {
      if (value.length > 10 && isHydratedRef.current) {
        callbacksRef.current.onTextChange(value)
      }
    }, 800)
  }
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value

    // REMOVIDO: Estado do botão imediato que causa re-render
    // callbacksRef.current.onButtonStateChange(value.trim().length > 0)

    // ANÁLISE COMPLETAMENTE DESABILITADA para evitar re-renders
    // if (isHydratedRef.current && value.length > 10) {
    //   debouncedAnalysisRef.current?.(value)
    // }
  }, [])

  // Marca como hidratado após mount
  useEffect(() => {
    // Marca hydration completa - sem state change
    isHydratedRef.current = true
    
    if (textareaRef.current) {
      // Focus após hidration estar completa
      const timer = setTimeout(() => {
        textareaRef.current?.focus()
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [])

  return (
    <textarea
      ref={textareaRef}
      onChange={handleChange}
      placeholder={placeholder}
      className="w-full h-48 bg-white/5 border border-white/20 rounded-xl p-6 text-white placeholder:text-purple-300 text-lg resize-none focus:outline-none focus:border-purple-400"
      suppressHydrationWarning
      // SEM autoFocus para evitar hydration issues
      // SEM value prop = UNCONTROLLED = ZERO re-renders
    />
  )
}, () => true) // Nunca re-renderiza

// Componente isolado para questão - SEM ANIMAÇÕES para evitar hydration
interface QuestionComponentProps {
  question: PersonaQuestion
  liveAnalysis: any
  onNext: () => void
  textareaRef: React.RefObject<HTMLTextAreaElement | null>
  onTextChange: (value: string) => void
  onButtonStateChange: (enabled: boolean) => void
  buttonEnabled: boolean
  isClientReady: boolean
}

const QuestionComponent = memo<QuestionComponentProps>(({ 
  question, 
  liveAnalysis, 
  onNext,
  textareaRef,
  onTextChange,
  onButtonStateChange,
  buttonEnabled,
  isClientReady
}) => {
  // Defer análise para não bloquear digitação
  const deferredAnalysis = useDeferredValue(liveAnalysis)
  
  // Callbacks estáveis para evitar re-renders no textarea
  const stableOnTextChange = useCallback((value: string) => {
    onTextChange(value)
  }, [onTextChange])
  
  const stableOnButtonStateChange = useCallback((enabled: boolean) => {
    onButtonStateChange(enabled)
  }, [onButtonStateChange])

  // Loading placeholder enquanto não está pronto
  if (!isClientReady) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
        <div className="animate-pulse">
          <div className="h-8 bg-white/20 rounded mb-4"></div>
          <div className="h-4 bg-white/10 rounded mb-8"></div>
          <div className="h-48 bg-white/5 rounded-xl mb-4"></div>
        </div>
      </div>
    )
  }
  
  return (
    <div
      className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl"
      suppressHydrationWarning
    >
      <h2 className="text-3xl font-bold text-white mb-4 font-serif">
        {question.question}
      </h2>
      
      {question.subText && (
        <p className="text-purple-200 mb-8 text-lg">
          {question.subText}
        </p>
      )}

      {question.isOpenEnded ? (
        <div className="space-y-4">
<UltraSimpleTextarea />
          
          {/* Live Analysis - usa deferred value */}
{createElement(LiveAnalysisDisplay as React.ComponentType<LiveAnalysisDisplayProps>, {
            analysis: deferredAnalysis
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {question.options.map((option, index) => (
            <button
              key={option.letter}
              onClick={() => {
                onTextChange(option.letter)
                onButtonStateChange(true)
              }}
              className="text-left p-6 rounded-xl border-2 transition-all duration-300 border-white/20 bg-white/5 text-purple-200 hover:border-purple-500 hover:bg-purple-600/20 hover:scale-[1.02]"
            >
              <span className="font-bold text-purple-400 mr-4">{option.letter})</span>
              {option.text}
            </button>
          ))}
        </div>
      )}

      {/* Next Button */}
      <div className="flex justify-center mt-8">
        <button
          onClick={onNext}
          disabled={false}
          className="px-12 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-bold text-white transition-all duration-300 hover:scale-105 active:scale-95 opacity-100"
        >
          {question.id >= 1 ? 'Revelar Minha Persona' : 'Próxima Dimensão'}
        </button>
      </div>
    </div>
  )
}, (prevProps, nextProps) => {
  // Só re-renderiza se mudanças realmente importantes (REMOVIDO buttonEnabled)
  return prevProps.liveAnalysis === nextProps.liveAnalysis &&
         prevProps.question.id === nextProps.question.id &&
         prevProps.isClientReady === nextProps.isClientReady
})

interface EpicPersonaDiscoveryProps {
  userName?: string
  questions?: PersonaQuestion[]
  onComplete?: (result: PersonaClassificationResult) => void
  analyzeSemanticPatterns?: (text: string) => any
  classifyPersona?: (responses: QuestionResponse[]) => PersonaClassificationResult
}

type DiscoveryPhase = 'landing' | 'questioning' | 'processing' | 'revelation'

// 🐠 MANDARIN FISH ENHANCED ANIMATION SYSTEM
// Advanced Framer Motion configurations with cinematic effects

// Physics-based spring configurations for different interaction types
const ANIMATION_SPRINGS = {
  gentle: { type: "spring", stiffness: 120, damping: 14, mass: 0.8 },
  bouncy: { type: "spring", stiffness: 200, damping: 12, mass: 0.6 },
  snappy: { type: "spring", stiffness: 400, damping: 20, mass: 0.4 },
  fluid: { type: "spring", stiffness: 60, damping: 15, mass: 1.2 },
  oceanic: { type: "spring", stiffness: 80, damping: 18, mass: 1.0 }
} as const

// Cinematic easing curves inspired by film motion
const EASING_CURVES = {
  entrance: [0.25, 0.46, 0.45, 0.94],
  exit: [0.55, 0.06, 0.68, 0.19],
  bounce: [0.68, -0.55, 0.265, 1.55],
  dramatic: [0.77, 0, 0.175, 1],
  silk: [0.23, 1, 0.320, 1],
  ocean: [0.4, 0.0, 0.2, 1]
} as const

// Morphing geometry patterns for UI elements
const MORPHING_VARIANTS = {
  card: {
    idle: { borderRadius: "8px", scale: 1 },
    hover: { borderRadius: "16px", scale: 1.02 },
    tap: { borderRadius: "4px", scale: 0.98 },
    selected: { borderRadius: "20px", scale: 1.05 }
  },
  button: {
    idle: {
      borderRadius: "0px",
      scale: 1,
      background: "linear-gradient(0deg, #000000, #000000)"
    },
    hover: {
      borderRadius: "2px",
      scale: 1.02,
      background: "linear-gradient(45deg, #000000, #1a1a1a)"
    },
    tap: {
      borderRadius: "0px",
      scale: 0.98,
      background: "linear-gradient(0deg, #333333, #000000)"
    }
  }
} as const

// Particle system configurations for loading states
const PARTICLE_CONFIGS = {
  processing: {
    count: 20,
    spread: 100,
    colors: ["#000000", "#333333", "#666666", "#999999"],
    sizes: [2, 4, 6],
    velocities: { min: 0.5, max: 2.0 }
  },
  celebration: {
    count: 30,
    spread: 200,
    colors: ["#FFD700", "#FFA500", "#FF6347", "#32CD32"],
    sizes: [4, 8, 12],
    velocities: { min: 1.0, max: 3.0 }
  }
} as const

// Advanced interaction gesture configurations
const GESTURE_CONFIGS = {
  swipe: {
    dragElastic: 0.2,
    dragMomentum: false,
    dragConstraints: { left: -200, right: 200, top: 0, bottom: 0 }
  },
  magnetic: {
    dragElastic: 0.1,
    dragMomentum: true,
    whileDrag: { scale: 1.1, rotate: 5 }
  }
} as const

// Cinematic transition orchestration
const SCENE_TRANSITIONS = {
  phaseChange: {
    duration: 1.2,
    ease: EASING_CURVES.dramatic,
    staggerChildren: 0.1
  },
  questionFlow: {
    duration: 0.8,
    ease: EASING_CURVES.silk,
    staggerChildren: 0.05
  },
  revelation: {
    duration: 2.0,
    ease: EASING_CURVES.ocean,
    staggerChildren: 0.2
  }
} as const

// Micro-interaction patterns for enhanced UX
const MICRO_INTERACTIONS = {
  buttonRipple: {
    scale: [1, 1.2, 1],
    opacity: [0.8, 0.3, 0],
    transition: { duration: 0.6, ease: EASING_CURVES.bounce }
  },
  cardFloat: {
    y: [0, -8, 0],
    transition: { duration: 3, ease: "easeInOut", repeat: Infinity }
  },
  textShimmer: {
    background: [
      "linear-gradient(90deg, #000 0%, #666 50%, #000 100%)",
      "linear-gradient(90deg, #000 0%, #000 50%, #666 100%)",
      "linear-gradient(90deg, #666 0%, #000 50%, #000 100%)"
    ],
    transition: { duration: 2, ease: "linear", repeat: Infinity }
  }
} as const

// Performance optimization configurations
const PERFORMANCE_CONFIGS = {
  layoutOptimization: {
    layout: true,
    layoutDependency: false,
    optimizeForMotion: false
  },
  renderOptimization: {
    willChange: "transform, opacity",
    transformTemplate: ({ x, y, rotate, scale }: any) =>
      `translate3d(${x}, ${y}, 0) rotate(${rotate}) scale(${scale})`
  }
} as const

// 🎭 CINEMATIC COMPONENT HELPERS
// Advanced components for immersive experience

// Particle System Component for dynamic backgrounds
const ParticleField = memo(({ config, trigger }: {
  config: typeof PARTICLE_CONFIGS.processing,
  trigger: boolean
}) => {
  const particles = useMemo(() =>
    Array.from({ length: config.count }, (_, i) => ({
      id: i,
      color: config.colors[i % config.colors.length],
      size: config.sizes[Math.floor(Math.random() * config.sizes.length)],
      x: Math.random() * config.spread,
      y: Math.random() * config.spread,
      velocity: config.velocities.min + Math.random() * (config.velocities.max - config.velocities.min)
    })), [config]
  )

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            left: `${particle.x}%`,
            top: `${particle.y}%`
          }}
          animate={trigger ? {
            y: [-20, -100, -200],
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.3]
          } : {}}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: EASING_CURVES.ocean
          }}
        />
      ))}
    </div>
  )
})

// Morphing Progress Indicator with fluid geometry
const FluidProgressIndicator = memo(({ progress, phase }: {
  progress: number,
  phase: DiscoveryPhase
}) => {
  const morphingPath = useMotionValue("M0,50 Q25,25 50,50 T100,50")
  const progressSpring = useSpring(progress, ANIMATION_SPRINGS.fluid)

  const animatedPath = useTransform(progressSpring, [0, 100], [
    "M0,50 Q25,50 50,50 T100,50",
    "M0,50 Q25,10 50,50 T100,50"
  ])

  return (
    <div className="w-full h-2 relative overflow-hidden">
      <svg
        className="w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <motion.path
          d={animatedPath}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-gray-300"
        />
        <motion.path
          d={animatedPath}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-black"
          pathLength={progressSpring}
          style={{
            pathLength: useTransform(progressSpring, [0, 100], [0, 1])
          }}
        />
      </svg>
    </div>
  )
})

// Interactive Question Card with physics-based animations
const EnhancedQuestionCard = memo(({
  children,
  isActive,
  onInteraction
}: {
  children: React.ReactNode
  isActive: boolean
  onInteraction?: () => void
}) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useTransform(mouseY, [-300, 300], [10, -10])
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10])

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    mouseX.set(event.clientX - centerX)
    mouseY.set(event.clientY - centerY)
  }, [mouseX, mouseY])

  return (
    <motion.div
      ref={cardRef}
      className="relative"
      style={{
        transformStyle: "preserve-3d",
        rotateX,
        rotateY
      }}
      variants={MORPHING_VARIANTS.card}
      animate={isActive ? "selected" : "idle"}
      whileHover="hover"
      whileTap="tap"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        mouseX.set(0)
        mouseY.set(0)
      }}
      onClick={onInteraction}
      transition={ANIMATION_SPRINGS.gentle}
    >
      {children}
    </motion.div>
  )
})

// Cinematic Text Reveal with staggered character animation
const CinematicTextReveal = memo(({
  text,
  trigger,
  staggerDelay = 0.03,
  className = ""
}: {
  text: string
  trigger: boolean
  staggerDelay?: number
  className?: string
}) => {
  const characters = useMemo(() => text.split(''), [text])

  return (
    <span className={className}>
      {characters.map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20, rotateX: -90 }}
          animate={trigger ? {
            opacity: 1,
            y: 0,
            rotateX: 0
          } : {}}
          transition={{
            duration: 0.6,
            delay: index * staggerDelay,
            ease: EASING_CURVES.bounce
          }}
          style={{ display: 'inline-block' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  )
})

// Magnetic Button with ripple effects
const MagneticButton = memo(({
  children,
  onClick,
  disabled = false,
  variant = "primary",
  className = ""
}: {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  variant?: "primary" | "secondary"
  className?: string
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [isPressed, setIsPressed] = useState(false)
  const [ripples, setRipples] = useState<Array<{ id: number, x: number, y: number }>>([])

  const handleClick = useCallback((event: React.MouseEvent) => {
    if (disabled) return

    const rect = buttonRef.current?.getBoundingClientRect()
    if (rect) {
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      setRipples(prev => [...prev, { id: Date.now(), x, y }])
      setTimeout(() => {
        setRipples(prev => prev.slice(1))
      }, 600)
    }

    onClick?.()
  }, [disabled, onClick])

  return (
    <motion.button
      ref={buttonRef}
      className={`relative overflow-hidden ${className}`}
      variants={MORPHING_VARIANTS.button}
      animate={disabled ? "idle" : "idle"}
      whileHover={disabled ? "idle" : "hover"}
      whileTap={disabled ? "idle" : "tap"}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onClick={handleClick}
      disabled={disabled}
      transition={ANIMATION_SPRINGS.snappy}
    >
      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <motion.div
          key={ripple.id}
          className="absolute rounded-full bg-white/20 pointer-events-none"
          style={{
            left: ripple.x - 20,
            top: ripple.y - 20,
            width: 40,
            height: 40
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6, ease: EASING_CURVES.silk }}
        />
      ))}

      {/* Button content */}
      <span className="relative z-10">
        {children}
      </span>
    </motion.button>
  )
})

// Mock data for UI package standalone usage - COM ELEMENTOS CIENTÍFICOS
const MOCK_QUESTIONS: PersonaQuestion[] = [
  {
    id: 0,
    type: 'open_ended',
    question: "Descreva sua abordagem ideal para resolver um problema complexo no trabalho ou vida pessoal. Como você prefere pensar, planejar e executar soluções?",
    subText: "Seja específico sobre seu processo mental, ferramentas que usa e como toma decisões.",
    placeholder: "Digite sua abordagem para resolução de problemas...",
    isOpenEnded: true,
    options: [],
    weight: 3
  },
  {
    id: 1,
    type: 'dual_range_slider',
    question: "Como você toma decisões sob pressão?",
    subText: "Use os sliders para indicar seu comportamento normal e em situações extremas.",
    sliderConfig: {
      leftLabel: "Impulsivo",
      rightLabel: "Analítico",
      isDualRange: true,
      personas: {
        "analitico": { min: 70, max: 100 },
        "inovador": { min: 30, max: 70 },
        "lider": { min: 40, max: 80 },
        "estrategista": { min: 60, max: 90 }
      }
    },
    options: [],
    weight: 3
  },
  {
    id: 2,
    type: 'visual_analog_scale',
    question: "Como você se comporta em situações de conflito?",
    subText: "Posicione-se nas escalas abaixo baseado no seu comportamento natural.",
    sliderConfig: {
      leftLabel: "Conciliador",
      rightLabel: "Confrontativo",
      isDualRange: false,
      personas: {
        "conciliador": { min: 0, max: 30 },
        "negociador": { min: 30, max: 70 },
        "lider": { min: 70, max: 100 }
      }
    },
    options: [],
    weight: 2
  },
  {
    id: 3,
    type: 'situational_judgment',
    question: "Situação de Liderança",
    subText: "Organize as ações por prioridade - arraste para reordenar.",
    scenario: {
      title: "Crise na Equipe",
      description: "Sua equipe perdeu um cliente importante. Há tensão, desmotivação e cobrança da diretoria. Como você priorizaria suas ações?",
      choices: [
        {
          id: "analysis",
          text: "Análise detalhada da causa raiz",
          personas: { "analitico": 8, "estrategista": 6, "lider": 4 }
        },
        {
          id: "team",
          text: "Reunião para alinhar emocionalmente a equipe",
          personas: { "conciliador": 9, "lider": 7, "coach": 8 }
        },
        {
          id: "action",
          text: "Ação comercial imediata para recuperar",
          personas: { "empreendedor": 9, "lider": 6, "realizador": 8 }
        },
        {
          id: "communication",
          text: "Comunicação transparente à diretoria",
          personas: { "comunicador": 8, "lider": 7, "estrategista": 5 }
        }
      ]
    },
    options: [],
    weight: 4
  },
  {
    id: 4,
    type: 'reaction_time',
    question: "Associação Rápida",
    subText: "Pressione ESPAÇO quando a palavra se conectar com sua personalidade. Seja espontâneo!",
    reactionConfig: {
      words: [
        { word: "LIDERANÇA", personas: { "lider": 5, "estrategista": 3 } },
        { word: "INOVAÇÃO", personas: { "inovador": 5, "criativo": 4 } },
        { word: "ANÁLISE", personas: { "analitico": 5, "estrategista": 3 } },
        { word: "AÇÃO", personas: { "realizador": 5, "empreendedor": 4 } },
        { word: "HARMONIA", personas: { "conciliador": 5, "diplomata": 4 } }
      ],
      timeoutMs: 3000
    },
    options: [],
    weight: 2
  }
]

const mockAnalyzeSemanticPatterns = (text: string) => ({
  type: 'ANALYTICAL',
  confidence: 75,
  indicators: ['logical', 'structured', 'methodical']
})

const mockClassifyPersona = (responses: QuestionResponse[]): PersonaClassificationResult => ({
  personaDisplayName: "O Estrategista Visionário",
  personaComposition: "ANEV",
  confidence: 87,
  rarityLevel: "rare",
  populationPercentage: 12,
  description: "Você é um líder natural que combina análise profunda com visão de futuro. Sua capacidade única de ver padrões e antecipar tendências faz de você um tomador de decisões excepcional.",
  businessImpact: "Líderes como você têm 3x mais probabilidade de criar produtos inovadores e construir equipes de alta performance.",
  transformationPotential: "Seu potencial de transformação está na capacidade de inspirar outros através de sua visão clara e estratégias bem estruturadas."
})

export function EpicPersonaDiscovery({ 
  userName = 'Navegador',
  questions = MOCK_QUESTIONS,
  onComplete,
  analyzeSemanticPatterns = mockAnalyzeSemanticPatterns,
  classifyPersona = mockClassifyPersona
}: EpicPersonaDiscoveryProps) {
  const [phase, setPhase] = useState<DiscoveryPhase>('landing')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<QuestionResponse[]>([])
  const [liveAnalysis, setLiveAnalysis] = useState<any>(null)
  const [finalResult, setFinalResult] = useState<PersonaClassificationResult | null>(null)
  const [buttonEnabled, setButtonEnabled] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [isClientReady, setIsClientReady] = useState(false)

  // Enhanced state for interactive assessments
  const [interactiveResponses, setInteractiveResponses] = useState<Record<number, {
    sliderValues?: [number, number]
    analogValue?: number
    confidence?: number
    priorityRanking?: string[]
    reactionResults?: Array<{ word: string, reactionTimeMs: number, accuracy: boolean }>
  }>>({})
  
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const textValueRef = useRef<string>('')

  // Marca quando client está pronto
  useEffect(() => {
    setIsClientReady(true)
  }, [])

  // 🎬 CINEMATIC TEXT REVEAL COMPONENT - Performance Optimized
  const CinematicTextReveal: React.FC<{
    text: string
    className?: string
    delay?: number
    staggerDelay?: number
  }> = memo(({ text, className = "", delay = 0, staggerDelay = 0.05 }) => {
    const config = UncleMcDuckPerformanceToolkit.hooks.usePerformanceOptimizedAnimation()
    const chars = text.split('')

    // Simplified version for reduced motion
    if (!config.enableAnimations) {
      return <span className={className}>{text}</span>
    }

    return (
      <LazyMotion features={domAnimation}>
        <motion.div
          className={className}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay * 0.5, duration: 0.3 }}
        >
          {chars.map((char, index) => (
            <motion.span
              key={index}
              className="inline-block"
              initial={{
                opacity: 0,
                y: config.complexity === 'high' ? 50 : 20,
                rotateX: config.complexity === 'high' ? 90 : 0,
                scale: config.complexity === 'high' ? 0.3 : 0.8,
                filter: config.complexity === 'high' ? "blur(10px)" : "blur(0px)"
              }}
              animate={{
                opacity: 1,
                y: 0,
                rotateX: 0,
                scale: 1,
                filter: "blur(0px)"
              }}
              transition={{
                delay: delay + (index * staggerDelay * 0.5),
                duration: config.duration,
                ...config.spring
              }}
              style={config.complexity === 'high' ? {
                transformStyle: 'preserve-3d',
                perspective: '1000px'
              } : undefined}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </motion.div>
      </LazyMotion>
    )
  })

  // 🧲 MAGNETIC FLOATING WORDS COMPONENT - Performance Optimized
  const FloatingWords: React.FC<{
    buttonRef: React.RefObject<HTMLButtonElement>
    isActive: boolean
  }> = memo(({ buttonRef, isActive }) => {
    const config = UncleMcDuckPerformanceToolkit.hooks.usePerformanceOptimizedAnimation()
    const words = [
      'autenticidade', 'personalidade', 'descoberta',
      'transformação', 'identidade', 'essência',
      'potencial', 'singularidade', 'propósito'
    ]

    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 })

    useEffect(() => {
      const updateButtonPosition = () => {
        if (buttonRef.current) {
          const rect = buttonRef.current.getBoundingClientRect()
          setButtonPosition({
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
          })
        }
      }

      const handleMouseMove = (e: MouseEvent) => {
        setMousePosition({ x: e.clientX, y: e.clientY })
      }

      updateButtonPosition()
      window.addEventListener('resize', updateButtonPosition)
      window.addEventListener('mousemove', handleMouseMove)

      return () => {
        window.removeEventListener('resize', updateButtonPosition)
        window.removeEventListener('mousemove', handleMouseMove)
      }
    }, [])

    // Don't render floating words if animations are disabled
    if (!config.enableAnimations || !isActive) {
      return null
    }

    return (
      <LazyMotion features={domAnimation}>
        {words.slice(0, config.complexity === 'high' ? 9 : 6).map((word, index) => {
          const angle = (360 / words.length) * index
          const radius = 200 + Math.sin(Date.now() * 0.001 + index) * 50
          const x = Math.cos((angle * Math.PI) / 180) * radius
          const y = Math.sin((angle * Math.PI) / 180) * radius

          // Calculate distance to button for magnetic effect
          const distanceToButton = Math.sqrt(
            Math.pow(mousePosition.x - buttonPosition.x, 2) +
            Math.pow(mousePosition.y - buttonPosition.y, 2)
          )
          const magneticForce = Math.max(0, (300 - distanceToButton) / 300)
          const isNearButton = distanceToButton < 150

          return (
            <motion.div
              key={word}
              className="absolute pointer-events-none select-none"
              initial={{
                x: buttonPosition.x + x,
                y: buttonPosition.y + y,
                opacity: 0,
                scale: 0
              }}
              animate={{
                x: isActive ? (
                  isNearButton ?
                    buttonPosition.x + (x * (1 - magneticForce)) :
                    buttonPosition.x + x + Math.sin(Date.now() * 0.002 + index) * 20
                ) : buttonPosition.x + x,
                y: isActive ? (
                  isNearButton ?
                    buttonPosition.y + (y * (1 - magneticForce)) :
                    buttonPosition.y + y + Math.cos(Date.now() * 0.002 + index) * 20
                ) : buttonPosition.y + y,
                opacity: isActive ? (isNearButton ? 0.3 : 0.6) : 0,
                scale: isActive ? (isNearButton ? 0.8 : 1) : 0,
                filter: isNearButton ? `blur(${magneticForce * 10}px)` : 'blur(0px)'
              }}
              transition={{
                type: config.spring?.type || "spring",
                damping: isNearButton ? 10 : (config.spring?.damping || 25),
                stiffness: isNearButton ? 200 : (config.spring?.stiffness || 80),
                mass: config.spring?.mass || 0.5
              }}
              style={{
                left: 0,
                top: 0,
                zIndex: 5
              }}
            >
              <span className="text-gray-400 text-sm font-light tracking-wide">
                {word}
              </span>
            </motion.div>
          )
        })}
      </LazyMotion>
    )
  })

  // Landing Phase Component - CINEMATIC TRANSFORMATION
  const LandingPhase = () => {
    const [wordsActive, setWordsActive] = useState(false)
    const buttonRef = useRef<HTMLButtonElement>(null)

    useEffect(() => {
      const timer = setTimeout(() => setWordsActive(true), 2000)
      return () => clearTimeout(timer)
    }, [])

    return (
      <div className="min-h-screen bg-white relative overflow-hidden">
        {/* Enhanced Background with Oceanic Flow */}
        <MandarinFishAnimationToolkit.effects.OceanicFlow />

        {/* Floating Words Layer */}
        <FloatingWords buttonRef={buttonRef} isActive={wordsActive} />

        {/* Typography Motion Graphics - Perfect Funnel Alignment */}
        <div className="relative z-10 h-screen flex flex-col items-center justify-center p-8 space-y-4">

          {/* LINHA 1 - CINEMATIC TODO MUNDO */}
          <MandarinFishAnimationToolkit.components.CreativeWrapper
            variant="oceanicEntrance"
            className="w-full max-w-7xl text-center mb-3"
            delay={0.1}
          >
            <CinematicTextReveal
              text="TODO MUNDO"
              className="text-5xl md:text-8xl lg:text-[9rem] font-light text-black leading-none tracking-tight"
              delay={0.2}
              staggerDelay={0.1}
            />
          </MandarinFishAnimationToolkit.components.CreativeWrapper>

          {/* LINHA 2 - CINEMATIC SE ACHA ESPECIAL */}
          <motion.div
            initial={{ opacity: 0, x: -100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{
              duration: 1.0,
              delay: 1.5,
              ease: "backOut",
              type: "spring",
              stiffness: 100
            }}
            className="w-full max-w-6xl text-center mb-3"
          >
            <CinematicTextReveal
              text="se acha especial"
              className="text-3xl md:text-6xl lg:text-7xl font-extralight text-gray-600 leading-tight tracking-wide"
              delay={1.8}
              staggerDelay={0.08}
            />
          </motion.div>

          {/* LINHA 3 - CINEMATIC MAS RECEITAS */}
          <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{
              duration: 0.9,
              delay: 3.0,
              ease: "easeOut",
              type: "spring",
              stiffness: 110
            }}
            className="w-full max-w-5xl text-center mb-3"
          >
            <motion.div
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
            >
              <CinematicTextReveal
                text="Mas receitas de bolo não funcionam"
                className="text-2xl md:text-4xl lg:text-5xl font-medium text-gray-800 leading-tight tracking-normal"
                delay={3.2}
                staggerDelay={0.05}
              />
            </motion.div>
          </motion.div>

          {/* LINHA 4 - CINEMATIC SEU CÉREBRO */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.8,
              delay: 4.5,
              ease: "easeOut",
              type: "spring",
              stiffness: 120
            }}
            className="w-full max-w-4xl text-center mb-3"
          >
            <motion.div
              className="bg-black text-white px-8 py-4 inline-block"
              initial={{ scale: 0.8, rotateY: 180 }}
              animate={{
                scale: 1,
                rotateY: 0,
                opacity: [0.95, 1, 0.95]
              }}
              transition={{
                scale: { delay: 4.5, duration: 0.6 },
                rotateY: { delay: 4.5, duration: 0.6 },
                opacity: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <CinematicTextReveal
                text="Seu cérebro é diferente"
                className="text-lg md:text-2xl lg:text-3xl font-normal tracking-wide"
                delay={4.8}
                staggerDelay={0.04}
              />
            </motion.div>
          </motion.div>

          {/* LINHA 5 - CINEMATIC ENTRE 26 PERSONAS */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.7,
              delay: 5.5,
              ease: "backOut",
              type: "spring",
              stiffness: 150
            }}
            className="w-full max-w-3xl text-center mb-3"
          >
            <motion.div
              animate={{
                y: [0, -2, 0],
                opacity: [0.9, 1, 0.9]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <span className="text-base md:text-xl lg:text-2xl font-light text-gray-700">
                <CinematicTextReveal
                  text="Entre "
                  className="inline"
                  delay={5.8}
                  staggerDelay={0.06}
                />
                <CinematicTextReveal
                  text="26 personas científicas"
                  className="inline font-semibold text-black"
                  delay={6.1}
                  staggerDelay={0.04}
                />
              </span>
            </motion.div>
          </motion.div>

          {/* LINHA 6 - CINEMATIC UMA É EXATAMENTE SUA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.6,
              delay: 6.2,
              ease: "easeOut",
              type: "spring"
            }}
            className="w-full max-w-2xl text-center mb-4"
          >
            <motion.div
              className="bg-gray-50 px-6 py-3 inline-block border border-gray-200"
              initial={{ rotateX: 45, filter: "blur(5px)" }}
              animate={{ rotateX: 0, filter: "blur(0px)" }}
              transition={{ delay: 6.2, duration: 0.8 }}
              whileHover={{
                scale: 1.02,
                backgroundColor: "#ffffff",
                transition: { duration: 0.2 }
              }}
            >
              <span className="text-sm md:text-lg lg:text-xl font-normal text-gray-800">
                <CinematicTextReveal
                  text="uma é "
                  className="inline font-light"
                  delay={6.5}
                  staggerDelay={0.08}
                />
                <CinematicTextReveal
                  text="exatamente sua"
                  className="inline font-bold"
                  delay={6.9}
                  staggerDelay={0.06}
                />
              </span>
            </motion.div>
          </motion.div>

          {/* LINHA 7 - CINEMATIC MÉTRICAS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 6.8,
              ease: "easeOut",
              type: "spring"
            }}
            className="w-full max-w-xl text-center mb-8"
          >
            <motion.div
              className="bg-black text-white px-6 py-2 inline-block"
              initial={{ scaleX: 0, filter: "blur(10px)" }}
              animate={{
                scaleX: 1,
                filter: "blur(0px)",
                scale: [1, 1.01, 1]
              }}
              transition={{
                scaleX: { delay: 6.8, duration: 0.8 },
                filter: { delay: 6.8, duration: 0.8 },
                scale: {
                  delay: 7.5,
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
            >
              <span className="text-xs md:text-sm font-light tracking-wider">
                <CinematicTextReveal
                  text="8 minutos • 94% precisão • 26 perfis"
                  className="inline text-white"
                  delay={7.2}
                  staggerDelay={0.02}
                />
              </span>
            </motion.div>
          </motion.div>

          {/* BOTÃO CENTRAL - MAGNETIC CINEMA BUTTON */}
          <MandarinFishAnimationToolkit.components.CreativeWrapper
            variant="confidenceGrow"
            className="z-20 w-full max-w-lg text-center"
            delay={7.0}
          >
            <motion.button
              ref={buttonRef}
              onClick={() => setPhase('questioning')}
              className="relative bg-black text-white px-16 py-6 text-base md:text-lg font-normal tracking-wide overflow-hidden cursor-pointer border-none"
              initial={{
                scale: 0,
                rotateY: 180,
                filter: "blur(20px)"
              }}
              animate={{
                scale: 1,
                rotateY: 0,
                filter: "blur(0px)"
              }}
              transition={{
                delay: 7.0,
                duration: 1.2,
                type: "spring",
                damping: 20,
                stiffness: 100
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                y: -5
              }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Magnetic field visual effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-radial from-transparent via-white/5 to-transparent"
                animate={{
                  opacity: wordsActive ? [0, 0.3, 0] : 0,
                  scale: wordsActive ? [1, 1.5, 1] : 1
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              <CinematicTextReveal
                text="DESCUBRA SUA PERSONA"
                className="relative z-10"
                delay={7.5}
                staggerDelay={0.03}
              />
            </motion.button>
          </MandarinFishAnimationToolkit.components.CreativeWrapper>

          {/* LINHA FINAL - CINEMATIC ANCORAGEM */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 8.5,
              ease: "easeOut"
            }}
            className="mt-8 w-full max-w-md text-center"
          >
            <motion.div
              className="bg-gray-100 px-8 py-3 inline-block"
              initial={{ scale: 0.8, opacity: 0, rotateY: 90 }}
              animate={{
                scale: 1,
                opacity: [0.9, 1, 0.9],
                rotateY: 0
              }}
              transition={{
                scale: { delay: 8.5, duration: 0.6 },
                rotateY: { delay: 8.5, duration: 0.6 },
                opacity: {
                  delay: 9.0,
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
            >
              <span className="text-xs md:text-sm text-gray-700 text-center font-light tracking-wide">
                <CinematicTextReveal
                  text="Gratuito • Sem cadastro • Resultado imediato"
                  className="inline"
                  delay={8.8}
                  staggerDelay={0.03}
                />
              </span>
            </motion.div>
          </motion.div>

        </div>
      </div>
    )
  }

  // Função simplificada - sem medição de tempo
  const captureBasicMetrics = useCallback((): TypingMetrics | undefined => {
    const question = questions[currentQuestion]
    if (!question?.isOpenEnded) return undefined

    const characterCount = textareaRef.current?.value.length || 0

    return {
      startTime: 0,
      endTime: 0,
      totalTime: 0,
      characterCount,
      averageTypingSpeed: 0,
      pauseCount: 0,
      backspaceCount: 0,
      hesitationCount: 0,
      corrections: []
    }
  }, [currentQuestion, questions])

  // Handler simplificado - sem medição de tempo
  const handleTextChange = useCallback((value: string) => {
    // Apenas armazena o valor atual em ref para evitar re-renders
    textValueRef.current = value

    const question = questions[currentQuestion]

    // Análise semântica em tempo real para perguntas abertas - sem timing
    if (question?.isOpenEnded && value.length > 10) {
      clearTimeout((window as any).analysisTimer)
      ;(window as any).analysisTimer = setTimeout(() => {
        startTransition(() => {
          try {
            const analysis = analyzeSemanticPatterns(value)
            setLiveAnalysis(analysis)
          } catch (error) {
            console.warn('Análise semântica falhou:', error)
          }
        })
      }, 800)
    }
  }, [currentQuestion, questions, analyzeSemanticPatterns])

  const handleNext = useCallback(() => {
    const question = questions[currentQuestion]
    // Pega valor diretamente do textarea (uncontrolled)
    const currentValue = textareaRef.current?.value || textValueRef.current
    const metrics = captureBasicMetrics()

    const interactiveData = interactiveResponses[question.id]

    const response: QuestionResponse = {
      questionId: question.id,
      answer: currentValue,
      semanticAnalysis: question.isOpenEnded ? liveAnalysis : undefined,
      typingMetrics: metrics,
      timestamp: Date.now(),
      // Enhanced with interactive assessment data
      interactiveMetrics: {
        sliderValues: interactiveData?.sliderValues,
        analogValue: interactiveData?.analogValue,
        confidence: interactiveData?.confidence,
        priorityRanking: interactiveData?.priorityRanking,
        reactionResults: interactiveData?.reactionResults,
        questionType: question.type || 'multiple_choice'
      }
    }

    // Use transition para mudanças de estado que podem ser custosas
    startTransition(() => {
      setResponses(prev => [...prev, response])
      setLiveAnalysis(null)
      setButtonEnabled(false)
      textValueRef.current = ''

      // Limpa o textarea (uncontrolled)
      if (textareaRef.current) {
        textareaRef.current.value = ''
      }

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1)
      } else {
        setPhase('processing')
      }
    })
  }, [currentQuestion, liveAnalysis, captureBasicMetrics, questions, interactiveResponses])

  // Question Phase Component - Minimalista Line-Art Style
  const QuestionPhase = () => {
    const question = questions[currentQuestion]
    if (!question) return null

    // Debug to understand the issue
    const detectedType = question.type ||
      (question.isOpenEnded || question.placeholder ? 'open_ended' :
       question.sliderConfig ? 'dual_range_slider' :
       question.scenario ? 'situational_judgment' :
       question.reactionConfig ? 'reaction_time' :
       question.options && question.options.length > 0 ? 'multiple_choice' : 'open_ended');

    console.log('Current Question:', {
      id: question.id,
      originalType: question.type,
      detectedType: detectedType,
      isOpenEnded: question.isOpenEnded,
      hasOptions: question.options?.length || 0,
      question: question.question.substring(0, 50) + '...'
    })

    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-8 relative overflow-hidden" suppressHydrationWarning>
        {/* Enhanced Background with Oceanic Flow */}
        <MandarinFishAnimationToolkit.effects.OceanicFlow />

        {/* Background minimalista com linhas geométricas sutis */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          {/* Grid de pontos minimalista */}
          {[...Array(10)].map((_, i) => (
            [...Array(6)].map((_, j) => (
              <div
                key={`dot-${i}-${j}`}
                className="absolute w-1 h-1 bg-gray-400 rounded-full"
                style={{
                  left: `${(i + 1) * 10}%`,
                  top: `${(j + 1) * 16.66}%`,
                }}
              />
            ))
          )).flat()}
        </div>

        <div className="max-w-3xl w-full relative z-10">
          {/* Progress minimalista - mais compacto */}
          <div className="text-center mb-8">
            <div className="relative max-w-xs mx-auto">
              {/* Borda artística para o progresso - menor */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 300 40"
                fill="none"
                preserveAspectRatio="none"
              >
                <rect
                  x="8" y="8" width="284" height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-gray-300"
                />
                {/* Corner details - menores */}
                <g className="text-gray-400">
                  <line x1="8" y1="16" x2="8" y2="8" stroke="currentColor" strokeWidth="1"/>
                  <line x1="8" y1="8" x2="16" y2="8" stroke="currentColor" strokeWidth="1"/>
                  <line x1="284" y1="8" x2="292" y2="8" stroke="currentColor" strokeWidth="1"/>
                  <line x1="292" y1="8" x2="292" y2="16" stroke="currentColor" strokeWidth="1"/>
                  <line x1="292" y1="24" x2="292" y2="32" stroke="currentColor" strokeWidth="1"/>
                  <line x1="292" y1="32" x2="284" y2="32" stroke="currentColor" strokeWidth="1"/>
                  <line x1="16" y1="32" x2="8" y2="32" stroke="currentColor" strokeWidth="1"/>
                  <line x1="8" y1="32" x2="8" y2="24" stroke="currentColor" strokeWidth="1"/>
                </g>
              </svg>

              <div className="relative z-10 p-3">
                <p className="text-gray-600 text-xs mb-2 font-light tracking-[0.1em] uppercase">
                  QUESTÃO {currentQuestion + 1} DE {questions.length}
                </p>
                <div className="w-full bg-gray-200 h-px">
                  <div
                    className="bg-gray-700 h-px transition-all duration-500"
                    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Question Component Container - Mais elegante */}
          <div className="relative">
            {/* Frame artístico mais sutil */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 600 500"
              fill="none"
              preserveAspectRatio="none"
            >
              <rect
                x="15" y="15" width="570" height="470"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-gray-300"
              />
              {/* Corner accents mais sutis */}
              <g className="text-gray-400">
                <line x1="15" y1="25" x2="15" y2="15" stroke="currentColor" strokeWidth="1"/>
                <line x1="15" y1="15" x2="25" y2="15" stroke="currentColor" strokeWidth="1"/>
                <line x1="575" y1="15" x2="585" y2="15" stroke="currentColor" strokeWidth="1"/>
                <line x1="585" y1="15" x2="585" y2="25" stroke="currentColor" strokeWidth="1"/>
                <line x1="585" y1="475" x2="585" y2="485" stroke="currentColor" strokeWidth="1"/>
                <line x1="585" y1="485" x2="575" y2="485" stroke="currentColor" strokeWidth="1"/>
                <line x1="25" y1="485" x2="15" y2="485" stroke="currentColor" strokeWidth="1"/>
                <line x1="15" y1="485" x2="15" y2="475" stroke="currentColor" strokeWidth="1"/>
              </g>
            </svg>

            <div className="relative z-10 p-6">
              {/* Question Component com styling mais refinado */}
              <div className="bg-white border border-gray-300 rounded-none p-8 shadow-sm">
                <h2 className="text-xl md:text-2xl font-light text-gray-900 mb-6 font-serif tracking-wide">
                  {question.question}
                </h2>

                {question.subText && (
                  <p className="text-gray-600 mb-8 text-sm font-light leading-relaxed">
                    {question.subText}
                  </p>
                )}

                {/* Render Different Question Types */}
                {(() => {
                  // Auto-detect question type based on properties
                  const questionType = question.type ||
                    (question.isOpenEnded || question.placeholder ? 'open_ended' :
                     question.sliderConfig ? 'dual_range_slider' :
                     question.scenario ? 'situational_judgment' :
                     question.reactionConfig ? 'reaction_time' :
                     question.options && question.options.length > 0 ? 'multiple_choice' : 'open_ended');

                  switch (questionType) {
                    case 'dual_range_slider':
                      return (
                        <DualRangeSlider
                          leftLabel={question.sliderConfig?.leftLabel || ''}
                          rightLabel={question.sliderConfig?.rightLabel || ''}
                          values={interactiveResponses[question.id]?.sliderValues || [25, 75]}
                          confidence={interactiveResponses[question.id]?.confidence || 50}
                          onChange={(values, confidence) => {
                            setInteractiveResponses(prev => ({
                              ...prev,
                              [question.id]: {
                                ...prev[question.id],
                                sliderValues: values,
                                confidence
                              }
                            }))
                            setButtonEnabled(true)
                          }}
                          personas={question.sliderConfig?.personas || {}}
                        />
                      )

                    case 'visual_analog_scale':
                      return (
                        <VisualAnalogScale
                          leftLabel={question.sliderConfig?.leftLabel || ''}
                          rightLabel={question.sliderConfig?.rightLabel || ''}
                          value={interactiveResponses[question.id]?.analogValue || 50}
                          confidence={interactiveResponses[question.id]?.confidence || 50}
                          onChange={(value, confidence) => {
                            setInteractiveResponses(prev => ({
                              ...prev,
                              [question.id]: {
                                ...prev[question.id],
                                analogValue: value,
                                confidence
                              }
                            }))
                            setButtonEnabled(true)
                          }}
                          personas={question.sliderConfig?.personas || {}}
                        />
                      )

                    case 'situational_judgment':
                      return question.scenario ? (
                        <SituationalJudgment
                          scenario={question.scenario}
                          onComplete={(ranking) => {
                            setInteractiveResponses(prev => ({
                              ...prev,
                              [question.id]: {
                                ...prev[question.id],
                                priorityRanking: ranking
                              }
                            }))
                            setButtonEnabled(true)
                          }}
                        />
                      ) : null

                    case 'reaction_time':
                      return question.reactionConfig ? (
                        <ReactionTime
                          words={question.reactionConfig.words}
                          timeoutMs={question.reactionConfig.timeoutMs}
                          onComplete={(results) => {
                            setInteractiveResponses(prev => ({
                              ...prev,
                              [question.id]: {
                                ...prev[question.id],
                                reactionResults: results
                              }
                            }))
                            setButtonEnabled(true)
                          }}
                        />
                      ) : null

                    case 'open_ended':
                      return (
                        <div className="space-y-6">
                          <textarea
                            ref={textareaRef}
                            onChange={(e) => {
                              const value = e.target.value
                              if (isClientReady) {
                                setButtonEnabled(value.trim().length > 0)
                                handleTextChange(value)
                              }
                            }}
                            placeholder={question.placeholder}
                            className="w-full h-32 bg-white border border-gray-300 p-4 text-gray-900 placeholder:text-gray-400 text-sm resize-none focus:outline-none focus:border-gray-500 font-light"
                            suppressHydrationWarning
                          />

                          {/* Live Analysis - mais compacto */}
                          {liveAnalysis && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-gray-50 border border-gray-200 p-4 text-xs"
                            >
                              <p className="text-gray-600 mb-3 font-light tracking-[0.1em] uppercase">ANÁLISE EM TEMPO REAL:</p>
                              <div className="grid grid-cols-3 gap-4 text-gray-800">
                                <div className="text-center">
                                  <div className="font-normal text-sm">{liveAnalysis.type}</div>
                                  <div className="text-xs text-gray-500 mt-1 tracking-wider">PADRÃO</div>
                                </div>
                                <div className="text-center">
                                  <div className="font-normal text-sm">{liveAnalysis.confidence}%</div>
                                  <div className="text-xs text-gray-500 mt-1 tracking-wider">CONFIANÇA</div>
                                </div>
                                <div className="text-center">
                                  <div className="font-normal text-sm">{liveAnalysis.indicators.length}</div>
                                  <div className="text-xs text-gray-500 mt-1 tracking-wider">INDICADORES</div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      )

                    case 'multiple_choice':
                      return (
                        <div className="grid grid-cols-1 gap-3">
                          {question.options?.map((option, index) => (
                            <button
                              key={option.letter}
                              onClick={() => {
                                handleTextChange(option.letter)
                                setButtonEnabled(true)
                              }}
                              className="text-left p-4 border border-gray-300 transition-all duration-300 bg-white text-gray-700 hover:border-gray-500 hover:bg-gray-50 font-light text-sm"
                            >
                              <span className="font-normal text-gray-900 mr-3">{option.letter})</span>
                              {option.text}
                            </button>
                          ))}
                        </div>
                      )

                    default:
                      // For any unrecognized type, show textarea if it has placeholder
                      if (question.placeholder || question.isOpenEnded) {
                        return (
                          <div className="space-y-6">
                            <textarea
                              ref={textareaRef}
                              onChange={() => {
                                // VAZIO PARA MANTER FOCO - problema dos SVGs resolvido
                              }}
                              placeholder={question.placeholder || "Digite sua resposta..."}
                              className="w-full h-48 bg-white/5 border border-white/20 rounded-xl p-6 text-white placeholder:text-purple-300 text-lg resize-none focus:outline-none focus:border-purple-400"
                              suppressHydrationWarning
                            />
                          </div>
                        )
                      }
                      return null
                  }
                })()}

                {/* Next Button - mais elegante */}
                <div className="flex justify-center mt-8">
                  <motion.button
                    onClick={handleNext}
                    disabled={!buttonEnabled}
                    className={`relative px-8 py-3 border border-gray-400 font-light tracking-[0.1em]
                             transition-all duration-300 bg-white overflow-hidden group text-xs uppercase ${
                      buttonEnabled
                        ? 'text-gray-700 hover:border-gray-600 hover:text-gray-900'
                        : 'text-gray-400 border-gray-300 cursor-not-allowed'
                    }`}
                    whileHover={buttonEnabled ? { scale: 1.01 } : {}}
                    whileTap={buttonEnabled ? { scale: 0.99 } : {}}
                  >
                    <span className="relative z-10">
                      {currentQuestion >= questions.length - 1 ? 'REVELAR PERSONA' : 'PRÓXIMA QUESTÃO'}
                    </span>
                    {buttonEnabled && (
                      <motion.div
                        className="absolute inset-0 bg-gray-50"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Processing Phase Component - Minimalista Line-Art Style
  const ProcessingPhase = () => {
    useEffect(() => {
      // Processamento usando transition para melhor UX
      const timer = setTimeout(() => {
        startTransition(() => {
          // Use the existing classifyPersona function which works with the current question format
          const result = classifyPersona(responses)
          setFinalResult(result)
          setPhase('revelation')
        })
      }, 3000)

      return () => clearTimeout(timer)
    }, [responses])

    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-8 relative overflow-hidden">
        {/* Background minimalista com padrões geométricos sutis */}
        <div className="absolute inset-0 overflow-hidden opacity-15">
          {/* Círculos concêntricos */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`circle-${i}`}
              className="absolute border border-gray-300 rounded-full"
              style={{
                width: `${(i + 1) * 80}px`,
                height: `${(i + 1) * 80}px`,
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.2,
              }}
            />
          ))}

          {/* Linhas radiais */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={`line-${i}`}
              className="absolute w-px h-32 bg-gray-300 origin-bottom"
              style={{
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -100%) rotate(${i * 30}deg)`,
              }}
              animate={{
                scaleY: [0.5, 1, 0.5],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.1,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center max-w-2xl mx-auto">
          {/* Container com moldura artística - mais compacta */}
          <div className="relative">
            {/* Frame SVG - menor */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 400 300"
              fill="none"
              preserveAspectRatio="none"
            >
              <rect
                x="20" y="20" width="360" height="260"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-gray-300"
              />
              {/* Corner details - mais sutis */}
              <g className="text-gray-400">
                <line x1="20" y1="30" x2="20" y2="20" stroke="currentColor" strokeWidth="1"/>
                <line x1="20" y1="20" x2="30" y2="20" stroke="currentColor" strokeWidth="1"/>
                <line x1="370" y1="20" x2="380" y2="20" stroke="currentColor" strokeWidth="1"/>
                <line x1="380" y1="20" x2="380" y2="30" stroke="currentColor" strokeWidth="1"/>
                <line x1="380" y1="270" x2="380" y2="280" stroke="currentColor" strokeWidth="1"/>
                <line x1="380" y1="280" x2="370" y2="280" stroke="currentColor" strokeWidth="1"/>
                <line x1="30" y1="280" x2="20" y2="280" stroke="currentColor" strokeWidth="1"/>
                <line x1="20" y1="280" x2="20" y2="270" stroke="currentColor" strokeWidth="1"/>
              </g>
            </svg>

            <div className="relative z-10 py-12 px-8">
              {/* Loading indicator minimalista - menor */}
              <motion.div
                className="w-8 h-8 mx-auto mb-8 relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  className="w-full h-full border border-gray-400"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                >
                  <div className="w-full h-full relative">
                    <div className="absolute top-0 left-1/2 w-px h-1 bg-gray-700 transform -translate-x-1/2" />
                  </div>
                </motion.div>
              </motion.div>

              {/* Título principal - mais compacto */}
              <motion.h2
                className="text-2xl md:text-3xl font-light text-gray-900 mb-6 tracking-[0.15em]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                PROCESSANDO
              </motion.h2>

              <div className="w-16 h-px bg-gray-400 mx-auto mb-8"></div>

              {/* Status steps minimalista - mais compactos */}
              <motion.div
                className="space-y-4 text-sm text-gray-600 font-light"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <motion.div
                  className="flex items-center justify-center space-x-3"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="w-1 h-1 border border-gray-400"></div>
                  <p className="tracking-wider">Análise de padrões comportamentais</p>
                </motion.div>

                <motion.div
                  className="flex items-center justify-center space-x-3"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
                >
                  <div className="w-1 h-1 border border-gray-400"></div>
                  <p className="tracking-wider">Processamento de análise semântica</p>
                </motion.div>

                <motion.div
                  className="flex items-center justify-center space-x-3"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1.4 }}
                >
                  <div className="w-1 h-1 border border-gray-400"></div>
                  <p className="tracking-wider">Cálculo de scores de confiança</p>
                </motion.div>

                <motion.div
                  className="flex items-center justify-center space-x-3"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 2.1 }}
                >
                  <div className="w-1 h-1 border border-gray-400"></div>
                  <p className="tracking-wider">Identificação da persona única</p>
                </motion.div>
              </motion.div>

              {/* Progress bar minimalista - mais elegante */}
              <motion.div
                className="mt-8 max-w-xs mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                <div className="w-full h-px bg-gray-300 relative">
                  <motion.div
                    className="h-px bg-gray-700 absolute left-0 top-0"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 3, ease: 'easeInOut' }}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Revelation Phase Component - Bento Grid Style com Identidade Minimalista
  const RevelationPhase = () => {
    if (!finalResult) return null

    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background minimalista com grid sutil */}
        <div className="absolute inset-0 overflow-hidden opacity-5">
          {/* Grid de linhas muito sutis para Bento style */}
          {[...Array(12)].map((_, i) => (
            <div
              key={`v-line-${i}`}
              className="absolute h-full w-px bg-gray-300"
              style={{ left: `${(i + 1) * 8.33}%` }}
            />
          ))}
          {[...Array(8)].map((_, i) => (
            <div
              key={`h-line-${i}`}
              className="absolute w-full h-px bg-gray-300"
              style={{ top: `${(i + 1) * 12.5}%` }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-6xl w-full">
          {/* Header compacto */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-8"
          >
            <p className="text-xs text-gray-600 mb-3 font-light tracking-[0.15em] uppercase">
              DE 26 PERSONAS POSSÍVEIS, VOCÊ É:
            </p>
            <div className="w-12 h-px bg-gray-400 mx-auto mb-4"></div>
            <h1 className="text-2xl md:text-3xl font-light text-gray-900 tracking-[0.2em]">
              {finalResult.personaDisplayName?.toUpperCase() || 'PERSONA DESCONHECIDA'}
            </h1>
            <p className="text-xs text-gray-600 mt-3 font-light">
              Encontrado em apenas <span className="text-gray-900 font-normal">{finalResult.populationPercentage}%</span> da população
            </p>
          </motion.div>

          {/* Bento Grid Layout */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-12 grid-rows-8 gap-3 h-[600px]"
          >
            {/* Card Principal - Descrição */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 }}
              className="col-span-8 row-span-5 bg-white border border-gray-300 p-6 relative overflow-hidden"
            >
              {/* Mini frame decorativo */}
              <div className="absolute top-3 left-3 w-4 h-4 border-l border-t border-gray-400"></div>
              <div className="absolute top-3 right-3 w-4 h-4 border-r border-t border-gray-400"></div>
              <div className="absolute bottom-3 left-3 w-4 h-4 border-l border-b border-gray-400"></div>
              <div className="absolute bottom-3 right-3 w-4 h-4 border-r border-b border-gray-400"></div>

              <h3 className="text-sm font-light text-gray-900 mb-3 tracking-[0.1em] uppercase">SUA ESSÊNCIA REVELADA</h3>
              <div className="w-8 h-px bg-gray-400 mb-4"></div>
              <p className="text-xs leading-relaxed font-light text-gray-700 mb-6">{finalResult.description}</p>

              <div className="space-y-4">
                <div>
                  <h4 className="font-normal text-gray-900 mb-2 tracking-[0.1em] text-xs uppercase">IMPACTO NOS NEGÓCIOS:</h4>
                  <div className="w-6 h-px bg-gray-300 mb-2"></div>
                  <p className="font-light text-gray-600 leading-relaxed text-xs">{finalResult.businessImpact}</p>
                </div>
              </div>
            </motion.div>

            {/* Card Precisão */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 }}
              className="col-span-4 row-span-2 bg-white border border-gray-300 p-4 flex flex-col items-center justify-center text-center relative"
            >
              <div className="absolute top-2 left-2 w-3 h-3 border-l border-t border-gray-400"></div>
              <div className="absolute top-2 right-2 w-3 h-3 border-r border-t border-gray-400"></div>

              <div className="text-2xl font-light text-gray-900 mb-1">{finalResult.confidence}%</div>
              <div className="text-xs text-gray-500 font-light tracking-wider uppercase">Precisão</div>
            </motion.div>

            {/* Card Raridade */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4 }}
              className="col-span-4 row-span-3 bg-white border border-gray-300 p-4 flex flex-col items-center justify-center text-center relative"
            >
              <div className="absolute top-2 left-2 w-3 h-3 border-l border-t border-gray-400"></div>
              <div className="absolute bottom-2 right-2 w-3 h-3 border-r border-b border-gray-400"></div>

              <div className="text-sm font-light text-gray-900 mb-2 leading-tight">
                {(finalResult.rarityLevel || 'rare').replace('_', ' ').toUpperCase().split(' ').map((word, i) => (
                  <div key={i} className="text-xs">{word}</div>
                ))}
              </div>
              <div className="text-xs text-gray-500 font-light tracking-wider uppercase">Raridade</div>
            </motion.div>

            {/* Card Transformação */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 }}
              className="col-span-8 row-span-3 bg-white border border-gray-300 p-4 relative"
            >
              <div className="absolute bottom-2 left-2 w-3 h-3 border-l border-b border-gray-400"></div>
              <div className="absolute bottom-2 right-2 w-3 h-3 border-r border-b border-gray-400"></div>

              <h4 className="font-normal text-gray-900 mb-2 tracking-[0.1em] text-xs uppercase">POTENCIAL DE TRANSFORMAÇÃO:</h4>
              <div className="w-6 h-px bg-gray-300 mb-3"></div>
              <p className="font-light text-gray-600 leading-relaxed text-xs">{finalResult.transformationPotential}</p>
            </motion.div>

            {/* Card Composição */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.8 }}
              className="col-span-4 row-span-2 bg-gray-50 border border-gray-300 p-4 flex flex-col items-center justify-center text-center relative"
            >
              <div className="absolute top-2 right-2 w-3 h-3 border-r border-t border-gray-400"></div>
              <div className="absolute bottom-2 left-2 w-3 h-3 border-l border-b border-gray-400"></div>

              <div className="text-lg font-light text-gray-900 mb-1">{(finalResult.personaComposition || 'PURA').toUpperCase()}</div>
              <div className="text-xs text-gray-500 font-light tracking-wider uppercase">Composição</div>
            </motion.div>
          </motion.div>

          {/* CTA final minimalista */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2 }}
            className="text-center mt-8"
          >
            <motion.button
              onClick={() => onComplete?.(finalResult)}
              className="relative px-8 py-3 border border-gray-400 text-gray-700 font-light tracking-[0.1em]
                       hover:border-gray-600 hover:text-gray-900 transition-all duration-300
                       bg-white overflow-hidden group text-xs uppercase"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <span className="relative z-10">DESCOBRIR MÉTODO ALMA</span>
              <motion.div
                className="absolute inset-0 bg-gray-50"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>

            <p className="text-xs text-gray-500 mt-3 font-light tracking-wider">
              PARA {finalResult.personaDisplayName?.toUpperCase() || 'SUA PERSONA'}
            </p>
          </motion.div>
        </div>
      </div>
    )
  }

  // Render based on current phase - NO ANIMATIONS
  if (phase === 'landing') {
    return <SimpleLanding onStartDiscovery={() => setPhase('questioning')} />
  }

  if (phase === 'questioning') {
    return <QuestionPhase />
  }

  if (phase === 'processing') {
    return <ProcessingPhase />
  }

  if (phase === 'revelation') {
    return <RevelationPhase />
  }

  return null
}