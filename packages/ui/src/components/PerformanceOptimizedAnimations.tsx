'use client'

/**
 * 💰 UNCLE MCDUCK PERFORMANCE OPTIMIZATION SUITE
 * Financial Advisor's approach to animation efficiency
 * Orchestrated by Kraken for maximum ROI on animation performance
 */

import React, { memo, useMemo, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion, useInView, LazyMotion, domAnimation, m } from 'framer-motion'

// ======================================
// UNCLE MCDUCK'S PERFORMANCE PRINCIPLES
// ======================================

/**
 * 1. Lazy Loading: Only load what's needed, when it's needed
 * 2. Memory Management: Clean animations, no leaks
 * 3. CPU Efficiency: Smart batching and reduced calculations
 * 4. Battery Optimization: Respect user preferences
 * 5. Bandwidth Conservation: Minimal payload for maximum impact
 */

// ======================================
// PERFORMANCE-OPTIMIZED ANIMATION HOOKS
// ======================================

export const usePerformanceOptimizedAnimation = () => {
  const prefersReducedMotion = useReducedMotion()

  // Uncle McDuck's Performance Config
  const animationConfig = useMemo(() => ({
    // Respect user preferences - saves battery and prevents motion sickness
    duration: prefersReducedMotion ? 0 : 0.6,
    enableAnimations: !prefersReducedMotion,

    // Optimized transition types for performance
    spring: prefersReducedMotion ? undefined : {
      type: "spring" as const,
      damping: 25,
      stiffness: 120,
      mass: 1  // Lighter mass = better performance
    },

    // Efficient easing functions
    easing: prefersReducedMotion ? undefined : "easeOut",

    // Reduced complexity for mobile
    complexity: typeof window !== 'undefined' && window.innerWidth < 768 ? 'low' : 'high'
  }), [prefersReducedMotion])

  return animationConfig
}

// Smart Intersection Observer for Animations
export const useInViewAnimation = (threshold = 0.1) => {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, {
    amount: threshold,
    once: true,  // Uncle McDuck: Only animate once to save resources
    margin: "50px" // Start loading before visible for smoother experience
  })

  return { ref, isInView }
}

// ======================================
// OPTIMIZED ANIMATION COMPONENTS
// ======================================

// Lazy Motion - Only loads animations when needed
export const LazyAnimatedWrapper: React.FC<{
  children: React.ReactNode
  className?: string
  variant?: 'fade' | 'slide' | 'scale'
  delay?: number
}> = memo(({ children, className, variant = 'fade', delay = 0 }) => {
  const { ref, isInView } = useInViewAnimation()
  const config = usePerformanceOptimizedAnimation()

  if (!config.enableAnimations) {
    return <div className={className}>{children}</div>
  }

  const variants = useMemo(() => ({
    fade: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { ...config.spring, delay }
      }
    },
    slide: {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { ...config.spring, delay }
      }
    },
    scale: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: { ...config.spring, delay }
      }
    }
  }), [config, delay])

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        ref={ref}
        className={className}
        variants={variants[variant]}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {children}
      </m.div>
    </LazyMotion>
  )
})

LazyAnimatedWrapper.displayName = 'LazyAnimatedWrapper'

// Efficient Question Transition Container
export const OptimizedQuestionContainer: React.FC<{
  children: React.ReactNode
  questionIndex: number
}> = memo(({ children, questionIndex }) => {
  const config = usePerformanceOptimizedAnimation()

  // Uncle McDuck: Reuse animation instances to save memory
  const animationKey = useMemo(() => `question-${questionIndex}`, [questionIndex])

  if (!config.enableAnimations) {
    return <div key={animationKey}>{children}</div>
  }

  const variants = useMemo(() => ({
    enter: {
      x: config.complexity === 'low' ? 0 : 50,
      opacity: 0,
      scale: config.complexity === 'low' ? 1 : 0.95
    },
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: config.spring || { duration: config.duration }
    },
    exit: {
      x: config.complexity === 'low' ? 0 : -50,
      opacity: 0,
      scale: config.complexity === 'low' ? 1 : 0.95,
      transition: { duration: config.duration * 0.5 }
    }
  }), [config])

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence mode="wait">
        <m.div
          key={animationKey}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          className="w-full"
        >
          {children}
        </m.div>
      </AnimatePresence>
    </LazyMotion>
  )
})

