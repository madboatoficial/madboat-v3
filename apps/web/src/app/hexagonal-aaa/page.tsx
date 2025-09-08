"use client"

/**
 * 🎮 HEXAGONAL SKILL TREE AAA - Demo Page
 * Sistema hexagonal de última geração inspirado em jogos AAA
 */

import { HexagonalSkillTreeAAA, type HexagramAAA } from '@madboat/ui'

export default function HexagonalAAAPage() {
  const handleHexagramClick = (hexagram: HexagramAAA) => {
    console.log('🎮 Hexagram clicked:', hexagram)
  }

  return (
    <div className="w-full h-full">
      <HexagonalSkillTreeAAA 
        userName="Captain Sandro"
        onHexagramClick={handleHexagramClick}
      />
    </div>
  )
}