<script lang="ts">
	import '../app.css';
	import type { Snippet } from 'svelte';
	import ErrorFallback from '#lib/components/ErrorFallback.svelte';
	import JsonLd from '#lib/components/JsonLd.svelte';

	let { children }: { children: Snippet } = $props();

	const schema = {
		'@context': 'https://schema.org',
		'@type': 'WebApplication',
		name: 'Галя Балувана — Шпаргалка меню на кожен день',
		description:
			'Конструктор щотижневого меню з домашніх напівфабрикатів ручної ліпки «Галя Балувана» (Одеса та Південне).',
		applicationCategory: 'LifestyleApplication',
		operatingSystem: 'All',
		offers: {
			'@type': 'Offer',
			price: '0',
			priceCurrency: 'UAH'
		}
	};
</script>

<svelte:head>
	<title>Галя Балувана — Планувальник меню на тиждень</title>
</svelte:head>

<JsonLd {schema} />

<svelte:boundary>
	{@render children()}
	{#snippet failed(error, reset)}
		<ErrorFallback {error} {reset} />
	{/snippet}
</svelte:boundary>
