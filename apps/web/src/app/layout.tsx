import type { Metadata, Viewport } from 'next'
import './globals.css'
import { PageTransition } from './components/PageTransition'
// import { GlobalErrorBoundary } from '@madboat/ui/error'
// import { MonitoringProvider } from './monitoring'

export const metadata: Metadata = {
  title: {
    default: 'MadBoat v2.0 - Universo dos 3 Mundos',
    template: '%s | MadBoat v2.0'
  },
  description: 'Plataforma de desenvolvimento pessoal e profissional com Sistema Timeline e 26 Personas Executivas',
  keywords: ['desenvolvimento pessoal', 'personas executivas', 'timeline', 'gamificação', 'profissional'],
  authors: [{ name: 'MadBoat Team' }],
  creator: 'MadBoat',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'MadBoat v2.0'
  },
  openGraph: {
    type: 'website',
    siteName: 'MadBoat v2.0',
    title: 'MadBoat v2.0 - Universo dos 3 Mundos',
    description: 'Plataforma revolucionária para desenvolvimento pessoal e profissional',
    images: ['/og-image.png']
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MadBoat v2.0 - Universo dos 3 Mundos',
    description: 'Plataforma revolucionária para desenvolvimento pessoal e profissional'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f4f4f5' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' }
  ],
  viewportFit: 'cover'
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="antialiased bg-white text-black min-h-screen font-sans">
        <div id="app-root" className="relative">
          <PageTransition>
            {children}
          </PageTransition>
        </div>
        <div id="modal-root" />
      </body>
    </html>
  )
}