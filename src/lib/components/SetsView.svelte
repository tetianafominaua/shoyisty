<script lang="ts">
	import { planner } from '#lib/stores/planner.svelte';
	import { READY_MADE_SETS } from '#lib/data/sets';
	import { DAYS_LIST, MEALS_LIST, getFamilySizeLabel } from '#lib/data/constants';
	import type { ReadyMadeSet } from '#lib/types';
	import FamilySizeSelector from '#lib/components/FamilySizeSelector.svelte';
	import Home from '@lucide/svelte/icons/home';
	import Zap from '@lucide/svelte/icons/zap';
	import Baby from '@lucide/svelte/icons/baby';
	import Wine from '@lucide/svelte/icons/wine';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import ShoppingCart from '@lucide/svelte/icons/shopping-cart';
	import Edit3 from '@lucide/svelte/icons/edit-3';
	import Clock from '@lucide/svelte/icons/clock';
	import ChefHat from '@lucide/svelte/icons/chef-hat';
	import Sun from '@lucide/svelte/icons/sun';
	import Soup from '@lucide/svelte/icons/soup';
	import Utensils from '@lucide/svelte/icons/utensils';
	import Users from '@lucide/svelte/icons/users';
	import Package from '@lucide/svelte/icons/package';
	import Salad from '@lucide/svelte/icons/salad';

	const selectedSet = $derived(
		planner.selectedSetId ? READY_MADE_SETS.find((s) => s.id === planner.selectedSetId) : null
	);
	const setSummary = $derived(selectedSet ? planner.getSetSummary(selectedSet) : null);

	function openSetDetails(setId: string) {
		planner.selectedSetId = setId;
	}

	function backToList() {
		planner.selectedSetId = null;
	}

	function handleChooseSet(set: ReadyMadeSet) {
		planner.loadSet(set.id);
		planner.activeTab = 'cart';
	}

	function handleCustomizeSet(set: ReadyMadeSet) {
		planner.loadSet(set.id);
		planner.activeTab = 'week';
		planner.showToast(`Набір «${set.title}» завантажено! Можете замінити будь-яку страву.`);
	}
</script>

