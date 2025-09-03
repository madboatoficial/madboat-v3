import type { Metadata, Viewport } from 'next'
import './globals.css'

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
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' }
  ],
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="antialiased bg-zinc-950 text-white min-h-screen font-sans">
        <div id="app-root" className="relative">
          {children}
        </div>
        <div id="modal-root" />
      </body>
    </html>
  )
}