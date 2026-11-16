<script lang="ts">
	import { planner } from '#lib/stores/planner.svelte';
	import { DISHES } from '#lib/data/dishes';
	import { DAYS_LIST, MEALS_LIST } from '#lib/data/constants';
	import { t } from '#lib/i18n/translations';
	import type { Dish, DayKey, MealKey } from '#lib/types';
	import Search from '@lucide/svelte/icons/search';
	import Heart from '@lucide/svelte/icons/heart';
	import Clock from '@lucide/svelte/icons/clock';
	import Users from '@lucide/svelte/icons/users';
	import Plus from '@lucide/svelte/icons/plus';
	import Check from '@lucide/svelte/icons/check';
	import X from '@lucide/svelte/icons/x';
	import Sparkles from '@lucide/svelte/icons/sparkles';

	let searchQuery = $state('');
	let selectedCategory = $state<'all' | 'favorites' | 'breakfast' | 'lunch' | 'dinner' | 'snack'>(
		'all'
	);
	let modalDish = $state<Dish | null>(null);
	let targetDay = $state<DayKey>(planner.selectedDay);
	let targetMeal = $state<MealKey>('dinner');

	const locale = $derived(planner.locale);
	const favorites = $derived(planner.favorites);

	// Filtering
	const filteredDishes = $derived.by(() => {
		return DISHES.filter((dish) => {
			// Category filter
			if (selectedCategory === 'favorites') {
				if (!favorites.includes(dish.id)) return false;
			} else if (selectedCategory === 'breakfast') {
				if (dish.category !== 'breakfast' && !dish.availableMeals.includes('breakfast'))
					return false;
			} else if (selectedCategory === 'lunch') {
				if (dish.category !== 'lunch' && !dish.availableMeals.includes('lunch')) return false;
			} else if (selectedCategory === 'dinner') {
				if (dish.category !== 'dinner' && !dish.availableMeals.includes('dinner')) return false;
			} else if (selectedCategory === 'snack') {
				if (dish.category !== 'snack' && !dish.availableMeals.includes('snack')) return false;
			}

			// Search query
			if (searchQuery.trim()) {
				const q = searchQuery.toLowerCase().trim();
				const matchName = dish.name.toLowerCase().includes(q);
				const matchDesc = dish.description.toLowerCase().includes(q);
				const matchGalya = dish.galyaProduct?.name.toLowerCase().includes(q);
				const matchCompanion = dish.sideCompanion?.toLowerCase().includes(q);
				if (!matchName && !matchDesc && !matchGalya && !matchCompanion) return false;
			}

			return true;
		});
	});

	// Pinned Favorites (shown at top when on 'all' view)
	const pinnedFavoriteDishes = $derived.by(() => {
		if (selectedCategory !== 'all' || searchQuery.trim().length > 0) return [];
		return favorites
			.map((id) => DISHES.find((d) => d.id === id))
			.filter((d): d is Dish => d !== undefined);
	});

	function openAddModal(dish: Dish) {
		modalDish = dish;
		targetDay = planner.selectedDay;
		// Default to best meal slot for this dish
		if (dish.availableMeals.includes('breakfast')) targetMeal = 'breakfast';
		else if (dish.availableMeals.includes('lunch')) targetMeal = 'lunch';
		else if (dish.availableMeals.includes('snack')) targetMeal = 'snack';
		else targetMeal = 'dinner';
	}

	function confirmAddToPlan() {
		if (!modalDish) return;
		planner.addDish(targetDay, targetMeal, modalDish.id);
		modalDish = null;
	}
</script>

