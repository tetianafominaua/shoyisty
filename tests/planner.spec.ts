import { test, expect } from '@playwright/test';

test.describe('Галя Балувана — Шпаргалка меню на кожен день', () => {
	test('завантажує головну сторінку з двома основними кнопками', async ({ page }) => {
		await page.goto('/');

		// Заголовок сторінки
		await expect(page).toHaveTitle(/Галя Балувана/);

		// Головний екран містить 2 кнопки згідно GEMINI.md
		const setsBtn = page.getByRole('button', { name: /Готові набори/i });
		const weekBtn = page.getByRole('button', { name: /На тиждень/i });

		await expect(setsBtn).toBeVisible();
		await expect(weekBtn).toBeVisible();
	});

	test('переходить у розділ готових наборів та повертається назад', async ({ page }) => {
		await page.goto('/');

		await page.getByRole('button', { name: /Готові набори/i }).click();
		await expect(page.getByRole('heading', { name: /Готові набори/i })).toBeVisible();

		// Натискаємо кнопку «Назад»
		await page.getByRole('button', { name: /Назад/i }).click();

		// Повертаємося на головний екран
		await expect(page.getByRole('button', { name: /Готові набори/i })).toBeVisible();
	});

	test('відкриває шторку з адресами магазинів на карті', async ({ page }) => {
		await page.goto('/');

		const mapsBtn = page.getByRole('button', { name: /Google Карти/i });
		await mapsBtn.click();

		await expect(page.getByRole('heading', { name: /Наші магазини на карті/i })).toBeVisible();
		await expect(page.getByText('вул. Сегедська, 6')).toBeVisible();
		await expect(page.getByText('вул. Ак. Корольова, 53')).toBeVisible();

		// Закриваємо модалку
		await page.getByRole('button', { name: /Закрити/i }).click();
		await expect(page.getByRole('heading', { name: /Наші магазини на карті/i })).not.toBeVisible();
	});
});
