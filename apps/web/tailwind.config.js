/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // MadBoat Brand Colors - Light & Dark Mode Compatible
        brand: {
          // Primary Ocean Blues (Trust & Foundation)
          'ocean-50': '#f0f9ff',
          'ocean-100': '#e0f2fe',
          'ocean-200': '#bae6fd',
          'ocean-300': '#7dd3fc',
          'ocean-400': '#38bdf8',
          'ocean-500': '#0ea5e9', // Primary brand blue
          'ocean-600': '#0284c7',
          'ocean-700': '#0369a1',
          'ocean-800': '#075985',
          'ocean-900': '#0c4a6e',
          'ocean-950': '#082f49',
          
          // Golden Nautical (Accent & Success)
          'gold-50': '#fffbeb',
          'gold-100': '#fef3c7',
          'gold-200': '#fde68a',
          'gold-300': '#fcd34d',
          'gold-400': '#fbbf24',
          'gold-500': '#f59e0b', // Primary gold
          'gold-600': '#d97706',
          'gold-700': '#b45309',
          'gold-800': '#92400e',
          'gold-900': '#78350f',
          'gold-950': '#451a03',
          
          // Deep Sea (Professional Dark)
          'deep-50': '#f8fafc',
          'deep-100': '#f1f5f9',
          'deep-200': '#e2e8f0',
          'deep-300': '#cbd5e1',
          'deep-400': '#94a3b8',
          'deep-500': '#64748b',
          'deep-600': '#475569',
          'deep-700': '#334155',
          'deep-800': '#1e293b',
          'deep-900': '#0f172a',
          'deep-950': '#020617',
        },
        
        // Semantic Colors with Light/Dark Variants
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        // Executive light mode gradients
        'light-hero': 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)',
        'light-card': 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
        // Premium dark mode gradients  
        'dark-hero': 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        'dark-card': 'linear-gradient(145deg, #1e293b 0%, #334155 100%)',
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'blob': 'blob 7s infinite',
        'float': 'float 10s infinite',
        'wave': 'wave 8s linear infinite',
        'fade-in': 'fade-in 0.6s ease-out',
        'slide-up': 'slide-up 0.5s ease-out',
        'scale-in': 'scale-in 0.4s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
      },
      
      fontFamily: {
        // Executive typography hierarchy
        'display': ['Inter', 'system-ui', 'sans-serif'], // Headlines and primary CTAs
        'body': ['Inter', 'system-ui', 'sans-serif'], // Body text and descriptions  
        'mono': ['JetBrains Mono', 'ui-monospace', 'monospace'], // Code and technical content
      },
      
      fontSize: {
        // Instructional design typography scale
        'hero': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'h1': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '600' }],
        'h2': ['2rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
        'h3': ['1.5rem', { lineHeight: '1.4', letterSpacing: '0', fontWeight: '500' }],
        'body-lg': ['1.125rem', { lineHeight: '1.7', letterSpacing: '0', fontWeight: '400' }],
        'body': ['1rem', { lineHeight: '1.6', letterSpacing: '0', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '400' }],
        'caption': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.01em', fontWeight: '500' }],
      },
      
      spacing: {
        // Executive interface spacing system
        '18': '4.5rem',
        '88': '22rem',
        '120': '30rem',
        '160': '40rem',
      },
      
      borderRadius: {
        // Premium border radius scale
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      
      boxShadow: {
        // Light & dark mode compatible shadows
        'light-sm': '0 2px 4px 0 rgba(0, 0, 0, 0.05)',
        'light-md': '0 4px 12px 0 rgba(0, 0, 0, 0.1)',
        'light-lg': '0 8px 24px 0 rgba(0, 0, 0, 0.12)',
        'light-xl': '0 20px 40px 0 rgba(0, 0, 0, 0.15)',
        'dark-sm': '0 2px 4px 0 rgba(0, 0, 0, 0.3)',
        'dark-md': '0 4px 12px 0 rgba(0, 0, 0, 0.4)',
        'dark-lg': '0 8px 24px 0 rgba(0, 0, 0, 0.5)',
        'dark-xl': '0 20px 40px 0 rgba(0, 0, 0, 0.6)',
        'glow': '0 0 20px rgba(14, 165, 233, 0.3)',
        'glow-gold': '0 0 20px rgba(245, 158, 11, 0.3)',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        wave: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100px)' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}