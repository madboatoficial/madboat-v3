import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login - MadBoat',
  description: 'Acesse sua conta MadBoat'
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}