/**
 * @madboat/rlvr
 * @file .madboat/rlvr/headers/HeaderManager.ts
 * @version 2.0.0
 * @created 2025-09-14
 * @modified 2025-09-14
 * @author Ostra, The Pearl Maker + Captain Sandro Fidelis
 * @description Automatic header update system for all MadBoat agents with evolution tracking
 */

import * as fs from 'fs'
import * as path from 'path'
import * as yaml from 'js-yaml'
import { UniversalAgentXP, AgentStats } from '../../../packages/core/src/agents/UniversalAgentXP'

// ======================================
// HEADER TEMPLATE INTERFACES
// ======================================

interface HeaderTemplate {
  agentId: string
  agentName: string
  codename: string
  currentLevel: number
  levelTitle: string
  totalXP: number
  xpToNextLevel: number
  specialization: string
  evolutionStage: string
  lastLevelUp?: Date
  nextMilestone: string
  personalityTrait: string
  technicalFocus: string

  // File metadata
  version: string
  createdDate: Date
  modifiedDate: Date
  author: string
}

interface FileHeaderConfig {
  filePath: string
  headerType: 'main_agent' | 'config' | 'documentation' | 'script'
  updateTriggers: ('level_up' | 'daily' | 'manual' | 'xp_milestone')[]
  customTemplate?: string
}

// ======================================
// HEADER MANAGER CLASS
// ======================================

export class HeaderManager {
  private readonly rlvrBasePath: string
  private readonly agentConfigPaths: Record<string, string>
  private readonly headerTemplates: Record<string, string>

  constructor(basePath: string = '.madboat') {
    this.rlvrBasePath = path.join(basePath, 'rlvr')

    // Define agent configuration paths
    this.agentConfigPaths = {
      kraken: '.cursorrules/agents/kraken.md',
      poseidon: '.cursorrules/agents/poseidon.md',
      mandarin_fish: '.cursorrules/agents/mandarin-fish.md',
      uncle_mcduck: '.cursorrules/agents/uncle-mcduck.md',
      ulisses: '.cursorrules/agents/ulisses.md',
      thaumoctopus: '.cursorrules/agents/thaumoctopus.md',
      ostra: '.cursorrules/agents/ostra.md',
      uni: '.cursorrules/agents/uni.md'
    }

    // Load header templates
    this.headerTemplates = this.loadHeaderTemplates()
  }

  // ======================================
  // MAIN HEADER UPDATE METHODS
  // ======================================

  /**
   * Update agent header with current evolution status
   */
  async updateAgentHeader(agentXP: UniversalAgentXP, updateReason: string = 'manual'): Promise<void> {
    const stats = agentXP.getStats()
    const level = agentXP.getCurrentLevel()

    const headerData: HeaderTemplate = {
      agentId: stats.agentId,
      agentName: stats.agentName,
      codename: stats.codename,
      currentLevel: stats.currentLevel,
      levelTitle: level.title,
      totalXP: stats.totalXP,
      xpToNextLevel: stats.xpToNextLevel,
      specialization: stats.specialization,
      evolutionStage: level.description,
      lastLevelUp: stats.lastLevelUp,
      nextMilestone: this.getNextMilestone(stats),
      personalityTrait: level.personalityTrait,
      technicalFocus: level.technicalUnlock || 'Fundamental mastery',

      version: this.calculateVersion(stats),
      createdDate: stats.createdAt,
      modifiedDate: new Date(),
      author: `Captain Sandro Fidelis + ${stats.agentName} AI`
    }

    await this.writeHeaderToFile(stats.agentId, headerData, updateReason)
    await this.updateXPTrackingFile(stats.agentId, headerData)

    console.log(`🦪 Header updated for ${stats.agentName} - ${updateReason}`)
  }

