"use client"

/**
 * 🎯 PERSONA IDENTIFICATION PAGE
 * Core freemium module - The foundation of everything
 * Complete journey: intro -> identification -> result
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PersonaIntro, PersonaIdentification, PersonaResult, EpicPersonaDiscovery } from '@madboat/ui'
import type { PersonaClassificationResult } from '@/types/persona'
import { useAuthState } from '@/hooks/use-auth-state'
import { initializeUserHexagonProgress, updateHexagonStatus } from '@/actions/hexagon-actions'
import { PERSONA_QUESTIONS } from '@/lib/persona/questions'
import { analyzeSemanticPatterns } from '@/lib/persona/semantic-analysis'
import { classifyPersonaAdvanced } from '@/lib/persona/classification-engine'

export default function PersonaPage() {
  const router = useRouter()
  const { user } = useAuthState()
  const [stage, setStage] = useState<'intro' | 'identification' | 'result'>('intro')
  const [personaResult, setPersonaResult] = useState<PersonaClassificationResult | null>(null)
  
  // Extract clean name from email
  const userName = user?.email?.split('@')[0]?.split('.').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ') || 'Navigator'

  const handleBeginJourney = () => {
    setStage('identification')
  }

  const handleIdentificationComplete = async (result: PersonaClassificationResult) => {
    setPersonaResult(result)
    setStage('result')
    
    // Save to localStorage for persistence
    localStorage.setItem('madboat_persona', JSON.stringify(result))
    localStorage.setItem('madboat_persona_date', new Date().toISOString())
    
    // Initialize hexagon progress in database and mark persona as completed
    if (user?.id) {
      try {
        // Initialize hexagon progress if not exists
        await initializeUserHexagonProgress(user.id)
        
        // Mark persona hexagon (id 0) as completed
        await updateHexagonStatus(user.id, 0, 'completed')
        
        console.log('Persona completion saved to database')
      } catch (error) {
        console.error('Failed to update hexagon progress:', error)
      }
    }
  }

  const handleContinue = () => {
    // Navigate to main dashboard with persona unlocked
    router.push('/?persona_unlocked=true')
  }

  const handleViewEvolutionMap = () => {
    // Navigate to progresso hexagon map
    router.push('/progresso')
  }

  const handleShare = async () => {
    if (!personaResult) return
    
    const shareText = `🎯 Descobri minha persona única no MadBoat: ${personaResult.personaDisplayName}!\n\n${personaResult.description}\n\nDescubra a sua em: madboat.com`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Minha Persona MadBoat',
          text: shareText
        })
      } catch (err) {
        console.log('Share cancelled or failed')
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(shareText)
      alert('Copiado para a área de transferência!')
    }
  }

  const handleDownload = () => {
    if (!personaResult) return
    
    // Create a detailed report
    const report = `
MADBOAT - RELATÓRIO DE PERSONA ÚNICA
=====================================

Data da Identificação: ${new Date().toLocaleDateString('pt-BR')}

SUA PERSONA: ${personaResult.personaDisplayName}
Confiança: ${personaResult.confidence}%
Raridade: ${personaResult.rarityLevel}
População: ${personaResult.populationPercentage}%

DESCRIÇÃO:
${personaResult.description}

IMPACTO NOS NEGÓCIOS:
${personaResult.businessImpact}

POTENCIAL DE TRANSFORMAÇÃO:
${personaResult.transformationPotential}

PRÓXIMOS PASSOS:
1. Use sua persona para definir sua estratégia digital
2. Aplique os protocolos personalizados em sua comunicação
3. Continue a jornada MadBoat para extrair seu DNA Criativo
4. Desenvolva produtos alinhados com sua autenticidade

=====================================
© MadBoat - Navegando com Autenticidade
    `.trim()
    
    // Create blob and download
    const blob = new Blob([report], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `madboat-persona-${personaResult.personaDisplayName.toLowerCase().replace(/\s+/g, '-')}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const handleExit = () => {
    // Save partial progress if needed
    const responses = localStorage.getItem('madboat_persona_progress')
    if (responses && stage !== 'intro') {
      if (confirm('Você tem progresso salvo. Deseja continuar de onde parou?')) {
        // Load saved progress
        return
      }
    }
    router.push('/')
  }

  return (
    <EpicPersonaDiscovery
      userName={userName}
      questions={PERSONA_QUESTIONS}
      onComplete={handleIdentificationComplete}
      analyzeSemanticPatterns={analyzeSemanticPatterns}
      classifyPersona={classifyPersonaAdvanced}
    />
  )
}