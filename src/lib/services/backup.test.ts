// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { exportPlannerData, validateAndParseBackup } from './backup.js';
import type { WeekPlan } from '#lib/types';

describe('Backup & Portability Service (backup.ts)', () => {
	const mockWeek: WeekPlan = {
		monday: { breakfast: 'syrnyky-classic', lunch: null, dinner: null },
		tuesday: { breakfast: null, lunch: null, dinner: null },
		wednesday: { breakfast: null, lunch: null, dinner: null },
		thursday: { breakfast: null, lunch: null, dinner: null },
		friday: { breakfast: null, lunch: null, dinner: null },
		saturday: { breakfast: null, lunch: null, dinner: null },
		sunday: { breakfast: null, lunch: null, dinner: null }
	};

	it('успішно експортує дані тижневого плану у валідний JSON', () => {
		const json = exportPlannerData(
			mockWeek,
			3,
			{ Сирники: 2 },
			{ 'syrnyky-classic': true },
			'family-set'
		);
		expect(json).toContain('"version": 1');
		expect(json).toContain('syrnyky-classic');
		expect(json).toContain('"familySize": 3');
	});

	it('валідує та коректно парсить коректний бекап-файл', () => {
		const json = exportPlannerData(mockWeek, 4);
		const parsed = validateAndParseBackup(json);
		expect(parsed).not.toBeNull();
		if (parsed) {
			expect(parsed.familySize).toBe(4);
			expect(parsed.week.monday.breakfast).toBe('syrnyky-classic');
		}
	});

	it('відхиляє некоректний JSON або пошкоджену структуру без падіння', () => {
		expect(validateAndParseBackup('not-a-json')).toBeNull();
		expect(validateAndParseBackup('{}')).toBeNull();
		expect(validateAndParseBackup('{"version": 1}')).toBeNull();
		expect(validateAndParseBackup('{"version": 1, "week": { "monday": null }}')).toBeNull();
	});

	it('безпечно нормалізує некоректний розмір родини до 2 за замовчуванням', () => {
		const invalidFamily = JSON.stringify({
			version: 1,
			week: mockWeek,
			familySize: 99
		});
		const parsed = validateAndParseBackup(invalidFamily);
		expect(parsed).not.toBeNull();
		if (parsed) {
			expect(parsed.familySize).toBe(2);
		}
	});
});
