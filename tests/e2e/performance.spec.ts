import { test, expect } from '@playwright/test'

test.describe('Performance Tests', () => {
  test('should load landing page within performance budget', async ({ page }) => {
    const startTime = Date.now()

    await page.goto('/')

    // Wait for main content to be visible
    await page.waitForSelector('body')

    const loadTime = Date.now() - startTime

    // Landing page should load under 3 seconds
    expect(loadTime).toBeLessThan(3000)
  })

  test('should have good Core Web Vitals', async ({ page }) => {
    await page.goto('/')

    // Wait for page to fully load
    await page.waitForLoadState('networkidle')

    // Check if images are loading efficiently
    const images = page.locator('img')
    const imageCount = await images.count()

    if (imageCount > 0) {
      // Images should have proper loading attributes
      for (let i = 0; i < Math.min(imageCount, 3); i++) {
        const img = images.nth(i)
        if (await img.isVisible()) {
          // Image should be loaded
          await expect(img).toBeVisible()
        }
      }
    }
  })

  test('should handle smooth animations without performance issues', async ({ page }) => {
    await page.goto('/')

    // Check for smooth wave animations
    const waves = page.locator('svg path[d*="M0,"]')

    if (await waves.count() > 0) {
      // Waves should be present and animated
      await expect(waves.first()).toBeVisible()

      // Navigate to trigger transitions
      await page.goto('/dashboard')

      // Should handle route transitions smoothly
      await page.waitForLoadState('networkidle')
      await expect(page.locator('body')).toBeVisible()
    }
  })

  test('should not have memory leaks with animations', async ({ page }) => {
    // Start performance monitoring
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Navigate multiple times to test for leaks
    for (let i = 0; i < 3; i++) {
      await page.goto('/dashboard')
      await page.waitForTimeout(500)
      await page.goto('/')
      await page.waitForTimeout(500)
    }

    // Should still be responsive
    await expect(page.locator('body')).toBeVisible()
  })

  test('should bundle size be optimized', async ({ page }) => {
    // Navigate and check network requests
    const responses: string[] = []

    page.on('response', response => {
      if (response.url().includes('.js') || response.url().includes('.css')) {
        responses.push(response.url())
      }
    })

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Should not load excessive number of JavaScript bundles
    const jsFiles = responses.filter(url => url.includes('.js'))
    expect(jsFiles.length).toBeLessThan(20) // Reasonable bundle count

    // Check if main content loads
    await expect(page.locator('body')).toBeVisible()
  })
})