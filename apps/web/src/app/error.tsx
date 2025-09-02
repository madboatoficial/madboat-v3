'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold mb-4">500</h1>
        <p className="text-xl mb-4">Erro interno do servidor</p>
        <p className="text-sm opacity-60 mb-6">{error.message}</p>
        <button
          onClick={reset}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  )
}