"use client"

import * as React from "react"

interface ModernInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  success?: string
  loading?: boolean
}

const ModernInput = React.forwardRef<HTMLInputElement, ModernInputProps>(
  ({ className, label, error, success, loading, type, ...props }, ref) => {
    const [focused, setFocused] = React.useState(false)
    const [hasValue, setHasValue] = React.useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value.length > 0)
      if (props.onChange) {
        props.onChange(e)
      }
    }

    return (
      <div className="relative w-full">
        {/* Input Container */}
        <div className="relative">
          <input
            type={type}
            className={`
              peer w-full h-14 px-4 pt-6 pb-2 text-lg font-medium
              bg-white text-gray-900
              border-2 rounded-xl transition-all duration-200 ease-in-out
              ${error 
                ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/20' 
                : success 
                ? 'border-green-500 focus:border-green-500 focus:ring-4 focus:ring-green-500/20'
                : 'border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20'
              }
              focus:outline-none
              disabled:opacity-50 disabled:cursor-not-allowed
              shadow-sm hover:shadow-md focus:shadow-lg
              ${className || ''}
            `}
            style={{
              backgroundColor: '#FFFFFF',
              color: '#111827',
              fontSize: '18px',
              fontWeight: '500',
            }}
            ref={ref}
            disabled={loading}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChange={handleChange}
            {...props}
          />
          
          {/* Floating Label */}
          {label && (
            <label
              className={`
                absolute left-4 text-gray-500 pointer-events-none transition-all duration-200 ease-in-out
                ${focused || hasValue || props.value 
                  ? 'top-2 text-xs font-semibold text-blue-600' 
                  : 'top-1/2 -translate-y-1/2 text-base'
                }
                ${error ? 'text-red-500' : success ? 'text-green-500' : ''}
              `}
              style={{
                color: focused || hasValue || props.value 
                  ? (error ? '#ef4444' : success ? '#10b981' : '#2563eb')
                  : '#6b7280',
                fontSize: focused || hasValue || props.value ? '12px' : '16px',
                fontWeight: focused || hasValue || props.value ? '600' : '400'
              }}
            >
              {label}
            </label>
          )}

          {/* Loading Spinner */}
          {loading && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <p className="mt-2 text-sm font-medium text-red-500 flex items-center gap-1">
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}

        {/* Success Message */}
        {success && !error && (
          <p className="mt-2 text-sm font-medium text-green-500 flex items-center gap-1">
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {success}
          </p>
        )}
      </div>
    )
  }
)

ModernInput.displayName = "ModernInput"

export { ModernInput }