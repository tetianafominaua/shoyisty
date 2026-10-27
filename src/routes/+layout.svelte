<script lang="ts">
	import '../app.css';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<title>Галя Балувана — Планувальник меню на тиждень</title>
</svelte:head>

{@render children()}