OptimizedQuestionContainer.displayName = 'OptimizedQuestionContainer'

// Battery-Efficient Button Animation
export const EfficientInteractiveButton: React.FC<{
  children: React.ReactNode
  onClick?: () => void
  className?: string
  isActive?: boolean
}> = memo(({ children, onClick, className, isActive }) => {
  const config = usePerformanceOptimizedAnimation()

  // Uncle McDuck: Use CSS transforms for better performance
  const buttonVariants = useMemo(() => {
    if (!config.enableAnimations) return undefined

    return {
      tap: { scale: 0.95 },
      hover: config.complexity === 'high' ? {
        scale: 1.02,
        transition: { duration: 0.2 }
      } : {
        scale: 1
      }
    }
  }, [config])

  const handleClick = useCallback(() => {
    onClick?.()
  }, [onClick])

  if (!config.enableAnimations) {
    return (
      <button onClick={handleClick} className={className}>
        {children}
      </button>
    )
  }

  return (
    <LazyMotion features={domAnimation}>
      <m.button
        variants={buttonVariants}
        whileTap="tap"
        whileHover="hover"
        onClick={handleClick}
        className={className}
        style={{
          // Uncle McDuck: Hardware acceleration hints
          willChange: isActive ? 'transform' : 'auto'
        }}
      >
        {children}
      </m.button>
    </LazyMotion>
  )
})

EfficientInteractiveButton.displayName = 'EfficientInteractiveButton'

// ======================================
// PERFORMANCE MONITORING UTILITIES
// ======================================

export const useAnimationPerformanceMonitor = () => {
  const frameRate = useRef<number[]>([])
  const lastTime = useRef(performance.now())

  useEffect(() => {
    let animationId: number

    const measureFrameRate = () => {
      const now = performance.now()
      const delta = now - lastTime.current
      const fps = 1000 / delta

      frameRate.current.push(fps)

      // Uncle McDuck: Keep only last 60 measurements (1 second at 60fps)
      if (frameRate.current.length > 60) {
        frameRate.current.shift()
      }

      lastTime.current = now
      animationId = requestAnimationFrame(measureFrameRate)
    }

    animationId = requestAnimationFrame(measureFrameRate)

    return () => cancelAnimationFrame(animationId)
  }, [])

  const getAverageFrameRate = useCallback(() => {
    if (frameRate.current.length === 0) return 0
    return frameRate.current.reduce((sum, fps) => sum + fps, 0) / frameRate.current.length
  }, [])

  return { getAverageFrameRate }
}

// ======================================
// UNCLE MCDUCK'S OPTIMIZATION PRESETS
// ======================================

export const PerformancePresets = {
  // Ultra-efficient for low-end devices
  minimal: {
    enableAnimations: false,
    duration: 0,
    complexity: 'low' as const
  },

  // Balanced performance/beauty ratio
  balanced: {
    enableAnimations: true,
    duration: 0.3,
    complexity: 'low' as const,
    spring: { damping: 30, stiffness: 150 }
  },

  // Full animations for high-end devices
  premium: {
    enableAnimations: true,
    duration: 0.6,
    complexity: 'high' as const,
    spring: { damping: 25, stiffness: 120 }
  }
}

// Device-based performance detection
export const detectPerformanceLevel = (): keyof typeof PerformancePresets => {
  if (typeof window === 'undefined') return 'balanced'

  // Uncle McDuck's device performance heuristics
  const isLowEnd = (
    navigator.hardwareConcurrency <= 2 ||
    (navigator as any).deviceMemory <= 2 ||
    window.innerWidth < 768
  )

  const isHighEnd = (
    navigator.hardwareConcurrency >= 8 &&
    (navigator as any).deviceMemory >= 8 &&
    window.innerWidth >= 1920
  )

  if (isLowEnd) return 'minimal'
  if (isHighEnd) return 'premium'
  return 'balanced'
}

// ======================================
// EXPORT UNCLE MCDUCK'S TOOLKIT
// ======================================

export const UncleMcDuckPerformanceToolkit = {
  hooks: {
    usePerformanceOptimizedAnimation,
    useInViewAnimation,
    useAnimationPerformanceMonitor
  },
  components: {
    LazyAnimatedWrapper,
    OptimizedQuestionContainer,
    EfficientInteractiveButton
  },
  presets: PerformancePresets,
  utils: {
    detectPerformanceLevel
  }
}

export default UncleMcDuckPerformanceToolkit