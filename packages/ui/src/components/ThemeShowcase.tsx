'use client'

import * as React from "react"
import { Check, Star, Users, Shield, TrendingUp, ArrowRight, Mail, Lock } from "lucide-react"
import ThemeToggle from "./ThemeToggle"

/**
 * 🎨 MadBoat Theme Showcase Component
 * 
 * Demonstrates the comprehensive light/dark mode design system
 * with executive B2B components and instructional design principles.
 */
export function ThemeShowcase() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header with Theme Toggle */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-ocean-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <h1 className="text-h3 font-display font-bold text-foreground">
              MadBoat Theme System
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle variant="switch" />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
        
        {/* Hero Section */}
        <section className="text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-hero font-display font-bold text-foreground">
              Executive-Grade Design System
            </h2>
            <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
              Premium light and dark themes designed for B2B transformation professionals. 
              Every element optimized for conversion, trust, and instructional clarity.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="btn-conversion-cta">
              Start Your Transformation
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
            <button className="btn-executive-secondary">
              Schedule Demo
            </button>
          </div>
        </section>

        {/* Trust Signals */}
        <section className="bg-card rounded-3xl p-8 border border-border shadow-light-lg dark:shadow-dark-lg">
          <div className="text-center space-y-6">
            <h3 className="text-h2 font-display font-semibold text-foreground">
              Trusted by Industry Leaders
            </h3>
            
            <div className="flex flex-wrap justify-center gap-4">
              <div className="trust-signal">
                <Shield className="w-4 h-4" />
                <span>Enterprise Security</span>
              </div>
              <div className="trust-signal">
                <Users className="w-4 h-4" />
                <span>10,000+ Companies</span>
              </div>
              <div className="trust-signal">
                <TrendingUp className="w-4 h-4" />
                <span>98% Success Rate</span>
              </div>
              <div className="trust-signal">
                <Star className="w-4 h-4" />
                <span>4.9/5 Rating</span>
              </div>
            </div>
          </div>
        </section>

        {/* Color Palette Display */}
        <section className="space-y-8">
          <div className="text-center">
            <h3 className="text-h2 font-display font-semibold text-foreground mb-4">
              WCAG-Compliant Color System
            </h3>
            <p className="text-body text-muted-foreground">
              Professional color palette ensuring accessibility and brand consistency
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Ocean Blues */}
            <div className="card-executive space-y-4">
              <h4 className="text-h3 font-display font-medium text-foreground">Ocean Blues</h4>
              <div className="space-y-2">
                {[
                  { name: 'Ocean 500 (Primary)', bg: 'bg-brand-ocean-500', text: 'text-white' },
                  { name: 'Ocean 600', bg: 'bg-brand-ocean-600', text: 'text-white' },
                  { name: 'Ocean 100', bg: 'bg-brand-ocean-100', text: 'text-brand-ocean-900' },
                  { name: 'Ocean 50', bg: 'bg-brand-ocean-50', text: 'text-brand-ocean-900' },
                ].map((color) => (
                  <div key={color.name} className={`${color.bg} ${color.text} p-3 rounded-lg flex justify-between items-center`}>
                    <span className="font-medium text-body-sm">{color.name}</span>
                    <span className="text-caption opacity-80">AAA</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Golden Accents */}
            <div className="card-executive space-y-4">
              <h4 className="text-h3 font-display font-medium text-foreground">Golden Accents</h4>
              <div className="space-y-2">
                {[
                  { name: 'Gold 500 (Accent)', bg: 'bg-brand-gold-500', text: 'text-white' },
                  { name: 'Gold 600', bg: 'bg-brand-gold-600', text: 'text-white' },
                  { name: 'Gold 100', bg: 'bg-brand-gold-100', text: 'text-brand-gold-900' },
                  { name: 'Gold 50', bg: 'bg-brand-gold-50', text: 'text-brand-gold-900' },
                ].map((color) => (
                  <div key={color.name} className={`${color.bg} ${color.text} p-3 rounded-lg flex justify-between items-center`}>
                    <span className="font-medium text-body-sm">{color.name}</span>
                    <span className="text-caption opacity-80">AAA</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Deep Sea Grays */}
            <div className="card-executive space-y-4">
              <h4 className="text-h3 font-display font-medium text-foreground">Deep Sea Grays</h4>
              <div className="space-y-2">
                {[
                  { name: 'Deep 900', bg: 'bg-brand-deep-900', text: 'text-white' },
                  { name: 'Deep 600', bg: 'bg-brand-deep-600', text: 'text-white' },
                  { name: 'Deep 300', bg: 'bg-brand-deep-300', text: 'text-brand-deep-900' },
                  { name: 'Deep 100', bg: 'bg-brand-deep-100', text: 'text-brand-deep-900' },
                ].map((color) => (
                  <div key={color.name} className={`${color.bg} ${color.text} p-3 rounded-lg flex justify-between items-center`}>
                    <span className="font-medium text-body-sm">{color.name}</span>
                    <span className="text-caption opacity-80">AA+</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Form Components */}
        <section className="space-y-8">
          <div className="text-center">
            <h3 className="text-h2 font-display font-semibold text-foreground mb-4">
              Executive Form Components
            </h3>
            <p className="text-body text-muted-foreground">
              Professional forms with instructional design and accessibility
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="card-premium space-y-6">
              <div className="text-center space-y-2">
                <h4 className="text-h3 font-display font-semibold text-foreground">
                  Get Executive Demo
                </h4>
                <p className="text-body text-muted-foreground">
                  Transform your organization with our proven methodology
                </p>
              </div>

              <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="block text-body-sm font-medium text-foreground">
                      First Name *
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      placeholder="John"
                      className="input-executive"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="block text-body-sm font-medium text-foreground">
                      Last Name *
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      placeholder="Doe"
                      className="input-executive"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-body-sm font-medium text-foreground">
                    Business Email *
                  </label>
                  <div className="relative">
                    <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="email"
                      type="email"
                      placeholder="john.doe@company.com"
                      className="input-executive pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="company" className="block text-body-sm font-medium text-foreground">
                    Company Name *
                  </label>
                  <input
                    id="company"
                    type="text"
                    placeholder="Your Company Inc."
                    className="input-executive"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="role" className="block text-body-sm font-medium text-foreground">
                    Your Role
                  </label>
                  <select className="input-executive">
                    <option>Select your role</option>
                    <option>CEO / President</option>
                    <option>CTO / VP Engineering</option>
                    <option>Chief Digital Officer</option>
                    <option>VP Operations</option>
                    <option>Director / Manager</option>
                    <option>Consultant</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="flex items-start gap-3 pt-2">
                  <input
                    id="consent"
                    type="checkbox"
                    className="mt-1 h-4 w-4 text-primary focus:ring-ring border-border rounded"
                  />
                  <label htmlFor="consent" className="text-body-sm text-muted-foreground">
                    I agree to receive communications about MadBoat's transformation solutions and 
                    understand I can opt out at any time. View our{' '}
                    <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
                  </label>
                </div>

                <button type="submit" className="btn-executive-primary w-full">
                  <Shield className="w-5 h-5 mr-2" />
                  Get Secure Demo Access
                </button>
              </form>

              <div className="text-center">
                <p className="text-caption text-muted-foreground flex items-center justify-center gap-2">
                  <Lock className="w-4 h-4" />
                  Your information is encrypted and secure
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Card Variants */}
        <section className="space-y-8">
          <div className="text-center">
            <h3 className="text-h2 font-display font-semibold text-foreground mb-4">
              Premium Card Components
            </h3>
            <p className="text-body text-muted-foreground">
              Elevated designs that build trust and guide conversion
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {/* Standard Executive Card */}
            <div className="card-executive space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="text-h3 font-display font-medium text-foreground">
                    Digital Transformation
                  </h4>
                  <p className="text-body text-muted-foreground mt-2">
                    Accelerate your organization's journey to digital excellence with proven methodologies.
                  </p>
                </div>
              </div>
              
              <ul className="space-y-2">
                {[
                  'Strategic roadmap development',
                  'Technology stack optimization',
                  'Change management support',
                  'Performance metrics tracking'
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-body-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Premium Card */}
            <div className="card-premium space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h4 className="text-h3 font-display font-medium text-foreground">
                    Enterprise Security
                  </h4>
                  <p className="text-body text-muted-foreground mt-2">
                    Bank-grade security infrastructure protecting your digital transformation.
                  </p>
                </div>
              </div>
              
              <div className="trust-signal">
                <Star className="w-4 h-4" />
                <span>Premium Feature</span>
              </div>
            </div>

            {/* Another Standard Card */}
            <div className="card-executive space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-h3 font-display font-medium text-foreground">
                    Team Transformation
                  </h4>
                  <p className="text-body text-muted-foreground mt-2">
                    Empower your teams with the skills and tools for digital success.
                  </p>
                </div>
              </div>
              
              <button className="btn-executive-secondary w-full">
                Learn More
              </button>
            </div>
          </div>
        </section>

        {/* Typography Scale */}
        <section className="space-y-8">
          <div className="text-center">
            <h3 className="text-h2 font-display font-semibold text-foreground mb-4">
              Executive Typography System
            </h3>
            <p className="text-body text-muted-foreground">
              Instructionally-designed type hierarchy for maximum readability and conversion
            </p>
          </div>

          <div className="card-executive space-y-6">
            <div className="text-hero font-display font-bold text-foreground">
              Hero Headline (3.5rem)
            </div>
            <div className="text-h1 font-display font-semibold text-foreground">
              Primary Heading (2.5rem)
            </div>
            <div className="text-h2 font-display font-medium text-foreground">
              Secondary Heading (2rem)
            </div>
            <div className="text-h3 font-display font-medium text-foreground">
              Tertiary Heading (1.5rem)
            </div>
            <div className="text-body-lg text-muted-foreground">
              Large body text for important descriptions and value propositions. (1.125rem)
            </div>
            <div className="text-body text-muted-foreground">
              Standard body text for general content, optimized for readability. (1rem)
            </div>
            <div className="text-body-sm text-muted-foreground">
              Small body text for secondary information and form labels. (0.875rem)
            </div>
            <div className="text-caption text-muted-foreground font-medium">
              CAPTION TEXT FOR METADATA AND MICRO-COPY (0.75rem)
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}

export default ThemeShowcase