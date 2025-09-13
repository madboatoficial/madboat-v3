import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`${inter.className} min-h-screen bg-gray-50`}>
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
          <div className="p-6">
            {/* Logo */}
            <div className="mb-8">
              <h1 className="text-2xl font-medium tracking-[0.08em] text-black">
                madboat
              </h1>
              <p className="text-xs text-gray-500 mt-1">Admin Console</p>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              <a 
                href="/admin" 
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="mr-3">🏠</span>
                Dashboard
              </a>
              <a 
                href="/admin/agentes" 
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-900 bg-gray-100 rounded-lg"
              >
                <span className="mr-3">🤖</span>
                Agentes
              </a>
              <a 
                href="/admin/system" 
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="mr-3">⚙️</span>
                Sistema
              </a>
              <a 
                href="/admin/logs" 
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="mr-3">📊</span>
                Logs
              </a>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Admin Console
                </h2>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>Sistema Online</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </header>

          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}