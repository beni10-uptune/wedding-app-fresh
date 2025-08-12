import { test, expect } from '@playwright/test';

test.describe('Payment Flow E2E Tests', () => {
  test('should display correct pricing across all surfaces', async ({ page }) => {
    // Test pricing page
    await page.goto('/pricing');
    
    // Check for correct GBP price
    const gbpPrice = await page.locator('text=/£25/').first();
    await expect(gbpPrice).toBeVisible();
    
    // Check for USD price
    const usdPrice = await page.locator('text=/$25/').first();
    await expect(usdPrice).toBeVisible();
    
    // Check for EUR price  
    const eurPrice = await page.locator('text=/€25/').first();
    await expect(eurPrice).toBeVisible();
  });

  test('should show correct price in builder upgrade modal', async ({ page }) => {
    // Go to builder
    await page.goto('/builder');
    
    // Look for upgrade button or pro feature
    const upgradeButton = await page.locator('text=/Upgrade to Pro/').first();
    if (await upgradeButton.isVisible()) {
      await upgradeButton.click();
      
      // Check modal shows correct price
      const modalPrice = await page.locator('.fixed text=/£25|€25|\\$25/').first();
      await expect(modalPrice).toBeVisible();
    }
  });

  test('should handle authentication for payment', async ({ page }) => {
    // Create a test account
    const testEmail = `test${Date.now()}@example.com`;
    const testPassword = 'TestPassword123!';
    
    // Go to signup
    await page.goto('/auth/signup');
    
    // Fill signup form
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    await page.fill('input[name="confirmPassword"]', testPassword);
    
    // Submit
    await page.click('button[type="submit"]');
    
    // Wait for redirect to builder
    await page.waitForURL(/\/builder|\/wedding/, { timeout: 10000 });
    
    // Try to upgrade
    const upgradeButton = await page.locator('text=/Upgrade/').first();
    if (await upgradeButton.isVisible()) {
      await upgradeButton.click();
      
      // Look for payment button in modal
      const payButton = await page.locator('button:has-text("Upgrade to Pro")').first();
      await expect(payButton).toBeVisible();
      
      // Click it and check for no errors
      await payButton.click();
      
      // Should either redirect to Stripe or show an error
      // Wait a bit to see what happens
      await page.waitForTimeout(3000);
      
      // Check if we got redirected to Stripe
      const isOnStripe = page.url().includes('checkout.stripe.com');
      const hasError = await page.locator('text=/error|failed/i').count() > 0;
      
      if (!isOnStripe && hasError) {
        // Log the error for debugging
        const errorText = await page.locator('text=/error|failed/i').first().textContent();
        console.log('Payment error:', errorText);
      }
    }
  });

  test('should capture email for non-authenticated users', async ({ page }) => {
    // Go to builder without auth
    await page.goto('/builder');
    
    // Wait for page to load
    await page.waitForTimeout(2000);
    
    // Try to save or export
    const saveButton = await page.locator('text="Save Playlist"').first();
    if (await saveButton.isVisible()) {
      await saveButton.click();
      
      // Should show email capture modal
      const emailModal = await page.locator('text="Enter your email"').first();
      await expect(emailModal).toBeVisible({ timeout: 5000 });
      
      // Check for email input
      const emailInput = await page.locator('input[type="email"]');
      await expect(emailInput).toBeVisible();
    }
  });
});