/**
 * ⌨️ TYPING METRICS TRACKER
 * Sistema de análise comportamental através de padrões de digitação
 * Detecta velocidade, pausas, hesitações e correções
 */

import { TypingMetrics } from '@/types/persona'

export class TypingMetricsTracker {
  private startTime: number = 0
  private lastKeyTime: number = 0
  private characterCount: number = 0
  private backspaceCount: number = 0
  private pauseCount: number = 0
  private hesitationCount: number = 0
  private corrections: number[] = []
  private keyTimestamps: number[] = []
  private isTracking: boolean = false
  
  // Thresholds
  private readonly PAUSE_THRESHOLD = 2000 // 2 seconds = pause
  private readonly HESITATION_THRESHOLD = 5000 // 5 seconds = hesitation
  
  start(): void {
    this.reset()
    this.startTime = Date.now()
    this.lastKeyTime = this.startTime
    this.isTracking = true
  }
  
  stop(): TypingMetrics {
    if (!this.isTracking) {
      throw new Error('Tracker is not running')
    }
    
    this.isTracking = false
    const endTime = Date.now()
    const totalTime = endTime - this.startTime
    
    return {
      startTime: this.startTime,
      endTime,
      totalTime,
      characterCount: this.characterCount,
      averageTypingSpeed: this.calculateAverageSpeed(totalTime),
      pauseCount: this.pauseCount,
      backspaceCount: this.backspaceCount,
      hesitationCount: this.hesitationCount,
      corrections: this.corrections
    }
  }
  
  trackKeypress(key: string, currentTextLength: number): void {
    if (!this.isTracking) return
    
    const now = Date.now()
    const timeSinceLastKey = now - this.lastKeyTime
    
    // Detect pauses and hesitations
    if (timeSinceLastKey > this.HESITATION_THRESHOLD) {
      this.hesitationCount++
      this.pauseCount++ // Hesitation also counts as pause
    } else if (timeSinceLastKey > this.PAUSE_THRESHOLD) {
      this.pauseCount++
    }
    
    // Track specific keys
    if (key === 'Backspace') {
      this.backspaceCount++
      this.corrections.push(now - this.startTime)
    } else if (key.length === 1) {
      // Regular character
      this.characterCount++
    }
    
    // Update timestamps
    this.keyTimestamps.push(now)
    this.lastKeyTime = now
  }
  
  trackPaste(pastedLength: number): void {
    if (!this.isTracking) return
    
    // Pasting is tracked differently - usually indicates prepared response
    this.characterCount += pastedLength
    const now = Date.now()
    this.lastKeyTime = now
    
    // Mark as potential copy-paste behavior
    this.corrections.push(-1) // Special marker for paste events
  }
  
  private calculateAverageSpeed(totalTime: number): number {
    if (totalTime === 0 || this.characterCount === 0) return 0
    
    // Calculate characters per minute
    const minutes = totalTime / 60000
    return Math.round(this.characterCount / minutes)
  }
  
  private reset(): void {
    this.startTime = 0
    this.lastKeyTime = 0
    this.characterCount = 0
    this.backspaceCount = 0
    this.pauseCount = 0
    this.hesitationCount = 0
    this.corrections = []
    this.keyTimestamps = []
  }
  
  // Advanced analysis methods
  getBurstTypingSpeed(): number {
    if (this.keyTimestamps.length < 10) return 0
    
    // Find the fastest 10-key sequence
    let maxSpeed = 0
    for (let i = 0; i < this.keyTimestamps.length - 10; i++) {
      const duration = this.keyTimestamps[i + 10] - this.keyTimestamps[i]
      const speed = (10 / duration) * 60000 // Keys per minute
      maxSpeed = Math.max(maxSpeed, speed)
    }
    
    return Math.round(maxSpeed)
  }
  
  getTypingConsistency(): number {
    if (this.keyTimestamps.length < 2) return 100
    
    const intervals: number[] = []
    for (let i = 1; i < this.keyTimestamps.length; i++) {
      intervals.push(this.keyTimestamps[i] - this.keyTimestamps[i - 1])
    }
    
    const mean = intervals.reduce((a, b) => a + b, 0) / intervals.length
    const variance = intervals.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / intervals.length
    const stdDev = Math.sqrt(variance)
    
    // Convert to consistency score (0-100)
    const consistency = Math.max(0, 100 - (stdDev / mean) * 100)
    return Math.round(consistency)
  }
  
  getCorrectionRate(): number {
    if (this.characterCount === 0) return 0
    return (this.backspaceCount / this.characterCount) * 100
  }
  
  getHesitationPattern(): 'none' | 'beginning' | 'middle' | 'end' | 'throughout' {
    if (this.hesitationCount === 0) return 'none'
    
    const totalDuration = Date.now() - this.startTime
    const hesitationTimes = this.corrections.filter(c => c > 0)
    
    if (hesitationTimes.length === 0) return 'none'
    
    const avgHesitationTime = hesitationTimes.reduce((a, b) => a + b, 0) / hesitationTimes.length
    const position = avgHesitationTime / totalDuration
    
    if (position < 0.3) return 'beginning'
    if (position > 0.7) return 'end'
    if (hesitationTimes.length > 3) return 'throughout'
    return 'middle'
  }
}

// React Hook for easy integration
export function useTypingMetrics() {
  const tracker = new TypingMetricsTracker()
  
  const startTracking = () => {
    tracker.start()
  }
  
  const stopTracking = (): TypingMetrics => {
    return tracker.stop()
  }
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    tracker.trackKeypress(e.key, e.currentTarget.value.length)
  }
  
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData('text')
    tracker.trackPaste(pastedText.length)
  }
  
  return {
    startTracking,
    stopTracking,
    handleKeyDown,
    handlePaste,
    tracker
  }
}

// Behavioral interpretation helpers
export function interpretTypingBehavior(metrics: TypingMetrics): string[] {
  const behaviors: string[] = []
  
  // Speed interpretation
  if (metrics.averageTypingSpeed > 150) {
    behaviors.push('digitador experiente e confiante')
  } else if (metrics.averageTypingSpeed > 80) {
    behaviors.push('velocidade de digitação normal')
  } else if (metrics.averageTypingSpeed > 40) {
    behaviors.push('digitação cuidadosa e pensada')
  } else {
    behaviors.push('digitação muito lenta, possivelmente reflexiva')
  }
  
  // Pause interpretation
  if (metrics.pauseCount === 0) {
    behaviors.push('resposta fluida sem pausas')
  } else if (metrics.pauseCount < 3) {
    behaviors.push('algumas pausas para reflexão')
  } else if (metrics.pauseCount < 6) {
    behaviors.push('várias pausas indicando processamento')
  } else {
    behaviors.push('muitas pausas, resposta muito pensada')
  }
  
  // Correction interpretation
  const correctionRate = (metrics.backspaceCount / metrics.characterCount) * 100
  if (correctionRate < 5) {
    behaviors.push('poucas correções, escrita confiante')
  } else if (correctionRate < 15) {
    behaviors.push('correções normais durante digitação')
  } else if (correctionRate < 30) {
    behaviors.push('muitas correções, perfeccionismo ou incerteza')
  } else {
    behaviors.push('correções excessivas, alta autocrítica')
  }
  
  // Hesitation interpretation
  if (metrics.hesitationCount === 0) {
    behaviors.push('sem hesitações significativas')
  } else if (metrics.hesitationCount < 2) {
    behaviors.push('hesitação ocasional')
  } else {
    behaviors.push('múltiplas hesitações, possível insegurança')
  }
  
  return behaviors
}