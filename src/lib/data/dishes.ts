import type { Dish } from '#lib/types';

export const DISHES: Dish[] = [
	// ==================== СНІДАНКИ ====================
	{
		id: 'syrnyky-vanilla',
		name: 'Сирники',
		category: 'breakfast',
		availableMeals: ['breakfast', 'dinner'],
		prepTimeMinutes: 12,
		calories: 340,
		servings: 2,
		isGalyaProduct: true,
		galyaProduct: {
			name: 'Сирники',
			category: 'Сирники',
			weightText: 'упаковка 600 г (6 шт)',
			priceUah: 165,
			badge: 'Ручна ліпка',
			cookingTimeMinutes: 10,
			cookingMethod: 'Обсмажити на вершковому маслі на помірному вогні по 4-5 хв з кожного боку до золотистої скоринки під кришкою.'
		},
		groceryItems: [
			{ name: 'Сметана 20%', amount: '150 г', category: 'dairy', baseQty: 150, unit: 'г', scalable: true },
			{ name: 'Вершкове масло 82%', amount: '50 г', category: 'dairy', baseQty: 50, unit: 'г', scalable: true },
			{ name: 'Свіжі ягоди та фрукти (по сезону)', amount: '150 г', category: 'produce', baseQty: 150, unit: 'г', scalable: true }
		],
		description: 'Класичні сирники з фермерського сиру з легким ванільним ароматом.',
		imageEmoji: '',
		tags: ['kids', 'sweet', 'classic', 'breakfast']
	},
	{
		id: 'syrnyky-suluguni',
		name: 'Сирники з бринзою',
		category: 'breakfast',
		availableMeals: ['breakfast', 'dinner'],
		prepTimeMinutes: 12,
		calories: 310,
		servings: 2,
		isGalyaProduct: true,
		galyaProduct: {
			name: 'Сирники з бринзою',
			category: 'Сирники',
			weightText: 'упаковка 600 г',
			priceUah: 175,
			badge: 'Хіт сезону',
			cookingTimeMinutes: 10,
			cookingMethod: 'Підсмажити на краплі олії на невеликому вогні, щоб сирна начинка всередині стала ніжною та теплою.'
		},
		groceryItems: [
			{ name: 'Густий грецький йогурт або сметана', amount: '150 г', category: 'dairy', baseQty: 150, unit: 'г', scalable: true },
			{ name: 'Томати чері', amount: '200 г', category: 'produce', baseQty: 200, unit: 'г', scalable: true },
			{ name: 'Мікс салату', amount: '1 уп.', category: 'produce', baseQty: 1, unit: 'уп.', scalable: true }
		],
		description: 'Несолодкі сирники з солоною бринзою для ситного сніданку.',
		imageEmoji: '',
		tags: ['quick', 'cheese', 'breakfast']
	},
	{
		id: 'mlyntsi-chicken-mushrooms',
		name: 'Млинці з куркою та грибами',
		category: 'breakfast',
		availableMeals: ['breakfast', 'lunch', 'dinner'],
		prepTimeMinutes: 10,
		calories: 380,
		servings: 2,
		isGalyaProduct: true,
		galyaProduct: {
			name: 'Млинці з куркою та грибами',
			category: 'Млинці',
			weightText: 'упаковка 600 г (6 шт)',
			priceUah: 168,
			badge: 'Ручна ліпка',
			cookingTimeMinutes: 8,
			cookingMethod: 'Розігріти на сковороді з шматочком масла або запекти 10 хв у духовці під сиром.'
		},
		groceryItems: [
			{ name: 'Вершкове масло 82%', amount: '30 г', category: 'dairy', baseQty: 30, unit: 'г', scalable: true },
			{ name: 'Свіжа зелень (кріп, петрушка)', amount: '1 пучок', category: 'produce', baseQty: 0.5, unit: 'пуч.', scalable: true },
			{ name: 'Твердий сир (за бажанням підпекти)', amount: '100 г', category: 'dairy', baseQty: 100, unit: 'г', scalable: true }
		],
		description: 'Тонкі млинці з начинкою з курячого філе та обсмажених печериць.',
		imageEmoji: '',
		tags: ['meat', 'filling', 'family']
	},
	{
		id: 'mlyntsi-cherry',
		name: 'Млинці з вишнею',
		category: 'breakfast',
		availableMeals: ['breakfast', 'dinner'],
		prepTimeMinutes: 8,
		calories: 290,
		servings: 2,
		isGalyaProduct: true,
		galyaProduct: {
			name: 'Млинці з вишнею',
			category: 'Млинці',
			weightText: 'упаковка 600 г',
			priceUah: 155,
			badge: 'Улюблене дітьми',
			cookingTimeMinutes: 6,
			cookingMethod: 'Розігріти на сухій або змащеній вершковим маслом сковороді під кришкою 5-7 хв.'
		},
		groceryItems: [
			{ name: 'Сметана 20%', amount: '150 г', category: 'dairy', baseQty: 150, unit: 'г', scalable: true },
			{ name: 'Свіжа м’ята для подачі', amount: 'гілочка', category: 'produce', scalable: false }
		],
		description: 'Вишня без кісточок у делікатному сиропі всередині тонких млинців.',
		imageEmoji: '',
		tags: ['sweet', 'kids', 'berries']
	},
	{
		id: 'khachapuri-adjarian',
		name: 'Хачапурі з сиром',
		category: 'breakfast',
		availableMeals: ['breakfast', 'dinner'],
		prepTimeMinutes: 4,
		calories: 460,
		servings: 1,
		isGalyaProduct: true,
		galyaProduct: {
			name: 'Хачапурі з сиром',
			category: 'Готові страви',
			weightText: '1 шт (350 г)',
			priceUah: 130,
			badge: 'Готова страва',
			cookingTimeMinutes: 4,
			cookingMethod: 'Готова страва з печі — достатньо лише розігріти 2–3 хв у мікрохвильовці або 4–5 хв у духовці чи на сухій сковороді.'
		},
		groceryItems: [],
		description: 'Готовий хачапурі з сирною начинкою — достатньо лише розігріти.',
		imageEmoji: '',
		tags: ['quick', 'cheese', 'hot', 'gourmet']
	},

	// ==================== ОБІДИ ====================
	{
		id: 'borscht-ukrainian',
		name: 'Борщ готовий',
		category: 'lunch',
		availableMeals: ['lunch'],
		prepTimeMinutes: 10,
		calories: 280,
		servings: 1,
		isGalyaProduct: true,
		galyaProduct: {
			name: 'Борщ готовий',
			category: 'Борщ, супи',
			weightText: 'контейнер 700 г',
			priceUah: 145,
			badge: 'Готова кулінарія',
			cookingTimeMinutes: 7,
			cookingMethod: 'Перелити у каструлю та довести до кипіння на помірному вогні або розігріти в мікрохвильовці 5 хв.'
		},
		groceryItems: [
			{ name: 'Сметана 20%', amount: '50 г', category: 'dairy', baseQty: 50, unit: 'г', scalable: true },
			{ name: 'Свіжий часник', amount: '1 головка', category: 'produce', scalable: false },
			{ name: 'Свіжа зелень (кріп, петрушка)', amount: '1 пучок', category: 'produce', baseQty: 0.25, unit: 'пуч.', scalable: true },
			{ name: 'Бородинський або житній хліб / пампушки', amount: '1 буханка', category: 'bakery', baseQty: 0.25, unit: 'бух.', scalable: true },
			{ name: 'Сало з проріззю (за бажанням)', amount: '75 г', category: 'grocery', baseQty: 75, unit: 'г', scalable: true }
		],
		description: 'Наваристий український борщ зі шматочками м’яса та овочами.',
		imageEmoji: '',
		tags: ['soup', 'family', 'ukrainian', 'lunch']
	},
	{
		id: 'solyanka-meat',
		name: 'Солянка',
		category: 'lunch',
		availableMeals: ['lunch'],
		prepTimeMinutes: 10,
		calories: 320,
		servings: 1.5,
		isGalyaProduct: true,
		galyaProduct: {
			name: 'Солянка',
			category: 'Борщ, супи',
			weightText: 'контейнер 500 г',
			priceUah: 165,
			badge: 'Суп-концентрат',
			cookingTimeMinutes: 6,
			cookingMethod: 'Додати 100–150 мл води, розігріти до закипання в каструльці; за бажанням подавати зі сметаною (виходить 1.5 порції).'
		},
		groceryItems: [
			{ name: 'Сметана 20%', amount: '75 г', category: 'dairy', baseQty: 75, unit: 'г', scalable: true },
			{ name: 'Хрусткий багет', amount: '1 шт', category: 'bakery', baseQty: 0.38, unit: 'шт', scalable: true }
		],
		description: 'Густа солянка-концентрат з м’ясними копченостями, солоними огірками, маслинами та лимоном у складі.',
		imageEmoji: '',
		tags: ['soup', 'meat', 'gourmet', 'lunch']
	},
	{
		id: 'soup-rabbit-meatballs',
		name: 'Суп з фрикадельками з кролика',
		category: 'lunch',
		availableMeals: ['lunch'],
		prepTimeMinutes: 15,
		calories: 220,
		servings: 3,
		isGalyaProduct: true,
		galyaProduct: {
			name: 'Суп з фрикадельками з кролика',
			category: 'Борщ, супи',
			weightText: 'упаковка 1000 г',
			priceUah: 210,
			badge: 'Дієтичне / Дитяче',
			cookingTimeMinutes: 15,
			cookingMethod: 'Висипати вміст пакета у киплячу воду та варити 15 хвилин до готовності картоплі, моркви й вермішелі.'
		},
		groceryItems: [
			{ name: 'Свіжий кріп', amount: '1 пучок', category: 'produce', baseQty: 0.5, unit: 'пуч.', scalable: true }
		],
		description: 'Готовий суповий набір з фрикадельками з кролика, картоплею, морквою та дрібною вермішеллю у складі.',
		imageEmoji: '',
		tags: ['kids', 'diet', 'soup', 'family']
	},
	{
		id: 'soup-pea-smoked',
		name: 'Суп гороховий',
		category: 'lunch',
		availableMeals: ['lunch'],
		prepTimeMinutes: 8,
		calories: 310,
		servings: 1.5,
		isGalyaProduct: true,
		galyaProduct: {
			name: 'Суп гороховий',
			category: 'Борщ, супи',
			weightText: 'контейнер 500 г',
			priceUah: 135,
			badge: 'Суп-концентрат',
			cookingTimeMinutes: 6,
			cookingMethod: 'Додати 100–150 мл води, розігріти у сотейнику до гарячого стану та посипати грінками (виходить 1.5 порції).'
		},
		groceryItems: [
			{ name: 'Хрусткі пшеничні сухарики або грінки', amount: '1 пачка', category: 'bakery', baseQty: 0.38, unit: 'пачка', scalable: true },
			{ name: 'Свіжа зелена цибулька', amount: '1 пучок', category: 'produce', baseQty: 0.38, unit: 'пуч.', scalable: true }
		],
		description: 'Гороховий крем-суп концентрат із копченостями.',
		imageEmoji: '',
		tags: ['quick', 'soup', 'comfort']
	},
	{
		id: 'bogracs-transcarpathian',
		name: 'Бограч',
		category: 'lunch',
		availableMeals: ['lunch'],
		prepTimeMinutes: 10,
		calories: 360,
		servings: 1,
		isGalyaProduct: true,
		galyaProduct: {
			name: 'Бограч',
			category: 'Борщ, супи',
			weightText: 'контейнер 700 г',
			priceUah: 155,
			badge: 'Готова кулінарія',
			cookingTimeMinutes: 7,
			cookingMethod: 'Розігріти на середньому вогні, подавати гарячим зі шматочком свіжого хліба.'
		},
		groceryItems: [
			{ name: 'Хліб свіжоспечений', amount: '1 буханка', category: 'bakery', baseQty: 0.25, unit: 'бух.', scalable: true },
			{ name: 'Свіжий перець чілі (за бажанням)', amount: '1 шт', category: 'produce', scalable: false }
		],
		description: 'Ситний угорський м’ясний суп із паприкою та овочами.',
		imageEmoji: '',
		tags: ['meat', 'gourmet', 'hearty']
	},
	{
		id: 'soup-kharcho',
		name: 'Харчо',
		category: 'lunch',
		availableMeals: ['lunch'],
		prepTimeMinutes: 10,
		calories: 340,
		servings: 1.5,
		isGalyaProduct: true,
		galyaProduct: {
			name: 'Харчо',
			category: 'Борщ, супи',
			weightText: 'контейнер 500 г',
			priceUah: 155,
			badge: 'Суп-концентрат',
			cookingTimeMinutes: 7,
			cookingMethod: 'Додати 100–150 мл води, розігріти на помірному вогні до закипання та посипати свіжою кінзою (виходить 1.5 порції).'
		},
		groceryItems: [
			{ name: 'Свіжа кінза', amount: '1 пучок', category: 'produce', baseQty: 0.38, unit: 'пуч.', scalable: true },
			{ name: 'Свіжий часник', amount: '1 головка', category: 'produce', scalable: false },
			{ name: 'Лаваш або свіжий хліб', amount: '1 шт', category: 'bakery', baseQty: 0.38, unit: 'шт', scalable: true }
		],
		description: 'Насичений суп-концентрат із яловичиною, рисом, томатами та спеціями.',
		imageEmoji: '',
		tags: ['soup', 'meat', 'gourmet', 'hot']
	},

	// ==================== ВЕЧЕРІ ====================
	{
		id: 'pelmeni-classic',
		name: 'Пельмені зі свининою та яловичиною',
		category: 'dinner',
		availableMeals: ['lunch', 'dinner'],
		prepTimeMinutes: 10,
		calories: 420,
		servings: 2,
		isGalyaProduct: true,
		galyaProduct: {
			name: 'Пельмені зі свининою та яловичиною',
			category: 'Пельмені',
			weightText: 'упаковка 800 г',
			priceUah: 195,
			badge: 'Бестселер №1',
			cookingTimeMinutes: 6,
			cookingMethod: 'Опустити у підсолений окріп з лавровим листом. Варити 5-6 хвилин після спливання.'
		},
		groceryItems: [
			{ name: 'Вершкове масло 82%', amount: '50 г', category: 'dairy', baseQty: 50, unit: 'г', scalable: true },
			{ name: 'Сметана 20%', amount: '120 г', category: 'dairy', baseQty: 120, unit: 'г', scalable: true },
			{ name: 'Лавровий лист та чорний перець горошком', amount: '1 уп', category: 'grocery', scalable: false },
			{ name: 'Свіжа зелень (кріп, петрушка)', amount: '1 пучок', category: 'produce', baseQty: 0.5, unit: 'пуч.', scalable: true }
		],
		description: 'Класичні пельмені ручної ліпки з тонкого тіста та фаршу зі свинини й яловичини.',
		imageEmoji: '',
		tags: ['quick', 'meat', 'classic', 'bestseller']
	},
	{
		id: 'pelmeni-turkey-kids',
		name: 'Пельмені з індиком',
		category: 'dinner',
		availableMeals: ['lunch', 'dinner'],
		prepTimeMinutes: 8,
		calories: 320,
		servings: 2,
		isGalyaProduct: true,
		galyaProduct: {
			name: 'Пельмені з індиком',
			category: 'Пельмені',
			weightText: 'упаковка 600 г',
			priceUah: 175,
			badge: 'Дитяче меню',
			cookingTimeMinutes: 5,
			cookingMethod: 'Варити у слабокиплячій підсоленій воді рівно 5 хвилин після спливання.'
		},
		groceryItems: [
			{ name: 'Вершкове масло 82%', amount: '30 г', category: 'dairy', baseQty: 30, unit: 'г', scalable: true },
			{ name: 'Сметанка дитяча або йогурт', amount: '200 г', category: 'dairy', baseQty: 200, unit: 'г', scalable: true }
		],
		description: 'Дієтичні пельмені з філе індички без зайвих спецій у тонкому тісті.',
		imageEmoji: '',
		tags: ['kids', 'diet', 'quick']
	},
	{
		id: 'varenyky-potato-mushrooms',
		name: 'Вареники з картоплею та грибами',
		category: 'dinner',
		availableMeals: ['lunch', 'dinner'],
		prepTimeMinutes: 12,
		calories: 350,
		servings: 2,
		isGalyaProduct: true,
		galyaProduct: {
			name: 'Вареники з картоплею та грибами',
			category: 'Вареники',
			weightText: 'упаковка 800 г',
			priceUah: 145,
			badge: 'Ручна ліпка',
			cookingTimeMinutes: 6,
			cookingMethod: 'Варити у великій кількості підсоленого окропу 5-6 хвилин після виринання на поверхню.'
		},
		groceryItems: [
			{ name: 'Ріпчаста цибуля', amount: '2 шт', category: 'produce', baseQty: 2, unit: 'шт', scalable: true },
			{ name: 'Олія рослинна або бекон для засмажки', amount: '100 г', category: 'grocery', baseQty: 100, unit: 'г', scalable: true },
			{ name: 'Сметана 20%', amount: '120 г', category: 'dairy', baseQty: 120, unit: 'г', scalable: true }
		],
		description: 'Вареники ручної ліпки з картоплею та смаженими печерицями.',
		imageEmoji: '',
		tags: ['vegetarian', 'ukrainian', 'comfort']
	},
	{
		id: 'varenyky-sweet-cottage-cheese',
		name: 'Вареники з солодким сиром',
		category: 'dinner',
		availableMeals: ['breakfast', 'dinner'],
		prepTimeMinutes: 10,
		calories: 330,
		servings: 2,
		isGalyaProduct: true,
		galyaProduct: {
			name: 'Вареники з солодким сиром',
			category: 'Вареники',
			weightText: 'упаковка 800 г',
			priceUah: 165,
			badge: 'Ручна ліпка',
			cookingTimeMinutes: 6,
			cookingMethod: 'Варити 5 хвилин. Змастити теплим вершковим маслом і полити сметанкою.'
		},
		groceryItems: [
			{ name: 'Вершкове масло 82%', amount: '40 г', category: 'dairy', baseQty: 40, unit: 'г', scalable: true },
			{ name: 'Сметана 20%', amount: '150 г', category: 'dairy', baseQty: 150, unit: 'г', scalable: true },
			{ name: 'Ягідне варення або мед', amount: 'за смаком', category: 'grocery', scalable: false }
		],
		description: 'Вареники з солодкою сирною начинкою та легким ароматом ванілі.',
		imageEmoji: '',
		tags: ['sweet', 'kids', 'family']
	},
	{
		id: 'golubtsi-peasant',
		name: 'Голубці з м’ясом (свіжа капуста)',
		category: 'dinner',
		availableMeals: ['lunch', 'dinner'],
		prepTimeMinutes: 30,
		calories: 390,
		servings: 3,
		isGalyaProduct: true,
		galyaProduct: {
			name: 'Голубці з м’ясом (свіжа капуста)',
			category: 'Голубці',
			weightText: 'упаковка 900 г',
			priceUah: 195,
			badge: 'Ручна праця',
			cookingTimeMinutes: 35,
			cookingMethod: 'Скласти у каструлю чи сотейник, додати готову засмажку зі сметаною і томатом та тушкувати 35 хв на повільному вогні.'
		},
		extraGalyaProducts: [
			{
				product: {
					name: 'Готова засмажка',
					category: 'Готові страви',
					weightText: 'упаковка 250 г',
					priceUah: 55,
					badge: 'До підливи',
					cookingTimeMinutes: 0,
					cookingMethod: 'Додати готову засмажку під час тушкування голубців замість самостійного обсмажування моркви та цибулі.'
				},
				servingsPerPack: 3
			}
		],
		groceryItems: [
			{ name: 'Томатна паста якісна', amount: '2 ст. л.', category: 'sauces', scalable: false },
			{ name: 'Сметана 20%', amount: '150 г', category: 'dairy', baseQty: 150, unit: 'г', scalable: true },
			{ name: 'Свіжий кріп', amount: '1 пучок', category: 'produce', baseQty: 0.5, unit: 'пуч.', scalable: true }
		],
		description: 'Акуратні голубці зі свіжого листя капусти з м’ясним фаршем та рисом.',
		imageEmoji: '',
		tags: ['family', 'hearty', 'meat']
	},
	{
		id: 'kotlety-kyiv',
		name: 'Котлета по-київськи',
		category: 'dinner',
		availableMeals: ['dinner'],
		prepTimeMinutes: 20,
		calories: 490,
		servings: 2,
		isGalyaProduct: true,
		galyaProduct: {
			name: 'Котлета по-київськи',
			category: 'Котлети',
			weightText: 'упаковка 600 г (4 шт)',
			priceUah: 185,
			badge: 'Ресторанний хіт',
			cookingTimeMinutes: 18,
			cookingMethod: 'Обсмажити у фритюрі чи на сковороді до золотистості, довести у духовці при 180°C 12-14 хв.'
		},
		groceryItems: [
			{ name: 'Картопля для пюре', amount: '800 г', category: 'produce', baseQty: 800, unit: 'г', scalable: true },
			{ name: 'Молоко 2.5%', amount: '150 мл', category: 'dairy', baseQty: 150, unit: 'мл', scalable: true },
			{ name: 'Вершкове масло 82%', amount: '50 г', category: 'dairy', baseQty: 50, unit: 'г', scalable: true },
			{ name: 'Свіжі огірки та чері', amount: '300 г', category: 'produce', baseQty: 300, unit: 'г', scalable: true }
		],
		description: 'Хрустка паніровка, куряче філе і вершкове масло із зеленню всередині.',
		imageEmoji: '',
		tags: ['meat', 'gourmet', 'restaurant']
	},
	{
		id: 'tefteli-beshamel',
		name: 'Тефтельки курячі в соусі Бешамель',
		category: 'dinner',
		availableMeals: ['lunch', 'dinner'],
		prepTimeMinutes: 15,
		calories: 360,
		servings: 2,
		isGalyaProduct: true,
		galyaProduct: {
			name: 'Тефтельки курячі в соусі Бешамель',
			category: 'Тефтелі та фрикадельки',
			weightText: 'контейнер 600 г',
			priceUah: 165,
			badge: 'Готова кулінарія',
			cookingTimeMinutes: 10,
			cookingMethod: 'Розігріти на сковороді під кришкою або запекти 10 хв до появи апетитної скоринки.'
		},
		groceryItems: [
			{ name: 'Молода картопля або макарони твердих сортів', amount: '400 г', category: 'produce', baseQty: 400, unit: 'г', scalable: true },
			{ name: 'Свіжий огірок', amount: '2 шт', category: 'produce', baseQty: 2, unit: 'шт', scalable: true },
			{ name: 'Свіжа зелень (кріп, петрушка)', amount: '1 пучок', category: 'produce', baseQty: 0.5, unit: 'пуч.', scalable: true }
		],
		description: 'Курячі тефтельки у вершковому соусі Бешамель.',
		imageEmoji: '',
		tags: ['kids', 'quick', 'meat', 'gourmet']
	},
	{
		id: 'khinkali-georgian',
		name: 'Хінкалі з м’ясом',
		category: 'dinner',
		availableMeals: ['dinner'],
		prepTimeMinutes: 15,
		calories: 450,
		servings: 2,
		isGalyaProduct: true,
		galyaProduct: {
			name: 'Хінкалі з м’ясом',
			category: 'Хінкалі',
			weightText: 'упаковка 500 г',
			priceUah: 185,
			badge: 'Кавказькі традиції',
			cookingTimeMinutes: 10,
			cookingMethod: 'Закрутити вир у киплячій воді, варити по одній 9-11 хвилин. Подавати з грубо меленим перцем.'
		},
		groceryItems: [
			{ name: 'Чорний перець крупного помелу', amount: '1 млинок', category: 'sauces', scalable: false },
			{ name: 'Свіжа кінза', amount: '1 пучок', category: 'produce', baseQty: 0.5, unit: 'пуч.', scalable: true },
			{ name: 'Соус Сацебелі або Ткемалі', amount: '1 пляшечка', category: 'sauces', scalable: false }
		],
		description: 'Хінкалі з м’ясним фаршем та ароматним пряним бульйоном усередині.',
		imageEmoji: '',
		tags: ['meat', 'gourmet', 'hot']
	},
	{
		id: 'pizza-four-cheese',
		name: 'Піца 4 сири 25 см',
		category: 'dinner',
		availableMeals: ['dinner'],
		prepTimeMinutes: 4,
		calories: 520,
		servings: 2,
		isGalyaProduct: true,
		galyaProduct: {
			name: 'Піца 4 сири 25 см',
			category: 'Готові страви',
			weightText: '1 шт (420 г)',
			priceUah: 210,
			badge: 'Готова страва',
			cookingTimeMinutes: 4,
			cookingMethod: 'Готова піца з печі — достатньо лише розігріти 3–5 хв у духовці, на сковороді під кришкою або в мікрохвильовці.'
		},
		groceryItems: [],
		description: 'Готова піца з чотирьох видів сиру — достатньо лише розігріти.',
		imageEmoji: '',
		tags: ['quick', 'cheese', 'gourmet']
	},
	{
		id: 'lasagna-bolognese',
		name: 'Лазанья з яловичиною',
		category: 'dinner',
		availableMeals: ['dinner'],
		prepTimeMinutes: 20,
		calories: 480,
		servings: 2,
		isGalyaProduct: true,
		galyaProduct: {
			name: 'Лазанья з яловичиною',
			category: 'Лазанья, печеня',
			weightText: 'форма 600 г',
			priceUah: 185,
			badge: 'Італійська лінія',
			cookingTimeMinutes: 18,
			cookingMethod: 'Запікати прямо у термостійкій формі при 180°C 15-20 хвилин до рум’яної сирної скоринки.'
		},
		groceryItems: [
			{ name: 'Томати чері на гілочці', amount: '250 г', category: 'produce', baseQty: 250, unit: 'г', scalable: true },
			{ name: 'Базилік зелений', amount: '1 гілочка', category: 'produce', scalable: false }
		],
		description: 'Листи пасти з яловичим рагу, томатним і вершковим соусами під сиром.',
		imageEmoji: '',
		tags: ['meat', 'gourmet', 'family']
	},
	{
		id: 'chebureki-crimean',
		name: 'Чебурек «Кримський»',
		category: 'dinner',
		availableMeals: ['dinner'],
		prepTimeMinutes: 10,
		calories: 410,
		servings: 2,
		isGalyaProduct: true,
		galyaProduct: {
			name: 'Чебурек «Кримський»',
			category: 'Чебуреки, біляші, пиріжки',
			weightText: 'упаковка 400 г (4 шт)',
			priceUah: 155,
			badge: 'Хрусткий хіт',
			cookingTimeMinutes: 8,
			cookingMethod: 'Смажити на розігрітій олії на помірному вогні по 3-4 хвилини з кожного боку до золотистих бульбашок.'
		},
		groceryItems: [
			{ name: 'Рослинна олія для смаження', amount: '100 мл', category: 'grocery', scalable: false },
			{ name: 'Айран або кефір 2.5%', amount: '1 пляшка', category: 'dairy', baseQty: 1, unit: 'пляшка', scalable: true },
			{ name: 'Свіжий огірок', amount: '2 шт', category: 'produce', baseQty: 2, unit: 'шт', scalable: true }
		],
		description: 'Хрустке тісто та м’ясна начинка із соковитим бульйоном усередині.',
		imageEmoji: '',
		tags: ['quick', 'meat', 'hot']
	},
	{
		id: 'pepper-stuffed-pork-beef',
		name: 'Перець фарширований зі свининою та яловичиною',
		category: 'dinner',
		availableMeals: ['lunch', 'dinner'],
		prepTimeMinutes: 25,
		calories: 360,
		servings: 2,
		isGalyaProduct: true,
		galyaProduct: {
			name: 'Перець фарширований зі свининою та яловичиною',
			category: 'Перець фарширований',
			weightText: 'упаковка 800 г',
			priceUah: 180,
			badge: 'Ручна ліпка',
			cookingTimeMinutes: 30,
			cookingMethod: 'Поставити вертикально у сотейник, залити томатно-овочевою підливою і тушкувати 30 хвилин.'
		},
		groceryItems: [
			{ name: 'Томатний сік або паста', amount: '300 мл', category: 'sauces', baseQty: 300, unit: 'мл', scalable: true },
			{ name: 'Сметана 20%', amount: '120 г', category: 'dairy', baseQty: 120, unit: 'г', scalable: true },
			{ name: 'Свіжа зелень (кріп, петрушка)', amount: '1 пучок', category: 'produce', baseQty: 0.5, unit: 'пуч.', scalable: true }
		],
		description: 'Болгарський перець з фаршем зі свинини й яловичини та рисом.',
		imageEmoji: '',
		tags: ['vegetable', 'meat', 'family']
	}
];

