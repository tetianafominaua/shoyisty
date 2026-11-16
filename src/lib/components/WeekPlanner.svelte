<script lang="ts">
	import { planner } from '#lib/stores/planner.svelte';
	import { DAYS_LIST, MEALS_LIST } from '#lib/data/constants';
	import { READY_MADE_SETS } from '#lib/data/sets';
	import { t } from '#lib/i18n/translations';
	import type { DayKey, MealKey, Dish } from '#lib/types';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import Sun from '@lucide/svelte/icons/sun';
	import Soup from '@lucide/svelte/icons/soup';
	import Utensils from '@lucide/svelte/icons/utensils';
	import Cookie from '@lucide/svelte/icons/cookie';
	import Clock from '@lucide/svelte/icons/clock';
	import Users from '@lucide/svelte/icons/users';
	import Plus from '@lucide/svelte/icons/plus';
	import MoreHorizontal from '@lucide/svelte/icons/more-horizontal';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import Edit2 from '@lucide/svelte/icons/edit-2';
	import Sparkles from '@lucide/svelte/icons/sparkles';
	import Calendar from '@lucide/svelte/icons/calendar';
	import X from '@lucide/svelte/icons/x';

	const activeDay = $derived(planner.selectedDay);
	const activeDayIndex = $derived(DAYS_LIST.findIndex((d) => d.key === activeDay));
	const dayPlan = $derived(planner.week[activeDay]);
	const locale = $derived(planner.locale);

	// Modals
	let showDayPresetModal = $state(false);
	let showWeekPresetModal = $state(false);
	let dishActionMenu = $state<{ meal: MealKey; dish: Dish; index: number } | null>(null);

	// Horizontal calendar day numbers (starting from current date)
	const weekDates = $derived.by(() => {
		const now = new Date();
		// Find Monday of current week
		const dayOfWeek = now.getDay(); // 0 is Sun, 1 is Mon
		const distanceToMon = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
		const mondayDate = new Date(now);
		mondayDate.setDate(now.getDate() + distanceToMon);

		return DAYS_LIST.map((day, idx) => {
			const d = new Date(mondayDate);
			d.setDate(mondayDate.getDate() + idx);
			return {
				...day,
				dateNum: d.getDate(),
				isToday: d.toDateString() === now.toDateString()
			};
		});
	});

	function selectDay(key: DayKey) {
		planner.selectedDay = key;
	}

	function prevDay() {
		const nextIdx = (activeDayIndex - 1 + DAYS_LIST.length) % DAYS_LIST.length;
		planner.selectedDay = DAYS_LIST[nextIdx].key;
	}

	function nextDay() {
		const nextIdx = (activeDayIndex + 1) % DAYS_LIST.length;
		planner.selectedDay = DAYS_LIST[nextIdx].key;
	}

	function openDishPicker(mealKey: MealKey, replaceIndex?: number) {
		planner.activeModal = { day: activeDay, meal: mealKey, replaceIndex };
	}

	function removeMeal(mealKey: MealKey, index: number) {
		planner.removeDishAt(activeDay, mealKey, index);
		dishActionMenu = null;
	}

	function replaceMeal(mealKey: MealKey, index: number) {
		dishActionMenu = null;
		openDishPicker(mealKey, index);
	}

	function applyDayPreset(presetId: 'classic' | 'express' | 'light') {
		planner.loadDayPreset(activeDay, presetId);
		showDayPresetModal = false;
	}

	function applyWeekPreset(setId: string) {
		planner.loadSet(setId);
		showWeekPresetModal = false;
	}
</script>

