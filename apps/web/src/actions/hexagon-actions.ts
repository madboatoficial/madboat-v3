/**
 * 🐙 HEXAGON PROGRESS ACTIONS
 * Database actions for hexagon journey system
 */

import { supabase } from '@madboat/core'

export interface HexagonProgress {
  id: string
  user_id: string
  hexagon_id: number
  status: 'locked' | 'available' | 'active' | 'completed'
  activated_at?: string
  completed_at?: string
  progress_data?: any
  events_triggered?: any[]
  rewards_claimed?: any[]
  created_at: string
  updated_at: string
}

export interface HexagonDefinition {
  id: number
  hexagon_id: number
  group_id: number
  group_name: string
  hexagon_name: string
  description?: string
  position_x: number
  position_y: number
  unlock_requirements?: any
  rewards?: any
  event_configuration?: any
}

export interface AlmaLetterAssignment {
  id: string
  user_id: string
  hexagon_id: number
  letter: string
  label: string
  assigned_at: string
  is_active: boolean
}

/**
 * Initialize hexagon progress for a user
 */
export async function initializeUserHexagonProgress(userId: string) {
  try {
    const { error } = await supabase.rpc('initialize_user_hexagon_progress', {
      user_uuid: userId
    })

    if (error) {
      console.error('Error initializing hexagon progress:', error)
      throw error
    }

    return { success: true }
  } catch (error) {
    console.error('Failed to initialize hexagon progress:', error)
    throw error
  }
}

/**
 * Get user hexagon progress
 */
export async function getUserHexagonProgress(userId: string): Promise<HexagonProgress[]> {
  try {
    const { data, error } = await supabase
      .from('user_hexagon_progress')
      .select('*')
      .eq('user_id', userId)
      .order('hexagon_id', { ascending: true })

    if (error) {
      console.error('Error fetching hexagon progress:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Failed to fetch hexagon progress:', error)
    throw error
  }
}

/**
 * Get hexagon definitions
 */
export async function getHexagonDefinitions(): Promise<HexagonDefinition[]> {
  try {
    const { data, error } = await supabase
      .from('hexagon_definitions')
      .select('*')
      .order('hexagon_id', { ascending: true })

    if (error) {
      console.error('Error fetching hexagon definitions:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Failed to fetch hexagon definitions:', error)
    throw error
  }
}

/**
 * Activate hexagon (triggers events and updates progress)
 */
export async function activateHexagon(userId: string, hexagonId: number) {
  try {
    const { data, error } = await supabase.rpc('activate_hexagon', {
      user_uuid: userId,
      hex_id: hexagonId
    })

    if (error) {
      console.error('Error activating hexagon:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Failed to activate hexagon:', error)
    throw error
  }
}

/**
 * Get ALMA letter assignments for user
 */
export async function getAlmaLetterAssignments(userId: string): Promise<AlmaLetterAssignment[]> {
  try {
    const { data, error } = await supabase
      .from('alma_letter_assignments')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)

    if (error) {
      console.error('Error fetching ALMA letters:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Failed to fetch ALMA letters:', error)
    throw error
  }
}

/**
 * Get connection lines for user
 */
export async function getConnectionLines(userId: string) {
  try {
    const { data, error } = await supabase
      .from('connection_lines')
      .select('*')
      .eq('user_id', userId)
      .eq('is_visible', true)

    if (error) {
      console.error('Error fetching connection lines:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Failed to fetch connection lines:', error)
    throw error
  }
}

/**
 * Update hexagon progress status
 */
export async function updateHexagonStatus(
  userId: string, 
  hexagonId: number, 
  status: 'locked' | 'available' | 'active' | 'completed'
) {
  try {
    const updateData: any = {
      status,
      updated_at: new Date().toISOString()
    }

    if (status === 'active') {
      updateData.activated_at = new Date().toISOString()
    }

    if (status === 'completed') {
      updateData.completed_at = new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('user_hexagon_progress')
      .update(updateData)
      .eq('user_id', userId)
      .eq('hexagon_id', hexagonId)
      .select()

    if (error) {
      console.error('Error updating hexagon status:', error)
      throw error
    }

    return data?.[0]
  } catch (error) {
    console.error('Failed to update hexagon status:', error)
    throw error
  }
}

/**
 * Check if user has completed persona test
 */
export async function checkPersonaCompletion(userId: string): Promise<boolean> {
  try {
    // Check if persona hexagon (id 0) is completed
    const { data, error } = await supabase
      .from('user_hexagon_progress')
      .select('status')
      .eq('user_id', userId)
      .eq('hexagon_id', 0)
      .single()

    if (error) {
      console.error('Error checking persona completion:', error)
      return false
    }

    return data?.status === 'completed'
  } catch (error) {
    console.error('Failed to check persona completion:', error)
    return false
  }
}