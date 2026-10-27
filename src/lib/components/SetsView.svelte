<script lang="ts">
	import { planner } from '#lib/stores/planner.svelte';
	import { READY_MADE_SETS } from '#lib/data/sets';
	import { DAYS_LIST, MEALS_LIST } from '#lib/data/constants';
	import type { ReadyMadeSet } from '#lib/types';

	const selectedSet = $derived(
		planner.selectedSetId ? READY_MADE_SETS.find((s) => s.id === planner.selectedSetId) : null
	);

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

<div class="sets-view-container animate-fade-in">
	{#if !selectedSet}
		<!-- 1. MINIMALIST LIST OF 4 SETS (ONLY NAMES) -->
		<div class="sets-list-view animate-fade-in">
			<div class="sets-intro">
				<h2 class="view-title">Оберіть готовий набір</h2>
				<p class="view-sub">Натисніть на набір, щоб переглянути меню на тиждень</p>
			</div>

			<div class="minimal-sets-grid">
				{#each READY_MADE_SETS as set}
					<button
						class="minimal-set-card"
						onclick={() => openSetDetails(set.id)}
						aria-label="Переглянути набір {set.title}"
					>
						<div class="set-icon-box">{set.emoji}</div>
						<div class="set-info-col">
							<span class="set-badge-tag">{set.badge}</span>
							<h3 class="set-name">{set.title}</h3>
							<span class="set-tagline">{set.subtitle}</span>
						</div>
						<span class="set-arrow">&rsaquo;</span>
					</button>
				{/each}
			</div>
		</div>
	{:else}
		<!-- 2. DETAILED SET VIEW (WHEN USER CLICKS ON ONE OF THE 4) -->
		<div class="set-detail-view animate-slide-up">
			<!-- Back Navigation to Sets List -->
			<button class="back-to-sets-btn" onclick={backToList}>
				<span>&larr;</span>
				<span>Назад до списку наборів</span>
			</button>

			<!-- Set Header Card -->
			<div class="detail-banner" style="background: {selectedSet.gradient}">
				<div class="detail-banner-top">
					<span class="banner-badge">{selectedSet.badge}</span>
					<span class="banner-emoji">{selectedSet.emoji}</span>
				</div>
				<h2 class="detail-title">{selectedSet.title}</h2>
				<p class="detail-subtitle">{selectedSet.subtitle}</p>
				<p class="detail-desc">{selectedSet.description}</p>
			</div>

			<!-- Action Buttons -->
			<div class="detail-actions-row">
				<button class="btn-primary flex-1" onclick={() => handleChooseSet(selectedSet)}>
					<span>Обрати цей набір</span>
					<span>🛒 &rarr;</span>
				</button>

				<button class="btn-secondary" onclick={() => handleCustomizeSet(selectedSet)}>
					<span>Редагувати по днях</span>
					<span>✏️</span>
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
								<span class="day-side-emoji">{day.accentEmoji}</span>
								<span class="day-side-text">{day.shortName}</span>
							</div>

							<div class="day-meals-stack">
								{#each MEALS_LIST as meal}
									{@const dishId = dayPlan ? dayPlan[meal.key] : null}
									{@const dish = planner.getDish(dishId)}
									{#if dish}
										<div class="meal-item-row">
											<span class="meal-type-icon">{meal.icon}</span>
											<div class="meal-item-text">
												<div class="dish-title-row">
													<span class="meal-dish-name">{dish.name}</span>
													{#if dish.isGalyaProduct}
														<span class="galya-mini-badge">🥟 Галя Балувана</span>
													{/if}
												</div>
												<span class="meal-time-info">⏱️ {dish.prepTimeMinutes} хв &bull; {dish.calories} ккал</span>
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
					<span>Затвердити та перейти в кошик</span>
					<span>🛒 &rarr;</span>
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

	.banner-emoji {
		font-size: 28px;
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
		width: 36px;
		background: var(--bg-surface-alt);
		border-radius: var(--radius-sm);
		padding: 6px 0;
	}

	.day-side-emoji {
		font-size: 14px;
	}

	.day-side-text {
		font-size: 12px;
		font-weight: 800;
		color: var(--text-main);
	}

	.day-meals-stack {
		flex: 1;
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
		font-size: 14px;
		margin-top: 1px;
	}

	.meal-item-text {
		flex: 1;
	}

	.dish-title-row {
		display: flex;
		align-items: center;
		gap: 6px;
		flex-wrap: wrap;
	}

	.meal-dish-name {
		font-weight: 700;
		color: var(--text-main);
	}

	.galya-mini-badge {
		font-size: 10px;
		font-weight: 800;
		color: var(--color-brand-primary);
		background: rgba(24, 67, 47, 0.08);
		padding: 1px 6px;
		border-radius: var(--radius-full);
	}

	.meal-time-info {
		display: block;
		font-size: 11px;
		color: var(--text-muted);
	}

	.detail-bottom-cta {
		position: sticky;
		bottom: 12px;
		margin-top: 8px;
		z-index: 30;
	}

	.full-width {
		width: 100%;
		padding: 14px 20px;
		font-size: 15px;
	}
</style>
