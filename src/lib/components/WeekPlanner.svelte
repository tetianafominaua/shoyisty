<script lang="ts">
	import { planner } from '#lib/stores/planner.svelte';
	import { DAYS_LIST, MEALS_LIST } from '#lib/data/constants';
	import type { DayKey, MealKey } from '#lib/types';

	const activeDay = $derived(planner.selectedDay);
	const activeDayInfo = $derived(DAYS_LIST.find((d) => d.key === activeDay) || DAYS_LIST[0]);
	const dayPlan = $derived(planner.week[activeDay]);

	function selectDay(dayKey: DayKey) {
		planner.selectedDay = dayKey;
	}

	function openDishPicker(mealKey: MealKey) {
		planner.activeModal = { day: activeDay, meal: mealKey };
	}

	function removeDish(mealKey: MealKey) {
		planner.setDish(activeDay, mealKey, null);
	}

	function nextDay() {
		const currentIndex = DAYS_LIST.findIndex((d) => d.key === activeDay);
		const nextIndex = (currentIndex + 1) % DAYS_LIST.length;
		planner.selectedDay = DAYS_LIST[nextIndex].key;
	}

	function prevDay() {
		const currentIndex = DAYS_LIST.findIndex((d) => d.key === activeDay);
		const prevIndex = (currentIndex - 1 + DAYS_LIST.length) % DAYS_LIST.length;
		planner.selectedDay = DAYS_LIST[prevIndex].key;
	}
</script>

