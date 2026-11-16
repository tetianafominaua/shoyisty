import type {
	DayKey,
	MealKey,
	WeekPlan,
	Dish,
	FamilySize,
	ReadyMadeSet,
	ShoppingCartGrouped,
	ActiveTab,
	AppLocale
} from '#lib/types';
import { DISHES } from '#lib/data/dishes';
import { READY_MADE_SETS } from '#lib/data/sets';
import { DAYS_LIST, GROCERY_CATEGORIES_UA, getFamilySizeLabel } from '#lib/data/constants';

const STORAGE_KEY_WEEK = 'galya_planner_week_v1';
const STORAGE_KEY_SET = 'galya_planner_set_v1';
const STORAGE_KEY_CHECKED = 'galya_planner_checked_v1';
const STORAGE_KEY_FAMILY = 'galya_planner_family_v1';
const STORAGE_KEY_OVERRIDES = 'galya_planner_pack_overrides_v1';
const STORAGE_KEY_FAVORITES = 'galya_planner_favorites_v1';
const STORAGE_KEY_LOCALE = 'galya_planner_locale_v1';

function createEmptyWeek(): WeekPlan {
	return {
		monday: { breakfast: [], lunch: [], dinner: [], snack: [] },
		tuesday: { breakfast: [], lunch: [], dinner: [], snack: [] },
		wednesday: { breakfast: [], lunch: [], dinner: [], snack: [] },
		thursday: { breakfast: [], lunch: [], dinner: [], snack: [] },
		friday: { breakfast: [], lunch: [], dinner: [], snack: [] },
		saturday: { breakfast: [], lunch: [], dinner: [], snack: [] },
		sunday: { breakfast: [], lunch: [], dinner: [], snack: [] }
	};
}

function normalizeSlotDishes(slot: unknown): string[] {
	if (Array.isArray(slot)) {
		return slot.filter((id): id is string => typeof id === 'string' && id.trim().length > 0);
	}
	if (typeof slot === 'string' && slot.trim().length > 0) {
		return [slot];
	}
	return [];
}

function pluralUa(n: number, one: string, few: string, many: string): string {
	const mod100 = n % 100;
	const mod10 = n % 10;
	if (mod100 >= 11 && mod100 <= 19) return many;
	if (mod10 === 1) return one;
	if (mod10 >= 2 && mod10 <= 4) return few;
	return many;
}

function formatScaledAmount(qty: number, unit: string): string {
	if (unit === 'г') {
		if (qty >= 1000) {
			const roundedG = Math.round(qty / 50) * 50;
			const kg = Number((roundedG / 1000).toFixed(2));
			return `${kg} кг`;
		}
		const roundedG = Math.max(10, Math.round(qty / 10) * 10);
		return `${roundedG} г`;
	}

	if (unit === 'мл') {
		if (qty >= 1000) {
			const roundedMl = Math.round(qty / 50) * 50;
			const liters = Number((roundedMl / 1000).toFixed(2));
			return `${liters} л`;
		}
		const roundedMl = Math.max(10, Math.round(qty / 10) * 10);
		return `${roundedMl} мл`;
	}

	const count = Math.max(1, Math.ceil(qty - 1e-9));
	if (unit === 'бух.') {
		return `${count} ${pluralUa(count, 'буханка', 'буханки', 'буханок')}`;
	}
	if (unit === 'пачка') {
		return `${count} ${pluralUa(count, 'пачка', 'пачки', 'пачок')}`;
	}
	if (unit === 'баночка') {
		return `${count} ${pluralUa(count, 'баночка', 'баночки', 'баночок')}`;
	}
	if (unit === 'пляшка') {
		return `${count} ${pluralUa(count, 'пляшка', 'пляшки', 'пляшок')}`;
	}
	if (unit === 'набір (по 1 шт)') {
		return `по ${count} шт`;
	}
	return `${count} ${unit}`;
}

