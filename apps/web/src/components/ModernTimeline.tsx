"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTimelineEvents, type TimelineEvent } from '../hooks/use-timeline-data'

// Componente para linha ondulante sutil no background (copiado do login)
function SubtleLineWave({
  amplitude = 20,
  frequency = 0.015,
  speed = 0.3,
  opacity = 0.03,
  strokeWidth = "0.5"
}: {
  amplitude?: number
  frequency?: number
  speed?: number
  opacity?: number
  strokeWidth?: string
}) {
  const [offset, setOffset] = useState(0)
  const [isClient, setIsClient] = useState(false)

  // Prevent hydration mismatch by only starting animations on client
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    const interval = setInterval(() => {
      setOffset(prev => prev + speed)
    }, 50)
    return () => clearInterval(interval)
  }, [speed, isClient])

  const generatePath = () => {
    const points = []
    for (let x = 0; x <= 100; x += 1) {
      const y = 50 + amplitude * Math.sin((x + offset) * frequency)
      points.push(`${x},${y}`)
    }
    return `M ${points.join(' L ')}`
  }

  // Render static version on server, animated on client
  if (!isClient) {
    const staticPoints = []
    for (let x = 0; x <= 100; x += 1) {
      const y = 50 + amplitude * Math.sin(x * frequency)
      staticPoints.push(`${x},${y}`)
    }
    const staticPath = `M ${staticPoints.join(' L ')}`

    return (
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        <path
          d={staticPath}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          opacity={opacity}
          className="text-black"
        />
      </svg>
    )
  }

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
    >
      <path
        d={generatePath()}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        opacity={opacity}
        className="text-black"
      />
    </svg>
  )
}

interface ModernTimelineProps {
  onCurrentYearChange?: (year: number) => void
}

