import { test, expect } from '@playwright/test';

test.describe('Filmu meklētājs app', () => {

    test.beforeEach(async ({ page }) => {
        // Atver dev serveri (pārliecinies, ka Vite serveris skrien uz 5173)
        await page.goto('http://localhost:5173/filmu-mekletajs/public');
    });

    test('renders title', async ({ page }) => {
        await expect(page.locator('h1')).toHaveText('Filmu meklētājs');
    });

    test('disables search button if query < 3 chars', async ({ page }) => {
        const input = page.locator('input[placeholder="Meklēt filmu..."]');
        await input.fill('Ma');
        const button = page.locator('button.search-btn');
        await expect(button).toBeDisabled();
    });

    test('enables search button if query >= 3 chars', async ({ page }) => {
        const input = page.locator('input[placeholder="Meklēt filmu..."]');
        await input.fill('Matrix');
        const button = page.locator('button.search-btn');
        await expect(button).toBeEnabled();
    });

    test('opens and closes movie modal', async ({ page }) => {
        const input = page.locator('input[placeholder="Meklēt filmu..."]');
        await input.fill('Matrix');
        await page.locator('button.search-btn').click();

        const firstCard = page.locator('.cards .card').first();
        await firstCard.click();

        const modal = page.locator('.modal-overlay');
        await expect(modal).toBeVisible();

        await modal.locator('.modal-close').click();
        await expect(modal).toHaveClass(/modal-overlay/);
    });
});
