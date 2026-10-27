import type { Dish } from '#lib/types';

export const DISHES: Dish[] = [
	// ==================== СНІДАНКИ ====================
	{
		id: 'syrnyky-vanilla',
		name: 'Сирники ніжні ванільні зі сметаною та ягодами',
		category: 'breakfast',
		availableMeals: ['breakfast', 'dinner'],
		prepTimeMinutes: 12,
		calories: 340,
		servings: 2,
		isGalyaProduct: true,
		galyaProduct: {
			name: 'Сирники класичні ванільні (Галя Балувана)',
			category: 'Сирники',
			weightText: 'упаковка 600 г (6 шт)',
			priceUah: 165,
			badge: 'Ручна ліпка',
			cookingTimeMinutes: 10,
			cookingMethod: 'Обсмажити на вершковому маслі на помірному вогні по 4-5 хв з кожного боку до золотистої скоринки під кришкою.'
		},
		groceryItems: [
			{ name: 'Сметана 20%', amount: '1 банка (350 г)', category: 'dairy' },
			{ name: 'Вершкове масло 82%', amount: '50 г', category: 'dairy' },
			{ name: 'Свіжі ягоди (лохина чи малина)', amount: '150 г', category: 'produce' },
			{ name: 'Цукрова пудра або мед', amount: 'за смаком', category: 'grocery' }
		],
		description: 'Ніжна текстура з фермерського сиру з легким ванільним ароматом. Тримають форму та тануть у роті.',
		imageEmoji: '',
		tags: ['kids', 'sweet', 'classic', 'breakfast']
	},
	{
		id: 'syrnyky-suluguni',
		name: 'Солоні сирники з сулугуні та кропом',
		category: 'breakfast',
		availableMeals: ['breakfast', 'dinner'],
		prepTimeMinutes: 12,
		calories: 310,
		servings: 2,
		isGalyaProduct: true,
		galyaProduct: {
			name: 'Сирники з сулугуні та кропом (Галя Балувана)',
			category: 'Сирники',
			weightText: 'упаковка 600 г',
			priceUah: 175,
			badge: 'Хіт сезону',
			cookingTimeMinutes: 10,
			cookingMethod: 'Підсмажити на краплі олії на невеликому вогні, щоб сир сулугуні всередині апетитно розплавився.'
		},
		groceryItems: [
			{ name: 'Густий грецький йогурт або сметана', amount: '1 уп (300 г)', category: 'dairy' },
			{ name: 'Томати чері', amount: '200 г', category: 'produce' },
			{ name: 'Мікс салату', amount: '1 пучок', category: 'produce' }
		],
		description: 'Пікантний смак для тих, хто полюбляє ситні несолодкі сніданки з тягучим сиром сулугуні.',
		imageEmoji: '',
		tags: ['quick', 'cheese', 'breakfast']
	},
	{
		id: 'mlyntsi-chicken-mushrooms',
		name: 'Млинці з соковитою куркою та печерицями',
		category: 'breakfast',
		availableMeals: ['breakfast', 'lunch', 'dinner'],
		prepTimeMinutes: 10,
		calories: 380,
		servings: 2,
		isGalyaProduct: true,
		galyaProduct: {
			name: 'Млинці з куркою та грибами (Галя Балувана)',
			category: 'Млинці',
			weightText: 'упаковка 600 г (6 шт)',
			priceUah: 168,
			badge: 'Ручна ліпка',
			cookingTimeMinutes: 8,
			cookingMethod: 'Розігріти на сковороді з шматочком масла або запекти 10 хв у духовці під сиром.'
		},
		groceryItems: [
			{ name: 'Вершкове масло', amount: '30 г', category: 'dairy' },
			{ name: 'Свіжа зелень (петрушка, кріп)', amount: '1 пучок', category: 'produce' },
			{ name: 'Твердий сир (за бажанням підпекти)', amount: '100 г', category: 'dairy' }
		],
		description: 'Тонке мереживне тісто з щедрою начинкою з томленого курячого філе та обсмажених грибочків.',
		imageEmoji: '',
		tags: ['meat', 'filling', 'family']
	},
	{
		id: 'mlyntsi-cherry',
		name: 'Млинці з соковитою стиглою вишнею',
		category: 'breakfast',
		availableMeals: ['breakfast', 'dinner'],
		prepTimeMinutes: 8,
		calories: 290,
		servings: 2,
		isGalyaProduct: true,
		galyaProduct: {
			name: 'Млинці з вишнею (Галя Балувана)',
			category: 'Млинці',
			weightText: 'упаковка 600 г',
			priceUah: 155,
			badge: 'Улюблене дітьми',
			cookingTimeMinutes: 6,
			cookingMethod: 'Розігріти на сухій або змащеній вершковим маслом сковороді під кришкою 5-7 хв.'
		},
		groceryItems: [
			{ name: 'Сметана 15%', amount: '1 стакан (200 г)', category: 'dairy' },
			{ name: 'Свіжа м’ята для подачі', amount: 'гілочка', category: 'produce' }
		],
		description: 'Справжня вишня без кісточок у делікатному сиропі всередині найтонших фірмових млинців.',
		imageEmoji: '',
		tags: ['sweet', 'kids', 'berries']
	},
	{
		id: 'khachapuri-adjarian',
		name: 'Хачапурі по-аджарськи з яєчним жовтком та маслом',
		category: 'breakfast',
		availableMeals: ['breakfast', 'dinner'],
		prepTimeMinutes: 15,
		calories: 460,
		servings: 1,
		isGalyaProduct: true,
		galyaProduct: {
			name: 'Хачапурі по-аджарськи (виробництво з піччю)',
			category: 'Випічка',
			weightText: '1 шт (350 г)',
			priceUah: 130,
			badge: 'Справжня піч',
			cookingTimeMinutes: 12,
			cookingMethod: 'Випікати у розігрітій до 180°C духовці 10-12 хвилин, наприкінці додати сирий жовток та масло.'
		},
		groceryItems: [
			{ name: 'Яйця курячі відбірні', amount: '1 шт', category: 'dairy' },
			{ name: 'Вершкове масло 82%', amount: '20 г', category: 'dairy' }
		],
		description: 'Хрусткий пухкий човник з сумішшю сулугуні та імеретинського сиру з фірмової печі.',
		imageEmoji: '',
		tags: ['cheese', 'hot', 'gourmet']
	},

	// ==================== ОБІДИ ====================
	{
		id: 'borscht-ukrainian',
		name: 'Український борщ на м’ясному бульйоні зі сметаною та часником',
		category: 'lunch',
		availableMeals: ['lunch'],
		prepTimeMinutes: 10,
		calories: 280,
		servings: 2,
		isGalyaProduct: true,
		galyaProduct: {
			name: 'Борщ український з м’ясом (Галя Балувана)',
			category: 'Готові страви',
			weightText: 'контейнер 700 г',
			priceUah: 145,
			badge: 'Готова кулінарія',
			cookingTimeMinutes: 7,
			cookingMethod: 'Перелити у каструлю та довести до кипіння на помірному вогні або розігріти в мікрохвильовці 5 хв.'
		},
		groceryItems: [
			{ name: 'Сметана 20%', amount: '1 банка', category: 'dairy' },
			{ name: 'Свіжий часник', amount: '1 головка', category: 'produce' },
			{ name: 'Свіжа зелень (кріп, петрушка)', amount: '1 пучок', category: 'produce' },
			{ name: 'Бородинський або житній хліб / пампушки', amount: '1 буханка', category: 'bakery' },
			{ name: 'Сало з проріззю (за бажанням)', amount: '150 г', category: 'grocery' }
		],
		description: 'Насичений, наваристий борщ темно-рубінового кольору зі шматочками добірного м’яса та овочами.',
		imageEmoji: '',
		tags: ['soup', 'family', 'ukrainian', 'lunch']
	},
	{
		id: 'solyanka-meat',
		name: 'М’ясна збірна солянка з маслинами та лимоном',
		category: 'lunch',
		availableMeals: ['lunch'],
		prepTimeMinutes: 10,
		calories: 320,
		servings: 2,
		isGalyaProduct: true,
		galyaProduct: {
			name: 'Солянка м’ясна збірна (Галя Балувана)',
			category: 'Готові страви',
			weightText: 'контейнер 700 г',
			priceUah: 165,
			badge: 'Готова кулінарія',
			cookingTimeMinutes: 6,
			cookingMethod: 'Розігріти до закипання в каструльці, додати часточку свіжого лимона та маслини.'
		},
		groceryItems: [
			{ name: 'Лимон свіжий', amount: '1 шт', category: 'produce' },
			{ name: 'Маслини без кісточок', amount: '1 баночка', category: 'grocery' },
			{ name: 'Сметана 20%', amount: '1 банка', category: 'dairy' },
			{ name: 'Хрусткий багет', amount: '1 шт', category: 'bakery' }
		],
		description: 'Густа, запашна солянка з 4 видами м’яса та копченостей, солоненькими огірочками та каперсами.',
		imageEmoji: '',
		tags: ['soup', 'meat', 'gourmet', 'lunch']
	},
	{
		id: 'soup-rabbit-meatballs',
		name: 'Легкий прозорий супчик з ніжними фрикадельками з кролика',
		category: 'lunch',
		availableMeals: ['lunch'],
		prepTimeMinutes: 15,
		calories: 220,
		servings: 3,
		isGalyaProduct: true,
		galyaProduct: {
			name: 'Фрикадельки з кролика (Галя Балувана)',
			category: 'Тефтелі та фрикадельки',
			weightText: 'упаковка 500 г',
			priceUah: 210,
			badge: 'Дієтичне / Дитяче',
			cookingTimeMinutes: 10,
			cookingMethod: 'Опустити заморожені фрикадельки у киплячий овочевий бульйон і варити 10-12 хвилин.'
		},
		groceryItems: [
			{ name: 'Картопля молода', amount: '3-4 шт', category: 'produce' },
			{ name: 'Морква свіжа', amount: '1 шт', category: 'produce' },
			{ name: 'Дрібна вермішель-павутинка', amount: '70 г', category: 'grocery' },
			{ name: 'Свіжий кріп', amount: '1 пучок', category: 'produce' }
		],
		description: 'Ідеальний легкий суп для малечі та дорослих. Гіпоалергенне дієтичне м’ясо кролика.',
		imageEmoji: '',
		tags: ['kids', 'diet', 'soup', 'family']
	},
	{
		id: 'soup-pea-smoked',
		name: 'Гороховий суп-пюре з копченостями та сухариками',
		category: 'lunch',
		availableMeals: ['lunch'],
		prepTimeMinutes: 8,
		calories: 310,
		servings: 2,
		isGalyaProduct: true,
		galyaProduct: {
			name: 'Суп гороховий з копченостями (Галя Балувана)',
			category: 'Готові страви',
			weightText: 'контейнер 700 г',
			priceUah: 135,
			badge: 'Готова кулінарія',
			cookingTimeMinutes: 6,
			cookingMethod: 'Розігріти у сотейнику до гарячого стану, посипати хрусткими часниковими грінками.'
		},
		groceryItems: [
			{ name: 'Хрусткі пшеничні сухарики або грінки', amount: '1 пачка', category: 'bakery' },
			{ name: 'Свіжа зелена цибулька', amount: '1 пучок', category: 'produce' }
		],
		description: 'Оксамитовий гороховий суп з глибоким ароматом якісних копчених реберець.',
		imageEmoji: '',
		tags: ['quick', 'soup', 'comfort']
	},
	{
		id: 'bogracs-transcarpathian',
		name: 'Закарпатський бограч з яловичиною та паприкою',
		category: 'lunch',
		availableMeals: ['lunch'],
		prepTimeMinutes: 10,
		calories: 360,
		servings: 2,
		isGalyaProduct: true,
		galyaProduct: {
			name: 'Бограч м’ясний (Галя Балувана)',
			category: 'Готові страви',
			weightText: 'контейнер 700 г',
			priceUah: 155,
			badge: 'Готова кулінарія',
			cookingTimeMinutes: 7,
			cookingMethod: 'Розігріти на середньому вогні, подавати гарячим з шматочком свіжого хліба.'
		},
		groceryItems: [
			{ name: 'Хліб свіжоспечений', amount: '1 буханка', category: 'bakery' },
			{ name: 'Свіжий перець чілі (за бажанням)', amount: '1 шт', category: 'produce' }
		],
		description: 'Справжній гуляшний суп: томлене м’ясо, ароматна угорська солодка паприка та картопелька.',
		imageEmoji: '',
		tags: ['meat', 'gourmet', 'hearty']
	},

	// ==================== ВЕЧЕРІ ====================
	{
		id: 'pelmeni-classic',
		name: 'Фірмові пельмені зі свининою та яловичиною у вершковому маслі',
		category: 'dinner',
		availableMeals: ['lunch', 'dinner'],
		prepTimeMinutes: 10,
		calories: 420,
		servings: 2,
		isGalyaProduct: true,
		galyaProduct: {
			name: 'Пельмені класичні ручної ліпки (Галя Балувана)',
			category: 'Пельмені',
			weightText: 'упаковка 800 г',
			priceUah: 195,
			badge: 'Бестселер №1',
			cookingTimeMinutes: 6,
			cookingMethod: 'Опустити у підсолений окріп з лавровим листом. Варити 5-6 хвилин після спливання.'
		},
		groceryItems: [
			{ name: 'Вершкове масло 82%', amount: '50 г', category: 'dairy' },
			{ name: 'Сметана 20%', amount: '1 банка', category: 'dairy' },
			{ name: 'Лавровий лист та чорний перець горошком', amount: '1 уп', category: 'grocery' },
			{ name: 'Свіжа зелень кропу', amount: '1 пучок', category: 'produce' }
		],
		description: 'Золоте співвідношення 70% свіжого фермерського фаршу та 30% тонкого пружного тіста ручної ліпки.',
		imageEmoji: '',
		tags: ['quick', 'meat', 'classic', 'bestseller']
	},
	{
		id: 'pelmeni-turkey-kids',
		name: 'Ніжні пельмені з індичкою (Дитячі / Дієтичні)',
		category: 'dinner',
		availableMeals: ['lunch', 'dinner'],
		prepTimeMinutes: 8,
		calories: 320,
		servings: 2,
		isGalyaProduct: true,
		galyaProduct: {
			name: 'Пельмені з індичкою дитячі (Галя Балувана)',
			category: 'Пельмені',
			weightText: 'упаковка 600 г',
			priceUah: 175,
			badge: 'Дитяче меню',
			cookingTimeMinutes: 5,
			cookingMethod: 'Варити у слабокиплячій підсоленій воді рівно 5 хвилин після спливання.'
		},
		groceryItems: [
			{ name: 'Масло солодковершкове', amount: '30 г', category: 'dairy' },
			{ name: 'Сметанка дитяча або йогурт', amount: '200 г', category: 'dairy' }
		],
		description: 'Тільки дієтичне філе індички без зайвих спецій, ніжне тонке тісто, яке не розварюється.',
		imageEmoji: '',
		tags: ['kids', 'diet', 'quick']
	},
	{
		id: 'varenyky-potato-mushrooms',
		name: 'Вареники з картоплею та лісовими грибами зі шкварками та цибулькою',
		category: 'dinner',
		availableMeals: ['lunch', 'dinner'],
		prepTimeMinutes: 12,
		calories: 350,
		servings: 2,
		isGalyaProduct: true,
		galyaProduct: {
			name: 'Вареники з картоплею та печерицями (Галя Балувана)',
			category: 'Вареники',
			weightText: 'упаковка 800 г',
			priceUah: 145,
			badge: 'Ручна ліпка',
			cookingTimeMinutes: 6,
			cookingMethod: 'Варити у великій кількості підсоленого окропу 5-6 хвилин після виринання на поверхню.'
		},
		groceryItems: [
			{ name: 'Ріпчаста цибуля', amount: '2 шт', category: 'produce' },
			{ name: 'Олія рослинна або бекон для засмажки', amount: '100 г', category: 'grocery' },
			{ name: 'Сметана 20%', amount: '1 банка', category: 'dairy' }
		],
		description: 'Пишні, оксамитові всередині варенички ручної ліпки зі справжньою ароматною засмажкою.',
		imageEmoji: '',
		tags: ['vegetarian', 'ukrainian', 'comfort']
	},
	{
		id: 'varenyky-sweet-cottage-cheese',
		name: 'Вареники з ніжним домашнім солодким сиром та родзинками',
		category: 'dinner',
		availableMeals: ['breakfast', 'dinner'],
		prepTimeMinutes: 10,
		calories: 330,
		servings: 2,
		isGalyaProduct: true,
		galyaProduct: {
			name: 'Вареники з солодким сиром (Галя Балувана)',
			category: 'Вареники',
			weightText: 'упаковка 800 г',
			priceUah: 165,
			badge: 'Ручна ліпка',
			cookingTimeMinutes: 6,
			cookingMethod: 'Варити 5 хвилин. Змастити теплим вершковим маслом і полити сметанкою.'
		},
		groceryItems: [
			{ name: 'Вершкове масло', amount: '40 г', category: 'dairy' },
			{ name: 'Сметана 20%', amount: '1 банка', category: 'dairy' },
			{ name: 'Ягідне варення або мед', amount: 'за смаком', category: 'grocery' }
		],
		description: 'Багато солодкої сирної начинки з крупинками справжнього сиру та ваніллю.',
		imageEmoji: '',
		tags: ['sweet', 'kids', 'family']
	},
	{
		id: 'golubtsi-peasant',
		name: 'Ніжні голубці по-домашньому у сметанно-томатному соусі',
		category: 'dinner',
		availableMeals: ['lunch', 'dinner'],
		prepTimeMinutes: 30,
		calories: 390,
		servings: 3,
		isGalyaProduct: true,
		galyaProduct: {
			name: 'Голубці з м’ясом свинини та яловичини (Галя Балувана)',
			category: 'Голубці',
			weightText: 'упаковка 900 г',
			priceUah: 195,
			badge: 'Ручна праця',
			cookingTimeMinutes: 35,
			cookingMethod: 'Скласти у каструлю чи сотейник, залити томатно-сметанним соусом і тушкувати 35 хв на повільному вогні.'
		},
		groceryItems: [
			{ name: 'Томатна паста якісна', amount: '2 ст. л.', category: 'sauces' },
			{ name: 'Сметана 20%', amount: '1 банка (350 г)', category: 'dairy' },
			{ name: 'Морква та цибуля для підливи', amount: 'по 1 шт', category: 'produce' },
			{ name: 'Свіжий кріп', amount: '1 пучок', category: 'produce' }
		],
		description: 'Акуратні невеличкі голубці з м’яким листям молодої капусти, де багато соковитого м’яса і мінімум рису.',
		imageEmoji: '',
		tags: ['family', 'hearty', 'meat']
	},
	{
		id: 'kotlety-kyiv',
		name: 'Котлета по-київськи з картопляним пюре та свіжими томатами',
		category: 'dinner',
		availableMeals: ['dinner'],
		prepTimeMinutes: 20,
		calories: 490,
		servings: 2,
		isGalyaProduct: true,
		galyaProduct: {
			name: 'Котлети по-київськи з маслом та кропом (Галя Балувана)',
			category: 'Котлети',
			weightText: 'упаковка 500 г (4 шт)',
			priceUah: 185,
			badge: 'Ресторанний хіт',
			cookingTimeMinutes: 18,
			cookingMethod: 'Обсмажити у фритюрі чи на сковороді до золотистості, довести у духовці при 180°C 12-14 хв.'
		},
		groceryItems: [
			{ name: 'Картопля для пюре', amount: '800 г', category: 'produce' },
			{ name: 'Молоко 2.5%', amount: '150 мл', category: 'dairy' },
			{ name: 'Вершкове масло', amount: '50 г', category: 'dairy' },
			{ name: 'Свіжі огірки та чері', amount: '300 г', category: 'produce' }
		],
		description: 'Хрустка паніровка, цільне куряче філе і запашне вершкове масло з кропом, що витікає при розрізанні.',
		imageEmoji: '',
		tags: ['meat', 'gourmet', 'restaurant']
	},
	{
		id: 'tefteli-beshamel',
		name: 'Тефтельки курячі у ніжному соусі Бешамель з молодою картоплею',
		category: 'dinner',
		availableMeals: ['lunch', 'dinner'],
		prepTimeMinutes: 15,
		calories: 360,
		servings: 2,
		isGalyaProduct: true,
		galyaProduct: {
			name: 'Тефтельки курячі в соусі Бешамель (Галя Балувана)',
			category: 'Готові страви',
			weightText: 'контейнер 600 г',
			priceUah: 165,
			badge: 'Готова кулінарія',
			cookingTimeMinutes: 10,
			cookingMethod: 'Розігріти на сковороді під кришкою або запекти 10 хв до появи апетитної скоринки.'
		},
		groceryItems: [
			{ name: 'Молода картопля або макарони твердих сортів', amount: '400 г', category: 'produce' },
			{ name: 'Свіжий огірочок', amount: '2 шт', category: 'produce' },
			{ name: 'Зелень петрушки', amount: '1 пучок', category: 'produce' }
		],
		description: 'Ніжні дієтичні кульки з соковитого курячого м’яса в оксамитовому вершковому французькому соусі.',
		imageEmoji: '',
		tags: ['kids', 'quick', 'meat', 'gourmet']
	},
	{
		id: 'khinkali-georgian',
		name: 'Соковиті хінкалі з кінзою та яловичиною з чорним перцем',
		category: 'dinner',
		availableMeals: ['dinner'],
		prepTimeMinutes: 15,
		calories: 450,
		servings: 2,
		isGalyaProduct: true,
		galyaProduct: {
			name: 'Хінкалі з яловичиною та свининою (Галя Балувана)',
			category: 'Хінкалі',
			weightText: 'упаковка 800 г',
			priceUah: 185,
			badge: 'Кавказькі традиції',
			cookingTimeMinutes: 10,
			cookingMethod: 'Закрутити вир у киплячій воді, варити по одній 9-11 хвилин. Подавати з грубо меленим перцем.'
		},
		groceryItems: [
			{ name: 'Чорний перець крупного помелу', amount: '1 млинок', category: 'sauces' },
			{ name: 'Свіжа кінза', amount: '1 пучок', category: 'produce' },
			{ name: 'Соус Сацебелі або Ткемалі', amount: '1 пляшечка', category: 'sauces' }
		],
		description: 'Міцне тісто з акуратним «хвостиком» і море пряного духмяного бульйону всередині.',
		imageEmoji: '',
		tags: ['meat', 'gourmet', 'hot']
	},
	{
		id: 'pizza-four-cheese',
		name: 'Справжня піца «4 сири» з фірмової печі з травами',
		category: 'dinner',
		availableMeals: ['dinner'],
		prepTimeMinutes: 12,
		calories: 520,
		servings: 2,
		isGalyaProduct: true,
		galyaProduct: {
			name: 'Піца 4 сири (виробництво з піччю)',
			category: 'Піца',
			weightText: '1 шт (420 г)',
			priceUah: 175,
			badge: 'Справжня піч',
			cookingTimeMinutes: 10,
			cookingMethod: 'Поставити у розігріту до 200°C духовку на решітку на 8-10 хвилин доки сир закипить.'
		},
		groceryItems: [
			{ name: 'Рукола свіжа', amount: '1 уп (70 г)', category: 'produce' },
			{ name: 'Мед натуральний (для подачі)', amount: 'трохи', category: 'grocery' }
		],
		description: 'Тонкий бортик з пухирцями з кам’яної печі, моцарела, дор блю, пармезан та сулугуні.',
		imageEmoji: '',
		tags: ['quick', 'cheese', 'gourmet']
	},
	{
		id: 'lasagna-bolognese',
		name: 'Лазанья Болоньєзе з томатним рагу та соусом Морне',
		category: 'dinner',
		availableMeals: ['dinner'],
		prepTimeMinutes: 20,
		calories: 480,
		servings: 2,
		isGalyaProduct: true,
		galyaProduct: {
			name: 'Лазанья з м’ясним рагу Болоньєзе (Галя Балувана)',
			category: 'Лазанья',
			weightText: 'форма 600 г',
			priceUah: 185,
			badge: 'Італійська лінія',
			cookingTimeMinutes: 18,
			cookingMethod: 'Запікати прямо у термостійкій формі при 180°C 15-20 хвилин до рум’яної сирної скоринки.'
		},
		groceryItems: [
			{ name: 'Томати чері на гілочці', amount: '250 г', category: 'produce' },
			{ name: 'Базилік зелений', amount: '1 гілочка', category: 'produce' }
		],
		description: 'Листи пасти власного розкачування, багато томленої яловичини та ніжний вершковий соус.',
		imageEmoji: '',
		tags: ['meat', 'gourmet', 'family']
	},
	{
		id: 'chebureki-crimean',
		name: 'Кримські чебуреки з яловичиною та соковитим бульйоном',
		category: 'dinner',
		availableMeals: ['dinner'],
		prepTimeMinutes: 10,
		calories: 410,
		servings: 2,
		isGalyaProduct: true,
		galyaProduct: {
			name: 'Чебуреки з яловичиною (Галя Балувана)',
			category: 'Чебуреки',
			weightText: 'упаковка 500 г (4 шт)',
			priceUah: 155,
			badge: 'Хрусткий хіт',
			cookingTimeMinutes: 8,
			cookingMethod: 'Смажити на розігрітій олії на помірному вогні по 3-4 хвилини з кожного боку до золотистих бульбашок.'
		},
		groceryItems: [
			{ name: 'Рослинна олія для смаження', amount: '100 мл', category: 'grocery' },
			{ name: 'Айран або кефір 2.5%', amount: '1 пляшка', category: 'dairy' },
			{ name: 'Свіжий огірок', amount: '2 шт', category: 'produce' }
		],
		description: 'Пухирчасте хрустке тісто, що при першому укусі розкриває соковитий м’ясний сік.',
		imageEmoji: '',
		tags: ['quick', 'meat', 'hot']
	},
	{
		id: 'pepper-stuffed-pork-beef',
		name: 'Фарширований солодкий перець зі свининою та яловичиною',
		category: 'dinner',
		availableMeals: ['lunch', 'dinner'],
		prepTimeMinutes: 25,
		calories: 360,
		servings: 2,
		isGalyaProduct: true,
		galyaProduct: {
			name: 'Перець фарширований м’ясом (Галя Балувана)',
			category: 'Перець фарширований',
			weightText: 'упаковка 800 г',
			priceUah: 180,
			badge: 'Ручна ліпка',
			cookingTimeMinutes: 30,
			cookingMethod: 'Поставити вертикально у сотейник, залити томатно-овочевою підливою і тушкувати 30 хвилин.'
		},
		groceryItems: [
			{ name: 'Томатний сік або паста', amount: '300 мл', category: 'sauces' },
			{ name: 'Сметана 15%', amount: '1 банка', category: 'dairy' },
			{ name: 'Свіжа зелень', amount: '1 пучок', category: 'produce' }
		],
		description: 'Соковитий болгарський перець з ніжним м’ясним фаршем і рисом, просочений томатним ароматом.',
		imageEmoji: '',
		tags: ['vegetable', 'meat', 'family']
	}
];

