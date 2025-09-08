"use client"

/**
 * 🎯 HEXAGONAL SKILL TREE - Demo Page
 * Demonstração do sistema hexagonal AAA do MadBoat
 */

import { HexagonalSkillTree, type Hexagram } from '@madboat/ui'

export default function HexagonalSkillTreePage() {
  const handleHexagramClick = (hexagram: Hexagram) => {
    console.log('Hexagram clicked:', hexagram)
  }

  return (
    <div className="w-full h-full">
      <HexagonalSkillTree 
        userName="Captain Sandro"
        onHexagramClick={handleHexagramClick}
      />
    </div>
  )
}