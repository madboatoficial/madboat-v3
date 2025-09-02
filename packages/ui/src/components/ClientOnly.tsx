/**
 * ClientOnly Wrapper - Prevents Hydration Mismatches
 * 
 * This component ensures that its children are only rendered on the client-side,
 * preventing hydration mismatches when content differs between server and client.
 */

"use client"

import { useEffect, useState } from 'react'

interface ClientOnlyProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return <>{fallback}</>
  }

  return <>{children}</>
}