function calculatePlanCart(
	plan: WeekPlan | ReadyMadeSet['plan'],
	familySize: FamilySize,
	getDish: (id: string | null) => Dish | undefined,
	overrides: Record<string, number> = {}
): ShoppingCartGrouped {
	const galyaMap = new Map<
		string,
		{
			product: NonNullable<Dish['galyaProduct']>;
			occurrences: number;
			totalServingsNeeded: number;
			packUnitsRaw: number;
			servingsPerPack: number;
			uniformServings: boolean;
			dishesNames: Set<string>;
		}
	>();

	const groceryMap = new Map<
		string,
		{
			name: string;
			category: string;
			scalable: boolean;
			totalQty: number;
			unit: string | null;
			fallbackAmounts: Set<string>;
			dishesNames: Set<string>;
		}
	>();

	for (const day of DAYS_LIST) {
		const dayPlan = plan[day.key];
		if (!dayPlan) continue;

		const slotDishes: string[] = [
			...normalizeSlotDishes(dayPlan.breakfast),
			...normalizeSlotDishes(dayPlan.lunch),
			...normalizeSlotDishes(dayPlan.dinner),
			...normalizeSlotDishes('snack' in dayPlan ? dayPlan.snack : null)
		];

		const mealDishes = slotDishes
			.map((id) => getDish(id))
			.filter((d): d is Dish => d !== undefined);

		const addGalyaProduct = (
			prod: NonNullable<Dish['galyaProduct']>,
			packServings: number,
			dishName: string
		) => {
			const effServings = packServings > 0 ? packServings : 1;
			const portionScale = familySize / effServings;
			const existing = galyaMap.get(prod.name);
			if (existing) {
				existing.occurrences += 1;
				existing.totalServingsNeeded += familySize;
				existing.packUnitsRaw += portionScale;
				if (existing.servingsPerPack !== effServings) {
					existing.uniformServings = false;
				}
				existing.dishesNames.add(dishName);
			} else {
				galyaMap.set(prod.name, {
					product: prod,
					occurrences: 1,
					totalServingsNeeded: familySize,
					packUnitsRaw: portionScale,
					servingsPerPack: effServings,
					uniformServings: true,
					dishesNames: new Set([dishName])
				});
			}
		};

		for (const dish of mealDishes) {
			const servingsPerPack = dish.servings > 0 ? dish.servings : 1;
			const portionScale = familySize / servingsPerPack;

			if (dish.isGalyaProduct && dish.galyaProduct) {
				addGalyaProduct(dish.galyaProduct, servingsPerPack, dish.name);
			}

			for (const extra of dish.extraGalyaProducts ?? []) {
				addGalyaProduct(extra.product, extra.servingsPerPack ?? servingsPerPack, dish.name);
			}

			for (const item of dish.groceryItems) {
				const normName = item.name.trim();
				const existing = groceryMap.get(normName);
				const isScalable = Boolean(item.scalable && item.baseQty !== undefined && item.unit);

				if (existing) {
					if (isScalable && existing.scalable && existing.unit === item.unit) {
						existing.totalQty += (item.baseQty ?? 0) * portionScale;
					} else {
						existing.fallbackAmounts.add(item.amount);
					}
					existing.dishesNames.add(dish.name);
				} else {
					groceryMap.set(normName, {
						name: normName,
						category: item.category,
						scalable: isScalable,
						totalQty: isScalable ? (item.baseQty ?? 0) * portionScale : 0,
						unit: isScalable ? (item.unit ?? null) : null,
						fallbackAmounts: new Set(isScalable ? [] : [item.amount]),
						dishesNames: new Set([dish.name])
					});
				}
			}
		}
	}

	let totalEstimatedGalyaPrice = 0;
	let totalGalyaUnits = 0;
	let totalRecommendedGalyaUnits = 0;
	let hasManualOverrides = false;

	const galyaItems = Array.from(galyaMap.values()).map((item) => {
		const rawPacks = item.uniformServings
			? item.totalServingsNeeded / item.servingsPerPack
			: item.packUnitsRaw;
		const recommendedCount = Math.max(1, Math.ceil(rawPacks - 1e-9));
		const overrideVal = overrides[item.product.name];
		const isOverridden =
			typeof overrideVal === 'number' &&
			Number.isFinite(overrideVal) &&
			overrideVal >= 1 &&
			Math.floor(overrideVal) !== recommendedCount;
		const count = isOverridden ? Math.floor(overrideVal) : recommendedCount;
		const totalPrice = count * item.product.priceUah;

		totalEstimatedGalyaPrice += totalPrice;
		totalGalyaUnits += count;
		totalRecommendedGalyaUnits += recommendedCount;
		if (isOverridden) hasManualOverrides = true;

		return {
			product: item.product,
			recommendedCount,
			count,
			isOverridden,
			servingsPerPack: item.servingsPerPack,
			totalServingsNeeded: item.totalServingsNeeded,
			occurrences: item.occurrences,
			totalPrice,
			dishesNames: Array.from(item.dishesNames)
		};
	});

	const groceryItems = Array.from(groceryMap.values()).map((item) => {
		const amountLabel =
			item.scalable && item.unit
				? formatScaledAmount(item.totalQty, item.unit)
				: Array.from(item.fallbackAmounts).join(', ');
		return {
			name: item.name,
			amountLabel,
			category: item.category,
			dishesNames: Array.from(item.dishesNames),
			scalable: item.scalable
		};
	});

	return {
		galyaItems,
		groceryItems,
		familySize,
		totalEstimatedGalyaPrice,
		totalGalyaUnits,
		totalRecommendedGalyaUnits,
		totalGroceryUnits: groceryItems.length,
		hasManualOverrides
	};
}