export function ModernTimeline({ onCurrentYearChange }: ModernTimelineProps) {
  const { events, loading, error } = useTimelineEvents()
  const [visibleEvents, setVisibleEvents] = useState<TimelineEvent[]>([])
  const [isClient, setIsClient] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Load events from database (realtime updates handled by hook)
  useEffect(() => {
    // Events from database are already realtime via the hook
    setVisibleEvents(events)
  }, [events])

  // Format date as "SET 14 | 2025"
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ']
    const month = months[date.getMonth()]
    const day = date.getDate().toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${month} ${day} | ${year}`
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-3 h-3 bg-black rounded-full animate-pulse" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Erro ao carregar timeline</h3>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  // Show single pulsating dot if no events
  if (visibleEvents.length === 0) {
    return (
      <div className="h-full relative bg-gradient-to-br from-stone-50 via-white to-stone-100 overflow-hidden">
        {/* Background com Ondas Sutis - igual ao login */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Grid Background */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.015]" viewBox="0 0 1000 1000" fill="none">
            <defs>
              <pattern id="timelineGrid" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
                <path d="M 120 0 L 0 0 0 120" fill="none" stroke="currentColor" strokeWidth="0.3"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#timelineGrid)"/>
          </svg>

          {/* Camadas de Ondas Sutis - Background Layer */}
          {isClient ? (
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2, ease: "easeOut", delay: 1 }}
            >
              <SubtleLineWave
                amplitude={15}
                frequency={0.012}
                speed={0.2}
                opacity={0.02}
                strokeWidth="0.3"
              />
            </motion.div>
          ) : (
            <div className="absolute inset-0">
              <SubtleLineWave
                amplitude={15}
                frequency={0.012}
                speed={0.2}
                opacity={0.02}
                strokeWidth="0.3"
              />
            </div>
          )}

          {/* Camada Middle com movimento diferente */}
          {isClient ? (
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2, ease: "easeOut", delay: 1.5 }}
            >
              <SubtleLineWave
                amplitude={25}
                frequency={0.018}
                speed={0.4}
                opacity={0.025}
                strokeWidth="0.4"
              />
            </motion.div>
          ) : (
            <div className="absolute inset-0">
              <SubtleLineWave
                amplitude={25}
                frequency={0.018}
                speed={0.4}
                opacity={0.025}
                strokeWidth="0.4"
              />
            </div>
          )}

          {/* Camada Front mais sutil */}
          {isClient ? (
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2, ease: "easeOut", delay: 2 }}
            >
              <SubtleLineWave
                amplitude={12}
                frequency={0.022}
                speed={0.6}
                opacity={0.015}
                strokeWidth="0.2"
              />
            </motion.div>
          ) : (
            <div className="absolute inset-0">
              <SubtleLineWave
                amplitude={12}
                frequency={0.022}
                speed={0.6}
                opacity={0.015}
                strokeWidth="0.2"
              />
            </div>
          )}
        </div>

        {/* Horizontal center line - invisible reference */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-black transform -translate-y-1/2 opacity-0 z-10" />

        {/* Single pulsating dot in center */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          {isClient ? (
            <motion.div
              className="w-3 h-3 bg-black rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ) : (
            <div className="w-3 h-3 bg-black rounded-full opacity-70" />
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="h-full relative bg-gradient-to-br from-stone-50 via-white to-stone-100 overflow-x-auto">
      {/* Horizontal center line - invisible reference */}
      <div className="absolute top-1/2 left-0 w-full h-px bg-black transform -translate-y-1/2 opacity-0"
           style={{ width: `${Math.max(100, visibleEvents.length * 300)}%` }} />

      {/* Timeline container */}
      <div className="relative h-full flex items-center px-8"
           style={{ width: `${Math.max(100, visibleEvents.length * 300)}px`, minWidth: '100%' }}>

        {visibleEvents.map((event, index) => {
          const x = 150 + (index * 300) // 300px spacing between events

          const EventWrapper = isClient ? motion.div : 'div'
          const eventProps = isClient ? {
            initial: { opacity: 0, scale: 0 },
            animate: { opacity: 1, scale: 1 },
            transition: {
              duration: 0.6,
              delay: index * 0.2,
              ease: [0.23, 1, 0.32, 1] as const
            }
          } : {}

          return (
            <EventWrapper
              key={event.id}
              className="absolute"
              style={{ left: `${x}px` }}
              {...eventProps}
            >
              {/* The point on the line - CENTRAL */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                {isClient ? (
                  <motion.div
                    className="w-3 h-3 bg-black rounded-full relative z-10"
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.5
                    }}
                  />
                ) : (
                  <div className="w-3 h-3 bg-black rounded-full relative z-10" />
                )}

                {/* Date ABOVE the point */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 whitespace-nowrap">
                  {isClient ? (
                    <motion.div
                      className="text-xs font-medium text-black/80 tracking-wider"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 + 0.3 }}
                    >
                      {formatDate(event.event_date)}
                    </motion.div>
                  ) : (
                    <div className="text-xs font-medium text-black/80 tracking-wider">
                      {formatDate(event.event_date)}
                    </div>
                  )}
                </div>

                {/* Connecting line from point to event BELOW */}
                {isClient ? (
                  <motion.div
                    className="absolute top-full left-1/2 transform -translate-x-1/2 w-px bg-black/40"
                    style={{ height: '40px' }}
                    initial={{ height: 0 }}
                    animate={{ height: '40px' }}
                    transition={{ delay: index * 0.2 + 0.5, duration: 0.4 }}
                  />
                ) : (
                  <div
                    className="absolute top-full left-1/2 transform -translate-x-1/2 w-px bg-black/40"
                    style={{ height: '40px' }}
                  />
                )}

                {/* Event BELOW the point */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-12">
                  {isClient ? (
                    <motion.div
                      className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 + 0.7 }}
                    >
                      {event.title}
                    </motion.div>
                  ) : (
                    <div className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap">
                      {event.title}
                    </div>
                  )}
                </div>
              </div>
            </EventWrapper>
          )
        })}
      </div>
    </div>
  )
}