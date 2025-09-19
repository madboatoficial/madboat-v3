"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Navigation, Compass, Map, Trophy, BookOpen, Target } from 'lucide-react'

// 🐠 Mandarin Fish creation: Lighthouse-style performance dashboard
// Instructional design: Progress visualization that guides users toward completion

export type WorldId = 'persona' | 'alma' | 'vortice' | 'odisseia' | 'upgrade' | 'treasures'

export interface LighthouseMetric {
  id: string
  name: string
  score: number
  maxScore: number
  icon: React.ComponentType<{ size?: number }>
  color: string
  description: string
}

export interface LighthouseDashboardProps {
  worldId: WorldId
  metrics: LighthouseMetric[]
  overallScore: number
  onMetricClick?: (metric: LighthouseMetric) => void
  className?: string
}

// Lighthouse beam animation component
const LighthouseBeam: React.FC<{ score: number; isActive: boolean }> = ({ score, isActive }) => {
  const beamIntensity = Math.max(0.1, score / 100)

  return (
    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-32 pointer-events-none">
      <motion.div
        className="absolute inset-0"
        style={{
          background: `conic-gradient(from 0deg, transparent, rgba(59, 130, 246, ${beamIntensity}), transparent)`,
          clipPath: 'polygon(45% 0%, 55% 0%, 70% 100%, 30% 100%)'
        }}
        animate={isActive ? {
          rotate: [0, 360],
          opacity: [0.3, 0.8, 0.3]
        } : {}}
        transition={{
          rotate: { duration: 4, repeat: Infinity, ease: "linear" },
          opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }}
      />
    </div>
  )
}

// Individual metric card component
const MetricCard: React.FC<{
  metric: LighthouseMetric
  onClick?: () => void
  delay: number
}> = ({ metric, onClick, delay }) => {
  const percentage = (metric.score / metric.maxScore) * 100
  const isGood = percentage >= 80
  const isOk = percentage >= 60

  const getScoreColor = () => {
    if (isGood) return 'text-green-400'
    if (isOk) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getProgressColor = () => {
    if (isGood) return 'from-green-400 to-emerald-500'
    if (isOk) return 'from-yellow-400 to-orange-500'
    return 'from-red-400 to-pink-500'
  }

  return (
    <motion.button
      onClick={onClick}
      className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 hover:bg-slate-700/50 transition-colors duration-200 text-left w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className={`p-1 rounded ${metric.color}`}>
            <metric.icon size={16} className="text-white" />
          </div>
          <span className="text-white font-medium text-sm">{metric.name}</span>
        </div>
        <span className={`font-bold text-lg ${getScoreColor()}`}>
          {metric.score}
        </span>
      </div>

      <div className="mb-2">
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div
            className={`h-2 rounded-full bg-gradient-to-r ${getProgressColor()}`}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, delay: delay + 0.2 }}
          />
        </div>
      </div>

      <p className="text-gray-400 text-xs">{metric.description}</p>
    </motion.button>
  )
}

