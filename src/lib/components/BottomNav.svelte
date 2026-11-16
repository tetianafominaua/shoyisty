<script lang="ts">
	import { planner } from '#lib/stores/planner.svelte';
	import { t } from '#lib/i18n/translations';
	import Sparkles from '@lucide/svelte/icons/sparkles';
	import Calendar from '@lucide/svelte/icons/calendar';
	import ShoppingBag from '@lucide/svelte/icons/shopping-bag';
	import Settings from '@lucide/svelte/icons/settings';

	const activeTab = $derived(planner.activeTab);
	const locale = $derived(planner.locale);
	const dishesCount = $derived(planner.totalDishesCount);

	function switchTab(tab: 'inspire' | 'week' | 'shop' | 'settings') {
		planner.activeTab = tab;
		if (typeof window !== 'undefined') {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}
</script>

<nav class="bottom-nav-bar" aria-label="Головна навігація">
	<div class="bottom-nav-inner">
		<!-- Tab 1: Надихнутися -->
		<button
			type="button"
			class="nav-tab-btn"
			class:active={activeTab === 'inspire'}
			onclick={() => switchTab('inspire')}
			aria-label={t('tab.inspire', locale)}
			aria-current={activeTab === 'inspire' ? 'page' : undefined}
		>
			<div class="icon-wrap">
				<Sparkles size={20} strokeWidth={activeTab === 'inspire' ? 2.5 : 1.9} />
			</div>
			<span class="tab-label">{t('tab.inspire', locale)}</span>
		</button>

		<!-- Tab 2: Тиждень -->
		<button
			type="button"
			class="nav-tab-btn"
			class:active={activeTab === 'week'}
			onclick={() => switchTab('week')}
			aria-label={t('tab.week', locale)}
			aria-current={activeTab === 'week' ? 'page' : undefined}
		>
			<div class="icon-wrap">
				<Calendar size={20} strokeWidth={activeTab === 'week' ? 2.5 : 1.9} />
			</div>
			<span class="tab-label">{t('tab.week', locale)}</span>
		</button>

		<!-- Tab 3: Магазин -->
		<button
			type="button"
			class="nav-tab-btn"
			class:active={activeTab === 'shop' || activeTab === 'cart'}
			onclick={() => switchTab('shop')}
			aria-label={t('tab.shop', locale)}
			aria-current={activeTab === 'shop' || activeTab === 'cart' ? 'page' : undefined}
		>
			<div class="icon-wrap">
				<ShoppingBag
					size={20}
					strokeWidth={activeTab === 'shop' || activeTab === 'cart' ? 2.5 : 1.9}
				/>
				{#if dishesCount > 0}
					<span class="badge-count animate-scale-in" aria-label="{dishesCount} страв">
						{dishesCount}
					</span>
				{/if}
			</div>
			<span class="tab-label">{t('tab.shop', locale)}</span>
		</button>

		<!-- Tab 4: Налаштування -->
		<button
			type="button"
			class="nav-tab-btn"
			class:active={activeTab === 'settings'}
			onclick={() => switchTab('settings')}
			aria-label={t('tab.settings', locale)}
			aria-current={activeTab === 'settings' ? 'page' : undefined}
		>
			<div class="icon-wrap">
				<Settings size={20} strokeWidth={activeTab === 'settings' ? 2.5 : 1.9} />
			</div>
			<span class="tab-label">{t('tab.settings', locale)}</span>
		</button>
	</div>
</nav>

<style>
	.bottom-nav-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 50;
		background: rgba(255, 255, 255, 0.94);
		backdrop-filter: blur(18px);
		-webkit-backdrop-filter: blur(18px);
		border-top: 1px solid var(--border-subtle);
		box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.05);
		padding-bottom: env(safe-area-inset-bottom, 0px);
	}

	.bottom-nav-inner {
		display: flex;
		align-items: center;
		justify-content: space-around;
		max-width: 540px;
		margin: 0 auto;
		height: 62px;
		padding: 0 10px;
	}

	.nav-tab-btn {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 3px;
		background: transparent;
		border: none;
		outline: none;
		cursor: pointer;
		padding: 6px 4px;
		color: #64748b;
		transition: all var(--transition-fast);
		border-radius: var(--radius-md);
		user-select: none;
		-webkit-tap-highlight-color: transparent;
	}

	.nav-tab-btn:hover {
		color: var(--color-brand-primary);
	}

	.nav-tab-btn:active {
		transform: scale(0.95);
	}

	.icon-wrap {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		transition: transform var(--transition-fast);
	}

	.tab-label {
		font-size: 11px;
		font-weight: 600;
		letter-spacing: -0.01em;
		transition: color var(--transition-fast);
	}

	/* Active Tab Highlight */
	.nav-tab-btn.active {
		color: var(--color-brand-primary);
	}

	.nav-tab-btn.active .icon-wrap {
		transform: translateY(-1px);
	}

	.nav-tab-btn.active .tab-label {
		font-weight: 800;
	}

	/* Cart Badge */
	.badge-count {
		position: absolute;
		top: -3px;
		right: -8px;
		background: var(--color-brand-primary);
		color: #ffffff;
		font-size: 10px;
		font-weight: 800;
		min-width: 17px;
		height: 17px;
		border-radius: 9px;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 4px;
		border: 1.5px solid #ffffff;
		box-shadow: 0 2px 5px rgba(24, 67, 47, 0.3);
	}
</style>
