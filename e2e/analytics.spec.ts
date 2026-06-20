import { test, expect } from '@playwright/test';

test.describe('Analytics Integration', () => {
  test('analytics does not crash UI on failure', async ({ page }) => {
    // Intercept analytics API and force a failure
    await page.route('**/api/analytics/event', route => route.abort('failed'));

    await page.goto('/courses');
    
    // UI should still work perfectly, no blank screen
    const courseCards = page.locator('.bg-surface.border-border');
    await expect(courseCards.first()).toBeVisible();
    
    // Clicking a course should still navigate despite analytics failure
    await page.getByRole('button', { name: /view details/i }).first().click();
    await expect(page).toHaveURL(/.*\/course\/.*/);
  });
});
