<script lang="ts">
	import { planner } from '#lib/stores/planner.svelte';
	import { DAYS_LIST, MEALS_LIST, getFamilySizeLabel } from '#lib/data/constants';
	import type { DayKey, MealKey } from '#lib/types';
	import FamilySizeSelector from '#lib/components/FamilySizeSelector.svelte';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import Sun from '@lucide/svelte/icons/sun';
	import Soup from '@lucide/svelte/icons/soup';
	import Utensils from '@lucide/svelte/icons/utensils';
	import Clock from '@lucide/svelte/icons/clock';
	import Flame from '@lucide/svelte/icons/flame';
	import Users from '@lucide/svelte/icons/users';
	import Edit2 from '@lucide/svelte/icons/edit-2';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import ChefHat from '@lucide/svelte/icons/chef-hat';
	import ShoppingCart from '@lucide/svelte/icons/shopping-cart';
	import Plus from '@lucide/svelte/icons/plus';

	const activeDay = $derived(planner.selectedDay);
	const activeDayInfo = $derived(DAYS_LIST.find((d) => d.key === activeDay) || DAYS_LIST[0]);
	const dayPlan = $derived(planner.week[activeDay]);
	const cart = $derived(planner.getCartGrouped());

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

{#snippet mealIcon(key: string, size = 16)}
	{#if key === 'breakfast'}
		<Sun {size} />
	{:else if key === 'lunch'}
		<Soup {size} />
	{:else}
		<Utensils {size} />
	{/if}
{/snippet}

<div class="week-planner-container animate-fade-in">
	<!-- Header Titles -->
	<div class="planner-header">
		<div class="header-titles">
			<h2 class="planner-title">Конструктор на тиждень</h2>
			<p class="planner-subtitle">Обирай день тижня та наповнюй сніданки, обіди і вечері.</p>
		</div>
	</div>

	<FamilySizeSelector subtitle="У кошику порахуємо упаковки для обраної родини" />

	<!-- 7 Days Button Menu (Понеділок .. Неділя) -->
	<nav class="days-nav-bar" aria-label="Вибір дня тижня">
		{#each DAYS_LIST as day (day.key)}
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
			<button class="nav-arrow-btn" onclick={prevDay} aria-label="Попередній день">
				<ChevronLeft size={18} />
			</button>
			<div class="day-heading-box">
				<div>
					<h3 class="day-title">{activeDayInfo.fullName}</h3>
					<span class="day-status-text">
						Заповнено {planner.getDayDishesCount(activeDay)} з 3 страв
					</span>
				</div>
			</div>
			<button class="nav-arrow-btn" onclick={nextDay} aria-label="Наступний день">
				<ChevronRight size={18} />
			</button>
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
		{#each MEALS_LIST as meal (meal.key)}
			{@const dishId = dayPlan[meal.key]}
			{@const dish = planner.getDish(dishId)}

			<div class="meal-slot-wrapper">
				<div class="slot-header">
					<div class="slot-badge">
						<span class="slot-icon">
							{@render mealIcon(meal.key, 15)}
						</span>
						<span class="slot-title">{meal.label}</span>
					</div>
					<span class="slot-time">{meal.suggestedTime}</span>
				</div>

				{#if dish}
					<!-- Filled Dish Card -->
					<div class="filled-dish-card animate-fade-in">
						<div class="dish-card-main">
							<div class="dish-card-left">
								<div class="dish-icon-box">
									<Utensils size={20} color="var(--color-brand-primary)" />
								</div>
								<div class="dish-info-box">
									<div class="dish-heading-row">
										<h4 class="dish-heading">{dish.name}</h4>
										{#if dish.sideCompanion}
											<span class="companion-pill">+ {dish.sideCompanion}</span>
										{/if}
									</div>
									<div class="dish-pills-row">
										<span class="dish-pill">
											<Clock size={11} />
											<span>{dish.prepTimeMinutes} хв</span>
										</span>
										<span class="dish-pill">
											<Flame size={11} />
											<span>{dish.calories} ккал</span>
										</span>
										<span class="dish-pill">
											<Users size={11} />
											<span>{dish.servings} порц./уп.</span>
										</span>
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
									<Edit2 size={14} />
								</button>
								<button
									class="icon-action-btn delete"
									onclick={() => removeDish(meal.key)}
									title="Видалити"
									aria-label="Видалити страву"
								>
									<Trash2 size={14} />
								</button>
							</div>
						</div>

						<!-- Galya Baluvana Badge -->
						{#if dish.isGalyaProduct && dish.galyaProduct}
							<div class="galya-slot-bar">
								<div class="galya-logo-title">
									<ChefHat size={14} color="var(--color-brand-primary)" />
									<strong>Галя Балувана</strong>
									<span class="galya-badge-pill">{dish.galyaProduct.badge}</span>
									<span class="galya-pack-rec">
										Для {getFamilySizeLabel(planner.familySize)}: {planner.getDishPackHint(dish)}
									</span>
								</div>
								<div class="galya-details-row">
									<span>{dish.galyaProduct.name}</span> &bull;
									<span>{dish.galyaProduct.weightText}</span> &bull;
									<strong>~{dish.galyaProduct.priceUah} ₴/уп.</strong>
								</div>
								{#if dish.extraGalyaProducts?.length}
									{#each dish.extraGalyaProducts as extra (extra.product.name)}
										<div class="galya-extra-row">
											+ <strong>{extra.product.name}</strong> &bull; {extra.product.weightText} &bull;
											~{extra.product.priceUah} ₴/уп.
										</div>
									{/each}
								{/if}
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
						<span class="add-circle">
							<Plus size={16} />
						</span>
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
			<span>
				Переглянути кошик ({planner.totalDishesCount} страв{#if planner.totalDishesCount > 0}
					&bull; {cart.totalGalyaUnits} уп.{/if})
			</span>
			<ShoppingCart size={16} />
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
		height: 100%;
	}

	@media (min-width: 720px) {
		.meal-slots-list {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 14px;
			align-items: stretch;
		}
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
		flex: 1;
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

	.dish-heading-row {
		display: flex;
		align-items: baseline;
		flex-wrap: wrap;
		gap: 6px;
		margin-bottom: 5px;
	}

	.dish-heading {
		font-size: 14px;
		font-weight: 800;
		line-height: 1.35;
		margin-bottom: 0;
	}

	.companion-pill {
		display: inline-flex;
		align-items: center;
		font-size: 11.5px;
		font-weight: 600;
		color: #92400e;
		background: #fef3c7;
		border: 1px solid #fde68a;
		padding: 1px 7px;
		border-radius: 6px;
		line-height: 1.25;
	}

	.slot-icon {
		display: flex;
		align-items: center;
		color: var(--color-brand-primary);
	}

	.dish-pills-row {
		display: flex;
		flex-wrap: wrap;
		gap: 5px;
	}

	.dish-pill {
		display: inline-flex;
		align-items: center;
		gap: 3px;
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
		flex-wrap: wrap;
		gap: 6px;
		margin-bottom: 3px;
	}

	.galya-logo-title strong {
		white-space: nowrap;
		flex-shrink: 0;
	}

	.galya-badge-pill {
		background: #dcfce7;
		padding: 1px 6px;
		border-radius: var(--radius-full);
		font-size: 10px;
		font-weight: 700;
	}

	.galya-pack-rec {
		margin-left: auto;
		font-size: 10.5px;
		font-weight: 800;
		color: #14532d;
		background: #ffffff;
		border: 1px solid #bbf7d0;
		padding: 1px 7px;
		border-radius: var(--radius-full);
	}

	.galya-details-row {
		color: #15803d;
	}

	.galya-extra-row {
		margin-top: 3px;
		color: #14532d;
		font-weight: 600;
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
		width: 100%;
		max-width: 540px;
		margin: 10px auto 0 auto;
		z-index: 30;
	}

	.full-width {
		width: 100%;
		padding: 14px 20px;
		font-size: 15px;
		box-shadow: 0 8px 24px rgba(24, 67, 47, 0.35);
	}
</style>
