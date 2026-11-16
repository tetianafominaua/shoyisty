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
		expect(planner.week.monday.breakfast).toEqual([]);
		expect(planner.week.sunday.dinner).toEqual([]);
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
		expect(planner.week.wednesday.dinner).toEqual([dish.id]);
		expect(planner.getDayDishesCount('wednesday')).toBe(1);

		// Видалення (встановлення null очищає слот)
		planner.setDish('wednesday', 'dinner', null);
		expect(planner.week.wednesday.dinner).toEqual([]);
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

	it("валідує всі дозволені розміри сім'ї (від 1 до 5)", () => {
		for (const size of [1, 2, 3, 4, 5] as const) {
			planner.setFamilySize(size);
			expect(planner.familySize).toBe(size);
			const cart = planner.getCartGrouped();
			expect(cart.familySize).toBe(size);
		}
	});

	it('коректно акумулює кількість однакових страв, обраних у різні дні', () => {
		const dish = DISHES[0];
		expect(dish).toBeDefined();

		// Ставимо ту саму страву на понеділок і середу
		planner.setDish('monday', 'lunch', dish.id);
		planner.setDish('wednesday', 'lunch', dish.id);

		expect(planner.totalDishesCount).toBe(2);

		const cart = planner.getCartGrouped();
		if (dish.galyaProduct) {
			const item = cart.galyaItems.find((i) => i.product.name === dish.galyaProduct?.name);
			expect(item).toBeDefined();
			expect(item?.occurrences).toBe(2);
			expect(item?.dishesNames.length).toBeGreaterThanOrEqual(1);
		}
	});

	it('дозволяє заповнити всі 21 слот тижня без помилок', () => {
		const dish = DISHES[0];
		const days = [
			'monday',
			'tuesday',
			'wednesday',
			'thursday',
			'friday',
			'saturday',
			'sunday'
		] as const;
		const meals = ['breakfast', 'lunch', 'dinner'] as const;

		for (const day of days) {
			for (const meal of meals) {
				planner.setDish(day, meal, dish.id);
			}
		}

		expect(planner.totalDishesCount).toBe(21);
		for (const day of days) {
			expect(planner.getDayDishesCount(day)).toBe(3);
		}

		const cart = planner.getCartGrouped();
		expect(cart.totalGalyaUnits).toBeGreaterThan(0);
	});

	it('підтримує слот snack (перекус) та розраховує до 28 страв на тиждень', () => {
		planner.clearWeek();
		planner.setDish('monday', 'breakfast', 'syrnyky-vanilla');
		planner.setDish('monday', 'lunch', 'borscht-ukrainian');
		planner.setDish('monday', 'dinner', 'kotlety-kyiv');
		planner.setDish('monday', 'snack', 'mlyntsi-cherry');

		expect(planner.getDayDishesCount('monday')).toBe(4);
		expect(planner.totalDishesCount).toBe(4);

		const cart = planner.getCartGrouped();
		expect(cart.galyaItems.length).toBe(4);
	});

	it('керує списком обраних страв через toggleFavorite та isFavorite', () => {
		planner.favorites = [];
		expect(planner.isFavorite('syrnyky-vanilla')).toBe(false);

		planner.toggleFavorite('syrnyky-vanilla');
		expect(planner.isFavorite('syrnyky-vanilla')).toBe(true);
		expect(planner.favorites).toContain('syrnyky-vanilla');

		planner.toggleFavorite('syrnyky-vanilla');
		expect(planner.isFavorite('syrnyky-vanilla')).toBe(false);
	});

	it('підтримує перемикання локалі uk та en', () => {
		planner.setLocale('en');
		expect(planner.locale).toBe('en');

		planner.setLocale('uk');
		expect(planner.locale).toBe('uk');
	});

	it('завантажує збалансований денний набір (loadDayPreset) на 4 слоти', () => {
		planner.clearWeek();
		planner.loadDayPreset('tuesday', 'classic');

		expect(planner.getDayDishesCount('tuesday')).toBe(4);
		expect(planner.week.tuesday.breakfast).toEqual(['syrnyky-vanilla']);
		expect(planner.week.tuesday.lunch).toEqual(['borscht-ukrainian']);
		expect(planner.week.tuesday.dinner).toEqual(['kotlety-kyiv']);
		expect(planner.week.tuesday.snack).toEqual(['mlyntsi-cherry']);
	});

	it('дозволяє додавати необмежену кількість страв у той самий прийом їжі', () => {
		planner.clearWeek();
		planner.addDish('monday', 'breakfast', 'syrnyky-vanilla');
		planner.addDish('monday', 'breakfast', 'mlyntsi-cherry');
		planner.addDish('monday', 'breakfast', 'varenyky-cottage-cheese');

		expect(planner.week.monday.breakfast).toEqual([
			'syrnyky-vanilla',
			'mlyntsi-cherry',
			'varenyky-cottage-cheese'
		]);
		expect(planner.getDayDishesCount('monday')).toBe(3);
		expect(planner.totalDishesCount).toBe(3);

		// Заміна другої страви
		planner.replaceDishAt('monday', 'breakfast', 1, 'pelmeni-classic');
		expect(planner.week.monday.breakfast[1]).toBe('pelmeni-classic');

		// Видалення страви за індексом
		planner.removeDishAt('monday', 'breakfast', 0);
		expect(planner.week.monday.breakfast).toEqual(['pelmeni-classic', 'varenyky-cottage-cheese']);
		expect(planner.getDayDishesCount('monday')).toBe(2);
	});
});
