<script lang="ts">
	import { planner } from '#lib/stores/planner.svelte';
	import { DISHES } from '#lib/data/dishes';
	import { DAYS_LIST, MEALS_LIST } from '#lib/data/constants';
	import type { Dish, MealKey } from '#lib/types';

	let searchQuery = $state('');
	let selectedFilter = $state<string>('all');

	const activeModal = $derived(planner.activeModal);
	const activeDayInfo = $derived(
		activeModal ? DAYS_LIST.find((d) => d.key === activeModal.day) : null
	);
	const activeMealInfo = $derived(
		activeModal ? MEALS_LIST.find((m) => m.key === activeModal.meal) : null
	);

	// Filter dishes suitable for the active meal
	const filteredDishes = $derived.by(() => {
		if (!activeModal) return [];

		return DISHES.filter((dish) => {
			// Check if dish is compatible with current meal slot
			const matchesMeal =
				dish.category === 'universal' ||
				dish.availableMeals.includes(activeModal.meal) ||
				dish.category === activeModal.meal;

			if (!matchesMeal) return false;

			// Text search
			if (searchQuery.trim()) {
				const query = searchQuery.toLowerCase().trim();
				const matchName = dish.name.toLowerCase().includes(query);
				const matchDesc = dish.description.toLowerCase().includes(query);
				const matchGalya = dish.galyaProduct?.name.toLowerCase().includes(query);
				if (!matchName && !matchDesc && !matchGalya) return false;
			}

			// Filter tag
			if (selectedFilter === 'galya') return dish.isGalyaProduct;
			if (selectedFilter === 'quick') return dish.prepTimeMinutes <= 12;
			if (selectedFilter === 'kids') return dish.tags.includes('kids');
			if (selectedFilter === 'meat') return dish.tags.includes('meat');
			if (selectedFilter === 'cheese') return dish.tags.includes('cheese');

			return true;
		});
	});

	function handleSelect(dish: Dish) {
		if (!activeModal) return;
		planner.setDish(activeModal.day, activeModal.meal, dish.id);
		planner.activeModal = null;
	}

	function handleClose() {
		planner.activeModal = null;
	}
</script>

