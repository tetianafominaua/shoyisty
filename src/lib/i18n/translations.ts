import type { AppLocale } from '#lib/types';

export const TRANSLATIONS: Record<AppLocale, Record<string, string>> = {
	uk: {
		// Navigation tabs
		'tab.inspire': 'Надихнутися',
		'tab.week': 'Тиждень',
		'tab.shop': 'Магазин',
		'tab.settings': 'Налаштування',

		// Meals
		'meal.breakfast': 'Сніданок',
		'meal.lunch': 'Обід',
		'meal.dinner': 'Вечеря',
		'meal.snack': 'Перекус',

		// Common
		'common.minutes': 'хв',
		'common.servings': 'порц.',
		'common.packs': 'уп.',
		'common.dishes': 'страв',
		'common.items': 'поз.',
		'common.approx': '~',
		'common.uah': '₴',
		'common.back': 'Назад',
		'common.cancel': 'Скасувати',
		'common.confirm': 'Підтвердити',
		'common.copied': 'Список скопійовано у буфер!',

		// Inspire tab
		'inspire.title': 'Надихнутися стравами',
		'inspire.subtitle': 'Повний асортимент ручної ліпки «Галя Балувана»',
		'inspire.searchPlaceholder': 'Пошук страви за назвою або інгредієнтом...',
		'inspire.filter.all': 'Всі страви',
		'inspire.filter.favorites': 'Обране',
		'inspire.filter.breakfast': 'Сніданки',
		'inspire.filter.lunch': 'Перші страви',
		'inspire.filter.dinner': 'Основні страви',
		'inspire.filter.snack': 'Перекуси та десерти',
		'inspire.favoritesHeading': 'Ваше обране ❤️',
		'inspire.favoritesEmpty': 'Натисніть на сердечко на будь-якій страві, щоб закріпити її тут',
		'inspire.addToPlan': 'У план',
		'inspire.selectDayAndMeal': 'Куди додати страву?',
		'inspire.day': 'День тижня',
		'inspire.meal': 'Прийом їжі',
		'inspire.addSuccess': 'Страву успішно додано в план!',

		// Week tab
		'week.title': 'Меню на тиждень',
		'week.monthLabel': 'Листопад 2026',
		'week.addDish': 'Додати страву',
		'week.replaceDish': 'Замінити',
		'week.removeDish': 'Прибрати',
		'week.emptySlot': 'Натисніть, щоб додати страву',
		'week.quickSetsTitle': 'Швидкі набори',
		'week.setForDay': 'Набір на день',
		'week.setForDaySub': 'Збалансований сніданок, обід, вечеря та перекус',
		'week.setForWeek': 'Набір на тиждень',
		'week.setForWeekSub': '4 готові меню від шефа на 7 днів',
		'week.daySetApplied': 'Набір на день успішно застосовано!',
		'week.weekSetApplied': 'Набір на тиждень успішно завантажено!',

		// Shop tab
		'shop.title': 'Список покупок',
		'shop.subtitle': 'Два зручні списки з чекбоксами для комфортного шопінгу',
		'shop.galyaHeading': '1. Придбати в «Галя Балувана»',
		'shop.groceryHeading': '2. Докупити в супермаркеті',
		'shop.emptyTitle': 'Список покупок порожній',
		'shop.emptySubtitle': 'Додайте страви у вкладці «Тиждень» або оберіть з «Надихнутися»',
		'shop.goToInspire': 'Обрати страви',
		'shop.goToWeek': 'Перейти до тижня',
		'shop.copy': 'Скопіювати список',
		'shop.share': 'Поділитися списком',
		'shop.resetOverrides': 'Скинути до рекомендованих',

		// Settings tab
		'settings.title': 'Налаштування',
		'settings.subtitle': 'Персоналізація меню, мова та наші магазини',
		'settings.familyTitle': 'Кількість людей у родині',
		'settings.familySubtitle': 'Впливає на розрахунок кількості порцій та упаковок',
		'settings.langTitle': 'Мова інтерфейсу (Language)',
		'settings.storesTitle': 'Фірмові магазини в Одесі та Південному',
		'settings.storesSubtitle': '4 магазини з повним асортиментом свіжої заморозки',
		'settings.openMaps': 'Відкрити на Google Картах',
		'settings.socialTitle': 'Ми в соціальних мережах',
		'settings.socialInstagram': 'Instagram @galyabaluvana_odesa',
		'settings.clearWeekTitle': 'Очистити план тижня',
		'settings.clearWeekBtn': 'Скинути всі страви тижня',
		'settings.clearWeekConfirm': 'Ви впевнені, що хочете очистити все меню на тиждень?',
		'settings.versionTitle': 'Галя Балувана — Шпаргалка меню'
	},
	en: {
		// Navigation tabs
		'tab.inspire': 'Inspire',
		'tab.week': 'Week',
		'tab.shop': 'Shop',
		'tab.settings': 'Settings',

		// Meals
		'meal.breakfast': 'Breakfast',
		'meal.lunch': 'Lunch',
		'meal.dinner': 'Dinner',
		'meal.snack': 'Snack',

		// Common
		'common.minutes': 'min',
		'common.servings': 'serv.',
		'common.packs': 'pk.',
		'common.dishes': 'dishes',
		'common.items': 'items',
		'common.approx': '~',
		'common.uah': '₴',
		'common.back': 'Back',
		'common.cancel': 'Cancel',
		'common.confirm': 'Confirm',
		'common.copied': 'Shopping list copied to clipboard!',

		// Inspire tab
		'inspire.title': 'Get Inspired',
		'inspire.subtitle': 'Handcrafted dishes by «Galya Baluvana»',
		'inspire.searchPlaceholder': 'Search dish or ingredient...',
		'inspire.filter.all': 'All Dishes',
		'inspire.filter.favorites': 'Favorites',
		'inspire.filter.breakfast': 'Breakfast',
		'inspire.filter.lunch': 'Soups & Bowls',
		'inspire.filter.dinner': 'Mains',
		'inspire.filter.snack': 'Snacks & Desserts',
		'inspire.favoritesHeading': 'Your Favorites ❤️',
		'inspire.favoritesEmpty': 'Tap the heart icon on any dish to pin it here',
		'inspire.addToPlan': 'Add to plan',
		'inspire.selectDayAndMeal': 'Where to add this dish?',
		'inspire.day': 'Day of week',
		'inspire.meal': 'Meal slot',
		'inspire.addSuccess': 'Dish added to your weekly plan!',

		// Week tab
		'week.title': 'Weekly Meal Plan',
		'week.monthLabel': 'November 2026',
		'week.addDish': 'Add dish',
		'week.replaceDish': 'Replace',
		'week.removeDish': 'Remove',
		'week.emptySlot': 'Tap to choose a meal',
		'week.quickSetsTitle': 'Quick Presets',
		'week.setForDay': 'Day Meal Preset',
		'week.setForDaySub': 'Balanced breakfast, lunch, dinner & snack',
		'week.setForWeek': 'Week Meal Preset',
		'week.setForWeekSub': '4 chef-crafted weekly meal plans',
		'week.daySetApplied': 'Day preset applied successfully!',
		'week.weekSetApplied': 'Weekly plan loaded successfully!',

		// Shop tab
		'shop.title': 'Shopping List',
		'shop.subtitle': 'Two organized checklists with checkboxes for easy shopping',
		'shop.galyaHeading': '1. Buy at «Galya Baluvana»',
		'shop.groceryHeading': '2. Buy at Supermarket',
		'shop.emptyTitle': 'Your shopping list is empty',
		'shop.emptySubtitle': 'Add dishes in «Week» or choose from «Inspire»',
		'shop.goToInspire': 'Explore Dishes',
		'shop.goToWeek': 'Go to Weekly Plan',
		'shop.copy': 'Copy checklist',
		'shop.share': 'Share list',
		'shop.resetOverrides': 'Reset to recommended',

		// Settings tab
		'settings.title': 'Settings',
		'settings.subtitle': 'Personalize your family size, language and store locations',
		'settings.familyTitle': 'Family Members',
		'settings.familySubtitle': 'Scales ingredient weights and packaging recommendations',
		'settings.langTitle': 'Interface Language',
		'settings.storesTitle': 'Stores in Odesa & Yuzhne',
		'settings.storesSubtitle': '4 store locations with full frozen assortment',
		'settings.openMaps': 'Open in Google Maps',
		'settings.socialTitle': 'Social Media',
		'settings.socialInstagram': 'Instagram @galyabaluvana_odesa',
		'settings.clearWeekTitle': 'Reset Weekly Plan',
		'settings.clearWeekBtn': 'Clear all meals',
		'settings.clearWeekConfirm': 'Are you sure you want to clear your entire weekly menu?',
		'settings.versionTitle': 'Galya Baluvana — Meal Planner'
	}
};

export function t(key: string, locale: AppLocale = 'uk'): string {
	return TRANSLATIONS[locale]?.[key] ?? TRANSLATIONS.uk[key] ?? key;
}
