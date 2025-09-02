"use client"

import { ExecutiveHUDOptimisticActions, ClientOnly } from '@madboat/ui'
import { selectModuleAction, updateModuleProgressAction, logoutAction } from '@/actions/module-actions'
import { useState } from 'react'

export default function DemoReact19Page() {
  const [modules] = useState([
    { id: 'auth', name: 'Authentication', progress: 100, status: 'completed' as const },
    { id: 'dashboard', name: 'Dashboard', progress: 45, status: 'in_progress' as const },
    { id: 'personas', name: 'Personas', progress: 0, status: 'pending' as const },
    { id: 'worlds', name: '3 Worlds', progress: 25, status: 'in_progress' as const },
    { id: 'gamification', name: 'Gamification', progress: 0, status: 'pending' as const },
    { id: 'ai-integration', name: 'AI Integration', progress: 75, status: 'in_progress' as const },
  ])

  return (
    <ClientOnly>
      <div className="min-h-screen bg-zinc-950">
        
        {/* Demo Header */}
        <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-b border-zinc-800">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white mb-2">
                🚀 React 19 Demo - useOptimistic
              </h1>
              <p className="text-zinc-300 mb-4">
                Clique nos módulos ou botões para ver updates instantâneos!
              </p>
              <div className="bg-zinc-900/50 rounded-lg p-4 max-w-2xl mx-auto">
                <h3 className="font-semibold text-yellow-400 mb-2">✨ Como funciona:</h3>
                <ul className="text-sm text-zinc-300 space-y-1 text-left">
                  <li>• <strong>Instant UI:</strong> Mudanças aparecem imediatamente</li>
                  <li>• <strong>Server Actions:</strong> Processamento real no servidor</li>
                  <li>• <strong>Auto Rollback:</strong> Reverte se o servidor falhar</li>
                  <li>• <strong>Better UX:</strong> Interface mais responsiva</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* React 19 HUD Demo */}
        <ExecutiveHUDOptimisticActions
          userName="React 19 Demo User"
          userLevel={19}
          currentModule="dashboard"
          modules={modules}
          onModuleSelect={selectModuleAction}
          onLogout={logoutAction}
          updateModuleProgress={updateModuleProgressAction}
        />

        {/* Technical Details */}
        <div className="bg-zinc-900/30 border-t border-zinc-800">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              <div className="bg-zinc-900/50 rounded-xl p-6">
                <h3 className="font-semibold text-blue-400 mb-3">🔄 useOptimistic</h3>
                <pre className="text-xs bg-zinc-950 rounded p-3 overflow-x-auto text-zinc-300">
{`const [optimisticModules, updateOptimistic] = useOptimistic(
  modules,
  (current, { id, progress }) => 
    current.map(m => 
      m.id === id ? {...m, progress} : m
    )
)`}
                </pre>
              </div>

              <div className="bg-zinc-900/50 rounded-xl p-6">
                <h3 className="font-semibold text-green-400 mb-3">⚡ Server Actions</h3>
                <pre className="text-xs bg-zinc-950 rounded p-3 overflow-x-auto text-zinc-300">
{`'use server'

export async function updateProgress(
  id: string, 
  progress: number
): Promise<void> {
  // Real server processing
  await database.update(id, progress)
}`}
                </pre>
              </div>

              <div className="bg-zinc-900/50 rounded-xl p-6">
                <h3 className="font-semibold text-purple-400 mb-3">🎯 useTransition</h3>
                <pre className="text-xs bg-zinc-950 rounded p-3 overflow-x-auto text-zinc-300">
{`const [isPending, startTransition] = useTransition()

startTransition(async () => {
  updateOptimistic({id, progress})
  await serverAction(id, progress)
})`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClientOnly>
  )
}