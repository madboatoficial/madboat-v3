'use client'

import { useEffect } from 'react'
import { initializeErrorReporting } from '@madboat/core/monitoring'

/**
 * Client-side monitoring initialization
 * This component initializes error reporting and monitoring services
 */
export function MonitoringProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize error reporting
    initializeErrorReporting({
      environment: (process.env.NODE_ENV as any) || 'development',
      enablePerformanceMonitoring: true,
      enableReplay: process.env.NODE_ENV === 'production',
      sampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    })

    // Performance observation
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry) => {
            // Log significant performance events
            if (entry.duration > 100) {
              console.log(`⚡ Performance: ${entry.name} took ${entry.duration.toFixed(2)}ms`)
            }
          })
        })

        observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] })

        // Cleanup observer on unmount
        return () => observer.disconnect()
      } catch (error) {
        console.warn('Performance Observer not supported:', error)
      }
    }
  }, [])

  return <>{children}</>
}

/**
 * Hook for manual performance tracking
 */
export function usePerformanceTracking() {
  const trackOperation = (name: string, operation: () => Promise<any> | any) => {
    const start = performance.now()

    const result = operation()

    if (result instanceof Promise) {
      return result.finally(() => {
        const duration = performance.now() - start
        if (duration > 50) {
          console.log(`📊 ${name}: ${duration.toFixed(2)}ms`)
        }
      })
    } else {
      const duration = performance.now() - start
      if (duration > 50) {
        console.log(`📊 ${name}: ${duration.toFixed(2)}ms`)
      }
      return result
    }
  }

  return { trackOperation }
}