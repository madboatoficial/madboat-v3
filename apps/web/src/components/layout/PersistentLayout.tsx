"use client"

import { useState, lazy, Suspense } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Sidebar } from './Sidebar'
// Lazy load world components for better performance
const PersonaWorld = lazy(() => import('../features/persona/PersonaWorld').then(m => ({ default: m.PersonaWorld })))
const AlmaWorld = lazy(() => import('../features/alma/AlmaWorld').then(m => ({ default: m.AlmaWorld })))
const VortexWorld = lazy(() => import('../features/vortex/VortexWorld').then(m => ({ default: m.VortexWorld })))
const OdisseiaWorld = lazy(() => import('../features/odisseia/OdisseiaWorld').then(m => ({ default: m.OdisseiaWorld })))
const TreasuresWorld = lazy(() => import('../features/tesouros/TreasuresWorld').then(m => ({ default: m.TreasuresWorld })))
const UpgradeWorld = lazy(() => import('../features/upgrade/UpgradeWorld').then(m => ({ default: m.UpgradeWorld })))

// 🐠 Mandarin Fish creation: Persistent SPA Layout with sidebar
// Instructional design: Never reload the sidebar, seamless world transitions

export type WorldId = 'persona' | 'alma' | 'vortex' | 'odisseia' | 'upgrade' | 'treasures'

interface World {
  id: WorldId
  name: string
  component: React.ComponentType
  category: 'journey' | 'treasures' | 'system'
}

const worlds: World[] = [
  { id: 'persona', name: 'Descoberta de Persona', component: PersonaWorld, category: 'journey' },
  { id: 'alma', name: 'Método ALMA', component: AlmaWorld, category: 'journey' },
  { id: 'vortex', name: 'VORTEX Acceleration', component: VortexWorld, category: 'journey' },
  { id: 'odisseia', name: 'ODISSEIA', component: OdisseiaWorld, category: 'journey' },
  { id: 'treasures', name: 'Tesouros', component: TreasuresWorld, category: 'treasures' },
  { id: 'upgrade', name: 'Upgrade', component: UpgradeWorld, category: 'system' }
]

function PersistentLayoutContent() {
  const [activeWorld, setActiveWorld] = useState<WorldId>('persona')

  const handleWorldChange = (worldId: WorldId) => {
    setActiveWorld(worldId)
  }

  const currentWorld = worlds.find(w => w.id === activeWorld) || worlds[0]

  // Temporary fallback until we debug the SSR issue
  if (typeof window === 'undefined') {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black/20"></div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Persistent Sidebar - Never Reloads */}
      <Sidebar
        activeWorld={activeWorld}
        onWorldChange={handleWorldChange}
        worlds={worlds}
      />

      {/* Dynamic Content Area */}
      <main className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeWorld}
            initial={{ opacity: 0, x: 20, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.98 }}
            transition={{
              duration: 0.4,
              ease: [0.23, 1, 0.32, 1],
              layout: { duration: 0.3 }
            }}
            className="absolute inset-0 w-full h-full"
            style={{ willChange: 'opacity, transform' }}
          >
            <Suspense fallback={
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black/20"></div>
              </div>
            }>
              <currentWorld.component />
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}

export function PersistentLayout() {
  return (
    <BrowserRouter>
      <PersistentLayoutContent />
    </BrowserRouter>
  )
}