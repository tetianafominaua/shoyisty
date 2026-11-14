<script lang="ts">
	import { planner } from '#lib/stores/planner.svelte';
	import { getFamilySizeLabel } from '#lib/data/constants';
	import FamilySizeSelector from '#lib/components/FamilySizeSelector.svelte';
	import CartGalyaList from '#lib/components/cart/CartGalyaList.svelte';
	import CartGroceryList from '#lib/components/cart/CartGroceryList.svelte';
	import ShoppingCart from '@lucide/svelte/icons/shopping-cart';
	import Sparkles from '@lucide/svelte/icons/sparkles';
	import Calendar from '@lucide/svelte/icons/calendar';
	import Copy from '@lucide/svelte/icons/copy';
	import Share2 from '@lucide/svelte/icons/share-2';
	import Trash2 from '@lucide/svelte/icons/trash-2';

	const cart = $derived(planner.getCartGrouped());

	async function copyToClipboard() {
		const text = planner.generateTelegramText();
		try {
			if (navigator.clipboard && window.isSecureContext) {
				await navigator.clipboard.writeText(text);
			} else {
				const textArea = document.createElement('textarea');
				textArea.value = text;
				textArea.style.position = 'fixed';
				textArea.style.left = '-9999px';
				document.body.appendChild(textArea);
				textArea.focus();
				textArea.select();
				document.execCommand('copy');
				document.body.removeChild(textArea);
			}
			planner.showToast('Список скопійовано! Вставте у Telegram або Viber');
		} catch (e) {
			console.error('Copy failed', e);
			planner.showToast('Помилка копіювання. Спробуйте вручну.');
		}
	}

	async function shareList() {
		const text = planner.generateTelegramText();
		if (navigator.share) {
			try {
				await navigator.share({
					title: 'Список покупок «Галя Балувана»',
					text: text
				});
			} catch (_e) {
				// User cancelled share
			}
		} else {
			copyToClipboard();
		}
	}
</script>

<div class="cart-container animate-fade-in">
	<!-- Cart Top Header -->
	<div class="cart-header">
		<div class="header-titles">
			<h2 class="cart-title">Кошик на тиждень</h2>
			<p class="cart-subtitle">
				Два списки: що придбати у «Галя Балувана», і що докупити у супермаркеті.
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
			<p>Оберіть один із готових наборів або додайте страви у планувальник по днях тижня.</p>
			<div class="empty-actions">
				<button class="btn-primary" onclick={() => (planner.activeTab = 'sets')}>
					<span>Обрати готовий набір</span>
					<Sparkles size={16} />
				</button>
				<button class="btn-secondary" onclick={() => (planner.activeTab = 'week')}>
					<span>Скласти по днях</span>
					<Calendar size={16} />
				</button>
			</div>
		</div>
	{:else}
		<FamilySizeSelector subtitle="Змінюйте кількість осіб або підкоригуйте упаковки вручну" />

		<!-- Summary Top Bar -->
		<div class="summary-top-card">
			<div class="summary-stat">
				<span class="stat-label">Страв у меню:</span>
				<strong class="stat-val">{planner.totalDishesCount} шт</strong>
			</div>
			<div class="summary-divider"></div>
			<div class="summary-stat">
				<span class="stat-label">Для {getFamilySizeLabel(cart.familySize)}:</span>
				<strong class="stat-val text-brand">{cart.totalGalyaUnits} уп.</strong>
			</div>
			<div class="summary-divider"></div>
			<div class="summary-stat">
				<span class="stat-label">Орієнтовно:</span>
				<strong class="stat-val text-brand">~{cart.totalEstimatedGalyaPrice} ₴</strong>
			</div>
		</div>

		<!-- Action Sharing Buttons -->
		<div class="share-actions-row">
			<button class="btn-primary flex-1" onclick={copyToClipboard}>
				<Copy size={16} />
				<span>Скопіювати в Telegram / Viber</span>
			</button>

			<button class="btn-secondary" onclick={shareList} title="Поділитися списком">
				<Share2 size={16} />
				<span>Поділитися</span>
			</button>
		</div>

		<div class="cart-sections-grid">
			<CartGalyaList {cart} />
			<CartGroceryList {cart} />
		</div>

		<!-- Bottom Clear Plan Button -->
		<div class="bottom-clear-row">
			<button
				class="clear-week-btn"
				onclick={() => {
					if (confirm('Очистити весь план на тиждень та кошик?')) {
						planner.clearWeek();
					}
				}}
			>
				<Trash2 size={15} />
				<span>Очистити весь тиждень</span>
			</button>
		</div>
	{/if}
