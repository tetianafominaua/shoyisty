<script lang="ts">
	import '../app.css';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<svelte:head>
	<title>Галя Балувана — Планувальник меню на тиждень</title>
</svelte:head>

{@render children()}
