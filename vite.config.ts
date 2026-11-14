import process from 'node:process';
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
			}
		})
	],
	ssr: {
		noExternal: ['@lucide/svelte']
	}
});
