"use client"

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { ArrowLeft, Star, Zap, Crown, Gem, Shield, Rocket, Target } from 'lucide-react'
import { usePageController } from './PageController'

// 🐠 Mandarin Fish creation: PlayStation Plus inspired upgrade marketplace
// Instructional design: Visual hierarchy, progressive disclosure, clear value propositions

interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  features: string[]
  icon: React.ComponentType<any>
  gradient: string
  category: 'skill' | 'tool' | 'premium' | 'exclusive'
  badge?: string
  popular?: boolean
  new?: boolean
}

const mockProducts: Product[] = [
  {
    id: 'persona-discovery-pro',
    name: 'Persona Discovery Pro',
    description: 'Análise avançada de 47 dimensões para revelar seu potencial autêntico completo',
    price: 297,
    originalPrice: 497,
    features: ['Análise completa de personalidade', 'Relatório detalhado PDF', 'Sessão de mentoria 1:1'],
    icon: Target,
    gradient: 'from-blue-500 to-purple-600',
    category: 'skill',
    badge: '40% OFF',
    popular: true
  },
  {
    id: 'alma-acceleration',
    name: 'ALMA Acceleration',
    description: 'Método completo de alinhamento para transformação acelerada',
    price: 597,
    features: ['4 módulos completos', 'Templates exclusivos', 'Comunidade VIP'],
    icon: Zap,
    gradient: 'from-purple-500 to-pink-600',
    category: 'premium',
    new: true
  },
  {
    id: 'vortex-toolkit',
    name: 'VORTEX Toolkit',
    description: 'Sistema automatizado de IA para multiplicar seus resultados',
    price: 997,
    features: ['Automações personalizadas', 'IA estratégica', 'Suporte prioritário'],
    icon: Rocket,
    gradient: 'from-cyan-500 to-blue-600',
    category: 'tool',
    badge: 'EXCLUSIVO'
  },
  {
    id: 'odisseia-mastery',
    name: 'ODISSEIA Mastery',
    description: 'Jornada épica para se tornar autoridade inquestionável',
    price: 1997,
    features: ['Mentoria personalizada', 'Networking exclusivo', 'Certificação oficial'],
    icon: Crown,
    gradient: 'from-orange-500 to-red-600',
    category: 'exclusive',
    badge: 'ULTIMATE'
  },
  {
    id: 'mindset-booster',
    name: 'Mindset Booster',
    description: 'Reprogramação mental para sucesso exponencial',
    price: 197,
    features: ['21 técnicas avançadas', 'Meditações guiadas', 'Workbook digital'],
    icon: Star,
    gradient: 'from-emerald-500 to-cyan-600',
    category: 'skill'
  },
  {
    id: 'confidence-shield',
    name: 'Confidence Shield',
    description: 'Blindagem emocional contra críticas e sabotagem',
    price: 297,
    features: ['Protocolo anti-sabotagem', 'Técnicas de blindagem', 'Scripts prontos'],
    icon: Shield,
    gradient: 'from-indigo-500 to-purple-600',
    category: 'skill',
    popular: true
  },
  {
    id: 'wealth-magnet',
    name: 'Wealth Magnet',
    description: 'Sistema completo de atração de abundância financeira',
    price: 497,
    originalPrice: 797,
    features: ['Estratégias de monetização', 'Templates de vendas', 'Funil completo'],
    icon: Gem,
    gradient: 'from-amber-500 to-orange-600',
    category: 'premium',
    badge: '35% OFF'
  }
]

// Generate more products by cycling through base products
const generateInfiniteProducts = (baseProducts: Product[], count: number): Product[] => {
  const generated: Product[] = []
  for (let i = 0; i < count; i++) {
    const baseProduct = baseProducts[i % baseProducts.length]
    generated.push({
      ...baseProduct,
      id: `${baseProduct.id}-${i}`,
      name: `${baseProduct.name} ${i > baseProducts.length - 1 ? `v${Math.floor(i / baseProducts.length) + 1}` : ''}`,
      price: baseProduct.price + (Math.floor(i / baseProducts.length) * 100)
    })
  }
  return generated
}

