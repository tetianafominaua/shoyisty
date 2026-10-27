<script lang="ts">
	import { planner } from '#lib/stores/planner.svelte';
	import Header from '#lib/components/Header.svelte';
	import HomeHero from '#lib/components/HomeHero.svelte';
	import SetsView from '#lib/components/SetsView.svelte';
	import WeekPlanner from '#lib/components/WeekPlanner.svelte';
	import CartView from '#lib/components/CartView.svelte';
	import DishModal from '#lib/components/DishModal.svelte';
	import LocationsModal from '#lib/components/LocationsModal.svelte';
	import Toast from '#lib/components/Toast.svelte';
	import MapPin from '@lucide/svelte/icons/map-pin';
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

	<!-- Minimalist Action Footer -->
	<footer class="app-footer">
		<div class="footer-actions-row">
			<a
				href="https://www.instagram.com/galyabaluvana_odesa/"
				target="_blank"
				rel="noopener noreferrer"
				class="footer-pill-btn instagram-btn"
				title="Instagram @galyabaluvana_odesa"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="17"
					height="17"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
					<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
					<line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
				</svg>
				<span>Instagram</span>
			</a>

			<button
				class="footer-pill-btn maps-btn"
				onclick={() => (planner.isLocationsOpen = true)}
				title="Наші 4 адреси на карті"
			>
				<MapPin size={17} />
				<span>Google Карти</span>
			</button>
		</div>
	</footer>

	<!-- Modals and Overlays -->
	<DishModal />
	<LocationsModal />
	<Toast />
</div>

<style>
	.app-main-content {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.app-footer {
		padding: 18px 20px 24px 20px;
		background: #ffffff;
		border-top: 1px solid var(--border-subtle);
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.footer-actions-row {
		display: flex;
		gap: 12px;
		width: 100%;
		max-width: 380px;
		justify-content: center;
	}

	.footer-pill-btn {
		flex: 1;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		padding: 10px 16px;
		border-radius: var(--radius-full);
		font-size: 13px;
		font-weight: 700;
		text-decoration: none;
		border: 1.5px solid var(--border-subtle);
		background: var(--bg-surface-alt);
		color: var(--text-main);
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.footer-pill-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
	}

	.footer-pill-btn:active {
		transform: translateY(0);
	}

	.instagram-btn:hover {
		border-color: #e1306c;
		color: #e1306c;
		background: #fdf2f8;
	}

	.maps-btn:hover {
		border-color: var(--color-brand-primary);
		color: var(--color-brand-primary);
		background: #f0fdf4;
	}
</style>
