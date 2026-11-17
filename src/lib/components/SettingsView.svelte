<script lang="ts">
	import { planner } from '#lib/stores/planner.svelte';
	import { FAMILY_SIZE_OPTIONS } from '#lib/data/constants';
	import { t } from '#lib/i18n/translations';
	import Users from '@lucide/svelte/icons/users';
	import Globe from '@lucide/svelte/icons/globe';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import Check from '@lucide/svelte/icons/check';
	import ExternalLink from '@lucide/svelte/icons/external-link';

	const locale = $derived(planner.locale);
	const familySize = $derived(planner.familySize);

	let showClearConfirm = $state(false);

	const STORES_LIST = [
		{
			city: 'м. Одеса',
			address: 'вул. Сегедська, 6',
			hours: 'Щодня 09:00 – 20:00',
			mapsUrl: 'https://maps.google.com/?q=Галя+Балувана+Одеса+Сегедська+6'
		},
		{
			city: 'м. Одеса',
			address: 'вул. Корольова, 53',
			hours: 'Щодня 09:00 – 20:00',
			mapsUrl: 'https://maps.google.com/?q=Галя+Балувана+Одеса+Корольова+53'
		},
		{
			city: 'м. Одеса',
			address: 'вул. Св. Ріхтера, 129а',
			hours: 'Щодня 09:00 – 20:00',
			mapsUrl: 'https://maps.google.com/?q=Галя+Балувана+Одеса+Святослава+Ріхтера+129а'
		},
		{
			city: 'м. Південне',
			address: 'вул. Шевченка, 18/6',
			hours: 'Щодня 09:00 – 20:00',
			mapsUrl: 'https://maps.google.com/?q=Галя+Балувана+Південне+Шевченка+18/6'
		}
	];

	function handleClearWeek() {
		planner.clearWeek();
		showClearConfirm = false;
	}
</script>

