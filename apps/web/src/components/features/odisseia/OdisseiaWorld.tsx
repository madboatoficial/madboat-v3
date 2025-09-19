"use client"

import { motion } from 'framer-motion'
import { Crown, Sword, Shield, Trophy } from 'lucide-react'

export function OdisseiaWorld() {
  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-orange-50 via-white to-red-50">
      <div className="px-12 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl"
        >
          <div className="flex items-center space-x-4 mb-8">
            <div className="p-4 bg-orange-100 rounded-full">
              <Crown size={40} className="text-orange-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-black mb-2">ODISSEIA</h1>
              <p className="text-xl text-black/70">Guerra • Paixão • Conquista</p>
            </div>
          </div>

          <div className="mb-12">
            <p className="text-lg text-black/80 leading-relaxed">
              A jornada épica para se tornar autoridade inquestionável no seu mercado.
              Uma odisseia de crescimento, desafios e conquistas que transformará você
              em um líder de referência.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-black/10 text-center">
              <Sword size={32} className="text-orange-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-black mb-2">Guerra</h3>
              <p className="text-black/70 text-sm">Estratégias para vencer no mercado</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-black/10 text-center">
              <Shield size={32} className="text-orange-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-black mb-2">Paixão</h3>
              <p className="text-black/70 text-sm">Encontre e cultive sua força interior</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-black/10 text-center">
              <Trophy size={32} className="text-orange-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-black mb-2">Conquista</h3>
              <p className="text-black/70 text-sm">Torne-se autoridade inquestionável</p>
            </div>
          </div>

          <motion.button
            className="mt-12 bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-4 rounded-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Iniciar Odisseia
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}