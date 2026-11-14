<script lang="ts">
	import { planner } from '#lib/stores/planner.svelte';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import Phone from '@lucide/svelte/icons/phone';
	import X from '@lucide/svelte/icons/x';
	import ExternalLink from '@lucide/svelte/icons/external-link';

	interface LocationItem {
		city: string;
		address: string;
		badge: string;
		mapsUrl: string;
	}

	const LOCATIONS: LocationItem[] = [
		{
			city: 'Одеса',
			address: 'вул. Сегедська, 6',
			badge: 'Головне виробництво',
			mapsUrl: 'https://maps.google.com/?q=Галя+Балувана+Одеса+Сегедська+6'
		},
		{
			city: 'Одеса',
			address: 'вул. Ак. Корольова, 53',
			badge: 'Магазин',
			mapsUrl: 'https://maps.google.com/?q=Галя+Балувана+Одеса+Корольова+53'
		},
		{
			city: 'Одеса',
			address: 'вул. Св. Ріхтера, 129а',
			badge: 'Магазин',
			mapsUrl: 'https://maps.google.com/?q=Галя+Балувана+Одеса+Святослава+Ріхтера+129а'
		},
		{
			city: 'м. Південне',
			address: 'вул. Шевченка, 18/6',
			badge: 'З піччю та грилем',
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
			<!-- Top Drag Handle -->
			<div class="sheet-handle"></div>

			<!-- Compact Header -->
			<div class="sheet-header">
				<div class="sheet-title-row">
					<MapPin size={18} class="header-icon" />
					<h3 class="sheet-title">Наші магазини на карті</h3>
				</div>
				<button class="sheet-close-btn" onclick={close} aria-label="Закрити">
					<X size={18} />
				</button>
			</div>

			<!-- 4 Compact Locations (Unified layout: Type -> Address -> City) -->
			<div class="locations-compact-list">
				{#each LOCATIONS as loc}
					<a
						href={loc.mapsUrl}
						target="_blank"
						rel="noopener noreferrer"
						class="compact-loc-row"
					>
						<div class="loc-text-col">
							<span class="loc-badge">{loc.badge}</span>
							<strong class="loc-address">{loc.address}</strong>
							<span class="loc-city">{loc.city}</span>
						</div>

						<span class="loc-route-pill">
							<span>Карта</span>
							<ExternalLink size={13} />
						</span>
					</a>
				{/each}
			</div>

			<!-- Call Button (Strictly Single Line Guaranteed, No Wrapping) -->
			<div class="sheet-call-wrapper">
				<a href="tel:+380506118570" class="call-btn-single-line">
					<Phone size={16} class="call-icon" />
					<span class="call-text">Зателефонувати в магазин: <strong>+38 050 611 85 70</strong></span>
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
		backdrop-filter: blur(5px);
		display: flex;
		justify-content: center;
		align-items: flex-end;
	}

	.bottom-sheet {
		width: 100%;
		max-width: 760px;
		background: #ffffff;
		border-radius: 20px 20px 0 0;
		display: flex;
		flex-direction: column;
		box-shadow: 0 -8px 30px rgba(0, 0, 0, 0.18);
		padding: 10px 14px 18px 14px;
	}

	.sheet-handle {
		width: 36px;
		height: 4px;
		background: #dcd6cc;
		border-radius: 2px;
		margin: 0 auto 8px auto;
	}

	/* Compact Header */
	.sheet-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 8px;
		padding-bottom: 6px;
		border-bottom: 1px solid var(--border-subtle);
	}

	.sheet-title-row {
		display: flex;
		align-items: center;
		gap: 8px;
		color: var(--color-brand-primary);
	}

	.sheet-title {
		font-size: 15px;
		font-weight: 800;
		color: var(--text-main);
		margin: 0;
	}

	.sheet-close-btn {
		background: var(--bg-surface-alt);
		border: none;
		width: 28px;
		height: 28px;
		border-radius: 50%;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--text-muted);
		transition: all var(--transition-fast);
	}

	.sheet-close-btn:hover {
		background: #eae2d1;
		color: var(--text-main);
	}

	/* Compact Locations List - Unified 3-line cards: Type -> Address -> City */
	.locations-compact-list {
		display: flex;
		flex-direction: column;
		gap: 6px;
		margin-bottom: 10px;
	}

	.compact-loc-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		padding: 8px 12px;
		border-radius: var(--radius-md);
		border: 1px solid var(--border-subtle);
		background: #ffffff;
		text-decoration: none;
		color: inherit;
		transition: all var(--transition-fast);
	}

	.compact-loc-row:hover {
		border-color: var(--color-brand-primary);
		background: #fdfcf9;
		transform: translateY(-1px);
		box-shadow: 0 2px 6px rgba(24, 67, 47, 0.08);
	}

	.loc-text-col {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 2px;
		min-width: 0;
	}

	.loc-badge {
		font-size: 10px;
		font-weight: 700;
		color: var(--color-brand-primary);
		background: rgba(24, 67, 47, 0.08);
		padding: 1px 6px;
		border-radius: 4px;
		text-transform: uppercase;
		letter-spacing: 0.03em;
		line-height: 1.2;
	}

	.loc-address {
		font-size: 14.5px;
		font-weight: 800;
		color: var(--text-main);
		line-height: 1.25;
	}

	.loc-city {
		font-size: 11.5px;
		color: var(--text-muted);
		font-weight: 500;
		line-height: 1.2;
	}

	.loc-route-pill {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		font-size: 12px;
		font-weight: 700;
		color: var(--color-brand-primary);
		background: rgba(24, 67, 47, 0.08);
		padding: 6px 11px;
		border-radius: var(--radius-full);
		flex-shrink: 0;
		white-space: nowrap;
		transition: all var(--transition-fast);
	}

	.compact-loc-row:hover .loc-route-pill {
		background: var(--color-brand-primary);
		color: #ffffff;
	}

	/* Call Button - Strictly Single Line Guaranteed */
	.sheet-call-wrapper {
		padding-top: 2px;
	}

	.call-btn-single-line {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		padding: 9px 12px;
		background: #f0fdf4;
		border: 1.5px solid #a7f3d0;
		border-radius: var(--radius-md);
		color: #166534;
		font-size: clamp(11.5px, 3.4vw, 13px);
		font-weight: 700;
		text-decoration: none;
		white-space: nowrap;
		transition: all var(--transition-fast);
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.call-btn-single-line:hover {
		background: #dcfce7;
		border-color: #86efac;
		transform: translateY(-1px);
	}

	.call-text {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	@media (min-width: 680px) {
		.locations-compact-list {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 8px;
			align-items: stretch;
		}
	}
</style>
