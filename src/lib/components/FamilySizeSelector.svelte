<script lang="ts">
	import { planner } from '#lib/stores/planner.svelte';
	import { FAMILY_SIZE_OPTIONS, getFamilySizeLabel } from '#lib/data/constants';
	import Users from '@lucide/svelte/icons/users';

	let {
		subtitle = 'Розрахуємо потрібну кількість упаковок та інгредієнтів'
	}: { subtitle?: string } = $props();
</script>

<div class="family-selector-card" role="group" aria-label="Кількість членів родини">
	<div class="selector-top-row">
		<div class="selector-label-group">
			<span class="selector-icon">
				<Users size={16} />
			</span>
			<div>
				<div class="selector-title">Кількість членів родини</div>
				{#if subtitle}
					<div class="selector-subtitle">{subtitle}</div>
				{/if}
			</div>
		</div>
		<span class="selector-active-pill">{getFamilySizeLabel(planner.familySize)}</span>
	</div>

	<div class="selector-buttons-grid">
		{#each FAMILY_SIZE_OPTIONS as opt (opt.value)}
			{@const isActive = planner.familySize === opt.value}
			<button
				type="button"
				class="size-pill-btn"
				class:active={isActive}
				aria-pressed={isActive}
				aria-label={opt.fullLabel}
				onclick={() => planner.setFamilySize(opt.value)}
			>
				{opt.shortLabel}
			</button>
		{/each}
	</div>
</div>

<style>
	.family-selector-card {
		background: #ffffff;
		border: 1.5px solid var(--border-subtle);
		border-radius: var(--radius-md);
		padding: 12px 14px;
		display: flex;
		flex-direction: column;
		gap: 10px;
		box-shadow: var(--shadow-sm);
	}

	.selector-top-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
	}

	.selector-label-group {
		display: flex;
		align-items: center;
		gap: 10px;
		min-width: 0;
	}

	.selector-icon {
		width: 32px;
		height: 32px;
		border-radius: 10px;
		background: rgba(24, 67, 47, 0.08);
		color: var(--color-brand-primary);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.selector-title {
		font-size: 13px;
		font-weight: 800;
		color: var(--text-main);
		line-height: 1.25;
	}

	.selector-subtitle {
		font-size: 11px;
		color: var(--text-muted);
		line-height: 1.3;
	}

	.selector-active-pill {
		font-size: 11px;
		font-weight: 800;
		color: var(--color-brand-primary);
		background: #ecfdf5;
		border: 1px solid #a7f3d0;
		padding: 3px 9px;
		border-radius: var(--radius-full);
		white-space: nowrap;
		flex-shrink: 0;
	}

	.selector-buttons-grid {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 6px;
		background: var(--bg-surface-alt);
		padding: 4px;
		border-radius: var(--radius-md);
	}

	.size-pill-btn {
		height: 36px;
		border-radius: 10px;
		border: 1.5px solid transparent;
		background: transparent;
		font-family: inherit;
		font-size: 14px;
		font-weight: 800;
		color: var(--text-muted);
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.size-pill-btn:hover:not(.active) {
		background: rgba(255, 255, 255, 0.7);
		color: var(--text-main);
	}

	.size-pill-btn.active {
		background: var(--color-brand-primary);
		color: #ffffff;
		box-shadow: 0 2px 8px rgba(24, 67, 47, 0.25);
	}
</style>
