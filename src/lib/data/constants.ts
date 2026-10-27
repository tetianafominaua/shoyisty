import type { DayInfo, MealInfo } from '#lib/types';

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
