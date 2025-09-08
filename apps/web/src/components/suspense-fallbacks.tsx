import { Loader2, ShipWheel } from 'lucide-react'

interface SuspenseFallbackProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'spinner' | 'boat' | 'skeleton'
}

export function SuspenseFallback({ 
  message = "Carregando...", 
  size = 'md',
  variant = 'boat' 
}: SuspenseFallbackProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  }

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }

  if (variant === 'skeleton') {
    return (
      <div className="animate-pulse space-y-4 p-4">
        <div className="h-4 bg-zinc-800 rounded w-3/4"></div>
        <div className="h-4 bg-zinc-800 rounded w-1/2"></div>
        <div className="h-4 bg-zinc-800 rounded w-5/6"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {variant === 'boat' ? (
        <ShipWheel 
          className={`${sizeClasses[size]} text-white animate-spin`} 
          strokeWidth={2.5} 
        />
      ) : (
        <Loader2 
          className={`${sizeClasses[size]} text-white animate-spin`} 
        />
      )}
      <span className={`text-white/60 ${textSizeClasses[size]}`}>
        {message}
      </span>
    </div>
  )
}

// Specific loading components for different parts of the app
export function AuthLoadingSuspense() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <SuspenseFallback 
        message="Verificando autenticação..." 
        size="lg" 
        variant="boat" 
      />
    </div>
  )
}

export function DashboardLoadingSuspense() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <SuspenseFallback 
        message="Preparando dashboard..." 
        size="lg" 
        variant="boat" 
      />
    </div>
  )
}

export function LoginLoadingSuspense() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <SuspenseFallback 
        message="Carregando login..." 
        size="md" 
        variant="boat" 
      />
    </div>
  )
}

export function ModuleLoadingSuspense() {
  return (
    <div className="flex items-center justify-center p-8">
      <SuspenseFallback 
        message="Carregando módulo..." 
        size="md" 
        variant="boat" 
      />
    </div>
  )
}

// Component loading skeletons
export function ExecutiveHUDSkeleton() {
  return (
    <div className="min-h-screen bg-zinc-950 p-6 animate-pulse">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header skeleton */}
        <div className="flex justify-between items-center mb-8">
          <div className="h-8 bg-zinc-800 rounded w-48"></div>
          <div className="h-8 bg-zinc-800 rounded w-24"></div>
        </div>
        
        {/* Grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-zinc-800 rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * 🚀 REACT 19 SUSPENSE BENEFITS:
 * 
 * ✅ Granular loading states for different components
 * ✅ Consistent loading UX across the app
 * ✅ Skeleton screens for better perceived performance
 * ✅ Size and variant flexibility
 * ✅ Maintains MadBoat design system
 * ✅ TypeScript strict mode compliance
 */