{#if activeModal && activeDayInfo && activeMealInfo}
	<div
		class="modal-backdrop"
		onclick={handleClose}
		role="button"
		tabindex="0"
		onkeydown={(e) => e.key === 'Escape' && handleClose()}
	>
		<div
			class="modal-sheet animate-slide-up"
			onclick={(e) => e.stopPropagation()}
			role="dialog"
			tabindex="0"
			onkeydown={(e) => e.stopPropagation()}
		>
			<!-- Modal Header -->
			<div class="sheet-header">
				<div class="sheet-indicator"></div>
				<div class="sheet-title-row">
					<div>
						<div class="sheet-breadcrumbs">
							<span>{activeDayInfo.fullName}</span> &bull;
							<span>{activeMealInfo.icon} {activeMealInfo.label}</span>
						</div>
						<h3 class="sheet-heading">Оберіть страву</h3>
					</div>
					<button class="sheet-close-btn" onclick={handleClose} aria-label="Закрити">
						&times;
					</button>
				</div>

				<!-- Search Input -->
				<div class="search-box">
					<span class="search-icon">🔍</span>
					<input
						type="text"
						class="search-input"
						placeholder="Шукати за назвою, напівфабрикатом..."
						bind:value={searchQuery}
					/>
					{#if searchQuery}
						<button class="search-clear" onclick={() => (searchQuery = '')}>✕</button>
					{/if}
				</div>

				<!-- Filter Chips -->
				<div class="filters-scroll">
					<button
						class="chip-btn"
						class:active={selectedFilter === 'all'}
						onclick={() => (selectedFilter = 'all')}
					>
						Усі страви ({filteredDishes.length})
					</button>
					<button
						class="chip-btn"
						class:active={selectedFilter === 'galya'}
						onclick={() => (selectedFilter = 'galya')}
					>
						🥟 Тільки «Галя Балувана»
					</button>
					<button
						class="chip-btn"
						class:active={selectedFilter === 'quick'}
						onclick={() => (selectedFilter = 'quick')}
					>
						⚡ До 12 хв
					</button>
					<button
						class="chip-btn"
						class:active={selectedFilter === 'kids'}
						onclick={() => (selectedFilter = 'kids')}
					>
						👶 Дітям
					</button>
					<button
						class="chip-btn"
						class:active={selectedFilter === 'meat'}
						onclick={() => (selectedFilter = 'meat')}
					>
						🥩 М’ясні
					</button>
					<button
						class="chip-btn"
						class:active={selectedFilter === 'cheese'}
						onclick={() => (selectedFilter = 'cheese')}
					>
						🧀 Сирні
					</button>
				</div>
			</div>

			<!-- Dishes List -->
			<div class="sheet-body">
				{#if filteredDishes.length === 0}
					<div class="empty-state">
						<span class="empty-emoji">🔍</span>
						<p>За вашим запитом страв не знайдено</p>
						<button class="btn-outline btn-sm" onclick={() => { searchQuery = ''; selectedFilter = 'all'; }}>
							Скинути фільтри
						</button>
					</div>
				{:else}
					<div class="dishes-grid">
						{#each filteredDishes as dish}
							<div class="dish-card">
								<div class="dish-card-header">
									<div class="dish-emoji-badge">{dish.imageEmoji}</div>
									<div class="dish-title-col">
										<h4 class="dish-title">{dish.name}</h4>
										<div class="dish-meta-pills">
											<span class="meta-pill">⏱️ {dish.prepTimeMinutes} хв</span>
											<span class="meta-pill">🔥 {dish.calories} ккал</span>
											<span class="meta-pill">👥 {dish.servings} порц.</span>
										</div>
									</div>
								</div>

								<p class="dish-description">{dish.description}</p>

								<!-- Galya Product Badge & Details -->
								{#if dish.isGalyaProduct && dish.galyaProduct}
									<div class="galya-highlight-card">
										<div class="galya-card-top">
											<span class="galya-brand-tag">🥟 Галя Балувана &bull; {dish.galyaProduct.badge}</span>
											<span class="galya-price">~{dish.galyaProduct.priceUah} ₴</span>
										</div>
										<div class="galya-item-name">{dish.galyaProduct.name}</div>
										<div class="galya-cooking-hint">
											💡 <em>{dish.galyaProduct.cookingMethod}</em>
										</div>
									</div>
								{/if}

								<!-- Supermarket Ingredients Teaser -->
								{#if dish.groceryItems.length > 0}
									<div class="grocery-teaser">
										<span class="teaser-label">🛒 Докупити в супермаркеті:</span>
										<span class="teaser-items">
											{dish.groceryItems.map((g) => `${g.name} (${g.amount})`).join(', ')}
										</span>
									</div>
								{/if}

								<button class="btn-primary dish-select-btn" onclick={() => handleSelect(dish)}>
									<span>Обрати цю страву</span>
									<span>✓</span>
								</button>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-backdrop {
		position: fixed;
		inset: 0;
		z-index: 60;
		background: rgba(15, 28, 20, 0.6);
		backdrop-filter: blur(6px);
		display: flex;
		justify-content: center;
		align-items: flex-end;
	}

	.modal-sheet {
		width: 100%;
		max-width: 580px;
		max-height: 85vh;
		background: #ffffff;
		border-radius: 24px 24px 0 0;
		display: flex;
		flex-direction: column;
		box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.2);
		overflow: hidden;
	}

	.sheet-header {
		padding: 12px 18px 12px 18px;
		border-bottom: 1px solid var(--border-subtle);
		background: #ffffff;
	}

	.sheet-indicator {
		width: 36px;
		height: 4px;
		background: #d4cdc3;
		border-radius: 2px;
		margin: 0 auto 12px auto;
	}

	.sheet-title-row {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 12px;
	}

	.sheet-breadcrumbs {
		font-size: 12px;
		font-weight: 700;
		color: var(--color-brand-primary);
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.sheet-heading {
		font-size: 19px;
		font-weight: 800;
		margin: 2px 0 0 0;
	}

	.sheet-close-btn {
		background: var(--bg-surface-alt);
		border: none;
		font-size: 20px;
		line-height: 1;
		width: 32px;
		height: 32px;
		border-radius: 50%;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--text-muted);
	}

	/* Search Box */
	.search-box {
		position: relative;
		margin-bottom: 10px;
	}

	.search-icon {
		position: absolute;
		left: 12px;
		top: 50%;
		transform: translateY(-50%);
		font-size: 14px;
		opacity: 0.6;
	}

	.search-input {
		width: 100%;
		padding: 10px 36px 10px 36px;
		border-radius: var(--radius-md);
		border: 1.5px solid var(--border-subtle);
		font-size: 14px;
		background: var(--bg-surface-alt);
		outline: none;
		transition: border-color var(--transition-fast);
	}

	.search-input:focus {
		border-color: var(--color-brand-primary);
		background: #ffffff;
	}

	.search-clear {
		position: absolute;
		right: 12px;
		top: 50%;
		transform: translateY(-50%);
		background: none;
		border: none;
		cursor: pointer;
		color: var(--text-muted);
		font-size: 12px;
	}

	/* Filters Scroll */
	.filters-scroll {
		display: flex;
		gap: 6px;
		overflow-x: auto;
		padding-bottom: 4px;
		scrollbar-width: none;
	}

	.filters-scroll::-webkit-scrollbar {
		display: none;
	}

	.chip-btn {
		white-space: nowrap;
		padding: 6px 12px;
		border-radius: var(--radius-full);
		font-size: 12px;
		font-weight: 700;
		border: 1px solid var(--border-subtle);
		background: var(--bg-surface-alt);
		color: var(--text-main);
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.chip-btn.active {
		background: var(--color-brand-primary);
		color: #ffffff;
		border-color: var(--color-brand-primary);
	}

	/* Sheet Body */
	.sheet-body {
		padding: 16px 18px 40px 18px;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	.dishes-grid {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	.dish-card {
		border: 1.5px solid var(--border-subtle);
		border-radius: var(--radius-md);
		padding: 16px;
		background: #ffffff;
		display: flex;
		flex-direction: column;
		gap: 10px;
		transition: border-color var(--transition-fast);
	}

	.dish-card:hover {
		border-color: var(--color-brand-primary);
	}

	.dish-card-header {
		display: flex;
		gap: 12px;
		align-items: flex-start;
	}

	.dish-emoji-badge {
		font-size: 26px;
		width: 44px;
		height: 44px;
		border-radius: 12px;
		background: var(--bg-surface-alt);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.dish-title-col {
		flex: 1;
	}

	.dish-title {
		font-size: 15px;
		font-weight: 800;
		line-height: 1.3;
		margin-bottom: 4px;
	}

	.dish-meta-pills {
		display: flex;
		gap: 6px;
		flex-wrap: wrap;
	}

	.meta-pill {
		font-size: 11px;
		font-weight: 600;
		color: var(--text-muted);
		background: var(--bg-surface-alt);
		padding: 2px 7px;
		border-radius: 6px;
	}

	.dish-description {
		font-size: 12px;
		color: var(--text-muted);
		line-height: 1.4;
	}

	/* Galya Highlight Card */
	.galya-highlight-card {
		background: #f0fdf4;
		border: 1px solid #bbf7d0;
		border-radius: var(--radius-sm);
		padding: 10px 12px;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.galya-card-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.galya-brand-tag {
		font-size: 11px;
		font-weight: 800;
		color: #166534;
	}

	.galya-price {
		font-size: 12px;
		font-weight: 800;
		color: #166534;
	}

	.galya-item-name {
		font-size: 12px;
		font-weight: 700;
		color: #14532d;
	}

	.galya-cooking-hint {
		font-size: 11px;
		color: #15803d;
	}

	/* Grocery Teaser */
	.grocery-teaser {
		font-size: 11px;
		color: var(--text-muted);
		background: #fdfaf3;
		border-left: 3px solid var(--color-brand-accent);
		padding: 6px 10px;
		border-radius: 0 6px 6px 0;
	}

	.teaser-label {
		font-weight: 700;
		color: #b45309;
		display: block;
		margin-bottom: 2px;
	}

	.dish-select-btn {
		width: 100%;
		padding: 10px 16px;
		font-size: 14px;
	}

	/* Empty State */
	.empty-state {
		text-align: center;
		padding: 40px 20px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
		color: var(--text-muted);
	}

	.empty-emoji {
		font-size: 36px;
	}
</style>
