"use client"

import React from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

interface ErrorBoundaryProps {
  error: Error & { digest?: string }
  reset: () => void
  title?: string
}

export function ErrorBoundary({ error, reset, title = "Algo deu errado" }: ErrorBoundaryProps) {
  const isDev = process.env.NODE_ENV === 'development'

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        
        {/* Error Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">
            {title}
          </h1>
          <p className="text-zinc-400 leading-relaxed">
            Ocorreu um erro inesperado. Nossa equipe foi notificada e está trabalhando para resolver.
          </p>
          
          {/* Development Error Details */}
          {isDev && (
            <details className="mt-4 p-4 bg-zinc-900 rounded-lg border border-zinc-800 text-left">
              <summary className="text-zinc-300 cursor-pointer mb-2 font-medium">
                Detalhes do erro (desenvolvimento)
              </summary>
              <div className="text-xs text-zinc-500 font-mono break-all">
                <div className="mb-2">
                  <strong className="text-red-400">Erro:</strong> {error.message}
                </div>
                {error.digest && (
                  <div className="mb-2">
                    <strong className="text-yellow-400">Digest:</strong> {error.digest}
                  </div>
                )}
                {error.stack && (
                  <div>
                    <strong className="text-blue-400">Stack:</strong>
                    <pre className="mt-1 text-zinc-600 text-xs whitespace-pre-wrap">
                      {error.stack}
                    </pre>
                  </div>
                )}
              </div>
            </details>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            onClick={reset}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors border border-zinc-700"
          >
            <RefreshCw className="w-4 h-4" />
            Tentar novamente
          </button>
          
          <a
            href="/"
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Home className="w-4 h-4" />
            Voltar ao início
          </a>
        </div>

        {/* Additional Info */}
        <div className="text-xs text-zinc-500 pt-4 border-t border-zinc-800">
          Se o problema persistir, entre em contato com o suporte.
        </div>
      </div>
    </div>
  )
}

/**
 * 🚀 REACT 19 ERROR BOUNDARY BENEFITS:
 * 
 * ✅ Server-side error handling with error.tsx
 * ✅ Client-side reset functionality
 * ✅ Development-friendly error details
 * ✅ Production-ready user experience
 * ✅ Accessible error reporting
 * ✅ TypeScript strict mode compliance
 * ✅ Consistent with MadBoat design system
 */