<div class="week-planner-container animate-fade-in">
	<!-- Header Titles -->
	<div class="planner-header">
		<div class="header-titles">
			<h2 class="planner-title">Конструктор на тиждень</h2>
			<p class="planner-subtitle">
				Обирай день тижня та наповнюй сніданки, обіди і вечері.
			</p>
		</div>
	</div>

	<!-- 7 Days Button Menu (Понеділок .. Неділя) -->
	<nav class="days-nav-bar" aria-label="Вибір дня тижня">
		{#each DAYS_LIST as day}
			{@const count = planner.getDayDishesCount(day.key)}
			{@const isActive = activeDay === day.key}

			<button
				class="day-nav-btn"
				class:active={isActive}
				class:complete={count === 3}
				onclick={() => selectDay(day.key)}
				aria-label={day.fullName}
			>
				<span class="day-short">{day.shortName}</span>
				<div class="day-status-dots">
					<span class="mini-dot" class:filled={!!planner.week[day.key].breakfast}></span>
					<span class="mini-dot" class:filled={!!planner.week[day.key].lunch}></span>
					<span class="mini-dot" class:filled={!!planner.week[day.key].dinner}></span>
				</div>
			</button>
		{/each}
	</nav>

	<!-- Current Day Status Banner -->
	<div class="current-day-banner">
		<div class="day-banner-left">
			<button class="nav-arrow-btn" onclick={prevDay} aria-label="Попередній день">&lsaquo;</button>
			<div class="day-heading-box">
				<span class="day-emoji">{activeDayInfo.accentEmoji}</span>
				<div>
					<h3 class="day-title">{activeDayInfo.fullName}</h3>
					<span class="day-status-text">
						Заповнено {planner.getDayDishesCount(activeDay)} з 3 страв
					</span>
				</div>
			</div>
			<button class="nav-arrow-btn" onclick={nextDay} aria-label="Наступний день">&rsaquo;</button>
		</div>

		{#if planner.getDayDishesCount(activeDay) > 0}
			<button
				class="clear-day-btn"
				onclick={() => {
					planner.setDish(activeDay, 'breakfast', null);
					planner.setDish(activeDay, 'lunch', null);
					planner.setDish(activeDay, 'dinner', null);
				}}
				title="Очистити страви цього дня"
			>
				Очистити день
			</button>
		{/if}
	</div>

	<!-- 3 Meal Slots: Сніданок, Обід, Вечеря -->
	<div class="meal-slots-list">
		{#each MEALS_LIST as meal}
			{@const dishId = dayPlan[meal.key]}
			{@const dish = planner.getDish(dishId)}

			<div class="meal-slot-wrapper">
				<div class="slot-header">
					<div class="slot-badge">
						<span class="slot-icon">{meal.icon}</span>
						<span class="slot-title">{meal.label}</span>
					</div>
					<span class="slot-time">{meal.suggestedTime}</span>
				</div>

				{#if dish}
					<!-- Filled Dish Card -->
					<div class="filled-dish-card animate-fade-in">
						<div class="dish-card-main">
							<div class="dish-card-left">
								<div class="dish-icon-box">{dish.imageEmoji}</div>
								<div class="dish-info-box">
									<h4 class="dish-heading">{dish.name}</h4>
									<div class="dish-pills-row">
										<span class="dish-pill">⏱️ {dish.prepTimeMinutes} хв</span>
										<span class="dish-pill">🔥 {dish.calories} ккал</span>
									</div>
								</div>
							</div>

							<!-- Action Buttons -->
							<div class="dish-actions">
								<button
									class="icon-action-btn edit"
									onclick={() => openDishPicker(meal.key)}
									title="Замінити страву"
									aria-label="Замінити страву"
								>
									✏️
								</button>
								<button
									class="icon-action-btn delete"
									onclick={() => removeDish(meal.key)}
									title="Видалити"
									aria-label="Видалити страву"
								>
									🗑️
								</button>
							</div>
						</div>

						<!-- Galya Baluvana Badge -->
						{#if dish.isGalyaProduct && dish.galyaProduct}
							<div class="galya-slot-bar">
								<div class="galya-logo-title">
									<span class="galya-icon">🥟</span>
									<strong>Галя Балувана</strong>
									<span class="galya-badge-pill">{dish.galyaProduct.badge}</span>
								</div>
								<div class="galya-details-row">
									<span>{dish.galyaProduct.name}</span> &bull;
									<span>{dish.galyaProduct.weightText}</span> &bull;
									<strong>~{dish.galyaProduct.priceUah} ₴</strong>
								</div>
							</div>
						{/if}

						<!-- Supermarket Ingredients Hint -->
						{#if dish.groceryItems.length > 0}
							<div class="grocery-hint-box">
								<span class="hint-label">🛒 У супермаркет:</span>
								<span class="hint-text">
									{dish.groceryItems.map((g) => g.name).join(', ')}
								</span>
							</div>
						{/if}
					</div>
				{:else}
					<!-- Empty Slot Card -->
					<button
						class="empty-slot-btn"
						onclick={() => openDishPicker(meal.key)}
						aria-label="Обрати страву на {meal.label}"
					>
						<span class="add-circle">+</span>
						<div class="empty-slot-text">
							<strong>Обрати страву на {meal.label.toLowerCase()}</strong>
							<span>{meal.description}</span>
						</div>
					</button>
				{/if}
			</div>
		{/each}
	</div>

	<!-- Bottom Cart Float Action -->
	<div class="planner-bottom-bar">
		<button
			class="btn-primary full-width"
			onclick={() => (planner.activeTab = 'cart')}
			aria-label="Переглянути кошик"
		>
			<span>Переглянути кошик ({planner.totalDishesCount} страв)</span>
			<span>🛒 &rarr;</span>
		</button>
	</div>
</div>

<style>
	.week-planner-container {
		padding: 16px 16px 40px 16px;
		display: flex;
		flex-direction: column;
		gap: 18px;
	}

	.planner-title {
		font-size: 24px;
		font-weight: 800;
		margin-bottom: 4px;
	}

	.planner-subtitle {
		font-size: 13px;
		color: var(--text-muted);
		line-height: 1.4;
	}

	/* 7 Days Button Nav Bar */
	.days-nav-bar {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 6px;
		background: var(--bg-surface-alt);
		padding: 6px;
		border-radius: var(--radius-lg);
		border: 1px solid var(--border-subtle);
	}

	.day-nav-btn {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 10px 2px;
		background: transparent;
		border: 1.5px solid transparent;
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.day-nav-btn:hover {
		background: rgba(255, 255, 255, 0.6);
	}

	.day-nav-btn.active {
		background: #ffffff;
		border-color: var(--color-brand-primary);
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
	}

	.day-short {
		font-size: 14px;
		font-weight: 800;
		color: var(--text-main);
	}

	.day-nav-btn.active .day-short {
		color: var(--color-brand-primary);
	}

	.day-status-dots {
		display: flex;
		gap: 3px;
		margin-top: 5px;
	}

	.mini-dot {
		width: 4px;
		height: 4px;
		border-radius: 50%;
		background: #d1c8b8;
		transition: all var(--transition-fast);
	}

	.mini-dot.filled {
		background: #10b981;
		box-shadow: 0 0 4px rgba(16, 185, 129, 0.4);
	}

	/* Current Day Banner */
	.current-day-banner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: linear-gradient(135deg, #ffffff 0%, var(--bg-surface-alt) 100%);
		border: 1px solid var(--border-subtle);
		border-radius: var(--radius-md);
		padding: 12px 16px;
	}

	.day-banner-left {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.nav-arrow-btn {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		border: 1px solid var(--border-subtle);
		background: #ffffff;
		font-size: 18px;
		line-height: 1;
		font-weight: 700;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--text-main);
		transition: background var(--transition-fast);
	}

	.nav-arrow-btn:hover {
		background: var(--bg-surface-alt);
	}

	.day-heading-box {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.day-emoji {
		font-size: 26px;
	}

	.day-title {
		font-size: 17px;
		font-weight: 800;
		margin: 0;
	}

	.day-status-text {
		font-size: 11px;
		color: var(--text-muted);
		font-weight: 600;
	}

	.clear-day-btn {
		background: none;
		border: none;
		color: #ef4444;
		font-size: 11px;
		font-weight: 700;
		cursor: pointer;
		padding: 4px 8px;
		border-radius: var(--radius-sm);
	}

	.clear-day-btn:hover {
		background: #fef2f2;
	}

	/* Meal Slots */
	.meal-slots-list {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	.meal-slot-wrapper {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.slot-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 4px;
	}

	.slot-badge {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 13px;
		font-weight: 800;
		color: var(--color-brand-primary);
	}

	.slot-icon {
		font-size: 16px;
	}

	.slot-time {
		font-size: 11px;
		font-weight: 600;
		color: var(--text-subtle);
	}

	/* Filled Dish Card */
	.filled-dish-card {
		background: #ffffff;
		border: 1.5px solid var(--border-subtle);
		border-radius: var(--radius-md);
		padding: 14px;
		display: flex;
		flex-direction: column;
		gap: 10px;
		box-shadow: var(--shadow-sm);
	}

	.dish-card-main {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 10px;
	}

	.dish-card-left {
		display: flex;
		gap: 10px;
		align-items: flex-start;
		flex: 1;
	}

	.dish-icon-box {
		width: 42px;
		height: 42px;
		border-radius: 12px;
		background: var(--bg-surface-alt);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24px;
		flex-shrink: 0;
	}

	.dish-info-box {
		flex: 1;
	}

	.dish-heading {
		font-size: 14px;
		font-weight: 800;
		line-height: 1.35;
		margin-bottom: 4px;
	}

	.dish-pills-row {
		display: flex;
		gap: 6px;
	}

	.dish-pill {
		font-size: 11px;
		color: var(--text-muted);
		background: var(--bg-surface-alt);
		padding: 2px 7px;
		border-radius: 6px;
		font-weight: 600;
	}

	.dish-actions {
		display: flex;
		gap: 6px;
	}

	.icon-action-btn {
		width: 32px;
		height: 32px;
		border-radius: 8px;
		border: 1px solid var(--border-subtle);
		background: var(--bg-surface-alt);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 14px;
		transition: all var(--transition-fast);
	}

	.icon-action-btn:hover {
		background: #eae2d1;
	}

	.icon-action-btn.delete:hover {
		background: #fee2e2;
		border-color: #fca5a5;
	}

	/* Galya Slot Bar */
	.galya-slot-bar {
		background: #f0fdf4;
		border: 1px solid #bbf7d0;
		border-radius: var(--radius-sm);
		padding: 8px 10px;
		font-size: 11px;
		color: #166534;
	}

	.galya-logo-title {
		display: flex;
		align-items: center;
		gap: 6px;
		margin-bottom: 2px;
	}

	.galya-badge-pill {
		background: #dcfce7;
		padding: 1px 6px;
		border-radius: var(--radius-full);
		font-size: 10px;
		font-weight: 700;
	}

	.galya-details-row {
		color: #15803d;
	}

	/* Grocery Hint Box */
	.grocery-hint-box {
		font-size: 11px;
		color: var(--text-muted);
		background: #fffbeb;
		border-left: 2.5px solid var(--color-brand-accent);
		padding: 5px 8px;
		border-radius: 0 4px 4px 0;
	}

	.hint-label {
		font-weight: 700;
		color: #b45309;
		margin-right: 4px;
	}

	/* Empty Slot Button */
	.empty-slot-btn {
		background: #ffffff;
		border: 1.5px dashed var(--border-subtle);
		border-radius: var(--radius-md);
		padding: 16px;
		display: flex;
		align-items: center;
		gap: 12px;
		cursor: pointer;
		text-align: left;
		transition: all var(--transition-fast);
		width: 100%;
	}

	.empty-slot-btn:hover {
		border-color: var(--color-brand-primary);
		background: rgba(24, 67, 47, 0.02);
	}

	.add-circle {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		background: var(--bg-surface-alt);
		color: var(--color-brand-primary);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 18px;
		font-weight: 800;
		flex-shrink: 0;
	}

	.empty-slot-btn:hover .add-circle {
		background: var(--color-brand-primary);
		color: #ffffff;
	}

	.empty-slot-text strong {
		font-size: 13px;
		color: var(--text-main);
		display: block;
	}

	.empty-slot-text span {
		font-size: 11px;
		color: var(--text-muted);
		display: block;
	}

	/* Bottom Bar */
	.planner-bottom-bar {
		position: sticky;
		bottom: 12px;
		margin-top: 10px;
		z-index: 30;
	}

	.full-width {
		width: 100%;
		padding: 14px 20px;
		font-size: 15px;
		box-shadow: 0 8px 24px rgba(24, 67, 47, 0.35);
	}
</style>