// Overall score display component
const OverallScore: React.FC<{ score: number }> = ({ score }) => {
  const getScoreColor = () => {
    if (score >= 80) return 'from-green-400 to-emerald-500'
    if (score >= 60) return 'from-yellow-400 to-orange-500'
    return 'from-red-400 to-pink-500'
  }

  const getScoreLabel = () => {
    if (score >= 80) return 'Excelente'
    if (score >= 60) return 'Bom'
    return 'Precisa Melhorar'
  }

  return (
    <div className="relative">
      {/* Lighthouse structure */}
      <div className="relative w-24 h-32 mx-auto mb-4">
        {/* Lighthouse beam */}
        <LighthouseBeam score={score} isActive={score > 0} />

        {/* Lighthouse body */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-24 bg-gradient-to-t from-slate-700 to-slate-600 rounded-t-lg">
          {/* Lighthouse stripes */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-transparent opacity-20" />
          <div className="absolute top-2 left-1 right-1 h-2 bg-red-500 rounded" />
          <div className="absolute top-6 left-1 right-1 h-2 bg-white rounded" />
          <div className="absolute top-10 left-1 right-1 h-2 bg-red-500 rounded" />
        </div>

        {/* Lighthouse light */}
        <motion.div
          className={`absolute top-0 left-1/2 transform -translate-x-1/2 w-6 h-8 bg-gradient-to-t ${getScoreColor()} rounded-full`}
          animate={{
            boxShadow: score > 0 ? [
              '0 0 10px rgba(59, 130, 246, 0.5)',
              '0 0 20px rgba(59, 130, 246, 0.8)',
              '0 0 10px rgba(59, 130, 246, 0.5)'
            ] : ['0 0 0px rgba(59, 130, 246, 0)']
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Score display */}
      <div className="text-center">
        <motion.div
          className={`text-4xl font-bold bg-gradient-to-r ${getScoreColor()} bg-clip-text text-transparent`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {score}
        </motion.div>
        <div className="text-gray-400 text-sm mt-1">{getScoreLabel()}</div>
      </div>
    </div>
  )
}

export const LighthouseDashboard: React.FC<LighthouseDashboardProps> = ({
  worldId,
  metrics,
  overallScore,
  onMetricClick,
  className = ""
}) => {
  // Get world-specific configuration
  const getWorldConfig = () => {
    const configs = {
      persona: {
        title: 'Descoberta de Persona',
        subtitle: 'Análise de Performance da Identificação',
        color: 'from-blue-500 to-cyan-500'
      },
      alma: {
        title: 'Método ALMA',
        subtitle: 'Métricas de Transformação Estruturada',
        color: 'from-indigo-500 to-purple-500'
      },
      vortice: {
        title: 'VÓRTICE Acceleration',
        subtitle: 'Indicadores de Aceleração de Resultados',
        color: 'from-purple-500 to-pink-500'
      },
      odisseia: {
        title: 'ODISSEIA',
        subtitle: 'Dashboard de Maestria Completa',
        color: 'from-amber-500 to-orange-500'
      },
      treasures: {
        title: 'Tesouros Coletados',
        subtitle: 'Performance de Estratégias Aplicadas',
        color: 'from-green-500 to-emerald-500'
      },
      upgrade: {
        title: 'Sistema de Upgrade',
        subtitle: 'Métricas de Evolução da Conta',
        color: 'from-cyan-500 to-blue-500'
      }
    }
    return configs[worldId] || configs.persona
  }

  const worldConfig = getWorldConfig()

  return (
    <div className={`w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="relative p-6 border-b border-slate-700/50">
        <div className={`absolute inset-0 bg-gradient-to-r ${worldConfig.color} opacity-5`} />
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-2">
            <Navigation className="text-blue-400" size={24} />
            <h2 className="text-white text-xl font-bold">{worldConfig.title}</h2>
          </div>
          <p className="text-gray-400 text-sm">{worldConfig.subtitle}</p>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Overall Score */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/30 rounded-lg p-6 text-center">
              <h3 className="text-white font-medium mb-4 flex items-center justify-center space-x-2">
                <Target size={16} />
                <span>Score Geral</span>
              </h3>
              <OverallScore score={overallScore} />
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-medium mb-4 flex items-center space-x-2">
              <BookOpen size={16} />
              <span>Métricas Detalhadas</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {metrics.map((metric, index) => (
                <MetricCard
                  key={metric.id}
                  metric={metric}
                  onClick={() => onMetricClick?.(metric)}
                  delay={index * 0.1}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="mt-6 bg-slate-800/30 rounded-lg p-4">
          <h4 className="text-white font-medium mb-3 flex items-center space-x-2">
            <Compass size={16} />
            <span>Insights de Performance</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center p-3 bg-slate-700/30 rounded">
              <div className="text-green-400 font-bold text-lg">
                {metrics.filter(m => (m.score / m.maxScore) >= 0.8).length}
              </div>
              <div className="text-gray-400">Métricas Excelentes</div>
            </div>
            <div className="text-center p-3 bg-slate-700/30 rounded">
              <div className="text-yellow-400 font-bold text-lg">
                {metrics.filter(m => {
                  const ratio = m.score / m.maxScore
                  return ratio >= 0.6 && ratio < 0.8
                }).length}
              </div>
              <div className="text-gray-400">Métricas Boas</div>
            </div>
            <div className="text-center p-3 bg-slate-700/30 rounded">
              <div className="text-red-400 font-bold text-lg">
                {metrics.filter(m => (m.score / m.maxScore) < 0.6).length}
              </div>
              <div className="text-gray-400">Precisam Melhorar</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LighthouseDashboard