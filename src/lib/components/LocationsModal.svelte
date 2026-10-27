<script lang="ts">
	import { planner } from '#lib/stores/planner.svelte';

	interface LocationItem {
		city: string;
		address: string;
		badge: string;
		note: string;
		icon: string;
		mapsUrl: string;
	}

	const LOCATIONS: LocationItem[] = [
		{
			city: 'Одеса',
			address: 'вул. Сегедська, 6',
			badge: 'Головне виробництво',
			note: 'Відкритий цех ручної ліпки за склом: свіжі вареники, пельмені, готова кулінарія',
			icon: '🥟',
			mapsUrl: 'https://maps.google.com/?q=Галя+Балувана+Одеса+Сегедська+6'
		},
		{
			city: 'Одеса',
			address: 'вул. Ак. Корольова, 53',
			badge: 'Фірмовий магазин',
			note: 'Щоденна свіжа доставка з виробництва Сегедської',
			icon: '🥟',
			mapsUrl: 'https://maps.google.com/?q=Галя+Балувана+Одеса+Корольова+53'
		},
		{
			city: 'Одеса',
			address: 'вул. Св. Ріхтера, 129а',
			badge: 'Фірмовий магазин',
			note: 'Повний асортимент заморожених напівфабрикатів та страв під розігрів',
			icon: '🥟',
			mapsUrl: 'https://maps.google.com/?q=Галя+Балувана+Одеса+Святослава+Ріхтера+129а'
		},
		{
			city: 'м. Південне',
			address: 'вул. Шевченка, 18/6',
			badge: 'Виробництво з піччю',
			note: 'Гаряча піца з печі, хачапурі по-аджарськи, гриль-меню та бургери',
			icon: '🍕',
			mapsUrl: 'https://maps.google.com/?q=Галя+Балувана+Південне+Шевченка+18'
		}
	];

	function close() {
		planner.isLocationsOpen = false;
	}
</script>

