// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';

describe('Content Security Policy (SECURITY-v10)', () => {
	it('згенерований артефакт build/index.html містить Content-Security-Policy', () => {
		const indexPath = 'build/index.html';
		if (existsSync(indexPath)) {
			const html = readFileSync(indexPath, 'utf8');
			expect(html).toContain('http-equiv="content-security-policy"');
			expect(html).toContain("default-src 'self'");
			expect(html).toContain("script-src 'self'");
			expect(html).toContain('sha256-');
		} else {
			// Якщо білда ще немає, перевіряємо конфігурацію у vite.config.ts
			const viteConfig = readFileSync('vite.config.ts', 'utf8');
			expect(viteConfig).toContain("mode: 'hash'");
			expect(viteConfig).toContain("'default-src': ['self']");
		}
	});

	it('vite.config.ts забороняє frame-action та небеспечні джерела', () => {
		const viteConfig = readFileSync('vite.config.ts', 'utf8');
		expect(viteConfig).toContain("'form-action': ['none']");
		expect(viteConfig).toContain("'base-uri': ['self']");
	});
});