class PlannerStore {
	week = $state<WeekPlan>(createEmptyWeek());
	familySize = $state<FamilySize>(2);
	packOverrides = $state<Record<string, number>>({});
	activeTab = $state<ActiveTab>('inspire');
	selectedDay = $state<DayKey>('monday');
	activeModal = $state<{ day: DayKey; meal: MealKey; replaceIndex?: number } | null>(null);
	previewSetId = $state<string | null>(null);
	selectedSetId = $state<string | null>(null);
	activeSetId = $state<string | null>(null);
	checkedItems = $state<Record<string, boolean>>({});
	favorites = $state<string[]>([]);
	locale = $state<AppLocale>('uk');
	isLocationsOpen = $state<boolean>(false);
	isDayPresetOpen = $state<boolean>(false);
	isWeekPresetOpen = $state<boolean>(false);
	toastMessage = $state<string | null>(null);

	private toastTimer: ReturnType<typeof setTimeout> | null = null;

	constructor() {
		if (typeof window !== 'undefined') {
			this.loadFromStorage();
		}
	}

	loadFromStorage() {
		try {
			const savedWeek = localStorage.getItem(STORAGE_KEY_WEEK);
			if (savedWeek) {
				const parsed = JSON.parse(savedWeek);
				const empty = createEmptyWeek();
				for (const day of DAYS_LIST) {
					if (parsed[day.key]) {
						empty[day.key] = {
							breakfast: normalizeSlotDishes(parsed[day.key].breakfast),
							lunch: normalizeSlotDishes(parsed[day.key].lunch),
							dinner: normalizeSlotDishes(parsed[day.key].dinner),
							snack: normalizeSlotDishes(parsed[day.key].snack)
						};
					}
				}
				this.week = empty;
			} else {
				this.week = createEmptyWeek();
			}

			const savedSet = localStorage.getItem(STORAGE_KEY_SET);
			if (savedSet) {
				this.activeSetId = savedSet;
			}

			const savedChecked = localStorage.getItem(STORAGE_KEY_CHECKED);
			if (savedChecked) {
				this.checkedItems = JSON.parse(savedChecked);
			}

			const savedFavorites = localStorage.getItem(STORAGE_KEY_FAVORITES);
			if (savedFavorites) {
				const parsed = JSON.parse(savedFavorites);
				if (Array.isArray(parsed)) {
					this.favorites = parsed.filter((id) => typeof id === 'string');
				}
			}

			const savedLocale = localStorage.getItem(STORAGE_KEY_LOCALE);
			if (savedLocale === 'uk' || savedLocale === 'en') {
				this.locale = savedLocale;
			}

			const savedFamily = localStorage.getItem(STORAGE_KEY_FAMILY);
			if (savedFamily) {
				const parsed = Number(savedFamily);
				if (parsed === 1 || parsed === 2 || parsed === 3 || parsed === 4 || parsed === 5) {
					this.familySize = parsed;
				}
			}

			const savedOverrides = localStorage.getItem(STORAGE_KEY_OVERRIDES);
			if (savedOverrides) {
				const parsed = JSON.parse(savedOverrides);
				if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
					const clean: Record<string, number> = {};
					for (const [key, val] of Object.entries(parsed)) {
						if (typeof val === 'number' && Number.isFinite(val) && val >= 1) {
							clean[key] = Math.floor(val);
						}
					}
					this.packOverrides = clean;
				}
			}
		} catch (e) {
			console.error('Failed to load from localStorage', e);
		}
	}

	saveToStorage() {
		if (typeof window === 'undefined') return;
		try {
			localStorage.setItem(STORAGE_KEY_WEEK, JSON.stringify(this.week));
			if (this.activeSetId) {
				localStorage.setItem(STORAGE_KEY_SET, this.activeSetId);
			} else {
				localStorage.removeItem(STORAGE_KEY_SET);
			}
			localStorage.setItem(STORAGE_KEY_CHECKED, JSON.stringify(this.checkedItems));
			localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(this.favorites));
			localStorage.setItem(STORAGE_KEY_LOCALE, this.locale);
			localStorage.setItem(STORAGE_KEY_FAMILY, String(this.familySize));
			if (Object.keys(this.packOverrides).length > 0) {
				localStorage.setItem(STORAGE_KEY_OVERRIDES, JSON.stringify(this.packOverrides));
			} else {
				localStorage.removeItem(STORAGE_KEY_OVERRIDES);
			}
		} catch (e) {
			console.error('Failed to save to localStorage', e);
		}
	}

	toggleFavorite(dishId: string) {
		if (this.favorites.includes(dishId)) {
			this.favorites = this.favorites.filter((id) => id !== dishId);
		} else {
			this.favorites = [dishId, ...this.favorites];
		}
		this.saveToStorage();
	}

	isFavorite(dishId: string): boolean {
		return this.favorites.includes(dishId);
	}

	setLocale(locale: AppLocale) {
		this.locale = locale;
		this.saveToStorage();
	}

	showToast(message: string) {
		this.toastMessage = message;
		if (this.toastTimer) clearTimeout(this.toastTimer);
		this.toastTimer = setTimeout(() => {
			this.toastMessage = null;
		}, 3000);
	}

	getDish = (id: string | null): Dish | undefined => {
		if (!id) return undefined;
		return DISHES.find((d) => d.id === id);
	};

	setFamilySize(size: FamilySize) {
		if (this.familySize === size) return;
		this.familySize = size;
		// Clear stale manual overrides so recommendations refresh cleanly for the new family size
		this.packOverrides = {};
		this.saveToStorage();
	}

	setPackCount(productName: string, nextCount: number, recommendedCount: number) {
		const clamped = Math.max(1, Math.floor(nextCount));
		const nextOverrides = { ...this.packOverrides };
		if (clamped === recommendedCount) {
			delete nextOverrides[productName];
		} else {
			nextOverrides[productName] = clamped;
		}
		this.packOverrides = nextOverrides;
		this.saveToStorage();
	}

	resetPackOverrides() {
		this.packOverrides = {};
		this.saveToStorage();
		this.showToast('Відновлено рекомендовану кількість упаковок');
	}

	getDishPackHint(dish: Dish, size: FamilySize = this.familySize): string {
		const servings = dish.servings > 0 ? dish.servings : 1;
		if (size === 1 && servings > 1) {
			if (Number.isInteger(servings)) {
				return `1 уп. на ${servings} прийоми`;
			}
			return 'вистачить 1 уп.';
		}
		if (size < servings) {
			return 'вистачить 1 уп.';
		}
		const ratio = size / servings;
		const nearestInt = Math.round(ratio);
		if (Math.abs(ratio - nearestInt) < 1e-6) {
			return `${nearestInt} уп. / прийом`;
		}
		const approx = Number(ratio.toFixed(1));
		return `~${approx} уп. / прийом`;
	}

	private clearOverridesForProducts(dishes: (Dish | undefined)[]) {
		const affectedNames = dishes
			.flatMap((d) => [
				d?.galyaProduct?.name,
				...(d?.extraGalyaProducts?.map((e) => e.product.name) ?? [])
			])
			.filter((name): name is string => Boolean(name));

		if (affectedNames.length > 0) {
			const nextOverrides = { ...this.packOverrides };
			for (const name of affectedNames) {
				delete nextOverrides[name];
			}
			this.packOverrides = nextOverrides;
		}
	}

	addDish(day: DayKey, meal: MealKey, dishId: string) {
		const nextDish = this.getDish(dishId);
		this.clearOverridesForProducts([nextDish]);
		this.week[day][meal] = [...this.week[day][meal], dishId];
		this.saveToStorage();
		if (nextDish) {
			this.showToast(`Додано: «${nextDish.name}»`);
		}
	}

	removeDishAt(day: DayKey, meal: MealKey, index: number) {
		const current = this.week[day][meal];
		if (index < 0 || index >= current.length) return;
		const removedDish = this.getDish(current[index]);
		this.clearOverridesForProducts([removedDish]);
		this.week[day][meal] = current.filter((_, idx) => idx !== index);
		this.saveToStorage();
		if (removedDish) {
			this.showToast(`Прибрано: «${removedDish.name}»`);
		}
	}

	replaceDishAt(day: DayKey, meal: MealKey, index: number, newDishId: string) {
		const current = this.week[day][meal];
		if (index < 0 || index >= current.length) return;
		const oldDish = this.getDish(current[index]);
		const newDish = this.getDish(newDishId);
		this.clearOverridesForProducts([oldDish, newDish]);
		const updated = [...current];
		updated[index] = newDishId;
		this.week[day][meal] = updated;
		this.saveToStorage();
		if (newDish) {
			this.showToast(`Замінено на: «${newDish.name}»`);
		}
	}

	setDish(day: DayKey, meal: MealKey, dishId: string | null) {
		if (dishId === null) {
			const oldDishes = this.week[day][meal].map((id) => this.getDish(id));
			this.clearOverridesForProducts(oldDishes);
			this.week[day][meal] = [];
			this.saveToStorage();
			return;
		}

		// Backward compatibility: if empty, set single, otherwise append
		if (this.week[day][meal].length === 0) {
			this.addDish(day, meal, dishId);
		} else {
			this.addDish(day, meal, dishId);
		}
	}

	loadSet(setId: string, showNotification = true) {
		const targetSet = READY_MADE_SETS.find((s) => s.id === setId);
		if (!targetSet) return;

		const newWeek = createEmptyWeek();
		for (const day of DAYS_LIST) {
			const dayPlan = targetSet.plan[day.key];
			if (dayPlan) {
				newWeek[day.key] = {
					breakfast: dayPlan.breakfast ? [dayPlan.breakfast] : [],
					lunch: dayPlan.lunch ? [dayPlan.lunch] : [],
					dinner: dayPlan.dinner ? [dayPlan.dinner] : [],
					snack: dayPlan.snack ? [dayPlan.snack] : []
				};
			}
		}

		this.week = newWeek;
		this.activeSetId = setId;
		this.checkedItems = {};
		this.packOverrides = {};
		this.saveToStorage();

		if (showNotification) {
			this.showToast(
				`Завантажено набір «${targetSet.title}» (${getFamilySizeLabel(this.familySize)})!`
			);
		}
	}

	loadDayPreset(day: DayKey, presetId: 'classic' | 'express' | 'light' = 'classic') {
		const presets = {
			classic: {
				breakfast: 'syrnyky-vanilla',
				lunch: 'borscht-ukrainian',
				dinner: 'kotlety-kyiv',
				snack: 'mlyntsi-cherry'
			},
			express: {
				breakfast: 'khachapuri-adjarian',
				lunch: 'soup-pea-smoked',
				dinner: 'pelmeni-classic',
				snack: 'chebureki-crimean'
			},
			light: {
				breakfast: 'varenyky-sweet-cottage-cheese',
				lunch: 'soup-rabbit-meatballs',
				dinner: 'varenyky-potato-mushrooms',
				snack: 'mlyntsi-chicken-mushrooms'
			}
		};

		const chosen = presets[presetId] ?? presets.classic;
		this.week[day] = {
			breakfast: [chosen.breakfast],
			lunch: [chosen.lunch],
			dinner: [chosen.dinner],
			snack: [chosen.snack]
		};
		this.saveToStorage();
		this.showToast('Завантажено збалансований набір на день!');
	}

	clearWeek() {
		this.week = createEmptyWeek();
		this.activeSetId = null;
		this.checkedItems = {};
		this.packOverrides = {};
		this.saveToStorage();
		this.showToast('План на тиждень очищено');
	}

	toggleChecked(itemKey: string) {
		this.checkedItems[itemKey] = !this.checkedItems[itemKey];
		this.saveToStorage();
	}

	// Statistics
	get totalDishesCount(): number {
		let count = 0;
		for (const day of DAYS_LIST) {
			count += this.week[day.key].breakfast.length;
			count += this.week[day.key].lunch.length;
			count += this.week[day.key].dinner.length;
			count += this.week[day.key].snack.length;
		}
		return count;
	}

	getDayDishesCount(day: DayKey): number {
		return (
			this.week[day].breakfast.length +
			this.week[day].lunch.length +
			this.week[day].dinner.length +
			this.week[day].snack.length
		);
	}

	getSetSummary(set: ReadyMadeSet, size: FamilySize = this.familySize): ShoppingCartGrouped {
		return calculatePlanCart(set.plan, size, this.getDish);
	}

	// Cart Calculation
	getCartGrouped(): ShoppingCartGrouped {
		return calculatePlanCart(this.week, this.familySize, this.getDish, this.packOverrides);
	}

	generateTelegramText(): string {
		const cart = this.getCartGrouped();
		const dateStr = new Date().toLocaleDateString('uk-UA', { day: 'numeric', month: 'long' });
		const familyLabel = getFamilySizeLabel(cart.familySize);

		let text = `*СПИСОК ПОКУПОК НА ТИЖДЕНЬ* (${dateStr})\n`;
		text += `Планувальник меню «Галя Балувана» • Розрахунок на: ${familyLabel}\n\n`;

		text += `*1. ПРИДБАТИ В «ГАЛЯ БАЛУВАНА»* (${cart.totalGalyaUnits} уп., ~${cart.totalEstimatedGalyaPrice} ₴):\n`;
		if (cart.galyaItems.length === 0) {
			text += `_(Ще немає обраних напівфабрикатів)_\n`;
		} else {
			cart.galyaItems.forEach((item, idx) => {
				text += `${idx + 1}. [ ] *${item.product.name}* — ${item.count} уп. (${item.product.weightText}) ~ ${item.totalPrice} ₴\n`;
			});
		}

		text += `\n*2. ДОКУПИТИ В СУПЕРМАРКЕТІ* (${cart.totalGroceryUnits} поз.):\n`;
		if (cart.groceryItems.length === 0) {
			text += `_(Список супутніх товарів порожній)_\n`;
		} else {
			const categories = ['dairy', 'produce', 'bakery', 'grocery', 'sauces', 'other'];
			for (const cat of categories) {
				const itemsInCat = cart.groceryItems.filter((i) => i.category === cat);
				if (itemsInCat.length > 0) {
					const catInfo = GROCERY_CATEGORIES_UA[cat] || { label: cat };
					text += `\n*${catInfo.label}*:\n`;
					itemsInCat.forEach((item) => {
						text += `  • [ ] ${item.name} (${item.amountLabel})\n`;
					});
				}
			}
		}

		text += `\n_Смачного та затишного тижня!_`;
		return text;
	}
}

export const planner = new PlannerStore();
