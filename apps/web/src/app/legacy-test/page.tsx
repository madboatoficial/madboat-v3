/**
 * 🐙 LEGACY TEST PAGE - MCP Revolution Demo
 * 
 * Test page demonstrating real data integration via MCP
 * Shows the power of AI-collaborative development with Supabase
 */

import { LegacyPageWithData } from '@/components/LegacyPageWithData'

export default function LegacyTestPage() {
  return (
    <LegacyPageWithData 
      userName="Capitão MadBoat"
      userId="11111111-1111-1111-1111-111111111111"
      onNavigate={(page) => {
        console.log(`Navigating to: ${page}`)
        // Navigation logic here
      }}
    />
  )
}

export const metadata = {
  title: 'Legacy Test - MadBoat MCP Demo',
  description: 'Demonstração do poder do MCP com dados reais do Supabase',
}