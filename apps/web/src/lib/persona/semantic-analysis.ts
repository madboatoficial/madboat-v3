/**
 * 🧠 SEMANTIC ANALYSIS ENGINE
 * Análise semântica avançada em JavaScript puro
 * Detecta padrões comportamentais em tempo real
 */

import { 
  PersonaType, 
  PersonaAnalysis, 
  TypingMetrics,
  SEMANTIC_PATTERNS 
} from '@/types/persona'

export function analyzeSemanticResponse(
  text: string, 
  typingMetrics: TypingMetrics
): PersonaAnalysis {
  const textLower = text.toLowerCase()
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
  
  // Initialize scores
  const scores: Record<PersonaType, number> = {
    [PersonaType.ANALITICO]: 0,
    [PersonaType.EMOTIVO]: 0,
    [PersonaType.PRAGMATICO]: 0,
    [PersonaType.CRIATIVO]: 0,
    [PersonaType.INSEGURO]: 0
  }

  const foundIndicators: Record<PersonaType, string[]> = {
    [PersonaType.ANALITICO]: [],
    [PersonaType.EMOTIVO]: [],
    [PersonaType.PRAGMATICO]: [],
    [PersonaType.CRIATIVO]: [],
    [PersonaType.INSEGURO]: []
  }

  // Analyze each persona type
  Object.entries(SEMANTIC_PATTERNS).forEach(([personaType, config]) => {
    const persona = personaType as PersonaType
    
    // Check keywords
    config.keywords.forEach(keyword => {
      if (textLower.includes(keyword)) {
        scores[persona] += 2
        foundIndicators[persona].push(`palavra: "${keyword}"`)
      }
    })

    // Check patterns
    Object.entries(config.patterns).forEach(([patternName, pattern]) => {
      const matches = text.match(pattern as RegExp)
      if (matches && matches.length > 0) {
        const weight = getPatternWeight(patternName, matches.length)
        scores[persona] += weight
        foundIndicators[persona].push(`${patternName}: ${matches.length}x`)
      }
    })
  })

  // BEHAVIORAL ANALYSIS from typing metrics
  applyBehavioralAnalysis(typingMetrics, scores, foundIndicators, text)

  // TEXT LENGTH ANALYSIS
  applyTextLengthAnalysis(text, scores, foundIndicators, sentences.length)

  // Calculate confidence and determine top persona
  const maxScore = Math.max(...Object.values(scores))
  const topPersona = Object.entries(scores)
    .find(([_, score]) => score === maxScore)?.[0] as PersonaType
  
  const sortedScores = Object.values(scores).sort((a, b) => b - a)
  const confidence = calculateConfidence(maxScore, sortedScores)
  
  return {
    type: topPersona,
    confidence,
    indicators: foundIndicators[topPersona] || [],
    semanticScore: maxScore,
    behavioralPatterns: extractBehavioralPatterns(text, typingMetrics)
  }
}

function getPatternWeight(patternName: string, matchCount: number): number {
  const weights: Record<string, number> = {
    numbered: 4,        // Structured numbering
    structured: 3,       // Bullet points, lists
    personalStory: 3,    // Personal narratives
    emotional: 2,        // Emotional expressions
    concise: 2,          // Short, direct answers
    bulletPoints: 2,     // Organized points
    nonLinear: 2,        // Creative structure
    alternatives: 2,     // Multiple options
    hesitation: 3,       // Uncertainty markers
    uncertainty: 2       // Doubt expressions
  }
  
  const baseWeight = weights[patternName] || 1
  return baseWeight * Math.min(matchCount, 3) // Cap at 3x
}

function applyBehavioralAnalysis(
  metrics: TypingMetrics,
  scores: Record<PersonaType, number>,
  indicators: Record<PersonaType, string[]>,
  text: string
): void {
  // Typing speed analysis
  if (metrics.averageTypingSpeed > 120) {
    scores[PersonaType.PRAGMATICO] += 1
    scores[PersonaType.EMOTIVO] += 0.5
    indicators[PersonaType.PRAGMATICO].push('digitação rápida e fluida')
  } else if (metrics.averageTypingSpeed < 40) {
    scores[PersonaType.INSEGURO] += 1
    scores[PersonaType.ANALITICO] += 0.5
    indicators[PersonaType.INSEGURO].push('digitação lenta e cuidadosa')
  }

  // Pause pattern analysis
  if (metrics.pauseCount > 5) {
    scores[PersonaType.ANALITICO] += 1
    scores[PersonaType.INSEGURO] += 1
    indicators[PersonaType.ANALITICO].push(`${metrics.pauseCount} pausas para reflexão`)
  } else if (metrics.pauseCount === 0) {
    scores[PersonaType.PRAGMATICO] += 1
    scores[PersonaType.EMOTIVO] += 0.5
    indicators[PersonaType.PRAGMATICO].push('escrita sem pausas')
  }

  // Correction behavior
  if (metrics.backspaceCount > text.length * 0.2) {
    scores[PersonaType.INSEGURO] += 2
    scores[PersonaType.ANALITICO] += 1
    indicators[PersonaType.INSEGURO].push('muitas correções e revisões')
  } else if (metrics.backspaceCount < text.length * 0.05) {
    scores[PersonaType.PRAGMATICO] += 1
    scores[PersonaType.CRIATIVO] += 0.5
    indicators[PersonaType.PRAGMATICO].push('poucas correções')
  }

  // Hesitation analysis
  if (metrics.hesitationCount > 3) {
    scores[PersonaType.INSEGURO] += 2
    indicators[PersonaType.INSEGURO].push(`${metrics.hesitationCount} hesitações detectadas`)
  }
}

