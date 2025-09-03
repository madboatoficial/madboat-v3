"use client"

import React, { useState } from 'react'
import { ExecutiveHUD, ChallengesPage, MissionsPage, AchievementsPage, LegacyPage } from '@madboat/ui'

type Page = 'dashboard' | 'challenges' | 'missions' | 'achievements' | 'legacy'

export default function ExecutivePage() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')
  const [currentModule, setCurrentModule] = useState<'personas' | 'alma' | 'vortice' | 'odisseia'>('alma')
  
  const handleModuleSelect = (moduleId: string) => {
    console.log('Module selected:', moduleId)
    setCurrentModule(moduleId as any)
  }
  
  const handleActionTrigger = (moduleId: string, action: string) => {
    console.log('Action triggered:', moduleId, action)
  }
  
  const handleMilestoneView = (milestone: string) => {
    console.log('Milestone viewed:', milestone)
  }
  
  const handleNavigate = (page: Page) => {
    console.log('Navigating to:', page)
    setCurrentPage(page)
  }
  
  const handleChallengeStart = (challengeId: string) => {
    console.log('Challenge started:', challengeId)
  }
  
  const handleChallengeSubmit = (challengeId: string, data: any) => {
    console.log('Challenge submitted:', challengeId, data)
  }
  
  const handleMissionStart = (missionId: string) => {
    console.log('Mission started:', missionId)
  }
  
  const handleMissionSubmit = (missionId: string, checkpointId: string, evidence: File) => {
    console.log('Mission checkpoint submitted:', missionId, checkpointId, evidence)
  }
  
  // Render based on current page
  if (currentPage === 'challenges') {
    return (
      <ChallengesPage
        currentModule={currentModule}
        userName="Sandro"
        onChallengeStart={handleChallengeStart}
        onChallengeSubmit={handleChallengeSubmit}
        onNavigate={handleNavigate}
      />
    )
  }
  
  if (currentPage === 'missions') {
    return (
      <MissionsPage
        currentModule={currentModule}
        userName="Sandro"
        onMissionStart={handleMissionStart}
        onMissionSubmit={handleMissionSubmit}
        onNavigate={handleNavigate}
      />
    )
  }
  
  if (currentPage === 'achievements') {
    return (
      <AchievementsPage
        userName="Sandro"
        onNavigate={handleNavigate}
      />
    )
  }
  
  if (currentPage === 'legacy') {
    return (
      <LegacyPage
        userName="Sandro"
        onNavigate={handleNavigate}
      />
    )
  }
  
  // Default: Dashboard
  return (
    <ExecutiveHUD
      userName="Sandro"
      onModuleSelect={handleModuleSelect}
      onActionTrigger={handleActionTrigger}
      onMilestoneView={handleMilestoneView}
      onNavigate={handleNavigate}
    />
  )
}