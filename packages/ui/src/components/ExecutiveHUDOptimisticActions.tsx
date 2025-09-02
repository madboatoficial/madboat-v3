"use client"

import React, { useOptimistic, useTransition } from 'react'
import { User, ShipWheel, LogOut, ChevronRight } from 'lucide-react'

interface Module {
  id: string
  name: string
  progress: number
  status: 'pending' | 'in_progress' | 'completed'
}

interface ExecutiveHUDOptimisticActionsProps {
  userName: string
  userLevel: number
  currentModule: string
  modules: Module[]
  onModuleSelect: (moduleId: string) => Promise<void>
  onLogout: () => Promise<void>
  updateModuleProgress: (moduleId: string, progress: number) => Promise<void>
}

export function ExecutiveHUDOptimisticActions({
  userName,
  userLevel,
  currentModule,
  modules: initialModules,
  onModuleSelect,
  onLogout,
  updateModuleProgress
}: ExecutiveHUDOptimisticActionsProps) {
  const [isPending, startTransition] = useTransition()
  
  // React 19 useOptimistic - Updates UI instantly, rolls back on error
  const [optimisticModules, updateOptimisticModules] = useOptimistic(
    initialModules,
    (currentModules, { id, progress, status }: { id: string, progress?: number, status?: Module['status'] }) => {
      return currentModules.map(module => {
        if (module.id === id) {
          return { 
            ...module, 
            progress: progress ?? module.progress,
            status: status ?? module.status
          }
        }
        return module
      })
    }
  )

  // Optimistic module selection
  const handleModuleClick = (moduleId: string) => {
    startTransition(async () => {
      // Optimistically update UI immediately
      updateOptimisticModules({ 
        id: moduleId, 
        status: 'in_progress' 
      })
      
      try {
        // Actual server action
        await onModuleSelect(moduleId)
      } catch (error) {
        // useOptimistic automatically reverts on error
        console.error('Failed to select module:', error)
      }
    })
  }

  // Optimistic progress update
  const handleProgressUpdate = (moduleId: string, newProgress: number) => {
    startTransition(async () => {
      // Optimistically update progress immediately
      const newStatus: Module['status'] = newProgress === 100 ? 'completed' : 
                                         newProgress > 0 ? 'in_progress' : 'pending'
      
      updateOptimisticModules({ 
        id: moduleId, 
        progress: newProgress,
        status: newStatus
      })
      
      try {
        // Actual server action
        await updateModuleProgress(moduleId, newProgress)
      } catch (error) {
        // Automatically reverts on error
        console.error('Failed to update progress:', error)
      }
    })
  }

  const getStatusColor = (status: Module['status']) => {
    switch (status) {
      case 'completed': return 'text-green-400'
      case 'in_progress': return 'text-blue-400'
      case 'pending': return 'text-zinc-500'
    }
  }

  const getStatusIcon = (status: Module['status']) => {
    switch (status) {
      case 'completed': return '✅'
      case 'in_progress': return '🔄'
      case 'pending': return '⏸️'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 to-zinc-900 text-white">
      
      {/* Header com status de loading */}
      <header className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            
            {/* Logo + Loading indicator */}
            <div className="flex items-center gap-3">
              <ShipWheel 
                size={24} 
                className={`text-white ${isPending ? 'animate-spin' : 'animate-spin-slow'}`} 
              />
              <div>
                <h1 className="text-xl font-semibold">MadBoat HUD</h1>
                {isPending && (
                  <p className="text-xs text-blue-400">Processando...</p>
                )}
              </div>
            </div>

            {/* User Info */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-medium">{userName}</p>
                <p className="text-sm text-zinc-400">Level {userLevel}</p>
              </div>
              <div className="flex items-center gap-2">
                <User size={20} className="text-zinc-400" />
                <button
                  onClick={() => startTransition(async () => await onLogout())}
                  className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                  disabled={isPending}
                >
                  <LogOut size={18} className="text-zinc-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Modules Grid com Optimistic Updates */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {optimisticModules.map((module) => (
            <div
              key={module.id}
              className={`bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:bg-zinc-800/30 transition-all cursor-pointer group ${
                module.id === currentModule ? 'ring-2 ring-blue-500' : ''
              } ${isPending ? 'opacity-70' : ''}`}
              onClick={() => handleModuleClick(module.id)}
            >
              
              {/* Module Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getStatusIcon(module.status)}</span>
                  <h3 className="font-semibold">{module.name}</h3>
                </div>
                <ChevronRight 
                  size={16} 
                  className="text-zinc-500 group-hover:text-white transition-colors group-hover:translate-x-1"
                />
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-zinc-400">Progresso</span>
                  <span className={`text-sm font-medium ${getStatusColor(module.status)}`}>
                    {module.progress}%
                  </span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      module.status === 'completed' ? 'bg-green-500' :
                      module.status === 'in_progress' ? 'bg-blue-500' : 'bg-zinc-600'
                    }`}
                    style={{ width: `${module.progress}%` }}
                  />
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleProgressUpdate(module.id, Math.min(module.progress + 25, 100))
                  }}
                  className="flex-1 text-xs bg-blue-900/30 text-blue-400 px-3 py-2 rounded-lg hover:bg-blue-900/50 transition-colors"
                  disabled={isPending || module.progress >= 100}
                >
                  +25%
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleProgressUpdate(module.id, 100)
                  }}
                  className="flex-1 text-xs bg-green-900/30 text-green-400 px-3 py-2 rounded-lg hover:bg-green-900/50 transition-colors"
                  disabled={isPending || module.progress >= 100}
                >
                  Complete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* React 19 Benefits Info */}
        <div className="mt-12 bg-zinc-900/30 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            🚀 React 19 useOptimistic Demo
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-blue-400 mb-2">Instant UI Updates</h4>
              <p className="text-zinc-400">Changes appear immediately, no waiting for server</p>
            </div>
            <div>
              <h4 className="font-medium text-green-400 mb-2">Auto Rollback</h4>
              <p className="text-zinc-400">Reverts automatically if server action fails</p>
            </div>
            <div>
              <h4 className="font-medium text-purple-400 mb-2">Better UX</h4>
              <p className="text-zinc-400">Users feel the app is faster and more responsive</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}