function applyTextLengthAnalysis(
  text: string,
  scores: Record<PersonaType, number>,
  indicators: Record<PersonaType, string[]>,
  sentenceCount: number
): void {
  const textLength = text.length
  
  if (textLength > 300) {
    scores[PersonaType.ANALITICO] += 1
    scores[PersonaType.EMOTIVO] += 1
    scores[PersonaType.CRIATIVO] += 0.5
    indicators[PersonaType.ANALITICO].push('resposta detalhada e completa')
  } else if (textLength < 50) {
    scores[PersonaType.INSEGURO] += 2
    scores[PersonaType.PRAGMATICO] += 1
    indicators[PersonaType.INSEGURO].push('resposta muito curta')
  } else if (textLength < 100 && sentenceCount <= 3) {
    scores[PersonaType.PRAGMATICO] += 2
    indicators[PersonaType.PRAGMATICO].push('resposta concisa e direta')
  }

  // Paragraph structure
  const paragraphs = text.split(/\n\n+/).length
  if (paragraphs >= 3) {
    scores[PersonaType.ANALITICO] += 1
    indicators[PersonaType.ANALITICO].push('estrutura em parágrafos')
  }
}

function calculateConfidence(maxScore: number, sortedScores: number[]): number {
  if (maxScore === 0) return 0
  
  const gap = maxScore - (sortedScores[1] || 0)
  const baseConfidence = (maxScore / (maxScore + 1)) * 100
  const gapBonus = gap * 10
  
  return Math.min(95, baseConfidence + gapBonus)
}

function extractBehavioralPatterns(text: string, metrics: TypingMetrics): string[] {
  const patterns: string[] = []
  
  // Writing style patterns
  if (text.includes('primeiro') || text.includes('segundo')) {
    patterns.push('pensamento estruturado')
  }
  
  if (text.match(/[!?]{2,}/)) {
    patterns.push('expressividade emocional')
  }
  
  if (text.match(/\b(eu|me|meu|minha)\b/gi)?.length || 0 > 5) {
    patterns.push('narrativa pessoal')
  }
  
  if (text.match(/\b(todos|sempre|nunca|ninguém)\b/gi)) {
    patterns.push('pensamento absoluto')
  }
  
  // Typing behavior patterns
  const wordsPerMinute = (text.split(' ').length / metrics.totalTime) * 60000
  if (wordsPerMinute > 60) {
    patterns.push('escrita fluente')
  } else if (wordsPerMinute < 20) {
    patterns.push('escrita reflexiva')
  }
  
  return patterns
}

// Additional helper functions for advanced analysis
export function detectEmotionalIntensity(text: string): number {
  const emotionalMarkers = [
    /!+/g,
    /\b(muito|demais|extremamente|super|mega)\b/gi,
    /[❤️😊😢😍🙏💪🔥]/g,
    /\b(amo|odeio|adoro|detesto)\b/gi
  ]
  
  let intensity = 0
  emotionalMarkers.forEach(marker => {
    const matches = text.match(marker)
    if (matches) intensity += matches.length
  })
  
  return Math.min(10, intensity)
}

export function detectAnalyticalDepth(text: string): number {
  const analyticalMarkers = [
    /\b(porque|pois|portanto|logo|assim|então)\b/gi,
    /\b(se.*então)\b/gi,
    /\b(comparando|analisando|considerando)\b/gi,
    /\d+%/g,
    /\b(dados|estatística|pesquisa|estudo)\b/gi
  ]
  
  let depth = 0
  analyticalMarkers.forEach(marker => {
    const matches = text.match(marker)
    if (matches) depth += matches.length * 2
  })
  
  return Math.min(10, depth)
}

export function detectCreativityMarkers(text: string): number {
  const creativityMarkers = [
    /\b(imagine|imagina|supondo|e se)\b/gi,
    /\b(criar|inventar|inovar|transformar)\b/gi,
    /\.\.\./g,
    /[()]/g,
    /\b(ou seja|isto é|quer dizer)\b/gi
  ]
  
  let creativity = 0
  creativityMarkers.forEach(marker => {
    const matches = text.match(marker)
    if (matches) creativity += matches.length
  })
  
  return Math.min(10, creativity)
}