{#if planner.isLocationsOpen}
	<div
		class="modal-backdrop"
		onclick={close}
		role="button"
		tabindex="0"
		onkeydown={(e) => e.key === 'Escape' && close()}
	>
		<div
			class="bottom-sheet animate-slide-up"
			onclick={(e) => e.stopPropagation()}
			role="dialog"
			tabindex="0"
			onkeydown={(e) => e.stopPropagation()}
		>
			<!-- Sheet Handle & Header -->
			<div class="sheet-handle"></div>
			<div class="sheet-header">
				<div class="header-titles">
					<span class="sheet-badge">📍 4 магазини мережі</span>
					<h3 class="sheet-title">Наші адреси на Google Картах</h3>
					<p class="sheet-sub">Оберіть потрібну точку, щоб прокласти маршрут</p>
				</div>
				<button class="sheet-close-btn" onclick={close} aria-label="Закрити">
					&times;
				</button>
			</div>

			<!-- Locations List -->
			<div class="locations-list">
				{#each LOCATIONS as loc}
					<a
						href={loc.mapsUrl}
						target="_blank"
						rel="noopener noreferrer"
						class="location-card"
					>
						<div class="loc-icon-bubble">{loc.icon}</div>
						<div class="loc-info">
							<div class="loc-top-row">
								<span class="loc-badge">{loc.badge}</span>
								<span class="loc-city">{loc.city}</span>
							</div>
							<div class="loc-address">{loc.address}</div>
							<div class="loc-note">{loc.note}</div>
						</div>
						<div class="loc-route-btn" title="Відкрити маршрут у Google Maps">
							<span>Маршрут</span>
							<span class="arrow-icon">↗</span>
						</div>
					</a>
				{/each}
			</div>

			<!-- Phone Call Action Button -->
			<div class="sheet-footer-call">
				<a href="tel:+380506118570" class="call-btn">
					<span class="call-icon">📞</span>
					<span>Зателефонувати в магазин: <strong>+38 050 611 85 70</strong></span>
				</a>
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-backdrop {
		position: fixed;
		inset: 0;
		z-index: 70;
		background: rgba(15, 28, 20, 0.6);
		backdrop-filter: blur(6px);
		display: flex;
		justify-content: center;
		align-items: flex-end;
	}

	.bottom-sheet {
		width: 100%;
		max-width: 580px;
		max-height: 88vh;
		background: #ffffff;
		border-radius: 24px 24px 0 0;
		display: flex;
		flex-direction: column;
		box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.2);
		overflow: hidden;
		padding: 12px 18px 24px 18px;
	}

	.sheet-handle {
		width: 36px;
		height: 4px;
		background: #d4cdc3;
		border-radius: 2px;
		margin: 0 auto 12px auto;
	}

	.sheet-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 14px;
	}

	.sheet-badge {
		font-size: 11px;
		font-weight: 700;
		color: var(--color-brand-primary);
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.sheet-title {
		font-size: 19px;
		font-weight: 800;
		margin: 2px 0 2px 0;
		color: var(--text-main);
	}

	.sheet-sub {
		font-size: 12px;
		color: var(--text-muted);
		margin: 0;
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
		transition: background var(--transition-fast);
	}

	.sheet-close-btn:hover {
		background: #eae2d1;
	}

	/* Locations List */
	.locations-list {
		display: flex;
		flex-direction: column;
		gap: 10px;
		overflow-y: auto;
		max-height: 52vh;
		padding-right: 2px;
		margin-bottom: 14px;
	}

	.location-card {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 14px;
		border-radius: var(--radius-md);
		border: 1.5px solid var(--border-subtle);
		background: #ffffff;
		text-decoration: none;
		color: inherit;
		transition: all var(--transition-fast);
	}

	.location-card:hover {
		border-color: var(--color-brand-primary);
		background: #fdfcf9;
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(24, 67, 47, 0.08);
	}

	.loc-icon-bubble {
		width: 44px;
		height: 44px;
		border-radius: 12px;
		background: var(--bg-surface-alt);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 22px;
		flex-shrink: 0;
	}

	.loc-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.loc-top-row {
		display: flex;
		gap: 6px;
		align-items: center;
	}

	.loc-badge {
		font-size: 10px;
		font-weight: 800;
		color: var(--color-brand-primary);
		background: rgba(24, 67, 47, 0.08);
		padding: 1px 6px;
		border-radius: 4px;
	}

	.loc-city {
		font-size: 11px;
		font-weight: 700;
		color: var(--text-muted);
	}

	.loc-address {
		font-size: 15px;
		font-weight: 800;
		color: var(--text-main);
	}

	.loc-note {
		font-size: 11px;
		color: var(--text-muted);
		line-height: 1.35;
	}

	.loc-route-btn {
		display: flex;
		align-items: center;
		gap: 4px;
		font-size: 11px;
		font-weight: 800;
		color: var(--color-brand-primary);
		background: rgba(24, 67, 47, 0.06);
		padding: 6px 10px;
		border-radius: var(--radius-full);
		flex-shrink: 0;
		transition: all var(--transition-fast);
	}

	.location-card:hover .loc-route-btn {
		background: var(--color-brand-primary);
		color: #ffffff;
	}

	.arrow-icon {
		font-size: 13px;
		line-height: 1;
	}

	/* Phone Call Button */
	.sheet-footer-call {
		padding-top: 6px;
		border-top: 1px dashed var(--border-subtle);
	}

	.call-btn {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		padding: 12px 16px;
		background: #f0fdf4;
		border: 1.5px solid #a7f3d0;
		border-radius: var(--radius-md);
		color: #166534;
		font-size: 13px;
		font-weight: 700;
		text-decoration: none;
		transition: all var(--transition-fast);
	}

	.call-btn:hover {
		background: #dcfce7;
		border-color: #86efac;
	}

	.call-icon {
		font-size: 16px;
	}
</style>
