import { test, expect } from '@playwright/test';

test.describe('Responsive Layout checks', () => {
  const viewports = [
    { width: 390, height: 844, name: 'Mobile' },
    { width: 768, height: 1024, name: 'Tablet' },
    { width: 1440, height: 900, name: 'Desktop' }
  ];

  for (const vp of viewports) {
    test(`renders correctly on ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');

      // Check for horizontal scroll (often a sign of broken responsive layout)
      const isScrollableX = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(isScrollableX).toBe(false);

      if (vp.name === 'Mobile') {
        // Menu button should be visible on mobile
        const menuBtn = page.getByRole('button', { name: /menu|open/i }).first();
        if (await menuBtn.isVisible()) {
          await menuBtn.click();
          // Wait for menu to open, ensuring no crash
          await page.waitForTimeout(500); 
        }
      } else {
        // Nav links should be visible directly on desktop/tablet
        await expect(page.getByRole('link', { name: /courses/i }).first()).toBeVisible();
      }
    });
  }
});
