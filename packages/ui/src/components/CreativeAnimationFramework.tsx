'use client'

/**
 * 🐠 MANDARIN FISH CREATIVE ANIMATION FRAMEWORK
 * Enhanced by the UI Artist - Bringing Milton Glaser's truth-telling beauty to motion
 * Deployed by Kraken Orchestrator for Persona Discovery Enhancement
 */

import React from 'react'
import { motion, AnimatePresence, Variants, useAnimation, useMotionValue, useTransform } from 'framer-motion'

// ======================================
// CREATIVE ANIMATION VARIANTS LIBRARY
// ======================================

export const creativeVariants = {
  // Oceanic Flow Animations
  oceanicEntrance: {
    hidden: {
      opacity: 0,
      y: 100,
      scale: 0.8,
      rotate: -10
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring" as const,
        damping: 25,
        stiffness: 120,
        duration: 0.8
      }
    },
    exit: {
      opacity: 0,
      y: -50,
      scale: 1.1,
      rotate: 5,
      transition: { duration: 0.4 }
    }
  },

  // Persona Revelation Sequence
  personaReveal: {
    hidden: {
      opacity: 0,
      scale: 0.3,
      rotateY: 180,
      filter: "blur(20px)"
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring" as const,
        damping: 20,
        stiffness: 80,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  },

  // Question Transition Magic
  questionFlow: {
    enter: {
      x: 300,
      opacity: 0,
      scale: 0.8,
      rotateX: 20
    },
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateX: 0,
      transition: {
        type: "spring" as const,
        damping: 25,
        stiffness: 120
      }
    },
    exit: {
      x: -300,
      opacity: 0,
      scale: 0.8,
      rotateX: -20,
      transition: { duration: 0.3 }
    }
  },

  // Confidence Building Animation
  confidenceGrow: {
    initial: { scale: 0, rotate: 0 },
    animate: {
      scale: 1,
      rotate: 360,
      transition: {
        scale: { type: "spring" as const, damping: 15, stiffness: 100 },
        rotate: { duration: 1.5, ease: "easeInOut" as const }
      }
    }
  },

  // Interactive Response Pulse
  responsePulse: {
    idle: { scale: 1, boxShadow: "0 0 0 0 rgba(147, 51, 234, 0)" },
    active: {
      scale: [1, 1.05, 1],
      boxShadow: [
        "0 0 0 0 rgba(147, 51, 234, 0)",
        "0 0 0 20px rgba(147, 51, 234, 0.3)",
        "0 0 0 0 rgba(147, 51, 234, 0)"
      ],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        repeatType: "loop" as const
      }
    }
  },

  // Wisdom Emergence (for results)
  wisdomEmerge: {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
      filter: "brightness(0.5)"
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "brightness(1)",
      transition: {
        type: "spring" as const,
        damping: 30,
        stiffness: 100,
        staggerChildren: 0.15
      }
    }
  },

  // Floating Elements
  floatingElement: {
    animate: {
      y: [-10, 10, -10],
      x: [-5, 5, -5],
      rotate: [-2, 2, -2],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut" as const
      }
    }
  }
}

// ======================================
// MANDARIN FISH CREATIVE COMPONENTS
// ======================================

interface CreativeWrapperProps {
  children: React.ReactNode
  variant?: keyof typeof creativeVariants
  className?: string
  delay?: number
}

export const CreativeWrapper: React.FC<CreativeWrapperProps> = ({
  children,
  variant = 'oceanicEntrance',
  className = '',
  delay = 0
}) => {
  return (
    <motion.div
      className={className}
      variants={creativeVariants[variant]}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </motion.div>
  )
}

// Persona Question Enhanced Container
export const PersonaQuestionContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        variants={creativeVariants.questionFlow}
        initial="enter"
        animate="center"
        exit="exit"
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

// Interactive Element with Pulse
export const InteractiveElement: React.FC<{
  children: React.ReactNode
  isActive?: boolean
  onClick?: () => void
  className?: string
}> = ({ children, isActive = false, onClick, className = '' }) => {
  return (
    <motion.div
      variants={creativeVariants.responsePulse}
      animate={isActive ? "active" : "idle"}
      onClick={onClick}
      className={`cursor-pointer ${className}`}
    >
      {children}
    </motion.div>
  )
}

// Wisdom Card for Results
export const WisdomCard: React.FC<{
  children: React.ReactNode
  index?: number
}> = ({ children, index = 0 }) => {
  return (
    <motion.div
      variants={creativeVariants.wisdomEmerge}
      initial="hidden"
      animate="visible"
      custom={index}
      className="wisdom-card"
    >
      {children}
    </motion.div>
  )
}

// ======================================
// OCEANIC BACKGROUND EFFECTS
// ======================================

export const OceanicFlow: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 1000">
        <defs>
          <linearGradient id="oceanicFlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(147, 51, 234, 0.03)" />
            <stop offset="50%" stopColor="rgba(79, 70, 229, 0.02)" />
            <stop offset="100%" stopColor="rgba(147, 51, 234, 0.01)" />
          </linearGradient>
        </defs>

        {/* Flowing Waves */}
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.path
            key={i}
            d={`M0,${400 + i * 100} Q250,${350 + i * 80} 500,${400 + i * 100} T1000,${400 + i * 100} V1000 H0 Z`}
            fill="url(#oceanicFlow)"
            animate={{
              d: [
                `M0,${400 + i * 100} Q250,${350 + i * 80} 500,${400 + i * 100} T1000,${400 + i * 100} V1000 H0 Z`,
                `M0,${420 + i * 100} Q250,${370 + i * 80} 500,${420 + i * 100} T1000,${420 + i * 100} V1000 H0 Z`,
                `M0,${400 + i * 100} Q250,${350 + i * 80} 500,${400 + i * 100} T1000,${400 + i * 100} V1000 H0 Z`
              ]
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut" as const
            }}
          />
        ))}
      </svg>
    </div>
  )
}

// ======================================
// MANDARIN FISH SIGNATURE TRANSITIONS
// ======================================

export const createMandrinFishTransition = (type: 'gentle' | 'dramatic' | 'playful' = 'gentle') => {
  const transitionConfigs = {
    gentle: {
      type: "spring" as const,
      damping: 25,
      stiffness: 120,
      duration: 0.6
    },
    dramatic: {
      type: "spring" as const,
      damping: 15,
      stiffness: 80,
      duration: 1.2
    },
    playful: {
      type: "spring" as const,
      damping: 20,
      stiffness: 150,
      duration: 0.4
    }
  }

  return transitionConfigs[type]
}

// ======================================
// EXPORT MANDARIN FISH TOOLKIT
// ======================================

export const MandarinFishAnimationToolkit = {
  variants: creativeVariants,
  components: {
    CreativeWrapper,
    PersonaQuestionContainer,
    InteractiveElement,
    WisdomCard
  },
  effects: {
    OceanicFlow
  },
  transitions: createMandrinFishTransition
}

export default MandarinFishAnimationToolkit