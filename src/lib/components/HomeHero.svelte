<script lang="ts">
	import { planner } from '#lib/stores/planner.svelte';

	const cart = $derived(planner.getCartGrouped());
</script>

<div class="minimal-home-container animate-fade-in">
	<!-- Minimal Greeting -->
	<div class="home-intro">
		<h2 class="home-title">Що приготувати?</h2>
		<p class="home-subtitle">Обирай готове меню або склади своє за 2 хвилини</p>
	</div>

	<!-- The 2 Main Prominent Buttons -->
	<div class="main-buttons-stack">
		<!-- Button 1: Готові набори -->
		<button
			class="hero-action-card card-sets"
			onclick={() => {
				planner.selectedSetId = null;
				planner.activeTab = 'sets';
			}}
			aria-label="Готові набори"
		>
			<div class="card-icon-bubble">🍱</div>
			<div class="card-text-group">
				<h3 class="card-main-title">Готові набори</h3>
				<span class="card-sub-info">4 готові раціони на тиждень</span>
			</div>
			<span class="card-arrow-circle">&rarr;</span>
		</button>

		<!-- Button 2: На тиждень -->
		<button
			class="hero-action-card card-week"
			onclick={() => (planner.activeTab = 'week')}
			aria-label="На тиждень"
		>
			<div class="card-icon-bubble">📅</div>
			<div class="card-text-group">
				<h3 class="card-main-title">На тиждень</h3>
				<span class="card-sub-info">Конструктор страв по днях (Пн–Нд)</span>
			</div>
			<span class="card-arrow-circle">&rarr;</span>
		</button>
	</div>

	<!-- Smart Cart Floating Bar (Only appears if user already has items in week) -->
	{#if planner.totalDishesCount > 0}
		<div class="smart-cart-wrapper animate-slide-up">
			<button class="smart-cart-btn" onclick={() => (planner.activeTab = 'cart')}>
				<div class="smart-cart-left">
					<span class="smart-cart-icon">🛒</span>
					<div class="smart-cart-texts">
						<span class="smart-cart-heading">Твій кошик сформовано</span>
						<span class="smart-cart-sub">
							{planner.totalDishesCount} страв &bull; ~{cart.totalEstimatedGalyaPrice} ₴
						</span>
					</div>
				</div>
				<span class="smart-cart-action">Переглянути &rarr;</span>
			</button>
		</div>
	{/if}
</div>

<style>
	.minimal-home-container {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 24px 20px 48px 20px;
		gap: 28px;
		min-height: calc(100vh - 180px);
	}

	.home-intro {
		text-align: center;
	}

	.home-title {
		font-size: 28px;
		font-weight: 800;
		color: var(--text-main);
		margin-bottom: 6px;
		letter-spacing: -0.02em;
	}

	.home-subtitle {
		font-size: 14px;
		color: var(--text-muted);
		max-width: 320px;
		margin: 0 auto;
		line-height: 1.45;
	}

	/* Two Main Buttons Stack */
	.main-buttons-stack {
		display: flex;
		flex-direction: column;
		gap: 16px;
		width: 100%;
		max-width: 440px;
		margin: 0 auto;
	}

	.hero-action-card {
		display: flex;
		align-items: center;
		gap: 16px;
		padding: 22px 20px;
		border-radius: var(--radius-lg);
		border: 2px solid transparent;
		cursor: pointer;
		text-align: left;
		transition: all var(--transition-smooth);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
		width: 100%;
	}

	.hero-action-card:hover {
		transform: translateY(-3px);
		box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
	}

	.hero-action-card:active {
		transform: translateY(0);
	}

	/* Button 1: Готові набори (Brand Emerald) */
	.card-sets {
		background: linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%);
		border-color: rgba(24, 67, 47, 0.2);
	}

	.card-sets:hover {
		border-color: var(--color-brand-primary);
	}

	.card-sets .card-icon-bubble {
		background: #ffffff;
		border: 1px solid #bbf7d0;
	}

	.card-sets .card-main-title {
		color: var(--color-brand-primary);
	}

	/* Button 2: На тиждень (Amber / Warm) */
	.card-week {
		background: linear-gradient(135deg, #ffffff 0%, #fffbeb 100%);
		border-color: rgba(217, 119, 6, 0.25);
	}

	.card-week:hover {
		border-color: var(--color-brand-accent);
	}

	.card-week .card-icon-bubble {
		background: #ffffff;
		border: 1px solid #fde68a;
	}

	.card-week .card-main-title {
		color: #b45309;
	}

	/* Inner Elements */
	.card-icon-bubble {
		width: 52px;
		height: 52px;
		border-radius: 16px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 26px;
		flex-shrink: 0;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
	}

	.card-text-group {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.card-main-title {
		font-size: 20px;
		font-weight: 800;
		line-height: 1.2;
		margin: 0;
	}

	.card-sub-info {
		font-size: 13px;
		color: var(--text-muted);
		font-weight: 500;
	}

	.card-arrow-circle {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		background: #ffffff;
		border: 1px solid var(--border-subtle);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 16px;
		font-weight: 800;
		color: var(--text-muted);
		transition: all var(--transition-fast);
		flex-shrink: 0;
	}

	.hero-action-card:hover .card-arrow-circle {
		background: var(--color-brand-primary);
		border-color: var(--color-brand-primary);
		color: #ffffff;
		transform: translateX(3px);
	}

	/* Smart Cart Floating Bar */
	.smart-cart-wrapper {
		width: 100%;
		max-width: 440px;
		margin: 0 auto;
	}

	.smart-cart-btn {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 14px 18px;
		border-radius: var(--radius-md);
		background: #18432f;
		color: #ffffff;
		border: none;
		cursor: pointer;
		box-shadow: 0 6px 18px rgba(24, 67, 47, 0.3);
		transition: all var(--transition-fast);
	}

	.smart-cart-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 22px rgba(24, 67, 47, 0.4);
	}

	.smart-cart-left {
		display: flex;
		align-items: center;
		gap: 12px;
		text-align: left;
	}

	.smart-cart-icon {
		font-size: 22px;
	}

	.smart-cart-texts {
		display: flex;
		flex-direction: column;
	}

	.smart-cart-heading {
		font-size: 14px;
		font-weight: 800;
	}

	.smart-cart-sub {
		font-size: 11px;
		color: #a7f3d0;
	}

	.smart-cart-action {
		font-size: 13px;
		font-weight: 700;
		color: #ffffff;
	}
</style>
