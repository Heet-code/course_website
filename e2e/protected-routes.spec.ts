import { test, expect } from '@playwright/test';

test.describe('Protected Routes Isolation', () => {
  test('unauthenticated users redirect to login', async ({ page }) => {
    const protectedRoutes = ['/student/dashboard', '/instructor/dashboard', '/admin/dashboard'];
    
    for (const route of protectedRoutes) {
      await page.goto(route);
      await expect(page).toHaveURL(/.*\/login/);
    }
  });

  test('students cannot access admin dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('radio', { name: /student/i }).click();
    await page.getByRole('button', { name: /sign in/i }).click();
    
    await expect(page).toHaveURL(/.*\/student\/dashboard/);
    
    // Attempt unauthorized access
    await page.goto('/admin/dashboard');
    // Should be redirected or shown 403. Let's assume it bounces them back or to a not-found/login.
    // Testing specific app behavior, usually bounces to login or home
    await expect(page).not.toHaveURL(/.*\/admin\/dashboard/);
  });
});
