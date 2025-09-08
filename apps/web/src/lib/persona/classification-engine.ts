/**
 * 🧬 ADVANCED CLASSIFICATION ENGINE
 * Algoritmo de classificação para 26 personas únicas
 * Detecta personas puras, duplas, triplas e complexas
 */

import { 
  PersonaType,
  PersonaClassificationResult,
  QuestionResponse,
  PERSONA_DISTRIBUTION
} from '@/types/persona'
import { PERSONA_QUESTIONS, getPersonaFromAnswer } from './questions'

// Threshold for dominant persona detection
const DOMINANCE_THRESHOLD = 2.5

export function classifyPersonaAdvanced(
  responses: QuestionResponse[]
): PersonaClassificationResult {
  
  // Initialize weighted scores
  const weightedScores: Record<PersonaType, number> = {
    [PersonaType.ANALITICO]: 0,
    [PersonaType.EMOTIVO]: 0,
    [PersonaType.PRAGMATICO]: 0,
    [PersonaType.CRIATIVO]: 0,
    [PersonaType.INSEGURO]: 0
  }

  let totalWeight = 0

  // Process each response
  responses.forEach((response, index) => {
    const question = PERSONA_QUESTIONS[index]
    if (!question) return
    
    const weight = question.weight || 1
    totalWeight += weight

    if (question.isOpenEnded && response.semanticAnalysis) {
      // First question - use semantic analysis with confidence weighting
      const semanticWeight = weight * (response.semanticAnalysis.confidence / 100)
      weightedScores[response.semanticAnalysis.type] += semanticWeight
    } else {
      // Multiple choice questions
      const persona = getPersonaFromAnswer(question.id, response.answer)
      if (persona) {
        weightedScores[persona] += weight
      }
    }
  })

  // Normalize scores by total weight (scale to 0-10)
  Object.keys(weightedScores).forEach(persona => {
    const personaType = persona as PersonaType
    weightedScores[personaType] = (weightedScores[personaType] / totalWeight) * 10
  })

  // Detect dominant personas (≥2.5 threshold)
  const dominantPersonas = Object.entries(weightedScores)
    .filter(([_, score]) => score >= DOMINANCE_THRESHOLD)
    .sort(([, a], [, b]) => b - a)
    .map(([persona, _]) => persona as PersonaType)

  // Determine persona composition and classification
  const result = determinePersonaComposition(dominantPersonas, weightedScores)
  
  return result
}

