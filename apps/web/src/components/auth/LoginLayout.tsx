"use client"

import { motion } from 'framer-motion'

interface LoginLayoutProps {
  children: React.ReactNode
}

export function LoginLayout({ children }: LoginLayoutProps) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50 transition-all"
      >
        Pular para o conteúdo principal
      </a>

      {/* Background subtle pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-white to-amber-50/20" />
      
      {/* Floating geometric elements for visual interest */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-blue-100/20 rounded-full blur-xl"
          animate={{
            y: [-10, 10, -10],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-32 right-16 w-24 h-24 bg-amber-100/30 rounded-full blur-lg"
          animate={{
            y: [10, -10, 10],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-16 h-16 bg-blue-200/25 rounded-full blur-md"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        />
      </div>

      {/* Main content container */}
      <motion.main
        id="main-content"
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.6,
          ease: "easeOut"
        }}
        role="main"
      >
        {/* MadBoat branding */}
        <motion.header 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.5,
            delay: 0.2
          }}
        >
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Mad<span className="text-blue-600">Boat</span>
          </h1>
          <p className="text-slate-600 text-sm font-medium">
            Navegue pelo futuro com IA
          </p>
        </motion.header>

        {/* Login form container */}
        <motion.section
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/60 p-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            duration: 0.5,
            delay: 0.3,
            ease: "easeOut"
          }}
          style={{
            boxShadow: `
              0 20px 25px -5px rgb(0 0 0 / 0.1),
              0 10px 10px -5px rgb(0 0 0 / 0.04),
              0 0 0 1px rgb(255 255 255 / 0.5) inset
            `
          }}
          aria-label="Formulário de login"
        >
          {children}
        </motion.section>

        {/* Footer */}
        <motion.footer 
          className="text-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ 
            duration: 0.5,
            delay: 0.6
          }}
        >
          <p className="text-xs text-slate-500">
            © 2025 MadBoat. Transformação digital inteligente.
          </p>
        </motion.footer>
      </motion.main>
    </div>
  )
}