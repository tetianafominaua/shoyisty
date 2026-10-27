<script lang="ts">
	import { planner } from '#lib/stores/planner.svelte';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import ShoppingCart from '@lucide/svelte/icons/shopping-cart';

	const cart = $derived(planner.getCartGrouped());

	function handleBack() {
		if (planner.activeTab === 'sets' && planner.selectedSetId) {
			planner.selectedSetId = null;
		} else {
			planner.activeTab = 'home';
		}
	}

	const screenTitle = $derived.by(() => {
		if (planner.activeTab === 'sets') {
			return planner.selectedSetId ? 'Деталі набору' : 'Готові набори';
		}
		if (planner.activeTab === 'week') return 'На тиждень';
		if (planner.activeTab === 'cart') return 'Список покупок';
		return '';
	});
</script>

<header class="app-header" class:is-home={planner.activeTab === 'home'}>
	{#if planner.activeTab === 'home'}
		<!-- Minimalist Home Branding -->
		<div class="home-brand-bar">
			<div class="brand-logo-circle">
				<span class="brand-logo-text">ГБ</span>
			</div>
			<div class="brand-info">
				<h1 class="brand-title">Галя Балувана</h1>
			</div>
		</div>
	{:else}
		<!-- Clean Subpage Top Navigation Bar -->
		<div class="subpage-nav-bar animate-fade-in">
			<button class="nav-back-btn" onclick={handleBack} aria-label="Назад">
				<ArrowLeft size={16} />
				<span class="back-text">Назад</span>
			</button>

			<h2 class="subpage-title">{screenTitle}</h2>

			<div class="nav-right-slot">
				{#if planner.activeTab !== 'cart' && planner.totalDishesCount > 0}
					<button
						class="mini-cart-pill"
						onclick={() => (planner.activeTab = 'cart')}
						aria-label="Переглянути кошик"
					>
						<ShoppingCart size={14} />
						<span class="mini-cart-num">{planner.totalDishesCount}</span>
					</button>
				{:else}
					<div class="nav-spacer"></div>
				{/if}
			</div>
		</div>
	{/if}
</header>

<style>
	.app-header {
		position: sticky;
		top: 0;
		z-index: 40;
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(14px);
		-webkit-backdrop-filter: blur(14px);
		border-bottom: 1px solid var(--border-subtle);
		padding: 12px 18px;
	}

	.app-header.is-home {
		padding: 18px 20px 14px 20px;
	}

	/* Home Brand Bar */
	.home-brand-bar {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12px;
	}

	.brand-logo-circle {
		width: 44px;
		height: 44px;
		border-radius: 14px;
		background: linear-gradient(135deg, var(--color-brand-primary) 0%, #296d4f 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 4px 12px rgba(24, 67, 47, 0.22);
		color: #ffffff;
	}

	.brand-logo-text {
		font-weight: 800;
		font-size: 18px;
		letter-spacing: -0.04em;
	}

	.brand-info {
		text-align: left;
	}

	.brand-title {
		font-size: 19px;
		font-weight: 800;
		color: var(--color-brand-primary);
		line-height: 1.15;
		margin: 0;
	}

	/* Subpage Top Bar */
	.subpage-nav-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.nav-back-btn {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		background: var(--bg-surface-alt);
		border: 1px solid var(--border-subtle);
		border-radius: var(--radius-full);
		padding: 7px 14px;
		font-size: 13px;
		font-weight: 700;
		color: var(--color-brand-primary);
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.nav-back-btn:hover {
		background: #eae3d4;
		border-color: #d4ccbd;
	}

	.subpage-title {
		font-size: 16px;
		font-weight: 800;
		color: var(--text-main);
		margin: 0;
		text-align: center;
	}

	.nav-right-slot {
		min-width: 60px;
		display: flex;
		justify-content: flex-end;
	}

	.nav-spacer {
		width: 32px;
	}

	.mini-cart-pill {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		background: #ecfdf5;
		border: 1px solid #a7f3d0;
		color: var(--color-brand-primary);
		padding: 6px 12px;
		border-radius: var(--radius-full);
		font-size: 12px;
		font-weight: 800;
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.mini-cart-pill:hover {
		background: #d1fae5;
		transform: scale(1.03);
	}

	.mini-cart-num {
		background: var(--color-brand-primary);
		color: #ffffff;
		border-radius: 10px;
		padding: 1px 6px;
		font-size: 10px;
	}
</style>
