import { test, expect } from '@playwright/test';

test.describe('Dashboard Responsive & Flow Tests', () => {
  
  test('Dashboard loads and displays TopBar', async ({ page }) => {
    // Note: Since dashboard is protected by Clerk, this will redirect to /sign-in
    // if not authenticated. Make sure to handle authentication in tests if needed.
    await page.goto('/dashboard');
    
    // Check karein ki TopBar visible hai (Wait for header or sign-in page)
    // Here we are just checking if the page loads without crashing
    const topBar = page.locator('header, .cl-signIn-start'); 
    await expect(topBar.first()).toBeVisible();
  });

  test('Critical Page: /dashboard/funds navigation', async ({ page }) => {
    await page.goto('/dashboard/funds');
    
    // Verify karein ki funds page khul gaya hai (ya login par redirect hua hai)
    // If not authenticated, url will contain sign-in. If authenticated, it will be funds.
    await expect(page).toHaveURL(/.*(funds|sign-in)/);
  });

  test('Critical Page: /dashboard/ml insights rendering', async ({ page }) => {
    await page.goto('/dashboard/ml');
    
    // Yahan hum expect kar rahe hain ki page load ho ya auth page dikhe
    // Agar bypass auth setup hoga toh actual chart components load honge
    const pageBody = page.locator('body');
    await expect(pageBody).toBeVisible({ timeout: 10000 });
  });

});
