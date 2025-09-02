/**
 * 🖤 EXECUTIVE PROGRESSION PATH - Ultra Modern Lineart
 * 
 * Conceito: Interface executiva minimalista com lineart clean
 * - Fundo preto absoluto (como tela de login)
 * - Linhas brancas finas para conexões
 * - Tipografia clean sem cores infantis
 * - Ícones outline minimalistas
 * - Espaçamento generoso
 * 
 * @author Mandarin Fish (UI Artist)
 */

"use client"

import React, { useState } from 'react'
import { 
  Search, 
  Compass, 
  Zap, 
  Crown,
  Circle,
  CheckCircle,
  Lock,
  ArrowRight,
  Gift
} from 'lucide-react'

// Types
type CompletionStatus = 'completed' | 'current' | 'locked'

interface Method {
  id: string
  name: string
  subtitle: string
  description: string
  icon: React.ReactNode
  status: CompletionStatus
  phases?: Phase[]
  products?: Product[]
}

interface Phase {
  id: string
  name: string
  status: CompletionStatus
  milestone?: string
}

interface Product {
  id: string
  name: string
  status: CompletionStatus
  price: string
}

interface ExecutiveProgressionPathProps {
  userName: string
  onMethodSelect: (methodId: string) => void
  onPhaseSelect: (methodId: string, phaseId: string) => void
  onMilestoneView: (milestone: string) => void
}

