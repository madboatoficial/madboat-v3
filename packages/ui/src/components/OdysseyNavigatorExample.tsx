/**
 * 🌊 ODYSSEY NAVIGATOR - Exemplo de Uso
 * 
 * Este componente demonstra como usar o OdysseyNavigator com dados
 * realísticos que simulam a jornada de um tripulante através dos
 * métodos de transformação MadBoat.
 * 
 * @author Mandarin Fish
 */

"use client"

import React, { useState } from 'react'
import { OdysseyNavigator, MethodProgress, UserTier, WorldId } from './OdysseyNavigator'

// Mock data que simula um tripulante real
const mockMethodsProgress: MethodProgress[] = [
  {
    worldId: 'personas',
    phase: 'completed',
    completedPhases: 1,
    totalPhases: 1,
    currentPhaseName: 'Completo',
    nextAction: 'Revisitar Persona',
    milestones: ['Teste Realizado', 'Insights Gerados', 'Plano Criado'],
    completedMilestones: 3
  },
  {
    worldId: 'alma',
    phase: 'in_progress',
    completedPhases: 2,
    totalPhases: 4,
    currentPhaseName: 'Mapeamento',
    nextAction: 'Continuar Mapeamento',
    milestones: ['Autenticidade', 'Legado', 'Instagram Autêntico'],
    completedMilestones: 2
  },
  {
    worldId: 'vortice',
    phase: 'locked',
    completedPhases: 0,
    totalPhases: 6,
    currentPhaseName: 'Bloqueado',
    nextAction: 'Upgrade para Premium',
    milestones: ['Audiência', 'Engajamento', 'Conversão', 'Automação'],
    completedMilestones: 0
  },
  {
    worldId: 'odisseia',
    phase: 'locked',
    completedPhases: 0,
    totalPhases: 5,
    currentPhaseName: 'Bloqueado',
    nextAction: 'Upgrade para Enterprise',
    milestones: ['Aspirante', 'Navegador', 'Timoneiro', 'Capitão', 'Almirante'],
    completedMilestones: 0
  }
]

export function OdysseyNavigatorExample() {
  const [userTier, setUserTier] = useState<UserTier>('lead')
  const [currentMethod, setCurrentMethod] = useState<WorldId>('alma')
  
  // Simula ações do usuário
  const handleMethodAccess = (method: WorldId) => {
    console.log(`🚀 Acessando método: ${method}`)
    setCurrentMethod(method)
  }

  const handleAction = (action: string) => {
    console.log(`⚡ Ação executada: ${action}`)
    
    // Simula algumas ações específicas
    if (action === 'continue_alma') {
      alert('🧭 Continuando a jornada A.L.M.A.! Preparando próxima fase...')
    } else if (action === 'achievements') {
      alert('🏆 Abrindo painel de conquistas!')
    } else if (action === 'treasures') {
      alert('✨ Visualizando tesouros coletados!')
    }
  }

  const handleUpgrade = () => {
    if (userTier === 'lead') {
      setUserTier('premium')
      alert('🎉 Upgrade realizado! Vórtice desbloqueado!')
    } else if (userTier === 'premium') {
      setUserTier('enterprise')
      alert('👑 Upgrade Enterprise! Odisseia desbloqueada!')
    }
  }

  return (
    <div className="min-h-screen">
      {/* Controls para demonstração */}
      <div className="fixed top-4 right-4 z-[100] space-y-2 bg-slate-900/90 backdrop-blur-sm p-4 rounded-lg border border-slate-700">
        <p className="text-white text-sm font-semibold mb-2">Demo Controls</p>
        
        <div className="space-y-2">
          <button
            onClick={() => setUserTier('lead')}
            className={`block w-full text-left px-3 py-1 rounded text-sm transition-colors ${
              userTier === 'lead' 
                ? 'bg-blue-500 text-white' 
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Lead (Básico)
          </button>
          
          <button
            onClick={() => setUserTier('premium')}
            className={`block w-full text-left px-3 py-1 rounded text-sm transition-colors ${
              userTier === 'premium' 
                ? 'bg-purple-500 text-white' 
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Premium
          </button>
          
          <button
            onClick={() => setUserTier('enterprise')}
            className={`block w-full text-left px-3 py-1 rounded text-sm transition-colors ${
              userTier === 'enterprise' 
                ? 'bg-red-500 text-white' 
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Enterprise
          </button>
        </div>

        <div className="pt-2 border-t border-slate-600">
          <p className="text-slate-400 text-xs">
            Atual: <span className="text-white font-medium capitalize">{userTier}</span>
          </p>
          <p className="text-slate-400 text-xs">
            Método: <span className="text-white font-medium">{currentMethod}</span>
          </p>
        </div>
      </div>

      {/* Odyssey Navigator */}
      <OdysseyNavigator
        userTier={userTier}
        userName="Sandro Fidelis"
        userLevel={42}
        currentMethod={currentMethod}
        methodsProgress={mockMethodsProgress}
        achievements={15}
        treasures={8}
        onMethodAccess={handleMethodAccess}
        onAction={handleAction}
        onUpgrade={handleUpgrade}
      />
    </div>
  )
}