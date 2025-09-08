"use client"

import { motion } from 'framer-motion'
import { PageType } from './AppLayout'

interface AppFooterProps {
  pageType: PageType
  onNavigate?: (page: string) => void
}

const newsItems = [
  "[SISTEMA] Sistema RLVR ativado - Redução de 50% nas alucinações de agentes",
  "[INTERFACE] Timeline GitKraken implementada com sucesso",
  "[PERFORMANCE] Framer Motion otimizado para React 19",
  "[NAVEGAÇÃO] Novo sistema de navegação híbrida implementado", 
  "[OTIMIZAÇÃO] Performance melhorada em 300% com Lucide React",
  "[DESIGN] Design system 2025 atualizado",
  "[PROGRESSO] Sistema hexagonal de progresso ativo",
  "[DEPLOY] PWA ready para App Store deployment",
  "[ARQUITETURA] Migração completa para Next.js 15",
  "[SEGURANÇA] Autenticação Supabase implementada",
  "[MOBILE] Layout responsivo mobile-first ativo",
  "[ANIMAÇÕES] Dropdown espetacular com Framer Motion"
]

export function AppFooter({ pageType, onNavigate }: AppFooterProps) {
  return (
    <>
      {/* News Ticker - Above Footer */}
      <div className="relative h-8 flex items-center bg-slate-50 border-t border-slate-200 overflow-hidden">
        <motion.div
          className="flex items-center whitespace-nowrap"
          animate={{ x: [1200, -3000] }}
          transition={{ 
            duration: 30, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        >
          {[...newsItems, ...newsItems].map((news, index) => (
            <div key={index} className="flex items-center">
              <span className="text-xs text-slate-600 font-medium px-6">
                {news}
              </span>
              <span className="text-slate-400 text-xs px-2">|</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-50 backdrop-blur-sm border-t border-slate-200">
        {/* Desktop Footer Info */}
        <div className="hidden md:block px-6 py-3">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-4">
              <span>© 2025 MadBoat</span>
              <span>•</span>
              <span>Sistema de Navegação Digital</span>
            </div>
            <div className="flex items-center gap-4">
              <span>v2.0</span>
              <span>•</span>
              <span>React 19 + Next.js 15</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}