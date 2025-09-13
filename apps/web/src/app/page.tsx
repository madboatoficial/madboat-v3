'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useAuth } from '@madboat/auth'
import { useRouter } from 'next/navigation'

// Componente para linha ondulante sutil no background
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
  
  useEffect(() => {
    const interval = setInterval(() => {
      setOffset(prev => prev + speed)
    }, 50)
    return () => clearInterval(interval)
  }, [speed])

  const generatePath = () => {
    const points = []
    for (let x = 0; x <= 100; x += 1) {
      const y = 50 + amplitude * Math.sin((x + offset) * frequency)
      points.push(`${x},${y}`)
    }
    return `M ${points.join(' L ')}`
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

export default function HomePage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [focusedField, setFocusedField] = useState<'email' | 'password' | null>(null)

  // Real authentication
  const { signIn, loading, error, user } = useAuth()
  const router = useRouter()
  
  // Progressive reveal states
  const [showPasswordField, setShowPasswordField] = useState(false)
  const [showEnterButton, setShowEnterButton] = useState(false)
  const [logoMoved, setLogoMoved] = useState(false)

  // Animation sequence trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      setLogoMoved(true)
    }, 2000) // Logo moves after 2 seconds
    return () => clearTimeout(timer)
  }, [])

  // Progressive reveal logic
  useEffect(() => {
    if (email.length >= 5) {
      setShowPasswordField(true)
    } else {
      setShowPasswordField(false)
      setShowEnterButton(false)
    }
  }, [email])

  useEffect(() => {
    if (password.length >= 3 && showPasswordField) {
      setShowEnterButton(true)
    } else {
      setShowEnterButton(false)
    }
  }, [password, showPasswordField])

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await signIn(email, password)
      // Router will redirect on success via useEffect above
    } catch (err) {
      console.error('Login failed:', err)
      // Error is handled by useAuth hook
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-stone-100 relative overflow-hidden">
      
      {/* Ultra Minimal Background com Ondas Sutis */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Grid Background */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.015]" viewBox="0 0 1000 1000" fill="none">
          <defs>
            <pattern id="supremeGrid" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
              <path d="M 120 0 L 0 0 0 120" fill="none" stroke="currentColor" strokeWidth="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#supremeGrid)"/>
        </svg>

        {/* Camadas de Ondas Sutis - Background Layer */}
        <motion.div 
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut", delay: 4 }}
        >
          <SubtleLineWave 
            amplitude={15} 
            frequency={0.012} 
            speed={0.2}
            opacity={0.02}
            strokeWidth="0.3"
          />
        </motion.div>

        {/* Camada Middle com movimento diferente */}
        <motion.div 
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut", delay: 5 }}
        >
          <SubtleLineWave 
            amplitude={25} 
            frequency={0.018} 
            speed={0.4}
            opacity={0.025}
            strokeWidth="0.4"
          />
        </motion.div>

        {/* Camada Front mais sutil */}
        <motion.div 
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut", delay: 6 }}
        >
          <SubtleLineWave 
            amplitude={12} 
            frequency={0.022} 
            speed={0.6}
            opacity={0.015}
            strokeWidth="0.2"
          />
        </motion.div>

        {/* Minimal Particles */}
        {Array.from({ length: 3 }).map((_, i) => {
          // Posições fixas baseadas no índice para evitar hidration mismatch
          const positions = [
            { left: '25%', top: '30%' },
            { left: '70%', top: '20%' },
            { left: '45%', top: '60%' }
          ]
          const durations = [18, 22, 20] // Durações fixas
          
          return (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-0.5 h-0.5 bg-black/10 rounded-full"
              style={positions[i]}
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0.05, 0.2, 0.05],
                y: [0, -25, 0],
                scale: [0.5, 1.2, 0.5]
              }}
              transition={{
                opacity: { duration: durations[i], repeat: Infinity, delay: 7 + i * 2, ease: "easeInOut" },
                y: { duration: durations[i], repeat: Infinity, delay: 7 + i * 2, ease: "easeInOut" },
                scale: { duration: durations[i], repeat: Infinity, delay: 7 + i * 2, ease: "easeInOut" }
              }}
            />
          )
        })}
      </div>

      {/* Main Content Container */}
      <div className="flex items-center justify-center min-h-screen px-8 w-full">
        
        {/* Horizontal Progressive Layout */}
        <div className="w-full flex items-center justify-center">
          <motion.form
            onSubmit={handleLogin}
            className="flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            
            {/* Animated Logo - Starts Center */}
            <motion.div
              className="flex-shrink-0"
              layout
              initial={{ scale: 1.2 }}
              animate={{ scale: logoMoved ? 0.8 : 1.2 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            >
              {/* LOGO SUPREMA: PLUS JAKARTA SANS UPPERCASE */}
              <style jsx>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
              `}</style>
              
              {/* LOGO DEFINITIVA: madboat */}
              <motion.div
                className="flex items-center justify-center"
                animate={{
                  letterSpacing: ["0.08em", "0.12em", "0.08em"]
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <motion.h1 
                  layoutId="madboat-logo"
                  className="text-4xl font-medium tracking-[0.08em] text-black whitespace-nowrap"
                  style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                  animate={{
                    opacity: [0.85, 1, 0.85],
                    scale: [0.98, 1, 0.98]
                  }}
                  transition={{
                    opacity: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                    scale: { duration: 8, repeat: Infinity, ease: "easeInOut" },
                    layout: { duration: 0.8, ease: [0.23, 1, 0.32, 1] }
                  }}
                >
                  madboat
                </motion.h1>
              </motion.div>
              
            </motion.div>

            {/* Email Field - Appears after logo animation */}
            <AnimatePresence>
              {logoMoved && (
                <motion.div
                  className="flex-shrink-0 ml-12"
                  initial={{ opacity: 0, x: -30, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -30, scale: 0.9 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                >
                  <div className="relative w-64 group">
                    {/* Email Line Art */}
                    <svg 
                      className="absolute inset-0 w-full h-12 pointer-events-none z-10"
                      viewBox="0 0 256 48"
                      fill="none"
                    >
                      <motion.line
                        x1="0" y1="24" x2="256" y2="24"
                        stroke="currentColor"
                        strokeWidth="1"
                        className={`${focusedField === 'email' || email ? 'text-black/50' : 'text-black/20'}`}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 0.5, duration: 1.5 }}
                      />
                      
                      {/* Accents */}
                      <motion.g className={`${focusedField === 'email' || email ? 'text-black/40' : 'text-black/15'}`}>
                        <line x1="0" y1="20" x2="0" y2="28" stroke="currentColor" strokeWidth="2"/>
                        <circle cx="0" cy="24" r="2" fill="currentColor" opacity="0.6"/>
                        <line x1="256" y1="20" x2="256" y2="28" stroke="currentColor" strokeWidth="2"/>
                        <circle cx="256" cy="24" r="2" fill="currentColor" opacity="0.6"/>
                      </motion.g>
                      
                      {/* Progress Dots */}
                      <motion.g
                        initial={{ opacity: 0 }}
                        animate={{ opacity: email.length > 0 ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {Array.from({ length: 5 }).map((_, i) => (
                          <motion.circle
                            key={i}
                            cx={40 + (i * 35)}
                            cy="30"
                            r="1.5"
                            fill="currentColor"
                            className="text-black/30"
                            animate={{ 
                              opacity: email.length > i ? 0.8 : 0.2,
                              scale: email.length > i ? 1.3 : 1
                            }}
                            transition={{ duration: 0.2 }}
                          />
                        ))}
                      </motion.g>
                    </svg>
                    
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full h-12 px-4 bg-transparent border-0 
                               font-light text-base text-black placeholder-transparent
                               focus:outline-none focus:ring-0 focus:border-transparent
                               relative z-20 text-center caret-black"
                      style={{ paddingTop: '2px', paddingBottom: '20px' }}
                      placeholder=""
                      required
                    />
                    
                    {/* Label below the line */}
                    <motion.div
                      className="absolute top-full mt-1 left-1/2 -translate-x-1/2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: (!email && focusedField !== 'email') ? 0.4 : 0.2 }}
                      transition={{ duration: 0.3 }}
                    >
                      <span className="text-xs font-light text-black/40 tracking-wide">
                        Digital Identity
                      </span>
                    </motion.div>
                    
                    <motion.div
                      className="absolute inset-0 bg-white/30 rounded-sm -z-10"
                      animate={{
                        opacity: focusedField === 'email' || email ? 0.6 : 0.2
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Password Field - Appears progressively */}
            <AnimatePresence>
              {showPasswordField && (
                <motion.div
                  className="flex-shrink-0 ml-10"
                  initial={{ opacity: 0, x: -30, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -30, scale: 0.9 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <div className="relative w-64 group">
                    {/* Password Line Art - Igual ao Login */}
                    <svg 
                      className="absolute inset-0 w-full h-12 pointer-events-none z-10"
                      viewBox="0 0 256 48"
                      fill="none"
                    >
                      <motion.line
                        x1="0" y1="24" x2="256" y2="24"
                        stroke="currentColor"
                        strokeWidth="1"
                        className={`${focusedField === 'password' || password ? 'text-black/50' : 'text-black/20'}`}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 0.5, duration: 1.5 }}
                      />
                      
                      {/* Accents - Igual ao Login */}
                      <motion.g className={`${focusedField === 'password' || password ? 'text-black/40' : 'text-black/15'}`}>
                        <line x1="0" y1="20" x2="0" y2="28" stroke="currentColor" strokeWidth="2"/>
                        <circle cx="0" cy="24" r="2" fill="currentColor" opacity="0.6"/>
                        <line x1="256" y1="20" x2="256" y2="28" stroke="currentColor" strokeWidth="2"/>
                        <circle cx="256" cy="24" r="2" fill="currentColor" opacity="0.6"/>
                      </motion.g>
                      
                      {/* Progress Dots - Igual ao Login */}
                      <motion.g
                        initial={{ opacity: 0 }}
                        animate={{ opacity: password.length > 0 ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {Array.from({ length: 3 }).map((_, i) => (
                          <motion.circle
                            key={i}
                            cx={80 + (i * 40)}
                            cy="30"
                            r="1.5"
                            fill="currentColor"
                            className="text-black/30"
                            animate={{ 
                              opacity: password.length > i ? 0.8 : 0.2,
                              scale: password.length > i ? 1.3 : 1
                            }}
                            transition={{ duration: 0.2 }}
                          />
                        ))}
                      </motion.g>
                    </svg>
                    
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full h-12 px-4 bg-transparent border-0 pr-12
                               font-light text-base text-black placeholder-transparent
                               focus:outline-none focus:ring-0 focus:border-transparent
                               relative z-20 text-center caret-black"
                      style={{ paddingTop: '2px', paddingBottom: '20px' }}
                      placeholder=""
                      required
                    />
                    
                    {/* Label below the line */}
                    <motion.div
                      className="absolute top-full mt-1 left-1/2 -translate-x-1/2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: (!password && focusedField !== 'password') ? 0.4 : 0.2 }}
                      transition={{ duration: 0.3 }}
                    >
                      <span className="text-xs font-light text-black/40 tracking-wide">
                        Sacred Key
                      </span>
                    </motion.div>
                    
                    <motion.button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 bottom-1 z-20
                               text-black/30 hover:text-black/60 transition-colors duration-300
                               p-1"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {showPassword ? <EyeOff size={12} strokeWidth={1.5} /> : <Eye size={12} strokeWidth={1.5} />}
                    </motion.button>
                    
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/40 to-white/20 rounded-sm -z-10"
                      animate={{
                        opacity: focusedField === 'password' || password ? 0.7 : 0.4
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Enter Button - Final element */}
            <AnimatePresence>
              {showEnterButton && (
                <motion.div
                  className="flex-shrink-0 ml-10"
                  initial={{ opacity: 0, x: -30, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -30, scale: 0.9 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <div className="relative group">
                    
                    <motion.button
                      type="submit"
                      disabled={loading}
                      className="bg-transparent border-0 relative z-20
                               text-black/60 hover:text-black transition-colors duration-500
                               disabled:opacity-50 group flex items-center justify-center"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <AnimatePresence mode="wait">
                        {loading ? (
                          <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center space-x-2"
                          >
                            <div className="w-3 h-3 border border-black/40 border-t-transparent rounded-full animate-spin" />
                            <span className="font-light text-sm tracking-wide">Authenticating</span>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="submit"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center space-x-2"
                          >
                            <span className="font-light text-sm tracking-wide">Enter the Ocean</span>
                            <motion.div
                              animate={{ x: [0, 3, 0] }}
                              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                            >
                              <ArrowRight size={16} strokeWidth={1.5} />
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.form>
        </div>
      </div>

      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2 shadow-lg">
              <p className="text-red-600 text-sm font-medium">
                {error.message || 'Authentication failed. Please try again.'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Minimal Copyright */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs font-light text-black/20 tracking-[0.1em]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 5, duration: 2 }}
      >
        madboat © 2025
      </motion.div>
    </div>
  )
}