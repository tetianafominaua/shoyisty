import type { ReadyMadeSet } from '#lib/types';

export const READY_MADE_SETS: ReadyMadeSet[] = [
	{
		id: 'family-comfort',
		title: 'Сімейний затишок',
		subtitle: 'Збалансовані ситні страви для дітей та дорослих на кожен день',
		description:
			'Традиційні улюблені страви української кухні: наваристий борщ, ніжні ванільні сирнички на сніданок, фірмові пельмені та млинці, від яких уся сім’я буде в захваті.',
		badge: 'Хіт для всієї сім’ї',
		emoji: '',
		accentColor: '#2D6A4F',
		gradient: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)',
		idealFor: 'Сім’ї з 2-4 людей, що цінують справжній домашній смак та час разом',
		totalDishesCount: 21,
		galyaDishesCount: 21,
		plan: {
			monday: {
				breakfast: 'syrnyky-vanilla',
				lunch: 'borscht-ukrainian',
				dinner: 'pelmeni-classic'
			},
			tuesday: {
				breakfast: 'mlyntsi-chicken-mushrooms',
				lunch: 'soup-pea-smoked',
				dinner: 'golubtsi-peasant'
			},
			wednesday: {
				breakfast: 'syrnyky-suluguni',
				lunch: 'solyanka-meat',
				dinner: 'varenyky-potato-mushrooms'
			},
			thursday: {
				breakfast: 'mlyntsi-cherry',
				lunch: 'soup-rabbit-meatballs',
				dinner: 'pepper-stuffed-pork-beef'
			},
			friday: {
				breakfast: 'syrnyky-vanilla',
				lunch: 'bogracs-transcarpathian',
				dinner: 'pelmeni-classic'
			},
			saturday: {
				breakfast: 'khachapuri-adjarian',
				lunch: 'borscht-ukrainian',
				dinner: 'kotlety-kyiv'
			},
			sunday: {
				breakfast: 'varenyky-sweet-cottage-cheese',
				lunch: 'solyanka-meat',
				dinner: 'tefteli-beshamel'
			}
		}
	},
	{
		id: 'express-busy',
		title: 'Експрес / Для зайнятих',
		subtitle: 'Повноцінна гаряча вечеря за 10–15 хвилин без стояння біля плити',
		description:
			'Для тих, у кого насичений графік. Жодної чистки овочів та довгого готування — страви вже зліплені вручну та готові до швидкого розігріву чи варіння за лічені хвилини.',
		badge: '10–15 хвилин',
		emoji: '',
		accentColor: '#D97706',
		gradient: 'linear-gradient(135deg, #B45309 0%, #D97706 100%)',
		idealFor: 'Зайняті професіонали, пари та студенти, які бережуть свій вільний вечір',
		totalDishesCount: 21,
		galyaDishesCount: 21,
		plan: {
			monday: {
				breakfast: 'mlyntsi-chicken-mushrooms',
				lunch: 'solyanka-meat',
				dinner: 'pelmeni-classic'
			},
			tuesday: {
				breakfast: 'syrnyky-vanilla',
				lunch: 'soup-pea-smoked',
				dinner: 'chebureki-crimean'
			},
			wednesday: {
				breakfast: 'mlyntsi-cherry',
				lunch: 'borscht-ukrainian',
				dinner: 'pizza-four-cheese'
			},
			thursday: {
				breakfast: 'syrnyky-suluguni',
				lunch: 'solyanka-meat',
				dinner: 'varenyky-potato-mushrooms'
			},
			friday: {
				breakfast: 'mlyntsi-chicken-mushrooms',
				lunch: 'bogracs-transcarpathian',
				dinner: 'chebureki-crimean'
			},
			saturday: {
				breakfast: 'khachapuri-adjarian',
				lunch: 'soup-pea-smoked',
				dinner: 'pelmeni-classic'
			},
			sunday: {
				breakfast: 'syrnyky-vanilla',
				lunch: 'borscht-ukrainian',
				dinner: 'pizza-four-cheese'
			}
		}
	},
	{
		id: 'kids-mom-care',
		title: 'Дитяче / Мамине меню',
		subtitle: 'Ніжне дієтичне м’ясо індички та кролика, натуральний сир та ягоди',
		description:
			'Створене з турботою про дитячі животики: без гострих спецій, без штучних консервантів, тільки якісний фермерський сир, дієтична індичка та прозорі супчики.',
		badge: 'Корисно дітям',
		emoji: '',
		accentColor: '#059669',
		gradient: 'linear-gradient(135deg, #065F46 0%, #059669 100%)',
		idealFor: 'Турботливі мами, які шукають безпечне, чисте та смачне дитяче харчування',
		totalDishesCount: 21,
		galyaDishesCount: 21,
		plan: {
			monday: {
				breakfast: 'syrnyky-vanilla',
				lunch: 'soup-rabbit-meatballs',
				dinner: 'pelmeni-turkey-kids'
			},
			tuesday: {
				breakfast: 'mlyntsi-cherry',
				lunch: 'soup-rabbit-meatballs',
				dinner: 'tefteli-beshamel'
			},
			wednesday: {
				breakfast: 'varenyky-sweet-cottage-cheese',
				lunch: 'soup-rabbit-meatballs',
				dinner: 'pelmeni-turkey-kids'
			},
			thursday: {
				breakfast: 'syrnyky-vanilla',
				lunch: 'borscht-ukrainian',
				dinner: 'tefteli-beshamel'
			},
			friday: {
				breakfast: 'mlyntsi-cherry',
				lunch: 'soup-rabbit-meatballs',
				dinner: 'pelmeni-turkey-kids'
			},
			saturday: {
				breakfast: 'syrnyky-vanilla',
				lunch: 'borscht-ukrainian',
				dinner: 'varenyky-sweet-cottage-cheese'
			},
			sunday: {
				breakfast: 'mlyntsi-chicken-mushrooms',
				lunch: 'soup-rabbit-meatballs',
				dinner: 'tefteli-beshamel'
			}
		}
	},
	{
		id: 'gourmet-weekend',
		title: 'Гурман / Гастро-вихідні',
		subtitle: 'Соковиті хінкалі, хачапурі з печі, лазанья, бограч та піца 4 сири',
		description:
			'Справжній гастрономічний тур не виходячи з дому! Ароматна випічка з печі м. Південне, насичений пряний бульйон у хінкалі та італійська лазанья з ніжним бешамелем.',
		badge: 'Ресторан вдома',
		emoji: '',
		accentColor: '#9333EA',
		gradient: 'linear-gradient(135deg, #581C87 0%, #7E22CE 100%)',
		idealFor: 'Поціновувачі яскравих смаків, дружні вечері та затишні сімейні вікенди',
		totalDishesCount: 21,
		galyaDishesCount: 21,
		plan: {
			monday: {
				breakfast: 'khachapuri-adjarian',
				lunch: 'solyanka-meat',
				dinner: 'khinkali-georgian'
			},
			tuesday: {
				breakfast: 'syrnyky-suluguni',
				lunch: 'bogracs-transcarpathian',
				dinner: 'lasagna-bolognese'
			},
			wednesday: {
				breakfast: 'mlyntsi-chicken-mushrooms',
				lunch: 'solyanka-meat',
				dinner: 'kotlety-kyiv'
			},
			thursday: {
				breakfast: 'syrnyky-suluguni',
				lunch: 'bogracs-transcarpathian',
				dinner: 'khinkali-georgian'
			},
			friday: {
				breakfast: 'khachapuri-adjarian',
				lunch: 'solyanka-meat',
				dinner: 'pizza-four-cheese'
			},
			saturday: {
				breakfast: 'syrnyky-vanilla',
				lunch: 'bogracs-transcarpathian',
				dinner: 'lasagna-bolognese'
			},
			sunday: {
				breakfast: 'khachapuri-adjarian',
				lunch: 'borscht-ukrainian',
				dinner: 'khinkali-georgian'
			}
		}
	}
];