<div class="settings-container animate-fade-in">
	<!-- Settings Header -->
	<div class="settings-header">
		<h2 class="settings-title">{t('settings.title', locale)}</h2>
		<p class="settings-subtitle">{t('settings.subtitle', locale)}</p>
	</div>

	<div class="settings-cards-stack">
		<!-- Card 1: Family Size -->
		<section class="settings-card">
			<div class="card-title-row">
				<div class="icon-bubble emerald">
					<Users size={18} color="var(--color-brand-primary)" />
				</div>
				<div>
					<h3 class="card-heading">{t('settings.familyTitle', locale)}</h3>
					<span class="card-subheading">{t('settings.familySubtitle', locale)}</span>
				</div>
			</div>

			<div class="family-options-row">
				{#each FAMILY_SIZE_OPTIONS as opt (opt.value)}
					<button
						type="button"
						class="family-pill-btn"
						class:active={familySize === opt.value}
						onclick={() => planner.setFamilySize(opt.value)}
					>
						<span class="pill-number">{opt.shortLabel}</span>
						<span class="pill-text">{opt.fullLabel}</span>
					</button>
				{/each}
			</div>
		</section>

		<!-- Card 2: Language -->
		<section class="settings-card">
			<div class="card-title-row">
				<div class="icon-bubble amber">
					<Globe size={18} color="#b45309" />
				</div>
				<div>
					<h3 class="card-heading">{t('settings.langTitle', locale)}</h3>
					<span class="card-subheading">Оберіть зручну мову для інтерфейсу</span>
				</div>
			</div>

			<div class="lang-switch-row">
				<button
					type="button"
					class="lang-pill-btn"
					class:active={locale === 'uk'}
					onclick={() => planner.setLocale('uk')}
				>
					<span class="flag-icon">🇺🇦</span>
					<span class="lang-label">Українська</span>
					{#if locale === 'uk'}
						<Check size={14} class="check-mark" />
					{/if}
				</button>

				<button
					type="button"
					class="lang-pill-btn"
					class:active={locale === 'en'}
					onclick={() => planner.setLocale('en')}
				>
					<span class="flag-icon">🇬🇧</span>
					<span class="lang-label">English</span>
					{#if locale === 'en'}
						<Check size={14} class="check-mark" />
					{/if}
				</button>
			</div>
		</section>

		<!-- Card 3: Stores & Map -->
		<section class="settings-card">
			<div class="card-title-row">
				<div class="icon-bubble red">
					<MapPin size={18} color="#be123c" />
				</div>
				<div>
					<h3 class="card-heading">{t('settings.storesTitle', locale)}</h3>
					<span class="card-subheading">{t('settings.storesSubtitle', locale)}</span>
				</div>
			</div>

			<div class="stores-list">
				{#each STORES_LIST as store (store.address)}
					<a href={store.mapsUrl} target="_blank" rel="noopener noreferrer" class="store-item-row">
						<div class="store-text">
							<div class="store-city-badge">{store.city}</div>
							<strong class="store-address">{store.address}</strong>
							<span class="store-hours">{store.hours}</span>
						</div>
						<span class="store-open-maps">
							<ExternalLink size={14} />
						</span>
					</a>
				{/each}
			</div>
		</section>

		<!-- Card 4: Social / Instagram -->
		<section class="settings-card">
			<div class="card-title-row">
				<div class="icon-bubble pink">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="#e1306c"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
						<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
						<line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
					</svg>
				</div>
				<div>
					<h3 class="card-heading">{t('settings.socialTitle', locale)}</h3>
					<span class="card-subheading">Новини, новинки ліпки та смачні акції</span>
				</div>
			</div>

			<a
				href="https://www.instagram.com/galyabaluvana_odesa/"
				target="_blank"
				rel="noopener noreferrer"
				class="instagram-action-btn"
			>
				<span>{t('settings.socialInstagram', locale)}</span>
				<ExternalLink size={15} />
			</a>
		</section>

		<!-- Card 5: Clear Week Reset -->
		<section class="settings-card danger-zone">
			<div class="card-title-row">
				<div class="icon-bubble red-subtle">
					<Trash2 size={18} color="#ef4444" />
				</div>
				<div>
					<h3 class="card-heading text-danger">{t('settings.clearWeekTitle', locale)}</h3>
					<span class="card-subheading">Очистити всі страви та почати планування з нуля</span>
				</div>
			</div>

			{#if !showClearConfirm}
				<button class="clear-week-btn" onclick={() => (showClearConfirm = true)}>
					<Trash2 size={15} />
					<span>{t('settings.clearWeekBtn', locale)}</span>
				</button>
			{:else}
				<div class="confirm-box animate-scale-in">
					<p class="confirm-text">{t('settings.clearWeekConfirm', locale)}</p>
					<div class="confirm-actions">
						<button class="btn-cancel" onclick={() => (showClearConfirm = false)}>
							{t('common.cancel', locale)}
						</button>
						<button class="btn-danger" onclick={handleClearWeek}>
							{t('common.confirm', locale)}
						</button>
					</div>
				</div>
			{/if}
		</section>
	</div>

	<!-- App Footer Info -->
	<div class="settings-footer-info">
		<strong>{t('settings.versionTitle', locale)}</strong>
		<span>Версія 1.1.0 • PWA • Ручна ліпка, Одеса & Південне</span>
	</div>
</div>

<style>
	.settings-container {
		padding: 16px 16px 90px 16px;
		max-width: 540px;
		margin: 0 auto;
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.settings-header {
		text-align: center;
		margin-bottom: 4px;
	}

	.settings-title {
		font-size: 24px;
		font-weight: 800;
		color: var(--text-main);
		margin: 0 0 4px 0;
		letter-spacing: -0.02em;
	}

	.settings-subtitle {
		font-size: 13px;
		color: var(--text-muted);
		margin: 0;
	}

	.settings-cards-stack {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	.settings-card {
		background: #ffffff;
		border-radius: var(--radius-lg);
		border: 1.5px solid var(--border-subtle);
		padding: 18px 16px;
		display: flex;
		flex-direction: column;
		gap: 14px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
	}

	.card-title-row {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.icon-bubble {
		width: 36px;
		height: 36px;
		border-radius: var(--radius-md);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.icon-bubble.emerald {
		background: #ecfdf5;
	}

	.icon-bubble.amber {
		background: #fef3c7;
	}

	.icon-bubble.red {
		background: #fff1f2;
	}

	.icon-bubble.pink {
		background: #fdf2f8;
	}

	.icon-bubble.red-subtle {
		background: #fee2e2;
	}

	.card-heading {
		font-size: 15px;
		font-weight: 800;
		color: var(--text-main);
		margin: 0 0 2px 0;
	}

	.card-subheading {
		font-size: 12px;
		color: var(--text-muted);
	}

	/* Family size pills */
	.family-options-row {
		display: grid;
		grid-template-columns: repeat(5, minmax(0, 1fr));
		gap: 6px;
	}

	.family-pill-btn {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 8px 4px;
		border-radius: var(--radius-md);
		border: 1.5px solid var(--border-subtle);
		background: #ffffff;
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.family-pill-btn.active {
		border-color: var(--color-brand-primary);
		background: #f0fdf4;
	}

	.pill-number {
		font-size: 16px;
		font-weight: 800;
		color: var(--text-main);
	}

	.family-pill-btn.active .pill-number {
		color: var(--color-brand-primary);
	}

	.pill-text {
		font-size: 10px;
		color: var(--text-muted);
		white-space: nowrap;
	}

	/* Language pills */
	.lang-switch-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 10px;
	}

	.lang-pill-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		padding: 12px;
		border-radius: var(--radius-md);
		border: 1.5px solid var(--border-subtle);
		background: #ffffff;
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.lang-pill-btn.active {
		border-color: var(--color-brand-primary);
		background: #f0fdf4;
	}

	.flag-icon {
		font-size: 18px;
	}

	.lang-label {
		font-size: 13px;
		font-weight: 700;
		color: var(--text-main);
	}

	:global(.check-mark) {
		color: var(--color-brand-primary);
	}

	/* Stores list */
	.stores-list {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.store-item-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 10px 12px;
		border-radius: var(--radius-md);
		border: 1px solid var(--border-subtle);
		background: #fafaf9;
		text-decoration: none;
		color: inherit;
		transition: all var(--transition-fast);
	}

	.store-item-row:hover {
		border-color: var(--color-brand-primary);
		background: #f0fdf4;
	}

	.store-text {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.store-city-badge {
		font-size: 10px;
		font-weight: 800;
		color: var(--color-brand-primary);
		text-transform: uppercase;
	}

	.store-address {
		font-size: 13px;
		color: var(--text-main);
	}

	.store-hours {
		font-size: 11px;
		color: var(--text-muted);
	}

	.store-open-maps {
		color: #94a3b8;
	}

	/* Instagram button */
	.instagram-action-btn {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 12px 16px;
		border-radius: var(--radius-md);
		border: 1px solid #fbcfe8;
		background: #fdf2f8;
		color: #e1306c;
		font-size: 13px;
		font-weight: 800;
		text-decoration: none;
		transition: all var(--transition-fast);
	}

	.instagram-action-btn:hover {
		background: #fce7f3;
	}

	/* Danger zone */
	.danger-zone {
		border-color: #fee2e2;
	}

	.text-danger {
		color: #ef4444;
	}

	.clear-week-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		padding: 11px 16px;
		border-radius: var(--radius-full);
		border: 1.5px solid #fee2e2;
		background: #fff5f5;
		color: #ef4444;
		font-size: 13px;
		font-weight: 800;
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.clear-week-btn:hover {
		background: #fee2e2;
	}

	.confirm-box {
		display: flex;
		flex-direction: column;
		gap: 10px;
		background: #fff5f5;
		border-radius: var(--radius-md);
		padding: 12px;
		border: 1px solid #fecdd3;
	}

	.confirm-text {
		font-size: 13px;
		font-weight: 700;
		color: #991b1b;
		margin: 0;
	}

	.confirm-actions {
		display: flex;
		gap: 8px;
	}

	.btn-cancel {
		flex: 1;
		padding: 9px;
		border-radius: var(--radius-full);
		border: 1px solid var(--border-subtle);
		background: #ffffff;
		font-size: 12px;
		font-weight: 700;
		cursor: pointer;
	}

	.btn-danger {
		flex: 1;
		padding: 9px;
		border-radius: var(--radius-full);
		border: none;
		background: #ef4444;
		color: #ffffff;
		font-size: 12px;
		font-weight: 800;
		cursor: pointer;
	}

	.settings-footer-info {
		text-align: center;
		display: flex;
		flex-direction: column;
		gap: 4px;
		font-size: 11px;
		color: #94a3b8;
		padding-top: 10px;
	}
</style>
