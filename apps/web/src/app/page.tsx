"use client"

import { CinematicJourney } from '@madboat/ui'
import { useAuthState } from '@/hooks/use-auth-state'

export default function HomePage() {
  const { user } = useAuthState()
  
  // Extract clean name from email
  const userName = user?.email?.split('@')[0]?.split('.').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ') || 'Navigator'

  return (
    <CinematicJourney userName={userName} />
  )
}