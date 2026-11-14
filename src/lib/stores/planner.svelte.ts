import type {
	DayKey,
	MealKey,
	WeekPlan,
	Dish,
	FamilySize,
	ReadyMadeSet,
	ShoppingCartGrouped
} from '#lib/types';
import { DISHES } from '#lib/data/dishes';
import { READY_MADE_SETS } from '#lib/data/sets';
import { DAYS_LIST, GROCERY_CATEGORIES_UA, getFamilySizeLabel } from '#lib/data/constants';

const STORAGE_KEY_WEEK = 'galya_planner_week_v1';
const STORAGE_KEY_SET = 'galya_planner_set_v1';
const STORAGE_KEY_CHECKED = 'galya_planner_checked_v1';
const STORAGE_KEY_FAMILY = 'galya_planner_family_v1';
const STORAGE_KEY_OVERRIDES = 'galya_planner_pack_overrides_v1';

function createEmptyWeek(): WeekPlan {
	return {
		monday: { breakfast: null, lunch: null, dinner: null },
		tuesday: { breakfast: null, lunch: null, dinner: null },
		wednesday: { breakfast: null, lunch: null, dinner: null },
		thursday: { breakfast: null, lunch: null, dinner: null },
		friday: { breakfast: null, lunch: null, dinner: null },
		saturday: { breakfast: null, lunch: null, dinner: null },
		sunday: { breakfast: null, lunch: null, dinner: null }
	};
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

		const mealDishes = [
			getDish(dayPlan.breakfast),
			getDish(dayPlan.lunch),
			getDish(dayPlan.dinner)
		].filter((d): d is Dish => d !== undefined);

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
	activeTab = $state<'home' | 'sets' | 'week' | 'cart'>('home');
	selectedDay = $state<DayKey>('monday');
	activeModal = $state<{ day: DayKey; meal: MealKey } | null>(null);
	previewSetId = $state<string | null>(null);
	selectedSetId = $state<string | null>(null);
	activeSetId = $state<string | null>(null);
	checkedItems = $state<Record<string, boolean>>({});
	isLocationsOpen = $state<boolean>(false);
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
				this.week = JSON.parse(savedWeek);
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

	setDish(day: DayKey, meal: MealKey, dishId: string | null) {
		const prevDish = this.getDish(this.week[day][meal]);
		const nextDish = this.getDish(dishId);

		// Reset overrides for affected products so weekly totals recalculate automatically
		const affectedNames = [
			prevDish?.galyaProduct?.name,
			...(prevDish?.extraGalyaProducts?.map((e) => e.product.name) ?? []),
			nextDish?.galyaProduct?.name,
			...(nextDish?.extraGalyaProducts?.map((e) => e.product.name) ?? [])
		].filter((name): name is string => Boolean(name));

		if (affectedNames.length > 0) {
			const nextOverrides = { ...this.packOverrides };
			for (const name of affectedNames) {
				delete nextOverrides[name];
			}
			this.packOverrides = nextOverrides;
		}

		this.week[day][meal] = dishId;
		this.saveToStorage();
		if (nextDish) {
			this.showToast(`Додано: «${nextDish.name}»`);
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
					breakfast: dayPlan.breakfast,
					lunch: dayPlan.lunch,
					dinner: dayPlan.dinner
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
			if (this.week[day.key].breakfast) count++;
			if (this.week[day.key].lunch) count++;
			if (this.week[day.key].dinner) count++;
		}
		return count;
	}

	getDayDishesCount(day: DayKey): number {
		let count = 0;
		if (this.week[day].breakfast) count++;
		if (this.week[day].lunch) count++;
		if (this.week[day].dinner) count++;
		return count;
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