{#snippet setIcon(id: string, size = 22)}
	{#if id === 'family-comfort'}
		<Home {size} />
	{:else if id === 'express-busy'}
		<Zap {size} />
	{:else if id === 'kids-mom-care'}
		<Baby {size} />
	{:else if id === 'gourmet-weekend'}
		<Wine {size} />
	{:else}
		<Home {size} />
	{/if}
{/snippet}

{#snippet mealIcon(key: string, size = 15)}
	{#if key === 'breakfast'}
		<Sun {size} />
	{:else if key === 'lunch'}
		<Soup {size} />
	{:else}
		<Utensils {size} />
	{/if}
{/snippet}

<div class="sets-view-container animate-fade-in">
	{#if !selectedSet}
		<!-- 1. MINIMALIST LIST OF 4 SETS (ONLY NAMES) -->
		<div class="sets-list-view animate-fade-in">
			<div class="sets-intro">
				<h2 class="view-title">Оберіть готовий набір</h2>
				<p class="view-sub">Вкажіть склад родини та відкрийте набір для перегляду меню</p>
			</div>

			<div class="selector-spacer">
				<FamilySizeSelector />
			</div>

			<div class="minimal-sets-grid">
				{#each READY_MADE_SETS as set}
					<button
						class="minimal-set-card"
						onclick={() => openSetDetails(set.id)}
						aria-label="Переглянути набір {set.title}"
					>
						<div class="set-icon-box" style="color: {set.accentColor}">
							{@render setIcon(set.id, 22)}
						</div>
						<div class="set-info-col">
							<span class="set-badge-tag">{set.badge}</span>
							<h3 class="set-name">{set.title}</h3>
							<span class="set-tagline">{set.subtitle}</span>
						</div>
						<span class="set-arrow">
							<ChevronRight size={20} />
						</span>
					</button>
				{/each}
			</div>
		</div>
	{:else}
		<!-- 2. DETAILED SET VIEW (WHEN USER CLICKS ON ONE OF THE 4) -->
		<div class="set-detail-view animate-slide-up">
			<!-- Back Navigation to Sets List -->
			<button class="back-to-sets-btn" onclick={backToList}>
				<ArrowLeft size={16} />
				<span>Назад до списку наборів</span>
			</button>

			<!-- Set Header Card -->
			<div class="detail-banner" style="background: {selectedSet.gradient}">
				<div class="detail-banner-top">
					<span class="banner-badge">{selectedSet.badge}</span>
					<div class="banner-icon-badge">
						{@render setIcon(selectedSet.id, 24)}
					</div>
				</div>
				<h2 class="detail-title">{selectedSet.title}</h2>
				<p class="detail-subtitle">{selectedSet.subtitle}</p>
				<p class="detail-desc">{selectedSet.description}</p>
				{#if selectedSet.idealFor}
					<div class="detail-ideal-for">
						<Users size={13} />
						<span>{selectedSet.idealFor}</span>
					</div>
				{/if}
			</div>

			<FamilySizeSelector subtitle="Кількість упаковок підбирається сумарно на весь тиждень" />

			{#if setSummary}
				<div class="set-summary-bar">
					<div class="set-summary-item">
						<span class="summary-kicker">Меню</span>
						<strong class="summary-val">{selectedSet.totalDishesCount} страв</strong>
					</div>
					<div class="summary-divider"></div>
					<div class="set-summary-item">
						<span class="summary-kicker">Для {getFamilySizeLabel(planner.familySize)}</span>
						<strong class="summary-val text-brand">
							<Package size={13} />
							<span>{setSummary.totalGalyaUnits} уп.</span>
						</strong>
					</div>
					<div class="summary-divider"></div>
					<div class="set-summary-item">
						<span class="summary-kicker">Орієнтовно</span>
						<strong class="summary-val text-brand">~{setSummary.totalEstimatedGalyaPrice} ₴</strong>
					</div>
				</div>
			{/if}

			<!-- Action Buttons -->
			<div class="detail-actions-row">
				<button class="btn-primary flex-1" onclick={() => handleChooseSet(selectedSet)}>
					<span>Обрати цей набір</span>
					<ShoppingCart size={16} />
				</button>

				<button class="btn-secondary" onclick={() => handleCustomizeSet(selectedSet)}>
					<Edit3 size={15} />
					<span>Редагувати по днях</span>
				</button>
			</div>

			<!-- 7 Days Week Breakdown -->
			<div class="detail-schedule">
				<h3 class="schedule-heading">Меню на 7 днів (Пн–Нд):</h3>

				<div class="schedule-days-list">
					{#each DAYS_LIST as day}
						{@const dayPlan = selectedSet.plan[day.key]}
						<div class="schedule-day-card">
							<div class="day-side-label">
								<span class="day-side-text">{day.shortName}</span>
							</div>

							<div class="day-meals-stack">
								{#each MEALS_LIST as meal}
									{@const dishId = dayPlan ? dayPlan[meal.key] : null}
									{@const dish = planner.getDish(dishId)}
									{#if dish}
										<div class="meal-item-row">
											<span class="meal-type-icon">
												{@render mealIcon(meal.key, 14)}
											</span>
											<div class="meal-item-text">
												<div class="dish-title-row">
													<span class="meal-dish-name">{dish.name}</span>
													{#if dish.isGalyaProduct}
														<span class="galya-mini-badge">
															<ChefHat size={11} />
															<span>Галя Балувана</span>
														</span>
													{/if}
												</div>
												{#if dish.groceryItems && dish.groceryItems.length > 0}
													<div class="meal-ration-box">
														<span class="ration-tag">
															<Salad size={11} />
															<span>Продукти із супермаркету:</span>
														</span>
														<span class="ration-items-text">
															+ {dish.groceryItems.map((g) => g.name).join(' • ')}
														</span>
													</div>
												{/if}
												<div class="meal-time-info">
													<Clock size={11} />
													<span>
														{dish.prepTimeMinutes} хв &bull; {dish.calories} ккал &bull; {dish.servings} порц./уп.
													</span>
													<span class="pack-hint-chip">{planner.getDishPackHint(dish)}</span>
												</div>
											</div>
										</div>
									{/if}
								{/each}
							</div>
						</div>
					{/each}
				</div>
			</div>

			<!-- Bottom CTA -->
			<div class="detail-bottom-cta">
				<button class="btn-primary full-width" onclick={() => handleChooseSet(selectedSet)}>
					<span>
						Затвердити ({setSummary ? `${setSummary.totalGalyaUnits} уп.` : 'набір'}) і в кошик
					</span>
					<ArrowRight size={16} />
				</button>
			</div>
		</div>
	{/if}
</div>

<style>
	.sets-view-container {
		padding: 20px 18px 48px 18px;
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	/* 1. Sets List View */
	.sets-intro {
		margin-bottom: 16px;
	}

	.view-title {
		font-size: 24px;
		font-weight: 800;
		color: var(--text-main);
		margin-bottom: 4px;
	}

	.view-sub {
		font-size: 13px;
		color: var(--text-muted);
	}

	.minimal-sets-grid {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.minimal-set-card {
		display: flex;
		align-items: center;
		gap: 14px;
		padding: 16px 18px;
		height: 100%;
		background: #ffffff;
		border: 1.5px solid var(--border-subtle);
		border-radius: var(--radius-lg);
		cursor: pointer;
		text-align: left;
		transition: all var(--transition-fast);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
	}

	.minimal-set-card:hover {
		border-color: var(--color-brand-primary);
		transform: translateY(-2px);
		box-shadow: 0 8px 20px rgba(24, 67, 47, 0.1);
	}

	.set-icon-box {
		width: 48px;
		height: 48px;
		border-radius: 14px;
		background: var(--bg-surface-alt);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24px;
		flex-shrink: 0;
	}

	.set-info-col {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.set-badge-tag {
		font-size: 10px;
		font-weight: 800;
		color: var(--color-brand-accent);
		text-transform: uppercase;
		letter-spacing: 0.03em;
	}

	.set-name {
		font-size: 17px;
		font-weight: 800;
		color: var(--text-main);
		margin: 0;
		line-height: 1.25;
	}

	.set-tagline {
		font-size: 12px;
		color: var(--text-muted);
		line-height: 1.35;
	}

	.set-arrow {
		font-size: 24px;
		font-weight: 700;
		color: var(--text-subtle);
		line-height: 1;
		transition: transform var(--transition-fast);
	}

	.minimal-set-card:hover .set-arrow {
		color: var(--color-brand-primary);
		transform: translateX(3px);
	}

	/* 2. Set Detail View */
	.set-detail-view {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.back-to-sets-btn {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		background: none;
		border: none;
		color: var(--color-brand-primary);
		font-size: 13px;
		font-weight: 700;
		cursor: pointer;
		padding: 0;
	}

	.back-to-sets-btn:hover {
		text-decoration: underline;
	}

	.detail-banner {
		padding: 22px;
		border-radius: var(--radius-lg);
		color: #ffffff;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
	}

	.detail-banner-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10px;
	}

	.banner-badge {
		font-size: 11px;
		font-weight: 800;
		background: rgba(255, 255, 255, 0.2);
		backdrop-filter: blur(8px);
		padding: 4px 10px;
		border-radius: var(--radius-full);
	}

	.banner-icon-badge {
		width: 36px;
		height: 36px;
		border-radius: 10px;
		background: rgba(255, 255, 255, 0.2);
		backdrop-filter: blur(8px);
		display: flex;
		align-items: center;
		justify-content: center;
		color: #ffffff;
	}

	.detail-title {
		font-size: 24px;
		font-weight: 800;
		color: #ffffff;
		margin-bottom: 4px;
	}

	.detail-subtitle {
		font-size: 13px;
		opacity: 0.95;
		margin-bottom: 8px;
		font-weight: 600;
	}

	.detail-desc {
		font-size: 12px;
		opacity: 0.85;
		line-height: 1.45;
	}

	.detail-actions-row {
		display: flex;
		gap: 10px;
	}

	.flex-1 {
		flex: 1;
	}

	.schedule-heading {
		font-size: 16px;
		font-weight: 800;
		margin-bottom: 12px;
		color: var(--text-main);
	}

	.schedule-days-list {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.schedule-day-card {
		background: #ffffff;
		border: 1px solid var(--border-subtle);
		border-radius: var(--radius-md);
		padding: 12px 14px;
		display: flex;
		gap: 12px;
	}

	.day-side-label {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 32px;
		flex-shrink: 0;
		background: var(--bg-surface-alt);
		border-radius: var(--radius-sm);
		padding: 8px 0;
	}

	.day-side-text {
		font-size: 13px;
		font-weight: 800;
		color: var(--text-main);
	}

	.day-meals-stack {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.meal-item-row {
		display: flex;
		gap: 8px;
		align-items: flex-start;
		font-size: 12px;
	}

	.meal-type-icon {
		color: var(--color-brand-primary);
		display: flex;
		align-items: center;
		margin-top: 2px;
		flex-shrink: 0;
	}

	.meal-item-text {
		flex: 1;
		min-width: 0;
	}

	.dish-title-row {
		display: flex;
		align-items: flex-start;
		gap: 6px;
		flex-wrap: nowrap;
	}

	.meal-dish-name {
		font-weight: 700;
		color: var(--text-main);
		min-width: 0;
	}

	.galya-mini-badge {
		display: inline-flex;
		align-items: center;
		gap: 3px;
		font-size: 10px;
		font-weight: 700;
		color: var(--color-brand-primary);
		background: rgba(24, 67, 47, 0.08);
		padding: 1px 6px;
		border-radius: 4px;
		flex-shrink: 0;
		white-space: nowrap;
		margin-top: 1px;
	}

	.meal-ration-box {
		margin-top: 5px;
		margin-bottom: 5px;
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 5px;
		font-size: 11px;
		line-height: 1.35;
		background: #f0fdf4;
		border: 1px solid #bbf7d0;
		border-radius: 6px;
		padding: 4px 8px;
	}

	.ration-tag {
		display: inline-flex;
		align-items: center;
		gap: 3px;
		font-weight: 700;
		color: #15803d;
		flex-shrink: 0;
	}

	.ration-items-text {
		color: #14532d;
		font-weight: 500;
	}

	.meal-time-info {
		display: inline-flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 4px;
		font-size: 11px;
		color: var(--text-muted);
		margin-top: 2px;
	}

	.selector-spacer {
		margin-bottom: 14px;
	}

	.detail-ideal-for {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		margin-top: 10px;
		padding: 6px 10px;
		border-radius: var(--radius-sm);
		background: rgba(255, 255, 255, 0.16);
		font-size: 11.5px;
		font-weight: 600;
		color: #ffffff;
	}

	.set-summary-bar {
		display: flex;
		align-items: center;
		justify-content: space-around;
		background: #ffffff;
		border: 1.5px solid var(--border-subtle);
		border-radius: var(--radius-md);
		padding: 12px 10px;
		box-shadow: var(--shadow-sm);
	}

	.set-summary-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 2px;
	}

	.summary-kicker {
		font-size: 11px;
		color: var(--text-muted);
	}

	.summary-val {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		font-size: 14px;
		font-weight: 800;
		color: var(--text-main);
	}

	.summary-val.text-brand {
		color: var(--color-brand-primary);
	}

	.summary-divider {
		width: 1px;
		height: 28px;
		background: var(--border-subtle);
	}

	.pack-hint-chip {
		font-size: 10.5px;
		font-weight: 700;
		color: #166534;
		background: #dcfce7;
		padding: 1px 6px;
		border-radius: 4px;
	}

	.detail-bottom-cta {
		position: sticky;
		bottom: 12px;
		width: 100%;
		max-width: 540px;
		margin: 8px auto 0 auto;
		z-index: 30;
	}

	.full-width {
		width: 100%;
		padding: 14px 20px;
		font-size: 15px;
	}

	@media (min-width: 720px) {
		.minimal-sets-grid,
		.schedule-days-list {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 12px;
			align-items: stretch;
		}
	}
</style>
