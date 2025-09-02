/**
 * 🎮 EXECUTIVE HUD - Game-Inspired Interface
 * 
 * Baseado em pesquisa profunda de game dev forums:
 * - Safe Zone System (Green/Yellow/Red zones)
 * - Corner-based Navigation Pattern
 * - Critical KPI "Health Bar" System
 * - Visual Chunking (5-7 element groups)
 * - Progressive Disclosure
 * - F-Pattern & Z-Pattern eye movement
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
  Activity,
  Calendar,
  Users,
  Award,
  Settings,
  Bell,
  Home,
  BarChart3,
  Timer,
  Play,
  ShipWheel
} from 'lucide-react'

// Types
type MethodStatus = 'completed' | 'active' | 'locked'

interface Module {
  id: string
  title: string
  subtitle: string
  status: MethodStatus
  progress: number
  icon: React.ReactNode
  phases?: Phase[]
  nextAction: string
  priority: 'critical' | 'high' | 'medium' | 'low'
}

interface Phase {
  id: string
  name: string
  status: MethodStatus
  milestone?: string
  progress: number
}


interface ExecutiveHUDProps {
  userName: string
  onModuleSelect: (moduleId: string) => void
  onActionTrigger: (moduleId: string, action: string) => void
  onMilestoneView?: (milestone: string) => void
}

export function ExecutiveHUD({
  userName,
  onModuleSelect,
  onActionTrigger,
  onMilestoneView
}: ExecutiveHUDProps) {
  
  const [activeModule, setActiveModule] = useState<string>('alma')
  const [showBlockedMessage, setShowBlockedMessage] = useState<boolean>(false)
  

  const modules: Module[] = [
    {
      id: 'personas',
      title: 'Identificar Persona Única',
      subtitle: 'Fundação Estratégica para o Mercado Digital',
      status: 'completed',
      progress: 100,
      icon: <Search size={20} />,
      nextAction: 'Revisar',
      priority: 'medium'
    },
    {
      id: 'alma',
      title: 'A.L.M.A.',
      subtitle: 'Transformação',
      status: 'active',
      progress: 50,
      icon: <Compass size={20} />,
      nextAction: 'Continuar',
      priority: 'critical',
      phases: [
        { id: 'autenticidade', name: 'Autenticidade', status: 'completed', milestone: 'Instagram Autêntico', progress: 100 },
        { id: 'legado', name: 'Legado', status: 'active', progress: 60 },
        { id: 'mapeamento', name: 'Mapeamento', status: 'locked', progress: 0 },
        { id: 'aplicacao', name: 'Aplicação', status: 'locked', progress: 0 }
      ]
    },
    {
      id: 'vortice',
      title: 'Vórtice',
      subtitle: 'Audiência',
      status: 'locked',
      progress: 0,
      icon: <Zap size={20} />,
      nextAction: 'Iniciar',
      priority: 'high'
    },
    {
      id: 'odisseia',
      title: 'Odisseia IA',
      subtitle: 'Maestria IA',
      status: 'locked',
      progress: 0,
      icon: <Crown size={20} />,
      nextAction: 'Iniciar',
      priority: 'low'
    }
  ]


  const getStatusIcon = (status: MethodStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-white" />
      case 'active':
        return <Circle size={16} className="text-white fill-current" />
      case 'locked':
        return <Lock size={16} className="text-zinc-600" />
    }
  }

  const active = modules.find(m => m.id === activeModule)!

  return (
    <div className="h-screen bg-zinc-950 text-white flex flex-col overflow-hidden relative">
      {/* Subtle background effect matching login page */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-zinc-800/5 rounded-full blur-3xl" />
      </div>
      
      {/* === RED ZONE: Critical Information Only === */}
      
      {/* TOP-LEFT CORNER: System Status (Yellow Zone → Safe) */}
      <div className="absolute top-4 left-4 z-50">
        <div className="flex items-center gap-2 bg-zinc-950/80 backdrop-blur-sm border border-zinc-800/50 rounded-lg px-3 py-1.5">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs text-zinc-400 font-mono">MADBOAT</span>
        </div>
      </div>

      {/* TOP-RIGHT CORNER: User & Quick Actions (Yellow Zone) */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
        <button className="p-2 bg-zinc-950/80 backdrop-blur-sm border border-zinc-800/50 rounded-lg hover:border-zinc-600 transition-colors">
          <Bell size={16} className="text-zinc-400" />
        </button>
        <button className="p-2 bg-zinc-950/80 backdrop-blur-sm border border-zinc-800/50 rounded-lg hover:border-zinc-600 transition-colors">
          <Settings size={16} className="text-zinc-400" />
        </button>
        <div className="bg-zinc-950/80 backdrop-blur-sm border border-zinc-800/50 rounded-lg px-3 py-1.5">
          <span className="text-xs text-zinc-400">{userName}</span>
        </div>
      </div>

      {/* MADBOAT LOGO: Top Center Header */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-40">
        <div className="flex items-center gap-2 bg-zinc-950/80 backdrop-blur-sm border border-zinc-800/50 rounded-lg px-4 py-2">
          <span className="text-xl font-bold text-white tracking-wide">Mad</span>
          <ShipWheel size={18} className="text-white animate-spin-slow" strokeWidth={2.5} />
          <span className="text-xl font-bold text-white tracking-wide">Boat</span>
        </div>
      </div>

      {/* === GREEN ZONE: Main Content Area === */}
      <div className="flex-1 flex items-center justify-center px-4 pt-24 pb-32 relative">
        <div className="w-full max-w-3xl relative">
          
          {/* Navigation Arrows */}
          <button 
            onClick={() => {
              const currentIndex = modules.findIndex(m => m.id === activeModule)
              const prevModule = modules[currentIndex - 1]
              if (prevModule) {
                setActiveModule(prevModule.id)
                onModuleSelect(prevModule.id)
              }
            }}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-16 w-12 h-12 border border-zinc-700 hover:border-zinc-500 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed"
            disabled={modules.findIndex(m => m.id === activeModule) === 0}
          >
            <ArrowRight size={20} className="rotate-180 text-zinc-400" />
          </button>

          <button 
            onClick={() => {
              const currentIndex = modules.findIndex(m => m.id === activeModule)
              const nextModule = modules[currentIndex + 1]
              if (nextModule) {
                setActiveModule(nextModule.id)
                onModuleSelect(nextModule.id)
              }
            }}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-16 w-12 h-12 border border-zinc-700 hover:border-zinc-500 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed"
            disabled={modules.findIndex(m => m.id === activeModule) === modules.length - 1}
          >
            <ArrowRight size={20} className="text-zinc-400" />
          </button>
          
          {/* CENTRAL FOCUS: Active Module - Fixed Circular Area */}
          <div className="relative flex justify-center">
            {/* Circular Container - Fixed Size for All Modules */}
            <div className="w-96 h-96 border-2 border-dashed border-zinc-800 rounded-full p-8 flex flex-col items-center justify-center">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 border border-zinc-700 rounded-full mb-4 relative">
                  <div className="scale-110">
                    {active.icon}
                  </div>
                  {active.status === 'active' && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center">
                      <div className="w-1 h-1 bg-black rounded-full animate-pulse" />
                    </div>
                  )}
                </div>
                
                <h1 className="text-2xl font-light mb-2 text-white tracking-wide">{active.title}</h1>
                <p className="text-sm text-zinc-500 mb-6 font-light">{active.subtitle}</p>
                
                {/* Progress Visualization - Compact Circular */}
                {active.phases && (
                  <div className="mb-6">
                    <div className="flex justify-center items-center mb-4 gap-2">
                      {active.phases.map((phase, index) => (
                        <div key={phase.id} className="flex items-center">
                          <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                            phase.status === 'completed' ? 'border-white bg-white/10' :
                            phase.status === 'active' ? 'border-white bg-white/20' :
                            'border-zinc-700 bg-zinc-900/20'
                          }`}>
                            <div className="scale-75">
                              {getStatusIcon(phase.status)}
                            </div>
                          </div>
                          {index < active.phases!.length - 1 && (
                            <div className={`w-6 h-px mx-1 ${
                              active.phases![index + 1].status !== 'locked' ? 'bg-zinc-600' : 'bg-zinc-800'
                            }`} />
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {/* Current Phase Detail - Compact */}
                    {active.phases.find(p => p.status === 'active') && (
                      <div className="border border-zinc-800 rounded-xl p-3 bg-zinc-950/30">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-zinc-300 font-light tracking-wide">
                            {active.phases.find(p => p.status === 'active')?.name}
                          </span>
                          <span className="text-xs text-white font-light">
                            {active.phases.find(p => p.status === 'active')?.progress}%
                          </span>
                        </div>
                        <div className="w-full h-0.5 bg-zinc-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-white transition-all duration-500"
                            style={{ width: `${active.phases.find(p => p.status === 'active')?.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Primary Action - Compact Button */}
                <button
                  onClick={() => {
                    if (active.status === 'locked') {
                      setShowBlockedMessage(true)
                      setTimeout(() => setShowBlockedMessage(false), 3000)
                    } else {
                      onActionTrigger(active.id, active.status === 'active' ? 'continue' : 'start')
                    }
                  }}
                  className={`border py-2 px-8 rounded-full transition-all duration-300 font-light tracking-wide flex items-center gap-2 mx-auto text-sm ${
                    active.status === 'locked' 
                      ? 'border-zinc-700 text-zinc-500 hover:border-zinc-600 hover:bg-zinc-900/20' 
                      : 'border-zinc-700 text-white hover:border-white hover:bg-zinc-900/50'
                  }`}
                >
                  {active.nextAction}
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* Blocked Message Notification */}
            {showBlockedMessage && (
              <div className="absolute top-full mt-6 left-1/2 transform -translate-x-1/2 bg-red-950/90 border border-red-800 rounded-xl p-4 backdrop-blur-sm animate-pulse">
                <div className="flex items-center gap-3">
                  <Lock size={18} className="text-red-400" />
                  <span className="text-red-200 font-light">
                    Você precisa ter passado pela jornada anterior
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BOTTOM NAVIGATION: Tripulante Profile Menu (Expanded) */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-zinc-800/50 bg-zinc-950/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-center gap-8">
            
            {/* Menu Items Left */}
            <div className="flex items-center gap-6">
              {/* Dashboard */}
              <button className="flex flex-col items-center gap-3 p-4 rounded-lg hover:bg-zinc-900/50 transition-all duration-200">
                <div className="w-10 h-10 border border-zinc-700 rounded-full flex items-center justify-center">
                  <Home size={18} className="text-zinc-500" />
                </div>
                <span className="text-xs text-zinc-500 font-light">Dashboard</span>
              </button>

              {/* Progresso */}
              <button className="flex flex-col items-center gap-3 p-4 rounded-lg hover:bg-zinc-900/50 transition-all duration-200">
                <div className="w-10 h-10 border border-zinc-700 rounded-full flex items-center justify-center">
                  <BarChart3 size={18} className="text-zinc-500" />
                </div>
                <span className="text-xs text-zinc-500 font-light">Progresso</span>
              </button>
            </div>

            {/* Profile Circle - Centro Expandido */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full border-2 border-zinc-700 bg-zinc-800 flex items-center justify-center mb-2 relative overflow-hidden">
                {/* Placeholder for user photo - will be replaced with actual image */}
                <div className="w-16 h-16 rounded-full bg-zinc-600 flex items-center justify-center">
                  <span className="text-sm font-medium text-zinc-300">
                    {userName.charAt(0).toUpperCase()}
                  </span>
                </div>
                {/* Online indicator */}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-zinc-950" />
              </div>
              <span className="text-sm text-zinc-400 font-light mb-2">{userName}</span>
              
              {/* Play Button - Audio História com texto */}
              <div className="flex items-center gap-2">
                <button className="p-1.5 border border-green-400 rounded-lg hover:bg-green-400/10 transition-all duration-200 group">
                  <Play size={12} className="text-green-400 group-hover:scale-110 transition-transform" />
                </button>
                <span className="text-xs text-zinc-500 font-light">Minha História</span>
              </div>
            </div>

            {/* Menu Items Right */}
            <div className="flex items-center gap-6">
              {/* Calendario */}
              <button className="flex flex-col items-center gap-3 p-4 rounded-lg hover:bg-zinc-900/50 transition-all duration-200">
                <div className="w-10 h-10 border border-zinc-700 rounded-full flex items-center justify-center">
                  <Calendar size={18} className="text-zinc-500" />
                </div>
                <span className="text-xs text-zinc-500 font-light">Agenda</span>
              </button>

              {/* Comunidade */}
              <button className="flex flex-col items-center gap-3 p-4 rounded-lg hover:bg-zinc-900/50 transition-all duration-200">
                <div className="w-10 h-10 border border-zinc-700 rounded-full flex items-center justify-center">
                  <Users size={18} className="text-zinc-500" />
                </div>
                <span className="text-xs text-zinc-500 font-light">Comunidade</span>
              </button>

              {/* Conquistas */}
              <button className="flex flex-col items-center gap-3 p-4 rounded-lg hover:bg-zinc-900/50 transition-all duration-200">
                <div className="w-10 h-10 border border-zinc-700 rounded-full flex items-center justify-center">
                  <Award size={18} className="text-zinc-500" />
                </div>
                <span className="text-xs text-zinc-500 font-light">Conquistas</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CORNER DETAILS: Quick Stats (Yellow Zone) */}
      <div className="absolute bottom-4 left-4 z-30">
        <div className="bg-zinc-950/60 backdrop-blur-sm border border-zinc-800/50 rounded-lg p-2">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Timer size={12} />
            <span>Sessão: 24min</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 z-30">
        <div className="bg-zinc-950/60 backdrop-blur-sm border border-zinc-800/50 rounded-lg p-2">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Award size={12} />
            <span>XP: 1,247</span>
          </div>
        </div>
      </div>
    </div>
  )
}