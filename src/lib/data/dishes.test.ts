import { describe, it, expect } from 'vitest';
import { DISHES } from './dishes';

describe('Dishes Data Integrity', () => {
	it('повинен містити понад 15 страв у каталозі', () => {
		expect(DISHES.length).toBeGreaterThanOrEqual(15);
	});

	it('кожна страва повинна мати коректні поля та валідні значення', () => {
		const seenIds = new Set<string>();

		for (const dish of DISHES) {
			expect(dish.id).toBeTruthy();
			expect(seenIds.has(dish.id)).toBe(false);
			seenIds.add(dish.id);

			expect(dish.name).toBeTruthy();
			expect(dish.calories).toBeGreaterThan(0);
			expect(dish.prepTimeMinutes).toBeGreaterThan(0);
			expect(dish.servings).toBeGreaterThan(0);
			expect(dish.availableMeals.length).toBeGreaterThan(0);

			if (dish.isGalyaProduct) {
				expect(dish.galyaProduct).toBeDefined();
				expect(dish.galyaProduct?.name).toBeTruthy();
				expect(dish.galyaProduct?.priceUah).toBeGreaterThan(0);
			}

			expect(Array.isArray(dish.groceryItems)).toBe(true);
			for (const item of dish.groceryItems) {
				expect(item.name).toBeTruthy();
				expect(item.amount).toBeTruthy();
			}
		}
	});

	it('знаходить страви за id', () => {
		const firstDish = DISHES[0];
		expect(firstDish).toBeDefined();
		if (firstDish) {
			const found = DISHES.find((d) => d.id === firstDish.id);
			expect(found).toEqual(firstDish);
		}
	});

	it('фільтрує за сніданками', () => {
		const breakfasts = DISHES.filter(
			(d) => d.category === 'breakfast' || d.availableMeals.includes('breakfast')
		);
		expect(breakfasts.length).toBeGreaterThan(0);
	});
});