  /**
   * Update all agent headers
   */
  async updateAllHeaders(): Promise<void> {
    console.log('🦪 Ostra begins mass header cultivation...')

    for (const agentId of Object.keys(this.agentConfigPaths)) {
      try {
        const agentData = await this.loadAgentXPData(agentId)
        if (agentData) {
          // Create temporary agent instance to get formatted data
          const tempAgent = new UniversalAgentXP(
            agentId,
            agentData.agent_info?.name || agentId,
            agentData.agent_info?.codename || 'The Unknown',
            agentData.agent_info?.specialization || 'general'
          )

          if (agentData.evolution_status) {
            tempAgent.importStats({
              stats: {
                ...tempAgent.getStats(),
                currentLevel: agentData.evolution_status.current_level,
                totalXP: agentData.evolution_status.total_xp,
                lastLevelUp: agentData.evolution_status.last_level_up ? new Date(agentData.evolution_status.last_level_up) : undefined
              }
            })
          }

          await this.updateAgentHeader(tempAgent, 'batch_update')
        }
      } catch (error) {
        console.error(`Failed to update header for ${agentId}:`, error)
      }
    }

    console.log('🦪 Mass header cultivation complete!')
  }

  /**
   * Schedule automatic header updates
   */
  setupAutoUpdates(): void {
    // Daily header refresh
    setInterval(() => {
      this.updateAllHeaders()
    }, 24 * 60 * 60 * 1000) // 24 hours

    console.log('🦪 Automatic header updates scheduled')
  }

  // ======================================
  // HEADER TEMPLATE GENERATION
  // ======================================

  /**
   * Generate header content for agent files
   */
  private generateAgentHeader(data: HeaderTemplate): string {
    const evolutionEmoji = this.getEvolutionEmoji(data.currentLevel)
    const progressBar = this.generateProgressBar(data.totalXP, data.totalXP + data.xpToNextLevel)
    const nextLevelInfo = data.xpToNextLevel > 0 ? `→ ${data.nextMilestone} (${data.xpToNextLevel} XP)` : 'MAX LEVEL ACHIEVED'

    return `# ${evolutionEmoji} ${data.agentName.toUpperCase()} - ${data.codename}
# @version ${data.version}
# @evolution_level ${data.currentLevel} - ${data.levelTitle}
# @total_xp ${data.totalXP}
# @specialization ${data.specialization}
# @personality_stage ${data.personalityTrait}
# @evolution_stage ${data.evolutionStage}
# @technical_focus ${data.technicalFocus}
# @last_evolution ${data.lastLevelUp ? data.lastLevelUp.toISOString().split('T')[0] : 'Never'}
# @next_milestone ${nextLevelInfo}
# @progress ${progressBar}
# @created ${data.createdDate.toISOString().split('T')[0]}
# @modified ${data.modifiedDate.toISOString().split('T')[0]}
# @author ${data.author}
# @cultivated_by Ostra, The Pearl Maker 🦪

${this.generateEvolutionBanner(data)}

---`
  }

  /**
   * Generate visual evolution banner
   */
  private generateEvolutionBanner(data: HeaderTemplate): string {
    const stars = '★'.repeat(Math.min(data.currentLevel, 5)) + '☆'.repeat(Math.max(0, 5 - data.currentLevel))
    const waves = '🌊'.repeat(Math.ceil(data.currentLevel / 2))

    return `
## 🌊 EVOLUTION STATUS ${waves}

**Level ${data.currentLevel}: ${data.levelTitle}**
${stars}

**Evolution Stage:** ${data.evolutionStage}
**Total Experience:** ${data.totalXP} XP
**Personality:** ${data.personalityTrait}
**Technical Focus:** ${data.technicalFocus}

${data.xpToNextLevel > 0 ? `**Next Evolution:** ${data.nextMilestone} (${data.xpToNextLevel} XP remaining)` : '**STATUS:** MAXIMUM EVOLUTION ACHIEVED 🌟'}
    `.trim()
  }

