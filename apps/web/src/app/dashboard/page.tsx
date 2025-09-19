"use client"

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Compass, Gem, Crown, Star, Zap, LogOut, ArrowRight, ChevronDown, Check } from 'lucide-react'
import { ProtectedRoute } from '../../components/ProtectedRoute'
import { CrewProfile } from '../../components/CrewProfile'
import { ModernTimeline } from '../../components/ModernTimeline'
import { useAuth } from '@madboat/auth'
import { EpicPersonaDiscovery } from '@madboat/ui'
import { PERSONA_QUESTIONS } from '@/lib/persona/questions'
import { analyzeSemanticPatterns } from '@/lib/persona/semantic-analysis'
import { classifyPersonaAdvanced } from '@/lib/persona/classification-engine'
import { classifyPersonaAdvancedV2, ALL_PERSONAS_V2 } from '@/lib/persona/advanced-classification-engine-v2'

// Componente simples que FUNCIONA - sem re-renders
function SimplePersonaComponent({ onComplete }: { onComplete: (result: any) => void }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<string[]>([])
  const [sliderValue, setSliderValue] = useState(50)
  const [dualRangeValues, setDualRangeValues] = useState<[number, number]>([25, 75])
  const [dragRanking, setDragRanking] = useState<Array<{id: string, text: string, rank: number}>>([])
  const [showResults, setShowResults] = useState(false)
  const [personaResult, setPersonaResult] = useState<any>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // USANDO AS QUESTÕES ORIGINAIS VALIDADAS
  const questions = PERSONA_QUESTIONS

  const currentQ = questions[currentQuestion]

  const calculatePersonaResult = (userResponses: string[]) => {
    // Usar o novo sistema de classificação V2.0
    return classifyPersonaAdvancedV2(userResponses, questions)
  }

  const handleNext = () => {
    const value = textareaRef.current?.value || ''
    const newResponses = [...responses, value]
    setResponses(newResponses)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
      if (textareaRef.current) {
        textareaRef.current.value = ''
      }
    } else {
      const result = calculatePersonaResult(newResponses)
      setPersonaResult(result)
      setShowResults(true)
      onComplete(result)
    }
  }

  const handleOptionClick = (option: any) => {
    const newResponses = [...responses, option.text]
    setResponses(newResponses)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      const result = calculatePersonaResult(newResponses)
      setPersonaResult(result)
      setShowResults(true)
      onComplete(result)
    }
  }

  // Show results screen when completed
  if (showResults && personaResult) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <div className="text-center">
          <div className="inline-block bg-green-100 text-green-800 text-sm font-medium px-4 py-2 rounded-full mb-6">
            🎉 PERSONA DESCOBERTA!
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            {personaResult.personaDisplayName}
          </h1>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-8 mb-8">
            <p className="text-xl text-gray-700 leading-relaxed mb-6">
              {personaResult.description}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Confiança: {Math.round(personaResult.confidence * 100 || personaResult.confidence)}%</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>{personaResult.totalAnalyzed || personaResult.responses.length} questões</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span>26 personas avaliadas</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="capitalize">{personaResult.personaComposition || 'completo'}</span>
              </div>
            </div>

            {/* Análise Detalhada */}
            {personaResult.detailedAnalysis && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Análise Detalhada:</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-gray-500">Semântica:</span>
                    <span className="ml-1 font-medium">{personaResult.detailedAnalysis.semanticScore || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Comportamental:</span>
                    <span className="ml-1 font-medium">{personaResult.detailedAnalysis.behavioralScore || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Consistência:</span>
                    <span className="ml-1 font-medium">{personaResult.detailedAnalysis.consistencyScore || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Reação:</span>
                    <span className="ml-1 font-medium">{personaResult.detailedAnalysis.reactionTimeScore || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Variabilidade:</span>
                    <span className="ml-1 font-medium">{Math.round(personaResult.detailedAnalysis.sliderVariability || 0)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Raridade:</span>
                    <span className="ml-1 font-medium capitalize">{personaResult.rarityLevel}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Top 3 Personas */}
            {personaResult.personaScores && personaResult.personaScores.length > 0 && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                  Suas 3 Personas Principais:
                </h3>
                <div className="space-y-3">
                  {personaResult.personaScores.map(([persona, score], index) => (
                    <div key={persona} className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                          index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-400'
                        }`}>
                          {index + 1}
                        </div>
                        <span className="font-medium text-gray-900 capitalize">
                          {persona}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {Math.round((score / Math.max(...personaResult.personaScores.map(([,s]) => s))) * 100)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Impacto e Transformação */}
            {(personaResult.businessImpact || personaResult.transformationPotential) && (
              <div className="border-t border-gray-200 pt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {personaResult.businessImpact && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        Impacto nos Negócios
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {personaResult.businessImpact}
                      </p>
                    </div>
                  )}
                  {personaResult.transformationPotential && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        Potencial de Transformação
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {personaResult.transformationPotential}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <button
              onClick={() => {
                setShowResults(false)
                setCurrentQuestion(0)
                setResponses([])
                setPersonaResult(null)
              }}
              className="px-8 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors mr-4"
            >
              Refazer Teste
            </button>

            <button
              onClick={() => window.print()}
              className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Salvar Resultado
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm">
      <div className="text-center mb-8">
        <div className="inline-block bg-green-100 text-green-800 text-sm font-medium px-4 py-2 rounded-full mb-4">
          ✅ QUESTÃO {currentQuestion + 1} DE {questions.length} - FUNCIONA!
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {currentQ.question}
        </h2>
        {currentQ.subText && (
          <p className="text-gray-600">
            {currentQ.subText}
          </p>
        )}
      </div>

      {currentQ.type === 'open_ended' || currentQ.isOpenEnded ? (
        <div className="mb-6">
          <textarea
            ref={textareaRef}
            onChange={() => {
              // VAZIO = FOCO ESTÁVEL = FUNCIONA
            }}
            placeholder={currentQ.placeholder}
            className="w-full h-48 border border-gray-300 rounded-lg p-4 text-gray-900 placeholder:text-gray-500 resize-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />

          <div className="flex justify-center mt-6">
            <button
              onClick={handleNext}
              className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              {currentQuestion < questions.length - 1 ? 'Próxima Questão' : 'Revelar Persona'}
            </button>
          </div>
        </div>
      ) : currentQ.type === 'reaction_time' && currentQ.reactionConfig ? (
        <div className="mb-6">
          <div className="text-center mb-6">
            <p className="text-lg font-medium text-gray-800 mb-4">
              Escolha a palavra que mais combina com você:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {currentQ.reactionConfig.words.map((wordConfig, index) => (
              <button
                key={index}
                onClick={() => {
                  const newResponses = [...responses, wordConfig.word]
                  setResponses(newResponses)

                  if (currentQuestion < questions.length - 1) {
                    setCurrentQuestion(prev => prev + 1)
                  } else {
                    const result = {
                      personaDisplayName: "Persona Identificada",
                      confidence: 0.95,
                      description: "Sua persona foi identificada com base nas respostas!",
                      responses: newResponses
                    }
                    setPersonaResult(result)
                    setShowResults(true)
                    onComplete(result)
                  }
                }}
                className="px-6 py-8 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl text-xl font-bold text-blue-900 hover:from-blue-100 hover:to-blue-200 hover:border-blue-300 transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                {wordConfig.word}
              </button>
            ))}
          </div>
        </div>
      ) : currentQ.type === 'dual_range_slider' && currentQ.sliderConfig ? (
        <div className="mb-6">
          <div className="flex justify-between mb-4">
            <span className="text-sm font-medium text-gray-700">{currentQ.sliderConfig.leftLabel}</span>
            <span className="text-sm font-medium text-gray-700">{currentQ.sliderConfig.rightLabel}</span>
          </div>

          <div className="px-4 py-8">
            <input
              type="range"
              min="0"
              max="100"
              value={sliderValue}
              onChange={(e) => setSliderValue(Number(e.target.value))}
              className="w-full h-3 bg-gradient-to-r from-blue-200 to-blue-600 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="text-center mt-3">
              <span className="text-lg font-semibold text-blue-600">{sliderValue}%</span>
              <p className="text-sm text-gray-600 mt-1">
                {sliderValue < 25 ? currentQ.sliderConfig.leftLabel :
                 sliderValue > 75 ? currentQ.sliderConfig.rightLabel :
                 "Equilibrado"}
              </p>
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <button
              onClick={() => {
                const newResponses = [...responses, sliderValue.toString()]
                setResponses(newResponses)

                if (currentQuestion < questions.length - 1) {
                  setCurrentQuestion(prev => prev + 1)
                  setSliderValue(50) // Reset
                } else {
                  const result = {
                    personaDisplayName: "Persona Identificada",
                    confidence: 0.95,
                    description: "Sua persona foi identificada com base nas respostas!",
                    responses: newResponses
                  }
                  setPersonaResult(result)
                  setShowResults(true)
                  onComplete(result)
                }
              }}
              className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              {currentQuestion < questions.length - 1 ? 'Próxima Questão' : 'Revelar Persona'}
            </button>
          </div>
        </div>
      ) : currentQ.type === 'visual_analog_scale' && currentQ.sliderConfig ? (
        <div className="mb-6">
          <div className="text-center mb-4">
            <span className="text-sm text-gray-600">{currentQ.sliderConfig.leftLabel}</span>
            <span className="mx-8 text-sm text-gray-600">←→</span>
            <span className="text-sm text-gray-600">{currentQ.sliderConfig.rightLabel}</span>
          </div>

          <div className="px-4 py-8">
            <input
              type="range"
              min="0"
              max="100"
              value={sliderValue}
              onChange={(e) => setSliderValue(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="text-center mt-2 text-sm text-gray-600">
              {sliderValue}%
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <button
              onClick={() => {
                const newResponses = [...responses, sliderValue.toString()]
                setResponses(newResponses)

                if (currentQuestion < questions.length - 1) {
                  setCurrentQuestion(prev => prev + 1)
                  setSliderValue(50) // Reset
                } else {
                  const result = {
                    personaDisplayName: "Persona Identificada",
                    confidence: 0.95,
                    description: "Sua persona foi identificada com base nas respostas!",
                    responses: newResponses
                  }
                  setPersonaResult(result)
                  setShowResults(true)
                  onComplete(result)
                }
              }}
              className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              {currentQuestion < questions.length - 1 ? 'Próxima Questão' : 'Revelar Persona'}
            </button>
          </div>
        </div>
      ) : currentQ.type === 'situational_judgment' && currentQ.scenario ? (
        <div className="mb-6">
          <div className="mb-6 p-6 bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-400 rounded-lg">
            <h3 className="text-xl font-bold text-orange-900 mb-3">{currentQ.scenario.title}</h3>
            <p className="text-orange-800 leading-relaxed">{currentQ.scenario.description}</p>
          </div>

          <div className="mb-6">
            <p className="text-lg font-medium text-gray-800 mb-4 text-center">
              Ordene as ações por prioridade (clique para selecionar em ordem):
            </p>
          </div>

          <div className="space-y-3 max-w-3xl mx-auto">
            {currentQ.scenario.choices.map((choice, index) => {
              const isSelected = dragRanking.find(r => r.id === choice.id)
              const rank = isSelected?.rank || 0

              return (
                <button
                  key={choice.id}
                  onClick={() => {
                    if (isSelected) {
                      // Remove from ranking
                      setDragRanking(prev =>
                        prev.filter(r => r.id !== choice.id)
                          .map(r => r.rank > rank ? {...r, rank: r.rank - 1} : r)
                      )
                    } else {
                      // Add to ranking
                      const nextRank = dragRanking.length + 1
                      setDragRanking(prev => [...prev, {
                        id: choice.id,
                        text: choice.text,
                        rank: nextRank
                      }])
                    }
                  }}
                  className={`w-full text-left p-4 rounded-lg transition-all transform ${
                    isSelected
                      ? 'bg-blue-100 border-2 border-blue-500 scale-105'
                      : 'bg-gray-50 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900 font-medium">{choice.text}</span>
                    {isSelected && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-blue-600 font-bold">#{rank}</span>
                        <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                          {rank}
                        </div>
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {dragRanking.length === currentQ.scenario.choices.length && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => {
                  const rankingString = dragRanking
                    .sort((a, b) => a.rank - b.rank)
                    .map(r => `${r.rank}. ${r.text}`)
                    .join('; ')

                  const newResponses = [...responses, rankingString]
                  setResponses(newResponses)
                  setDragRanking([]) // Reset for next question

                  if (currentQuestion < questions.length - 1) {
                    setCurrentQuestion(prev => prev + 1)
                  } else {
                    const result = {
                      personaDisplayName: "Persona Identificada",
                      confidence: 0.95,
                      description: "Sua persona foi identificada com base nas respostas!",
                      responses: newResponses
                    }
                    setPersonaResult(result)
                    setShowResults(true)
                    onComplete(result)
                  }
                }}
                className="px-8 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                {currentQuestion < questions.length - 1 ? 'Próxima Questão' : 'Revelar Persona'}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3 mb-6">
          {currentQ.options?.map((option: any) => (
            <button
              key={option.letter}
              onClick={() => handleOptionClick(option)}
              className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <span className="font-medium text-blue-600 mr-3">{option.letter})</span>
              <span className="text-gray-900">{option.text}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// Dashboard cards configuration
interface SubCard {
  id: string
  title: string
  subtitle: string
  description: string
  progress?: number
  completed?: boolean
}

interface DashboardCard {
  id: string
  title: string
  subtitle: string
  description: string
  icon: React.ComponentType<any>
  progress?: number
  completed?: boolean
  subCards?: SubCard[]
}

const dashboardCards: DashboardCard[] = [
  {
    id: 'persona',
    title: 'Descoberta de Persona',
    subtitle: '47 dimensões de autodescoberta',
    description: 'Uma jornada profunda através das múltiplas camadas da sua personalidade, explorando aspectos únicos que definem quem você é e como você se relaciona com o mundo.',
    icon: Star,
    progress: 0,
    completed: false
  },
  {
    id: 'alma',
    title: 'Método ALMA',
    subtitle: 'Autenticidade • Legado • Mapeamento • Aplicação',
    description: 'O método revolucionário que conecta sua essência autêntica com seu propósito de vida, criando um mapa claro para manifestar seu legado único no mundo.',
    icon: Compass,
    progress: 0,
    completed: false,
    subCards: [
      {
        id: 'autenticidade',
        title: 'Autenticidade',
        subtitle: 'Descoberta do eu verdadeiro',
        description: 'Conecte-se com sua essência autêntica e valores fundamentais',
        progress: 0,
        completed: false
      },
      {
        id: 'legado',
        title: 'Legado',
        subtitle: 'Construção do propósito',
        description: 'Defina o impacto que deseja deixar no mundo',
        progress: 0,
        completed: false
      },
      {
        id: 'mapeamento',
        title: 'Mapeamento',
        subtitle: 'Estratégia de vida',
        description: 'Crie um mapa claro para alcançar seus objetivos',
        progress: 0,
        completed: false
      },
      {
        id: 'aplicacao',
        title: 'Aplicação',
        subtitle: 'Execução prática',
        description: 'Implemente seu plano na vida real',
        progress: 0,
        completed: false
      }
    ]
  },
  {
    id: 'vortex',
    title: 'VORTEX Acceleration',
    subtitle: 'Sistema de aceleração inteligente',
    description: 'Tecnologia avançada de IA que acelera seu desenvolvimento pessoal, criando um vórtice de crescimento exponencial através de insights personalizados.',
    icon: Zap,
    progress: 0,
    completed: false
  },
  {
    id: 'odisseia',
    title: 'ODISSEIA',
    subtitle: 'Guerra • Paixão • Conquista',
    description: 'Uma jornada épica de transformação pessoal, onde você confronta seus medos, desperta suas paixões e conquista a versão mais elevada de si mesmo.',
    icon: Crown,
    progress: 0,
    completed: false
  },
  {
    id: 'tesouros',
    title: 'Tesouros',
    subtitle: 'Conquistas e recompensas',
    description: 'Sua coleção de conquistas, marcos alcançados e recompensas desbloqueadas ao longo da jornada de autodescoberta e crescimento pessoal.',
    icon: Gem,
    progress: 0,
    completed: false
  }
]

function DashboardContent() {
  const [activeCard, setActiveCard] = useState<string>('home')
  const [expandedCard, setExpandedCard] = useState<string | null>(null)
  const [cards, setCards] = useState(dashboardCards)
  const [currentViewYear, setCurrentViewYear] = useState<number>(new Date().getFullYear())
  const { signOut, user } = useAuth()

  const handleCardClick = (cardId: string) => {
    if (expandedCard === cardId) {
      setExpandedCard(null)
    } else {
      setExpandedCard(cardId)
      setActiveCard(cardId)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const activeCardData = cards.find(card => card.id === activeCard)

  const handlePersonaComplete = (result: any) => {
    // Save persona result to local storage or database
    console.log('Persona discovered:', result)

    setCards(prev => prev.map(card =>
      card.id === 'persona' ? { ...card, completed: true, progress: 100 } : card
    ))

    // Keep on persona view to show the result
    // User can navigate back manually
  }

  // Enhanced semantic analysis wrapper
  const handleAnalyzeSemanticPatterns = (text: string) => {
    const defaultTypingMetrics = {
      averageTypingSpeed: 60,
      pauseCount: 0,
      backspaceCount: 0,
      hesitationCount: 0,
      totalTime: text.length * 50,
      startTime: Date.now() - (text.length * 50),
      endTime: Date.now(),
      characterCount: text.length,
      corrections: []
    }
    return analyzeSemanticPatterns(text, defaultTypingMetrics)
  }

  // Classification wrapper
  const handleClassifyPersona = (responses: any[]) => {
    const adaptedResponses = responses.map(response => ({
      questionId: response.questionId,
      answer: response.answer,
      semanticAnalysis: response.semanticAnalysis,
      typingMetrics: response.typingMetrics,
      timestamp: response.timestamp
    }))

    const result = classifyPersonaAdvanced(adaptedResponses)

    return {
      personaDisplayName: result.personaDisplayName,
      confidence: result.confidence,
      description: result.description,
      personaComposition: result.personaComposition || 'pure',
      populationPercentage: result.populationPercentage,
      rarityLevel: result.rarityLevel,
      businessImpact: result.businessImpact,
      transformationPotential: result.transformationPotential
    }
  }

  const handleVortexComplete = () => {
    setCards(prev => prev.map(card =>
      card.id === 'vortex' ? { ...card, completed: true } : card
    ))
    setActiveCard('home')
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar Compacta à Esquerda */}
      <div className="w-72 flex flex-col bg-gray-50/30">
        {/* Logo */}
        <div className="px-6 py-10 flex justify-center">
          <motion.h1
            className="text-lg font-light tracking-widest text-gray-900 cursor-pointer hover:text-gray-600 transition-colors text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            onClick={() => setActiveCard('home')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            madboat
          </motion.h1>
        </div>

        {/* CrewProfile */}
        <div className="px-4 pb-3">
          <CrewProfile onUpgradeClick={() => {}} onSignOut={handleSignOut} className="w-full" />
        </div>

        {/* Cards Empilhados Menores */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
          {cards.map((card, index) => {
            const Icon = card.icon
            const isActive = activeCard === card.id

            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative cursor-pointer transition-all duration-300"
                onClick={() => handleCardClick(card.id)}
                whileHover={{ x: 4 }}
              >
                {/* Artistic Border Frame */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  viewBox="0 0 300 70"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <rect
                    x="1" y="1" width="298" height="68"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    className={`transition-colors duration-300 ${
                      isActive ? 'text-black/25' : 'text-black/15'
                    }`}
                  />
                  <g className={`transition-colors duration-300 ${
                    isActive ? 'text-black/30' : 'text-black/20'
                  }`}>
                    <line x1="0" y1="8" x2="0" y2="0" stroke="currentColor" strokeWidth="1.5"/>
                    <line x1="0" y1="0" x2="8" y2="0" stroke="currentColor" strokeWidth="1.5"/>
                    <line x1="292" y1="0" x2="300" y2="0" stroke="currentColor" strokeWidth="1.5"/>
                    <line x1="300" y1="0" x2="300" y2="8" stroke="currentColor" strokeWidth="1.5"/>
                    <line x1="300" y1="62" x2="300" y2="70" stroke="currentColor" strokeWidth="1.5"/>
                    <line x1="300" y1="70" x2="292" y2="70" stroke="currentColor" strokeWidth="1.5"/>
                    <line x1="8" y1="70" x2="0" y2="70" stroke="currentColor" strokeWidth="1.5"/>
                    <line x1="0" y1="70" x2="0" y2="62" stroke="currentColor" strokeWidth="1.5"/>
                  </g>
                </svg>

                {/* Card Content */}
                <div className="relative z-10 px-3 py-2.5">
                  <div className="flex items-center space-x-3">
                    {/* Checkbox */}
                    <div className="relative w-5 h-5">
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 20 20" fill="none">
                        <rect
                          x="3" y="3" width="14" height="14"
                          fill={card.completed ? 'black' : 'white'}
                          stroke={card.completed ? 'black' : '#d1d5db'}
                          strokeWidth="1.5"
                        />
                        <g className={card.completed ? 'text-black' : 'text-gray-400'}>
                          <line x1="2" y1="5" x2="2" y2="2" stroke="currentColor" strokeWidth="1"/>
                          <line x1="2" y1="2" x2="5" y2="2" stroke="currentColor" strokeWidth="1"/>
                          <line x1="15" y1="2" x2="18" y2="2" stroke="currentColor" strokeWidth="1"/>
                          <line x1="18" y1="2" x2="18" y2="5" stroke="currentColor" strokeWidth="1"/>
                          <line x1="18" y1="15" x2="18" y2="18" stroke="currentColor" strokeWidth="1"/>
                          <line x1="18" y1="18" x2="15" y2="18" stroke="currentColor" strokeWidth="1"/>
                          <line x1="5" y1="18" x2="2" y2="18" stroke="currentColor" strokeWidth="1"/>
                          <line x1="2" y1="18" x2="2" y2="15" stroke="currentColor" strokeWidth="1"/>
                        </g>
                        {card.completed && (
                          <motion.path
                            d="M6 10l2.5 2.5 5-5"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.3 }}
                          />
                        )}
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-sm font-medium truncate ${
                        isActive ? 'text-gray-900' : 'text-gray-700'
                      }`}>
                        {card.title}
                      </h3>
                      <p className="text-xs text-gray-400 truncate font-light">
                        {card.subtitle}
                      </p>
                    </div>
                    <motion.div
                      animate={{ rotate: expandedCard === card.id ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {card.subCards ? (
                        <ChevronDown
                          size={12}
                          strokeWidth={1.5}
                          className={`transition-colors ${
                            isActive ? 'text-gray-600' : 'text-gray-300'
                          }`}
                        />
                      ) : (
                        <ArrowRight
                          size={12}
                          strokeWidth={1.5}
                          className={`transition-colors ${
                            isActive ? 'text-gray-600' : 'text-gray-300'
                          }`}
                        />
                      )}
                    </motion.div>
                  </div>

                  {/* Progress bar */}
                  {card.progress !== undefined && (
                    <div className="mt-2">
                      <div className="w-full h-px bg-gray-100">
                        <motion.div
                          className="h-full bg-gray-300"
                          initial={{ width: 0 }}
                          animate={{ width: `${card.progress}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Expandable SubCards */}
                <AnimatePresence>
                  {expandedCard === card.id && card.subCards && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                      className="overflow-hidden mt-2 ml-3"
                    >
                      {card.subCards.map((subCard, subIndex) => (
                        <motion.div
                          key={subCard.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: subIndex * 0.1 }}
                          className="relative mb-2 last:mb-0"
                        >
                          {/* SubCard Border Frame */}
                          <svg
                            className="absolute inset-0 w-full h-full pointer-events-none"
                            viewBox="0 0 250 60"
                            fill="none"
                            preserveAspectRatio="none"
                          >
                            <rect
                              x="1" y="1" width="248" height="58"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="0.5"
                              className="text-black/10"
                            />
                            <g className="text-black/15">
                              <line x1="0" y1="6" x2="0" y2="0" stroke="currentColor" strokeWidth="1"/>
                              <line x1="0" y1="0" x2="6" y2="0" stroke="currentColor" strokeWidth="1"/>
                              <line x1="244" y1="0" x2="250" y2="0" stroke="currentColor" strokeWidth="1"/>
                              <line x1="250" y1="0" x2="250" y2="6" stroke="currentColor" strokeWidth="1"/>
                              <line x1="250" y1="54" x2="250" y2="60" stroke="currentColor" strokeWidth="1"/>
                              <line x1="250" y1="60" x2="244" y2="60" stroke="currentColor" strokeWidth="1"/>
                              <line x1="6" y1="60" x2="0" y2="60" stroke="currentColor" strokeWidth="1"/>
                              <line x1="0" y1="60" x2="0" y2="54" stroke="currentColor" strokeWidth="1"/>
                            </g>
                          </svg>

                          {/* SubCard Content */}
                          <div className="relative z-10 p-2 pl-4">
                            <div className="flex items-center space-x-2">
                              {/* SubCard Checkbox */}
                              <div className="relative w-3 h-3">
                                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 12 12" fill="none">
                                  <rect
                                    x="1.5" y="1.5" width="9" height="9"
                                    fill={subCard.completed ? 'black' : 'white'}
                                    stroke={subCard.completed ? 'black' : '#d1d5db'}
                                    strokeWidth="1"
                                  />
                                  <g className={subCard.completed ? 'text-black' : 'text-gray-400'}>
                                    <line x1="1" y1="2.5" x2="1" y2="1" stroke="currentColor" strokeWidth="0.5"/>
                                    <line x1="1" y1="1" x2="2.5" y2="1" stroke="currentColor" strokeWidth="0.5"/>
                                    <line x1="9.5" y1="1" x2="11" y2="1" stroke="currentColor" strokeWidth="0.5"/>
                                    <line x1="11" y1="1" x2="11" y2="2.5" stroke="currentColor" strokeWidth="0.5"/>
                                    <line x1="11" y1="9.5" x2="11" y2="11" stroke="currentColor" strokeWidth="0.5"/>
                                    <line x1="11" y1="11" x2="9.5" y2="11" stroke="currentColor" strokeWidth="0.5"/>
                                    <line x1="2.5" y1="11" x2="1" y2="11" stroke="currentColor" strokeWidth="0.5"/>
                                    <line x1="1" y1="11" x2="1" y2="9.5" stroke="currentColor" strokeWidth="0.5"/>
                                  </g>
                                  {subCard.completed && (
                                    <motion.path
                                      d="M3.5 6l1.5 1.5 3-3"
                                      stroke="white"
                                      strokeWidth="1"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      initial={{ pathLength: 0 }}
                                      animate={{ pathLength: 1 }}
                                      transition={{ duration: 0.3 }}
                                    />
                                  )}
                                </svg>
                              </div>
                              <div className="flex-1">
                                <h4 className="text-xs font-medium text-gray-700 truncate">
                                  {subCard.title}
                                </h4>
                                <p className="text-[10px] text-gray-400 truncate font-light">
                                  {subCard.subtitle}
                                </p>
                              </div>
                            </div>

                            {/* SubCard progress bar */}
                            {subCard.progress !== undefined && (
                              <div className="mt-1 ml-4">
                                <div className="w-full h-px bg-gray-100">
                                  <motion.div
                                    className="h-full bg-gray-200"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${subCard.progress}%` }}
                                    transition={{ duration: 0.8, delay: 0.3 + subIndex * 0.1 }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-100/50">
          <div className="flex items-center justify-center">
            <span className="text-xs text-gray-400 font-light truncate">
              {user?.email}
            </span>
          </div>
        </div>
      </div>

      {/* Área Principal ENORME */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeCard === 'home' ? (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="h-full relative overflow-hidden"
            >
              {/* Animated Background Lines */}
              <div className="absolute inset-0 overflow-hidden opacity-30">
                {/* Vertical Lines */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={`v-${i}`}
                    className="absolute h-full w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent"
                    style={{ left: `${(i + 1) * 16.66}%` }}
                    animate={{
                      y: ['-100%', '100%'],
                    }}
                    transition={{
                      duration: 10 + i * 2,
                      repeat: Infinity,
                      ease: 'linear',
                      delay: i * 0.5,
                    }}
                  />
                ))}

                {/* Horizontal Lines */}
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={`h-${i}`}
                    className="absolute w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"
                    style={{ top: `${(i + 1) * 25}%` }}
                    animate={{
                      x: ['-100%', '100%'],
                    }}
                    transition={{
                      duration: 15 + i * 3,
                      repeat: Infinity,
                      ease: 'linear',
                      delay: i * 0.7,
                    }}
                  />
                ))}

                {/* Diagonal Lines */}
                <motion.div
                  className="absolute w-[200%] h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent origin-center"
                  style={{ top: '50%', left: '-50%', transform: 'rotate(45deg)' }}
                  animate={{
                    x: ['-50%', '50%'],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
                <motion.div
                  className="absolute w-[200%] h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent origin-center"
                  style={{ top: '50%', left: '-50%', transform: 'rotate(-45deg)' }}
                  animate={{
                    x: ['50%', '-50%'],
                  }}
                  transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
              </div>

              {/* Modern Timeline Component */}
              <ModernTimeline onCurrentYearChange={setCurrentViewYear} />
            </motion.div>
          ) : activeCard === 'vortex' ? (
            <motion.div
              key="vortex"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full flex items-center justify-center"
            >
              <motion.button
                onClick={handleVortexComplete}
                className="px-8 py-3 bg-black text-white font-light tracking-wider hover:bg-gray-800 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                CONFIRMAR VORTEX
              </motion.button>
            </motion.div>
          ) : activeCard === 'odisseia' ? (
            <motion.div
              key="odisseia"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full flex items-center justify-center"
            >
              <h1 className="text-6xl font-light text-gray-300 tracking-widest">ODISSEIA</h1>
            </motion.div>
          ) : activeCardData ? (
            <motion.div
              key={activeCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="p-12"
            >
              <div className="max-w-6xl mx-auto">
                {/* Header da seção ativa - Hide for persona */}
                {activeCard !== 'persona' && (
                  <div className="mb-12">
                    <div className="flex items-center space-x-6 mb-6">
                      <div className="w-16 h-16 border border-gray-200 flex items-center justify-center">
                        <activeCardData.icon
                          size={24}
                          strokeWidth={1.5}
                          className="text-gray-600"
                        />
                      </div>
                      <div>
                        <h1 className="text-4xl font-light text-gray-900 tracking-wide">
                          {activeCardData.title}
                        </h1>
                        <p className="text-lg text-gray-500 font-light mt-2">
                          {activeCardData.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Conteúdo principal */}
                <div className={activeCard === 'persona' ? 'w-full' : 'grid grid-cols-1 lg:grid-cols-3 gap-12'}>
                  {/* Descrição - Hide for persona */}
                  {activeCard !== 'persona' && (
                    <div className="lg:col-span-2">
                      <p className="text-gray-600 font-light leading-relaxed text-lg mb-8">
                        {activeCardData.description}
                      </p>
                    </div>
                  )}

                  {/* Specific content for different cards */}
                  {activeCard === 'persona' ? (
                    <div className="w-full max-w-4xl mx-auto">
                      <SimplePersonaComponent onComplete={handlePersonaComplete} />
                    </div>
                  ) : (
                    <div className="lg:col-span-2">
                      {activeCard === 'vortex' ? (
                      <div className="flex items-center justify-center h-64">
                        <motion.button
                          onClick={handleVortexComplete}
                          className="px-8 py-3 bg-black text-white font-light tracking-wider hover:bg-gray-800 transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          CONFIRMAR VORTEX
                        </motion.button>
                      </div>
                    ) : activeCard === 'tesouros' ? (
                      <div className="h-96 relative bg-gradient-to-br from-stone-50 via-white to-stone-100 overflow-hidden">
                        {/* Background com Ondas Sutis - mesmo da timeline */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                          {/* Grid Background */}
                          <svg className="absolute inset-0 w-full h-full opacity-[0.015]" viewBox="0 0 1000 1000" fill="none">
                            <defs>
                              <pattern id="treasuresGrid" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
                                <path d="M 120 0 L 0 0 0 120" fill="none" stroke="currentColor" strokeWidth="0.3"/>
                              </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#treasuresGrid)"/>
                          </svg>

                          {/* Camadas de Ondas Sutis - Background Layer */}
                          <motion.div
                            className="absolute inset-0"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 2, ease: "easeOut", delay: 1 }}
                          >
                            <svg
                              className="absolute inset-0 w-full h-full pointer-events-none"
                              preserveAspectRatio="none"
                              viewBox="0 0 100 100"
                            >
                              <path
                                d="M 0,50 Q 25,30 50,50 T 100,50"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="0.3"
                                opacity="0.02"
                                className="text-black"
                              />
                            </svg>
                          </motion.div>

                          {/* Camada Middle com movimento diferente */}
                          <motion.div
                            className="absolute inset-0"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 2, ease: "easeOut", delay: 1.5 }}
                          >
                            <svg
                              className="absolute inset-0 w-full h-full pointer-events-none"
                              preserveAspectRatio="none"
                              viewBox="0 0 100 100"
                            >
                              <path
                                d="M 0,40 Q 25,60 50,40 T 100,40"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="0.4"
                                opacity="0.025"
                                className="text-black"
                              />
                            </svg>
                          </motion.div>

                          {/* Camada Front mais sutil */}
                          <motion.div
                            className="absolute inset-0"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 2, ease: "easeOut", delay: 2 }}
                          >
                            <svg
                              className="absolute inset-0 w-full h-full pointer-events-none"
                              preserveAspectRatio="none"
                              viewBox="0 0 100 100"
                            >
                              <path
                                d="M 0,55 Q 25,35 50,55 T 100,55"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="0.2"
                                opacity="0.015"
                                className="text-black"
                              />
                            </svg>
                          </motion.div>
                        </div>

                        {/* Conteúdo dos Tesouros */}
                        <div className="relative h-full flex items-center justify-center z-10">
                          <div className="text-center">
                            <motion.div
                              className="w-12 h-12 mx-auto mb-4 text-black/20"
                              animate={{
                                scale: [1, 1.1, 1],
                                rotate: [0, 5, -5, 0]
                              }}
                              transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                            >
                              <Gem size={48} />
                            </motion.div>
                            <h3 className="text-2xl font-light text-gray-900 mb-2 tracking-wide">
                              Tesouros em Construção
                            </h3>
                            <p className="text-gray-600 font-light max-w-md">
                              Sua coleção de conquistas e recompensas será revelada em breve.
                              Continue navegando para desbloquear novos tesouros.
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-50 border border-gray-100 p-8 rounded-none">
                        <h3 className="text-xl font-medium text-gray-900 mb-4">
                          Área de Desenvolvimento
                        </h3>
                        <p className="text-gray-600 font-light">
                          Este é o espaço principal onde o conteúdo específico de {activeCardData.title} será desenvolvido.
                          Você tem toda essa área enorme para implementar as funcionalidades específicas.
                        </p>
                      </div>
                    )}
                    </div>
                  )}

                  {/* Sidebar de ações - Hide for persona */}
                  {activeCard !== 'persona' && (
                    <div className="space-y-6">
                      <motion.button
                        className="w-full p-4 border border-gray-300 text-gray-700 font-medium
                                 hover:border-gray-400 hover:text-gray-900 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Iniciar {activeCardData.title}
                      </motion.button>

                      <div className="text-sm text-gray-400 font-light">
                        <p>Progresso: {activeCardData.progress}%</p>
                        <div className="w-full h-px bg-gray-100 mt-2">
                          <div
                            className="h-full bg-gray-300 transition-all duration-500"
                            style={{ width: `${activeCardData.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}