import { test, expect } from '@playwright/test';

test.describe('Authentication Flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('Student role login', async ({ page }) => {
    // Click student role
    await page.getByRole('radio', { name: /student/i }).click();
    
    // Check autofill
    await expect(page.getByLabel(/email/i)).toHaveValue('student@thelearningcollective.com');
    
    // Submit
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Assert redirect
    await expect(page).toHaveURL(/.*\/student\/dashboard/);
  });

  test('Instructor role login', async ({ page }) => {
    await page.getByRole('radio', { name: /instructor/i }).click();
    await expect(page.getByLabel(/email/i)).toHaveValue('instructor@thelearningcollective.com');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page).toHaveURL(/.*\/instructor\/dashboard/);
  });

  test('Admin role login', async ({ page }) => {
    await page.getByRole('radio', { name: /admin/i }).click();
    await expect(page.getByLabel(/email/i)).toHaveValue('admin@thelearningcollective.com');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page).toHaveURL(/.*\/admin\/dashboard/);
  });

  test('Shows error on wrong password', async ({ page }) => {
    await page.getByRole('radio', { name: /student/i }).click();
    await page.getByLabel(/password/i).fill('wrongpassword123');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page.getByText(/invalid/i)).toBeVisible();
  });

  test('Logout works', async ({ page }) => {
    // Login
    await page.getByRole('radio', { name: /student/i }).click();
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page).toHaveURL(/.*\/student\/dashboard/);

    // Logout
    await page.getByRole('button', { name: /logout|sign out/i }).click();
    await expect(page).toHaveURL(/.*\/login/);
  });
});
