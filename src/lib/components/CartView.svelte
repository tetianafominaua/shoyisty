<script lang="ts">
	import { planner } from "#lib/stores/planner.svelte";
	import {
		GROCERY_CATEGORIES_UA,
		getFamilySizeLabel,
	} from "#lib/data/constants";
	import FamilySizeSelector from "#lib/components/FamilySizeSelector.svelte";
	import ShoppingCart from "@lucide/svelte/icons/shopping-cart";
	import ShoppingBag from "@lucide/svelte/icons/shopping-bag";
	import Sparkles from "@lucide/svelte/icons/sparkles";
	import Calendar from "@lucide/svelte/icons/calendar";
	import Copy from "@lucide/svelte/icons/copy";
	import Share2 from "@lucide/svelte/icons/share-2";
	import ChefHat from "@lucide/svelte/icons/chef-hat";
	import Check from "@lucide/svelte/icons/check";
	import Info from "@lucide/svelte/icons/info";
	import MapPin from "@lucide/svelte/icons/map-pin";
	import ArrowRight from "@lucide/svelte/icons/arrow-right";
	import Trash2 from "@lucide/svelte/icons/trash-2";
	import Milk from "@lucide/svelte/icons/milk";
	import Carrot from "@lucide/svelte/icons/carrot";
	import Croissant from "@lucide/svelte/icons/croissant";
	import Package from "@lucide/svelte/icons/package";
	import Flame from "@lucide/svelte/icons/flame";
	import Minus from "@lucide/svelte/icons/minus";
	import Plus from "@lucide/svelte/icons/plus";
	import RotateCcw from "@lucide/svelte/icons/rotate-ccw";

	const cart = $derived(planner.getCartGrouped());

	async function copyToClipboard() {
		const text = planner.generateTelegramText();
		try {
			if (navigator.clipboard && window.isSecureContext) {
				await navigator.clipboard.writeText(text);
			} else {
				// Fallback
				const textArea = document.createElement("textarea");
				textArea.value = text;
				textArea.style.position = "fixed";
				textArea.style.left = "-9999px";
				document.body.appendChild(textArea);
				textArea.focus();
				textArea.select();
				document.execCommand("copy");
				document.body.removeChild(textArea);
			}
			planner.showToast(
				"Список скопійовано! Вставте у Telegram або Viber",
			);
		} catch (e) {
			console.error("Copy failed", e);
			planner.showToast("Помилка копіювання. Спробуйте вручну.");
		}
	}

	async function shareList() {
		const text = planner.generateTelegramText();
		if (navigator.share) {
			try {
				await navigator.share({
					title: "Список покупок «Галя Балувана»",
					text: text,
				});
			} catch (e) {
				// User cancelled share
			}
		} else {
			copyToClipboard();
		}
	}
</script>

