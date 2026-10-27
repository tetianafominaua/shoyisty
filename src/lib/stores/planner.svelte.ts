import type { DayKey, MealKey, WeekPlan, Dish, ShoppingCartGrouped } from '#lib/types';
import { DISHES } from '#lib/data/dishes';
import { READY_MADE_SETS } from '#lib/data/sets';
import { DAYS_LIST, MEALS_LIST, GROCERY_CATEGORIES_UA } from '#lib/data/constants';

const STORAGE_KEY_WEEK = 'galya_planner_week_v1';
const STORAGE_KEY_SET = 'galya_planner_set_v1';
const STORAGE_KEY_CHECKED = 'galya_planner_checked_v1';

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

class PlannerStore {
	week = $state<WeekPlan>(createEmptyWeek());
	activeTab = $state<'home' | 'sets' | 'week' | 'cart'>('home');
	selectedDay = $state<DayKey>('monday');
	activeModal = $state<{ day: DayKey; meal: MealKey } | null>(null);
	previewSetId = $state<string | null>(null);
	selectedSetId = $state<string | null>(null);
	activeSetId = $state<string | null>(null);
	checkedItems = $state<Record<string, boolean>>({});
	toastMessage = $state<string | null>(null);

	private toastTimer: any = null;

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

	getDish(id: string | null): Dish | undefined {
		if (!id) return undefined;
		return DISHES.find((d) => d.id === id);
	}

	setDish(day: DayKey, meal: MealKey, dishId: string | null) {
		this.week[day][meal] = dishId;
		this.saveToStorage();
		if (dishId) {
			const dish = this.getDish(dishId);
			if (dish) {
				this.showToast(`Додано: «${dish.name}»`);
			}
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
		this.saveToStorage();

		if (showNotification) {
			this.showToast(`Завантажено набір «${targetSet.title}»!`);
		}
	}

	clearWeek() {
		this.week = createEmptyWeek();
		this.activeSetId = null;
		this.checkedItems = {};
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

	// Cart Calculation
	getCartGrouped(): ShoppingCartGrouped {
		const galyaMap = new Map<
			string,
			{
				product: NonNullable<Dish['galyaProduct']>;
				count: number;
				totalPrice: number;
				dishesNames: Set<string>;
			}
		>();

		const groceryMap = new Map<
			string,
			{
				name: string;
				amounts: string[];
				category: string;
				dishesNames: Set<string>;
			}
		>();

		for (const day of DAYS_LIST) {
			const dayPlan = this.week[day.key];
			const mealDishes = [
				this.getDish(dayPlan.breakfast),
				this.getDish(dayPlan.lunch),
				this.getDish(dayPlan.dinner)
			].filter((d): d is Dish => d !== undefined);

			for (const dish of mealDishes) {
				if (dish.isGalyaProduct && dish.galyaProduct) {
					const prod = dish.galyaProduct;
					const existing = galyaMap.get(prod.name);
					if (existing) {
						existing.count += 1;
						existing.totalPrice += prod.priceUah;
						existing.dishesNames.add(dish.name);
					} else {
						galyaMap.set(prod.name, {
							product: prod,
							count: 1,
							totalPrice: prod.priceUah,
							dishesNames: new Set([dish.name])
						});
					}
				}

				for (const item of dish.groceryItems) {
					const normName = item.name.trim();
					const existing = groceryMap.get(normName);
					if (existing) {
						if (!existing.amounts.includes(item.amount)) {
							existing.amounts.push(item.amount);
						}
						existing.dishesNames.add(dish.name);
					} else {
						groceryMap.set(normName, {
							name: normName,
							amounts: [item.amount],
							category: item.category,
							dishesNames: new Set([dish.name])
						});
					}
				}
			}
		}

		let totalEstimatedGalyaPrice = 0;
		let totalGalyaUnits = 0;
		const galyaItems = Array.from(galyaMap.values()).map((item) => {
			totalEstimatedGalyaPrice += item.totalPrice;
			totalGalyaUnits += item.count;
			return {
				product: item.product,
				count: item.count,
				totalPrice: item.totalPrice,
				dishesNames: Array.from(item.dishesNames)
			};
		});

		const groceryItems = Array.from(groceryMap.values()).map((item) => ({
			name: item.name,
			amounts: item.amounts,
			category: item.category,
			dishesNames: Array.from(item.dishesNames)
		}));

		return {
			galyaItems,
			groceryItems,
			totalEstimatedGalyaPrice,
			totalGalyaUnits,
			totalGroceryUnits: groceryItems.length
		};
	}

	generateTelegramText(): string {
		const cart = this.getCartGrouped();
		const dateStr = new Date().toLocaleDateString('uk-UA', { day: 'numeric', month: 'long' });

		let text = `🥟 *СПИСОК ПОКУПОК НА ТИЖДЕНЬ* (${dateStr})\n`;
		text += `Планувальник меню «Галя Балувана»\n\n`;

		text += `📍 *1. ПРИДБАТИ В «ГАЛЯ БАЛУВАНА»* (${cart.totalGalyaUnits} поз., ~${cart.totalEstimatedGalyaPrice} ₴):\n`;
		if (cart.galyaItems.length === 0) {
			text += `_(Ще немає обраних напівфабрикатів)_\n`;
		} else {
			cart.galyaItems.forEach((item, idx) => {
				text += `${idx + 1}. [ ] *${item.product.name}* — ${item.count} уп. (${item.product.weightText}) ~ ${item.totalPrice} ₴\n`;
			});
		}

		text += `\n🛒 *2. ДОКУПИТИ В СУПЕРМАРКЕТІ* (${cart.totalGroceryUnits} поз.):\n`;
		if (cart.groceryItems.length === 0) {
			text += `_(Список супутніх товарів порожній)_\n`;
		} else {
			// Group by category
			const categories = ['dairy', 'produce', 'bakery', 'grocery', 'sauces', 'other'];
			for (const cat of categories) {
				const itemsInCat = cart.groceryItems.filter((i) => i.category === cat);
				if (itemsInCat.length > 0) {
					const catInfo = GROCERY_CATEGORIES_UA[cat] || { label: cat, icon: '•' };
					text += `\n${catInfo.icon} *${catInfo.label}*:\n`;
					itemsInCat.forEach((item) => {
						text += `  • [ ] ${item.name} (${item.amounts.join(', ')})\n`;
					});
				}
			}
		}

		text += `\n✨ _Смачного та затишного тижня!_`;
		return text;
	}
}

export const planner = new PlannerStore();
