import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useAuth } from '../useAuth'

// Mock Zustand store
vi.mock('../authStore', () => ({
  useAuthStore: vi.fn(() => ({
    user: null,
    session: null,
    setUser: vi.fn(),
    setSession: vi.fn(),
    clearAuth: vi.fn(),
  }))
}))

describe('useAuth', () => {
  const mockSupabase = {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      resetPasswordForEmail: vi.fn(),
      updateUser: vi.fn(),
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()

    // Default mocks
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null }
    })

    mockSupabase.auth.onAuthStateChange.mockReturnValue({
      data: {
        subscription: {
          unsubscribe: vi.fn()
        }
      }
    })
  })

  it('should initialize with loading state', () => {
    const { result } = renderHook(() => useAuth())

    expect(result.current.loading).toBe(true)
    expect(result.current.user).toBe(null)
    expect(result.current.session).toBe(null)
  })

  it('should handle successful sign in', async () => {
    const mockUser = { id: '123', email: 'test@test.com' }
    const mockSession = { user: mockUser, access_token: 'token' }

    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: mockUser, session: mockSession },
      error: null
    })

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      await result.current.signIn('test@test.com', 'password')
    })

    expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: 'password'
    })
  })

  it('should handle sign in error', async () => {
    const mockError = new Error('Invalid credentials')
    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: null, session: null },
      error: mockError
    })

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      try {
        await result.current.signIn('test@test.com', 'wrong-password')
      } catch (error) {
        expect(error).toBe(mockError)
      }
    })

    expect(result.current.error).toBe(mockError)
  })

  it('should handle successful sign up', async () => {
    const mockUser = { id: '123', email: 'test@test.com' }
    const mockSession = { user: mockUser, access_token: 'token' }

    mockSupabase.auth.signUp.mockResolvedValue({
      data: { user: mockUser, session: mockSession },
      error: null
    })

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      await result.current.signUp('test@test.com', 'password')
    })

    expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: 'password'
    })
  })

  it('should handle sign out', async () => {
    mockSupabase.auth.signOut.mockResolvedValue({ error: null })

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      await result.current.signOut()
    })

    expect(mockSupabase.auth.signOut).toHaveBeenCalled()
  })

  it('should handle password reset', async () => {
    mockSupabase.auth.resetPasswordForEmail.mockResolvedValue({ error: null })

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      await result.current.resetPassword('test@test.com')
    })

    expect(mockSupabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(
      'test@test.com',
      { redirectTo: `${window.location.origin}/reset-password` }
    )
  })

  it('should handle profile update', async () => {
    const updatedUser = { id: '123', email: 'test@test.com', name: 'Test User' }
    const mockSession = { user: updatedUser, access_token: 'token' }

    mockSupabase.auth.updateUser.mockResolvedValue({ error: null })
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: mockSession }
    })

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      await result.current.updateProfile({ name: 'Test User' })
    })

    expect(mockSupabase.auth.updateUser).toHaveBeenCalledWith({
      data: { name: 'Test User' }
    })
  })

  it('should cleanup subscription on unmount', () => {
    const unsubscribeMock = vi.fn()
    mockSupabase.auth.onAuthStateChange.mockReturnValue({
      data: {
        subscription: {
          unsubscribe: unsubscribeMock
        }
      }
    })

    const { unmount } = renderHook(() => useAuth())

    unmount()

    expect(unsubscribeMock).toHaveBeenCalled()
  })
})