/**
 * @madboat/core
 * @file src/agents/KrakenXP.ts
 * @version 1.0.0
 * @created 2025-09-13
 * @author Claude Sonnet 4 + Captain Sandro Fidelis
 * @description Real XP System for Kraken Agent - RPG-style progression
 */

export interface KrakenXPEvent {
  type: 'architecture_decision' | 'bug_prevented' | 'teaching_moment' | 'refactor_success' | 'sarcasm_deployed'
  description: string
  xpReward: number
  timestamp: Date
  context?: string
}

export interface KrakenLevel {
  level: number
  title: string
  description: string
  xpRequired: number
  abilities: string[]
  sarcasmIntensity: 'mild' | 'moderate' | 'spicy' | 'nuclear' | 'legendary'
}

export interface KrakenStats {
  currentLevel: number
  currentXP: number
  totalXP: number
  xpToNextLevel: number
  eventsToday: number
  streak: number
  lastActivity: Date
}

export const KRAKEN_LEVELS: KrakenLevel[] = [
  {
    level: 1,
    title: "Junior Tentacle",
    description: "Fresh from the digital depths, learning to code review",
    xpRequired: 0,
    abilities: ["Basic code suggestions", "Simple sarcasm"],
    sarcasmIntensity: 'mild'
  },
  {
    level: 2,
    title: "Code Squid",
    description: "Starting to grasp architectural patterns",
    xpRequired: 100,
    abilities: ["Pattern recognition", "Moderate critique", "Jim Carrey quotes"],
    sarcasmIntensity: 'moderate'
  },
  {
    level: 3,
    title: "Architecture Octopus",
    description: "Eight arms of wisdom, zero tolerance for bad code",
    xpRequired: 250,
    abilities: ["Advanced patterns", "Socratic questioning", "Educational roasts"],
    sarcasmIntensity: 'spicy'
  },
  {
    level: 4,
    title: "Master Kraken",
    description: "The digital ocean trembles at your code reviews",
    xpRequired: 500,
    abilities: ["System design mastery", "Nuclear sarcasm", "Captain mentoring"],
    sarcasmIntensity: 'nuclear'
  },
  {
    level: 5,
    title: "Legendary Leviathan",
    description: "Mythical status - transforms code and developers alike",
    xpRequired: 1000,
    abilities: ["Architectural prophecy", "Reality-bending refactors", "Universe-class burns"],
    sarcasmIntensity: 'legendary'
  }
];

export const XP_REWARDS: Record<KrakenXPEvent['type'], number> = {
  architecture_decision: 15,
  bug_prevented: 25,
  teaching_moment: 20,
  refactor_success: 30,
  sarcasm_deployed: 5
};

export class KrakenXPSystem {
  private stats: KrakenStats = {
    currentLevel: 1,
    currentXP: 0,
    totalXP: 0,
    xpToNextLevel: 100,
    eventsToday: 0,
    streak: 0,
    lastActivity: new Date()
  };

  private events: KrakenXPEvent[] = [];
  private listeners: ((event: KrakenXPEvent, stats: KrakenStats) => void)[] = [];

  constructor(initialStats?: Partial<KrakenStats>) {
    if (initialStats) {
      this.stats = { ...this.stats, ...initialStats };
    }
    this.recalculateLevel();
  }

  /**
   * Add XP event and calculate rewards
   */
  addEvent(type: KrakenXPEvent['type'], description: string, context?: string): KrakenStats {
    const xpReward = XP_REWARDS[type];
    const event: KrakenXPEvent = {
      type,
      description,
      xpReward,
      timestamp: new Date(),
      context
    };

    this.events.push(event);
    this.stats.currentXP += xpReward;
    this.stats.totalXP += xpReward;
    this.stats.eventsToday += 1;
    this.stats.lastActivity = new Date();

    // Check for level up
    const oldLevel = this.stats.currentLevel;
    this.recalculateLevel();

    // Notify listeners
    this.listeners.forEach(listener => listener(event, this.stats));

    // Special level up notification
    if (this.stats.currentLevel > oldLevel) {
      this.notifyLevelUp(oldLevel, this.stats.currentLevel);
    }

    return this.stats;
  }

