<script lang="ts">
	import { planner } from '#lib/stores/planner.svelte';
	import { getFamilySizeLabel } from '#lib/data/constants';
	import { t } from '#lib/i18n/translations';
	import Users from '@lucide/svelte/icons/users';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';

	const locale = $derived(planner.locale);
	const familySize = $derived(planner.familySize);

	function handleBack() {
		if (planner.activeTab === 'sets' && planner.selectedSetId) {
			planner.selectedSetId = null;
		} else {
			planner.activeTab = 'week';
		}
	}
</script>

<header class="app-header">
	<div class="header-inner">
		{#if planner.activeTab === 'sets' && planner.selectedSetId}
			<button class="nav-back-btn" onclick={handleBack} aria-label="Назад до наборів">
				<ArrowLeft size={16} />
				<span>{t('common.back', locale)}</span>
			</button>
		{:else}
			<div class="brand-block">
				<h1 class="brand-title">Галя Балувана</h1>
				<span class="brand-badge">Меню на кожен день</span>
			</div>
		{/if}

		<div class="header-right-slot">
			<button
				class="family-quick-pill"
				onclick={() => (planner.activeTab = 'settings')}
				title="Змінити розмір родини в налаштуваннях"
			>
				<Users size={14} color="var(--color-brand-primary)" />
				<span>{getFamilySizeLabel(familySize)}</span>
			</button>
		</div>
	</div>
</header>

<style>
	.app-header {
		position: sticky;
		top: 0;
		z-index: 40;
		background: rgba(255, 255, 255, 0.94);
		backdrop-filter: blur(14px);
		-webkit-backdrop-filter: blur(14px);
		border-bottom: 1px solid var(--border-subtle);
		padding: 10px 16px;
	}

	.header-inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		max-width: 600px;
		margin: 0 auto;
	}

	.brand-block {
		display: flex;
		align-items: baseline;
		gap: 8px;
	}

	.brand-title {
		font-family: var(--font-display, inherit);
		font-size: 17px;
		font-weight: 800;
		color: var(--color-brand-primary);
		letter-spacing: -0.01em;
		margin: 0;
		line-height: 1.2;
	}

	.brand-badge {
		font-size: 11px;
		color: #94a3b8;
		font-weight: 600;
	}

	.nav-back-btn {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		background: #f1f5f9;
		border: 1px solid var(--border-subtle);
		border-radius: var(--radius-full);
		padding: 6px 12px;
		font-size: 12px;
		font-weight: 700;
		color: var(--color-brand-primary);
		cursor: pointer;
	}

	.family-quick-pill {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		background: #f0fdf4;
		border: 1px solid #bbf7d0;
		color: var(--color-brand-primary);
		padding: 5px 10px;
		border-radius: var(--radius-full);
		font-size: 12px;
		font-weight: 700;
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.family-quick-pill:hover {
		background: #dcfce7;
		transform: translateY(-1px);
	}
</style>
