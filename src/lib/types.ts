export type DayKey =
	'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export type MealKey = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export type ActiveTab = 'inspire' | 'week' | 'shop' | 'settings' | 'home' | 'sets' | 'cart';

export type AppLocale = 'uk' | 'en';

export type FamilySize = 1 | 2 | 3 | 4 | 5;

export interface DayInfo {
	key: DayKey;
	shortName: string;
	fullName: string;
	accentEmoji: string;
}

export interface MealInfo {
	key: MealKey;
	label: string;
	icon: string;
	suggestedTime: string;
	description: string;
}

export interface GalyaProduct {
	name: string;
	category: string;
	weightText: string;
	priceUah: number;
	badge: string; // 'Ручна ліпка' | 'Швидкий обід' | 'Випічка' | 'З печі' | 'Фірмове'
	cookingTimeMinutes: number;
	cookingMethod: string;
}

export interface ExtraGalyaProduct {
	product: GalyaProduct;
	/** Servings covered by one pack of this companion product (defaults to dish.servings) */
	servingsPerPack?: number;
}

export interface GroceryItem {
	name: string;
	amount: string;
	category: 'dairy' | 'produce' | 'bakery' | 'grocery' | 'sauces' | 'other';
	/** Base quantity corresponding to dish.servings */
	baseQty?: number;
	/** Measurement unit used when aggregating scalable items */
	unit?: string;
	/** Whether the quantity scales proportionally with family size & occurrences */
	scalable?: boolean;
}

export interface Dish {
	id: string;
	name: string;
	category: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'universal';
	availableMeals: MealKey[];
	prepTimeMinutes: number;
	calories: number;
	servings: number;
	isGalyaProduct: boolean;
	galyaProduct?: GalyaProduct;
	extraGalyaProducts?: ExtraGalyaProduct[];
	groceryItems: GroceryItem[];
	/** Short companion to buy at market/supermarket for complete meal, e.g. "свіжі ягоди та фрукти", "картопляне пюре та салат" */
	sideCompanion?: string;
	description: string;
	imageEmoji: string;
	tags: string[];
}

export interface DayMeals {
	breakfast: string | null;
	lunch: string | null;
	dinner: string | null;
	snack: string | null;
}

export type WeekPlan = Record<DayKey, DayMeals>;

export interface ReadyMadeSet {
	id: string;
	title: string;
	subtitle: string;
	description: string;
	badge: string;
	emoji: string;
	accentColor: string;
	gradient: string;
	idealFor: string;
	totalDishesCount: number;
	galyaDishesCount: number;
	plan: Record<DayKey, { breakfast: string; lunch: string; dinner: string; snack?: string | null }>;
}

export interface CartGalyaItem {
	product: GalyaProduct;
	recommendedCount: number;
	count: number;
	isOverridden: boolean;
	servingsPerPack: number;
	totalServingsNeeded: number;
	occurrences: number;
	totalPrice: number;
	dishesNames: string[];
}

export interface CartGroceryItem {
	name: string;
	amountLabel: string;
	category: string;
	dishesNames: string[];
	scalable: boolean;
}

export interface ShoppingCartGrouped {
	galyaItems: CartGalyaItem[];
	groceryItems: CartGroceryItem[];
	familySize: FamilySize;
	totalEstimatedGalyaPrice: number;
	totalGalyaUnits: number;
	totalRecommendedGalyaUnits: number;
	totalGroceryUnits: number;
	hasManualOverrides: boolean;
}
