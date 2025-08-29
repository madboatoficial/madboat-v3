import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MadBoat v2.0 - Universo dos 3 Mundos',
  description: 'Plataforma de desenvolvimento pessoal e profissional',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}