/**
 * Minimal typing metrics for UI package compilation
 */

import { TypingMetrics } from '../../types/persona'

export class TypingMetricsTracker {
  getMetrics(): TypingMetrics {
    return {
      averageTypingSpeed: 60,
      pauseCount: 0,
      backspaceCount: 0,
      hesitationCount: 0,
      totalTime: 1000
    }
  }
  
  reset() {}
  startTracking() {}
  stopTracking() {}
}