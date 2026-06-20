import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Checks', () => {
  const pagesToTest = ['/', '/courses', '/login', '/contact'];

  for (const path of pagesToTest) {
    test(`should not have any automatically detectable accessibility issues on ${path}`, async ({ page }) => {
      await page.goto(path);
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .exclude('.turnstile-container') // Third party iframe, skip
        .analyze();

      // We assert that there are no violations
      // In a real project with a mature legacy UI, you might snapshot these or filter them.
      // We'll enforce a strict 0 violation policy for critical issues.
      const criticalViolations = accessibilityScanResults.violations.filter(v => v.impact === 'critical');
      expect(criticalViolations).toEqual([]);
    });
  }
});
