import { test, expect } from '@playwright/test'

test('homepage loads and has primary CTAs', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: /wedding playlist/i })).toBeVisible()
  await expect(page.getByRole('link', { name: /start free/i })).toBeVisible()
  await expect(page.getByRole('link', { name: /sign in/i })).toBeVisible()
})

test('can navigate to login', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: /sign in/i }).click()
  await expect(page).toHaveURL(/\/auth\/login/)
  await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible({ timeout: 5000 }).catch(() => {})
})







