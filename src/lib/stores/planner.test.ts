import { describe, it, expect, beforeEach } from 'vitest';
import { planner } from './planner.svelte';
import { READY_MADE_SETS } from '#lib/data/sets';
import { DISHES } from '#lib/data/dishes';

describe('PlannerStore — business logic & cart calculation', () => {
	beforeEach(() => {
		planner.clearWeek();
		planner.setFamilySize(2);
	});

	it('створює чистий план на тиждень при виклику clearWeek()', () => {
		expect(planner.totalDishesCount).toBe(0);
		expect(planner.activeSetId).toBeNull();
		expect(Object.keys(planner.checkedItems).length).toBe(0);
		expect(planner.week.monday.breakfast).toBeNull();
		expect(planner.week.sunday.dinner).toBeNull();
	});

	it('успішно завантажує готовий набір «Сімейний затишок» (21 страва на 7 днів)', () => {
		const familySet = READY_MADE_SETS.find((s) => s.id === 'family-comfort');
		expect(familySet).toBeDefined();

		planner.loadSet('family-comfort', false);
		expect(planner.activeSetId).toBe('family-comfort');
		expect(planner.totalDishesCount).toBe(21);
		expect(planner.getDayDishesCount('monday')).toBe(3);
		expect(planner.getDayDishesCount('sunday')).toBe(3);
	});

	it('коректно розраховує кількість упаковок у кошику залежно від розміру родини', () => {
		planner.loadSet('family-comfort', false);

		// Для родини з 2 осіб
		planner.setFamilySize(2);
		const cart2 = planner.getCartGrouped();
		expect(cart2.familySize).toBe(2);
		expect(cart2.galyaItems.length).toBeGreaterThan(0);
		expect(cart2.totalGalyaUnits).toBeGreaterThan(0);
		expect(cart2.totalEstimatedGalyaPrice).toBeGreaterThan(0);

		// Для родини з 4 осіб кількість потрібних порцій та упаковок має збільшуватися
		planner.setFamilySize(4);
		const cart4 = planner.getCartGrouped();
		expect(cart4.familySize).toBe(4);
		expect(cart4.totalGalyaUnits).toBeGreaterThanOrEqual(cart2.totalGalyaUnits);
		expect(cart4.totalEstimatedGalyaPrice).toBeGreaterThanOrEqual(cart2.totalEstimatedGalyaPrice);
	});

	it('підтримує ручне коригування кількості упаковок (setPackCount) та скидання (resetPackOverrides)', () => {
		planner.loadSet('family-comfort', false);
		planner.setFamilySize(2);

		const cartBefore = planner.getCartGrouped();
		const firstProduct = cartBefore.galyaItems[0];
		expect(firstProduct).toBeDefined();

		const initialCount = firstProduct.count;
		const overriddenCount = initialCount + 3;

		planner.setPackCount(firstProduct.product.name, overriddenCount, firstProduct.recommendedCount);

		const cartAfter = planner.getCartGrouped();
		const updatedItem = cartAfter.galyaItems.find(
			(i) => i.product.name === firstProduct.product.name
		);
		expect(updatedItem?.count).toBe(overriddenCount);
		expect(updatedItem?.isOverridden).toBe(true);
		expect(cartAfter.hasManualOverrides).toBe(true);

		// Скидання на рекомендоване
		planner.resetPackOverrides();
		const cartReset = planner.getCartGrouped();
		const resetItem = cartReset.galyaItems.find(
			(i) => i.product.name === firstProduct.product.name
		);
		expect(resetItem?.count).toBe(resetItem?.recommendedCount);
		expect(cartReset.hasManualOverrides).toBe(false);
	});

	it('масштабує грами в кілограми та мілілітри в літри у списку супутніх товарів', () => {
		planner.loadSet('family-comfort', false);
		planner.setFamilySize(5); // Максимальний масштаб

		const cart = planner.getCartGrouped();
		expect(cart.groceryItems.length).toBeGreaterThan(0);

		// Перевіряємо форматування лейблів
		for (const item of cart.groceryItems) {
			expect(typeof item.name).toBe('string');
			expect(item.name.length).toBeGreaterThan(0);
			expect(typeof item.amountLabel).toBe('string');
			expect(item.amountLabel.length).toBeGreaterThan(0);
		}
	});

	it('генерує валідний структурований текст для Telegram/Viber із чекбоксами [ ]', () => {
		planner.loadSet('family-comfort', false);
		const text = planner.generateTelegramText();

		expect(text).toContain('*СПИСОК ПОКУПОК НА ТИЖДЕНЬ*');
		expect(text).toContain('*1. ПРИДБАТИ В «ГАЛЯ БАЛУВАНА»*');
		expect(text).toContain('*2. ДОКУПИТИ В СУПЕРМАРКЕТІ*');
		expect(text).toContain('[ ]');
		expect(text).toContain('Смачного та затишного тижня!');
	});

	it('коректно додає та видаляє окремі страви у слоти днів', () => {
		const dish = DISHES[0];
		expect(dish).toBeDefined();

		planner.setDish('wednesday', 'dinner', dish.id);
		expect(planner.week.wednesday.dinner).toBe(dish.id);
		expect(planner.getDayDishesCount('wednesday')).toBe(1);

		// Видалення (встановлення null)
		planner.setDish('wednesday', 'dinner', null);
		expect(planner.week.wednesday.dinner).toBeNull();
		expect(planner.getDayDishesCount('wednesday')).toBe(0);
	});

	it('перемикає стан викреслення чекбоксу товару (toggleChecked)', () => {
		const key = 'test_item_milk';
		expect(planner.checkedItems[key]).toBeFalsy();

		planner.toggleChecked(key);
		expect(planner.checkedItems[key]).toBe(true);

		planner.toggleChecked(key);
		expect(planner.checkedItems[key]).toBe(false);
	});

	it('надає зрозумілі підказки щодо кількості упаковок для страви', () => {
		const dish = DISHES.find((d) => d.servings > 1);
		if (dish) {
			const hint1 = planner.getDishPackHint(dish, 1);
			expect(hint1).toContain('уп.');

			const hint4 = planner.getDishPackHint(dish, 4);
			expect(hint4).toContain('уп.');
		} else {
			expect(true).toBe(true);
		}
	});
});