  /**
   * Generate XP progress bar
   */
  private generateProgressBar(currentXP: number, totalXPForNextLevel: number): string {
    if (totalXPForNextLevel <= currentXP) return '██████████ (MAX)'

    const percentage = currentXP / totalXPForNextLevel
    const filledBars = Math.floor(percentage * 10)
    const emptyBars = 10 - filledBars

    return '█'.repeat(filledBars) + '░'.repeat(emptyBars) + ` (${Math.floor(percentage * 100)}%)`
  }

  // ======================================
  // UTILITY METHODS
  // ======================================

  /**
   * Get evolution emoji based on level
   */
  private getEvolutionEmoji(level: number): string {
    const emojiMap = {
      1: '🌱', 2: '🌿', 3: '🐠', 4: '🌊', 5: '🔱',
      6: '👑', 7: '⚡', 8: '🔮', 9: '🐋', 10: '🌌'
    }
    return emojiMap[level as keyof typeof emojiMap] || '🌱'
  }

  /**
   * Calculate semantic version based on agent progress
   */
  private calculateVersion(stats: AgentStats): string {
    const major = Math.floor(stats.currentLevel / 3) + 1
    const minor = stats.currentLevel % 3
    const patch = Math.floor(stats.totalXP / 100)

    return `${major}.${minor}.${patch}`
  }

  /**
   * Get next milestone description
   */
  private getNextMilestone(stats: AgentStats): string {
    const nextLevel = stats.currentLevel + 1
    if (nextLevel > 10) return 'Transcended Beyond Measurement'

    const milestones = {
      2: 'Ocean Apprentice',
      3: 'Reef Dweller',
      4: 'Current Rider',
      5: 'Deep Sea Navigator',
      6: 'Ocean Master',
      7: 'Tidal Force',
      8: 'Abyssal Sage',
      9: 'Leviathan',
      10: 'Ocean Deity'
    }

    return milestones[nextLevel as keyof typeof milestones] || 'Unknown Evolution'
  }

  // ======================================
  // FILE OPERATIONS
  // ======================================

