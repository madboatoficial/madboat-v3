import React from 'react'
import { ErrorBoundary } from './ErrorBoundary'
import { getErrorReporting } from '@madboat/core/monitoring'

interface GlobalErrorBoundaryProps {
  children: React.ReactNode
}

/**
 * Global Error Boundary for the entire application
 * Provides comprehensive error handling and reporting
 */
export function GlobalErrorBoundary({ children }: GlobalErrorBoundaryProps) {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Global Error Boundary:', error)
      console.error('Component Stack:', errorInfo.componentStack)
    }

    // Report to monitoring service
    const errorReporting = getErrorReporting()
    if (errorReporting) {
      errorReporting.reportError(error, {
        componentStack: errorInfo.componentStack,
        source: 'ErrorBoundary',
      })
    }
  }

  return (
    <ErrorBoundary
      onError={handleError}
      fallback={ProductionErrorFallback}
    >
      {children}
    </ErrorBoundary>
  )
}

interface ProductionErrorFallbackProps {
  error: Error
  reset: () => void
}

function ProductionErrorFallback({ error, reset }: ProductionErrorFallbackProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center">
          {/* MadBoat Logo/Icon */}
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto bg-blue-500/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <svg
                className="w-10 h-10 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-white mb-4">
            🌊 Águas turbulentas
          </h1>

          <p className="text-blue-200 mb-8 text-lg leading-relaxed">
            Nosso navio encontrou uma tempestade inesperada.
            Nossa tripulação foi alertada e está trabalhando para resolver.
          </p>

          <div className="space-y-4">
            <button
              onClick={reset}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
            >
              🔄 Tentar novamente
            </button>

            <button
              onClick={() => window.location.href = '/'}
              className="w-full px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-all duration-200"
            >
              🏠 Voltar ao início
            </button>
          </div>

          {/* Wave Animation */}
          <div className="mt-12 opacity-30">
            <svg
              className="w-full h-16"
              viewBox="0 0 400 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0,30 C50,10 100,50 150,30 C200,10 250,50 300,30 C350,10 400,50 400,30 L400,60 L0,60 Z"
                fill="url(#wave-gradient)"
                className="animate-pulse"
              />
              <defs>
                <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                  <stop offset="50%" stopColor="#1D4ED8" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.3" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Error details for development */}
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-8 text-left">
              <summary className="text-sm text-blue-300 cursor-pointer mb-4 hover:text-blue-200">
                🔧 Detalhes técnicos
              </summary>
              <div className="bg-slate-800/50 backdrop-blur rounded-lg p-4 text-xs font-mono">
                <p className="text-red-400 mb-2">{error.message}</p>
                {error.stack && (
                  <pre className="text-gray-400 overflow-auto max-h-40">
                    {error.stack}
                  </pre>
                )}
              </div>
            </details>
          )}
        </div>
      </div>
    </div>
  )
}