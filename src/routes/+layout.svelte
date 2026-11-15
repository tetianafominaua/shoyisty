<script lang="ts">
	import '../app.css';
	import type { Snippet } from 'svelte';
	import ErrorFallback from '#lib/components/ErrorFallback.svelte';

	let { children }: { children: Snippet } = $props();
</script>

<svelte:head>
	<title>Галя Балувана — Планувальник меню на тиждень</title>
</svelte:head>

<svelte:boundary>
	{@render children()}
	{#snippet failed(error, reset)}
		<ErrorFallback {error} {reset} />
	{/snippet}
</svelte:boundary>
