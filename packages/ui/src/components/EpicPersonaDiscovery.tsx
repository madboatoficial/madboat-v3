'use client'

import React, { useState, useEffect, useRef, memo, useCallback, useDeferredValue, useTransition, startTransition, createElement } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Type definitions (now local to UI package)
export interface PersonaQuestion {
  id: number
  alertText?: string
  introText?: string
  question: string
  subText?: string
  isOpenEnded?: boolean
  placeholder?: string
  options: Array<{
    letter: 'A' | 'B' | 'C' | 'D' | 'E'
    text: string
    persona?: string
  }>
  weight: number
}

export interface QuestionResponse {
  questionId: number
  answer: string
  semanticAnalysis?: any
  typingMetrics?: TypingMetrics
  timestamp: number
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
    
    // Estado do botão - só após hydration para evitar mismatch
    if (isHydratedRef.current) {
      callbacksRef.current.onButtonStateChange(value.trim().length > 0)
      // Análise - debounced
      debouncedAnalysisRef.current?.(value)
    }
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
  }, [textareaRef])

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
  
  // Limpa textarea quando muda de questão
  useEffect(() => {
    if (lastQuestionRef.current !== questionId && textareaRef.current) {
      textareaRef.current.value = ''
      lastQuestionRef.current = questionId
    }
  }, [questionId, textareaRef])
  
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
    
    // Estado do botão - só após hydration para evitar mismatch
    if (isHydratedRef.current) {
      callbacksRef.current.onButtonStateChange(value.trim().length > 0)
      // Análise - debounced
      debouncedAnalysisRef.current?.(value)
    }
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
  }, [textareaRef])

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
{createElement(StableTextarea as React.ComponentType<StableTextareaProps>, {
            placeholder: question.placeholder,
            textareaRef: textareaRef,
            onTextChange: stableOnTextChange,
            onButtonStateChange: stableOnButtonStateChange,
            questionId: question.id
          })}
          
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
          disabled={!buttonEnabled}
          className={`px-12 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-bold text-white transition-all duration-300 hover:scale-105 active:scale-95 ${
            buttonEnabled ? 'opacity-100' : 'opacity-50 cursor-not-allowed'
          }`}
        >
          {question.id >= 1 ? 'Revelar Minha Persona' : 'Próxima Dimensão'}
        </button>
      </div>
    </div>
  )
}, (prevProps, nextProps) => {
  // Só re-renderiza se mudanças realmente importantes
  return prevProps.liveAnalysis === nextProps.liveAnalysis && 
         prevProps.buttonEnabled === nextProps.buttonEnabled &&
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

// Mock data for UI package standalone usage
const MOCK_QUESTIONS: PersonaQuestion[] = [
  {
    id: 0,
    question: "Como você normalmente toma decisões importantes na sua vida?",
    subText: "Pense na última vez que precisou fazer uma escolha significativa.",
    isOpenEnded: true,
    placeholder: "Descreva seu processo de tomada de decisão...",
    options: [],
    weight: 3
  },
  {
    id: 1,
    question: "Qual dessas situações te representa melhor?",
    isOpenEnded: false,
    options: [
      { letter: 'A', text: "Prefiro analisar todos os dados antes de decidir" },
      { letter: 'B', text: "Confio na minha intuição para escolhas importantes" },
      { letter: 'C', text: "Busco conselhos de pessoas experientes" },
      { letter: 'D', text: "Ajo rapidamente quando vejo uma oportunidade" }
    ],
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
  
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const startTimeRef = useRef<number>(0)
  const keystrokes = useRef<number[]>([])
  const textValueRef = useRef<string>('')

  // Marca quando client está pronto
  useEffect(() => {
    setIsClientReady(true)
  }, [])

  // Landing Phase Component
  const LandingPhase = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 flex items-center justify-center relative overflow-hidden">
      {/* Animated background waves */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{ 
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{ 
          duration: 20,
          repeat: Infinity,
          repeatType: 'reverse'
        }}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 1000'%3E%3Cpath d='M0,500 Q250,300 500,500 T1000,500' stroke='white' stroke-width='2' fill='none' opacity='0.1'/%3E%3C/svg%3E")`,
          backgroundSize: '100% 100%'
        }}
      />
      
      <div className="relative z-10 text-center text-white max-w-4xl px-8">
        {/* Título épico com zoom palavra por palavra */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="mb-12"
        >
          <motion.h1 
            className="text-6xl md:text-8xl font-bold mb-6"
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              delay: 0.5,
              duration: 0.8,
              ease: [0.68, -0.55, 0.265, 1.55]
            }}
          >
            10 Perguntas. 26 Personas. Sua Essência.
          </motion.h1>
        </motion.div>

        {/* Subtítulo científico */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 1 }}
          className="text-2xl md:text-3xl font-serif italic text-purple-300 mb-8"
        >
          IA analisa como você pensa, decide e age em 3 minutos
        </motion.p>

        {/* Descrição científica */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
          className="text-lg md:text-xl text-purple-200 mb-12 max-w-3xl mx-auto leading-relaxed"
        >
          <p className="mb-4">
            Cada palavra que você digita. Cada pausa que você faz.
          </p>
          <p className="mb-4">
            Cada decisão revela padrões neurais únicos.
          </p>
          <p>
            Descubra qual dos <strong className="text-white">26 perfis de liderança</strong> é o seu.
          </p>
        </motion.div>

        {/* Métricas científicas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3, duration: 1 }}
          className="grid grid-cols-3 gap-8 mb-12 max-w-2xl mx-auto"
        >
          <div className="text-center">
            <div className="text-4xl font-bold text-green-400 mb-2">✓</div>
            <div className="text-sm text-purple-300">Análise Semântica</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-400 mb-2">5</div>
            <div className="text-sm text-purple-300">Dimensões Comportamentais</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-400 mb-2">89%</div>
            <div className="text-sm text-purple-300">Precisão Média</div>
          </div>
        </motion.div>

        {/* CTA épico */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 3.5, duration: 0.8, type: "spring" }}
        >
          <motion.button
            onClick={() => setPhase('questioning')}
            className="group relative px-16 py-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-xl font-bold overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">Iniciar Mapeamento Dimensional</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-400"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut'
              }}
            />
            <motion.div
              className="absolute inset-0 bg-white"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0, 0.2, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
          </motion.button>
        </motion.div>
      </div>
    </div>
  )

  // Função simplificada para capturar métricas básicas
  const captureBasicMetrics = useCallback((): TypingMetrics | undefined => {
    const question = questions[currentQuestion]
    if (!question?.isOpenEnded || !startTimeRef.current) return undefined
    
    const endTime = Date.now()
    const totalTime = endTime - startTimeRef.current
    // Pega valor do textarea uncontrolled
    const characterCount = textareaRef.current?.value.length || 0
    
    return {
      startTime: startTimeRef.current,
      endTime,
      totalTime,
      characterCount,
      averageTypingSpeed: characterCount > 0 ? (characterCount / (totalTime / 1000)) * 60 : 0,
      pauseCount: keystrokes.current.length,
      backspaceCount: 0,
      hesitationCount: 0,
      corrections: []
    }
  }, [currentQuestion, questions])

  // Handler simplificado - sem mudança de state por aqui
  const handleTextChange = useCallback((value: string) => {
    // Apenas armazena o valor atual em ref para evitar re-renders
    textValueRef.current = value
    
    const question = questions[currentQuestion]
    
    // Análise semântica em tempo real para perguntas abertas - usando transition
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

    const response: QuestionResponse = {
      questionId: question.id,
      answer: currentValue,
      semanticAnalysis: question.isOpenEnded ? liveAnalysis : undefined,
      typingMetrics: metrics,
      timestamp: Date.now()
    }

    // Use transition para mudanças de estado que podem ser custosas
    startTransition(() => {
      setResponses(prev => [...prev, response])
      setLiveAnalysis(null)
      setButtonEnabled(false)
      keystrokes.current = []
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
  }, [currentQuestion, liveAnalysis, captureBasicMetrics, questions])

  const handleFocus = useCallback(() => {
    if (!startTimeRef.current) startTimeRef.current = Date.now()
  }, [])

  const handleKeyDown = useCallback(() => {
    keystrokes.current.push(Date.now())
  }, [])

  // Question Phase Component - SEM ANIMAÇÕES  
  const QuestionPhase = () => {
    const question = questions[currentQuestion]
    if (!question) return null

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 to-purple-700 flex items-center justify-center p-8" suppressHydrationWarning>
        <div className="max-w-4xl w-full">
          {/* Progress */}
          <div className="text-center mb-12">
            <p className="text-purple-300 text-lg mb-4">
              Dimensão {currentQuestion + 1}/{questions.length}
            </p>
            <div className="w-full bg-purple-800 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Component */}
{createElement(QuestionComponent as React.ComponentType<QuestionComponentProps>, {
            question: question,
            liveAnalysis: liveAnalysis,
            onNext: handleNext,
            textareaRef: textareaRef,
            onTextChange: handleTextChange,
            onButtonStateChange: setButtonEnabled,
            buttonEnabled: buttonEnabled,
            isClientReady: isClientReady
          })}
        </div>
      </div>
    )
  }

  // Processing Phase Component
  const ProcessingPhase = () => {
    useEffect(() => {
      // Processamento usando transition para melhor UX
      const timer = setTimeout(() => {
        startTransition(() => {
          const result = classifyPersona(responses)
          setFinalResult(result)
          setPhase('revelation')
        })
      }, 3000)

      return () => clearTimeout(timer)
    }, [responses, classifyPersona])

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 flex items-center justify-center">
        <motion.div
          className="text-center text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-32 h-32 mx-auto mb-8"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <div className="w-full h-full border-4 border-purple-400 border-t-transparent rounded-full" />
          </motion.div>
          
          <motion.h2
            className="text-4xl md:text-6xl font-bold mb-8"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Compilando Seu DNA Neural
          </motion.h2>
          
          <motion.div
            className="space-y-4 text-lg text-purple-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Analisando padrões comportamentais...
            </motion.p>
            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
            >
              Processando análise semântica...
            </motion.p>
            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1.4 }}
            >
              Calculando scores de confiança...
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  // Revelation Phase Component  
  const RevelationPhase = () => {
    if (!finalResult) return null

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 to-pink-900 flex items-center justify-center p-8">
        <motion.div
          className="max-w-6xl w-full text-center text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Revelação dramática */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1, type: 'spring', bounce: 0.3 }}
            className="mb-12"
          >
            <motion.p
              className="text-2xl text-purple-300 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              De 26 personas possíveis, você é:
            </motion.p>
            
            <motion.h1
              className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.8, type: 'spring' }}
            >
              {finalResult.personaDisplayName}
            </motion.h1>
            
            <motion.p
              className="text-xl text-purple-200 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              Encontrado em apenas <strong className="text-white">{finalResult.populationPercentage}%</strong> da população
            </motion.p>
          </motion.div>

          {/* Descrição completa */}
          <motion.div
            className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-8 text-left"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 }}
          >
            <h3 className="text-2xl font-bold mb-6 text-center">Sua Essência Revelada</h3>
            <p className="text-lg leading-relaxed mb-6">{finalResult.description}</p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-purple-300 mb-2">Impacto nos Negócios:</h4>
                <p>{finalResult.businessImpact}</p>
              </div>
              <div>
                <h4 className="font-bold text-purple-300 mb-2">Potencial de Transformação:</h4>
                <p>{finalResult.transformationPotential}</p>
              </div>
            </div>
          </motion.div>

          {/* Métricas finais */}
          <motion.div
            className="grid grid-cols-3 gap-6 mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
          >
            <div className="bg-white/10 rounded-xl p-6">
              <div className="text-3xl font-bold text-green-400 mb-2">{finalResult.confidence}%</div>
              <div className="text-purple-300">Precisão</div>
            </div>
            <div className="bg-white/10 rounded-xl p-6">
              <div className="text-3xl font-bold text-purple-400 mb-2">{finalResult.rarityLevel.replace('_', ' ').toUpperCase()}</div>
              <div className="text-purple-300">Raridade</div>
            </div>
            <div className="bg-white/10 rounded-xl p-6">
              <div className="text-3xl font-bold text-pink-400 mb-2">{finalResult.personaComposition.toUpperCase()}</div>
              <div className="text-purple-300">Composição</div>
            </div>
          </motion.div>

          {/* CTA final */}
          <motion.button
            onClick={() => onComplete?.(finalResult)}
            className="px-16 py-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-xl font-bold"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 3, type: 'spring' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Descobrir Método ALMA para {finalResult.personaDisplayName}
          </motion.button>
        </motion.div>
      </div>
    )
  }

  // Render based on current phase
  return (
    <AnimatePresence mode="wait">
      {phase === 'landing' && <LandingPhase />}
      {phase === 'questioning' && <QuestionPhase />}
      {phase === 'processing' && <ProcessingPhase />}
      {phase === 'revelation' && <RevelationPhase />}
    </AnimatePresence>
  )
}