{#snippet mealIcon(key: string, size = 18)}
	{#if key === 'breakfast'}
		<Sun {size} color="#f59e0b" />
	{:else if key === 'lunch'}
		<Soup {size} color="#ea580c" />
	{:else if key === 'dinner'}
		<Utensils {size} color="#18432f" />
	{:else}
		<Cookie {size} color="#b45309" />
	{/if}
{/snippet}

<div class="planner-screen-container animate-fade-in">
	<!-- Top Month / Navigation Bar (as in reference) -->
	<div class="month-selector-bar">
		<button class="arrow-nav-btn" onclick={prevDay} aria-label="Попередній день">
			<ChevronLeft size={22} />
		</button>
		<div class="month-label-wrap">
			<span class="month-year-title">{t('week.monthLabel', locale)}</span>
		</div>
		<button class="arrow-nav-btn" onclick={nextDay} aria-label="Наступний день">
			<ChevronRight size={22} />
		</button>
	</div>

	<!-- Horizontal Day Scrubber (as in reference: Sun 15, Mon 16...) -->
	<div class="day-scrubber-bar" role="tablist">
		{#each weekDates as d (d.key)}
			{@const isSelected = activeDay === d.key}
			<button
				type="button"
				class="scrubber-pill"
				class:selected={isSelected}
				onclick={() => selectDay(d.key)}
				aria-selected={isSelected}
				role="tab"
			>
				<span class="scrubber-day-name">{d.shortName}</span>
				<span class="scrubber-date-circle" class:is-today={d.isToday}>
					{d.dateNum}
				</span>
			</button>
		{/each}
	</div>

	<!-- Meal Slots (Breakfast, Lunch, Dinner, Snack) -->
	<div class="meal-slots-column">
		{#each MEALS_LIST as meal (meal.key)}
			{@const dishIds = dayPlan ? (dayPlan[meal.key] ?? []) : []}

			<div class="meal-slot-group">
				{#if dishIds.length === 0}
					<!-- Single clean clickable row for empty meal slot -->
					<button
						type="button"
						class="meal-slot-empty-row"
						onclick={() => openDishPicker(meal.key)}
						aria-label="Додати {meal.label}"
					>
						<div class="slot-title-left">
							<span class="slot-icon-box">
								{@render mealIcon(meal.key, 18)}
							</span>
							<span class="slot-name">{meal.label}</span>
						</div>

						<span class="add-meal-icon-circle">
							<Plus size={18} strokeWidth={2.5} />
						</span>
					</button>
				{:else}
					<!-- Header for meal slot with dishes -->
					<div class="meal-slot-header">
						<div class="slot-title-left">
							<span class="slot-icon-box">
								{@render mealIcon(meal.key, 18)}
							</span>
							<span class="slot-name">{meal.label}</span>
							<span class="slot-count-badge">{dishIds.length}</span>
						</div>

						<button
							type="button"
							class="add-meal-icon-btn"
							onclick={() => openDishPicker(meal.key)}
							aria-label="Додати до {meal.label}"
							title="Додати страву"
						>
							<Plus size={18} strokeWidth={2.5} />
						</button>
					</div>

					<div class="meal-dishes-stack">
						{#each dishIds as dishId, idx (`${dishId}-${idx}`)}
							{@const dish = planner.getDish(dishId)}
							{#if dish}
								<!-- Dish Card (styled like reference) -->
								<div class="dish-plan-card animate-scale-in">
									<div class="dish-card-banner">
										<span class="dish-badge">{dish.galyaProduct?.badge || 'Ручна ліпка'}</span>
										<span class="dish-price-tag">~{dish.galyaProduct?.priceUah} ₴</span>
									</div>

									<div class="dish-card-content">
										<div class="dish-header-row">
											<h4 class="dish-title">{dish.name}</h4>
											<button
												class="dish-menu-trigger"
												onclick={() => (dishActionMenu = { meal: meal.key, dish, index: idx })}
												aria-label="Дії зі стравою"
											>
												<MoreHorizontal size={18} />
											</button>
										</div>

										{#if dish.sideCompanion}
											<div class="dish-side-info">
												<span class="side-label">Гарнір / Докупити:</span>
												<span class="side-value">{dish.sideCompanion}</span>
											</div>
										{/if}

										<div class="dish-meta-row">
											<span class="meta-tag">
												<Clock size={13} />
												<span>{dish.prepTimeMinutes} {t('common.minutes', locale)}</span>
											</span>
											<span class="meta-tag">
												<Users size={13} />
												<span>{dish.servings} {t('common.servings', locale)}</span>
											</span>
											<span class="meta-tag pack-tag">
												{dish.galyaProduct?.weightText}
											</span>
										</div>
									</div>
								</div>
							{/if}
						{/each}
					</div>
				{/if}
			</div>
		{/each}
	</div>

	<!-- Divider & Quick Sets Section (User's specific requirement!) -->
	<div class="quick-sets-divider"></div>

	<section class="quick-sets-section">
		<div class="sets-section-title-row">
			<Sparkles size={16} color="var(--color-brand-primary)" />
			<h3 class="sets-section-title">{t('week.quickSetsTitle', locale)}</h3>
		</div>

		<div class="sets-buttons-grid">
			<!-- Button 1: Набір на день -->
			<button class="set-action-card" onclick={() => (showDayPresetModal = true)}>
				<div class="set-icon-bubble day-bubble">
					<Sun size={20} color="#b45309" />
				</div>
				<div class="set-card-texts">
					<strong class="set-card-title">{t('week.setForDay', locale)}</strong>
					<span class="set-card-sub">{t('week.setForDaySub', locale)}</span>
				</div>
				<Plus size={16} class="set-arrow" />
			</button>

			<!-- Button 2: Набір на тиждень -->
			<button class="set-action-card" onclick={() => (showWeekPresetModal = true)}>
				<div class="set-icon-bubble week-bubble">
					<Calendar size={20} color="var(--color-brand-primary)" />
				</div>
				<div class="set-card-texts">
					<strong class="set-card-title">{t('week.setForWeek', locale)}</strong>
					<span class="set-card-sub">{t('week.setForWeekSub', locale)}</span>
				</div>
				<Sparkles size={16} class="set-arrow" />
			</button>
		</div>
	</section>
</div>

<!-- Action Sheet for Dish (Edit / Remove) -->
{#if dishActionMenu}
	<div
		class="modal-backdrop animate-fade-in"
		onclick={() => (dishActionMenu = null)}
		onkeydown={(e) => {
			if (e.key === 'Escape') dishActionMenu = null;
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
			<div class="sheet-top-title">
				<h4>«{dishActionMenu.dish.name}»</h4>
				<button class="sheet-close" onclick={() => (dishActionMenu = null)} aria-label="Закрити">
					<X size={18} />
				</button>
			</div>

			<div class="sheet-actions-list">
				<button
					class="sheet-action-item"
					onclick={() => replaceMeal(dishActionMenu!.meal, dishActionMenu!.index)}
				>
					<Edit2 size={16} />
					<span>{t('week.replaceDish', locale)}</span>
				</button>
				<button
					class="sheet-action-item danger"
					onclick={() => removeMeal(dishActionMenu!.meal, dishActionMenu!.index)}
				>
					<Trash2 size={16} />
					<span>{t('week.removeDish', locale)}</span>
				</button>
			</div>
		</div>
	</div>
{/if}

<!-- Modal: Набір на день -->
{#if showDayPresetModal}
	<div
		class="modal-backdrop animate-fade-in"
		onclick={() => (showDayPresetModal = false)}
		onkeydown={(e) => {
			if (e.key === 'Escape') showDayPresetModal = false;
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
			<div class="sheet-top-title">
				<h4>{t('week.setForDay', locale)}</h4>
				<button
					class="sheet-close"
					onclick={() => (showDayPresetModal = false)}
					aria-label="Закрити"
				>
					<X size={18} />
				</button>
			</div>

			<p class="preset-help-text">Оберіть готове меню на 4 прийоми їжі для поточного дня:</p>

			<div class="presets-choice-list">
				<button class="preset-item-card" onclick={() => applyDayPreset('classic')}>
					<div class="preset-card-head">
						<strong>Класичний домашній</strong>
						<span class="tag-accent">Хіт</span>
					</div>
					<span class="preset-menu-preview">
						Сирники • Борщ український • Котлета по-київськи • Млинці з вишнею
					</span>
				</button>

				<button class="preset-item-card" onclick={() => applyDayPreset('express')}>
					<div class="preset-card-head">
						<strong>Швидкий експрес (15 хв)</strong>
						<span class="tag-accent">Швидко</span>
					</div>
					<span class="preset-menu-preview">
						Хачапурі • Гороховий суп • Пельмені класичні • Чебурек кримський
					</span>
				</button>

				<button class="preset-item-card" onclick={() => applyDayPreset('light')}>
					<div class="preset-card-head">
						<strong>Легкий та дитячий</strong>
						<span class="tag-accent">Корисно</span>
					</div>
					<span class="preset-menu-preview">
						Вареники з сиром • Суп з фрикадельками кролика • Вареники з картоплею • Млинці з куркою
					</span>
				</button>
			</div>
		</div>
	</div>
{/if}

<!-- Modal: Набір на тиждень -->
{#if showWeekPresetModal}
	<div
		class="modal-backdrop animate-fade-in"
		onclick={() => (showWeekPresetModal = false)}
		onkeydown={(e) => {
			if (e.key === 'Escape') showWeekPresetModal = false;
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
			<div class="sheet-top-title">
				<h4>{t('week.setForWeek', locale)}</h4>
				<button
					class="sheet-close"
					onclick={() => (showWeekPresetModal = false)}
					aria-label="Закрити"
				>
					<X size={18} />
				</button>
			</div>

			<p class="preset-help-text">
				Завантажте повне меню на 7 днів (Пн–Нд). Усі 21 страву буде розкладено по днях:
			</p>

			<div class="presets-choice-list">
				{#each READY_MADE_SETS as set (set.id)}
					<button class="preset-item-card" onclick={() => applyWeekPreset(set.id)}>
						<div class="preset-card-head">
							<strong>{set.title}</strong>
							<span class="tag-accent">{set.badge}</span>
						</div>
						<span class="preset-menu-desc">{set.subtitle}</span>
						<span class="preset-menu-ideal">{set.idealFor}</span>
					</button>
				{/each}
			</div>
		</div>
	</div>
{/if}

<style>
	.planner-screen-container {
		padding: 16px 16px 90px 16px;
		max-width: 540px;
		margin: 0 auto;
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	/* Month Selector Bar (Reference style) */
	.month-selector-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 6px 4px;
	}

	.arrow-nav-btn {
		background: transparent;
		border: none;
		color: #334155;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		border-radius: 50%;
		transition: all var(--transition-fast);
	}

	.arrow-nav-btn:hover {
		background: #f1f5f9;
	}

	.month-label-wrap {
		display: flex;
		align-items: baseline;
		gap: 8px;
	}

	.month-year-title {
		font-family: var(--font-display, inherit);
		font-size: 22px;
		font-weight: 800;
		color: #c25e2e;
		letter-spacing: -0.01em;
	}

	/* Day Scrubber Bar */
	.day-scrubber-bar {
		display: flex;
		justify-content: space-between;
		gap: 4px;
		padding-bottom: 6px;
	}

	.scrubber-pill {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		background: transparent;
		border: none;
		cursor: pointer;
		padding: 6px 2px;
		border-radius: var(--radius-md);
		transition: all var(--transition-fast);
	}

	.scrubber-day-name {
		font-size: 11px;
		font-weight: 700;
		color: #94a3b8;
		text-transform: uppercase;
	}

	.scrubber-date-circle {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 15px;
		font-weight: 800;
		color: var(--text-main);
		transition: all var(--transition-fast);
	}

	.scrubber-pill.selected .scrubber-date-circle {
		background: var(--color-brand-primary);
		color: #ffffff;
		box-shadow: 0 4px 12px rgba(24, 67, 47, 0.3);
	}

	.scrubber-pill.selected .scrubber-day-name {
		color: var(--color-brand-primary);
		font-weight: 800;
	}

	.scrubber-date-circle.is-today:not(.selected) {
		border: 2px solid var(--color-brand-primary);
	}

	/* Meal Slots Column */
	.meal-slots-column {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.meal-slot-group {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.meal-slot-empty-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 10px 14px;
		background: #ffffff;
		border: 1px solid var(--border-subtle);
		border-radius: var(--radius-lg);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
		cursor: pointer;
		width: 100%;
		text-align: left;
		transition: all var(--transition-fast);
	}

	.meal-slot-empty-row:hover {
		border-color: var(--color-brand-primary);
		background: #f0fdf4;
	}

	.meal-slot-empty-row:hover .add-meal-icon-circle {
		background: var(--color-brand-primary);
		border-color: var(--color-brand-primary);
		color: #ffffff;
	}

	.meal-slot-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 4px 6px;
	}

	.slot-title-left {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.slot-icon-box {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.slot-name {
		font-size: 15px;
		font-weight: 700;
		color: var(--text-main);
	}

	.slot-count-badge {
		font-size: 11px;
		font-weight: 700;
		color: var(--color-brand-primary);
		background: #dcfce7;
		padding: 2px 7px;
		border-radius: var(--radius-full);
	}

	.meal-dishes-stack {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.add-meal-icon-circle,
	.add-meal-icon-btn {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		border: 1.5px solid #cbd5e1;
		background: #ffffff;
		color: #475569;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.add-meal-icon-btn:hover {
		background: #f0fdf4;
		border-color: var(--color-brand-primary);
		color: var(--color-brand-primary);
	}

	/* Dish Plan Card (styled like reference) */
	.dish-plan-card {
		background: #ffffff;
		border-radius: var(--radius-lg);
		border: 1.5px solid var(--border-subtle);
		overflow: hidden;
		box-shadow: 0 3px 14px rgba(0, 0, 0, 0.04);
		transition: all var(--transition-fast);
	}

	.dish-plan-card:hover {
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.07);
	}

	.dish-card-banner {
		height: 48px;
		background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 14px;
		border-bottom: 1px solid rgba(24, 67, 47, 0.1);
	}

	.dish-badge {
		font-size: 11px;
		font-weight: 800;
		color: var(--color-brand-primary);
		background: #ffffff;
		padding: 3px 8px;
		border-radius: var(--radius-full);
	}

	.dish-price-tag {
		font-size: 13px;
		font-weight: 800;
		color: var(--color-brand-primary);
	}

	.dish-card-content {
		padding: 14px 14px 12px 14px;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.dish-header-row {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 10px;
	}

	.dish-title {
		font-size: 16px;
		font-weight: 800;
		color: var(--text-main);
		margin: 0;
		line-height: 1.3;
	}

	.dish-menu-trigger {
		background: #f8fafc;
		border: 1px solid var(--border-subtle);
		width: 30px;
		height: 30px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #64748b;
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.dish-menu-trigger:hover {
		background: #f1f5f9;
		color: var(--text-main);
	}

	.dish-side-info {
		background: #fffbeb;
		border: 1px solid #fef3c7;
		border-radius: var(--radius-sm);
		padding: 5px 8px;
		font-size: 11px;
		display: flex;
		gap: 6px;
	}

	.side-label {
		font-weight: 800;
		color: #b45309;
	}

	.side-value {
		color: #78350f;
	}

	.dish-meta-row {
		display: flex;
		align-items: center;
		gap: 12px;
		font-size: 12px;
		color: #64748b;
		padding-top: 4px;
	}

	.meta-tag {
		display: inline-flex;
		align-items: center;
		gap: 4px;
	}

	.pack-tag {
		margin-left: auto;
		color: #94a3b8;
		font-size: 11px;
	}

	/* Quick Sets Section */
	.quick-sets-divider {
		height: 1px;
		background: var(--border-subtle);
		margin: 8px 0;
	}

	.quick-sets-section {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.sets-section-title-row {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.sets-section-title {
		font-size: 14px;
		font-weight: 800;
		color: var(--text-main);
		margin: 0;
	}

	.sets-buttons-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 10px;
	}

	.set-action-card {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 14px 16px;
		border-radius: var(--radius-lg);
		background: #ffffff;
		border: 1.5px solid var(--border-subtle);
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
		cursor: pointer;
		text-align: left;
		transition: all var(--transition-fast);
	}

	.set-action-card:hover {
		border-color: var(--color-brand-primary);
		transform: translateY(-2px);
		box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
	}

	.set-icon-bubble {
		width: 40px;
		height: 40px;
		border-radius: var(--radius-md);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.day-bubble {
		background: #fef3c7;
	}

	.week-bubble {
		background: #dcfce7;
	}

	.set-card-texts {
		display: flex;
		flex-direction: column;
		gap: 2px;
		flex: 1;
	}

	.set-card-title {
		font-size: 14px;
		font-weight: 800;
		color: var(--text-main);
	}

	.set-card-sub {
		font-size: 12px;
		color: var(--text-muted);
	}

	:global(.set-arrow) {
		color: #94a3b8;
	}

	/* Modal Sheets */
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		width: 100vw;
		height: 100vh;
		z-index: 100;
		background: rgba(0, 0, 0, 0.45);
		backdrop-filter: blur(4px);
		display: flex;
		align-items: flex-end;
		justify-content: center;
	}

	.modal-sheet {
		background: #ffffff;
		border-radius: 20px 20px 0 0;
		width: 100%;
		max-width: 500px;
		padding: 20px 20px max(24px, env(safe-area-inset-bottom)) 20px;
		box-shadow: 0 -8px 30px rgba(0, 0, 0, 0.15);
		display: flex;
		flex-direction: column;
		gap: 14px;
		max-height: 85vh;
		overflow-y: auto;
		overscroll-behavior: contain;
	}

	.sheet-top-title {
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid var(--border-subtle);
		padding-bottom: 12px;
	}

	.sheet-top-title h4 {
		font-size: 16px;
		font-weight: 800;
		color: var(--text-main);
		margin: 0;
	}

	.sheet-close {
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

	.sheet-actions-list {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.sheet-action-item {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 14px;
		border-radius: var(--radius-md);
		border: 1px solid var(--border-subtle);
		background: #ffffff;
		font-size: 14px;
		font-weight: 700;
		color: var(--text-main);
		cursor: pointer;
	}

	.sheet-action-item:hover {
		background: #f8fafc;
	}

	.sheet-action-item.danger {
		color: #ef4444;
		border-color: #fee2e2;
		background: #fff5f5;
	}

	.preset-help-text {
		font-size: 13px;
		color: var(--text-muted);
		margin: 0;
		line-height: 1.4;
	}

	.presets-choice-list {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.preset-item-card {
		display: flex;
		flex-direction: column;
		gap: 6px;
		padding: 14px;
		border-radius: var(--radius-md);
		border: 1.5px solid var(--border-subtle);
		background: #ffffff;
		text-align: left;
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.preset-item-card:hover {
		border-color: var(--color-brand-primary);
		background: #f0fdf4;
	}

	.preset-card-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.tag-accent {
		font-size: 11px;
		font-weight: 800;
		background: #ecfdf5;
		color: var(--color-brand-primary);
		padding: 2px 8px;
		border-radius: var(--radius-full);
	}

	.preset-menu-preview {
		font-size: 12px;
		color: #64748b;
		line-height: 1.4;
	}

	.preset-menu-desc {
		font-size: 12px;
		color: #475569;
	}

	.preset-menu-ideal {
		font-size: 11px;
		color: #94a3b8;
		font-style: italic;
	}
</style>
