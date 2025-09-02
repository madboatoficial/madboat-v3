/**
 * 🌊 CLIENT-ONLY LIGHTHOUSE DASHBOARD WRAPPER
 * 
 * Wraps the LighthouseDashboard to ensure it only renders on the client side,
 * preventing server-side rendering issues with React state and effects.
 * 
 * @author Mandarin Fish (UI Artist & Instructional Designer)
 */

"use client"

import dynamic from 'next/dynamic'
import type { LighthouseDashboardProps } from './LighthouseDashboard'

// Use dynamic import with ssr: false to completely prevent server-side rendering
const LighthouseDashboard = dynamic(
  () => import('./LighthouseDashboard').then(mod => mod.LighthouseDashboard),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <div className="text-white/80 text-sm">Preparando o farol...</div>
        </div>
      </div>
    )
  }
)

interface ClientOnlyLighthouseDashboardProps extends Omit<LighthouseDashboardProps, 'ref'> {}

export function ClientOnlyLighthouseDashboard(props: ClientOnlyLighthouseDashboardProps) {
  return <LighthouseDashboard {...props} />
}