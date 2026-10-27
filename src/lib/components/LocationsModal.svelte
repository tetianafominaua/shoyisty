<script lang="ts">
	import { planner } from '#lib/stores/planner.svelte';

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
				<h3 class="sheet-title">📍 Наші магазини на карті</h3>
				<button class="sheet-close-btn" onclick={close} aria-label="Закрити">&times;</button>
			</div>

			<!-- 4 Compact Locations (Zero scroll, fits 100% on any screen) -->
			<div class="locations-compact-list">
				{#each LOCATIONS as loc}
					<a
						href={loc.mapsUrl}
						target="_blank"
						rel="noopener noreferrer"
						class="compact-loc-row"
					>
						<div class="loc-text-col">
							<div class="loc-address-line">
								<strong class="loc-address">{loc.address}</strong>
								<span class="loc-badge">{loc.badge}</span>
							</div>
							<span class="loc-city">{loc.city}</span>
						</div>

						<span class="loc-route-pill">Карта ↗</span>
					</a>
				{/each}
			</div>

			<!-- Call Button (Strictly Single Line Guaranteed, No Wrapping) -->
			<div class="sheet-call-wrapper">
				<a href="tel:+380506118570" class="call-btn-single-line">
					<span class="call-icon">📞</span>
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
		max-width: 520px;
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

	.sheet-title {
		font-size: 15px;
		font-weight: 800;
		color: var(--text-main);
		margin: 0;
	}

	.sheet-close-btn {
		background: var(--bg-surface-alt);
		border: none;
		font-size: 20px;
		line-height: 1;
		width: 28px;
		height: 28px;
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
		color: var(--text-main);
	}

	/* Compact Locations List - 4 items guaranteed on 1 screen */
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
		gap: 8px;
		padding: 8px 10px;
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
		gap: 1px;
		min-width: 0;
	}

	.loc-address-line {
		display: flex;
		align-items: center;
		gap: 6px;
		flex-wrap: nowrap;
		overflow: hidden;
	}

	.loc-address {
		font-size: 13.5px;
		font-weight: 800;
		color: var(--text-main);
		white-space: nowrap;
	}

	.loc-badge {
		font-size: 10px;
		font-weight: 700;
		color: var(--color-brand-primary);
		background: rgba(24, 67, 47, 0.08);
		padding: 1px 5px;
		border-radius: 4px;
		white-space: nowrap;
	}

	.loc-city {
		font-size: 11px;
		color: var(--text-muted);
		font-weight: 500;
		line-height: 1.2;
	}

	.loc-route-pill {
		display: inline-flex;
		align-items: center;
		gap: 2px;
		font-size: 11.5px;
		font-weight: 800;
		color: var(--color-brand-primary);
		background: rgba(24, 67, 47, 0.07);
		padding: 5px 10px;
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
		gap: 6px;
		padding: 9px 10px;
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

	.call-icon {
		font-size: 14px;
		flex-shrink: 0;
	}

	.call-text {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
