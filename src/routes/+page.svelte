<script lang="ts">
	import { planner } from '#lib/stores/planner.svelte';
	import Header from '#lib/components/Header.svelte';
	import HomeHero from '#lib/components/HomeHero.svelte';
	import SetsView from '#lib/components/SetsView.svelte';
	import WeekPlanner from '#lib/components/WeekPlanner.svelte';
	import CartView from '#lib/components/CartView.svelte';
	import DishModal from '#lib/components/DishModal.svelte';
	import Toast from '#lib/components/Toast.svelte';
</script>

<svelte:head>
	<title>Галя Балувана — Шпаргалка меню на тиждень</title>
	<meta
		name="description"
		content="Що приготувати сьогодні? Готові тижневі набори страв та зручний планувальник на тиждень із напівфабрикатів ручної ліпки «Галя Балувана» (Одеса & Південне)."
	/>
</svelte:head>

<div class="app-viewport">
	<Header />

	<main class="app-main-content">
		{#if planner.activeTab === 'home'}
			<HomeHero />
		{:else if planner.activeTab === 'sets'}
			<SetsView />
		{:else if planner.activeTab === 'week'}
			<WeekPlanner />
		{:else if planner.activeTab === 'cart'}
			<CartView />
		{/if}
	</main>

	<!-- Brand Footer -->
	<footer class="app-footer">
		<div class="footer-brand">
			<span class="footer-logo">🥟</span>
			<span class="footer-name">Галя Балувана</span>
		</div>
		<p class="footer-copy">
			Домашні напівфабрикати ручної ліпки за склом.<br />
			Одеса (вул. Сегедська, Корольова, Ріхтера) &bull; м. Південне (вул. Шевченка).
		</p>
	</footer>

	<!-- Modals and Overlays -->
	<DishModal />
	<Toast />
</div>

<style>
	.app-main-content {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.app-footer {
		padding: 24px 20px;
		background: var(--bg-surface-alt);
		border-top: 1px solid var(--border-subtle);
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
	}

	.footer-brand {
		display: flex;
		align-items: center;
		gap: 6px;
		font-weight: 800;
		color: var(--color-brand-primary);
		font-size: 14px;
	}

	.footer-logo {
		font-size: 16px;
	}

	.footer-copy {
		font-size: 11px;
		color: var(--text-muted);
		line-height: 1.45;
		margin: 0;
	}
</style>