<div class="inspire-container animate-fade-in">
	<!-- Page Header -->
	<div class="inspire-header">
		<div class="header-badge">
			<Sparkles size={14} />
			<span>{t('inspire.title', locale)}</span>
		</div>
		<h2 class="inspire-title">{t('inspire.title', locale)}</h2>
		<p class="inspire-subtitle">{t('inspire.subtitle', locale)}</p>
	</div>

	<!-- Search & Filters -->
	<div class="search-filter-box">
		<div class="search-input-wrap">
			<Search size={18} class="search-icon" />
			<input
				type="text"
				bind:value={searchQuery}
				placeholder={t('inspire.searchPlaceholder', locale)}
				class="search-input"
			/>
			{#if searchQuery}
				<button
					class="clear-search-btn"
					onclick={() => (searchQuery = '')}
					aria-label="Очистити пошук"
				>
					<X size={15} />
				</button>
			{/if}
		</div>

		<!-- Horizontal Filter Pills -->
		<div class="filter-pills-row" role="tablist">
			<button
				class="filter-pill"
				class:active={selectedCategory === 'all'}
				onclick={() => (selectedCategory = 'all')}
			>
				{t('inspire.filter.all', locale)} ({DISHES.length})
			</button>

			<button
				class="filter-pill pill-fav"
				class:active={selectedCategory === 'favorites'}
				onclick={() => (selectedCategory = 'favorites')}
			>
				<Heart
					size={13}
					fill={selectedCategory === 'favorites' ? '#ef4444' : 'none'}
					color="#ef4444"
				/>
				<span>{t('inspire.filter.favorites', locale)} ({favorites.length})</span>
			</button>

			<button
				class="filter-pill"
				class:active={selectedCategory === 'breakfast'}
				onclick={() => (selectedCategory = 'breakfast')}
			>
				{t('inspire.filter.breakfast', locale)}
			</button>

			<button
				class="filter-pill"
				class:active={selectedCategory === 'lunch'}
				onclick={() => (selectedCategory = 'lunch')}
			>
				{t('inspire.filter.lunch', locale)}
			</button>

			<button
				class="filter-pill"
				class:active={selectedCategory === 'dinner'}
				onclick={() => (selectedCategory = 'dinner')}
			>
				{t('inspire.filter.dinner', locale)}
			</button>

			<button
				class="filter-pill"
				class:active={selectedCategory === 'snack'}
				onclick={() => (selectedCategory = 'snack')}
			>
				{t('inspire.filter.snack', locale)}
			</button>
		</div>
	</div>

	<!-- Pinned Favorites Section (if any and in 'all' view) -->
	{#if pinnedFavoriteDishes.length > 0}
		<section class="pinned-favorites-section">
			<div class="section-title-row">
				<Heart size={16} fill="#ef4444" color="#ef4444" />
				<h3 class="section-heading">{t('inspire.favoritesHeading', locale)}</h3>
			</div>

			<div class="favorites-scroll-row">
				{#each pinnedFavoriteDishes as dish (dish.id)}
					<div class="fav-mini-card">
						<button
							class="fav-toggle-btn active"
							onclick={() => planner.toggleFavorite(dish.id)}
							aria-label="Прибрати з обраного"
						>
							<Heart size={15} fill="#ef4444" color="#ef4444" />
						</button>
						<span class="fav-card-title">{dish.name}</span>
						<span class="fav-card-price">~{dish.galyaProduct?.priceUah} ₴</span>
						<button class="fav-add-btn" onclick={() => openAddModal(dish)}>
							<Plus size={13} />
							<span>{t('inspire.addToPlan', locale)}</span>
						</button>
					</div>
				{/each}
			</div>
		</section>
	{/if}

	<!-- Main Dishes Grid -->
	<section class="dishes-list-section">
		{#if filteredDishes.length === 0}
			<div class="empty-results-card">
				<p>
					{selectedCategory === 'favorites'
						? t('inspire.favoritesEmpty', locale)
						: 'За вашим запитом нічого не знайдено.'}
				</p>
			</div>
		{:else}
			<div class="dishes-cards-grid">
				{#each filteredDishes as dish (dish.id)}
					{@const isFav = planner.isFavorite(dish.id)}
					<div class="dish-card">
						<div class="card-top-bar">
							<span class="badge-tag">{dish.galyaProduct?.badge || 'Галя Балувана'}</span>
							<button
								type="button"
								class="heart-btn"
								class:is-fav={isFav}
								onclick={() => planner.toggleFavorite(dish.id)}
								aria-label={isFav ? 'Прибрати з обраного' : 'Додати в обране'}
							>
								<Heart
									size={18}
									fill={isFav ? '#ef4444' : 'none'}
									color={isFav ? '#ef4444' : '#94a3b8'}
								/>
							</button>
						</div>

						<div class="card-main-info">
							<h4 class="dish-name">{dish.name}</h4>
							<p class="dish-desc">{dish.description}</p>
						</div>

						{#if dish.sideCompanion}
							<div class="side-companion-box">
								<span class="companion-tag">З супермаркету:</span>
								<span class="companion-text">{dish.sideCompanion}</span>
							</div>
						{/if}

						<div class="card-meta-row">
							<span class="meta-item">
								<Clock size={13} />
								<span>{dish.prepTimeMinutes} {t('common.minutes', locale)}</span>
							</span>
							<span class="meta-item">
								<Users size={13} />
								<span>{dish.servings} {t('common.servings', locale)}</span>
							</span>
							<span class="meta-price">
								~{dish.galyaProduct?.priceUah}
								{t('common.uah', locale)}
							</span>
						</div>

						<div class="card-footer-action">
							<span class="pack-info">{dish.galyaProduct?.weightText}</span>
							<button class="add-to-plan-btn" onclick={() => openAddModal(dish)}>
								<Plus size={15} strokeWidth={2.5} />
								<span>{t('inspire.addToPlan', locale)}</span>
							</button>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</section>
</div>

<!-- Quick Add to Plan Modal -->
{#if modalDish}
	<div
		class="modal-backdrop animate-fade-in"
		onclick={() => (modalDish = null)}
		onkeydown={(e) => {
			if (e.key === 'Escape') modalDish = null;
		}}
		role="button"
		tabindex="0"
		aria-label="Закрити вікно"
	>
		<div
			class="modal-sheet animate-slide-up"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
			role="dialog"
			aria-modal="true"
			tabindex="-1"
		>
			<div class="sheet-header">
				<div>
					<h3 class="sheet-title">{t('inspire.selectDayAndMeal', locale)}</h3>
					<span class="sheet-subtitle">«{modalDish.name}»</span>
				</div>
				<button class="close-sheet-btn" onclick={() => (modalDish = null)} aria-label="Закрити">
					<X size={18} />
				</button>
			</div>

			<div class="sheet-body">
				<!-- Day Selector -->
				<div class="form-group">
					<span class="form-label">{t('inspire.day', locale)}:</span>
					<div class="days-pill-grid">
						{#each DAYS_LIST as day (day.key)}
							<button
								type="button"
								class="day-btn"
								class:selected={targetDay === day.key}
								onclick={() => (targetDay = day.key)}
							>
								{day.shortName}
							</button>
						{/each}
					</div>
				</div>

				<!-- Meal Selector -->
				<div class="form-group">
					<span class="form-label">{t('inspire.meal', locale)}:</span>
					<div class="meals-pill-grid">
						{#each MEALS_LIST as meal (meal.key)}
							<button
								type="button"
								class="meal-btn"
								class:selected={targetMeal === meal.key}
								onclick={() => (targetMeal = meal.key)}
							>
								{meal.label}
							</button>
						{/each}
					</div>
				</div>
			</div>

			<div class="sheet-footer">
				<button class="btn-cancel" onclick={() => (modalDish = null)}>
					{t('common.cancel', locale)}
				</button>
				<button class="btn-confirm" onclick={confirmAddToPlan}>
					<Check size={16} strokeWidth={2.5} />
					<span>{t('common.confirm', locale)}</span>
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.inspire-container {
		padding: 16px 16px 90px 16px;
		max-width: 600px;
		margin: 0 auto;
		width: 100%;
	}

	.inspire-header {
		text-align: center;
		margin-bottom: 16px;
	}

	.header-badge {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		background: #f0fdf4;
		border: 1px solid #bbf7d0;
		color: var(--color-brand-primary);
		padding: 4px 12px;
		border-radius: var(--radius-full);
		font-size: 12px;
		font-weight: 700;
		margin-bottom: 6px;
	}

	.inspire-title {
		font-size: 24px;
		font-weight: 800;
		color: var(--text-main);
		margin: 0 0 4px 0;
		letter-spacing: -0.02em;
	}

	.inspire-subtitle {
		font-size: 13px;
		color: var(--text-muted);
		margin: 0;
	}

	/* Search & Filters */
	.search-filter-box {
		margin-bottom: 18px;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.search-input-wrap {
		position: relative;
		display: flex;
		align-items: center;
	}

	:global(.search-icon) {
		position: absolute;
		left: 14px;
		color: #94a3b8;
		pointer-events: none;
	}

	.search-input {
		width: 100%;
		padding: 12px 38px 12px 40px;
		background: #ffffff;
		border: 1.5px solid var(--border-subtle);
		border-radius: var(--radius-lg);
		font-size: 14px;
		outline: none;
		transition: all var(--transition-fast);
		color: var(--text-main);
	}

	.search-input:focus {
		border-color: var(--color-brand-primary);
		box-shadow: 0 0 0 3px rgba(24, 67, 47, 0.1);
	}

	.clear-search-btn {
		position: absolute;
		right: 12px;
		background: transparent;
		border: none;
		color: #94a3b8;
		cursor: pointer;
		padding: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* Filter Pills */
	.filter-pills-row {
		display: flex;
		gap: 8px;
		overflow-x: auto;
		padding-bottom: 4px;
		scrollbar-width: none;
		-webkit-overflow-scrolling: touch;
	}

	.filter-pills-row::-webkit-scrollbar {
		display: none;
	}

	.filter-pill {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 8px 14px;
		border-radius: var(--radius-full);
		font-size: 12px;
		font-weight: 700;
		background: #ffffff;
		border: 1.5px solid var(--border-subtle);
		color: var(--text-muted);
		white-space: nowrap;
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.filter-pill:hover {
		border-color: #cbd5e1;
		color: var(--text-main);
	}

	.filter-pill.active {
		background: var(--color-brand-primary);
		border-color: var(--color-brand-primary);
		color: #ffffff;
	}

	.pill-fav.active {
		background: #ef4444;
		border-color: #ef4444;
		color: #ffffff;
	}

	/* Pinned Favorites Section */
	.pinned-favorites-section {
		background: #fff1f2;
		border: 1.5px solid #fecdd3;
		border-radius: var(--radius-lg);
		padding: 14px;
		margin-bottom: 20px;
	}

	.section-title-row {
		display: flex;
		align-items: center;
		gap: 6px;
		margin-bottom: 10px;
	}

	.section-heading {
		font-size: 13px;
		font-weight: 800;
		color: #be123c;
		margin: 0;
	}

	.favorites-scroll-row {
		display: flex;
		gap: 10px;
		overflow-x: auto;
		padding-bottom: 4px;
		scrollbar-width: none;
	}

	.favorites-scroll-row::-webkit-scrollbar {
		display: none;
	}

	.fav-mini-card {
		flex: 0 0 160px;
		background: #ffffff;
		border: 1px solid #fda4af;
		border-radius: var(--radius-md);
		padding: 10px;
		display: flex;
		flex-direction: column;
		gap: 4px;
		position: relative;
	}

	.fav-toggle-btn {
		position: absolute;
		top: 6px;
		right: 6px;
		background: transparent;
		border: none;
		cursor: pointer;
		padding: 2px;
	}

	.fav-card-title {
		font-size: 13px;
		font-weight: 700;
		color: var(--text-main);
		line-height: 1.25;
		padding-right: 20px;
	}

	.fav-card-price {
		font-size: 12px;
		font-weight: 800;
		color: var(--color-brand-primary);
	}

	.fav-add-btn {
		margin-top: 6px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 4px;
		background: #f0fdf4;
		border: 1px solid #bbf7d0;
		color: var(--color-brand-primary);
		border-radius: var(--radius-full);
		font-size: 11px;
		font-weight: 800;
		padding: 5px 8px;
		cursor: pointer;
	}

	/* Dishes Cards Grid */
	.dishes-cards-grid {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.dish-card {
		background: #ffffff;
		border-radius: var(--radius-lg);
		border: 1.5px solid var(--border-subtle);
		padding: 16px;
		display: flex;
		flex-direction: column;
		gap: 10px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
		transition: all var(--transition-fast);
	}

	.dish-card:hover {
		border-color: #cbd5e1;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
	}

	.card-top-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.badge-tag {
		background: #ecfdf5;
		color: var(--color-brand-primary);
		border: 1px solid #a7f3d0;
		font-size: 11px;
		font-weight: 700;
		padding: 3px 8px;
		border-radius: var(--radius-full);
	}

	.heart-btn {
		background: #f8fafc;
		border: 1px solid var(--border-subtle);
		width: 32px;
		height: 32px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.heart-btn:hover {
		background: #fff1f2;
		border-color: #fecdd3;
	}

	.card-main-info {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.dish-name {
		font-size: 16px;
		font-weight: 800;
		color: var(--text-main);
		margin: 0;
		line-height: 1.3;
	}

	.dish-desc {
		font-size: 13px;
		color: var(--text-muted);
		line-height: 1.45;
		margin: 0;
	}

	.side-companion-box {
		background: #fffbeb;
		border: 1px solid #fef3c7;
		border-radius: var(--radius-md);
		padding: 6px 10px;
		font-size: 12px;
		display: flex;
		gap: 6px;
		align-items: baseline;
	}

	.companion-tag {
		font-weight: 800;
		color: #b45309;
		white-space: nowrap;
	}

	.companion-text {
		color: #78350f;
	}

	.card-meta-row {
		display: flex;
		align-items: center;
		gap: 14px;
		font-size: 12px;
		color: #64748b;
		padding-top: 4px;
		border-top: 1px solid #f1f5f9;
	}

	.meta-item {
		display: inline-flex;
		align-items: center;
		gap: 4px;
	}

	.meta-price {
		margin-left: auto;
		font-weight: 800;
		color: var(--color-brand-primary);
		font-size: 14px;
	}

	.card-footer-action {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-top: 6px;
	}

	.pack-info {
		font-size: 12px;
		color: #94a3b8;
		font-weight: 600;
	}

	.add-to-plan-btn {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		background: var(--color-brand-primary);
		color: #ffffff;
		border: none;
		border-radius: var(--radius-full);
		padding: 8px 16px;
		font-size: 12px;
		font-weight: 800;
		cursor: pointer;
		transition: all var(--transition-fast);
		box-shadow: 0 2px 8px rgba(24, 67, 47, 0.2);
	}

	.add-to-plan-btn:hover {
		background: #123324;
		transform: translateY(-1px);
	}

	.add-to-plan-btn:active {
		transform: translateY(0);
	}

	.empty-results-card {
		text-align: center;
		padding: 32px 20px;
		background: #ffffff;
		border-radius: var(--radius-lg);
		border: 1px dashed var(--border-subtle);
		color: var(--text-muted);
		font-size: 14px;
	}

	/* Modal Sheet */
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
		height: 100dvh;
		z-index: 100;
		background: rgba(0, 0, 0, 0.45);
		backdrop-filter: blur(4px);
		-webkit-backdrop-filter: blur(4px);
		display: flex;
		align-items: flex-end;
		justify-content: center;
		padding: 12px;
		padding-bottom: max(16px, env(safe-area-inset-bottom, 16px));
	}

	.modal-sheet {
		background: #ffffff;
		border-radius: 20px;
		width: 100%;
		max-width: 500px;
		padding: 20px;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
		display: flex;
		flex-direction: column;
		gap: 16px;
		max-height: 85dvh;
		overflow-y: auto;
		overscroll-behavior: contain;
	}

	.sheet-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid var(--border-subtle);
		padding-bottom: 12px;
	}

	.sheet-title {
		font-size: 17px;
		font-weight: 800;
		color: var(--text-main);
		margin: 0;
	}

	.sheet-subtitle {
		font-size: 13px;
		color: var(--color-brand-primary);
		font-weight: 700;
	}

	.close-sheet-btn {
		background: #f1f5f9;
		border: none;
		border-radius: 50%;
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		color: #64748b;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.form-label {
		font-size: 13px;
		font-weight: 800;
		color: var(--text-main);
	}

	.days-pill-grid {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 6px;
	}

	.day-btn {
		padding: 10px 4px;
		border-radius: var(--radius-md);
		border: 1.5px solid var(--border-subtle);
		background: #ffffff;
		font-size: 12px;
		font-weight: 800;
		color: var(--text-main);
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.day-btn.selected {
		background: var(--color-brand-primary);
		border-color: var(--color-brand-primary);
		color: #ffffff;
	}

	.meals-pill-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 8px;
	}

	.meal-btn {
		padding: 12px 14px;
		border-radius: var(--radius-md);
		border: 1.5px solid var(--border-subtle);
		background: #ffffff;
		font-size: 13px;
		font-weight: 700;
		color: var(--text-main);
		cursor: pointer;
		transition: all var(--transition-fast);
		text-align: center;
	}

	.meal-btn.selected {
		background: #f0fdf4;
		border-color: var(--color-brand-primary);
		color: var(--color-brand-primary);
		font-weight: 800;
	}

	.sheet-footer {
		display: flex;
		gap: 10px;
		padding-top: 8px;
	}

	.btn-cancel {
		flex: 1;
		padding: 12px;
		border-radius: var(--radius-full);
		border: 1.5px solid var(--border-subtle);
		background: #ffffff;
		font-size: 13px;
		font-weight: 700;
		color: var(--text-muted);
		cursor: pointer;
	}

	.btn-confirm {
		flex: 2;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		padding: 12px;
		border-radius: var(--radius-full);
		border: none;
		background: var(--color-brand-primary);
		color: #ffffff;
		font-size: 13px;
		font-weight: 800;
		cursor: pointer;
	}
</style>
