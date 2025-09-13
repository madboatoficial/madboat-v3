'use client'

import { useState } from 'react'

// Agent data based on our RLVR config
const agents = [
  {
    id: 'kraken',
    name: 'Kraken',
    emoji: '🐙',
    role: 'Master Orchestrator',
    level: 4,
    xp: 395,
    maxXp: 500,
    status: 'active',
    lastAction: 'Orquestrou limpeza de projeto',
    lastActionTime: '2 min',
    specialization: 'System Orchestration',
    successRate: 94,
    tasksCompleted: 47,
    currentTask: 'Coordenando admin dashboard',
    mood: 'focused' // focused, learning, debugging, celebrating
  },
  {
    id: 'mandarin-fish',
    name: 'Mandarin Fish',
    emoji: '🐠',
    role: 'UI/UX Specialist',
    level: 3,
    xp: 280,
    maxXp: 400,
    status: 'active',
    lastAction: 'Criou cards com animações',
    lastActionTime: '5 min',
    specialization: 'React/Frontend',
    successRate: 92,
    tasksCompleted: 34,
    currentTask: 'Implementando dashboard admin',
    mood: 'creative'
  },
  {
    id: 'poseidon',
    name: 'Poseidon',
    emoji: '⚓',
    role: 'Database Specialist',
    level: 3,
    xp: 340,
    maxXp: 400,
    status: 'idle',
    lastAction: 'Otimizou queries do sistema',
    lastActionTime: '1h',
    specialization: 'Database/Supabase',
    successRate: 98,
    tasksCompleted: 28,
    currentTask: null,
    mood: 'ready'
  },
  {
    id: 'ulisses',
    name: 'Ulisses',
    emoji: '📜',
    role: 'Chronicle Writer',
    level: 2,
    xp: 180,
    maxXp: 300,
    status: 'active',
    lastAction: 'Documentou progresso da sessão',
    lastActionTime: '20 min',
    specialization: 'Documentation',
    successRate: 96,
    tasksCompleted: 23,
    currentTask: 'Atualizando ship logs',
    mood: 'narrative'
  },
  {
    id: 'thaumoctopus',
    name: 'Thaumoctopus',
    emoji: '🐙',
    role: 'Git Master',
    level: 2,
    xp: 150,
    maxXp: 300,
    status: 'idle',
    lastAction: 'Commit agent configurations',
    lastActionTime: '45 min',
    specialization: 'Version Control',
    successRate: 100,
    tasksCompleted: 15,
    currentTask: null,
    mood: 'vigilant'
  },
  {
    id: 'ostra',
    name: 'Ostra',
    emoji: '🦪',
    role: 'Agent Creator',
    level: 2,
    xp: 120,
    maxXp: 300,
    status: 'idle',
    lastAction: 'Criou hierarquia de agentes',
    lastActionTime: '2h',
    specialization: 'Agent Design',
    successRate: 89,
    tasksCompleted: 8,
    currentTask: null,
    mood: 'patient'
  },
  {
    id: 'uncle-mcduck',
    name: 'Uncle McDuck',
    emoji: '💰',
    role: 'Financial Advisor',
    level: 1,
    xp: 85,
    maxXp: 200,
    status: 'learning',
    lastAction: 'Analisou estratégia de preços',
    lastActionTime: '3h',
    specialization: 'Business Strategy',
    successRate: 87,
    tasksCompleted: 5,
    currentTask: 'Estudando mercado de IA',
    mood: 'calculating'
  },
  {
    id: 'uni',
    name: 'UNI',
    emoji: '🌌',
    role: 'Meta-Orchestrator',
    level: 2,
    xp: 200,
    maxXp: 300,
    status: 'monitoring',
    lastAction: 'Avaliou coerência do sistema',
    lastActionTime: '30 min',
    specialization: 'System Coherence',
    successRate: 93,
    tasksCompleted: 12,
    currentTask: 'Monitorando dignidade humana',
    mood: 'transcendent'
  }
]

const getMoodColor = (mood: string) => {
  const colors = {
    focused: 'bg-blue-100 text-blue-800',
    creative: 'bg-pink-100 text-pink-800',
    ready: 'bg-green-100 text-green-800',
    narrative: 'bg-purple-100 text-purple-800',
    vigilant: 'bg-cyan-100 text-cyan-800',
    patient: 'bg-gray-100 text-gray-800',
    calculating: 'bg-yellow-100 text-yellow-800',
    transcendent: 'bg-indigo-100 text-indigo-800',
    learning: 'bg-orange-100 text-orange-800'
  }
  return colors[mood as keyof typeof colors] || 'bg-gray-100 text-gray-800'
}

