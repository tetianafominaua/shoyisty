<script lang="ts">
	import { planner } from '#lib/stores/planner.svelte';
	import type { ShoppingCartGrouped } from '#lib/types';
	import { getFamilySizeLabel } from '#lib/data/constants';
	import ChefHat from '@lucide/svelte/icons/chef-hat';
	import Check from '@lucide/svelte/icons/check';
	import Info from '@lucide/svelte/icons/info';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import Minus from '@lucide/svelte/icons/minus';
	import Plus from '@lucide/svelte/icons/plus';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';

	let { cart }: { cart: ShoppingCartGrouped } = $props();
</script>

<section class="cart-section galya-section">
	<div class="section-header">
		<div class="section-title-box">
			<span class="section-icon">
				<ChefHat size={20} color="var(--color-brand-primary)" />
			</span>
			<div>
				<h3 class="section-title">1. Придбати в «Галя Балувана»</h3>
				<span class="section-sub">
					{cart.galyaItems.length} поз. &bull; {cart.totalGalyaUnits}
					уп. (~{cart.totalEstimatedGalyaPrice} ₴)
				</span>
			</div>
		</div>
		{#if cart.hasManualOverrides}
			<button
				type="button"
				class="reset-overrides-btn"
				onclick={() => planner.resetPackOverrides()}
				title="Повернути рекомендовану кількість упаковок"
			>
				<RotateCcw size={12} />
				<span>Скинути</span>
			</button>
		{:else}
			<span class="shop-badge">Наш магазин</span>
		{/if}
	</div>

	<div class="items-list">
		{#each cart.galyaItems as item (item.product.name)}
			{@const itemKey = `galya_${item.product.name}`}
			{@const isChecked = !!planner.checkedItems[itemKey]}

			<div class="cart-item-row" class:checked={isChecked}>
				<button
					class="checkbox-btn"
					onclick={() => planner.toggleChecked(itemKey)}
					aria-label="Позначити купленим {item.product.name}"
				>
					<span class="check-box" class:active={isChecked}>
						{#if isChecked}
							<Check size={13} strokeWidth={3} />
						{/if}
					</span>
				</button>

				<div class="item-main-content">
					<div class="item-title-row">
						<span class="item-name">{item.product.name}</span>
						<span class="item-total-price">~{item.totalPrice} ₴</span>
					</div>

					<div class="item-meta-row">
						<span class="item-badge">{item.product.badge}</span>
						<span class="item-pack-info">
							{item.product.weightText} &bull; {item.servingsPerPack}
							порц./уп.
						</span>
					</div>

					<div class="item-portion-calc">
						<span>
							{item.occurrences}
							{item.occurrences === 1 ? 'прийом' : item.occurrences <= 4 ? 'прийоми' : 'прийомів'} &times;
							{getFamilySizeLabel(cart.familySize)} =
							<strong>{item.totalServingsNeeded} порц.</strong>
						</span>
					</div>

					<div class="item-stepper-row">
						<div
							class="pack-stepper"
							role="group"
							aria-label="Кількість упаковок {item.product.name}"
						>
							<button
								type="button"
								class="stepper-btn"
								disabled={item.count <= 1}
								onclick={() =>
									planner.setPackCount(item.product.name, item.count - 1, item.recommendedCount)}
								aria-label="Зменшити кількість упаковок"
							>
								<Minus size={13} />
							</button>
							<span class="stepper-val">{item.count} уп.</span>
							<button
								type="button"
								class="stepper-btn"
								onclick={() =>
									planner.setPackCount(item.product.name, item.count + 1, item.recommendedCount)}
								aria-label="Збільшити кількість упаковок"
							>
								<Plus size={13} />
							</button>
						</div>

						{#if item.isOverridden}
							<button
								type="button"
								class="rec-restore-pill"
								onclick={() =>
									planner.setPackCount(
										item.product.name,
										item.recommendedCount,
										item.recommendedCount
									)}
								title="Повернути рекомендовану кількість"
							>
								<span>Рек.: {item.recommendedCount} уп.</span>
								<RotateCcw size={11} />
							</button>
						{:else}
							<span class="rec-match-badge">Рекомендовано</span>
						{/if}
					</div>

					<div class="item-dishes-note">
						Для страв: {item.dishesNames.join(', ')}
					</div>

					<div class="item-cook-hint">
						<Info size={12} />
						<em>{item.product.cookingMethod}</em>
					</div>
				</div>
			</div>
		{/each}
	</div>

	<!-- Stores Info Footer -->
	<div class="stores-footer">
		<button class="stores-map-btn" onclick={() => (planner.isLocationsOpen = true)}>
			<MapPin size={16} />
			<span class="btn-text">Наші 4 магазини на Google Картах</span>
			<ArrowRight size={15} />
		</button>
	</div>
</section>

<style>
	.cart-section {
		background: #ffffff;
		border-radius: var(--radius-lg);
		border: 1.5px solid var(--border-subtle);
		overflow: hidden;
		box-shadow: var(--shadow-sm);
	}

	.section-header {
		padding: 16px 20px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid var(--border-subtle);
	}

	.section-title-box {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.section-icon {
		width: 38px;
		height: 38px;
		border-radius: var(--radius-md);
		background: rgba(24, 67, 47, 0.08);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.section-title {
		font-size: 15px;
		font-weight: 800;
		color: var(--text-main);
		margin: 0;
		line-height: 1.25;
	}

	.section-sub {
		font-size: 12px;
		color: var(--text-muted);
		display: block;
		margin-top: 2px;
	}

	.shop-badge {
		font-size: 11px;
		font-weight: 800;
		padding: 4px 10px;
		border-radius: var(--radius-full);
		background: #ecfdf5;
		color: var(--color-brand-primary);
		border: 1px solid #a7f3d0;
	}

	.reset-overrides-btn {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		font-size: 11px;
		font-weight: 800;
		color: #b45309;
		background: #fef3c7;
		border: 1px solid #fde68a;
		padding: 4px 10px;
		border-radius: var(--radius-full);
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.reset-overrides-btn:hover {
		background: #fde68a;
	}

	.items-list {
		display: flex;
		flex-direction: column;
	}

	.cart-item-row {
		display: flex;
		gap: 14px;
		padding: 14px 18px;
		border-bottom: 1px solid var(--border-subtle);
		transition: background var(--transition-fast);
	}

	.cart-item-row:last-child {
		border-bottom: none;
	}

	.cart-item-row.checked {
		background: #fcfbf8;
		opacity: 0.65;
	}

	.cart-item-row.checked .item-name {
		text-decoration: line-through;
		color: var(--text-muted);
	}

	.checkbox-btn {
		background: transparent;
		border: none;
		padding: 0;
		margin-top: 2px;
		cursor: pointer;
		display: flex;
		align-items: flex-start;
	}

	.check-box {
		width: 22px;
		height: 22px;
		border-radius: 6px;
		border: 2px solid #cbd5e1;
		background: #ffffff;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #ffffff;
		transition: all var(--transition-fast);
	}

	.check-box.active {
		background: var(--color-brand-primary);
		border-color: var(--color-brand-primary);
	}

	.item-main-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.item-title-row {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 8px;
	}

	.item-name {
		font-size: 15px;
		font-weight: 800;
		color: var(--text-main);
	}

	.item-total-price {
		font-size: 15px;
		font-weight: 800;
		color: var(--color-brand-primary);
		white-space: nowrap;
	}

	.item-meta-row {
		display: flex;
		align-items: center;
		gap: 8px;
		flex-wrap: wrap;
	}

	.item-badge {
		font-size: 11px;
		font-weight: 700;
		color: var(--color-brand-primary);
		background: rgba(24, 67, 47, 0.08);
		padding: 2px 8px;
		border-radius: var(--radius-full);
	}

	.item-pack-info {
		font-size: 12px;
		color: var(--text-muted);
	}

	.item-portion-calc {
		font-size: 11px;
		color: #475569;
		background: #f1f5f9;
		padding: 4px 8px;
		border-radius: 6px;
		display: inline-flex;
		align-self: flex-start;
	}

	.item-portion-calc strong {
		color: var(--text-main);
	}

	.item-stepper-row {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-top: 2px;
		flex-wrap: wrap;
	}

	.pack-stepper {
		display: inline-flex;
		align-items: center;
		background: var(--bg-surface-alt);
		border: 1px solid var(--border-subtle);
		border-radius: var(--radius-full);
		padding: 2px 4px;
		gap: 4px;
	}

	.stepper-btn {
		width: 24px;
		height: 24px;
		border-radius: var(--radius-full);
		border: none;
		background: #ffffff;
		color: var(--text-main);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
		transition: all var(--transition-fast);
	}

	.stepper-btn:hover:not(:disabled) {
		background: var(--color-brand-primary);
		color: #ffffff;
	}

	.stepper-btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.stepper-val {
		font-size: 12px;
		font-weight: 800;
		color: var(--text-main);
		padding: 0 6px;
		min-width: 44px;
		text-align: center;
	}

	.rec-restore-pill {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		font-size: 11px;
		font-weight: 700;
		color: #b45309;
		background: #fffbeb;
		border: 1px solid #fde68a;
		padding: 3px 8px;
		border-radius: var(--radius-full);
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.rec-restore-pill:hover {
		background: #fef3c7;
	}

	.rec-match-badge {
		font-size: 11px;
		color: #059669;
		font-weight: 700;
	}

	.item-dishes-note {
		font-size: 12px;
		color: var(--text-muted);
		line-height: 1.35;
	}

	.item-cook-hint {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 11px;
		color: #92400e;
		background: #fffbeb;
		padding: 5px 9px;
		border-radius: 6px;
	}

	.stores-footer {
		padding: 12px 18px;
		background: #fdfcf9;
		border-top: 1px solid var(--border-subtle);
	}

	.stores-map-btn {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 10px 14px;
		background: #ffffff;
		border: 1px solid var(--border-subtle);
		border-radius: var(--radius-md);
		color: var(--color-brand-primary);
		font-family: inherit;
		font-size: 13px;
		font-weight: 700;
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.stores-map-btn:hover {
		background: #ecfdf5;
		border-color: #a7f3d0;
	}
</style>
