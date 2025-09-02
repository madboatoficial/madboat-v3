/**
 * 🎯 HUD INTERFACE - Futuristic Dashboard
 * 
 * Conceito: Interface tipo HUD (Heads-Up Display) futurística
 * - Estilo sci-fi minimalista
 * - Elementos tipo hologram/projection
 * - Lineart geométrico
 * - Fundo preto absoluto
 * - Informações organizadas em "modules"
 * 
 * Inspirações: Iron Man HUD, Cyberpunk interfaces, Military displays
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
  Target,
  Activity,
  Zap as Lightning,
  Shield,
  Cpu,
  Radar
} from 'lucide-react'

// Types
type MethodStatus = 'completed' | 'active' | 'locked'

interface HUDModule {
  id: string
  title: string
  subtitle: string
  status: MethodStatus
  progress: number
  icon: React.ReactNode
  nextAction: string
}

interface HUDInterfaceProps {
  userName: string
  onModuleSelect: (moduleId: string) => void
  onActionTrigger: (moduleId: string, action: string) => void
}

export function HUDInterface({
  userName,
  onModuleSelect,
  onActionTrigger
}: HUDInterfaceProps) {
  
  const [activeModule, setActiveModule] = useState<string>('alma')
  
  const modules: HUDModule[] = [
    {
      id: 'personas',
      title: 'IDENTIFICAÇÃO',
      subtitle: 'Sistema de Personas',
      status: 'completed',
      progress: 100,
      icon: <Search size={24} />,
      nextAction: 'REVISAR PERFIL'
    },
    {
      id: 'alma',
      title: 'MÉTODO A.L.M.A.',
      subtitle: 'Núcleo de Transformação',
      status: 'active',
      progress: 50,
      icon: <Compass size={24} />,
      nextAction: 'CONTINUAR LEGADO'
    },
    {
      id: 'vortice',
      title: 'SISTEMA VÓRTICE',
      subtitle: 'Construção de Audiência',
      status: 'locked',
      progress: 0,
      icon: <Zap size={24} />,
      nextAction: 'ACESSO NEGADO'
    },
    {
      id: 'odisseia',
      title: 'ODISSEIA I.A.',
      subtitle: 'Protocolo Avançado',
      status: 'locked',
      progress: 0,
      icon: <Crown size={24} />,
      nextAction: 'ACESSO NEGADO'
    }
  ]

  const getModuleStatusColor = (status: MethodStatus) => {
    switch (status) {
      case 'completed': return 'border-green-400 text-green-400'
      case 'active': return 'border-cyan-400 text-cyan-400'
      case 'locked': return 'border-zinc-700 text-zinc-700'
    }
  }

  const getProgressColor = (status: MethodStatus) => {
    switch (status) {
      case 'completed': return 'bg-green-400'
      case 'active': return 'bg-cyan-400'
      case 'locked': return 'bg-zinc-800'
    }
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }} />
      </div>

      {/* Header HUD */}
      <div className="relative z-10 border-b border-zinc-800 bg-black/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 border border-cyan-400 bg-cyan-400/10 flex items-center justify-center">
                <Activity size={16} className="text-cyan-400" />
              </div>
              <div>
                <h1 className="text-xl text-cyan-400 tracking-wider">MADBOAT SYSTEM</h1>
                <p className="text-sm text-zinc-500">OPERADOR: {userName.toUpperCase()}</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-green-400">ONLINE</span>
              </div>
              <div className="text-zinc-500">
                {new Date().toLocaleTimeString('en-US', { hour12: false })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main HUD Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-12 gap-8 h-[calc(100vh-200px)]">
          
          {/* Left Panel - Module List */}
          <div className="col-span-4 space-y-4">
            <div className="border border-zinc-800 bg-zinc-950/50 backdrop-blur-sm p-6">
              <h2 className="text-sm text-zinc-400 tracking-wider mb-6 flex items-center gap-2">
                <Radar size={16} />
                MÓDULOS DISPONÍVEIS
              </h2>
              
              <div className="space-y-4">
                {modules.map((module) => (
                  <div
                    key={module.id}
                    className={`border ${getModuleStatusColor(module.status)} p-4 cursor-pointer transition-all duration-300 ${
                      activeModule === module.id ? 'bg-current/5 border-current' : 'hover:bg-current/5'
                    } ${module.status === 'locked' ? 'cursor-not-allowed' : ''}`}
                    onClick={() => {
                      if (module.status !== 'locked') {
                        setActiveModule(module.id)
                        onModuleSelect(module.id)
                      }
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {module.icon}
                        <div>
                          <h3 className="text-sm font-bold tracking-wide">{module.title}</h3>
                          <p className="text-xs text-zinc-500">{module.subtitle}</p>
                        </div>
                      </div>
                      {module.status === 'completed' && (
                        <CheckCircle size={16} className="text-green-400" />
                      )}
                      {module.status === 'locked' && (
                        <Lock size={16} className="text-zinc-700" />
                      )}
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full h-1 bg-zinc-900 mb-3">
                      <div 
                        className={`h-full transition-all duration-500 ${getProgressColor(module.status)}`}
                        style={{ width: `${module.progress}%` }}
                      />
                    </div>
                    
                    <div className="text-xs tracking-wider">
                      {module.nextAction}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Center Panel - Active Module Detail */}
          <div className="col-span-5">
            {(() => {
              const active = modules.find(m => m.id === activeModule)!
              return (
                <div className="border border-zinc-800 bg-zinc-950/50 backdrop-blur-sm h-full p-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className={`w-12 h-12 border ${getModuleStatusColor(active.status)} flex items-center justify-center`}>
                      {active.icon}
                    </div>
                    <div>
                      <h2 className={`text-2xl font-bold tracking-wider ${getModuleStatusColor(active.status).split(' ')[1]}`}>
                        {active.title}
                      </h2>
                      <p className="text-zinc-500 text-sm">{active.subtitle}</p>
                    </div>
                  </div>

                  {/* Module Specific Content */}
                  <div className="space-y-6">
                    <div className="border-l-2 border-cyan-400/30 pl-4">
                      <h3 className="text-sm text-cyan-400 tracking-wider mb-2">STATUS DO SISTEMA</h3>
                      <p className="text-zinc-300">
                        {active.status === 'completed' && 'Módulo completado com sucesso. Todos os protocolos executados.'}
                        {active.status === 'active' && 'Sistema ativo. Progresso em andamento. Aguardando próxima ação do operador.'}
                        {active.status === 'locked' && 'Acesso restrito. Complete os módulos anteriores para desbloqueio.'}
                      </p>
                    </div>

                    {active.status === 'active' && (
                      <div className="border border-cyan-400/30 p-4 bg-cyan-400/5">
                        <h3 className="text-sm text-cyan-400 tracking-wider mb-4">AÇÃO REQUERIDA</h3>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <Target size={16} className="text-cyan-400" />
                            <span className="text-sm">Fase Legado em progresso</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Lightning size={16} className="text-yellow-400" />
                            <span className="text-sm">Milestone desbloqueado: Instagram Autêntico</span>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => onActionTrigger(active.id, 'continue')}
                          className="mt-6 w-full border border-cyan-400 text-cyan-400 py-3 px-6 hover:bg-cyan-400 hover:text-black transition-all duration-300 tracking-wider text-sm font-bold"
                        >
                          EXECUTAR PROTOCOLO
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })()}
          </div>

          {/* Right Panel - System Stats */}
          <div className="col-span-3 space-y-4">
            <div className="border border-zinc-800 bg-zinc-950/50 backdrop-blur-sm p-6">
              <h3 className="text-sm text-zinc-400 tracking-wider mb-4 flex items-center gap-2">
                <Shield size={16} />
                ESTATÍSTICAS
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-xs text-zinc-500">PROGRESSO TOTAL</span>
                  <span className="text-xs text-cyan-400">37%</span>
                </div>
                <div className="w-full h-1 bg-zinc-900">
                  <div className="h-full bg-cyan-400 w-[37%]" />
                </div>
                
                <div className="pt-4 border-t border-zinc-800 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">MÓDULOS ATIVOS</span>
                    <span className="text-white">1</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">COMPLETADOS</span>
                    <span className="text-green-400">1</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">BLOQUEADOS</span>
                    <span className="text-zinc-600">2</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-zinc-800 bg-zinc-950/50 backdrop-blur-sm p-6">
              <h3 className="text-sm text-zinc-400 tracking-wider mb-4 flex items-center gap-2">
                <Cpu size={16} />
                PRÓXIMOS OBJETIVOS
              </h3>
              
              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 border border-cyan-400" />
                  <span className="text-zinc-300">Finalizar Legado</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 border border-zinc-700" />
                  <span className="text-zinc-600">Iniciar Mapeamento</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 border border-zinc-700" />
                  <span className="text-zinc-600">Desbloquear Vórtice</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Corner HUD Elements */}
      <div className="fixed top-4 right-4 text-xs text-zinc-600 font-mono">
        v2.0.0
      </div>
      <div className="fixed bottom-4 left-4 text-xs text-zinc-600 font-mono">
        SYSTEM_STATUS: OPERATIONAL
      </div>
    </div>
  )
}