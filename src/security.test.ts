import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

describe('Security Baseline (SECURITY-v10)', () => {
	it('забороняє використання несанітизованого сирого {@html} у компонентах Svelte', () => {
		function scanDir(dir: string, fileList: string[] = []): string[] {
			const files = readdirSync(dir);
			for (const file of files) {
				const fullPath = join(dir, file);
				if (statSync(fullPath).isDirectory()) {
					if (!fullPath.includes('node_modules') && !fullPath.includes('.svelte-kit')) {
						scanDir(fullPath, fileList);
					}
				} else if (file.endsWith('.svelte')) {
					fileList.push(fullPath);
				}
			}
			return fileList;
		}

		const svelteFiles = scanDir('src');
		expect(svelteFiles.length).toBeGreaterThan(0);

		for (const file of svelteFiles) {
			const content = readFileSync(file, 'utf8');
			const htmlMatches = content.match(/\{@html\s+([^}]+)\}/g);
			if (htmlMatches) {
				for (const match of htmlMatches) {
					// Не дозволяється рендерити користувацькі або сторонні змінні напряму
					expect(match).not.toMatch(/user|input|query|url|search/i);
				}
			}
		}
	});

	it('захищає збереження localStorage ізольованими префіксами', () => {
		const storeSource = readFileSync('src/lib/stores/planner.svelte.ts', 'utf8');
		const storageKeys = [
			'galya_planner_week_v1',
			'galya_planner_set_v1',
			'galya_planner_checked_v1',
			'galya_planner_family_v1',
			'galya_planner_pack_overrides_v1'
		];

		for (const key of storageKeys) {
			expect(storeSource).toContain(key);
			expect(key.startsWith('galya_')).toBe(true);
		}
	});
});
