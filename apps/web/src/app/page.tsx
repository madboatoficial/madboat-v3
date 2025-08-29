import { WelcomeMessage } from '@madboat/ui'

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold mb-4">🌊 MadBoat v2.0</h1>
        <p className="text-xl mb-8">Universo dos 3 Mundos</p>
        <WelcomeMessage />
      </div>
    </main>
  )
}