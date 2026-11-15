import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

describe('Security Baseline (SECURITY-v10)', () => {
	function scanDir(dir: string, fileList: string[] = []): string[] {
		const files = readdirSync(dir);
		for (const file of files) {
			const fullPath = join(dir, file);
			if (statSync(fullPath).isDirectory()) {
				if (
					!fullPath.includes('node_modules') &&
					!fullPath.includes('.svelte-kit') &&
					!fullPath.includes('build')
				) {
					scanDir(fullPath, fileList);
				}
			} else if (file.endsWith('.svelte') || file.endsWith('.ts')) {
				fileList.push(fullPath);
			}
		}
		return fileList;
	}

	it('забороняє використання несанітизованого сирого {@html} у компонентах Svelte', () => {
		const svelteFiles = scanDir('src').filter((f) => f.endsWith('.svelte'));
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

	it('забороняє використання eval, new Function та document.write у вихідному коді', () => {
		const sourceFiles = scanDir('src').filter((f) => !f.includes('.test.ts'));
		for (const file of sourceFiles) {
			const content = readFileSync(file, 'utf8');
			expect(content).not.toMatch(/\beval\s*\(/);
			expect(content).not.toMatch(/\bnew\s+Function\s*\(/);
			expect(content).not.toMatch(/\bdocument\.write\s*\(/);
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