export function UpgradePage() {
  const { navigateTo } = usePageController()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollX } = useScroll({ container: containerRef })

  // Generate large product list for infinite scroll effect
  const allProducts = generateInfiniteProducts(mockProducts, 50)

  const filteredProducts = selectedCategory === 'all'
    ? allProducts
    : allProducts.filter(product => product.category === selectedCategory)

  const categories = [
    { id: 'all', name: 'Todos', icon: Star },
    { id: 'skill', name: 'Skills', icon: Target },
    { id: 'tool', name: 'Ferramentas', icon: Zap },
    { id: 'premium', name: 'Premium', icon: Gem },
    { id: 'exclusive', name: 'Exclusivo', icon: Crown }
  ]

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute inset-0 opacity-[0.02]"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%']
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse'
          }}
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #3b82f6 0%, transparent 50%),
                             radial-gradient(circle at 75% 75%, #8b5cf6 0%, transparent 50%)`,
            backgroundSize: '400% 400%'
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-black/10 z-20">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between mb-6">
              <motion.button
                onClick={() => navigateTo('dashboard')}
                className="flex items-center space-x-3 px-4 py-2 bg-black/5 hover:bg-black/10
                         rounded-lg transition-colors duration-300 group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ArrowLeft size={16} className="text-black/60 group-hover:text-black/80" />
                <span className="text-sm font-medium text-black/80 group-hover:text-black">
                  Voltar ao Dashboard
                </span>
              </motion.button>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <h1 className="text-2xl font-bold text-black mb-1">MadBoat Store</h1>
                <p className="text-sm text-black/60">Acelere sua transformação digital</p>
              </motion.div>

              <div className="w-32" /> {/* Spacer for balance */}
            </div>

            {/* Category Filters */}
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {categories.map((category, index) => {
                const Icon = category.icon
                const isActive = selectedCategory === category.id

                return (
                  <motion.button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`
                      flex items-center space-x-2 px-4 py-2 rounded-full border transition-all duration-300
                      whitespace-nowrap flex-shrink-0
                      ${isActive
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-black/70 border-black/20 hover:border-black/40 hover:text-black'
                      }
                    `}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Icon size={14} />
                    <span className="text-sm font-medium">{category.name}</span>
                  </motion.button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Products Grid - Horizontal Scroll */}
        <div className="px-8 py-8">
          <motion.div
            ref={containerRef}
            className="flex space-x-6 overflow-x-auto pb-6 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {filteredProducts.map((product, index) => {
              const Icon = product.icon

              return (
                <motion.div
                  key={product.id}
                  className="flex-shrink-0 w-80 bg-white rounded-2xl border border-black/10 overflow-hidden
                           shadow-sm hover:shadow-xl transition-all duration-500 group cursor-pointer"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{
                    y: -8,
                    scale: 1.02
                  }}
                >
                  {/* Product Header */}
                  <div className={`relative h-32 bg-gradient-to-br ${product.gradient} p-6`}>
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex space-x-2">
                      {product.badge && (
                        <motion.div
                          className="bg-white/90 text-black text-xs font-bold px-2 py-1 rounded-full"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          {product.badge}
                        </motion.div>
                      )}
                      {product.popular && (
                        <div className="bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full">
                          🔥 POPULAR
                        </div>
                      )}
                      {product.new && (
                        <div className="bg-green-400 text-black text-xs font-bold px-2 py-1 rounded-full">
                          ✨ NOVO
                        </div>
                      )}
                    </div>

                    {/* Icon */}
                    <div className="absolute bottom-6 right-6">
                      <motion.div
                        className="bg-white/20 backdrop-blur-sm rounded-full p-3"
                        animate={{
                          rotate: [0, 360],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{
                          rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                          scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                        }}
                      >
                        <Icon size={24} className="text-white" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Product Content */}
                  <div className="p-6">
                    <h3 className="font-semibold text-lg text-black mb-2 group-hover:text-black/80">
                      {product.name}
                    </h3>

                    <p className="text-sm text-black/60 leading-relaxed mb-4 line-clamp-2">
                      {product.description}
                    </p>

                    {/* Features */}
                    <div className="space-y-2 mb-6">
                      {product.features.slice(0, 3).map((feature, idx) => (
                        <motion.div
                          key={idx}
                          className="flex items-center space-x-2"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * idx }}
                        >
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                          <span className="text-xs text-black/70">{feature}</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Pricing */}
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold text-black">
                            R$ {product.price}
                          </span>
                          {product.originalPrice && (
                            <span className="text-sm text-black/40 line-through">
                              R$ {product.originalPrice}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-black/50">ou 12x sem juros</p>
                      </div>

                      <motion.button
                        className={`
                          px-6 py-2 rounded-lg font-medium text-sm text-white
                          bg-gradient-to-r ${product.gradient}
                          hover:shadow-lg transition-all duration-300
                        `}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Adquirir
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="flex justify-center pb-8">
          <motion.div
            className="bg-black/10 rounded-full h-1 w-32 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <motion.div
              className="h-full bg-black/40 rounded-full"
              style={{
                scaleX: useTransform(scrollX, [0, 1000], [0.1, 1])
              }}
            />
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        .scrollbar-hide {
          -webkit-overflow-scrolling: touch;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}