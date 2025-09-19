"use client"

import { motion } from 'framer-motion'
import { Zap, TrendingUp, Bot, Rocket } from 'lucide-react'

export function VortexWorld() {
  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-cyan-50 via-white to-blue-50">
      <div className="px-12 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl"
        >
          <div className="flex items-center space-x-4 mb-8">
            <div className="p-4 bg-cyan-100 rounded-full">
              <Zap size={40} className="text-cyan-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-black mb-2">VORTEX Acceleration</h1>
              <p className="text-xl text-black/70">Sistema de aceleração exponencial de resultados</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-black/10">
              <TrendingUp size={32} className="text-cyan-600 mb-4" />
              <h3 className="text-xl font-semibold text-black mb-4">Multiplique seus Resultados</h3>
              <p className="text-black/70">Sistema automatizado para potencializar todos os aspectos do seu crescimento.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-black/10">
              <Bot size={32} className="text-cyan-600 mb-4" />
              <h3 className="text-xl font-semibold text-black mb-4">IA Estratégica</h3>
              <p className="text-black/70">Inteligência artificial dedicada a otimizar sua jornada de transformação.</p>
            </div>
          </div>

          <motion.button
            className="mt-12 bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-8 py-4 rounded-lg flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Rocket size={20} />
            <span>Acelerar Agora</span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}