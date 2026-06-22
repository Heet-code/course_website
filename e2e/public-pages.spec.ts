import { test, expect } from '@playwright/test';

test.describe('Public Pages Routing and Rendering', () => {
  const routes = [
    { path: '/', title: 'Veloria Academy' },
    { path: '/courses', title: 'Courses' },
    { path: '/pricing', title: 'Pricing' },
    { path: '/about', title: 'About' },
    { path: '/contact', title: 'Contact' },
    { path: '/faq', title: 'FAQ' },
    { path: '/login', title: 'Login' },
    { path: '/signup', title: 'Sign Up' }
  ];

  for (const route of routes) {
    test(`loads ${route.path} successfully without errors`, async ({ page }) => {
      const messages: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') messages.push(msg.text());
      });

      await page.goto(route.path);
      
      // Page should load and contain the title
      await expect(page).toHaveTitle(new RegExp(route.title, 'i'));
      
      // Navbar and Footer should exist
      await expect(page.locator('nav').first()).toBeVisible();
      await expect(page.locator('footer').first()).toBeVisible();

      // No unhandled React/React Router crashes (white screen)
      const rootHtml = await page.locator('#root').innerHTML();
      expect(rootHtml.trim()).not.toBe('');
      
      // Ensure no obvious console errors
      // Note: We ignore analytics network failures which might print as errors
      const criticalErrors = messages.filter(m => m.includes('React') || m.includes('Exception'));
      expect(criticalErrors).toHaveLength(0);
    });
  }
});