{#snippet categoryIcon(catKey: string, size = 15)}
	{#if catKey === "dairy"}
		<Milk {size} />
	{:else if catKey === "produce"}
		<Carrot {size} />
	{:else if catKey === "bakery"}
		<Croissant {size} />
	{:else if catKey === "grocery"}
		<Package {size} />
	{:else if catKey === "sauces"}
		<Flame {size} />
	{:else}
		<ShoppingBag {size} />
	{/if}
{/snippet}

<div class="cart-container animate-fade-in">
	<!-- Cart Top Header -->
	<div class="cart-header">
		<div class="header-titles">
			<h2 class="cart-title">Кошик на тиждень</h2>
			<p class="cart-subtitle">
				Два списки: що придбати у «Галя Балувана», і що докупити у
				супермаркеті.
			</p>
		</div>
	</div>

	{#if planner.totalDishesCount === 0}
		<!-- Empty State -->
		<div class="cart-empty-card">
			<div class="empty-icon">
				<ShoppingCart size={40} color="var(--color-brand-primary)" />
			</div>
			<h3>Ваш кошик ще порожній</h3>
			<p>
				Оберіть один із готових наборів або додайте страви у
				планувальник по днях тижня.
			</p>
			<div class="empty-actions">
				<button
					class="btn-primary"
					onclick={() => (planner.activeTab = "sets")}
				>
					<span>Обрати готовий набір</span>
					<Sparkles size={16} />
				</button>
				<button
					class="btn-secondary"
					onclick={() => (planner.activeTab = "week")}
				>
					<span>Скласти по днях</span>
					<Calendar size={16} />
				</button>
			</div>
		</div>
	{:else}
		<FamilySizeSelector
			subtitle="Змінюйте кількість осіб або підкоригуйте упаковки вручну"
		/>

		<!-- Summary Top Bar -->
		<div class="summary-top-card">
			<div class="summary-stat">
				<span class="stat-label">Страв у меню:</span>
				<strong class="stat-val">{planner.totalDishesCount} шт</strong>
			</div>
			<div class="summary-divider"></div>
			<div class="summary-stat">
				<span class="stat-label"
					>Для {getFamilySizeLabel(cart.familySize)}:</span
				>
				<strong class="stat-val text-brand"
					>{cart.totalGalyaUnits} уп.</strong
				>
			</div>
			<div class="summary-divider"></div>
			<div class="summary-stat">
				<span class="stat-label">Орієнтовно:</span>
				<strong class="stat-val text-brand"
					>~{cart.totalEstimatedGalyaPrice} ₴</strong
				>
			</div>
		</div>

		<!-- Action Sharing Buttons -->
		<div class="share-actions-row">
			<button class="btn-primary flex-1" onclick={copyToClipboard}>
				<Copy size={16} />
				<span>Скопіювати в Telegram / Viber</span>
			</button>

			<button
				class="btn-secondary"
				onclick={shareList}
				title="Поділитися списком"
			>
				<Share2 size={16} />
				<span>Поділитися</span>
			</button>
		</div>

		<div class="cart-sections-grid">
			<!-- LIST 1: Галя Балувана -->
			<section class="cart-section galya-section">
				<div class="section-header">
					<div class="section-title-box">
						<span class="section-icon">
							<ChefHat
								size={20}
								color="var(--color-brand-primary)"
							/>
						</span>
						<div>
							<h3 class="section-title">
								1. Придбати в «Галя Балувана»
							</h3>
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
								aria-label="Позначити купленим {item.product
									.name}"
							>
								<span
									class="check-box"
									class:active={isChecked}
								>
									{#if isChecked}
										<Check size={13} strokeWidth={3} />
									{/if}
								</span>
							</button>

							<div class="item-main-content">
								<div class="item-title-row">
									<span class="item-name"
										>{item.product.name}</span
									>
									<span class="item-total-price"
										>~{item.totalPrice} ₴</span
									>
								</div>

								<div class="item-meta-row">
									<span class="item-badge"
										>{item.product.badge}</span
									>
									<span class="item-pack-info">
										{item.product.weightText} &bull; {item.servingsPerPack}
										порц./уп.
									</span>
								</div>

								<div class="item-portion-calc">
									<span>
										{item.occurrences}
										{item.occurrences === 1
											? "прийом"
											: item.occurrences <= 4
												? "прийоми"
												: "прийомів"} &times; {getFamilySizeLabel(
											cart.familySize,
										)} =
										<strong
											>{item.totalServingsNeeded} порц.</strong
										>
									</span>
								</div>

								<div class="item-stepper-row">
									<div
										class="pack-stepper"
										role="group"
										aria-label="Кількість упаковок {item
											.product.name}"
									>
										<button
											type="button"
											class="stepper-btn"
											disabled={item.count <= 1}
											onclick={() =>
												planner.setPackCount(
													item.product.name,
													item.count - 1,
													item.recommendedCount,
												)}
											aria-label="Зменшити кількість упаковок"
										>
											<Minus size={13} />
										</button>
										<span class="stepper-val"
											>{item.count} уп.</span
										>
										<button
											type="button"
											class="stepper-btn"
											onclick={() =>
												planner.setPackCount(
													item.product.name,
													item.count + 1,
													item.recommendedCount,
												)}
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
													item.recommendedCount,
												)}
											title="Повернути рекомендовану кількість"
										>
											<span
												>Рек.: {item.recommendedCount} уп.</span
											>
											<RotateCcw size={11} />
										</button>
									{:else}
										<span class="rec-match-badge"
											>Рекомендовано</span
										>
									{/if}
								</div>

								<div class="item-dishes-note">
									Для страв: {item.dishesNames.join(", ")}
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
					<button
						class="stores-map-btn"
						onclick={() => (planner.isLocationsOpen = true)}
					>
						<MapPin size={16} />
						<span class="btn-text"
							>Наші 4 магазини на Google Картах</span
						>
						<ArrowRight size={15} />
					</button>
				</div>
			</section>

			<!-- LIST 2: Супермаркет -->
			<section class="cart-section grocery-section">
				<div class="section-header">
					<div class="section-title-box">
						<span class="section-icon">
							<ShoppingBag size={20} color="#b45309" />
						</span>
						<div>
							<h3 class="section-title">
								2. Докупити в супермаркеті
							</h3>
							<span class="section-sub">
								Розрахунок на {getFamilySizeLabel(
									cart.familySize,
								)} (спеції та соуси без множення) &bull; {cart
									.groceryItems.length} поз.
							</span>
						</div>
					</div>
					<span class="supermarket-badge">Супермаркет</span>
				</div>

				<div class="grocery-groups">
					{#if cart.groceryItems.length === 0}
						<div class="empty-grocery-note">
							Обрані страви вже готові або не потребують
							додаткових покупок у супермаркеті.
						</div>
					{:else}
						{#each ["dairy", "produce", "bakery", "grocery", "sauces", "other"] as catKey}
							{@const catItems = cart.groceryItems.filter(
								(i) => i.category === catKey,
							)}
							{#if catItems.length > 0}
								{@const catInfo = GROCERY_CATEGORIES_UA[
									catKey
								] || { label: catKey, icon: "other" }}
								<div class="category-group">
									<div class="category-header">
										<span class="cat-icon">
											{@render categoryIcon(catKey, 14)}
										</span>
										<span class="cat-name"
											>{catInfo.label}</span
										>
										<span class="cat-count"
											>({catItems.length})</span
										>
									</div>

									<div class="category-items">
										{#each catItems as item}
											{@const itemKey = `grocery_${item.name}`}
											{@const isChecked =
												!!planner.checkedItems[itemKey]}

											<div
												class="grocery-item-row"
												class:checked={isChecked}
											>
												<button
													class="checkbox-btn"
													onclick={() =>
														planner.toggleChecked(
															itemKey,
														)}
													aria-label="Позначити купленим {item.name}"
												>
													<span
														class="check-box"
														class:active={isChecked}
													>
														{#if isChecked}
															<Check
																size={13}
																strokeWidth={3}
															/>
														{/if}
													</span>
												</button>

												<div class="grocery-item-text">
													<div
														class="grocery-name-row"
													>
														<span
															class="grocery-name"
															>{item.name}</span
														>
														<span
															class="grocery-amount"
															>{item.amountLabel}</span
														>
													</div>
													<span
														class="grocery-for-dish"
													>
														Для: {item.dishesNames
															.slice(0, 2)
															.join(", ")}{item
															.dishesNames
															.length > 2
															? " та ін."
															: ""}
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
		</div>

		<!-- Bottom Utilities -->
		<div class="cart-bottom-utilities">
			<button class="clear-all-link" onclick={() => planner.clearWeek()}>
				<Trash2 size={14} />
				<span>Очистити весь план на тиждень</span>
			</button>
		</div>
	{/if}
</div>

<style>
	.cart-container {
		padding: 16px 16px 40px 16px;
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.cart-title {
		font-size: 24px;
		font-weight: 800;
		margin-bottom: 4px;
	}

	.cart-subtitle {
		font-size: 13px;
		color: var(--text-muted);
		line-height: 1.4;
	}

	/* Summary Top Bar */
	.summary-top-card {
		display: flex;
		align-items: center;
		justify-content: space-around;
		background: #ffffff;
		border: 1.5px solid var(--border-subtle);
		border-radius: var(--radius-md);
		padding: 14px;
		box-shadow: var(--shadow-sm);
	}

	.summary-stat {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}

	.stat-label {
		font-size: 11px;
		color: var(--text-muted);
	}

	.stat-val {
		font-size: 15px;
		font-weight: 800;
		color: var(--text-main);
	}

	.text-brand {
		color: var(--color-brand-primary);
	}

	.summary-divider {
		width: 1px;
		height: 28px;
		background: var(--border-subtle);
	}

	/* Share Actions */
	.share-actions-row {
		display: flex;
		gap: 10px;
	}

	.flex-1 {
		flex: 1;
	}

	/* Cart Sections */
	.cart-sections-grid {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	@media (min-width: 760px) {
		.cart-sections-grid {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 16px;
			align-items: start;
		}
	}

	.cart-section {
		background: #ffffff;
		border-radius: var(--radius-lg);
		border: 1.5px solid var(--border-subtle);
		overflow: hidden;
		box-shadow: var(--shadow-sm);
	}

	.galya-section {
		border-color: rgba(24, 67, 47, 0.25);
	}

	.section-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		padding: 16px 18px;
		background: var(--bg-surface-alt);
		border-bottom: 1px solid var(--border-subtle);
	}

	.section-title-box {
		display: flex;
		align-items: center;
		gap: 12px;
		min-width: 0;
	}

	.section-icon {
		font-size: 26px;
		flex-shrink: 0;
	}

	.section-title {
		font-size: 16px;
		font-weight: 800;
		color: var(--text-main);
		margin: 0;
	}

	.section-sub {
		font-size: 11px;
		color: var(--text-muted);
		display: block;
	}

	.shop-badge {
		font-size: 11px;
		font-weight: 800;
		color: var(--color-brand-primary);
		background: #dcfce7;
		padding: 4px 10px;
		border-radius: var(--radius-full);
		flex-shrink: 0;
		white-space: nowrap;
	}

	.supermarket-badge {
		font-size: 11px;
		font-weight: 800;
		color: #b45309;
		background: #fef3c7;
		padding: 4px 10px;
		border-radius: var(--radius-full);
		flex-shrink: 0;
		white-space: nowrap;
	}

	/* Items List */
	.items-list {
		display: flex;
		flex-direction: column;
	}

	.cart-item-row {
		display: flex;
		gap: 12px;
		padding: 14px 18px;
		border-bottom: 1px solid var(--border-subtle);
		transition: background var(--transition-fast);
	}

	.cart-item-row:last-child {
		border-bottom: none;
	}

	.cart-item-row.checked {
		background: #fafaf9;
		opacity: 0.6;
	}

	.cart-item-row.checked .item-name {
		text-decoration: line-through;
	}

	.checkbox-btn {
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		margin-top: 2px;
	}

	.check-box {
		width: 22px;
		height: 22px;
		border-radius: 6px;
		border: 2px solid #cbd5e1;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 13px;
		font-weight: 800;
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
		gap: 3px;
	}

	.item-title-row {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 8px;
	}

	.item-name {
		font-size: 14px;
		font-weight: 800;
		color: var(--text-main);
	}

	.item-total-price {
		font-size: 14px;
		font-weight: 800;
		color: var(--color-brand-primary);
		white-space: nowrap;
	}

	.item-meta-row {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		align-items: center;
	}

	.item-badge {
		font-size: 10px;
		font-weight: 700;
		background: rgba(24, 67, 47, 0.08);
		color: var(--color-brand-primary);
		padding: 1px 6px;
		border-radius: 4px;
	}

	.item-pack-info {
		font-size: 11px;
		color: var(--text-muted);
		font-weight: 600;
	}

	.item-portion-calc {
		font-size: 11px;
		color: var(--text-muted);
		margin-top: 2px;
	}

	.item-stepper-row {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 8px;
		margin: 5px 0 3px 0;
	}

	.pack-stepper {
		display: inline-flex;
		align-items: center;
		gap: 2px;
		background: var(--bg-surface-alt);
		border: 1px solid var(--border-subtle);
		border-radius: var(--radius-full);
		padding: 2px;
	}

	.stepper-btn {
		width: 26px;
		height: 26px;
		border-radius: 50%;
		border: none;
		background: #ffffff;
		color: var(--color-brand-primary);
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
		opacity: 0.35;
		cursor: not-allowed;
		box-shadow: none;
	}

	.stepper-val {
		min-width: 44px;
		text-align: center;
		font-size: 12px;
		font-weight: 800;
		color: var(--text-main);
	}

	.rec-match-badge {
		font-size: 10.5px;
		font-weight: 700;
		color: #166534;
		background: #f0fdf4;
		border: 1px solid #bbf7d0;
		padding: 3px 8px;
		border-radius: var(--radius-full);
	}

	.rec-restore-pill {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		font-size: 10.5px;
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

	.reset-overrides-btn {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		font-size: 11px;
		font-weight: 700;
		color: #b45309;
		background: #fffbeb;
		border: 1px solid #fde68a;
		padding: 4px 10px;
		border-radius: var(--radius-full);
		cursor: pointer;
		white-space: nowrap;
		transition: all var(--transition-fast);
	}

	.reset-overrides-btn:hover {
		background: #fef3c7;
	}

	.item-dishes-note {
		font-size: 11px;
		color: var(--text-muted);
	}

	.item-cook-hint {
		font-size: 11px;
		color: #15803d;
		margin-top: 2px;
	}

	/* Stores Info Footer */
	.stores-footer {
		padding: 12px 18px;
		background: #f0fdf4;
		border-top: 1px dashed #bbf7d0;
	}

	.stores-map-btn {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 10px 14px;
		background: #ffffff;
		border: 1.5px solid #bbf7d0;
		border-radius: var(--radius-md);
		color: #166534;
		font-size: 13px;
		font-weight: 700;
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.stores-map-btn:hover {
		background: #dcfce7;
		border-color: #86efac;
		transform: translateY(-1px);
	}

	/* Grocery Groups */
	.grocery-groups {
		display: flex;
		flex-direction: column;
	}

	.empty-grocery-note {
		padding: 18px;
		font-size: 12.5px;
		color: var(--text-muted);
		text-align: center;
	}

	.category-group {
		border-bottom: 1px solid var(--border-subtle);
	}

	.category-group:last-child {
		border-bottom: none;
	}

	.category-header {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 10px 18px;
		background: #fafaf8;
		font-size: 12px;
		font-weight: 800;
		color: var(--text-main);
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
		padding: 10px 18px;
		border-bottom: 1px solid rgba(0, 0, 0, 0.04);
		transition: background var(--transition-fast);
	}

	.grocery-item-row:last-child {
		border-bottom: none;
	}

	.grocery-item-row.checked {
		background: #fafaf9;
		opacity: 0.6;
	}

	.grocery-item-row.checked .grocery-name {
		text-decoration: line-through;
	}

	.grocery-item-text {
		flex: 1;
	}

	.grocery-name-row {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 8px;
	}

	.grocery-name {
		font-size: 13px;
		font-weight: 700;
		color: var(--text-main);
	}

	.grocery-amount {
		font-size: 11px;
		font-weight: 600;
		color: #b45309;
		white-space: nowrap;
	}

	.grocery-for-dish {
		display: block;
		font-size: 10px;
		color: var(--text-subtle);
	}

	/* Empty State */
	.cart-empty-card {
		background: #ffffff;
		border-radius: var(--radius-lg);
		border: 1.5px dashed var(--border-subtle);
		padding: 40px 20px;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
	}

	.empty-icon {
		font-size: 44px;
	}

	.empty-actions {
		display: flex;
		flex-direction: column;
		gap: 8px;
		width: 100%;
		max-width: 280px;
		margin-top: 10px;
	}

	.cart-bottom-utilities {
		display: flex;
		justify-content: center;
		padding: 10px 0;
	}

	.clear-all-link {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		background: none;
		border: none;
		color: #ef4444;
		font-size: 12px;
		font-weight: 700;
		cursor: pointer;
		opacity: 0.8;
		transition: opacity var(--transition-fast);
	}

	.clear-all-link:hover {
		opacity: 1;
		text-decoration: underline;
	}
</style>
