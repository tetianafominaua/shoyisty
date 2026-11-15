import process from 'node:process';
import { createHash } from 'node:crypto';
import { readFileSync, existsSync } from 'node:fs';
import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

let base: '' | `/${string}` = '';
if (process.env.BASE_PATH && process.env.BASE_PATH.startsWith('/')) {
	base = process.env.BASE_PATH as `/${string}`;
} else if (process.env.GITHUB_REPOSITORY) {
	const [, repo] = process.env.GITHUB_REPOSITORY.split('/');
	if (repo && !repo.endsWith('.github.io')) {
		base = `/${repo}`;
	}
}

/**
 * Хеші інлайн-скриптів у src/app.html (SECURITY-v10 § 6.3.1).
 */
const appHtmlPath = 'src/app.html';
const inlineScriptHashes: `sha256-${string}`[] = existsSync(appHtmlPath)
	? [
			...readFileSync(appHtmlPath, 'utf-8')
				.replace(/<!--[\s\S]*?-->/g, '')
				.matchAll(/<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/gi)
		].map(
			(match) =>
				`sha256-${createHash('sha256')
					.update((match[1] ?? '').replace(/\r\n/g, '\n'))
					.digest('base64')}` as `sha256-${string}`
		)
	: [];

export default defineConfig({
	plugins: [
		sveltekit({
			compilerOptions: {
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			adapter: adapter({
				pages: 'build',
				assets: 'build',
				fallback: '404.html',
				precompress: false,
				strict: true
			}),
			paths: {
				base
			},
			csp: {
				mode: 'hash',
				directives: {
					'default-src': ['self'],
					'script-src': ['self', ...inlineScriptHashes],
					'style-src': ['self', 'unsafe-inline', 'https://fonts.googleapis.com'],
					'font-src': ['self', 'https://fonts.gstatic.com', 'data:'],
					'img-src': ['self', 'data:', 'blob:', 'https:'],
					'connect-src': ['self'],
					'base-uri': ['self'],
					'form-action': ['none']
				}
			}
		})
	],
	ssr: {
		noExternal: ['@lucide/svelte']
	}
});
