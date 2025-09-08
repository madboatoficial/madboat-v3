'use client'

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"

export type Theme = 'light' | 'dark' | 'system'

interface ThemeToggleProps {
  variant?: 'button' | 'dropdown' | 'switch'
  className?: string
}

/**
 * 🌊 MadBoat Theme Toggle Component
 * 
 * A beautifully designed theme switcher that maintains brand identity
 * across light and dark modes. Follows executive B2B design patterns
 * with instructional clarity.
 */
export function ThemeToggle({ variant = 'button', className = '' }: ThemeToggleProps) {
  const [theme, setTheme] = React.useState<Theme>('system')
  const [mounted, setMounted] = React.useState(false)

  // Hydration safety
  React.useEffect(() => {
    setMounted(true)
    
    // Get initial theme from localStorage or system preference
    const savedTheme = localStorage.getItem('madboat-theme') as Theme
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      setTheme(savedTheme)
      applyTheme(savedTheme)
    } else {
      applyTheme('system')
    }
  }, [])

  const applyTheme = React.useCallback((newTheme: Theme) => {
    const root = document.documentElement
    
    if (newTheme === 'system') {
      // Use system preference
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      root.classList.toggle('dark', systemTheme === 'dark')
    } else {
      // Apply explicit theme
      root.classList.toggle('dark', newTheme === 'dark')
    }
    
    // Save to localStorage
    localStorage.setItem('madboat-theme', newTheme)
  }, [])

  const toggleTheme = React.useCallback(() => {
    const themes: Theme[] = ['light', 'dark', 'system']
    const currentIndex = themes.indexOf(theme)
    const nextTheme = themes[(currentIndex + 1) % themes.length]
    
    setTheme(nextTheme)
    applyTheme(nextTheme)
  }, [theme, applyTheme])

  const selectTheme = React.useCallback((selectedTheme: Theme) => {
    setTheme(selectedTheme)
    applyTheme(selectedTheme)
  }, [applyTheme])

  // System theme change listener
  React.useEffect(() => {
    if (theme !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => applyTheme('system')
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme, applyTheme])

  if (!mounted) {
    // SSR-safe fallback
    return (
      <button 
        className={`p-3 rounded-xl bg-secondary text-secondary-foreground ${className}`}
        disabled
      >
        <div className="w-5 h-5" />
      </button>
    )
  }

  const getThemeIcon = (themeType: Theme) => {
    switch (themeType) {
      case 'light': return <Sun className="w-5 h-5" />
      case 'dark': return <Moon className="w-5 h-5" />
      case 'system': return <Monitor className="w-5 h-5" />
    }
  }

  const getThemeLabel = (themeType: Theme) => {
    switch (themeType) {
      case 'light': return 'Light Mode'
      case 'dark': return 'Dark Mode' 
      case 'system': return 'System'
    }
  }

  if (variant === 'button') {
    return (
      <button
        onClick={toggleTheme}
        className={`
          group relative p-3 rounded-xl
          bg-secondary/50 hover:bg-secondary
          text-secondary-foreground
          border border-border/50 hover:border-border
          shadow-light-sm hover:shadow-light-md
          dark:shadow-dark-sm dark:hover:shadow-dark-md
          transition-all duration-300 ease-out
          focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
          ${className}
        `}
        title={`Current: ${getThemeLabel(theme)} - Click to cycle themes`}
        aria-label={`Current theme: ${getThemeLabel(theme)}. Click to cycle through theme options.`}
      >
        <div className="relative">
          {getThemeIcon(theme)}
          
          {/* Instructional tooltip on hover */}
          <div className="
            absolute -top-12 left-1/2 -translate-x-1/2
            px-3 py-1 rounded-lg
            bg-popover text-popover-foreground
            text-caption font-medium
            border border-border
            shadow-light-md dark:shadow-dark-md
            opacity-0 group-hover:opacity-100
            transition-opacity duration-200
            pointer-events-none
            whitespace-nowrap
          ">
            {getThemeLabel(theme)}
          </div>
        </div>
      </button>
    )
  }

  if (variant === 'dropdown') {
    return (
      <div className={`relative ${className}`}>
        <select
          value={theme}
          onChange={(e) => selectTheme(e.target.value as Theme)}
          className="
            appearance-none px-4 py-2 pr-8 rounded-xl
            bg-secondary text-secondary-foreground
            border border-border
            focus:ring-2 focus:ring-ring focus:border-transparent
            transition-all duration-200 ease-out
            font-medium text-body-sm
          "
          aria-label="Select theme preference"
        >
          <option value="light">Light Mode</option>
          <option value="dark">Dark Mode</option>
          <option value="system">System Preference</option>
        </select>
        
        {/* Custom dropdown arrow */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    )
  }

  // Switch variant
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <span className="text-body-sm text-muted-foreground font-medium">
        Theme
      </span>
      
      <div className="flex rounded-xl bg-secondary p-1 border border-border">
        {(['light', 'dark', 'system'] as Theme[]).map((themeOption) => (
          <button
            key={themeOption}
            onClick={() => selectTheme(themeOption)}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-lg
              text-body-sm font-medium
              transition-all duration-200 ease-out
              focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-secondary
              ${theme === themeOption 
                ? 'bg-background text-foreground shadow-light-sm dark:shadow-dark-sm' 
                : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
              }
            `}
            aria-pressed={theme === themeOption}
            aria-label={`Switch to ${getThemeLabel(themeOption)}`}
          >
            {getThemeIcon(themeOption)}
            <span className="hidden sm:inline">
              {getThemeLabel(themeOption)}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

/**
 * React hook for theme state management
 */
export function useTheme() {
  const [theme, setTheme] = React.useState<Theme>('system')
  const [mounted, setMounted] = React.useState(false)
  
  React.useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('madboat-theme') as Theme || 'system'
    setTheme(savedTheme)
  }, [])

  const changeTheme = React.useCallback((newTheme: Theme) => {
    setTheme(newTheme)
    
    const root = document.documentElement
    if (newTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      root.classList.toggle('dark', systemTheme === 'dark')
    } else {
      root.classList.toggle('dark', newTheme === 'dark')
    }
    
    localStorage.setItem('madboat-theme', newTheme)
  }, [])

  return {
    theme: mounted ? theme : 'system',
    setTheme: changeTheme,
    mounted
  }
}

export default ThemeToggle