"use client"

import { CinematicJourney } from '@madboat/ui'

export default function HomePage() {
  // Direct access without authentication
  const userName = 'Navigator'

  return (
    <CinematicJourney userName={userName} />
  )
}