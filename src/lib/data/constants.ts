import type { DayInfo, MealInfo, FamilySize } from '#lib/types';

export const FAMILY_SIZE_OPTIONS: Array<{
	value: FamilySize;
	shortLabel: string;
	fullLabel: string;
}> = [
	{ value: 1, shortLabel: '1', fullLabel: '1 особа' },
	{ value: 2, shortLabel: '2', fullLabel: '2 особи' },
	{ value: 3, shortLabel: '3', fullLabel: '3 особи' },
	{ value: 4, shortLabel: '4', fullLabel: '4 особи' },
	{ value: 5, shortLabel: '5+', fullLabel: '5+ осіб' }
];

export function getFamilySizeLabel(size: FamilySize): string {
	return FAMILY_SIZE_OPTIONS.find((opt) => opt.value === size)?.fullLabel ?? `${size} осіб`;
}

export const DAYS_LIST: DayInfo[] = [
	{ key: 'monday', shortName: 'Пн', fullName: 'Понеділок', accentEmoji: '' },
	{ key: 'tuesday', shortName: 'Вт', fullName: 'Вівторок', accentEmoji: '' },
	{ key: 'wednesday', shortName: 'Ср', fullName: 'Середа', accentEmoji: '' },
	{ key: 'thursday', shortName: 'Чт', fullName: 'Четвер', accentEmoji: '' },
	{ key: 'friday', shortName: 'Пт', fullName: 'Пʼятниця', accentEmoji: '' },
	{ key: 'saturday', shortName: 'Сб', fullName: 'Субота', accentEmoji: '' },
	{ key: 'sunday', shortName: 'Нд', fullName: 'Неділя', accentEmoji: '' }
];

export const MEALS_LIST: MealInfo[] = [
	{
		key: 'breakfast',
		label: 'Сніданок',
		icon: 'sun',
		suggestedTime: '08:00 - 10:00',
		description: 'Заряд енергії: сирнички, млинчики, гаряча випічка'
	},
	{
		key: 'lunch',
		label: 'Обід',
		icon: 'soup',
		suggestedTime: '13:00 - 15:00',
		description: 'Ситна основа дня: наваристий борщ, солянка або крем-суп'
	},
	{
		key: 'dinner',
		label: 'Вечеря',
		icon: 'utensils',
		suggestedTime: '18:30 - 20:30',
		description: 'Затишна сімейна вечеря без втоми та гори брудного посуду'
	},
	{
		key: 'snack',
		label: 'Перекус',
		icon: 'cookie',
		suggestedTime: '16:00 - 17:30',
		description: 'Смачний перекус: млинчики, десерти або легкі страви'
	}
];

export const GROCERY_CATEGORIES_UA: Record<string, { label: string; icon: string }> = {
	dairy: { label: 'Молочні продукти', icon: 'milk' },
	produce: { label: 'Овочі, фрукти та зелень', icon: 'carrot' },
	bakery: { label: 'Хліб та випічка', icon: 'croissant' },
	grocery: { label: 'Бакалія та олії', icon: 'package' },
	sauces: { label: 'Соуси та приправи', icon: 'flame' },
	other: { label: 'Інше', icon: 'shopping-bag' }
};