const getStatusColor = (status: string) => {
  const colors = {
    active: 'bg-green-500',
    idle: 'bg-gray-400',
    learning: 'bg-orange-500',
    monitoring: 'bg-blue-500'
  }
  return colors[status as keyof typeof colors] || 'bg-gray-400'
}

export default function AgentesPage() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Agentes</h1>
        <p className="text-gray-600">Monitoramento dos agentes especializados do MadBoat</p>
      </div>

      {/* Agents Grid - Badge Style Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {agents.map((agent) => (
          <div 
            key={agent.id} 
            className="bg-white border border-black/10 p-6 hover:border-black/20 transition-all duration-300 cursor-pointer relative group"
            onClick={() => setSelectedAgent(agent.id)}
          >
            {/* Line Art Border */}
            <svg 
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 300 400"
              fill="none"
            >
              <rect
                x="1" y="1" width="298" height="398"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-black/10 group-hover:text-black/20 transition-colors duration-300"
              />
              {/* Corner accents */}
              <g className="text-black/15 group-hover:text-black/25 transition-colors duration-300">
                <line x1="0" y1="12" x2="0" y2="0" stroke="currentColor" strokeWidth="1.5"/>
                <line x1="0" y1="0" x2="12" y2="0" stroke="currentColor" strokeWidth="1.5"/>
                <line x1="288" y1="0" x2="300" y2="0" stroke="currentColor" strokeWidth="1.5"/>
                <line x1="300" y1="0" x2="300" y2="12" stroke="currentColor" strokeWidth="1.5"/>
                <line x1="300" y1="388" x2="300" y2="400" stroke="currentColor" strokeWidth="1.5"/>
                <line x1="300" y1="400" x2="288" y2="400" stroke="currentColor" strokeWidth="1.5"/>
                <line x1="12" y1="400" x2="0" y2="400" stroke="currentColor" strokeWidth="1.5"/>
                <line x1="0" y1="400" x2="0" y2="388" stroke="currentColor" strokeWidth="1.5"/>
              </g>
            </svg>

            {/* Status Indicator */}
            <div className="absolute top-4 right-4">
              <div className={`w-4 h-4 rounded-full ${getStatusColor(agent.status)} shadow-lg`}></div>
            </div>

            {/* Agent Avatar & Name */}
            <div className="text-center mb-6 relative z-10">
              <div className="w-16 h-16 mx-auto mb-3 border border-black/10 flex items-center justify-center">
                <span className="text-2xl">{agent.emoji}</span>
              </div>
              <h3 className="text-lg font-medium text-black tracking-wide mb-1">{agent.name}</h3>
              <p className="text-xs text-black/60 font-light tracking-wide">{agent.role}</p>
            </div>

            {/* Level Badge */}
            <div className="text-center mb-6 relative z-10">
              <div className="inline-flex items-center border border-black/20 px-3 py-1">
                <span className="text-xs font-medium text-black tracking-wide">LEVEL {agent.level}</span>
              </div>
            </div>

            {/* XP Progress Bar */}
            <div className="mb-6 relative z-10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-light text-black/60 tracking-wide">Experience</span>
                <span className="text-xs text-black/60 font-light">{agent.xp}/{agent.maxXp}</span>
              </div>
              <div className="w-full h-1 border border-black/10">
                <div 
                  className="bg-black/20 h-full transition-all duration-500 ease-out"
                  style={{ width: `${(agent.xp / agent.maxXp) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3">
                <p className="text-xl font-bold text-green-700">{agent.successRate}%</p>
                <p className="text-xs text-green-600 font-semibold">Success</p>
              </div>
              <div className="text-center bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3">
                <p className="text-xl font-bold text-purple-700">{agent.tasksCompleted}</p>
                <p className="text-xs text-purple-600 font-semibold">Tasks</p>
              </div>
            </div>

            {/* Current Status */}
            <div className="mb-4">
              <div className="flex items-center justify-center">
                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${getMoodColor(agent.mood)}`}>
                  {agent.mood}
                </span>
              </div>
            </div>

            {/* Last Activity */}
            <div className="border-t border-gray-100 pt-4 mb-6">
              <div className="text-center">
                <p className="text-sm text-gray-700 font-medium mb-2">{agent.lastAction}</p>
                <p className="text-xs text-gray-400">há {agent.lastActionTime}</p>
                {agent.currentTask && (
                  <div className="mt-3 bg-blue-50 rounded-lg p-2">
                    <p className="text-xs text-blue-700 font-semibold">🎯 {agent.currentTask}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Specialization Tag */}
            <div className="text-center">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 shadow-sm">
                {agent.specialization}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Agent Detail Modal would go here */}
      {selectedAgent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Detalhes do Agente</h3>
              <button 
                onClick={() => setSelectedAgent(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <p className="text-gray-600">Detalhes detalhados do agente serão implementados aqui.</p>
          </div>
        </div>
      )}
    </div>
  )
}