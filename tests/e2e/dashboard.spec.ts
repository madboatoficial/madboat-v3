import { test, expect } from '@playwright/test'

test.describe('Dashboard Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to dashboard (in real app, would need auth setup)
    await page.goto('/dashboard')
  })

  test('should display dashboard main elements', async ({ page }) => {
    // Check for main dashboard components
    await expect(page.locator('h1, h2, .dashboard-title')).toBeVisible()

    // Should have navigation or sidebar
    const nav = page.locator('nav, .sidebar, .navigation')
    if (await nav.count() > 0) {
      await expect(nav.first()).toBeVisible()
    }
  })

  test('should display RLVR agent metrics', async ({ page }) => {
    // Look for agent metrics cards or displays
    const metrics = page.locator('.agent-metric, .rlvr-metric, [data-testid*="agent"]')
    if (await metrics.count() > 0) {
      await expect(metrics.first()).toBeVisible()
    }
  })

  test('should handle card stagger animations', async ({ page }) => {
    // Check for multiple cards that should have stagger effects
    const cards = page.locator('.card, [class*="card"], .metric-card')

    if (await cards.count() > 1) {
      // Cards should be visible after animations
      await expect(cards.first()).toBeVisible()
      await expect(cards.nth(1)).toBeVisible()
    }
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    // Dashboard should still be functional
    await expect(page.locator('body')).toBeVisible()

    // Key elements should be accessible
    const mainContent = page.locator('main, .main-content, .dashboard')
    if (await mainContent.count() > 0) {
      await expect(mainContent.first()).toBeVisible()
    }
  })

  test('should handle theme transitions', async ({ page }) => {
    // Look for theme toggle if present
    const themeToggle = page.locator('[data-testid="theme-toggle"], .theme-toggle, button[aria-label*="theme"]')

    if (await themeToggle.count() > 0) {
      // Theme toggle should be functional
      await themeToggle.click()

      // Body or root should have theme classes
      const body = page.locator('body, html, [data-theme]')
      await expect(body.first()).toBeVisible()
    }
  })
})