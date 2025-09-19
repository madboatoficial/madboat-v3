"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

// 🐠 Mandarin Fish creation: Responsive design tester component
// Instructional design: Visual feedback for different screen sizes

export function ResponsiveTest() {
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateSize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  const getBreakpoint = (width: number) => {
    if (width >= 1280) return 'xl'
    if (width >= 1024) return 'lg'
    if (width >= 768) return 'md'
    if (width >= 640) return 'sm'
    return 'xs'
  }

  const breakpoint = getBreakpoint(screenSize.width)

  const breakpointColors = {
    xs: 'from-red-500 to-red-600',
    sm: 'from-orange-500 to-orange-600',
    md: 'from-yellow-500 to-yellow-600',
    lg: 'from-green-500 to-green-600',
    xl: 'from-blue-500 to-blue-600'
  }

  const breakpointNames = {
    xs: 'Mobile Portrait',
    sm: 'Mobile Landscape',
    md: 'Tablet',
    lg: 'Desktop',
    xl: 'Large Desktop'
  }

  return (
    <motion.div
      className="fixed bottom-4 right-4 z-50 pointer-events-none"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`
        bg-gradient-to-r ${breakpointColors[breakpoint]}
        text-white px-4 py-2 rounded-lg shadow-lg backdrop-blur-sm
        border border-white/20
      `}>
        <div className="text-xs font-medium">
          {breakpointNames[breakpoint]}
        </div>
        <div className="text-[10px] opacity-80">
          {screenSize.width} × {screenSize.height}
        </div>
      </div>
    </motion.div>
  )
}