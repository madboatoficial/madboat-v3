// Test setup with global mocks
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

// React 19 compatibility fixes
(global as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true

// Fix for React 19 objects as children error
const originalConsoleError = console.error
console.error = (...args) => {
  if (
    args[0] &&
    typeof args[0] === 'string' &&
    args[0].includes('Objects are not valid as a React child')
  ) {
    return
  }
  originalConsoleError(...args)
}

// Cleanup after each test case
afterEach(() => {
  cleanup()
})

// Mock window.matchMedia for responsive tests
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => {},
    }),
  })
}

// Mock IntersectionObserver
(global as typeof globalThis & { IntersectionObserver: typeof IntersectionObserver }).IntersectionObserver = class MockIntersectionObserver {
  root = null
  rootMargin = '0px'
  thresholds = [0]
  
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
  takeRecords() { return [] }
}