'use server'

import { revalidatePath } from 'next/cache'

// Simulate database operations for demo
const moduleDatabase = new Map<string, { progress: number, status: string }>()

export async function selectModuleAction(moduleId: string): Promise<void> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  console.log(`Selected module: ${moduleId}`)
  
  // Update current module in "database"
  const currentData = moduleDatabase.get(moduleId) || { progress: 0, status: 'pending' }
  moduleDatabase.set(moduleId, {
    ...currentData,
    status: 'in_progress'
  })
  
  // Revalidate the page to show changes
  revalidatePath('/')
}

export async function updateModuleProgressAction(
  moduleId: string, 
  progress: number
): Promise<void> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800))
  
  // Randomly fail sometimes to test optimistic rollback
  if (Math.random() < 0.1) {
    throw new Error(`Failed to update ${moduleId} progress`)
  }
  
  const status = progress === 100 ? 'completed' : 
                 progress > 0 ? 'in_progress' : 'pending'
  
  // Update in "database"
  moduleDatabase.set(moduleId, { progress, status })
  
  console.log(`Updated ${moduleId}: ${progress}% (${status})`)
  
  // Revalidate the page
  revalidatePath('/')
}

export async function logoutAction(): Promise<void> {
  // Simulate logout process
  await new Promise(resolve => setTimeout(resolve, 300))
  
  console.log('User logged out')
  
  // Clear module data
  moduleDatabase.clear()
  
  // Revalidate and redirect would happen here
  revalidatePath('/')
}