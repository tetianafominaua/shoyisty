<script lang="ts">
	import { planner } from '#lib/stores/planner.svelte';
	import Header from '#lib/components/Header.svelte';
	import BottomNav from '#lib/components/BottomNav.svelte';
	import InspireView from '#lib/components/InspireView.svelte';
	import WeekPlanner from '#lib/components/WeekPlanner.svelte';
	import CartView from '#lib/components/CartView.svelte';
	import SettingsView from '#lib/components/SettingsView.svelte';
	import SetsView from '#lib/components/SetsView.svelte';
	import DishModal from '#lib/components/DishModal.svelte';
	import LocationsModal from '#lib/components/LocationsModal.svelte';
	import Toast from '#lib/components/Toast.svelte';
</script>

<svelte:head>
	<title>Галя Балувана — Шпаргалка меню на кожен день</title>
	<meta
		name="description"
		content="Надихайтеся стравами, плануйте меню на тиждень по днях та отримуйте розумний список покупок з напівфабрикатів «Галя Балувана»."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://tetianafominaua.github.io/shoyisty/" />
	<meta property="og:title" content="Галя Балувана — Шпаргалка меню на кожен день" />
	<meta
		property="og:description"
		content="Надихайтеся стравами, плануйте меню на тиждень по днях та отримуйте розумний список покупок з напівфабрикатів «Галя Балувана»."
	/>
	<meta property="og:locale" content="uk_UA" />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content="Галя Балувана — Шпаргалка меню на кожен день" />
	<meta
		name="twitter:description"
		content="Надихайтеся стравами, плануйте меню на тиждень по днях та отримуйте розумний список покупок з напівфабрикатів «Галя Балувана»."
	/>
</svelte:head>

<div class="app-viewport">
	<Header />

	<main class="app-main-content">
		{#if planner.activeTab === 'inspire'}
			<InspireView />
		{:else if planner.activeTab === 'week'}
			<WeekPlanner />
		{:else if planner.activeTab === 'shop' || planner.activeTab === 'cart'}
			<CartView />
		{:else if planner.activeTab === 'settings'}
			<SettingsView />
		{:else if planner.activeTab === 'sets'}
			<SetsView />
		{:else}
			<InspireView />
		{/if}
	</main>

	<!-- Mobile-First Bottom Navigation Bar -->
	<BottomNav />

	<!-- Modals and Overlays -->
	<DishModal />
	<LocationsModal />
	<Toast />
</div>

<style>
	.app-viewport {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		background: var(--bg-app);
	}

	.app-main-content {
		flex: 1;
		display: flex;
		flex-direction: column;
	}
</style>
