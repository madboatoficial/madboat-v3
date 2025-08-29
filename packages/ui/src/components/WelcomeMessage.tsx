'use client'

export function WelcomeMessage() {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 max-w-md">
      <h2 className="text-2xl font-bold mb-2">🚀 Monorepo Configurado!</h2>
      <p className="text-white/90 mb-4">
        Estrutura profissional pronta para web e mobile
      </p>
      <ul className="text-left text-white/80 space-y-1">
        <li>✅ Next.js 15 + React 19</li>
        <li>✅ TypeScript compartilhado</li>
        <li>✅ UI Components</li>
        <li>✅ Business Logic centralizada</li>
      </ul>
    </div>
  )
}