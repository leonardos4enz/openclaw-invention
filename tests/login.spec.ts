import { test, expect } from '@playwright/test';

const BASE_URL = process.env.DEPLOY_URL || 'https://openclaw-invention.vercel.app';

test.describe('Login Flow', () => {
  test('login page loads correctly', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    
    // Check page title/metadata
    await expect(page).toHaveTitle(/Iniciar sesión|Sistema ERP|Compras/i);
    
    // Check key elements are visible
    await expect(page.locator('text=/Iniciar sesión|Login/i')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('seed button initializes database', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    
    // Look for seed/init button
    const seedButton = page.locator('text=/Inicializar base de datos|Seed Database|Initialize/i');
    if (await seedButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await seedButton.click();
      // Wait for success indicator
      await expect(page.locator('text=/Base de datos inicializada|Database initialized|Seed complete/i')).toBeVisible({ timeout: 10000 });
    } else {
      // If no seed button, check that API is accessible
      const response = await page.request.get(`${BASE_URL}/api/seed`);
      // Seed may redirect or return success
      expect(response.status()).toBeLessThan(400);
    }
  });

  test('admin can login with correct credentials', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    
    // Fill login form
    await page.fill('input[type="email"], input[name="email"]', 'admin@empresa.com');
    await page.fill('input[type="password"]', 'admin123');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard|principal/i, { timeout: 15000 });
    
    // Verify dashboard elements
    await expect(page.locator('text=/Dashboard|Principal|Bienvenido/i')).toBeVisible({ timeout: 10000 });
  });

  test('invalid credentials show error', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    
    // Fill with wrong credentials
    await page.fill('input[type="email"], input[name="email"]', 'wrong@email.com');
    await page.fill('input[type="password"]', 'wrongpass');
    
    // Submit
    await page.click('button[type="submit"]');
    
    // Should show error
    await expect(page.locator('text=/Credenciales inválidas|Usuario no encontrado|Error|Invalid/i')).toBeVisible({ timeout: 10000 });
    
    // Should NOT redirect to dashboard
    await expect(page).not.toHaveURL(/\/dashboard/, { timeout: 5000 });
  });

  test('unauthenticated access to dashboard redirects to login', async ({ page }) => {
    // Try to access dashboard directly
    const response = await page.goto(`${BASE_URL}/dashboard`);
    
    // If it doesn't redirect, should see login page or redirect
    await expect(page).toHaveURL(/\/login|auth/i, { timeout: 10000 });
  });
});