export function ExecutiveProgressionPath({
  userName,
  onMethodSelect,
  onPhaseSelect,
  onMilestoneView
}: ExecutiveProgressionPathProps) {
  
  // Data structure
  const methods: Method[] = [
    {
      id: 'personas',
      name: 'Identificação de Personas',
      subtitle: 'Fundação Estratégica',
      description: 'Compreenda seu perfil empresarial único',
      icon: <Search size={24} />,
      status: 'completed'
    },
    {
      id: 'alma',
      name: 'Método A.L.M.A.',
      subtitle: 'Transformação Empresarial',
      description: 'Autenticidade, Legado, Mapeamento, Aplicação',
      icon: <Compass size={24} />,
      status: 'current',
      phases: [
        { id: 'autenticidade', name: 'Autenticidade', status: 'completed', milestone: 'Instagram Autêntico' },
        { id: 'legado', name: 'Legado', status: 'current' },
        { id: 'mapeamento', name: 'Mapeamento', status: 'locked' },
        { id: 'aplicacao', name: 'Aplicação', status: 'locked' }
      ]
    },
    {
      id: 'vortice',
      name: 'Método Vórtice',
      subtitle: 'Construção de Audiência',
      description: 'Estratégias avançadas de engajamento autêntico',
      icon: <Zap size={24} />,
      status: 'locked'
    },
    {
      id: 'odisseia',
      name: 'Odisseia IA',
      subtitle: 'Maestria em Inteligência Artificial',
      description: '5 níveis progressivos de domínio tecnológico',
      icon: <Crown size={24} />,
      status: 'locked',
      products: [
        { id: 'aspirante', name: 'Aspirante', status: 'locked', price: '$197' },
        { id: 'navegador', name: 'Navegador', status: 'locked', price: '$297' },
        { id: 'timoneiro', name: 'Timoneiro', status: 'locked', price: '$397' },
        { id: 'capitao', name: 'Capitão', status: 'locked', price: '$597' },
        { id: 'almirante', name: 'Almirante', status: 'locked', price: '$897' }
      ]
    }
  ]

  const currentMethod = methods.find(m => m.status === 'current')
  const currentPhase = currentMethod?.phases?.find(p => p.status === 'current')
  
  const getStatusIcon = (status: CompletionStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={20} className="text-white" />
      case 'current':
        return <Circle size={20} className="text-white fill-current" />
      case 'locked':
        return <Lock size={16} className="text-zinc-600" />
      default:
        return <Circle size={20} className="text-zinc-600" />
    }
  }

  const getConnectionLine = (status: CompletionStatus, isLast: boolean = false) => {
    if (isLast) return null
    
    const lineClass = status === 'completed' 
      ? 'border-white' 
      : status === 'current' 
        ? 'border-white border-dashed' 
        : 'border-zinc-800'
    
    return (
      <div className={`w-px h-16 ${lineClass} border-l mx-auto`} />
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light mb-2">Jornada de Transformação</h1>
          <p className="text-zinc-400 text-lg font-light">{userName}</p>
        </div>

        {/* Current Status Summary */}
        {currentMethod && (
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 mb-16">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 border border-zinc-700 rounded-full">
                {currentMethod.icon}
              </div>
              <div>
                <h2 className="text-xl font-medium">{currentMethod.name}</h2>
                <p className="text-zinc-400">{currentMethod.subtitle}</p>
              </div>
            </div>
            
            {currentPhase && (
              <div className="border-l border-zinc-700 pl-6 ml-6">
                <p className="text-zinc-300 mb-2">Fase Atual</p>
                <div className="flex items-center gap-3">
                  <Circle size={16} className="text-white fill-current" />
                  <span className="text-lg">{currentPhase.name}</span>
                </div>
                <button
                  onClick={() => onPhaseSelect(currentMethod.id, currentPhase.id)}
                  className="mt-4 px-6 py-2 border border-zinc-700 rounded-full hover:border-white transition-colors duration-300 flex items-center gap-2 text-sm font-light"
                >
                  Continuar <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Methods Path */}
      <div className="max-w-2xl mx-auto">
        {methods.map((method, methodIndex) => (
          <div key={method.id} className="relative">
            {/* Method Node */}
            <div 
              className={`flex items-start gap-6 p-6 rounded-2xl transition-all duration-300 cursor-pointer ${
                method.status === 'current' 
                  ? 'bg-zinc-950 border border-zinc-800' 
                  : method.status === 'locked'
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-zinc-950 border border-transparent hover:border-zinc-800'
              }`}
              onClick={() => method.status !== 'locked' && onMethodSelect(method.id)}
            >
              {/* Status Icon */}
              <div className="flex-shrink-0 mt-1">
                {getStatusIcon(method.status)}
              </div>

              {/* Method Info */}
              <div className="flex-1">
                <h3 className={`text-lg font-medium mb-1 ${
                  method.status === 'locked' ? 'text-zinc-600' : 'text-white'
                }`}>
                  {method.name}
                </h3>
                <p className={`text-sm mb-3 ${
                  method.status === 'locked' ? 'text-zinc-700' : 'text-zinc-400'
                }`}>
                  {method.subtitle}
                </p>
                <p className={`text-sm ${
                  method.status === 'locked' ? 'text-zinc-700' : 'text-zinc-500'
                }`}>
                  {method.description}
                </p>

                {/* Phases */}
                {method.phases && method.status !== 'locked' && (
                  <div className="mt-4 space-y-2">
                    {method.phases.map((phase) => (
                      <div key={phase.id} className="flex items-center gap-3 py-1">
                        <div className="flex-shrink-0">
                          {getStatusIcon(phase.status)}
                        </div>
                        <span className={`text-sm ${
                          phase.status === 'locked' ? 'text-zinc-600' : 'text-zinc-300'
                        }`}>
                          {phase.name}
                        </span>
                        {phase.milestone && phase.status === 'completed' && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation()
                              onMilestoneView(phase.milestone!)
                            }}
                            className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition-colors px-2 py-1 border border-zinc-700 rounded-full hover:border-zinc-500"
                          >
                            <Gift size={12} />
                            {phase.milestone}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Products (for Odisseia) */}
                {method.products && (
                  <div className="mt-4 grid grid-cols-5 gap-2">
                    {method.products.map((product) => (
                      <div key={product.id} className="text-center">
                        <div className={`w-8 h-8 mx-auto mb-1 rounded-full border flex items-center justify-center ${
                          method.status === 'locked' 
                            ? 'border-zinc-800 text-zinc-700' 
                            : 'border-zinc-600 text-zinc-500'
                        }`}>
                          <Lock size={12} />
                        </div>
                        <p className={`text-xs ${
                          method.status === 'locked' ? 'text-zinc-700' : 'text-zinc-500'
                        }`}>
                          {product.name}
                        </p>
                        <p className={`text-xs ${
                          method.status === 'locked' ? 'text-zinc-800' : 'text-zinc-600'
                        }`}>
                          {product.price}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Connection Line */}
            <div className="flex justify-center py-4">
              {getConnectionLine(method.status, methodIndex === methods.length - 1)}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="max-w-2xl mx-auto mt-16 text-center">
        <p className="text-zinc-600 text-sm font-light">
          Complete cada etapa para desbloquear novos níveis de transformação empresarial
        </p>
      </div>
    </div>
  )
}