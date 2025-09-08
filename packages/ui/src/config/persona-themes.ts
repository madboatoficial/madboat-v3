/**
 * 🎨 PERSONA THEME SYSTEM
 * Each of the 26 personas gets unique visual and linguistic identity
 * Colors, symbols, language patterns, and emotional tones
 */

import React from 'react'
import { PersonaType } from '@/types/persona'
import { LucideIcon } from 'lucide-react'
import { 
  Brain,
  Heart,
  Target,
  Sparkles,
  Shield,
  Zap,
  Compass,
  Crown,
  Gem,
  Flame,
  Star,
  Eye,
  MapPin,
  TrendingUp,
  Users,
  Award,
  Mountain,
  Lightbulb,
  Anchor,
  Rocket,
  TreePine,
  Waves,
  Sun,
  Moon,
  Wind,
  Globe
} from 'lucide-react'

export interface PersonaTheme {
  // Visual Identity
  primaryColor: string
  secondaryColor: string
  accentColor: string
  gradientFrom: string
  gradientTo: string
  symbol: LucideIcon
  
  // Linguistic Patterns
  greeting: string
  congratulations: string
  encouragement: string
  tone: 'formal' | 'casual' | 'inspiring' | 'technical' | 'warm' | 'bold'
  
  // Result Page Customization
  resultTitle: string
  impactDescription: string
  nextStepsIntro: string
  
  // Emotional Resonance
  energyLevel: 'calm' | 'moderate' | 'high' | 'intense'
  personality: string[]
}

export const PERSONA_THEMES: Record<PersonaType, PersonaTheme> = {
  [PersonaType.ANALITICO]: {
    primaryColor: 'from-blue-600 to-indigo-700',
    secondaryColor: 'from-blue-600/20 to-indigo-600/20',
    accentColor: 'text-blue-400',
    gradientFrom: 'from-blue-400',
    gradientTo: 'to-indigo-500',
    symbol: Brain,
    
    greeting: 'Dados não mentem, e nem sua essência analítica',
    congratulations: 'Análise concluída com precisão científica',
    encouragement: 'Sua mente analítica é sua maior ferramenta estratégica',
    tone: 'technical',
    
    resultTitle: 'Sua Persona Analítica Foi Decodificada',
    impactDescription: 'Você processa informações de forma sistemática e toma decisões baseadas em evidências concretas.',
    nextStepsIntro: 'Seus próximos protocolos são baseados em métricas e performance',
    
    energyLevel: 'moderate',
    personality: ['Lógico', 'Sistemático', 'Baseado em dados', 'Estratégico']
  },

  [PersonaType.EMOTIVO]: {
    primaryColor: 'from-pink-600 to-rose-700',
    secondaryColor: 'from-pink-600/20 to-rose-600/20',
    accentColor: 'text-pink-400',
    gradientFrom: 'from-pink-400',
    gradientTo: 'to-rose-500',
    symbol: Heart,
    
    greeting: 'Sua autenticidade emocional é sua força mais genuína',
    congratulations: 'Sua jornada de coração foi revelada com sensibilidade',
    encouragement: 'Sua capacidade de conectar corações transforma negócios',
    tone: 'warm',
    
    resultTitle: 'Seu Coração Empresarial Foi Revelado',
    impactDescription: 'Você lidera com empatia e cria conexões genuínas que geram lealdade duradoura.',
    nextStepsIntro: 'Sua jornada será guiada pela autenticidade e conexão humana',
    
    energyLevel: 'moderate',
    personality: ['Empático', 'Autêntico', 'Conectivo', 'Inspirador']
  },

  [PersonaType.PRAGMATICO]: {
    primaryColor: 'from-emerald-600 to-green-700',
    secondaryColor: 'from-emerald-600/20 to-green-600/20',
    accentColor: 'text-emerald-400',
    gradientFrom: 'from-emerald-400',
    gradientTo: 'to-green-500',
    symbol: Target,
    
    greeting: 'Objetividade e resultados definem sua essência prática',
    congratulations: 'Identificação completa: foco total nos resultados',
    encouragement: 'Sua abordagem prática transforma ideias em realidade',
    tone: 'formal',
    
    resultTitle: 'Sua Eficiência Estratégica Foi Mapeada',
    impactDescription: 'Você transforma visões em ações concretas, priorizando sempre o que gera impacto real.',
    nextStepsIntro: 'Seus protocolos focam em execução e resultados mensuráveis',
    
    energyLevel: 'high',
    personality: ['Objetivo', 'Eficiente', 'Focado', 'Realizador']
  },

  [PersonaType.CRIATIVO]: {
    primaryColor: 'from-purple-600 to-violet-700',
    secondaryColor: 'from-purple-600/20 to-violet-600/20',
    accentColor: 'text-purple-400',
    gradientFrom: 'from-purple-400',
    gradientTo: 'to-violet-500',
    symbol: Sparkles,
    
    greeting: 'Sua criatividade é a força que rompe todas as barreiras',
    congratulations: 'Sua essência criativa foi capturada em toda sua magnitude',
    encouragement: 'Sua originalidade é a diferenciação que o mercado procura',
    tone: 'inspiring',
    
    resultTitle: 'Seu DNA Criativo Foi Destravado',
    impactDescription: 'Você vê possibilidades onde outros veem limitações, criando soluções inovadoras e únicas.',
    nextStepsIntro: 'Sua jornada será uma explosão de criatividade estratégica',
    
    energyLevel: 'intense',
    personality: ['Inovador', 'Visionário', 'Original', 'Disruptivo']
  },

  [PersonaType.INSEGURO]: {
    primaryColor: 'from-amber-600 to-orange-700',
    secondaryColor: 'from-amber-600/20 to-orange-600/20',
    accentColor: 'text-amber-400',
    gradientFrom: 'from-amber-400',
    gradientTo: 'to-orange-500',
    symbol: Shield,
    
    greeting: 'Sua cautela é sabedoria, sua prudência é força',
    congratulations: 'Sua jornada de autoconhecimento foi corajosamente completada',
    encouragement: 'Sua reflexão profunda gera decisões mais sólidas',
    tone: 'warm',
    
    resultTitle: 'Sua Fortaleza Interior Foi Descoberta',
    impactDescription: 'Você analisa cuidadosamente cada movimento, construindo bases sólidas para crescimento sustentável.',
    nextStepsIntro: 'Sua evolução será gradual, consistente e profundamente enraizada',
    
    energyLevel: 'calm',
    personality: ['Reflexivo', 'Prudente', 'Cuidadoso', 'Profundo']
  }
}

export function getPersonaTheme(persona: PersonaType): PersonaTheme {
  return PERSONA_THEMES[persona] || PERSONA_THEMES[PersonaType.ANALITICO]
}

export function getPersonaSymbol(persona: PersonaType, size = 'w-8 h-8'): JSX.Element {
  const theme = getPersonaTheme(persona)
  const Symbol = theme.symbol
  return React.createElement(Symbol, { className: `${size} ${theme.accentColor}` })
}

export function getPersonaGradient(persona: PersonaType): string {
  const theme = getPersonaTheme(persona)
  return `bg-gradient-to-br ${theme.primaryColor}`
}

export function getPersonaAccent(persona: PersonaType): string {
  const theme = getPersonaTheme(persona)
  return theme.accentColor
}