function determinePersonaComposition(
  dominantPersonas: PersonaType[],
  weightedScores: Record<PersonaType, number>
): PersonaClassificationResult {
  
  let personaResult: PersonaType
  let personaDisplayName: string
  let confidence: number
  let description: string
  let protocolType: string
  let personaComposition: 'pure' | 'dual' | 'triple' | 'complex'
  let populationPercentage: number
  let rarityLevel: 'very_common' | 'common' | 'rare' | 'very_rare' | 'extremely_rare'
  let businessImpact: string
  let transformationPotential: string

  if (dominantPersonas.length === 0) {
    // Fallback - get highest score
    const maxScore = Math.max(...Object.values(weightedScores))
    personaResult = Object.entries(weightedScores)
      .find(([_, score]) => score === maxScore)?.[0] as PersonaType
    
    return createFallbackResult(personaResult, weightedScores)
  }

  if (dominantPersonas.length === 1) {
    // PURE PERSONA
    personaResult = dominantPersonas[0]
    personaComposition = 'pure'
    confidence = calculateConfidence(weightedScores[personaResult], weightedScores)
    personaDisplayName = getPersonaDisplayName(personaResult)
    
    const pureResult = getPurePersonaDetails(personaResult)
    description = pureResult.description
    protocolType = pureResult.protocolType
    populationPercentage = pureResult.populationPercentage
    rarityLevel = getRarityLevel(populationPercentage)
    businessImpact = pureResult.businessImpact
    transformationPotential = pureResult.transformationPotential
    
  } else if (dominantPersonas.length === 2) {
    // DUAL PERSONA
    personaComposition = 'dual'
    const [first, second] = dominantPersonas
    personaResult = first // Primary persona
    confidence = calculateDualConfidence(weightedScores[first], weightedScores[second], weightedScores)
    personaDisplayName = `${getPersonaDisplayName(first)}-${getPersonaDisplayName(second)}`
    
    const dualResult = getDualPersonaDetails(first, second)
    description = dualResult.description
    protocolType = dualResult.protocolType
    populationPercentage = dualResult.populationPercentage
    rarityLevel = getRarityLevel(populationPercentage)
    businessImpact = dualResult.businessImpact
    transformationPotential = dualResult.transformationPotential
    
  } else if (dominantPersonas.length === 3) {
    // TRIPLE PERSONA
    personaComposition = 'triple'
    const [first, second, third] = dominantPersonas
    personaResult = first
    confidence = calculateTripleConfidence(
      weightedScores[first], 
      weightedScores[second], 
      weightedScores[third],
      weightedScores
    )
    personaDisplayName = `${getPersonaDisplayName(first)}-${getPersonaDisplayName(second)}-${getPersonaDisplayName(third)}`
    
    const tripleResult = getTriplePersonaDetails(first, second, third)
    description = tripleResult.description
    protocolType = tripleResult.protocolType
    populationPercentage = tripleResult.populationPercentage
    rarityLevel = getRarityLevel(populationPercentage)
    businessImpact = tripleResult.businessImpact
    transformationPotential = tripleResult.transformationPotential
    
  } else {
    // COMPLEX/MULTIFACETED PERSONA
    personaComposition = 'complex'
    personaResult = dominantPersonas[0]
    confidence = 62 // Complex personas have lower confidence by nature
    personaDisplayName = "Multifacetado-Completo"
    
    description = "MULTIFACETADO-COMPLETO: Você é extremamente versátil e adapta sua abordagem ao contexto. Pode ser analítico no trabalho, emotivo em casa, criativo em projetos e pragmático em crises. Sua versatilidade é um superpoder raro."
    protocolType = "PROTOCOLO_MULTIFACETADO_COMPLETO"
    populationPercentage = 0.2
    rarityLevel = 'extremely_rare'
    businessImpact = "Liderança situacional avançada. Adapta-se a qualquer contexto empresarial com maestria."
    transformationPotential = "Potencial ilimitado. Pode navegar qualquer situação com a abordagem correta."
  }

  return {
    persona: personaResult,
    personaDisplayName,
    confidence,
    description,
    weightedScores,
    dominantPersonas,
    personaComposition,
    protocolType,
    populationPercentage,
    rarityLevel,
    businessImpact,
    transformationPotential,
    videoUrl: getVideoUrl(protocolType)
  }
}

