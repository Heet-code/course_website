import { test, expect } from '@playwright/test';

test.describe('Courses Catalog and Details', () => {
  test('renders courses and handles detail navigation', async ({ page }) => {
    await page.goto('/courses');
    
    // Ensure course cards appear
    const courseCards = page.locator('.bg-surface.border-border');
    await expect(courseCards.first()).toBeVisible();

    // Click first course card "View Details"
    await page.getByRole('button', { name: /view details/i }).first().click();

    // Assert we navigated to a course detail page
    await expect(page).toHaveURL(/.*\/course\/.*/);

    // Verify course detail structure
    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.getByText(/curriculum/i).first()).toBeVisible();
    
    // Verify Enroll CTA exists
    const enrollBtn = page.getByRole('button', { name: /enroll/i }).first();
    await expect(enrollBtn).toBeVisible();
  });
});
