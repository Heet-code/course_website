import { test, expect } from '@playwright/test';

test.describe('Contact Form Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact');
  });

  test('shows validation error on empty submit', async ({ page }) => {
    await page.getByRole('button', { name: /send message/i }).click();
    await expect(page.getByText(/fill in all/i)).toBeVisible();
  });

  test('allows field entry and submits safely', async ({ page }) => {
    // Only test submission if locally running or E2E_ALLOW_CONTACT_SUBMIT is true
    const isProduction = process.env.E2E_BASE_URL && process.env.E2E_BASE_URL.includes('workers.dev');
    const allowSubmit = process.env.E2E_ALLOW_CONTACT_SUBMIT === 'true';

    await page.getByLabel(/name/i).fill('Playwright Tester');
    await page.getByLabel(/email/i).fill('qa@example.com');
    await page.getByLabel(/message/i).fill('Automated QA test message. Please ignore.');

    if (isProduction && !allowSubmit) {
      // Just check the button is there and fields are fillable
      await expect(page.getByRole('button', { name: /send message/i })).toBeVisible();
      return;
    }

    // Attempt submission
    await page.getByRole('button', { name: /send message/i }).click();
    
    // Button disables
    await expect(page.getByRole('button', { name: /sending/i })).toBeDisabled();
    
    // Success message
    await expect(page.getByText(/success/i)).toBeVisible();
  });
});