// Helper functions for persona details
function getPurePersonaDetails(persona: PersonaType) {
  const details = {
    [PersonaType.ANALITICO]: {
      description: "ANALÍTICO PURO: Sua mente é uma máquina de processamento estratégico. Você não toma decisões por impulso - cada movimento é calculado, cada escolha é fundamentada em dados sólidos. Isso é uma vantagem competitiva extraordinária.",
      protocolType: "PROTOCOLO_ANALITICO_PURO",
      populationPercentage: 6,
      businessImpact: "Tomada de decisão baseada em dados. Estratégias fundamentadas com ROI comprovado.",
      transformationPotential: "Deixa de segundo-adivinhar decisões e passa a confiar em sua capacidade analítica como superpoder."
    },
    [PersonaType.EMOTIVO]: {
      description: "EMOTIVO PURO: Você é guiado pela bússola interna mais poderosa que existe: sua intuição e seus valores. Suas decisões nascem do coração, e essa sensibilidade é sua maior força no mundo dos negócios.",
      protocolType: "PROTOCOLO_EMOTIVO_PURO",
      populationPercentage: 5,
      businessImpact: "Conexões autênticas e liderança inspiradora. Negócios com alma e propósito.",
      transformationPotential: "Para de se desculpar por ser 'muito emocional' e usa sensibilidade como vantagem para conexões genuínas."
    },
    [PersonaType.PRAGMATICO]: {
      description: "PRAGMÁTICO PURO: Eficiência é seu sobrenome. Enquanto outros debatem, você age. Sua habilidade de cortar caminho direto ao resultado é impressionante e valiosa.",
      protocolType: "PROTOCOLO_PRAGMATICO_PURO",
      populationPercentage: 12,
      businessImpact: "Execução rápida e resultados concretos. Elimina desperdícios e maximiza produtividade.",
      transformationPotential: "Valoriza sua capacidade de 'fazer acontecer' sem culpa por não ser 'mais estratégico'."
    },
    [PersonaType.CRIATIVO]: {
      description: "CRIATIVO PURO: Sua mente é um caleidoscópio de possibilidades. Você não pensa em linhas retas - explora caminhos únicos e encontra soluções que ninguém mais enxergou.",
      protocolType: "PROTOCOLO_CRIATIVO_PURO",
      populationPercentage: 4,
      businessImpact: "Inovação constante e soluções únicas. Cria mercados inexplorados.",
      transformationPotential: "Abraça sua 'mente dispersa' como fonte de inovação revolucionária."
    },
    [PersonaType.INSEGURO]: {
      description: "INSEGURO PURO: Sua cautela é na verdade uma forma de sabedoria. Você questiona, reflete e busca certeza porque entende o valor de uma decisão bem pensada.",
      protocolType: "PROTOCOLO_INSEGURO_PURO",
      populationPercentage: 2,
      businessImpact: "Decisões sólidas e bem fundamentadas. Riscos calculados com análise profunda.",
      transformationPotential: "Reconhece que cautela é sabedoria e reflexão gera decisões mais sólidas."
    }
  }
  
  return details[persona]
}

