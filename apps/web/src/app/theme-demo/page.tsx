import { ThemeShowcase } from '@madboat/ui'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MadBoat Theme System | Executive Light & Dark Mode',
  description: 'Premium B2B theme system with WCAG-compliant light and dark modes for digital transformation professionals.',
}

/**
 * 🎨 Theme Demonstration Page
 * 
 * Showcases the comprehensive MadBoat light/dark theme system
 * with executive B2B components and instructional design principles.
 */
export default function ThemeDemoPage() {
  return <ThemeShowcase />
}