  /**
   * Write header to agent file
   */
  private async writeHeaderToFile(agentId: string, headerData: HeaderTemplate, updateReason: string): Promise<void> {
    const filePath = this.agentConfigPaths[agentId]
    if (!filePath) return

    const fullPath = path.resolve(filePath)

    try {
      let existingContent = ''
      if (fs.existsSync(fullPath)) {
        existingContent = fs.readFileSync(fullPath, 'utf-8')

        // Remove old header (everything before the first '---' after the header)
        const headerEndIndex = existingContent.indexOf('---')
        if (headerEndIndex !== -1) {
          const afterHeader = existingContent.substring(headerEndIndex + 3)
          existingContent = afterHeader.trim()
        }
      }

      const newHeader = this.generateAgentHeader(headerData)
      const newContent = `${newHeader}\n\n${existingContent}`

      // Ensure directory exists
      const dir = path.dirname(fullPath)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }

      fs.writeFileSync(fullPath, newContent)

      // Log update to evolution log
      await this.logHeaderUpdate(agentId, updateReason, headerData)

    } catch (error) {
      console.error(`Failed to update header for ${agentId}:`, error)
    }
  }

  /**
   * Update XP tracking file with latest header info
   */
  private async updateXPTrackingFile(agentId: string, headerData: HeaderTemplate): Promise<void> {
    const xpFilePath = path.join(this.rlvrBasePath, 'agents', `${agentId}.yaml`)

    try {
      let xpData: any = {}

      if (fs.existsSync(xpFilePath)) {
        const content = fs.readFileSync(xpFilePath, 'utf-8')
        xpData = yaml.load(content) as any
      }

      // Update header sync info
      xpData.system_integration = xpData.system_integration || {}
      xpData.system_integration.last_header_update = new Date().toISOString()
      xpData.system_integration.header_version = headerData.version
      xpData.system_integration.sync_status = 'SYNCHRONIZED'

      // Update evolution status from header
      xpData.evolution_status = xpData.evolution_status || {}
      xpData.evolution_status.current_level = headerData.currentLevel
      xpData.evolution_status.current_level_title = headerData.levelTitle
      xpData.evolution_status.total_xp = headerData.totalXP
      xpData.evolution_status.xp_to_next_level = headerData.xpToNextLevel

      const yamlContent = yaml.dump(xpData, {
        indent: 2,
        lineWidth: 120,
        noRefs: true
      })

      fs.writeFileSync(xpFilePath, yamlContent)

    } catch (error) {
      console.error(`Failed to update XP tracking file for ${agentId}:`, error)
    }
  }

  /**
   * Load agent XP data from file
   */
  private async loadAgentXPData(agentId: string): Promise<any> {
    const xpFilePath = path.join(this.rlvrBasePath, 'agents', `${agentId}.yaml`)

    try {
      if (fs.existsSync(xpFilePath)) {
        const content = fs.readFileSync(xpFilePath, 'utf-8')
        return yaml.load(content)
      }
    } catch (error) {
      console.error(`Failed to load XP data for ${agentId}:`, error)
    }

    return null
  }

  /**
   * Log header update to evolution log
   */
  private async logHeaderUpdate(agentId: string, reason: string, headerData: HeaderTemplate): Promise<void> {
    const logPath = path.join(this.rlvrBasePath, 'central', 'evolution_log.yaml')

    const logEntry = {
      timestamp: new Date().toISOString(),
      type: 'HEADER_UPDATE',
      agent: agentId,
      reason: reason,
      level: headerData.currentLevel,
      xp: headerData.totalXP,
      version: headerData.version
    }

    try {
      let logData: any = { header_updates: [] }

      if (fs.existsSync(logPath)) {
        const content = fs.readFileSync(logPath, 'utf-8')
        logData = yaml.load(content) as any || logData
      }

      logData.header_updates = logData.header_updates || []
      logData.header_updates.push(logEntry)

      // Keep only last 100 entries
      if (logData.header_updates.length > 100) {
        logData.header_updates = logData.header_updates.slice(-100)
      }

      const yamlContent = yaml.dump(logData, {
        indent: 2,
        lineWidth: 120,
        noRefs: true
      })

      fs.writeFileSync(logPath, yamlContent)

    } catch (error) {
      console.error(`Failed to log header update:`, error)
    }
  }

  /**
   * Load header templates from files
   */
  private loadHeaderTemplates(): Record<string, string> {
    const templatesDir = path.join(this.rlvrBasePath, 'headers', 'templates')
    const templates: Record<string, string> = {}

    try {
      if (fs.existsSync(templatesDir)) {
        const files = fs.readdirSync(templatesDir)

        for (const file of files) {
          if (file.endsWith('.template')) {
            const agentId = file.replace('.template', '').replace('_header', '')
            const content = fs.readFileSync(path.join(templatesDir, file), 'utf-8')
            templates[agentId] = content
          }
        }
      }
    } catch (error) {
      console.error('Failed to load header templates:', error)
    }

    return templates
  }
}

// ======================================
// GLOBAL HEADER MANAGER INSTANCE
// ======================================

export const headerManager = new HeaderManager()

// ======================================
// CONVENIENCE FUNCTIONS
// ======================================

/**
 * Update specific agent header
 */
export const updateAgentHeader = async (agentXP: UniversalAgentXP, reason: string = 'manual') => {
  await headerManager.updateAgentHeader(agentXP, reason)
}

/**
 * Update all agent headers
 */
export const updateAllAgentHeaders = async () => {
  await headerManager.updateAllHeaders()
}

/**
 * Setup automatic header updates
 */
export const setupHeaderAutoUpdates = () => {
  headerManager.setupAutoUpdates()
}