function getDualPersonaDetails(first: PersonaType, second: PersonaType) {
  const key = `${first}-${second}`
  const reversedKey = `${second}-${first}`
  
  const combinations: Record<string, any> = {
    [`${PersonaType.ANALITICO}-${PersonaType.PRAGMATICO}`]: {
      description: "ANALÍTICO-PRAGMÁTICO: Você combina análise estratégica com execução eficiente. Transforma insights em resultados práticos com velocidade impressionante.",
      protocolType: "PROTOCOLO_HIBRIDO_ANALITICO_PRAGMATICO",
      populationPercentage: 18,
      businessImpact: "Estratégia + Execução. Decisões rápidas baseadas em dados.",
      transformationPotential: "Para de escolher entre 'pensar' ou 'fazer' - faz os dois com maestria."
    },
    [`${PersonaType.EMOTIVO}-${PersonaType.INSEGURO}`]: {
      description: "EMOTIVO-INSEGURO: Você sente profundamente, mas às vezes questiona se suas emoções são válidas. Sua sensibilidade combinada com reflexão cria decisões humanas e cuidadosas.",
      protocolType: "PROTOCOLO_HIBRIDO_EMOTIVO_INSEGURO",
      populationPercentage: 15,
      businessImpact: "Liderança empática com validação. Decisões humanas bem pensadas.",
      transformationPotential: "Reconhece que inteligência emocional + reflexão = liderança autêntica."
    },
    [`${PersonaType.ANALITICO}-${PersonaType.INSEGURO}`]: {
      description: "ANALÍTICO-INSEGURO: Você busca dados e evidências antes de decidir, sempre querendo ter certeza absoluta. Sua análise é profunda e meticulosa.",
      protocolType: "PROTOCOLO_HIBRIDO_ANALITICO_INSEGURO",
      populationPercentage: 10,
      businessImpact: "Análise profunda com validação. Decisões fundamentadas e verificadas.",
      transformationPotential: "Entende que análise + validação não é fraqueza, é rigor científico."
    },
    [`${PersonaType.EMOTIVO}-${PersonaType.CRIATIVO}`]: {
      description: "EMOTIVO-CRIATIVO: Você é movido pela inspiração e guiado pelo coração. Suas criações têm alma e suas ideias nascem de conexões emocionais profundas.",
      protocolType: "PROTOCOLO_HIBRIDO_EMOTIVO_CRIATIVO",
      populationPercentage: 8,
      businessImpact: "Inovação com propósito. Produtos e serviços que tocam emocionalmente.",
      transformationPotential: "Usa emoção + criatividade para criar experiências transformadoras."
    },
    [`${PersonaType.CRIATIVO}-${PersonaType.INSEGURO}`]: {
      description: "CRIATIVO-INSEGURO: Você tem ideias criativas incríveis, mas às vezes duvida do seu valor. Sua criatividade genuína combinada com autocrítica gera inovações refinadas.",
      protocolType: "PROTOCOLO_HIBRIDO_CRIATIVO_INSEGURO",
      populationPercentage: 6,
      businessImpact: "Inovação testada e refinada. Criatividade com controle de qualidade.",
      transformationPotential: "Confia que criatividade + humildade geram inovações mais sólidas."
    },
    [`${PersonaType.PRAGMATICO}-${PersonaType.INSEGURO}`]: {
      description: "PRAGMÁTICO-INSEGURO: Você foca em resultados práticos, mas gosta de validação antes de agir. Sua eficiência é cuidadosa e bem pensada.",
      protocolType: "PROTOCOLO_HIBRIDO_PRAGMATICO_INSEGURO",
      populationPercentage: 7,
      businessImpact: "Execução validada. Resultados rápidos com confirmação.",
      transformationPotential: "Une velocidade com segurança para execução confiável."
    },
    [`${PersonaType.ANALITICO}-${PersonaType.CRIATIVO}`]: {
      description: "ANALÍTICO-CRIATIVO: Você combina rigor analítico com criatividade inovadora. Estrutura processos criativos e encontra soluções inovadoras fundamentadas.",
      protocolType: "PROTOCOLO_HIBRIDO_ANALITICO_CRIATIVO",
      populationPercentage: 5,
      businessImpact: "Inovação estruturada. Criatividade com fundamento científico.",
      transformationPotential: "Transforma dados em insights criativos revolucionários."
    },
    // Add more dual combinations as needed
  }
  
  return combinations[key] || combinations[reversedKey] || {
    description: `Combinação única de ${getPersonaDisplayName(first)} e ${getPersonaDisplayName(second)}.`,
    protocolType: `PROTOCOLO_HIBRIDO_${first}_${second}`,
    populationPercentage: 3,
    businessImpact: "Perfil único com potencial inexplorado.",
    transformationPotential: "Descobre forças únicas na combinação de características."
  }
}

