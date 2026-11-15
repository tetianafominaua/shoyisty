import { describe, it, expect } from 'vitest';
import { READY_MADE_SETS } from './sets';
import { DAYS_LIST } from './constants';
import { DISHES } from './dishes';

describe('Ready-Made Sets Integrity', () => {
	it('містить рівно 4 кураторські набори', () => {
		expect(READY_MADE_SETS.length).toBe(4);
	});

	it('кожен набір має унікальний id, назву, опис та 7 днів меню', () => {
		const seenIds = new Set<string>();

		for (const set of READY_MADE_SETS) {
			expect(seenIds.has(set.id)).toBe(false);
			seenIds.add(set.id);

			expect(set.title).toBeTruthy();
			expect(set.description).toBeTruthy();
			expect(set.badge).toBeTruthy();

			for (const day of DAYS_LIST) {
				const dayMeals = set.plan[day.key];
				expect(dayMeals).toBeDefined();

				if (dayMeals?.breakfast) {
					expect(DISHES.some((d) => d.id === dayMeals.breakfast)).toBe(true);
				}
				if (dayMeals?.lunch) {
					expect(DISHES.some((d) => d.id === dayMeals.lunch)).toBe(true);
				}
				if (dayMeals?.dinner) {
					expect(DISHES.some((d) => d.id === dayMeals.dinner)).toBe(true);
				}
			}
		}
	});

	it('знаходить набір за ID', () => {
		const first = READY_MADE_SETS[0];
		expect(first).toBeDefined();
		if (first) {
			const found = READY_MADE_SETS.find((s) => s.id === first.id);
			expect(found).toEqual(first);
		}
	});
});