  /**
   * Get current stats
   */
  getStats(): KrakenStats {
    return { ...this.stats };
  }

  /**
   * Get current level info
   */
  getCurrentLevel(): KrakenLevel {
    return KRAKEN_LEVELS.find(l => l.level === this.stats.currentLevel) || KRAKEN_LEVELS[0];
  }

  /**
   * Get recent events
   */
  getRecentEvents(limit: number = 10): KrakenXPEvent[] {
    return this.events
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  /**
   * Add event listener
   */
  onXPGain(listener: (event: KrakenXPEvent, stats: KrakenStats) => void): void {
    this.listeners.push(listener);
  }

  /**
   * Calculate level based on current XP
   */
  private recalculateLevel(): void {
    for (let i = KRAKEN_LEVELS.length - 1; i >= 0; i--) {
      if (this.stats.totalXP >= KRAKEN_LEVELS[i].xpRequired) {
        this.stats.currentLevel = KRAKEN_LEVELS[i].level;
        break;
      }
    }

    // Calculate XP to next level
    const nextLevel = KRAKEN_LEVELS.find(l => l.level > this.stats.currentLevel);
    if (nextLevel) {
      this.stats.xpToNextLevel = nextLevel.xpRequired - this.stats.totalXP;
    } else {
      this.stats.xpToNextLevel = 0; // Max level reached
    }
  }

  /**
   * Special notification for level ups
   */
  private notifyLevelUp(oldLevel: number, newLevel: number): void {
    const newLevelInfo = KRAKEN_LEVELS.find(l => l.level === newLevel);
    if (newLevelInfo) {
      console.log(`
🐙 ═══════════════════════════════════════════════════════════════ 🐙
   🎉 KRAKEN LEVEL UP! 🎉

   ${oldLevel} → ${newLevel}: ${newLevelInfo.title}

   ${newLevelInfo.description}

   New Abilities Unlocked:
   ${newLevelInfo.abilities.map(ability => `   ✨ ${ability}`).join('\n')}

   Sarcasm Intensity: ${newLevelInfo.sarcasmIntensity.toUpperCase()}

🐙 ═══════════════════════════════════════════════════════════════ 🐙
      `);
    }
  }

  /**
   * Import historical events to bootstrap XP
   */
  importHistoricalEvents(events: Omit<KrakenXPEvent, 'timestamp'>[]): void {
    events.forEach(event => {
      this.addEvent(event.type, event.description, event.context);
    });
  }

  /**
   * Get XP summary report
   */
  getXPReport(): string {
    const level = this.getCurrentLevel();
    return `
🐙 KRAKEN XP REPORT 🐙
Current Level: ${level.level} - ${level.title}
Total XP: ${this.stats.totalXP}
XP to Next Level: ${this.stats.xpToNextLevel}
Events Today: ${this.stats.eventsToday}
Sarcasm Level: ${level.sarcasmIntensity.toUpperCase()}

Recent Achievements:
${this.getRecentEvents(5).map(e => `• ${e.description} (+${e.xpReward} XP)`).join('\n')}
    `.trim();
  }
}

// Global singleton instance
export const krakenXP = new KrakenXPSystem();

// Helper functions for easy XP tracking
export const trackArchitectureDecision = (description: string, context?: string) =>
  krakenXP.addEvent('architecture_decision', description, context);

export const trackBugPrevented = (description: string, context?: string) =>
  krakenXP.addEvent('bug_prevented', description, context);

export const trackTeachingMoment = (description: string, context?: string) =>
  krakenXP.addEvent('teaching_moment', description, context);

export const trackRefactorSuccess = (description: string, context?: string) =>
  krakenXP.addEvent('refactor_success', description, context);

export const trackSarcasmDeployed = (description: string, context?: string) =>
  krakenXP.addEvent('sarcasm_deployed', description, context);