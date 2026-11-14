<script lang="ts">
	import { planner } from '#lib/stores/planner.svelte';
	import type { ShoppingCartGrouped } from '#lib/types';
	import { GROCERY_CATEGORIES_UA } from '#lib/data/constants';
	import ShoppingBag from '@lucide/svelte/icons/shopping-bag';
	import Check from '@lucide/svelte/icons/check';
	import Milk from '@lucide/svelte/icons/milk';
	import Carrot from '@lucide/svelte/icons/carrot';
	import Croissant from '@lucide/svelte/icons/croissant';
	import Package from '@lucide/svelte/icons/package';
	import Flame from '@lucide/svelte/icons/flame';

	let { cart }: { cart: ShoppingCartGrouped } = $props();
</script>

{#snippet categoryIcon(catKey: string, size = 15)}
	{#if catKey === 'dairy'}
		<Milk {size} />
	{:else if catKey === 'produce'}
		<Carrot {size} />
	{:else if catKey === 'bakery'}
		<Croissant {size} />
	{:else if catKey === 'grocery'}
		<Package {size} />
	{:else if catKey === 'sauces'}
		<Flame {size} />
	{:else}
		<ShoppingBag {size} />
	{/if}
{/snippet}

<section class="cart-section supermarket-section">
	<div class="section-header">
		<div class="section-title-box">
			<span class="section-icon icon-supermarket">
				<ShoppingBag size={20} color="#b45309" />
			</span>
			<div>
				<h3 class="section-title">2. Докупити в супермаркеті</h3>
				<span class="section-sub"> Супутні інгредієнти та бакалія для укомплектування страв </span>
			</div>
		</div>
		<span class="supermarket-badge">Супермаркет</span>
	</div>

	<div class="grocery-groups">
		{#if cart.groceryItems.length === 0}
			<div class="empty-grocery-note">
				Обрані страви вже готові або не потребують додаткових покупок у супермаркеті.
			</div>
		{:else}
			{#each ['dairy', 'produce', 'bakery', 'grocery', 'sauces', 'other'] as catKey (catKey)}
				{@const catItems = cart.groceryItems.filter((i) => i.category === catKey)}
				{#if catItems.length > 0}
					{@const catInfo = GROCERY_CATEGORIES_UA[catKey] || { label: catKey, icon: 'other' }}
					<div class="category-group">
						<div class="category-header">
							<span class="cat-icon">
								{@render categoryIcon(catKey, 14)}
							</span>
							<span class="cat-name">{catInfo.label}</span>
							<span class="cat-count">({catItems.length})</span>
						</div>

						<div class="category-items">
							{#each catItems as item (item.name)}
								{@const itemKey = `grocery_${item.name}`}
								{@const isChecked = !!planner.checkedItems[itemKey]}

								<div class="grocery-item-row" class:checked={isChecked}>
									<button
										class="checkbox-btn"
										onclick={() => planner.toggleChecked(itemKey)}
										aria-label="Позначити купленим {item.name}"
									>
										<span class="check-box" class:active={isChecked}>
											{#if isChecked}
												<Check size={13} strokeWidth={3} />
											{/if}
										</span>
									</button>

									<div class="grocery-text-col">
										<div class="grocery-title-row">
											<span class="grocery-name">{item.name}</span>
											<span class="grocery-amount" class:scalable-tag={item.scalable}>
												{item.amountLabel}
											</span>
										</div>
										<span class="grocery-dishes-sub">
											Для: {item.dishesNames.join(', ')}
										</span>
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/if}
			{/each}
		{/if}
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
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.icon-supermarket {
		background: #fffbeb;
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

	.supermarket-badge {
		font-size: 11px;
		font-weight: 800;
		padding: 4px 10px;
		border-radius: var(--radius-full);
		background: #fffbeb;
		color: #b45309;
		border: 1px solid #fde68a;
	}

	.empty-grocery-note {
		padding: 30px 20px;
		text-align: center;
		color: var(--text-muted);
		font-size: 14px;
	}

	.grocery-groups {
		display: flex;
		flex-direction: column;
	}

	.category-group {
		border-bottom: 1px solid var(--border-subtle);
	}

	.category-group:last-child {
		border-bottom: none;
	}

	.category-header {
		background: var(--bg-surface-alt);
		padding: 8px 18px;
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 12px;
		font-weight: 800;
		color: var(--text-main);
		text-transform: uppercase;
		letter-spacing: 0.03em;
	}

	.cat-icon {
		display: flex;
		color: var(--color-brand-primary);
	}

	.cat-count {
		color: var(--text-muted);
		font-weight: 600;
	}

	.category-items {
		display: flex;
		flex-direction: column;
	}

	.grocery-item-row {
		display: flex;
		gap: 12px;
		padding: 12px 18px;
		border-bottom: 1px solid rgba(0, 0, 0, 0.04);
		transition: background var(--transition-fast);
	}

	.grocery-item-row:last-child {
		border-bottom: none;
	}

	.grocery-item-row.checked {
		background: #fcfbf8;
		opacity: 0.6;
	}

	.grocery-item-row.checked .grocery-name {
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
		width: 20px;
		height: 20px;
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

	.grocery-text-col {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 3px;
	}

	.grocery-title-row {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 8px;
	}

	.grocery-name {
		font-size: 14px;
		font-weight: 700;
		color: var(--text-main);
	}

	.grocery-amount {
		font-size: 13px;
		font-weight: 800;
		color: #b45309;
		background: #fffbeb;
		padding: 2px 8px;
		border-radius: var(--radius-full);
		white-space: nowrap;
	}

	.grocery-amount.scalable-tag {
		border: 1px solid #fde68a;
	}

	.grocery-dishes-sub {
		font-size: 11px;
		color: var(--text-muted);
	}
</style>
