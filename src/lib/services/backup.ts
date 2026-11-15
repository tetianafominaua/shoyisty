/**
 * Backup and Data Portability Service (LOCAL-FIRST & SCALABILITY)
 * Дозволяє експортувати та імпортувати плани меню, налаштування та чек-лист кошика.
 */
import type { WeekPlan, FamilySize } from '#lib/types';

export interface PlannerBackupData {
	version: number;
	exportedAt: string;
	familySize: FamilySize;
	week: WeekPlan;
	packOverrides?: Record<string, number>;
	checkedItems?: Record<string, boolean>;
	activeSetId?: string | null;
}

export function exportPlannerData(
	week: WeekPlan,
	familySize: FamilySize,
	packOverrides: Record<string, number> = {},
	checkedItems: Record<string, boolean> = {},
	activeSetId: string | null = null
): string {
	const payload: PlannerBackupData = {
		version: 1,
		exportedAt: new Date().toISOString(),
		familySize,
		week,
		packOverrides,
		checkedItems,
		activeSetId
	};
	return JSON.stringify(payload, null, 2);
}

export function validateAndParseBackup(jsonString: string): PlannerBackupData | null {
	try {
		const data = JSON.parse(jsonString) as Partial<PlannerBackupData>;
		if (!data || typeof data !== 'object') return null;
		if (typeof data.version !== 'number' || data.version < 1) return null;
		if (!data.week || typeof data.week !== 'object') return null;

		const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
		for (const day of days) {
			const dayMeals = (data.week as Record<string, unknown>)[day];
			if (!dayMeals || typeof dayMeals !== 'object') return null;
		}

		const familySize = Number(data.familySize);
		const validFamilySize: FamilySize =
			familySize >= 1 && familySize <= 5 ? (familySize as FamilySize) : 2;

		return {
			version: data.version,
			exportedAt: data.exportedAt ?? new Date().toISOString(),
			familySize: validFamilySize,
			week: data.week,
			packOverrides: data.packOverrides ?? {},
			checkedItems: data.checkedItems ?? {},
			activeSetId: data.activeSetId ?? null
		};
	} catch {
		return null;
	}
}
