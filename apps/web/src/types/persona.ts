/**
 * 🧬 MADBOAT PERSONA IDENTIFICATION SYSTEM
 * Sistema científico baseado em neurociência comportamental
 * e psicologia cognitiva para identificação de 26 personas únicas
 */

export enum PersonaType {
  ANALITICO = 'ANALITICO',
  EMOTIVO = 'EMOTIVO',
  PRAGMATICO = 'PRAGMATICO',
  CRIATIVO = 'CRIATIVO',
  INSEGURO = 'INSEGURO'
}

export interface TypingMetrics {
  startTime: number
  endTime: number
  totalTime: number
  characterCount: number
  averageTypingSpeed: number // chars per minute
  pauseCount: number
  backspaceCount: number
  hesitationCount: number
  corrections: number[]
}

export interface PersonaAnalysis {
  type: PersonaType
  confidence: number
  indicators: string[]
  semanticScore?: number
  behavioralPatterns?: string[]
}

export interface QuestionOption {
  letter: 'A' | 'B' | 'C' | 'D' | 'E'
  text: string
  persona?: PersonaType
}

export interface PersonaQuestion {
  id: number
  alertText?: string
  introText?: string
  question: string
  subText?: string
  isOpenEnded?: boolean
  placeholder?: string
  options: QuestionOption[]
  weight: number // 1x, 2x, or 3x multiplier
}

export interface QuestionResponse {
  questionId: number
  answer: string
  semanticAnalysis?: PersonaAnalysis
  typingMetrics?: TypingMetrics
  timestamp: number
}

export interface PersonaClassificationResult {
  // Core results
  persona: PersonaType
  personaDisplayName: string
  confidence: number
  description: string
  
  // Classification details
  weightedScores: Record<PersonaType, number>
  dominantPersonas: PersonaType[]
  personaComposition: 'pure' | 'dual' | 'triple' | 'complex'
  
  // Protocol information
  protocolType: string
  videoUrl?: string
  
  // Additional insights
  populationPercentage: number
  rarityLevel: 'very_common' | 'common' | 'rare' | 'very_rare' | 'extremely_rare'
  businessImpact: string
  transformationPotential: string
}

export interface PersonaProtocol {
  type: string
  name: string
  approach: string
  tone: 'analytical' | 'emotional' | 'direct' | 'exploratory' | 'supportive'
  pacing: 'fast' | 'moderate' | 'slow'
  validationLevel: 'minimal' | 'moderate' | 'high'
  extractionStrategy: string
  successMetrics: string[]
}

export interface PersonaCombination {
  types: PersonaType[]
  displayName: string
  populationPercentage: number
  description: string
  businessArchetype: string
  strengthProfile: string
  challengeProfile: string
  protocolType: string
}

// Population distribution based on research
export const PERSONA_DISTRIBUTION = {
  // Very Common (10%+) - 55% of population
  'ANALITICO-PRAGMATICO': 18,
  'EMOTIVO-INSEGURO': 15,
  'PRAGMATICO': 12,
  'ANALITICO-INSEGURO': 10,
  
  // Common (5-9%) - 42% of population
  'EMOTIVO-CRIATIVO': 8,
  'PRAGMATICO-INSEGURO': 7,
  'ANALITICO': 6,
  'CRIATIVO-INSEGURO': 6,
  'EMOTIVO': 5,
  'ANALITICO-CRIATIVO': 5,
  
  // Rare (2-4%) - 3% of population
  'CRIATIVO': 4,
  'EMOTIVO-PRAGMATICO': 3,
  'PRAGMATICO-CRIATIVO': 3,
  'EMOTIVO-ANALITICO': 3,
  'CRIATIVO-EMOTIVO': 2,
  'ANALITICO-EMOTIVO': 2,
  'PRAGMATICO-EMOTIVO': 2,
  'INSEGURO': 2,
  
  // Very Rare (0.5-1.5%) - <1% of population
  'EMOTIVO-CRIATIVO-INSEGURO': 1.5,
  'ANALITICO-PRAGMATICO-INSEGURO': 1.2,
  'CRIATIVO-INSEGURO-PRAGMATICO': 1.0,
  'ANALITICO-CRIATIVO-INSEGURO': 0.8,
  'EMOTIVO-PRAGMATICO-CRIATIVO': 0.6,
  'ANALITICO-EMOTIVO-CRIATIVO': 0.5,
  
  // Extremely Rare (0.1-0.4%) - 0.5% of population
  'EMOTIVO-ANALITICO-CRIATIVO-INSEGURO': 0.3,
  'MULTIFACETADO-COMPLETO': 0.2
}