</div>

<style>
	.cart-container {
		display: flex;
		flex-direction: column;
		gap: 16px;
		padding: 16px 20px 32px 20px;
		max-width: 800px;
		margin: 0 auto;
		width: 100%;
	}

	.cart-header {
		margin-bottom: 2px;
	}

	.cart-title {
		font-size: 22px;
		font-weight: 800;
		color: var(--text-main);
		margin: 0 0 4px 0;
	}

	.cart-subtitle {
		font-size: 13px;
		color: var(--text-muted);
		margin: 0;
	}

	/* Empty State */
	.cart-empty-card {
		background: #ffffff;
		border-radius: var(--radius-lg);
		border: 1.5px dashed var(--border-subtle);
		padding: 48px 24px;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 14px;
		margin-top: 10px;
	}

	.empty-icon {
		width: 72px;
		height: 72px;
		border-radius: 50%;
		background: rgba(24, 67, 47, 0.08);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.cart-empty-card h3 {
		font-size: 18px;
		font-weight: 800;
		color: var(--text-main);
		margin: 0;
	}

	.cart-empty-card p {
		font-size: 14px;
		color: var(--text-muted);
		max-width: 380px;
		margin: 0;
		line-height: 1.45;
	}

	.empty-actions {
		display: flex;
		gap: 10px;
		margin-top: 8px;
		flex-wrap: wrap;
		justify-content: center;
	}

	/* Summary Top Card */
	.summary-top-card {
		background: #ffffff;
		border-radius: var(--radius-md);
		border: 1.5px solid var(--border-subtle);
		padding: 12px 18px;
		display: flex;
		justify-content: space-around;
		align-items: center;
		box-shadow: var(--shadow-sm);
	}

	.summary-stat {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
	}

	.stat-label {
		font-size: 11px;
		color: var(--text-muted);
		font-weight: 600;
	}

	.stat-val {
		font-size: 16px;
		font-weight: 800;
		color: var(--text-main);
	}

	.stat-val.text-brand {
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

	.btn-primary {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		background: var(--color-brand-primary);
		color: #ffffff;
		border: none;
		border-radius: var(--radius-full);
		padding: 12px 20px;
		font-size: 14px;
		font-weight: 800;
		cursor: pointer;
		box-shadow: 0 4px 14px rgba(24, 67, 47, 0.25);
		transition: all var(--transition-fast);
	}

	.btn-primary:hover {
		background: #123323;
		transform: translateY(-1px);
	}

	.btn-secondary {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		background: #ffffff;
		color: var(--text-main);
		border: 1.5px solid var(--border-subtle);
		border-radius: var(--radius-full);
		padding: 12px 18px;
		font-size: 14px;
		font-weight: 700;
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.btn-secondary:hover {
		background: var(--bg-surface-alt);
		border-color: #cbd5e1;
	}

	.cart-sections-grid {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	/* Bottom Clear */
	.bottom-clear-row {
		display: flex;
		justify-content: center;
		padding-top: 10px;
	}

	.clear-week-btn {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		background: transparent;
		border: none;
		color: #ef4444;
		font-size: 13px;
		font-weight: 700;
		cursor: pointer;
		padding: 8px 14px;
		border-radius: var(--radius-full);
		transition: background var(--transition-fast);
	}

	.clear-week-btn:hover {
		background: #fef2f2;
	}
</style>
