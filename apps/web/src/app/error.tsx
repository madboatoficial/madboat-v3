"use client"

import { ErrorBoundary } from '@/components/error-boundary'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorPageProps) {
  return <ErrorBoundary error={error} reset={reset} />
}