function getTriplePersonaDetails(first: PersonaType, second: PersonaType, third: PersonaType) {
  const key = [first, second, third].sort().join('-')
  
  const combinations: Record<string, any> = {
    [`${PersonaType.ANALITICO}-${PersonaType.INSEGURO}-${PersonaType.PRAGMATICO}`]: {
      description: "ANALÍTICO-PRAGMÁTICO-INSEGURO: Você combina dados, eficiência e validação. Líder que analisa, executa e verifica cada passo.",
      protocolType: "PROTOCOLO_TRIPLO_ANALITICO_PRAGMATICO_INSEGURO",
      populationPercentage: 1.2,
      businessImpact: "Liderança completa: estratégia, execução e validação.",
      transformationPotential: "Entende que rigor + eficiência + cuidado = excelência."
    },
    [`${PersonaType.CRIATIVO}-${PersonaType.EMOTIVO}-${PersonaType.INSEGURO}`]: {
      description: "EMOTIVO-CRIATIVO-INSEGURO: Suas criações têm alma, mas você questiona seu valor. Artista sensível com autocrítica refinada.",
      protocolType: "PROTOCOLO_TRIPLO_EMOTIVO_CRIATIVO_INSEGURO",
      populationPercentage: 1.5,
      businessImpact: "Criações autênticas e refinadas. Arte com alma e qualidade.",
      transformationPotential: "Reconhece que sensibilidade + criatividade + reflexão = obras-primas."
    },
    // Add more triple combinations
  }
  
  return combinations[key] || {
    description: `Perfil triplo complexo: ${getPersonaDisplayName(first)}, ${getPersonaDisplayName(second)} e ${getPersonaDisplayName(third)}.`,
    protocolType: `PROTOCOLO_TRIPLO_${first}_${second}_${third}`,
    populationPercentage: 0.8,
    businessImpact: "Versatilidade avançada em múltiplas dimensões.",
    transformationPotential: "Integra três forças para adaptabilidade superior."
  }
}

// Utility functions
function getPersonaDisplayName(persona: PersonaType): string {
  const names = {
    [PersonaType.ANALITICO]: 'Analítico',
    [PersonaType.EMOTIVO]: 'Emotivo',
    [PersonaType.PRAGMATICO]: 'Pragmático',
    [PersonaType.CRIATIVO]: 'Criativo',
    [PersonaType.INSEGURO]: 'Inseguro'
  }
  return names[persona]
}

function calculateConfidence(
  primaryScore: number, 
  allScores: Record<PersonaType, number>
): number {
  const sortedScores = Object.values(allScores).sort((a, b) => b - a)
  const gap = primaryScore - (sortedScores[1] || 0)
  const baseConfidence = (primaryScore / 10) * 100
  const gapBonus = gap * 5
  
  return Math.min(95, Math.round(baseConfidence + gapBonus))
}

function calculateDualConfidence(
  first: number,
  second: number,
  allScores: Record<PersonaType, number>
): number {
  const combined = first + second
  const total = Object.values(allScores).reduce((a, b) => a + b, 0)
  const dominance = (combined / total) * 100
  
  return Math.min(90, Math.round(dominance + 40))
}

function calculateTripleConfidence(
  first: number,
  second: number,
  third: number,
  allScores: Record<PersonaType, number>
): number {
  const combined = first + second + third
  const total = Object.values(allScores).reduce((a, b) => a + b, 0)
  const dominance = (combined / total) * 100
  
  return Math.min(85, Math.round(dominance + 30))
}

function getRarityLevel(percentage: number): 'very_common' | 'common' | 'rare' | 'very_rare' | 'extremely_rare' {
  if (percentage >= 10) return 'very_common'
  if (percentage >= 5) return 'common'
  if (percentage >= 2) return 'rare'
  if (percentage >= 0.5) return 'very_rare'
  return 'extremely_rare'
}

function getVideoUrl(protocolType: string): string {
  // Map protocol types to video URLs
  // In production, these would be actual video URLs
  return `/videos/${protocolType.toLowerCase()}.mp4`
}

function createFallbackResult(
  persona: PersonaType,
  weightedScores: Record<PersonaType, number>
): PersonaClassificationResult {
  return {
    persona,
    personaDisplayName: getPersonaDisplayName(persona),
    confidence: 45,
    description: "Perfil equilibrado detectado. Recomendamos refazer o questionário para maior precisão.",
    weightedScores,
    dominantPersonas: [persona],
    personaComposition: 'pure',
    protocolType: "PROTOCOLO_GENERICO",
    populationPercentage: 1,
    rarityLevel: 'very_rare',
    businessImpact: "Perfil em desenvolvimento. Potencial a ser descoberto.",
    transformationPotential: "Refaça o teste com mais reflexão para resultados precisos.",
    videoUrl: "/videos/generico.mp4"
  }
}