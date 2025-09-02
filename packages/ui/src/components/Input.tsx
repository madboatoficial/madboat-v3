import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

const inputVariants = cva(
  "flex w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-base text-black font-medium file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 disabled:cursor-not-allowed disabled:opacity-50 shadow-xl transition-all",
  {
    variants: {
      variant: {
        default: "border-gray-300 focus:border-blue-500",
        error: "border-red-500 focus:border-red-500 focus:ring-red-500/30",
        success: "border-green-500 focus:border-green-500 focus:ring-green-500/30",
      },
      size: {
        default: "h-12 px-4 py-3",
        sm: "h-10 px-3 py-2",
        lg: "h-14 px-5 py-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string
  error?: string
  success?: string
  loading?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, label, error, success, loading, type, ...props }, ref) => {
    const inputVariant = error ? "error" : success ? "success" : variant

    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-semibold leading-none text-white mb-1 drop-shadow-sm peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            type={type}
            className="w-full h-12 px-4 py-3 text-lg font-bold bg-white text-black border-2 border-gray-400 rounded-lg focus:border-blue-500 focus:outline-none"
            style={{ 
              backgroundColor: '#FFFFFF',
              color: '#000000',
              fontSize: '18px',
              fontWeight: 'bold'
            }}
            ref={ref}
            disabled={loading}
            {...props}
          />
          {loading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent opacity-50" />
            </div>
          )}
        </div>
        {error && (
          <p className="text-sm text-red-400 font-medium">{error}</p>
        )}
        {success && !error && (
          <p className="text-sm text-green-400 font-medium">{success}</p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input, inputVariants }