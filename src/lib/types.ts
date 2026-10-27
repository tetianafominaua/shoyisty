export type DayKey =
	| 'monday'
	| 'tuesday'
	| 'wednesday'
	| 'thursday'
	| 'friday'
	| 'saturday'
	| 'sunday';

export type MealKey = 'breakfast' | 'lunch' | 'dinner';

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

export interface GroceryItem {
	name: string;
	amount: string;
	category: 'dairy' | 'produce' | 'bakery' | 'grocery' | 'sauces' | 'other';
}

export interface Dish {
	id: string;
	name: string;
	category: 'breakfast' | 'lunch' | 'dinner' | 'universal';
	availableMeals: MealKey[];
	prepTimeMinutes: number;
	calories: number;
	servings: number;
	isGalyaProduct: boolean;
	galyaProduct?: GalyaProduct;
	groceryItems: GroceryItem[];
	description: string;
	imageEmoji: string;
	tags: string[];
}

export interface DayMeals {
	breakfast: string | null;
	lunch: string | null;
	dinner: string | null;
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
	plan: Record<DayKey, { breakfast: string; lunch: string; dinner: string }>;
}

export interface ShoppingCartGrouped {
	galyaItems: Array<{
		product: GalyaProduct;
		count: number;
		totalPrice: number;
		dishesNames: string[];
	}>;
	groceryItems: Array<{
		name: string;
		amounts: string[];
		category: string;
		dishesNames: string[];
	}>;
	totalEstimatedGalyaPrice: number;
	totalGalyaUnits: number;
	totalGroceryUnits: number;
}
