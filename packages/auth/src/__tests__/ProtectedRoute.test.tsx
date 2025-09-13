import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProtectedRoute } from '../ProtectedRoute'

// Mock useAuth hook
const mockUseAuth = vi.fn()
vi.mock('../useAuth', () => ({
  useAuth: mockUseAuth
}))

// Mock Next.js router
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush
  })
}))

describe('ProtectedRoute', () => {
  const TestComponent = () => <div>Protected Content</div>

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should show loading when auth is loading', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: true
    })

    render(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>
    )

    expect(screen.getByRole('status')).toBeDefined()
    expect(screen.queryByText('Protected Content')).toBeNull()
  })

  it('should show children when user is authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: { id: '123', email: 'test@test.com' },
      loading: false
    })

    render(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>
    )

    expect(screen.getByText('Protected Content')).toBeDefined()
  })

  it('should redirect when user is not authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false
    })

    render(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>
    )

    expect(mockPush).toHaveBeenCalledWith('/')
    expect(screen.queryByText('Protected Content')).toBeNull()
  })

  it('should redirect to custom fallback URL', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false
    })

    render(
      <ProtectedRoute fallbackUrl="/login">
        <TestComponent />
      </ProtectedRoute>
    )

    expect(mockPush).toHaveBeenCalledWith('/login')
  })
})