// Semantic keywords for analysis
export const SEMANTIC_PATTERNS = {
  [PersonaType.ANALITICO]: {
    keywords: [
      'analiso', 'análise', 'analisar', 'avalio', 'avaliação', 'avaliar',
      'dados', 'data', 'informação', 'informações', 'pesquisa', 'pesquiso',
      'critérios', 'critério', 'comparação', 'comparar', 'comparo',
      'prós e contras', 'vantagens', 'desvantagens', 'método', 'metodologia',
      'processo', 'estrutura', 'estruturado', 'organizado', 'planejamento'
    ],
    patterns: {
      numbered: /(primeiro|segunda?|terceira?|quarto|quinta?|\d+[)\.-]|\b[123456789]\b)/gi,
      structured: /(\d\.|•|→|>|-).*(\n|$)/g
    }
  },
  [PersonaType.EMOTIVO]: {
    keywords: [
      'sinto', 'sente', 'sentir', 'sentimento', 'emoção', 'emocional',
      'coração', 'intuição', 'intuitivo', 'energia', 'vibração',
      'ressoa', 'ressoa comigo', 'faz sentido', 'valores', 'valor',
      'acredito', 'acreditar', 'fé', 'confiança', 'confio',
      'pessoas', 'relacionamentos', 'família', 'amigos', 'amor',
      'paixão', 'propósito', 'missão', 'sonho', 'sonhos'
    ],
    patterns: {
      personalStory: /(quando eu|na minha|minha experiência|lembro que|uma vez|aconteceu)/gi,
      emotional: /(❤|♥|😊|😢|😍|🙏)/g
    }
  },
  [PersonaType.PRAGMATICO]: {
    keywords: [
      'funciona', 'funcionar', 'prático', 'prática', 'rápido', 'rapidamente',
      'eficiente', 'eficiência', 'resultado', 'resultados', 'objetivo',
      'direto', 'diretamente', 'foco', 'focado', 'tempo', 'prazo',
      'simples', 'simplificar', 'otimizar', 'performance', 'produtividade'
    ],
    patterns: {
      concise: /^.{1,100}$/,
      bulletPoints: /^[-•]\s/gm
    }
  },
  [PersonaType.CRIATIVO]: {
    keywords: [
      'possibilidades', 'possibilidade', 'opções', 'alternativas',
      'criativo', 'criatividade', 'criar', 'inovar', 'inovação',
      'ideias', 'ideia', 'imaginação', 'imaginar', 'sonhar',
      'explorar', 'experimentar', 'testar', 'diferentes', 'variações',
      'depende', 'depends', 'contexto', 'situação', 'flexível'
    ],
    patterns: {
      nonLinear: /(\(|\)|,|;|\/|\|)/g,
      alternatives: /\b(ou|e\/ou|talvez|quem sabe)\b/gi
    }
  },
  [PersonaType.INSEGURO]: {
    keywords: [
      'não sei', 'não tenho certeza', 'acho que', 'talvez', 'pode ser',
      'não sou bom', 'não sou boa', 'inseguro', 'insegura', 'dúvida',
      'medo', 'receio', 'preocupação', 'nervoso', 'nervosa',
      'opinião', 'opiniões', 'outros', 'outras pessoas', 'validação'
    ],
    patterns: {
      hesitation: /(\.\.\.|mas |porém |entretanto |\?)/gi,
      uncertainty: /(será|acho|talvez|possivelmente|provavelmente)/gi
    }
  }
}